import checkStatus from "../../../helpers/checkStatus";
import { tapRefund } from "../../../helpers/paymentHelper";

export default {
  webTransaction: async (ctx, next) => {
    try {
      const uid = ctx.params.id;

      if (uid !== process.env.TAP_SECRET)
        return ctx.badRequest("Something went wrong");

      const transactionData = ctx?.request?.body;

      const bookingId = transactionData?.metadata?.bookingId;
      const transactionId = transactionData?.id;
      const { amount, currency } = transactionData;
      const responseCode = transactionData?.response?.code;

      console.log("***************2", { transactionData });

      if (bookingId && transactionId) {
        if (responseCode === "000") {
          await strapi.db.transaction(
            async ({ trx, rollback, commit, onCommit, onRollback }) => {
              try {
                // Get Booking Info
                const bookingData = await strapi.entityService.findOne(
                  "api::booking.booking",
                  bookingId,
                  {
                    populate: ["activity"],
                  }
                );

                // Check Availabily to Lock
                const [{ total_booked, total_tickets }] = await strapi.db
                  .connection("activities")
                  .transacting(trx)
                  .forUpdate()
                  .select("total_booked", "total_tickets")
                  .where("id", bookingData.activity.id);

                const availableTickets = total_tickets - total_booked;

                // Update the Total Booked if there is availability or the ticket is already Approved
                if (
                  availableTickets >= bookingData.tickets ||
                  bookingData.status == "approved"
                ) {
                  await strapi.entityService.update(
                    "api::activity.activity",
                    bookingData.activity.id,
                    {
                      data: {
                        totalBooked: total_booked + bookingData.tickets,
                      },
                    }
                  );

                  await strapi.entityService.update(
                    "api::booking.booking",
                    bookingId,
                    {
                      data: {
                        status: "confirmed",
                      },
                    }
                  );

                  await strapi.entityService.create(
                    "api::transaction.transaction",
                    {
                      data: {
                        booking: bookingId,
                        transactionId: transactionId,
                        transactionData: {
                          code: responseCode,
                          booked: true,
                        },
                      },
                    }
                  );

                  await commit();
                  return ctx.send({
                    status: "Booking Confirmed",
                  });
                } else {
                  const response = await tapRefund({
                    amount,
                    chargeId: transactionId,
                    currency,
                  });

                  await strapi.entityService.update(
                    "api::booking.booking",
                    bookingId,
                    {
                      data: {
                        status: "refund-pending",
                      },
                    }
                  );

                  await strapi.entityService.create(
                    "api::transaction.transaction",
                    {
                      data: {
                        booking: bookingId,
                        transactionId: transactionId,
                        transactionData: {
                          code: responseCode,
                          booked: false,
                          refundStatus: response,
                        },
                      },
                    }
                  );
                  return ctx.send({
                    status: "Ticket Not Available, Refund Initiated",
                  });
                }
              } catch (error) {
                rollback();

                await strapi.db.transaction(
                  async ({ trx, rollback, commit, onCommit, onRollback }) => {
                    try {
                      const response = await tapRefund({
                        amount,
                        chargeId: transactionId,
                        currency,
                      });
                      await strapi.entityService.update(
                        "api::booking.booking",
                        bookingId,
                        {
                          data: {
                            status: "refund-pending",
                          },
                        }
                      );

                      await strapi.entityService.create(
                        "api::transaction.transaction",
                        {
                          data: {
                            booking: bookingId,
                            transactionId: transactionId,
                            transactionData: {
                              code: responseCode,
                              booked: false,
                              refundStatus: response,
                            },
                          },
                        }
                      );
                      commit();
                    } catch (error) {
                      rollback();
                    }
                  }
                );

                return ctx.send({
                  status: "Something Went Wrong",
                });
              }
            }
          );
        } else {
          console.log("***************1");
          await strapi.entityService.create("api::transaction.transaction", {
            data: {
              booking: bookingId,
              transactionId: transactionId,
              transactionData: {
                code: responseCode,
                booked: false,
              },
            },
          });
        }
      }

      ctx.send("success");
    } catch (err) {
      ctx.badRequest(err);
    }
  },

  webTransactionRefund: async (ctx, next) => {
    try {
      const uid = ctx.params.id;

      if (uid !== process.env.TAP_SECRET)
        return ctx.badRequest("Something went wrong");

      const transactionData = ctx?.request?.body;

      await strapi.entityService.create("api::transaction.transaction", {
        data: {
          transactionData,
        },
      });

      // const bookingId = transactionData?.metadata?.bookingId;
      // const transactionId = transactionData?.id;
      // const { amount, currency } = transactionData;
      // const responseCode = transactionData?.response?.code;

      // console.log("***************2", { transactionData });

      // if (bookingId && transactionId) {
      //   if (responseCode === "000") {
      //     await strapi.db.transaction(
      //       async ({ trx, rollback, commit, onCommit, onRollback }) => {
      //         try {
      //           // Get Booking Info
      //           const bookingData = await strapi.entityService.findOne(
      //             "api::booking.booking",
      //             bookingId,
      //             {
      //               populate: ["activity"],
      //             }
      //           );

      //           // Check Availabily to Lock
      //           const [{ total_booked, total_tickets }] = await strapi.db
      //             .connection("activities")
      //             .transacting(trx)
      //             .forUpdate()
      //             .select("total_booked", "total_tickets")
      //             .where("id", bookingData.activity.id);

      //           const availableTickets = total_tickets - total_booked;

      //           // Update the Total Booked if there is availability or the ticket is already Approved
      //           if (
      //             availableTickets >= bookingData.tickets ||
      //             bookingData.status == "approved"
      //           ) {
      //             await strapi.entityService.update(
      //               "api::activity.activity",
      //               bookingData.activity.id,
      //               {
      //                 data: {
      //                   totalBooked: total_booked + bookingData.tickets,
      //                 },
      //               }
      //             );

      //             await strapi.entityService.update(
      //               "api::booking.booking",
      //               bookingId,
      //               {
      //                 data: {
      //                   status: "confirmed",
      //                 },
      //               }
      //             );

      //             await strapi.entityService.create(
      //               "api::transaction.transaction",
      //               {
      //                 data: {
      //                   booking: bookingId,
      //                   transactionId: transactionId,
      //                   transactionData: {
      //                     code: responseCode,
      //                     booked: true,
      //                   },
      //                 },
      //               }
      //             );

      //             await commit();
      //             return ctx.send({
      //               status: "Booking Confirmed",
      //             });
      //           } else {
      //             const response = await tapRefund({
      //               amount,
      //               chargeId: transactionId,
      //               currency,
      //             });

      //             await strapi.entityService.update(
      //               "api::booking.booking",
      //               bookingId,
      //               {
      //                 data: {
      //                   status: "refund-pending",
      //                 },
      //               }
      //             );

      //             await strapi.entityService.create(
      //               "api::transaction.transaction",
      //               {
      //                 data: {
      //                   booking: bookingId,
      //                   transactionId: transactionId,
      //                   transactionData: {
      //                     code: responseCode,
      //                     booked: false,
      //                     refundStatus: response,
      //                   },
      //                 },
      //               }
      //             );
      //             return ctx.send({
      //               status: "Ticket Not Available, Refund Initiated",
      //             });
      //           }
      //         } catch (error) {
      //           rollback();

      //           await strapi.db.transaction(
      //             async ({ trx, rollback, commit, onCommit, onRollback }) => {
      //               try {
      //                 const response = await tapRefund({
      //                   amount,
      //                   chargeId: transactionId,
      //                   currency,
      //                 });
      //                 await strapi.entityService.update(
      //                   "api::booking.booking",
      //                   bookingId,
      //                   {
      //                     data: {
      //                       status: "refund-pending",
      //                     },
      //                   }
      //                 );

      //                 await strapi.entityService.create(
      //                   "api::transaction.transaction",
      //                   {
      //                     data: {
      //                       booking: bookingId,
      //                       transactionId: transactionId,
      //                       transactionData: {
      //                         code: responseCode,
      //                         booked: false,
      //                         refundStatus: response,
      //                       },
      //                     },
      //                   }
      //                 );
      //                 commit();
      //               } catch (error) {
      //                 rollback();
      //               }
      //             }
      //           );

      //           return ctx.send({
      //             status: "Something Went Wrong",
      //           });
      //         }
      //       }
      //     );
      //   } else {
      //     console.log("***************1");
      //     await strapi.entityService.create("api::transaction.transaction", {
      //       data: {
      //         booking: bookingId,
      //         transactionId: transactionId,
      //         transactionData: {
      //           code: responseCode,
      //           booked: false,
      //         },
      //       },
      //     });
      //   }
      // }

      ctx.send("success");
    } catch (err) {
      ctx.badRequest(err);
    }
  },
};
