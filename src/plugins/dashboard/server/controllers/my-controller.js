'use strict';

module.exports = ({ strapi }) => ({
  async index(ctx) {
    const knex = strapi.db.connection
    const res = await knex.select(
      knex('activities').count('*').as("totalActivities"),
      knex('activities').where('approved', "Approved").count('*').as("approvedActivities"),
      knex('bookings').count('*').as("bookings"),
      knex('bookings').where('status', 'confirmed').count('*').as("confirmedBookings"),
      knex('vendors').count('*').as("vendors"),
    )



    ctx.body = res
  },

  async pendingActivities(ctx) {
    const entries = await strapi.entityService.findMany('api::activity.activity', {
      filters: {
        approved: null,
      },
      populate: "*"
    });

    ctx.body = entries
  },

  async approveRejectActivity(ctx) {
    const { id, approved, approvalReason } = ctx.request.body
    const entry = await strapi.entityService.update('api::activity.activity', id, {
      data: {
        id,
        approved: approved,
        approval_reason: approvalReason
      },
    });


    ctx.body = entry
  },

  async bookingDetails(ctx) {

    const { id } = ctx.request.params
    const entries = await strapi.entityService.findOne('api::booking.booking', id, {
      populate: {
        activity: {
          populate: "*"
        },
        customer: true
      }
    });

    ctx.body = entries


  }
});
