
// start with undefined to match into the else branch of the first choice
var nameMode, dateMode, sizeMode, typeMode

function applyNewFiles(nfiles) {
    $('#files').html('')
    for (let file of nfiles) $('#files').append(file)
}

function clearCarets() {
    $('th .caret').remove()
}

function flipCaret(elem, deg) {
    $(elem + ' .caret').css('transform', `rotate(${deg}deg)`)
}

function addCaret(elem) {
    $(elem).append('<span class="caret"></span>')
}

function sortByName() {
    clearCarets()
    addCaret('#name-sort')

    if (nameMode === 'ascend') {
        nameMode = 'descend'
        flipCaret('#name-sort', 0)
    } else {
        nameMode = 'ascend'
        flipCaret('#name-sort', 180)
    }

    let files = $('#files tr')
    files.sort((a, b) => {
        let aname = $(a).children('.filename').text().trim()
        let bname = $(b).children('.filename').text().trim()

        if (aname < bname) return nameMode === 'descend' ? 1 : -1
        else return nameMode === 'descend' ? -1 : 1
    })

    applyNewFiles(files)
}

function sortByDate() {
    clearCarets()
    addCaret('#date-sort')

    if (dateMode === 'descend') {
        dateMode = 'ascend'
        flipCaret('#date-sort', 180)
    } else {
        dateMode = 'descend'
        flipCaret('#date-sort', 0)
    }

    let files = $('#files tr')
    files.sort((a, b) => {
        let atime = $(a).children('.mtime').text().trim()
        let btime = $(b).children('.mtime').text().trim()

        if (atime < btime) return dateMode === 'descend' ? 1 : -1
        else return dateMode === 'descend' ? -1 : 1
    })

    applyNewFiles(files)
}

function sortBySize() {
    clearCarets()
    addCaret('#size-sort')

    if (sizeMode === 'descend') {
        sizeMode = 'ascend'
        flipCaret('#size-sort', 180)
    } else {
        sizeMode = 'descend'
        flipCaret('#size-sort', 0)
    }

    let files = $('#files tr')
    files.sort((a, b) => {
        let asize = +$(a).children('.rawsize').text().trim()
        let bsize = +$(b).children('.rawsize').text().trim()

        if (asize < bsize) return sizeMode === 'descend' ? 1 : -1
        else return sizeMode === 'descend' ? -1 : 1
    })

    applyNewFiles(files)
}

function sortByType() {
    clearCarets()
    addCaret('#type-sort')

    if (typeMode === 'dir') {
        typeMode = 'file'
        flipCaret('#type-sort', 180)
    } else {
        typeMode = 'dir'
        flipCaret('#type-sort', 0)
    }

    let files = $('#files tr')
    files.sort((a, b) => {
        let atype = $(a).children('.type').text().trim()

        if (atype === 'FILE') return typeMode === 'dir' ? 1 : -1
        else return typeMode === 'dir' ? -1 : 1
    })

    applyNewFiles(files)
}


// default is to sort by date
$(() => sortByDate())