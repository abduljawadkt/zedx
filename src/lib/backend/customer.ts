type DemoCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export async function getCustomerProfile() {
  return null;
}

export async function getCustomerOrders() {
  return [];
}

export function safeCustomer(customer: DemoCustomer | null) {
  if (!customer) return null;

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
  };
}

export async function verifyCustomerLogin(
  _email: string,
  _password: string,
): Promise<DemoCustomer | null> {
  return null;
}

export async function createCustomerAccount(input: {
  name: string;
  email: string;
  phone?: string;
}) {
  return {
    id: "demo-customer",
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
  };
}
