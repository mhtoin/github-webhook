const express = require('express')
const bodyParser = require("body-parser")
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const app = express()
require('dotenv').config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    res.send('Hello')
})
app.post('/payload', async (req, res) => {
    let data = req.body ? req.body : ''

    if (data && data.ref && data.ref.includes('main')) {
        console.log('received push to main')
        console.log(data)

        /**
         * Spawn a child process and execute the build and run scripts
         */

        const { stdout: runStdout, stderr: runStderr } = await exec(`sh ${process.env.SCRIPT_PATH}`);

        if (runStdout) {
            console.log(runStdout)
            res.status(200).send('Received and built!')
        } else {
            console.log(runStderr)
            res.status(500).send('Something went wrong!')
        }
    } else {
        console.log('received non-main trigger')
        res.status(200).send('Received!')
    }
})

app.listen(4567, () => {
    console.log('server listening for hooks')
})
