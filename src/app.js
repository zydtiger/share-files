const express = require('express'),
    path = require('path'),
    config = require('../config')

const app = express()

app.use('/lib76b5a357391276b282a516f54f48ef3c207f46d8192dc58c208d5183d38415f8/', express.static(path.resolve(config.root, 'lib/')))
app.use('/scripts8c5967fd8486f34493710cc39b240aad46536cf4ee421ffd0479e6542db03e36/', express.static(path.resolve(config.root, 'scripts/')))
app.use('/', express.static(config.public))

console.log(config.public)

app.set('views', path.resolve(config.root, 'views/'))
app.engine('html', require('express-art-template'))

app.use(require('./router'))

const server = app.listen(4000, () => {
    config.log(`Server at ${server.address().address}:${server.address().port}`)
})