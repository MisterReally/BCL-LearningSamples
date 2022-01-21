import { detailsPageAddCustomButton } from './m-button.js';
window.addEventListener("message", (event) => {
  const originsAllowed = [
    'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
  ];
  if (originsAllowed.includes(event.origin)) {
    
    detailsPageAddCustomButton();

  }
},
  false
);