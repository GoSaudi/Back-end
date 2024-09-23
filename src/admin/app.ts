const favicon = require("./extensions/favicon.ico");

export default {
  config: {
    head: {
      favicon: favicon,
    },
    auth: {
      logo: favicon,
    },
    menu: {
      logo: favicon,
    },
  },
};
