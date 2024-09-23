import { sendEmail } from "../../../../helpers/email";
import activityRejected from "../../../../helpers/templates/activityRejected";

export default {
  async beforeUpdate(event) {
    const newData = event?.params?.data;
    try {
      if (!newData) throw new Error("No data");
      const oldData = await strapi.entityService.findOne(
        "api::activity.activity",
        newData.id,
        {
          fields: ["approved", "approval_reason"],
          populate: {
            vendor: { fields: ["name", "email"] },
          },
        }
      );
      if (!oldData) throw new Error("Something went wrong!");
      if (newData.approved !== null && oldData.approved !== newData.approved) {
        const vendorName = oldData.vendor?.name;
        const vendorEmail = oldData.vendor?.email;
        const activityId = newData.id;
        if (vendorEmail && vendorName) {
          const text = activityRejected({
            vendorName,
            approvalReason: newData?.approval_reason,
            activityId,
            isApproved: newData.approved === "Approved",
          });
          await sendEmail({
            to: vendorEmail,
            subject:
              newData.approved === "Approved"
                ? `Thumbs Up! Your activity is Approved`
                : `Oops! Your Activity/Event Request with Go-Saudi Didn't Make It`,
            text,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
};
