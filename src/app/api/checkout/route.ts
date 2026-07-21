import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { createPendingOrder } from "@/lib/backend/commerce";
import { getCustomerSession } from "@/lib/backend/session";
import { getStripeClient } from "@/lib/backend/payments";

const checkoutSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  city: z.string().min(1),
  addressLine: z.string().min(1),
  apartment: z.string().optional(),
  paymentMethod: z.string().min(1),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1),
});

export async function POST(request: NextRequest) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  try {
    const customerSession = await getCustomerSession(request);
    const order = await createPendingOrder({
      ...parsed.data,
      customerId: customerSession?.customerId,
      email: customerSession?.customer.email ?? parsed.data.email,
    });
    const stripe = getStripeClient();
    if (stripe && parsed.data.paymentMethod.toLowerCase().includes("card")) {
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
