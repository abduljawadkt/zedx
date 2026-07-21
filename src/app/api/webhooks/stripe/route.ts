import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/backend/http";
import { getStripeClient } from "@/lib/backend/payments";
import { updateOrderStatus } from "@/lib/backend/commerce";

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) return errorResponse("Stripe is not configured.", 500);

  const signature = request.headers.get("stripe-signature");
  if (!signature) return errorResponse("Missing Stripe signature.", 400);

  let event: {
    type: string;
    data: {
      object: {
        metadata?: { orderNumber?: string };
        client_reference_id?: string | null;
      };
    };
  };
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Invalid Stripe webhook.", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderNumber = session.metadata?.orderNumber ?? session.client_reference_id;
    if (orderNumber) {
      await updateOrderStatus(orderNumber, "paid");
    }
  }

  return jsonResponse({ received: true });
}
