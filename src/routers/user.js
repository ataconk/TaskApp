const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const auth = require('../middleware/auth')

bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
router.use(bodyParser.json()); // Send JSON responses


router.post('/users', async (req,res) =>{
    const user = new User(req.body)


    try {

        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
        
    }catch(e) {

        res.status(400).send(e)
    }


    /* user.save().then(() => {
        res.send(user)
    }).catch((e) => {
        res.status(400)
        res.send(e)

    }) */
})


router.post('/users/logout', auth, async (req,res)=> {

    try{
        // ??? 111
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req,res)=> {

    try{
        // ??? 111
        req.user.tokens = []

        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req,res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
      
    }catch(e){
        res.status(400).send(e)
    }

    
})

router.get('/users/me',auth, async (req,res) => {

    res.send(req.user)
})


router.get('/users', async (req,res) => {

    try {
        const users = await User.find({})
        res.send(users)

    }catch(e) {

        res.status(500).send(e)

    }
})

router.patch('/users/me',auth, async(req,res) => {

    const updates = Object.keys(req.body)

    const allowedUpdates = [ 'name', 'email','password', 'age' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send( {error: 'Invalid updates!'})
    }

    try{
        updates.forEach((update) =>  req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    }catch(e){

        res.status(400).send(e)


    }
})

router.delete('/users/me', auth, async (req,res)=> {

    try {
        
        await req.user.remove()
        res.send(req.user)
    }catch(e) {
        res.status(500).send()
    }
})




module.exports = router