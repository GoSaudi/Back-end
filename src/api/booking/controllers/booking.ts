/**
 * booking controller
 */

import { factories } from "@strapi/strapi";
import bookingRequest from "../../../helpers/templates/bookingRequest";
import { sendEmail } from "../../../helpers/email";
import bookingRejected from "../../../helpers/templates/bookingRejected";
import bookingApproved from "../../../helpers/templates/bookingApproved";

const getEmailText = (status, ownBookings) => {
  if (status === "approved") {
    return bookingApproved({
      customerName: ownBookings[0].customer.name,
      activityName: ownBookings[0].activity.name,
      ticketCount: ownBookings[0].tickets,
      activityId: ownBookings[0].activity.id,
    });
  } else {
    return bookingRejected({
      customerName: ownBookings[0].customer.name,
      activityName: ownBookings[0].activity.name,
    });
  }
};

export default factories.createCoreController("api::booking.booking", {
  async find(ctx) {
    const user = ctx.state.user;
    const { activityId } = ctx?.query || {};

    const userData = await strapi.entityService
      .findOne("plugin::users-permissions.user", user?.id, {
        fields: [],
        populate: {
          customer: { fields: ["id"] },
          vendor: { fields: ["id"] },
        },
      })
      .catch((err) => ctx.badRequest(err.message));

    if (!(userData?.customer || userData?.vendor)) {
      return ctx.badRequest("You are not a logged in user");
    }

    if (userData?.customer) {
      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        customer: { id: userData?.customer?.id },
      };
    } else {
      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        activity: activityId
          ? { id: activityId, vendor: userData?.vendor?.id }
          : { vendor: userData?.vendor?.id },
      };
    }

    return super.find(ctx);
  },

  /* 
    In this Create Booking
    A booking is Created in with Payment Pending on Availabilty
    else Booking request is created

    Booking Confirmation takes place in the webhook Api post payment success
    */

  async create(ctx) {
    try {
      const body = ctx?.request?.body;
      const activityId = body?.data?.activity;
      const requestedTickets = body?.data?.tickets;
      const customerId = body?.data?.customer;
      const { response, error } = await strapi
        .service("api::activity.activity")
        .findAvailability(activityId);

      if (error) {
        throw new Error(error);
      }

      console.log("availble ==>", response.available);
      if (response.available >= requestedTickets) {
        // TODO: until changed in FE
        if (ctx?.request?.body?.data?.status === "confirmed") {
          ctx.request.body.data.status = "payment-pending";
        }
        return super.create(ctx);
      }

      // TODO:
      // DO we need this if the booking is approved we can accept the payment ?
      // Deleting it will make the vendor not have tracability of what he has approved

      /*/////
      const approvedPrebooking = await strapi.entityService.findMany(
        "api::booking.booking",
        {
          filters: {
            activity: activityId,
            tickets: requestedTickets,
            customer: customerId,
            status: "approved",
          },
          fields: ["id"],
        }
      );

      if (approvedPrebooking?.[0]?.id) {
        // TODO: Why Delete we can approve the same Booking itself
        await strapi.entityService.delete(
          "api::booking.booking",
          approvedPrebooking?.[0]?.id
        );
        if (ctx?.request?.body?.data?.status === "confirmed") {
          ctx.request.body.data.status = "payment-pending";
        }
        // TODO: until changed in FE
        if (ctx?.request?.body?.data?.status === "confirmed") {
          ctx.request.body.data.status = "payment-pending";
        }
        const { response, error } = await strapi
          .service("api::booking.booking")
          .createBooking(ctx);
        if (error) {
          throw new Error(error);
        } else {
          return ctx.send(response);
        }
      }

      ///////*/

      /* 
      TODO:
        Existing Request, 
        what if user changes ticket count and make a new request
      */
      const pendingPrebooking = await strapi.entityService.findMany(
        "api::booking.booking",
        {
          filters: {
            activity: activityId,
            // tickets: requestedTickets,
            customer: customerId,
            status: "pending",
          },
          fields: ["id"],
        }
      );

      if (pendingPrebooking?.[0]?.id) throw new Error("Already requested");

      /* 
      Create a New Request even if the requested Ticket count is different 
      what if the count all the three are repeated
      need a different logic to handle New Request, 2 + 2
     
      even if the number of tickets are same

       or if the logic is we cannot have same request for a customer , activity 
       then we can remove the tickets filter, 
       while there is 1 pending , we cannot create a new booking
      */
      const newRequest = await strapi.entityService.create(
        "api::booking.booking",
        {
          data: {
            status: "pending",
            tickets: requestedTickets,
            customer: customerId,
            activity: activityId,
          },
        }
      );

      if (newRequest) {
        const activityDetails = await strapi.entityService.findOne(
          "api::activity.activity",
          activityId,
          {
            populate: {
              vendor: { fields: ["name", "email"] },
            },
          }
        );
        if (activityDetails) {
          await sendEmail({
            to: activityDetails.vendor?.email,
            subject: `We Got It! A Booking Request For ${activityDetails.name}`,
            text: bookingRequest({
              vendorName: activityDetails.vendor?.name,
              ticketCount: requestedTickets,
              activityName: activityDetails.name,
              activityId,
            }),
          });
        }
        ctx.send("A new request has been created");
      }
    } catch (err) {
      ctx.badRequest(err);
    }
  },
  async update(ctx) {
    try {
      const user = ctx.state.user;

      const userData = await strapi.entityService
        .findOne("plugin::users-permissions.user", user?.id, {
          fields: [],
          populate: {
            vendor: { fields: ["id"] },
          },
        })
        .catch((err) => ctx.badRequest(err.message));

      if (!userData?.vendor) {
        return ctx.badRequest("You are not a vendor");
      }
      const body = ctx?.request?.body;
      const { id: bookingId } = ctx.request.params;
      const status = body?.data?.status;

      const ownBookings = await strapi.entityService.findMany(
        "api::booking.booking",
        {
          filters: {
            id: bookingId,
            activity: {
              vendor: userData?.vendor?.id,
            },
          },
          populate: {
            customer: { fields: ["name", "email"] },
            activity: { fields: ["name"] },
          },
        }
      );

      if (!ownBookings?.length) throw new Error("Not own booking");
      const updateBooking = await strapi.entityService.update(
        "api::booking.booking",
        bookingId,
        {
          data: {
            status,
          },
        }
      );
      if (updateBooking) {
        if (ownBookings[0].customer && ownBookings[0].activity) {
          await sendEmail({
            to: ownBookings[0].customer.email,
            subject:
              status === "approved"
                ? `Pack Your Bags! Your Booking with Go Saudi is a Go`
                : `We're Sorry: Your booking request is Not Approved`,
            text: getEmailText(status, ownBookings),
          });
        }

        return ctx.send("Updated successfully");
      }
      throw new Error("Something went wrong");
    } catch (err) {
      ctx.badRequest(err);
    }
  },
});
