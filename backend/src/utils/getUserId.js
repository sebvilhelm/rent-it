const jwt = require('jsonwebtoken')

module.exports = (ctx, options = { throwError: true }) => {
  const { token } = ctx.request.cookies
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)

    return userId
  }

  if (options.throwError) {
    throw new AuthError('You must be logged in to do that')
  }

  return null
}

class AuthError extends Error {
  constructor(string) {
    const message = string || 'Not authorized'
    super(message)
  }
}
