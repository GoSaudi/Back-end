import { factories } from "@strapi/strapi";
const axios = require('axios');

export default factories.createCoreController("api::otp.otp", ({ strapi }) => ({

  async requestOTP(ctx) {
      try {
        const { phoneNumber } = ctx.request.body;

        // Ensure phoneNumber is provided
        if (!phoneNumber) {
            return ctx.badRequest('Phone number is required.');
        }

        // Generate OTP
        const otpService = strapi.service('api::otp.otp');
        const otpCode = await otpService.generateOTP(phoneNumber);

        // Prepare SMS API request payload
        const body = {
        userName: 'go-saudi',
        numbers: phoneNumber,
        userSender: 'Msegat.com',
        apiKey: '66C6720BD1E4B3502AD025EAA6F1CDA5',
        msg: `Your OTP code is: ${otpCode}`,
    };

    // Send SMS through the API
    const response = await axios.post('https://www.msegat.com/gw/sendsms.php', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return success message with OTP
    return ctx.send({
      message: 'OTP generated and sent successfully',
      otpCode,
      smsStatus: response.data, // include response from SMS API
    });
  } catch (error) {
    return ctx.badRequest(error.message);
  }
},


  async validateOTP(ctx) {
    const { phoneNumber, otpCode } = ctx.request.body;
    if (!phoneNumber || !otpCode) {
      return ctx.badRequest('Phone number and OTP code are required.');
    }
    await strapi.service('api::otp.otp').validateOTP(phoneNumber, otpCode);
    return ctx.send({ message: 'OTP validated successfully' });
  },

  async resetOTP(ctx) {
    const { phoneNumber } = ctx.request.body;
    if (!phoneNumber) {
      return ctx.badRequest('Phone number is required.');
    }
    const newOtp = await strapi.service('api::otp.otp').regenerateOTP(phoneNumber);
    return ctx.send({ message: 'OTP reset successfully' });
  },
}));
