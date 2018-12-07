const cookieParser = require('cookie-parser')

const createServer = require('./createServer')

const server = createServer()

server.express.use(cookieParser())

server.start(options =>
  console.log(`Server is running on http://localhost:${options.port}`)
)
