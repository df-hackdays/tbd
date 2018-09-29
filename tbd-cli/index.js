const AWS = require('aws-sdk');
//const proxy = require('proxy-agent');

const credentials = new AWS.SharedIniFileCredentials({
   profile: 'hack'
});
AWS.config.credentials = credentials;
AWS.config.update({ region: 'ca-central-1' });
//AWS.config.update({ httpOptions: { agent: proxy('a-proxy')}});

const
   sqs = new AWS.SQS({ apiVersion: '2012-11-05' }),
   params = {
      QueueName: 'tbd-event-intake'
   };

exports.sendMessage = message => new Promise((resolve, reject) => {
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

exports.sendMessage({
   type: 'newLesson',
   id: '123',
   name: 'CLC K12 Summer Workshop Rainbow and Dragons',
   activities: [
      {
         id: '2',
         name: 'Basics of variables',
         feedbacks: [
            {
               state: 'ok',
               student: 'student_id_1'
            }
         ]
      }
   ],
   students: {
      'student_id_1': {
         id: 'student_id_1'
      }
   }
});
