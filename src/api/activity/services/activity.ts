/**
 * activity service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::activity.activity", {
  findAvailability: async (
    activityId
  ): Promise<{
    response?: { booked: number; available: number };
    error?: Error;
  }> => {
    try {
      if (activityId) {
        const [{ total_booked, total_tickets }] = await strapi.db
          .connection("activities")
          .forUpdate()
          .select("total_booked", "total_tickets")
          .where("id", activityId);

        const available = total_tickets - total_booked;

        return {
          response: {
            booked: total_booked,
            available: available < 0 ? 0 : available,
          },
        };
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      return { error };
    }
  },
});
