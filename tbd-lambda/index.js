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
            return writeDoc(message.id, message);
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
