
const AWS = require('aws-sdk');
const config = require('./AWSDDconfig.js');
const pgpConfig = require('./AWSDDconfigPGP.js');
// const uuidv1 = require('uuid/v1');

const getMsgs = function (req, res) {
  AWS.config.update(config.aws_remote_config);

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: config.aws_table_name,
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send({
        success: false,
        message: err,
      });
    } else {
      const { Items } = data;
      res.send({
        success: true,
        movies: Items,
      });
    }
  });
};

const addMsg = function (g, vi, snd) {
    
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const Item = { message: g };
  Item.reciever = vi;
  Item.sender = snd;
  const params = {
    TableName: config.aws_table_name,
    Item,
  };
console.log(Item);
  // Call DynamoDB to add the item to the table
  docClient.put(params, (err, data) => {
    if (err) {
      console.log('error')
    } else {
      console.log('success')
    }
  });
};
const searchMsgs = function (req, res) {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.aws_table_name,
    KeyConditionExpression: '#reciever = :reciever',
    ExpressionAttributeNames: {
      '#reciever': 'reciever',
    },
    ExpressionAttributeValues: {
      ':reciever': req.query.id,
    },
  };

  docClient.query(params, (err, data) => {
    if (err) {
      console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
    } else {
      console.log('Query succeeded.');
      data.Items.forEach((item) => {
        console.log(item);
      });
      res.send({
        success: true,
        messages: data.Items,
      });
    }
  });
};
const addPGPpub = function (req, res) {
    AWS.config.update(pgpConfig.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const Item = { };
    Item.user = req.query.id;
    Item.pubpgpkey = req.body.pubpgpkey;
    const params = {
      TableName: pgpConfig.aws_table_name,
      Item,
    };
  
    // Call DynamoDB to add the item to the table
    docClient.put(params, (err, data) => {
      if (err) {
        res.send({
          success: false,
          message: err,
        });
      } else {
        res.send({
          success: true,
          message: 'Added movie',
          movie: data,
        });
      }
    });
  };

  const searchPGPkeys = function (req, res, callb) {
    AWS.config.update(pgpConfig.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: pgpConfig.aws_table_name,
      KeyConditionExpression: '#user = :user',
      ExpressionAttributeNames: {
        '#user': 'user',
      },
      ExpressionAttributeValues: {
        ':user': req.query.id,
      },
    };
  
    docClient.query(params, (err, data) => {
      if (err) {
        console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      } else {
        console.log('Query succeeded.');
        data.Items.forEach((item) => {
          console.log(item);
        });
      callb(data.Items[0].pubpgpkey);
      }
    });
    
  };
module.exports = {
  getMsgs,
  addMsg,
  searchMsgs,
  addPGPpub,
  searchPGPkeys,
};
