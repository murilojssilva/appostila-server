import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function chaptersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get('/', async () => {
    const chapters = await knex('chapters').select()

    return { chapters }
  })

  app.get('/:id', async (request) => {
    const getChapterParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getChapterParamsSchema.parse(request.params)

    const chapter = await knex('chapters').where('id', id).first()

    if (!chapter) {
      return { error: 'Chapter not found' }
    }

    return { chapter }
  })

  app.post('/', async (request, reply) => {
    const createChapterBodySchema = z.object({
      number: z.number(),
      title: z.string(),
      discipline_id: z.string().uuid(),
    })

    const { number, title, discipline_id } = createChapterBodySchema.parse(
      request.body
    )

    const existingChapter = await knex('chapters')
      .where({ number, discipline_id })
      .first()

    if (existingChapter) {
      return reply
        .status(409)
        .send({
          error:
            'Chapter with the same number already exists for this discipline',
        })
    }

    await knex('chapters').insert({
      id: randomUUID(),
      number,
      title,
      discipline_id,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const updateChapterParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateChapterBodySchema = z.object({
      number: z.number(),
      title: z.string(),
      discipline_id: z.string().uuid(),
    })

    const { id } = updateChapterParamsSchema.parse(request.params)
    const { number, title, discipline_id } = updateChapterBodySchema.parse(
      request.body
    )

    const chapter = await knex('chapters').where('id', id).first()

    if (!chapter) {
      return reply.status(404).send({ error: 'Chapter not found' })
    }

    const updatedRows = await knex('chapters')
      .where('id', id)
      .update({ number, title, discipline_id })

    if (updatedRows === 0) {
      return reply.status(404).send({ error: 'Chapter not found' })
    }

    return reply.status(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const deleteChapterParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteChapterParamsSchema.parse(request.params)

    const chapter = await knex('chapters').where('id', id).first()

    if (!chapter) {
      return reply.status(404).send({ error: 'Chapter not found' })
    }

    await knex('chapters').where('id', id).del()

    return reply.status(204).send()
  })
}
