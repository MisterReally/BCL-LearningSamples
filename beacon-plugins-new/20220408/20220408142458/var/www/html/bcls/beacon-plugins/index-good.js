import { addCustomButtonDetails, addCustomButtonDetailsParams, handleButtonClick } from './button-module.js';
import { populateMidPageDiv, clearMidPageDiv } from './div-mid-page-module.js';
import { populateAppOverflowDiv, clearAppOverflowDiv } from './div-app-overflow-module.js';
import { openSidePanel, populateSidePanel, clearSidePanel } from './side-panel-module.js';

//import { data } from './m-data.js';


window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-west-2.qa.deploys.brightcove.com',
    'https://beacon-web.ott.us-west-2.stage.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    openSidePanel();
    switch (event.data.event) {

      case 'detailsPageExternalButtonWasClicked':
        console.log('button ID', event.data.data.element_id);
        if (event.data.data.element_id == 'download-button') {
          handleButtonClick('Download button');
        };
        if (event.data.data.element_id == 'location-button') {
          handleButtonClick('Location button');
        };
        break;

      case 'onPlayerSidePanelDisplay':
        populateSidePanel();
        break;

      case 'onPlayerSidePanelDisappear':
        clearSidePanel();
        break;

      case 'onBeaconPageLoad':
        //data();
        //console.log('panelData value', panelData);
        populateMidPageDiv();
        addCustomButtonDetailsParams('Download', 'fa fa-info-circle', 'download-button');
        addCustomButtonDetailsParams('Location', 'fa fa-info-circle', 'location-button');
        // detailsPageAddCustomButton();
        populateAppOverflowDiv();
        break;
    }
  }
},
false
);