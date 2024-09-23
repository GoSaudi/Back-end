/**
 * vendor controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::vendor.vendor", {
  async find(ctx) {
    ctx.send({});
  },
  async findOne(ctx) {
    ctx.send({});
  },
  async update(ctx) {
    const user = ctx.state.user;

    const userData = await strapi.entityService
      .findOne("plugin::users-permissions.user", user?.id, {
        fields: [],
        populate: {
          vendor: { fields: ["id"] },
        },
      })
      .catch((err) => ctx.badRequest(err.message));

    if (userData?.vendor?.id == ctx?.request?.params?.id) {
      return super.update(ctx);
    }
    return ctx.badRequest("Not own profile");
  },
});
