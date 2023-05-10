const express = require('express')
const bodyParser = require("body-parser")
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const app = express()
require('dotenv').config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
        } else {
            console.log(runStderr)
        }
    }
})

app.listen(4567)