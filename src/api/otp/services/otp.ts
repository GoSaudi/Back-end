import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::otp.otp', ({ strapi }) => ({
  async generateOTP(phoneNumber) {
    const otpCode = 1234;
    // const otpCode = Math.floor(1000 + Math.random() * 9000);


    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    await strapi.entityService.create('api::otp.otp', {
      data: {
        phoneNumber,
        otpCode,
        expiresAt,
      },
    });

    return otpCode;
  },

  async validateOTP(phoneNumber, submittedCode) {
    const [otpEntry] = await strapi.entityService.findMany('api::otp.otp', {
      filters: { phoneNumber },
      sort: { createdAt: 'desc' },
      limit: 1,
    });

    if (!otpEntry) {
      throw new Error('No OTP found for this phone number.');
    }

    if (new Date() > new Date(otpEntry.expiresAt)) {
      throw new Error('OTP has expired.');
    }

    if (otpEntry.otpCode !== parseInt(submittedCode, 10)) {
      throw new Error('Incorrect OTP.');
    }

    return true;
  },

  async regenerateOTP(phoneNumber) {
    return await this.generateOTP(phoneNumber);
  },
}));
