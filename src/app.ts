import fastify from 'fastify'
import { disciplinesRoutes } from './routes/disciplines'
import { chaptersRoutes } from './routes/chapters'

export const app = fastify()

app.register(disciplinesRoutes, {
  prefix: 'disciplines',
})
app.register(chaptersRoutes, {
  prefix: 'chapters',
})
