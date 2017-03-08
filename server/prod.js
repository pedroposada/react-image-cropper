const express = require('express')
const project = require('../config/project.config')
const compress = require('compression')

const app = express()

// Apply gzip compression
app.use(compress())

app.use(express.static(project.paths.dist()))

app.listen(project.server_port)
console.log(`Server is now running at http://localhost:${project.server_port}.`)
