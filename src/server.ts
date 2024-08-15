import { app } from './app'
import { env } from './env'

const port = env.PORT || 3000

app
  .listen({
    port,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP Server Running on port ${port}`)
  })
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })
