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
    }
  ],
};
