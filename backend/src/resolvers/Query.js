const { forwardTo } = require('prisma-binding')
const getUserId = require('../utils/getUserId')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  categories: forwardTo('db'),
  category: forwardTo('db'),
  categoriesConnection: forwardTo('db'),

  async me(_, args, ctx, info) {
    const currentUserId = getUserId(ctx, { throwError: false })

    if (!currentUserId) {
      return null
    }

    const user = await ctx.db.query.user(
      {
        where: { id: currentUserId },
      },
      info
    )

    return user
  },

  async searchItems(_, args, ctx, info) {
    const { searchTerm } = args

    if (!searchTerm) return null

    // Get the categories
    const categories = await ctx.db.query.categories({
      where: {
        items_some: { title_contains: searchTerm },
      },
    })

    for await (const category of categories) {
      const where = {
        AND: [
          { category: { id: category.id } },
          { title_contains: searchTerm },
        ],
      }

      const itemsConnection = await ctx.db.query.itemsConnection(
        {
          where,
        },
        '{aggregate { count }}'
      )

      category.count = itemsConnection.aggregate.count
    }

    return categories.map(({ count, ...category }) => ({
      category,
      count,
    }))
  },
}

module.exports = Query
