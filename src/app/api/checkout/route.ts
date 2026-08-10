import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { createPendingOrder } from "@/lib/backend/commerce";
import { MEDUSA_CUSTOMER_TOKEN_COOKIE, getCustomerSession } from "@/lib/backend/session";
import { getStripeClient } from "@/lib/backend/payments";
import {
  getMedusaConfig,
  medusaCustomerAuthHeaders,
  medusaFetch,
  medusaGetDefaultRegion,
  medusaGetProduct,
} from "@/lib/medusa";

const checkoutSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  city: z.string().min(1),
  addressLine: z.string().min(1),
  apartment: z.string().optional(),
  paymentMethod: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    productSlug: z.string().optional(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive(),
  })).min(1),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

type MedusaCartResponse = {
  cart: {
    id: string;
    total?: number;
    subtotal?: number;
    discount_total?: number;
    shipping_total?: number;
    currency_code?: string;
  };
};

type MedusaShippingOptionResponse = {
  shipping_options?: Array<{
    id: string;
    name?: string;
  }>;
};

type MedusaPaymentCollectionResponse = {
  payment_collection?: {
    id: string;
  };
};

type MedusaPaymentProvidersResponse = {
  payment_providers?: Array<{
    id: string;
  }>;
};

type MedusaCompleteCartResponse = {
  type?: "order" | "cart";
  order?: {
    id: string;
    display_id?: number;
    status?: string;
    total?: number;
    currency_code?: string;
    items?: unknown[];
  };
  cart?: MedusaCartResponse["cart"];
  error?: {
    message?: string;
  };
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    first_name: parts[0] || name,
    last_name: parts.slice(1).join(" ") || "-",
  };
}

async function resolveVariantId(item: CheckoutInput["items"][number]) {
  if (item.variantId) return item.variantId;
  if (!item.productSlug) return null;

  const product = (await medusaGetProduct(item.productSlug)).product;
  return product?.variants?.[0]?.id ?? null;
}

