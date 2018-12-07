const { forwardTo } = require('prisma-binding')
const { getUserId } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  me(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    return ctx.db.query.user(
      {
        where: { id: currentUserId },
      },
      info
    )
  },
}

module.exports = Query
