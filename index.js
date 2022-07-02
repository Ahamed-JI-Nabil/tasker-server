const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express()

const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atpsp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()

        const taskCollection = client.db('tasker').collection('all-tasks')


        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray()
            res.send(tasks)

        })


        app.post('/tasks', async (req, res) => {
            const tasks = req.body
            const result = await taskCollection.insertOne(tasks)
            res.send(result)
        })





        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const updateIsDone = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    isDone: updateIsDone.isDone
                }
            }
            const result = await taskCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })


        app.put('/task/:id', async (req, res) => {
            const id = req.params.id
            const updateTask = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: updateTask.name
                }
            }
            const result = await taskCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })






    }
    finally {


    }
}


run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('hey there from tasker')
})

app.listen(port, () => {
    console.log('Listening from port:', port);

})