(function() {
  var awsInject = document.createElement('script');
  awsInject.src = "https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.320.0/aws-sdk.min.js";
  document.head.appendChild(awsInject);
  var scriptInject = document.createElement('script');
  scriptInject.innerHTML = `

  window.sendSqsMessage = message => new Promise((resolve, reject) => {
    const credentials = new AWS.Credentials({ 'accessKeyId': 'AKIAICE3VMSM6HLCQHMA', 'secretAccessKey': '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' });
    AWS.config.credentials = credentials;
    AWS.config.update({ region: 'ca-central-1' });

    window.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    window.params = {
      QueueName: 'tbd-event-intake'
    };

     window.sqs.getQueueUrl(window.params, (err, data) => {
        if (err) {
           reject(err);
        } else {
           window.sqs.sendMessage(
              {
                 MessageBody: JSON.stringify(message),
                 QueueUrl: data.QueueUrl
              },
              (err, data) => {
                 if (err) {
                    reject(err);
                 } else {
                    // sent ok
                    resolve(data);
                 }
              }
           );
        }
     });
  });

  var pathArgs = location.hash.split('/');

  if (pathArgs[0] !== '#lesson' || pathArgs[2] !== 'user') {
    alert("Usage: https://beta.scratch.mit.edu/#lesson/{lessonid}/user/{userid}");
  }

  window.lesson = pathArgs[1];
  window.user = pathArgs[3];

  function refreshCurrentState() {
    var xmlhttp = new XMLHttpRequest();
    var url = "https://s3.ca-central-1.amazonaws.com/hack-tbd/" + window.lesson;

    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        setTimeout(refreshCurrentState, 500);
      }
      if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          parseLesson(data);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function parseLesson(lessonState) {
      var currentActivity = lessonState.activities.filter(activity => activity.state === 'CURRENT')[0];

      if (window.currentActivity === undefined || window.currentActivity.id !== currentActivity.id) {
        window.currentActivity = currentActivity;
        window.currentHint = 0;
      }
    }
  }
  refreshCurrentState();

    function displayHintAndSendEvent() {

      const message = {
        type: 'FEEDBACK',
        status: 'NEED_HELP',
        userId: window.user,
        lessonId: window.lesson,
        activityId: window.currentActivity.id
      };

      sendSqsMessage(message);

      var hint = window.currentActivity.hints[window.currentHint % window.currentActivity.hints.length];
      window.currentHint++;

      alert(hint);
    };

    function displayCheckResultAndSendEvent() {

      var success = true;
      if (Math.random() < 0.6) {
        success = false;
      }

      const message = {
        type: 'FEEDBACK',
        status: (success) ? 'COMPLETED' : 'NEED_HELP',
        userId: window.user,
        lessonId: window.lesson,
        activityId: window.currentActivity.id
      };

      sendSqsMessage(message);

      alert(success ? 'Congratulations! Your solution works!' : 'Oops! You may have to try something else! Your solution doesn\\'t quite work');
  };
  `;
  document.head.appendChild(scriptInject);

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
        <button onclick='displayHintAndSendEvent()' aria-label="Get Some Help" style="width: 100px; height: 100px; background-color: yellow; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="Get Some Help" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('question.svg') + `"></button>
        <button onclick='displayCheckResultAndSendEvent()' aria-label="All Done!" style="width: 100px; height: 100px; background-color: mediumSeaGreen; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="All Done!" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('check.svg') + `"></button>
      </div>
      `;

  	document.getElementsByClassName('gui_flex-wrapper_uXHkj box_box_2jjDp')[0].appendChild(div);
   })();
