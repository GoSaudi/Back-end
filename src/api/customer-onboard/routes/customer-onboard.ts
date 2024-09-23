export default {
  routes: [
    {
      method: "POST",
      path: "/customer-onboard",
      handler: "customer-onboard.createUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/customer-onboard/confirm",
      handler: "customer-onboard.confirmUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
