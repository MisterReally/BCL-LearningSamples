videojs.registerPlugin('kioskApp', function() {
  var myPlayer,
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy.php',
    cmsURL = 'https://cms.api.brightcove.com/v1/accounts/',
    totalCalls,
    callNumber = 0,
    allVideoObjects = [],
    currentlyPlayingIndex;

  videojs("myPlayerID").ready(function() {
    myPlayer = this;
    // Define key variables
    var videoIDs = [],
      videoObjects = [],
      videoCount,
      videoIDRequest = {},
      videoCountRequest = {};

    // +++ Setup for video count CMS API request +++
    videoCountRequest = setRequestData('getCount');
    // Use CMSAPI to get video count
    getCMSAPIData(videoCountRequest, function(parsedData) {
      // Extract count from returned data
      videoCount = parsedData.count;
      // Calculate number of calls that must be made
      // ask for 25 at a time (recommended best practice)
      totalCalls = Math.ceil(videoCount / 25);
      // Loop over requests for videos
      do {
        // Setup for video info CMS API request
        videoIDRequest = setRequestData('getIDs');
        // Use CMS API to get each block of videos
        getCMSAPIData(videoIDRequest, function(parsedData) {
          // Call function to extract IDs from video info
          videoIDs = extractVideoData(parsedData);
          // Call function to get video objects per IDs
          getVideoData(videoIDs, function(videoObjects) {
            //Push returned array into master array
            Array.prototype.push.apply(allVideoObjects, videoObjects);
            console.table(allVideoObjects);
            // Check if all video objects have been returned
            if (allVideoObjects.length === videoCount) {
              // If all video objects returned, call function to start playing first video
              beginPlayingVideos();
            }
          })
        });
        // Increment call number so calls eventually stop
        callNumber++;
      }
      while (callNumber <= totalCalls - 1);
    });

    // +++ Get next video +++
    /**
     * On end of each video progress to next video
     * or if the last video start again
     */
    myPlayer.on('ended', function() {
      if (currentlyPlayingIndex <= allVideoObjects.length) {
        currentlyPlayingIndex++;
        myPlayer.catalog.load(allVideoObjects[currentlyPlayingIndex]);
        myPlayer.play();
      } else {
        myPlayer.catalog.load(allVideoObjects[0]);
        myPlayer.play();
        currentlyPlayingIndex = 0;
      }
    }); // End of add event listener

  });

  /**
   * sets up the data for the API request
   */
  function setRequestData(task) {
    var accountId = '1752604059001',
      videoName,
      requestURL,
      endPoint,
      requestData = {},
      dataReturned = false;
    // Determine if setting up to get video count or video IDs
    switch (task) {
      case 'getCount':
        requestURL = cmsURL + accountId + '/counts/videos';
        break;
      case 'getIDs':
        requestURL = cmsURL + accountId + '/videos?limit=25&offset=' + 25 * callNumber;
        break;
    }
    requestData.url = requestURL;
    requestData.requestType = 'GET';
    // Return the request object
    return requestData;
  }

  // +++ Standard functionality for CSM API call +++
  /**
   * This function is used for all calls to CMS API and
   *  returns the JSON parsed data, whatever that may be
   */
  function getCMSAPIData(options, callback) {
    var httpRequest = new XMLHttpRequest(),
      responseRaw,
      parsedData,
      requestParams;
    // set up request data
    requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType;
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // open and send request
    httpRequest.send(requestParams);
    // response handler
    function getResponse() {
      dataReturned = false;
      try {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            responseRaw = httpRequest.responseText;
            parsedData = JSON.parse(responseRaw);
            dataReturned = true;
            callback(parsedData);
          } else {
            alert('There was a problem with the request. Request returned ' + httpRequest.status);
          }
        }
      } catch (e) {
        alert('Caught Exception: ' + e);
      }
    }
  }

  // +++ Extract video IDs  +++
  /**
   * extract video data from CMS API response
   * @param {array} cmsData the data from the CMS API
   * @return {array} videoData array of video info
   */
  function extractVideoData(cmsData) {
    var i,
      iMax = cmsData.length,
      videoItem,
      videoDataForReturn = [];
    for (i = 0; i < iMax; i++) {
      if (cmsData[i].id !== null) {
        videoItem = {};
        videoItem.id = cmsData[i].id;
        videoDataForReturn.push(videoItem);
      }
    }
    return videoDataForReturn;
  }

  /**
   * get video objects
   * @param {array} videoIds array of video ids
   * @return {array} videoData array of video objects
   */
  function getVideoData(videoIds, callback) {
    var i = 0,
      iMax = videoIds.length,
      videoObjectsForReturn = [];

    /**
     * makes catalog calls for all video ids in the array
     */
    getVideo();

    function getVideo() {
      if (i < iMax) {
        myPlayer.catalog.getVideo(videoIds[i].id, pushData);
      } else {
        callback(videoObjectsForReturn);
      }
    }

    /**
     * callback for the catalog calls
     * pushes the returned data object into an array
     * @param {string} error error returned if the call fails
     * @parap {object} video the video object
     */
    function pushData(error, video) {
      videoObjectsForReturn.push(video);
      i++;
      getVideo();
    }
  }

  // +++ Plays first video +++
  /**
   * Starts initial playback of videos
   */
  function beginPlayingVideos() {
    myPlayer.catalog.load(allVideoObjects[0]);
    myPlayer.play();
    currentlyPlayingIndex = 0;
}});
