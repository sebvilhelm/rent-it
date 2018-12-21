const Item = {
  async averageRating(parent, args, ctx, info) {
    const { id } = parent
    const item = await ctx.db.query.item(
      { where: { id } },
      '{ reviews { rating { stars } } }'
    )

    if (item.reviews.length < 1) {
      return null
    }

    const sum = item.reviews.reduce((acc, review) => {
      return acc + review.rating.stars
    }, 0)

    return sum / item.reviews.length
  },
}

module.exports = Item
