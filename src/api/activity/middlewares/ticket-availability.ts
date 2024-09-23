/**
 * `ticket-availability` middleware
 */

import { Strapi } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    await next();

    const res = ctx?.response?.body;
    if (res?.data?.length) {
      for (const i in res.data) {
        const { response, error } = await strapi
          .service("api::activity.activity")
          .findAvailability(res.data[i]?.id);
        if (!error) {
          res.data[i].available = response?.available;
        }
      }
      ctx.response.body = res;
    }
  };
};
