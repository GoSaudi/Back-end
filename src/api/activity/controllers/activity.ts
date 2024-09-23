/**
 * activity controller
 */

import { factories } from "@strapi/strapi";
import getFormattedDate from "../../../helpers/getFormattedDate";

export default factories.createCoreController("api::activity.activity", {
  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        vendor: { blocked: false },
        date: { "$gt": getFormattedDate(new Date())}
      };
      return super.find(ctx);
    }

    const userData = await strapi.entityService
      .findOne("plugin::users-permissions.user", user?.id, {
        fields: [],
        populate: {
          vendor: { fields: ["id"] },
        },
      })
      .catch((err) => ctx.badRequest(err.message));

    if (!userData?.vendor) return ctx.badRequest("You are not a vendor");

    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      vendor: { id: userData.vendor?.id },
    };

    return super.find(ctx);
  },
  async findOne(ctx) {
    const activityId = ctx?.request?.params?.id;

    const { response, error } = await strapi
      .service("api::activity.activity")
      .findAvailability(activityId);

    if (error) ctx.badRequest(error);
    else ctx.send(response);
  },
});
