const { forwardTo } = require('prisma-binding')
const { getUserId } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  async me(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const user = await ctx.db.query.user(
      {
        where: { id: currentUserId },
      },
      info
    )

    return {
      user,
      email: user.email,
      bookings: user.bookings,
    }
  },
}

module.exports = Query
