const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { differenceInDays } = require('date-fns')
const getUserId = require('../utils/getUserId')
const { itemSchema, bookingSchema } = require('../utils/validation')

const Mutation = {
  async createItem(_, args, ctx, info) {
    const { category, ...data } = args
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
    const { password, confirmPassword, email, ...user } = args

    if (password !== confirmPassword) {
      throw new Error("The two passwords doesn't match")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const formattedEmail = email.toLowerCase()

    const createdUser = await ctx.db.mutation.createUser(
      {
        data: {
          ...user,
          password: hashedPassword,
          email: formattedEmail,
        },
      },
      info
    )

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

  async book(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { itemId, startDate, endDate, ...booking } = args

    await bookingSchema.validate(args)

    const item = await ctx.db.query.item(
      { where: { id: itemId } },
      '{ owner { id }, maxDuration }'
    )

    // Check if user is owner of item
    if (item.owner.id === currentUserId) {
      throw new Error("You can't book your own item, obviously")
    }

    const duration = differenceInDays(endDate, startDate) + 1

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

  async cancel(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { id } = args

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

  async reviewBooking(_, args, ctx, info) {
    const currentUserId = getUserId(ctx)

    const { id, rating } = args

    const booking = await ctx.query.booking(
      { where: { id } },
      '{ booker { id }, startDate, cancelled }'
    )

    // TODO: check if current user is booker

    // TODO: Check is start date is lapsed

    // ?: Do something with cancelled?

    return ctx.db.mutation.createBookingReview(
      {
        data: {
          rating,
          booking: {
            connect: {
              id,
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
}

module.exports = Mutation
