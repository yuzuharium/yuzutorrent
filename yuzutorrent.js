var WebTorrent = require('webtorrent')

YuzuTorrent = function(){
    this.torrentFile = null
    this.downloadDirectory = null
    this.whileDownloading = null // function with a single argument, bytes
    this.whenDownloaded = null
}

YuzuTorrent.prototype.setTorrentFile = function(torrentFile){
    this.torrentFile = torrentFile
}

YuzuTorrent.prototype.setDownloadDirectory = function(directory){
    this.downloadDirectory = directory
}

YuzuTorrent.prototype.setWhileDownloading = function(callback){
    this.whileDownloading = callback
}

YuzuTorrent.prototype.setWhenDownloaded = function(callback){
    this.whenDownloaded = callback
}

YuzuTorrent.prototype.download = function(){
    if (!(this.torrentFile && this.downloadDirectory)){
        throw new Error('Either torrentFile or downloadDirectory not set')
    }

    var that = this
    var client = new WebTorrent()
    client.add(this.torrentFile, {path: this.downloadDirectory}, function(torrent){
        if (that.whileDownloading){
            torrent.on('download', function(bytes){
                that.whileDownloading(torrent, bytes)
            })
        }
        if (that.whenDownloaded){
            torrent.on('done', that.whenDownloaded)
        }
    })
}

module.exports = YuzuTorrent