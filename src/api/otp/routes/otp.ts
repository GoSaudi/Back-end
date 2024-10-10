module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/otp/request',
      handler: 'otp.requestOTP',
      config: {
        auth: false, // Adjust as needed
      },
    },
    {
      method: 'POST',
      path: '/otp/validate',
      handler: 'otp.validateOTP',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/otp/reset',
      handler: 'otp.resetOTP',
      config: {
        auth: false,
      },
    },
  ],
};
