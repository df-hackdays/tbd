(function() {
  var scriptInject = document.createElement('script');
  scriptInject.innerHTML = `

  var pathArgs = location.hash.split('/');

  if (pathArgs[0] !== '#lesson' || pathArgs[2] !== 'user') {
    alert("Usage: https://beta.scratch.mit.edu/#lesson/{lessonid}/user/{userid}");
  }

  window.lesson = pathArgs[1];
  window.user = pathArgs[3];

  function displayHint() {
    var xmlhttp = new XMLHttpRequest();
    var url = "https://s3.ca-central-1.amazonaws.com/hack-tbd/" + window.lesson;

    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          parseAndShowHint(data);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function parseAndShowHint(lessonState) {
      if (window.currentHint === undefined) {
        window.currentHint = Array.apply(null, Array(lessonState.activities.length)).map(Number.prototype.valueOf,0);
      }

      var currentActivity = lessonState.activities.filter(activity => activity.state === 'CURRENT')[0];
      var hint = currentActivity.hints[window.currentHint[currentActivity.id] % currentActivity.hints.length];
      window.currentHint[currentActivity.id]++;

      alert(hint);
      console.log(AWS);
    }
  }
  `;
  document.head.appendChild(scriptInject);
  var awsInject = document.createElement('script');
  awsInject.src = "https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.320.0/aws-sdk.min.js";
  document.head.appendChild(awsInject);

  	var div = document.createElement('div');
  	div.style.display = 'flex';
  	div.style.width = '200px';
    div.style.align = 'center';
    div.style.verticalAlign = 'middle';

    div.innerHTML = `
      <script>
      </script>
      <div style="display: block;">
        <div style="height: calc(50% - 200px); width: 100px;"></div>
        <button onclick='displayHint()' aria-label="Get Some Help" style="width: 100px; height: 100px; background-color: yellow; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="Get Some Help" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('question.svg') + `"></button>
        <button aria-label="All Done!" style="width: 100px; height: 100px; background-color: mediumSeaGreen; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="All Done!" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('check.svg') + `"></button>
      </div>
      `;

  	document.getElementsByClassName('gui_flex-wrapper_uXHkj box_box_2jjDp')[0].appendChild(div);
   })();