async function createMedusaOrder(input: CheckoutInput, customerToken?: string) {
  const normalizedPaymentMethod = input.paymentMethod.toLowerCase();
  if (!normalizedPaymentMethod.includes("cash") && !normalizedPaymentMethod.includes("pickup")) {
    throw new Error("Only cash on delivery and store pickup are enabled until the payment gateway is ready.");
  }

  const region = await medusaGetDefaultRegion();
  if (!region?.id) {
    throw new Error("Medusa UAE region is not configured.");
  }

  const name = splitName(input.customerName);
  const address = {
    ...name,
    address_1: input.addressLine,
    address_2: input.apartment || "",
    city: input.city,
    country_code: "ae",
    phone: input.phone,
  };

  const { cart } = await medusaFetch<MedusaCartResponse>("/store/carts", {
    method: "POST",
    body: JSON.stringify({
      region_id: region.id,
      email: input.email,
      shipping_address: address,
      billing_address: address,
      metadata: {
        source: "zedx-frontend",
        customer_name: input.customerName,
        requested_payment_method: input.paymentMethod,
      },
    }),
  });

  if (customerToken) {
    await medusaFetch<MedusaCartResponse>(`/store/carts/${cart.id}/customer`, {
      method: "POST",
      headers: medusaCustomerAuthHeaders(customerToken),
      body: JSON.stringify({}),
    }).catch(() => undefined);
  }

  for (const item of input.items) {
    const variantId = await resolveVariantId(item);
    if (!variantId) {
      throw new Error(`Missing Medusa variant for product ${item.productSlug || item.productId}.`);
    }

    await medusaFetch<MedusaCartResponse>(`/store/carts/${cart.id}/line-items`, {
      method: "POST",
      body: JSON.stringify({
        variant_id: variantId,
        quantity: item.quantity,
      }),
    });
  }

  const shippingOptions = await medusaFetch<MedusaShippingOptionResponse>(
    `/store/shipping-options?cart_id=${cart.id}`,
  );
  const prefersPickup = input.paymentMethod.toLowerCase().includes("pickup");
  const shippingOption =
    shippingOptions.shipping_options?.find((option) =>
      prefersPickup
        ? option.name?.toLowerCase().includes("pickup")
        : option.name?.toLowerCase().includes("standard"),
    ) ?? shippingOptions.shipping_options?.[0];

  if (!shippingOption) {
    throw new Error("No Medusa shipping option is available for UAE.");
  }

  await medusaFetch<MedusaCartResponse>(`/store/carts/${cart.id}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({
      option_id: shippingOption.id,
    }),
  });

  const { payment_collection } = await medusaFetch<MedusaPaymentCollectionResponse>("/store/payment-collections", {
    method: "POST",
    body: JSON.stringify({
      cart_id: cart.id,
    }),
  });

  if (!payment_collection?.id) {
    throw new Error("Medusa payment collection was not created.");
  }

  const paymentProviders = await medusaFetch<MedusaPaymentProvidersResponse>(
    `/store/payment-providers?region_id=${region.id}`,
  );
  const paymentProvider = paymentProviders.payment_providers?.[0];
  if (!paymentProvider?.id) {
    throw new Error("No Medusa payment provider is configured for UAE.");
  }

  await medusaFetch<MedusaPaymentCollectionResponse>(
    `/store/payment-collections/${payment_collection.id}/payment-sessions`,
    {
      method: "POST",
      body: JSON.stringify({
        provider_id: paymentProvider.id,
      }),
    },
  );

  const completed = await medusaFetch<MedusaCompleteCartResponse>(`/store/carts/${cart.id}/complete`, {
    method: "POST",
  });

  if (completed.type !== "order" || !completed.order) {
    throw new Error(completed.error?.message ?? "Medusa did not complete the cart as an order.");
  }

  return completed.order;
}

export async function POST(request: NextRequest) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  try {
    if (getMedusaConfig()) {
      const medusaCustomerToken = request.cookies.get(MEDUSA_CUSTOMER_TOKEN_COOKIE)?.value;
      const order = await createMedusaOrder(parsed.data, medusaCustomerToken);
      return jsonResponse({
        orderNumber: order.display_id ? `MED-${order.display_id}` : order.id,
        status: order.status ?? "pending",
        total: order.total ?? 0,
        currency: order.currency_code?.toUpperCase() ?? "AED",
        items: order.items?.length ?? parsed.data.items.length,
        medusaOrderId: order.id,
      }, { status: 201 });
    }

    const stripe = getStripeClient();
    const requestsCardPayment = parsed.data.paymentMethod.toLowerCase().includes("card");
    if (requestsCardPayment && !stripe) {
      return errorResponse("Card payments are not configured yet. Please choose cash on delivery or store pickup.", 400);
    }

    const customerSession = await getCustomerSession(request);
    const order = await createPendingOrder({
      ...parsed.data,
      customerId: customerSession?.customerId,
      email: customerSession?.customer.email ?? parsed.data.email,
    });

    if (stripe && requestsCardPayment) {
      const successBase = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: order.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: order.currency.toLowerCase(),
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              images: [item.image.startsWith("http") ? item.image : `${successBase}${item.image}`],
            },
          },
        })),
        success_url: `${successBase}/checkout?session_id={CHECKOUT_SESSION_ID}&order=${order.orderNumber}`,
        cancel_url: `${successBase}/checkout?cancelled=1&order=${order.orderNumber}`,
        client_reference_id: order.orderNumber,
        metadata: {
          orderNumber: order.orderNumber,
        },
      });

      return jsonResponse({
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        currency: order.currency,
        items: order.items.length,
        checkoutUrl: session.url,
      }, { status: 201 });
    }

    return jsonResponse({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      currency: order.currency,
      items: order.items.length,
    }, { status: 201 });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create order.", 400);
  }
}
