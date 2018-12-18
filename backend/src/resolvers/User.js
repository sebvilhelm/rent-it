const User = {
  reviewsBy(_, args, ctx, info) {
    // TODO: make query
    return []
  },
  reviews(_, args, ctx, info) {
    // TODO: make query
    return []
  },
  pendingBookings(parent, args, ctx, info) {
    return ctx.db.query.bookings(
      {
        where: {
          AND: [{ item: { owner: { id: parent.id } } }, { status: 'PENDING' }],
        },
      },
      info
    )
  },
}

module.exports = User
