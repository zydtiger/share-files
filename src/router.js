const express = require('express'),
    fs = require('fs'),
    lib = require('./lib'),
    auth = require('basic-auth'),
    safeCompare = require('safe-compare')

const router = express.Router()

// match urls that do not start with /lib/ and /scripts/ or end with favicon.ico
router.get(/^\/(?!(lib\/|scripts\/)).*(?<!favicon\.ico)$/, (req, res) => {
    let reqPath = decodeURI(req.path)

    let path = join(public, reqPath)

    if (reqPath.startsWith('/secured')) {
        authenticate(req, res, validate, () => renderEntries(res, reqPath, path))
    } else renderEntries(res, reqPath, path)

})

function renderEntries(res, reqPath, path) {
    log('[Accessing]\t', path)
    try {
        if (fs.lstatSync(path).isDirectory()) {
            res.render('index.html', {
                reqPath: reqPath,
                entries: lib.initEntries(reqPath, path)
            })
        }
    } catch (e) {
        err(e)
        res.render('404.html', {
            err: e
        })
    }
}

function validate(name, pass) {
    return safeCompare(name, global.name) && safeCompare(pass, global.pass)
}

function authenticate(req, res, check, done) {
    let credentials = auth(req)

    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="secured folder"')
        res.end('Access denied')
    } else done()
}

module.exports = router