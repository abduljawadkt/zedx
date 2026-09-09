import crypto from "node:crypto";
import { prisma } from "@/lib/backend/prisma";
import { seedDatabaseIfNeeded } from "@/lib/backend/seed";

type CheckoutItem = { productId: string; quantity: number };
type OrderStatus = "pending" | "paid" | "processing" | "fulfilled" | "cancelled";

type OrderWithItems = {
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
  status: string;
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

function createOrderNumber() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `ZX-${date}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function normalizeItems(items: CheckoutItem[]) {
  const normalized = new Map<string, number>();

  for (const item of items) {
    const quantity = Math.min(Math.max(Math.trunc(item.quantity), 1), 99);
    normalized.set(item.productId, (normalized.get(item.productId) ?? 0) + quantity);
  }

  return Array.from(normalized, ([productId, quantity]) => ({ productId, quantity }));
}

function mapOrder(order: OrderWithItems) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    city: order.city,
    addressLine: order.addressLine,
    apartment: order.apartment,
    paymentMethod: order.paymentMethod,
    currency: order.currency,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    status: order.status as OrderStatus,
    createdAt: order.createdAt,
    items: order.items,
  };
}

async function reserveInventory(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  items: CheckoutItem[],
) {
  for (const item of items) {
    const inventory = await tx.inventoryItem.findUnique({
      where: { productId: item.productId },
    });
    const available = inventory ? inventory.quantity - inventory.reserved : 0;

    if (!inventory || available < item.quantity) {
      throw new Error(`Only ${Math.max(available, 0)} units are available for one or more cart items.`);
    }

    const update = await tx.inventoryItem.updateMany({
      where: {
        productId: item.productId,
        reserved: inventory.reserved,
        quantity: { gte: inventory.reserved + item.quantity },
      },
      data: {
        reserved: { increment: item.quantity },
      },
    });

    if (update.count !== 1) {
      throw new Error("Stock changed while placing the order. Please review your cart and try again.");
    }
  }
}

export async function ensureInventorySeeded() {
  await seedDatabaseIfNeeded();
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
}) {
  await seedDatabaseIfNeeded();

  const checkoutItems = normalizeItems(input.items);
  if (checkoutItems.length === 0) {
    throw new Error("Cart is empty.");
  }

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: { in: checkoutItems.map((item) => item.productId) },
        published: true,
        status: "published",
      },
    });
    const productById = new Map(products.map((product) => [product.id, product]));

    if (products.length !== checkoutItems.length) {
      throw new Error("One or more products are unavailable.");
    }

    const currency = products[0]?.currency ?? "AED";
    if (products.some((product) => product.currency !== currency)) {
      throw new Error("Mixed-currency carts are not supported.");
    }

    await reserveInventory(tx, checkoutItems);

    const orderItems = checkoutItems.map((item) => {
      const product = productById.get(item.productId);
      if (!product) throw new Error("Product not found.");

      return {
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal > 300 ? Math.round(subtotal * 0.08) : 0;
    const shipping = subtotal > 0 && subtotal < 250 ? 18 : 0;
    const total = subtotal - discount + shipping;

    const order = await tx.order.create({
      data: {
        orderNumber: createOrderNumber(),
        customerId: input.customerId,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        city: input.city,
        addressLine: input.addressLine,
        apartment: input.apartment || null,
        paymentMethod: input.paymentMethod,
        currency,
        subtotal,
        discount,
        shipping,
        total,
        status: "pending",
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    await tx.inventoryLog.createMany({
      data: checkoutItems.map((item) => ({
        productId: item.productId,
        orderId: order.id,
        action: "reserve",
        quantity: item.quantity,
        note: `Reserved for ${order.orderNumber}`,
      })),
    });

    return mapOrder(order);
  });
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus) {
  await seedDatabaseIfNeeded();

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    if (!order) throw new Error("Order not found.");
    if (order.status === status) {
      return { id: order.id, orderNumber: order.orderNumber, status: order.status as OrderStatus };
    }

    const previousStatus = order.status as OrderStatus;
    const wasReserved = ["pending", "paid", "processing"].includes(previousStatus);
    const isReserved = ["pending", "paid", "processing"].includes(status);

    if (wasReserved && status === "cancelled") {
      for (const item of order.items) {
        await tx.inventoryItem.updateMany({
          where: { productId: item.productId },
          data: { reserved: { decrement: item.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            orderId: order.id,
            action: "release",
            quantity: item.quantity,
            note: `Released reservation for ${order.orderNumber}`,
          },
        });
      }
    }

    if (wasReserved && status === "fulfilled") {
      for (const item of order.items) {
        await tx.inventoryItem.updateMany({
          where: { productId: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            reserved: { decrement: item.quantity },
          },
        });
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            orderId: order.id,
            action: "sell",
            quantity: item.quantity,
            note: `Fulfilled ${order.orderNumber}`,
          },
        });
      }
    }

    if (previousStatus === "cancelled" && isReserved) {
      await reserveInventory(tx, order.items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
      await tx.inventoryLog.createMany({
        data: order.items.map((item) => ({
          productId: item.productId,
          orderId: order.id,
          action: "reserve",
          quantity: item.quantity,
          note: `Re-reserved for ${order.orderNumber}`,
        })),
      });
    }

    const updated = await tx.order.update({
      where: { orderNumber },
      data: { status },
      select: { id: true, orderNumber: true, status: true },
    });

    return { ...updated, status: updated.status as OrderStatus };
  });
}

export async function getOrderByNumber(orderNumber: string) {
  await seedDatabaseIfNeeded();
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  return order ? mapOrder(order) : null;
}

export async function getOrderSummary() {
  await seedDatabaseIfNeeded();
  const [orders, revenue, pending, inventory] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["paid", "processing", "fulfilled"] } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.inventoryItem.findMany({
      select: { quantity: true, reserved: true, lowStockAt: true },
    }),
  ]);

  return {
    orders,
    revenue: revenue._sum.total ?? 0,
    lowStock: inventory.filter((item) => item.quantity - item.reserved <= item.lowStockAt).length,
    pending,
  };
}
