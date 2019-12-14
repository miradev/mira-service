import express from 'express'
const app = express()

app.get('/', (_, res) => {
    res.send('Welcome to the Mira backend service!')
})

console.log("Server started on port 8000")
app.listen(8000)
