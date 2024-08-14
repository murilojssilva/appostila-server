import { beforeAll, afterAll, describe, it } from 'vitest'
import request from 'supertest'

import { app } from '../app'

describe('Chapters routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new chapter', async () => {
    const disciplineResponse = await request(app.server)
      .post('/disciplines')
      .send({
        name: 'math',
        displayName: 'Matemática',
      })
      .expect(201)

    const disciplineId = disciplineResponse.body.id

    const response = await request(app.server)
      .post('/chapters')
      .send({
        number: 1,
        title: 'Introduction to Algebra',
        discipline_id: disciplineId,
      })
      .expect(201)
  })

  it('should be able to list all chapters', async () => {
    const response = await request(app.server)
      .get('/chapters')
      .send()
      .expect(200)
  })

  it('should be able to edit a chapter', async () => {
    const disciplineResponse = await request(app.server)
      .post('/disciplines')
      .send({
        name: 'math',
        displayName: 'Matemática',
      })
      .expect(201)

    const disciplineId = disciplineResponse.body.id

    const createResponse = await request(app.server)
      .post('/chapters')
      .send({
        number: 1,
        title: 'Introduction to Algebra',
        discipline_id: disciplineId,
      })
      .expect(201)

    const chapterId = createResponse.body.id

    const editResponse = await request(app.server)
      .put(`/chapters/${chapterId}`)
      .send({
        number: 1,
        title: 'Advanced Algebra',
        discipline_id: disciplineId,
      })
      .expect(200)
  })

  it('should be able to delete a chapter', async () => {
    const disciplineResponse = await request(app.server)
      .post('/disciplines')
      .send({
        name: 'math',
        displayName: 'Matemática',
      })
      .expect(201)

    const disciplineId = disciplineResponse.body.id

    const createResponse = await request(app.server)
      .post('/chapters')
      .send({
        number: 1,
        title: 'Introduction to Algebra',
        discipline_id: disciplineId,
      })
      .expect(201)

    const chapterId = createResponse.body.id

    const deleteResponse = await request(app.server)
      .delete(`/chapters/${chapterId}`)
      .expect(204)
  })
})
