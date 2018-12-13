const { forwardTo } = require('prisma-binding')
const { getUserId } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  categories: forwardTo('db'),
  categoriesConnection: forwardTo('db'),

  async me(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const user = await ctx.db.query.user(
      {
        where: { id: currentUserId },
      },
      info
    )

    return user
  },
}

module.exports = Query
