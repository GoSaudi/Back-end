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
            filters: { phone },
          }
        );
        if (checkCustomer.length) throw new Error("Phone Number already exists");

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
          // Automatically confirm the user during creation
          await strapi.entityService.create("plugin::users-permissions.user", {
            data: {
              customer: customer.id,
              username: phone,
              email: email,
              phone,
              password,
              provider: "local",
              role: Number(process.env.STRAPI_ADMIN_CUSTOMER_ROLE),
              confirmed: true,
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
};

