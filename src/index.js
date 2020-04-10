const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const auth = require('./middleware/auth')



bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT || 3000


/* app.use((req,res,next) => {
    if(req.method === 'GET') {
        res.send('GET req disabled')
    }else {
        next()
    }
}) */



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses



app.listen(port, () => {
    console.log('Server is running on '+ port)
})



