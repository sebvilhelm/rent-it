const cookieParser = require('cookie-parser')

const createServer = require('./createServer')

const server = createServer()

server.express.use(cookieParser())

server.start(
  {
    tracing: false,
    cacheControl: false,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  options =>
    console.log(`Server is running on http://localhost:${options.port}`)
)
