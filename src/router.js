const express = require('express'),
    fs = require('fs'),
    lib = require('./lib'),
    auth = require('basic-auth'),
    safeCompare = require('safe-compare'),
    sha256 = require('sha256'),
    config = require('../config'),
    path = require('path')

const router = express.Router()

// match urls that do not start with /lib/ and /scripts/ or end with favicon.ico
router.get(/^\/(?!(lib\/|scripts\/)).*(?<!favicon\.ico)$/, (req, res) => {
    let reqPath = decodeURI(req.path)

    if (reqPath.startsWith('/secured')) {
        authenticate(req, res, () => renderEntries(res, reqPath))
    } else renderEntries(res, reqPath)
})

function renderEntries(res, reqPath) {
    let dirpath = path.resolve(config.public, reqPath.slice(1))
    config.log('[Accessing]\t', dirpath)
    try {
        if (fs.lstatSync(dirpath).isDirectory()) {
            res.render('index.html', {
                reqPath: reqPath,
                entries: lib.initEntries(reqPath, dirpath)
            })
        }
    } catch (e) {
        config.err(e)
        res.render('404.html', {
            err: e
        })
    }
}

function validate(name, pass) {
    return safeCompare(sha256(name), global.name) && safeCompare(sha256(pass), global.pass)
}

function authenticate(req, res, done) {
    let credentials = auth(req)

    if (!credentials || !validate(credentials.name, credentials.pass)) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="secured folder"')
        res.end('Access denied')
    } else done()
}

module.exports = router