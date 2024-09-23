export const tapRefund = async ({ chargeId, currency, amount }) => {
  const axios = require("axios");

  const config = {
    method: "post",
    url: `https://api.tap.company/v2/refunds/`,
    headers: {
      Authorization: `Bearer ${process.env.TAP_KEY}`,
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      charge_id: chargeId,
      amount,
      currency,
      reason: "The chosen slot is not available",
      post: {
        url: `${process.env.STRAPI_ADMIN_URL}/api/web-transaction-refund/${process.env.TAP_SECRET}`,
      },
    },
  };
  try {
    let { data } = await axios.request(config);
    return data;
  } catch (error) {
    return error;
  }
};
