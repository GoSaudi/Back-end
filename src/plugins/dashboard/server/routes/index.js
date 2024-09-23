module.exports = [
  {
    method: 'GET',
    path: '/overview',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/pendingActivities',
    handler: 'myController.pendingActivities',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/approveRejectActivity',
    handler: 'myController.approveRejectActivity',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/bookingDetails/:id',
    handler: 'myController.bookingDetails',
    config: {
      policies: [],
    },
  },
];

