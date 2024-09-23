/**
 * activity router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::activity.activity", {
  config: {
    find: {
      middlewares: ["api::activity.ticket-availability"],
    },
  },
});
