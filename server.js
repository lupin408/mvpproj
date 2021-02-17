const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const openpgp = require('openpgp');
const awsdd = require('./AWSDynamoDB/DynamoDBMethods.js');

//const db = require('./mongodatabases/tester.js');

const app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


 app.use(express.static(__dirname + '/client/public'));
// app.use('/', express.static(`${__dirname}/../client/public`));
// app.use('/bundle', cors(), express.static(`${__dirname}/../client/public/bundle.js`));

const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.send('hi')
  });

app.get('/messagestome', cors(), (req, res) => {
  console.log(`req.query.id ${req.query.id}`);


  awsdd.searchMsgs(req, res)
  

});

app.post('/messagestoyou', cors(), (req, res) => {
    console.log('HELLO')
    var coolio = req.body.message;
    var g = req.body;
    var vi = req.query.id;
    var snd = req.query.snd;
    
    
   var callb1 = (async function(a) {

        
    
        const encrypted = await openpgp.encrypt({
            message: openpgp.message.fromText(coolio),         // input as Message object
            publicKeys: (await openpgp.key.readArmored(a)).keys //for encryption
                                            
        });
    
      var g1 = await encrypted;
     
      awsdd.addMsg(g1.data, vi, snd);
    }).bind(this); 
    awsdd.searchPGPkeys(req, res, callb1)
    res.send('hi')
  
});

app.post('/newuser', (req, res) => {
   //add public key and user to encryption table
   console.log(req.body)
  // console.log(req.query.id)
  awsdd.addPGPpub(req, res);
 
  });


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
