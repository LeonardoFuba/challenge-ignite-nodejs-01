import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database

export const routes = [
  // List tasks
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return response.end(JSON.stringify(tasks))
    }
  },

  // Create a new task
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body

      if(!title || !description) {
        return response.writeHead(400).end(JSON.stringify('title and description are required'))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return response.writeHead(201).end()
    }
  },

  // Update a task
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description, } = request.body

      if(!title || !description) {
        return response.writeHead(400).end(JSON.stringify('title and description are required'))
      }

      console.log({id, title, description })
      const errorMessage = database.update('tasks', id, {
        title,
        description,
        updated_at: new Date(),
      })

      if(errorMessage) {
        return response.writeHead(400).end(JSON.stringify(errorMessage))
      }

      return response.writeHead(204).end()
    }
  },

  // Delete a task
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      const errorMessage = database.delete('tasks', id)
      
      if(errorMessage) {
        return response.writeHead(400).end(JSON.stringify(errorMessage))
      }

      return response.writeHead(204).end()
    }
  },

  // Complete a task
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params

      const errorMessage = database.update('tasks', id, {
        completed_at: new Date(),
        updated_at: new Date(),
      })

      if(errorMessage) {
        return response.writeHead(400).end(JSON.stringify(errorMessage))
      }

      return response.writeHead(204).end()
    }
  }
]