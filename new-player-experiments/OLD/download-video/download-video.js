videojs.registerPlugin('downloadVideo', function() {
  // Create variables and new div, anchor and image for download icon
  var myPlayer = this,
    videoName,
    totalRenditions,
    mp4Ara = [],
    highestQuality,
    spacer,
    newElement = document.createElement('div'),
    newLink = document.createElement('a'),
    newImage = document.createElement('img');

  myPlayer.on('loadstart', function() {
    //Reinitialize array of MP4 renditions in case used with playlist
    //This prevents the array having a cumulative list for all videos in playlist
    mp4Ara = [];

    // +++ Get video name and the MP4 renditions +++
    videoName = myPlayer.mediainfo['name'];
    rendtionsAra = myPlayer.mediainfo.sources;
    totalRenditions = rendtionsAra.length;

    // +++ Loop over videos and extract only MP4 versions +++
    for (var i = 0; i < totalRenditions; i++) {
      if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
        mp4Ara.push(rendtionsAra[i]);
      };
    };

    // +++ Sort the renditions from highest to lowest on size+++
    mp4Ara.sort(function(a, b) {
      return b.size - a.size;
    });

    // +++ Extract the highest rendition +++
    highestQuality = mp4Ara[0].src;

    // +++ Build the download button element +++
    newElement.id = 'downloadButton';
    newElement.className = 'downloadStyle vjs-control';
    newImage.setAttribute('src', 'http://solutions.brightcove.com/bcls/brightcove-player/download-video/file-download.png');
    newLink.setAttribute('href', highestQuality);
    newLink.setAttribute('download', videoName);
    newLink.appendChild(newImage);
    newElement.appendChild(newLink);

    // +++ Place the download button +++
    // Get a handle on the spacer element
    spacer = myPlayer.controlBar.customControlSpacer.el();
    // Set the content of the spacer to be right justified
    spacer.setAttribute("style", "justify-content: flex-end;");
    // Place the new element in the spacer
    spacer.appendChild(newElement);
  })
});
