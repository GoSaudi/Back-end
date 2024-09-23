export default (plugin) => {
  plugin.controllers.user.me = async (ctx) => {
    try {
      const authUser = ctx.state.user;
      if (!authUser) throw new Error("User not logged in!");

      const userData = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        authUser.id,
        {
          fields: ["id"],
          populate: {
            customer: true,
            vendor: true,
          },
        }
      );

      ctx.send(userData);
    } catch (err) {
      ctx.badRequest(err.message);
    }
  };

  return plugin;
};
