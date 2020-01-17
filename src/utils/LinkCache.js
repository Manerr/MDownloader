const ytdl = require('ytdl-core');

module.exports = class EDTCache {
    constructor() {
        this.linkList = [];
    }

    addLink(url) {
        return new Promise(resolve => {
            if (!ytdl.validateURL(url)) return resolve(false);

            const videoId = ytdl.getURLVideoID(url);
            if (this.inList(videoId)) return resolve(false);

            ytdl.getInfo(videoId, (err, info) => {
                if (err) return resolve(false);

                const thumbnails = info.player_response.videoDetails.thumbnail.thumbnails;

                resolve(this.addInfos({
                    url: url,
                    videoId: videoId,
                    title: info.title,
                    formats: info.formats,
                    thumbnail: thumbnails[thumbnails.length - 1]
                }));
            });
        });
    }

    addInfos(infos) {
        if (this.inList(infos.videoId)) return false;

        this.linkList.push(infos);
        return true;
    }

    removeVid(videoId) {
        this.linkList = this.linkList.filter(item => item.videoId !== videoId);
    }

    inList(videoId) {
        return this.linkList.filter(item => item.videoId === videoId).length > 0;
    }

    getLinkList() {
        return this.linkList;
    }
}