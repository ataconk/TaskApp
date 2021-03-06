const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
bodyParser = require('body-parser');
const auth = require('../middleware/auth')

router.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
router.use(bodyParser.json()); // Send JSON responses

router.post('/tasks', auth, async (req,res) =>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    }catch(e){
        
        res.status(400).send('hele' + e)
    }
})

router.get('/tasks', auth, async (req,res) => {

    try{
        const tasks =  await Task.find({owner: req.user._id})
        // does the same thing code above
        //await req.user.populate('tasks').execPopulate()

        res.send(tasks)

    }catch(e) {
        
        res.status(500).send(e)
    }
})


router.get('/tasks/:id', auth, async (req,res) => {

    const _id = req.params.id

    try{

        const task = await Task.findOne({_id, owner:req.user._id})

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


router.patch('/tasks/:id', auth, async(req,res) => {

    const updates = Object.keys(req.body)

    const allowedUpdates = [ 'completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send( {error: 'Invalid updates!'})
    }

    try{

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})

        const task = await Task.findById({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) =>  task[update] = req.body[update])

        await task.save()
        res.send(task)

    }catch(e){

        res.status(400).send(e)


    }
})


router.delete('/tasks/:id', auth, async (req,res)=> {

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e) {
        res.status(500).send()
    }
})


module.exports = router
