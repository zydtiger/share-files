const fs = require('fs'),
    config = require('../config'),
    path = require('path')

const GB = Math.pow(2, 30),
    MB = Math.pow(2, 20),
    KB = Math.pow(2, 10)

require('./date')

function formatFileSize(rawSize) {
    let size = ''

    if (rawSize > GB) {
        size = (rawSize / GB).toFixed(2) + ' GB'
    } else if (rawSize > MB) {
        size = (rawSize / MB).toFixed(2) + ' MB'
    } else if (rawSize > KB) {
        size = (rawSize / KB).toFixed(2) + ' KB'
    } else {
        size = rawSize.toFixed(2) + ' B'
    }

    return size
}

exports.initEntries = function (reqPath, dirPath) {
    let filenames = fs.readdirSync(dirPath)

    let entries = []
    for (let filename of filenames) {
        let info = fs.lstatSync(path.resolve(dirPath, filename))

        entries.push({
            icon: info.isDirectory() ? 'glyphicon glyphicon-folder-close' : 'glyphicon glyphicon-file',
            color: info.isDirectory() ? 'rgb(0, 183, 255)' : 'gray',
            filename: info.isDirectory() ? filename + '/' : filename,
            filesize: info.isDirectory() ? '-' : formatFileSize(info.size),
            rawsize: info.isDirectory() ? 0 : info.size,
            type: info.isDirectory() ? 'DIR' : 'FILE',
            mtime: info.mtime.format('yyyy/MM/dd hh:mm'),
            link: encodeURI(path.join(reqPath, filename).replace('\\', '/'))
        })
    }

    // do not display the hidden files
    return entries.filter(val => !val.filename.startsWith('.') && !val.filename.startsWith('~'))
}