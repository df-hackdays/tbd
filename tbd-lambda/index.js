const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });

const bucketName = 'hack-tbd';

exports.handler = (event, context, callback) => {
   Promise
       .all(
           (event.Records || [])
               .map(record => JSON.parse(record.body))
               .map(handleMessage)
       )
       .catch(err => console.error(err))
       .then(() => {
           const response = {
               statusCode: 200
           };

           callback(null, response);
       });
};

const handleMessage = message => {
    // read from s3

    // reduce the message
    console.log(message);

    // persist to s3
    switch (message.type) {
        case 'newLesson':
            return writeDoc(message.id, newLesson(message.id));
        case 'FEEDBACK':
            return reduceStudentEvent(message).then(function (doc) { writeDoc(message.lessonId, doc); });
        default:
            return new Promise(
                (resolve, reject) => reject(new Error('unknown message type'))
            );
    }
};

const readDoc = key => new Promise((resolve, reject) => {
    const s3 = new AWS.S3();

    s3.getObject(
        {
            Bucket: bucketName,
            Key: key
        },
        (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data.Body));
            }
        }
    );
});

const writeDoc = (key, doc) => new Promise((resolve, reject) => {
    const s3 = new AWS.S3();

    s3.putObject(
        {
            Body: JSON.stringify(doc),
            Bucket: bucketName,
            Key: key,
            ContentType: 'application/json'
        },
        (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        }
    );
});

const reduceStudentEvent = message => {
  return readDoc(message.lessonId).then(function (doc) {
    var time = new Date();
    message.timestamp = time.toJSON();
    doc.events.push(message);

    var studentEvents = doc.events.filter(event => event.status === 'NEED_HELP').filter(event => event.userId === message.userId);
    var currentActivity = doc.activities.filter(act => act.state === 'CURRENT')[0].id;
    var studentActivityEvents = studentEvents.filter(event => event.activityId === currentActivity);

    var studentOverallScore = Math.max(1.0 - studentEvents.length * Math.floor(((time - new Date(doc.activities[0].startTime))/1000)/60) / 8, 0);
    var studentActivityScore = Math.max(1.0 - studentActivityEvents.length * Math.floor(((time - new Date(doc.activities[currentActivity].startTime))/1000)/60) / 8, 0);

    doc.students[message.userId].activityStudyFactor = (message.status === 'COMPLETED') ? 1.0 : studentActivityScore;
    doc.students[message.userId].overallStudyFactor = studentOverallScore;
    doc.students[message.userId].activityFeedbackState = message.status;

    return doc;
  });
}

const newLesson = id => {
  var template = {
    type: 'RainbowsAndDragons',
    name: 'CLC K12 Summer Workshop Rainbow and Dragons',
    activities: [
      {
        id: 0,
        name: 'Introducing the Dragon',
        hints: [
          "Clicking and dragging an element from the left panel to the middle panel will add code to your game!",
          "Have you considered creating a variable that is called Dragon?",
          "If your current code doesn't work try looking at the problem a different way."
        ],
        state: 'CURRENT'
      },
      {
        id: 1,
        name: 'Add a Rainbow',
        hints: [
          "This problem is very similar to the last one, but with a new variable type!",
          "Have you considered creating a variable that is called Rainbow?",
          "If your current code doesn't work try looking at the problem a different way."
        ],
        state: 'UNSTARTED'
      },
      {
        id: 2,
        name: 'The Dragons Multiply',
        hints: [
          "Clicking and dragging an element from the left panel to the middle panel will add code to your game!",
          "Have you considered creating a variable that is called Dragon?",
          "If your current code doesn't work try looking at the problem a different way."
        ],
        state: 'UNSTARTED'
      },
      {
        id: 3,
        name: 'Dragons Breathe Rainbows',
        hints: [
          "Clicking and dragging an element from the left panel to the middle panel will add code to your game!",
          "Have you considered creating a variable that is called Dragon?",
          "If your current code doesn't work try looking at the problem a different way."
        ],
        state: 'UNSTARTED'
      },
      {
        id: 4,
        name: 'Loop the Rainbows',
        hints: [
          "Clicking and dragging an element from the left panel to the middle panel will add code to your game!",
          "Have you considered creating a variable that is called Dragon?",
          "If your current code doesn't work try looking at the problem a different way."
        ],
        state: 'UNSTARTED'
      }
    ],
    events: [],
    students: {
      'student_id_1': {
         id: 'student_id_1',
         name: 'Little Tommy & Sarah',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      },
      'student_id_2': {
         id: 'student_id_2',
         name: 'Bill & Blake',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      },
      'student_id_3': {
         id: 'student_id_3',
         name: 'Morgan & Jane',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      },
      'student_id_4': {
         id: 'student_id_4',
         name: 'Jill & Jack',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      },
      'student_id_5': {
         id: 'student_id_5',
         name: 'Rex & Amanda',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      },
      'student_id_6': {
         id: 'student_id_6',
         name: 'Bohdan & Meghana',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      },
      'student_id_7': {
         id: 'student_id_7',
         name: 'Chen & Yuri',
         activityFeedbackState: "",
         activityStudyFactor: 1.0,
         overallStudyFactor: 1.0
      }
    }
  };

  template.id = id;
  template.activities[0].startTime = new Date().toJSON();

  return template;
}
