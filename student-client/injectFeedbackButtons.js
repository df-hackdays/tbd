(function () {
  var awsInject = document.createElement('script');
  awsInject.src = "https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.320.0/aws-sdk.min.js";
  document.head.appendChild(awsInject);
  var scriptInject = document.createElement('script');
  var styleInject = document.createElement('style');
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


   function displayHintAndSendEvent() {
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

     const message = {
       type: 'FEEDBACK',
       status: 'NEED_HELP',
       user: window.user
     };

     sendSqsMessage(message);

     function parseAndShowHint(lessonState) {
       if (window.currentHint === undefined) {
         window.currentHint = Array.apply(null, Array(lessonState.activities.length)).map(Number.prototype.valueOf,0);
       }

       var currentActivity = lessonState.activities.filter(activity => activity.state === 'CURRENT')[0];
       var hint = currentActivity.hints[window.currentHint[currentActivity.id] % currentActivity.hints.length];
       window.currentHint[currentActivity.id]++;

        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 100000);

     }
   };

   function displayCheckResultAndSendEvent() {

     var success = true;
     if (Math.random() < 0.6) {
       success = false;
     }

     const message = {
       type: 'FEEDBACK',
       status: (success) ? 'COMPLETED' : 'NEED_HELP',
       user: window.user
     };

     sendSqsMessage(message);

     alert(success ? 'Congratulations! Your solution works!' : 'Oops! You may have to try something else! Your solution doesn\\'t quite work');
 };
 `;

  styleInject.innerHTML = `
 
     /* The snackbar - position it at the bottom and in the middle of the screen */
     #snackbar {
        visibility: hidden; /* Hidden by default. Visible on click */
        min-width: 250px; /* Set a default minimum width */
        margin-left: -125px; /* Divide value of min-width by 2 */
        background-color: #333; /* Black background color */
        color: #fff; /* White text color */
        text-align: center; /* Centered text */
        border-radius: 2px; /* Rounded borders */
        padding: 16px; /* Padding */
        position: fixed; /* Sit on top of the screen */
        z-index: 1; /* Add a z-index if needed */
        left: 50%; /* Center the snackbar */
        bottom: 30px; /* 30px from the bottom */
     }

     /* Show the snackbar when clicking on a button (class added with JavaScript) */
     #snackbar.show {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar. 
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
     }

     /* Animations to fade the snackbar in and out */
     @-webkit-keyframes fadein {
        from {bottom: 0; opacity: 0;} 
        to {bottom: 30px; opacity: 1;}
     }

     @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
     }

     @-webkit-keyframes fadeout {
        from {bottom: 30px; opacity: 1;} 
        to {bottom: 0; opacity: 0;}
     }

     @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
     }
 `


  document.head.appendChild(scriptInject);
  document.head.appendChild(styleInject);

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
       <button onclick='displayHintAndSendEvent()' aria-label="Get Some Help" style="width: 100px; height: 100px; background-color: gold; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="Get Some Help" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('question.svg') + `"></button>
       <button onclick='displayCheckResultAndSendEvent()' aria-label="All Done!" style="width: 100px; height: 100px; background-color: limeGreen; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="All Done!" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('check.svg') + `"></button>
     </div>
     `;

  document.getElementsByClassName('gui_flex-wrapper_uXHkj box_box_2jjDp')[0].appendChild(div);

  var hint = document.createElement('div');
  hint.innerHTML = `
     <div id="snackbar">Some text some message..</div>

  `
  document.getElementsByClassName('gui_flex-wrapper_uXHkj box_box_2jjDp')[0].appendChild(hint);   

})();
