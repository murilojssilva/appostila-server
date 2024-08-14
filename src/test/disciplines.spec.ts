import { beforeAll, afterAll, describe, it } from 'vitest'
import request from 'supertest'

import { app } from '../app'

describe('Disciplines routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new discipline', async () => {
    const response = await request(app.server)
      .post('/disciplines')
      .send({
        name: 'math',
        displayName: 'Matemática',
      })
      .expect(201)
  })

  it('should be able to list all disciplines', async () => {
    const response = await request(app.server)
      .get('/disciplines')
      .send()
      .expect(200)
  })

  it('should be able to edit a discipline', async () => {
    const createResponse = await request(app.server).post('/disciplines').send({
      name: 'math',
      displayName: 'Matemática',
    })

    const disciplineId = createResponse.body.id

    const editResponse = await request(app.server)
      .put(`/disciplines/${disciplineId}`)
      .send({
        name: 'mathematics',
        displayName: 'Matemática Avançada',
      })
      .expect(200)
  })

  it('should be able to delete a discipline', async () => {
    const createResponse = await request(app.server).post('/disciplines').send({
      name: 'math',
      displayName: 'Matemática',
    })

    const disciplineId = createResponse.body.id

    const deleteResponse = await request(app.server)
      .delete(`/disciplines/${disciplineId}`)
      .expect(204)
  })
})
