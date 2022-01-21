const fillInDivs = () => {
  window.postMessage({


window.addEventListener("message",
  (event) => {
    const originsAllowed = [
      'https://beacon-web.ott.us-east-1.qa.deploys.brightcove.com'
    ];
    if (originsAllowed.includes(event.origin)) {


      switch (event.data.event) {
        
        case 'onBeaconPageLoad':
          if (event.data.data.page_type === 'details') {

            //Add to midPageSection
            var midPageSection = document.getElementById('beacon_details_mid_page_section');
            var para1 = document.createElement("p");
            var t1 = document.createTextNode("Lorem ipsum dolor sit amet. Vel quos harum quo obcaecati nostrum et dolore quia id quia voluptatem id odio iure et saepe totam est minima dicta. Id veritatis tenetur est tempora omnis sed quibusdam delectus 33 deleniti labore ut totam totam ut esse autem est consectetur placeat. Et sequi vitae vel praesentium ducimus a consequuntur ipsam id magnam voluptates ea esse eaque et magni illum. Non ipsum quasi id deleniti blanditiis rem consequatur omnis aut tempora voluptatem eum fugit debitis. Qui delectus perspiciatis quo tempore omnis aut dolor modi sit nulla internos ab dolorem sint. Qui accusamus ut asperiores nobis et sequi minus eos omnis omnis et accusantium voluptatem aut quam molestias.");
            para1.appendChild(t1);
            midPageSection.appendChild(para1);

            //Add to beacon-web-app-overflow
            var webAppOverflow = document.getElementById('beacon-web-app-overflow');
            var para2 = document.createElement("p");
            var t2 = document.createTextNode("This is beacon-web-app-overflow.");
            para2.appendChild(t2);
            webAppOverflow.appendChild(para2);
          }
          break;
            
        default:
        // code block
        }
    } else {
      alert('Invalid origin');
    }
  },
  false
);