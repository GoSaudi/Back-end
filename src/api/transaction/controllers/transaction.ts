/**
 * transaction controller
 */

import { factories } from "@strapi/strapi";
import decode from "../../../helpers/decode";
import checkStatus from "../../../helpers/checkStatus";

export default factories.createCoreController("api::transaction.transaction", {
  async create(ctx) {},
});
