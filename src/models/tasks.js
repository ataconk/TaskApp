const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }

})
const Task = mongoose.model('Task' , taskSchema)

module.exports = Task