import jwt from "jsonwebtoken";
import { sendEmail } from "../../../../helpers/email";
import vendorOnboard from "../../../../helpers/templates/vendorOnboard";
import { errors } from "@strapi/utils";
const { ValidationError } = errors;

export default {
  async beforeCreate(event) {
    // Connected to "Save" button in admin panel
    const { email } = event?.params?.data || {};
    const existingUser = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: {
          email,
        },
      }
    );
    if (existingUser?.length)
      throw new ValidationError("Email already exists!");
  },
  async afterCreate(event) {
    // Connected to "Save" button in admin panel
    const { result } = event;
    const vendorEmail = result?.email;
    const vendorName = result?.name;
    const vendorId = result?.id;
    const jwtSecret = process.env.STRAPI_ADMIN_JWT_SECRET_KEY;

    try {
      if (vendorEmail && vendorId) {
        const token = jwt.sign(
          { username: vendorName, id: vendorId, email: vendorEmail },
          jwtSecret,
          {
            expiresIn: "1h", // Set the expiration time for the token
          }
        );

        if (token) {
          const text = vendorOnboard({
            vendorName,
            token,
            email: encodeURIComponent(vendorEmail),
          });
          await sendEmail({
            to: vendorEmail,
            subject: `You're In! Your Account is Ready to Roll!`,
            text,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  async beforeUpdate(event) {
    const newData = event?.params?.data;
    if (newData) {
      try {
        const oldData = await strapi.entityService.findOne(
          "api::vendor.vendor",
          newData.id,
          {
            fields: ["blocked"],
            populate: {
              user: { fields: ["id"] },
            },
          }
        );
        if (oldData) {
          if (!oldData.blocked === newData.blocked) {
            await strapi.entityService.update(
              "plugin::users-permissions.user",
              oldData?.user?.id,
              {
                data: {
                  blocked: newData.blocked,
                },
              }
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};
