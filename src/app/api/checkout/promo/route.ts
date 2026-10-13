import { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { getMedusaConfig, medusaFetch, medusaGetDefaultRegion, medusaGetProduct } from "@/lib/medusa";

const promoSchema = z.object({
  promoCode: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productSlug: z.string().optional(),
        variantId: z.string().optional(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

type PromoInput = z.infer<typeof promoSchema>;

type MedusaCartTotals = {
  cart: {
    id: string;
    subtotal?: number;
    discount_total?: number;
    total?: number;
    currency_code?: string;
    promotions?: Array<{ id: string; code?: string | null }>;
  };
};

async function resolveVariantId(item: PromoInput["items"][number]) {
  if (item.variantId) return item.variantId;
  if (!item.productSlug) return null;
  const product = (await medusaGetProduct(item.productSlug)).product;
  return product?.variants?.[0]?.id ?? null;
}

// Validates a promo code against a throwaway cart built from the current items
// and returns the resulting discount. The cart is never completed, so the
// coupon is not consumed — this is a preview only.
export async function POST(request: NextRequest) {
  const parsed = promoSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  if (!getMedusaConfig()) {
    return errorResponse("Promo codes require the Medusa backend.", 400);
  }

  const code = parsed.data.promoCode.trim();

  try {
    const region = await medusaGetDefaultRegion();
    if (!region?.id) return errorResponse("Store region is not configured.", 400);

    const { cart } = await medusaFetch<{ cart: { id: string } }>("/store/carts", {
      method: "POST",
      body: JSON.stringify({ region_id: region.id }),
    });

    for (const item of parsed.data.items) {
      const variantId = await resolveVariantId(item);
      if (!variantId) {
        return errorResponse(`Missing variant for product ${item.productSlug || item.productId}.`, 400);
      }
      await medusaFetch(`/store/carts/${cart.id}/line-items`, {
        method: "POST",
        body: JSON.stringify({ variant_id: variantId, quantity: item.quantity }),
      });
    }

    try {
      await medusaFetch(`/store/carts/${cart.id}/promotions`, {
        method: "POST",
        body: JSON.stringify({ promo_codes: [code] }),
      });
    } catch {
      return errorResponse(`"${code}" is not a valid promo code.`, 400);
    }

    const { cart: updated } = await medusaFetch<MedusaCartTotals>(
      `/store/carts/${cart.id}?fields=id,subtotal,discount_total,total,currency_code,*promotions`,
    );

    const appliedCode = updated.promotions?.find((promo) => promo.code)?.code ?? code;
    const discount = Math.round(updated.discount_total ?? 0);

    if (!updated.promotions?.length || discount <= 0) {
      return errorResponse(`"${code}" didn't apply any discount to your cart.`, 400);
    }

    return jsonResponse({
      code: appliedCode.toUpperCase(),
      subtotal: Math.round(updated.subtotal ?? 0),
      discount,
      total: Math.round(updated.total ?? 0),
      currency: updated.currency_code?.toUpperCase() ?? "AED",
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to validate promo code.", 400);
  }
}
