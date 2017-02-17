// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const dialog = remote.dialog
const browserWindow = remote.BrowserWindow
const YuzuTorrent = require('./yuzutorrent')

var $taskList = document.getElementById('task-list')

var addSlot = function(file, dir){
    var $info = document.createElement('p')
    var $progressBar = document.createElement('div')
    $progressBar.className = 'progress-bar'
    var $task = document.createElement('li')
    $task.classList.add('task')
    $task.appendChild($info)
    $task.appendChild($progressBar)
    $taskList.appendChild($task)

    var yuzuTorrent = new YuzuTorrent()
    yuzuTorrent.setTorrentFile(file)
    yuzuTorrent.setDownloadDirectory(dir)
    yuzuTorrent.setWhileDownloading(function(torrent, bytes){
        var file = torrent.files[0]
        var numPeers = torrent.numPeers
        var percent = Math.round(torrent.progress * 100 * 100) / 100
        $info.innerHTML = file.name + ' ' + percent + '%' + ' Peers:' + numPeers
        $progressBar.style.width = percent + '%'
    })
    yuzuTorrent.setWhenDownloaded(function(){
        $task.style.backgroundColor = '#008CBA'
        console.log('done!')
    })
    yuzuTorrent.download()

}

var torrentFilePath = null
var saveDirectoryPath = '.'

document.getElementById('torrent-file').addEventListener('click', function(e){
    dialog.showOpenDialog(null, {
        properties: ['openFile'],
        title: 'ファイル選択',
        defaultPath: '.',
        filters: [
            {name: 'torrentファイル', extensions: ['torrent']}
        ]
    }, function(files){
        torrentFilePath = files[0]
    })
})

document.getElementById('directory').addEventListener('click', function(e){
    dialog.showOpenDialog(null, {
        properties: ['openDirectory'],
        title: '保存先ディレクトリ選択',
        defaultPath: saveDirectoryPath
    }, function(dirs){
        saveDirectoryPath = dirs[0]
    })
})

document.getElementById('download').addEventListener('click', function(e){
    console.log(torrentFilePath)
    console.log(saveDirectoryPath)
    addSlot(torrentFilePath, saveDirectoryPath)
})
