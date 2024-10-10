// import { sendEmail } from "../../../../helpers/email";
// import jwt from "jsonwebtoken";
// import customerOnboard from "../../../../helpers/templates/customerOnboard";

// export default {
//   async afterCreate(event) {
//     const { result } = event;
//     const customerId = result?.id;
//     const customerEmail = result?.email;
//     const customerName = result?.name;

//     try {
//       if (customerEmail && customerName) {
//         const token = jwt.sign(
//           { username: customerName, id: customerId, email: customerEmail },
//           process.env.STRAPI_ADMIN_JWT_SECRET_KEY,
//           {
//             expiresIn: "1h",
//           }
//         );
//         const text = customerOnboard({
//           customerName,
//           token,
//           email: encodeURIComponent(customerEmail),
//         });
//         await sendEmail({
//           to: customerEmail,
//           subject: `Hello ${customerName} Your adventure Begins Now!`,
//           text,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
