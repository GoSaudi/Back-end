export default {
  routes: [
    {
      method: "POST",
      path: "/web-transaction/:id",
      handler: "web-transaction.webTransaction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/web-transaction-refund/:id",
      handler: "web-transaction.webTransactionRefund",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
