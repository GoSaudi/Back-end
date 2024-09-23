export default {
  routes: [
    {
      method: "POST",
      path: "/vendor-onboard",
      handler: "vendor-onboard.createUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
