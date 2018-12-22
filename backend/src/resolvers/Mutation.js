const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')
const { differenceInCalendarDays } = require('date-fns')
const getUserId = require('../utils/getUserId')
const {
  itemSchema,
  bookingSchema,
  userValidation,
  updateUserValidation,
} = require('../utils/validation')

const Mutation = {
  async createItem(_, args, ctx, info) {
    const { category, imageFull, imagePreview, ...data } = args
    const currentUserId = getUserId(ctx)

    await itemSchema.validate(data)

    return ctx.db.mutation.createItem(
      {
        data: {
          ...data,
          category: {
            connect: {
              id: category,
            },
          },
          owner: {
            connect: {
              id: currentUserId,
            },
          },
          image: {
            create: {
              preview: imagePreview,
              full: imageFull,
            },
          },
        },
      },
      info
    )
  },

  async updateItem(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)
    const { id, ...data } = args

    const item = await ctx.db.query.item({ where: { id } }, '{ owner { id } }')

    const ownsItem = item.owner.id === currentUserId
    const hasPermission = true

    if (!ownsItem || !hasPermission) {
      throw new Error("You don't have permissions to do that")
    }

    return ctx.db.mutation.updateItem(
      {
        data,
        where: {
          id,
        },
      },
      info
    )
  },

  async signUp(_, args, ctx, info) {
    const { password, ...user } = await userValidation.validate(args)

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await ctx.db.mutation.createUser(
      {
        data: {
          ...user,
          password: hashedPassword,
        },
      },
      info
    )

    // Generate JWT
    const token = jwt.sign({ userId: createdUser.id }, process.env.APP_SECRET)
    // Set the token as a cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    return createdUser
  },

  async signIn(_, args, ctx) {
    const { email, password } = args
    const errorMessage = 'Login error'

    const user = await ctx.db.query.user({
      where: { email },
    })

    if (!user) {
      throw new Error(errorMessage)
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw new Error(errorMessage)
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set the token as a cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    return user
  },

  signOut(_, args, ctx) {
    ctx.response.clearCookie('token')
    return { message: 'Goodbye!' }
  },

  async updateProfile(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { password, ...user } = args
    const data = { ...user }

    await updateUserValidation.validate(args)

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      data.password = hashedPassword
    }

    return ctx.db.mutation.updateUser(
      {
        where: { id: currentUserId },
        data,
      },
      info
    )
  },

  async book(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { itemId, startDate, endDate, ...booking } = args

    await bookingSchema.validate(args)

    const item = await ctx.db.query.item(
      { where: { id: itemId } },
      `{
        owner { id }
        maxDuration
        bookings(where: {status: APPROVED}) {
          id
          startDate
          endDate
        }
      }`
    )

    // Check if user is owner of item
    if (item.owner.id === currentUserId) {
      throw new Error("You can't book your own item, obviously")
    }

    const duration = differenceInCalendarDays(endDate, startDate)

    // Check if booking is at least one day
    if (duration < 1) {
      throw new Error('The end date must be later than the start date')
    }

    // Check if booking violates maxDuration
    if (item.maxDuration && duration > item.maxDuration) {
      throw new Error(
        `your booking exceeds the maximum allowed duration of ${
          item.maxDuration
        } days`
      )
    }

    // TODO: check if there already is an approved booking for the item in the same timespan

    return ctx.db.mutation.createBooking(
      {
        data: {
          ...booking,
          startDate,
          endDate,
          item: {
            connect: {
              id: itemId,
            },
          },
          booker: {
            connect: {
              id: currentUserId,
            },
          },
        },
      },
      info
    )
  },

  async cancelBooking(_, args, ctx, info) {
    const { id } = args
    const currentUserId = getUserId(ctx)

    const booking = await ctx.db.query.booking(
      { where: { id } },
      '{ item { owner { id } }, renter { id } }'
    )

    const isOwner = booking.item.owner.id === currentUserId
    const isRenter = booking.renter.id === currentUserId

    if (!isOwner && !isRenter) {
      throw new Error("You don't have permission to do that")
    }

    return ctx.db.mutation.updateBooking(
      {
        where: { id },
        data: {
          status: 'CANCELLED',
        },
      },
      info
    )
  },

  async acceptBooking(_, args, ctx, info) {
    const { id } = args
    const currentUserId = getUserId(ctx)

    // Check if current user is owner of item
    const booking = await ctx.db.query.booking(
      {
        where: { id },
      },
      '{ item { owner { id } } }'
    )
    const isOwner = booking.item.owner.id === currentUserId

    if (!isOwner) {
      throw new Error("You don't have permission to do that")
    }

    return ctx.db.mutation.updateBooking(
      {
        where: { id },
        data: {
          status: 'APPROVED',
        },
      },
      info
    )
  },
  async denyBooking(_, args, ctx, info) {
    const { id } = args
    const currentUserId = getUserId(ctx)

    // Check if current user is owner of item
    const booking = await ctx.db.query.booking(
      {
        where: { id },
      },
      '{ item { owner { id } } }'
    )
    const isOwner = booking.item.owner.id === currentUserId

    if (!isOwner) {
      throw new Error("You don't have permission to do that")
    }

    return ctx.db.mutation.updateBooking(
      {
        where: { id },
        data: {
          status: 'DENIED',
        },
      },
      info
    )
  },

  async reviewItem(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { id, stars, description } = args

    const itemQuery = `
      query($id: ID!, $userId: ID!) {
        item(where: { id: $id }) {
          title
          owner {
            id
          }
          bookings(where: {
            booker: {id: $userId}
          }) {
            id
          }
        }
      }
    `

    const {
      data: { item },
    } = await ctx.db.request(itemQuery, { id, userId: currentUserId })

    // Check if user is owner
    const isOwner = item.owner.id === currentUserId

    if (isOwner) {
      throw new Error("You can't review your own items, you cheat!")
    }

    // Check if user has a booking
    if (item.bookings.length < 1) {
      throw new Error("You can't review items you haven't booked!")
    }

    return ctx.db.mutation.createItemReview(
      {
        data: {
          item: {
            connect: { id },
          },
          rating: {
            create: {
              stars,
              description,
            },
          },
          reviewer: {
            connect: {
              id: currentUserId,
            },
          },
        },
      },
      info
    )
  },

  createCategory(_, args, ctx, info) {
    const { title, description } = args

    // TODO: Check permissions

    const slug = slugify(title, { lower: true })

    return ctx.db.mutation.createCategory(
      {
        data: {
          title,
          description,
          slug,
        },
      },
      info
    )
  },
}

module.exports = Mutation
