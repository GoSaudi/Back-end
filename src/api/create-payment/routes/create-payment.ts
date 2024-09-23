export default {
  routes: [
    {
      method: "POST",
      path: "/create-payment",
      handler: "create-payment.createPayment",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/verify-payment",
      handler: "create-payment.verifyPayment",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
