export default {
  createPayment: async (ctx, next) => {
    try {
      const user = ctx.state.user;
      if (!ctx?.request?.body) {
        return ctx.badRequest("Payment Error");
      }

      console.log("***************", ctx?.request?.body);
      const userBookingData = await strapi.entityService
        .findOne("api::booking.booking", ctx?.request?.body?.booking?.[0], {
          populate: {
            customer: { fields: ["id"] },
            activity: { fields: ["id", "amount"] },
          },
        })
        .catch((err) => ctx.badRequest(err.message));
      let customerId = userBookingData?.customer?.id || "";
      console.log("customer id drxctfvygh", customerId, userBookingData);
      const userData = await strapi.entityService
        .findOne("plugin::users-permissions.user", user?.id, {
          populate: {
            customer: { fields: ["id"] },
          },
        })
        .catch((err) => {
          console.log("************", err);
          ctx.badRequest(err.message);
        });
      console.log("user state id ", user?.id, "user from customer", userData);
      //return ctx.send(customerId);
      if (!userData || customerId !== userData?.customer?.id) {
        return ctx.badRequest("Bad Request");
      }
      console.log("userBookingData", userBookingData);
      let response = await tafPayment(
        ctx?.request?.body,
        userBookingData?.activity?.amount
      );
      return ctx.send(response);
    } catch (err) {
      ctx.badRequest(err);
    }
  },
  verifyPayment: async (ctx, next) => {
    try {
      const chargeId = ctx?.request?.body?.chargeId;
      if (!chargeId) {
        return ctx.badRequest("Charge Error");
      }

      let response = await tafVerify(chargeId);
      return ctx.send(response);
    } catch (err) {
      ctx.badRequest(err);
    }
  },
};

const tafPayment = async (reqData, amount) => {
  const axios = require("axios");

  const bookingId = reqData?.booking?.[0] || "";
  let data = JSON.stringify({
    amount: amount,
    currency: "SAR",
    customer_initiated: true,
    threeDSecure: true,
    save_card: false,
    description: "Test Description",
    metadata: {
      // udf1: "Metadata 1",
      bookingId,
    },
    reference: {
      // transaction: "txn_01",
      order: bookingId,
    },
    receipt: {
      email: true,
      sms: true,
    },
    customer: {
      first_name: reqData?.customer?.first_name || "",
      middle_name: reqData?.customer?.middle_name || "",
      last_name: reqData?.customer?.last_name || "",
      email: reqData?.customer?.email || "",
      phone: {
        country_code: parseInt(reqData?.customer?.phone?.country_code) || "",
        number: parseInt(reqData?.customer?.phone?.number) || "",
      },
    },
    merchant: {
      id: process.env.MERCHANT_ID,
    },
    source: {
      id: "src_all",
    },
    post: {
      url: `${process.env.STRAPI_ADMIN_URL}/api/web-transaction/${process.env.TAP_SECRET}`,
    },
    redirect: {
      url: `${process.env.STRAPI_ADMIN_FRONTEND_URL}/payment/${bookingId}`,
    },
  });

  console.log("data", data);

  let config = {
    method: "post",
    url: "https://api.tap.company/v2/charges/",
    headers: {
      Authorization: `Bearer ${process.env.TAP_KEY}`,
      accept: "application/json",
      "content-type": "application/json",
    },
    data: data,
  };
  try {
    let { data } = await axios.request(config);
    let transactionUrl = data?.transaction || "";
    console.log("transactionUrl", transactionUrl);
    return transactionUrl;
  } catch (error) {
    console.log("error", error.response.data);
    return "";
  }
};

const tafVerify = async (chargeId) => {
  const axios = require("axios");

  let config = {
    method: "get",
    url: `https://api.tap.company/v2/charges/${chargeId}`,
    headers: {
      Authorization: `Bearer ${process.env.TAP_KEY}`,
      accept: "application/json",
      "content-type": "application/json",
    },
  };
  try {
    let { data } = await axios.request(config);
    console.log("transactionUrl", data);
    return data;
  } catch (error) {
    console.log("error", error.response.data);
    return error;
  }
};
