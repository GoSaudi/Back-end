import jwt from "jsonwebtoken";

export default {
  createUser: async (ctx, next) => {
    try {
      const requestBody = ctx.request.body;

      if (requestBody) {
        const { name, email, phone, password } = requestBody;

        const checkCustomer = await strapi.entityService.findMany(
          "api::customer.customer",
          {
            filters: { email },
          }
        );
        if (checkCustomer.length) throw new Error("email already exists");

        const customer = await strapi.entityService.create(
          "api::customer.customer",
          {
            data: {
              name,
              email,
              phone,
            },
          }
        );

        if (customer) {
          await strapi.entityService.create("plugin::users-permissions.user", {
            data: {
              customer: customer.id,
              username: email,
              email: email,
              phone,
              password,
              provider: "local",
              role: Number(process.env.STRAPI_ADMIN_CUSTOMER_ROLE),
            },
          });
          return ctx.send("Done");
        }
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      ctx.badRequest(error.message);
    }
  },

  confirmUser: async (ctx, next) => {
    try {
      const requestBody = ctx.request.body;

      if (requestBody) {
        const { email } = requestBody;
        const decoded = jwt.verify(
          requestBody?.code,
          process.env.STRAPI_ADMIN_JWT_SECRET_KEY
        );

        if (decoded?.email === email) {
          const checkCustomer = await strapi.entityService.findMany(
            "api::customer.customer",
            {
              filters: { email, user: { confirmed: false } },
              populate: { user: true },
            }
          );

          if (checkCustomer.length) {
            await strapi.entityService.update(
              "plugin::users-permissions.user",
              checkCustomer[0]?.user?.id,
              {
                data: {
                  confirmed: true,
                },
              }
            );
            return ctx.send({ message: "Done" });
          }
        }
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      ctx.badRequest(error.message);
    }
  },
};
