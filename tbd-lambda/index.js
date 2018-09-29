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
        .then(() => {
            const response = {
                statusCode: 204,
                // body: ""
            };

            callback(null, response);
        })
        .catch(callback);
};

const handleMessage = message => {
    // read from s3

    // reduce the message
    console.log(message);

    // persist to s3
    switch (message.type) {
        case 'newLesson':
            return writeDoc(message.id, newLesson(message.id));
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

const newLesson = id => {
  var template = {
    type: 'RainbowsAndDragons',
    name: 'CLC K12 Summer Workshop Rainbow and Dragons',
    activities: [
      {
        name: 'Introducing the Dragon',
        state: 'CURRENT'
      },
      {
        name: 'Add a Rainbow',
        state: 'UNSTARTED'
      },
      {
        name: 'The Dragons Multiply',
        state: 'UNSTARTED'
      },
      {
        name: 'Dragons Breathe Rainbows',
        state: 'UNSTARTED'
      },
      {
        name: 'Loop the Rainbows',
        state: 'UNSTARTED'
      }
    ],
    students: {
      'student_id_1': {
         id: 'student_id_1',
         name: 'Little Tommy & Sarah',
         studyFactor: 1.0
      },
      'student_id_2': {
         id: 'student_id_2',
         name: 'Bill & Blake',
         studyFactor: 1.0
      },
      'student_id_3': {
         id: 'student_id_3',
         name: 'Morgan & Jane',
         studyFactor: 1.0
      },
      'student_id_4': {
         id: 'student_id_4',
         name: 'Jill & Jack',
         studyFactor: 1.0
      },
      'student_id_5': {
         id: 'student_id_5',
         name: 'Rex & Amanda',
         studyFactor: 1.0
      },
      'student_id_6': {
         id: 'student_id_6',
         name: 'Bohdan & Meghana',
         studyFactor: 1.0
      },
      'student_id_7': {
         id: 'student_id_7',
         name: 'Chen & Yuri',
         studyFactor: 1.0
      }
    }
  };

  template.id = id;
  template.activities[0].startTime = new Date().toJSON();

  return template;
}
