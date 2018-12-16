const jwt = require('jsonwebtoken')

module.exports = ctx => {
  const { token } = ctx.request.cookies
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)

    return userId
  }

  throw new AuthError('You must be logged in to do that')
}

class AuthError extends Error {
  constructor(string) {
    const message = string || 'Not authorized'
    super(message)
  }
}
