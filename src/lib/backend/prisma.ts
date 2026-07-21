type AnyRecord = Record<string, unknown>;

function createModelProxy(modelName: string) {
  return new Proxy(
    {},
    {
      get(_target, property) {
        const method = String(property);

        if (method === "count") return async () => 0;
        if (method === "findMany") return async () => [];
        if (method === "findUnique" || method === "findFirst") return async () => null;
        if (method === "deleteMany" || method === "createMany") {
          return async () => ({ count: 0 });
        }
        if (method === "create" || method === "update" || method === "upsert") {
          return async (args?: { data?: AnyRecord; create?: AnyRecord; update?: AnyRecord }) => ({
            id: `${modelName}-demo`,
            ...(args?.data ?? args?.create ?? args?.update ?? {}),
          });
        }
        if (method === "delete") return async () => null;

        return async () => null;
      },
    },
  );
}

export const prisma = new Proxy(
  {},
  {
    get(_target, property) {
      if (property === "$transaction") {
        return async (callback: (tx: typeof prisma) => unknown) => callback(prisma);
      }

      return createModelProxy(String(property));
    },
  },
) as any;
