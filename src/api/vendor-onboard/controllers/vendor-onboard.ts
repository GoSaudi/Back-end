import jwt from "jsonwebtoken";

export default {
  createUser: async (ctx, next) => {
    const requestBody = ctx.request.body;

    try {
      const decoded = jwt.verify(
        requestBody?.code,
        process.env.STRAPI_ADMIN_JWT_SECRET_KEY
      );
      if (
        decoded &&
        decoded?.id &&
        decoded?.email === requestBody?.email &&
        requestBody?.password &&
        decoded?.username
      ) {
        await strapi.entityService.create("plugin::users-permissions.user", {
          data: {
            username: decoded?.email,
            email: requestBody?.email,
            password: requestBody?.password,
            role: Number(process.env.STRAPI_ADMIN_VENDOR_ROLE) || 0,
            vendor: decoded?.id,
            confirmed: true,
            provider: "local",
          },
        });
        ctx.send({ message: "Done" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
