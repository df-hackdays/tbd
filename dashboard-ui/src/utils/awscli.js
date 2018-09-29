const
   AWS = require('aws-sdk'),
   axios = require('axios');

const credentials = new AWS.Credentials({
   accessKeyId: 'AKIAICE3VMSM6HLCQHMA',
   secretAccessKey: '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'
});
AWS.config.credentials = credentials;
AWS.config.update({ region: 'ca-central-1' });

const
   sqs = new AWS.SQS({ apiVersion: '2012-11-05' }),
   params = {
      QueueName: 'tbd-event-intake'
   };

export const sendMessage = message => new Promise((resolve, reject) => {
   sqs.getQueueUrl(params, (err, data) => {
      if (err) {
         reject(err);
      } else {
         sqs.sendMessage(
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

export const fetchLesson = lessonId => axios.get(
   `https://s3.ca-central-1.amazonaws.com/hack-tbd/${lessonId}`
).then(resp => resp.data);
