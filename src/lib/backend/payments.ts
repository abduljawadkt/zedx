export async function createDemoCheckout() {
  return {
    id: "demo-checkout",
    status: "preview-only",
  };
}

type DemoStripeClient = {
  checkout: {
    sessions: {
      create: (input: unknown) => Promise<{ url: string | null }>;
    };
  };
  webhooks: {
    constructEvent: (body: string, signature: string, secret: string) => {
      type: string;
      data: {
        object: {
          metadata?: { orderNumber?: string };
          client_reference_id?: string | null;
        };
      };
    };
  };
};

export function getStripeClient(): DemoStripeClient | null {
  return null;
}
