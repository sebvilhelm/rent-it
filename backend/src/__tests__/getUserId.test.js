const getUserId = require('../utils/getUserId')
const jwt = require('jsonwebtoken')

global.process.env.APP_SECRET = 'test'

test('can get user id from request', async () => {
  const id = 'abc123'
  const token = jwt.sign({ userId: id }, process.env.APP_SECRET)
  const userId = await getUserId({
    request: {
      cookies: {
        token,
      },
    },
  })
  expect(userId).toBe(id)
})

test('it fails when there is no userId', async () => {
  try {
    await getUserId({
      request: {
        cookies: {},
      },
    })
  } catch (error) {
    expect(error).toEqual(Error('You must be logged in to do that'))
  }
})

test('it returns fail when there is no userId and {throwError: false} is passed', async () => {
  const userId = await getUserId(
    {
      request: {
        cookies: {},
      },
    },
    { throwError: false }
  )
  expect(userId).toBe(null)
})
