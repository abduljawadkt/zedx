import { products } from "@/data/products";

type CheckoutItem = { productId: string; quantity: number };
type OrderStatus = "pending" | "paid" | "processing" | "fulfilled" | "cancelled";

type DemoOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  addressLine: string;
  apartment: string | null;
  paymentMethod: string;
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  items: Array<{
    id: string;
    productId: string;
    productSlug: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
};

function randomOrderNumber() {
  return `ZX-DEMO-${Date.now().toString().slice(-6)}`;
}

export async function ensureInventorySeeded() {
  return { ok: true };
}

export async function createPendingOrder(input: {
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  addressLine: string;
  apartment?: string;
  paymentMethod: string;
  items: CheckoutItem[];
}): Promise<DemoOrder> {
  const items = input.items.map((item, index) => {
    const product = products.find((candidate) => candidate.id === item.productId) ?? products[index % products.length];

    return {
      id: `demo-order-item-${index}`,
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal > 300 ? Math.round(subtotal * 0.08) : 0;
  const shipping = subtotal > 0 && subtotal < 250 ? 18 : 0;

  return {
    id: "demo-order",
    orderNumber: randomOrderNumber(),
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    city: input.city,
    addressLine: input.addressLine,
    apartment: input.apartment ?? null,
    paymentMethod: input.paymentMethod,
    currency: "AED",
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    status: "pending",
    createdAt: new Date(),
    items,
  };
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus,
): Promise<Pick<DemoOrder, "id" | "orderNumber" | "status">> {
  return {
    id: "demo-order",
    orderNumber,
    status,
  };
}

export async function getOrderByNumber(orderNumber: string): Promise<DemoOrder | null> {
  const order = await createPendingOrder({
    customerName: "Preview Customer",
    email: "preview@zedx.local",
    phone: "+971 50 000 0000",
    city: "Dubai",
    addressLine: "Demo address",
    paymentMethod: "cash",
    items: products.slice(0, 1).map((product) => ({ productId: product.id, quantity: 1 })),
  });

  return {
    ...order,
    orderNumber,
  };
}

export async function getOrderSummary() {
  return {
    orders: 0,
    revenue: 0,
    lowStock: 0,
    pending: 0,
  };
}
