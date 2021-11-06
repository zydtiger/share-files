const express = require('express')
const os = require('os')

global.log = console.log
global.err = console.error
global.join = require('path').join
global.root = __dirname + '/..'
global.public = join(os.homedir(), '.public')
global.name = 'Admin'
global.pass = 'KQVdjsty256'

const app = express()

app.use('/lib/', express.static(root + '/lib/'))
app.use('/scripts/', express.static(root + '/scripts/'))
app.use('/', express.static(public))

app.set('views', join(root, '/views/'))
app.engine('html', require('express-art-template'))

app.use(require('./router'))

const server = app.listen(4000, () => {
    log(`Server at ${server.address().address}:${server.address().port}`)
})