'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports.handler = (event, context, callback) => {
  //const body = event.body;
  const data = JSON.parse(event.body);
  console.log('============> text is', data.text);

  if (data.text && typeof (data.text) !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Body did not contain a text property.'));
    return;
  }

  const params = {
      TableName: 'BlogTable',
      Item: {
        article_id: uuid.v1(),
        text: data.text
      },
  };

  const putCallback = (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Could not save record'));
      return;
    }

    console.log('result is', result);

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };

    callback(null, response);
  }

  dynamo.put(params, putCallback);
};
