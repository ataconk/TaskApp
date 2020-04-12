const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken')
const Task = require('../models/tasks')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0){
                throw new Error('Age must be greater than 0')
            }
        }
    },

    password: {
        type: String,
        required:true,
        trim: true,
        minlength: 7,

        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password can not have  "password" in it')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps:true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.plugin(uniqueValidator)

userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({"_id":user._id.toString()},'task-app-token')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// adı toJSON olduğu için routerda functionı adıyla çağırmak gerekmiyor
userSchema.methods.toJSON = function() {

    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject

}
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        //console.log('here')
        throw new Error('Unable to login')
    }

    
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    
    if(!isMatch){
        console.log('here1')
        throw new Error('Unable to login')
    }
    
    return user
}


userSchema.pre('save', async function(next){

    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
} )

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})

    next()
})


const User = mongoose.model('User' , userSchema )

module.exports = User