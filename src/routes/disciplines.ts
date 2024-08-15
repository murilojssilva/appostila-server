import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function disciplinesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get('/', async () => {
    const disciplines = await knex('disciplines').select()

    return { disciplines }
  })

  app.put('/:id', async (request, reply) => {
    const updateDisciplineParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateDisciplineBodySchema = z.object({
      name: z.string(),
      displayName: z.string(),
    })

    const { id } = updateDisciplineParamsSchema.parse(request.params)
    const { name, displayName } = updateDisciplineBodySchema.parse(request.body)

    const discipline = await knex('disciplines').where('id', id).first()

    if (!discipline) {
      return reply.status(404).send({ error: 'Discipline not found' })
    }

    const updatedRows = await knex('disciplines')
      .where('id', id)
      .update({ name, displayName })

    return reply.status(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const deleteDisciplineParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteDisciplineParamsSchema.parse(request.params)

    const discipline = await knex('disciplines').where('id', id).first()

    if (!discipline) {
      return reply.status(404).send({ error: 'Discipline not found' })
    }

    await knex('disciplines').where('id', id).del()

    return reply.status(204).send()
  })

  app.get('/:id', async (request) => {
    const getDisciplineParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getDisciplineParamsSchema.parse(request.params)

    const discipline = await knex('disciplines').where('id', id).first()

    return { discipline }
  })

  app.post('/', async (request, reply) => {
    const createDisciplineBodySchema = z.object({
      name: z.string(),
      displayName: z.string(),
    })

    const { name, displayName } = createDisciplineBodySchema.parse(request.body)

    const existingDiscipline = await knex('disciplines').where({ name }).first()

    if (existingDiscipline) {
      return reply
        .status(409)
        .send({ error: 'Discipline with the same name already exists' })
    }

    await knex('disciplines').insert({
      id: randomUUID(),
      name,
      displayName,
    })

    return reply.status(201).send()
  })
}
