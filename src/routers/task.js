const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
router.use(bodyParser.json()); // Send JSON responses

router.post('/tasks', async (req,res) =>{
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    }catch(e){
        
        res.status(400).send('hele' + e)
    }


   /*  task.save().then(() => {
        res.send(task)
    }).catch((e) => {
        res.status(500).send(e)
        

    }) */
})

router.get('/tasks', async (req,res) => {

    try{
        const tasks =  await Task.find({})

        res.send(tasks)

    }catch(e) {
        
        res.status(500).send(e)
    }


    /* Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send(e)
    }) */
})


router.get('/tasks/:id', async (req,res) => {

    const _id = req.params.id

    try{

        const task = await Task.findById(_id)

        if(!task) {
            res.status(404).send("task not found")
        }

        res.send(task)

    }catch(e){

        res.status(500).send(e)

    }
    
    /* Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
        
    }).catch((e) => {
        res.status(500).send(e)
    }) */
})


router.patch('/tasks/:id', async(req,res) => {

    const updates = Object.keys(req.body)

    const allowedUpdates = [ 'completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send( {error: 'Invalid updates!'})
    }

    try{

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})

        const task = await Task.findById(req.params.id)

        updates.forEach((update) =>  task[update] = req.body[update])

        await task.save()

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)

    }catch(e){

        res.status(400).send(e)


    }
})


router.delete('/tasks/:id', async (req,res)=> {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e) {
        res.status(500).send()
    }
})


module.exports = router
