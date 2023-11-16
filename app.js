const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'todoApplication.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
// API 1

app.get('/todos/', async (request, response) => {
  const {priority, status, search_q = ''} = request.query
  let query = ''
  const hasPriorityAndStatus = requestquery => {
    return (
      requestquery.priority !== undefined && requestquery.status !== undefined
    )
  }
  const hasPriority = requestquery => {
    return requestquery.priority !== undefined
  }
  const hasStatus = requestquery => {
    return requestquery.status !== undefined
  }

  switch (true) {
    case hasPriorityAndStatus(request.query):
      query = ` select * from todo where   priority ='${priority}'  AND status = '${status}';`
      break
    case hasPriority(request.query):
      query = ` select * from todo where  priority ='${priority}';  `
      break
    case hasStatus(request.query):
      query = `select * from todo where  status ='${status}';`
      break
    default:
      query = ` select * from todo where todo like '%${search_q}%';`
  }

  const getquery = await db.all(query)
  response.send(getquery)
})
// API2
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  console.log(todoId)
  const query2 = ` select * from todo where id =${todoId};`
  const getquery2 = await db.get(query2)
  response.send(getquery2)
})
// API3
app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const query3 = `   INSERT INTO todo (id,todo,priority,status)    
  values(
  ${id},
  '${todo}',
  '${priority}',
  '${status}');`

  const postQuery = await db.run(query3)
  response.send('Todo Successfully Added')
})
// API 4
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {status, priority, todo} = request.query
  const hasPriority = requestquery => {
    return requestquery.priority !== undefined
  }

  const hasStatus = requestquery => {
    return requestquery.status !== undefined
  }
  const hastodo = requestquery => {
    return requestquery.todo !== undefined
  }
  let query3 = ''
  let text = ''
  switch (true) {
    case hasPriority(request.query):
      query3 = `update todo 
                   set 
                    priority='${priority}'
                     where id=${todoId};`
      text = 'Priority Updated'

      break
    case hasStatus(request.query):
      query3 = `update todo set status='${status}' where id=${todoId};`

      text = 'Status Updated'
      break
    case hastodo(request.query):
      query3 = `update todo set todo='${todo}' where id=${todoId};`
      text = 'Todo Updated'
      break
    default:
      query3 = ` select * from todo;`
      text = 'Updated succesfully'
  }
  const postQuery = await db.run(query3)
  response.send(text)
})
// API 5
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const query4 = ` delete from todo where id =${todoId};`
  const deleteQuery = await db.run(query4)
  response.send('Todo Deleted')
})
module.exports = app
