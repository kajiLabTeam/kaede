import { Hono } from 'hono'
import apiRoutes from './routes/route'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({ status: 'ok', message: 'Hono API Server is running' })
})

app.route('/api', apiRoutes)

app.onError((err, c) => {
  console.error(`[Global Error]: ${err.message}`)

  return c.json(
    {
      success: false,
      error: 'Internal Server Error',
    },
    500
  )
})

export default app
