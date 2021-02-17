import React from 'react';
import ReactDOM from 'react-dom';
import keygen from '../../crytographictest'
import fetch from "node-fetch";
import Mailbox from './Mailbox.jsx';
import * as openpgp from 'openpgp'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{
          sender: 'test',
          message: 'test1',
          jabba: undefined,
      }],
      fp: true
    };
  this.newUser = this.newUser.bind(this);
  this.decrypt1 - this.decrypt1.bind(this);
  this.sendMsg = this.sendMsg.bind(this);
  this.refr = this.refr.bind(this);
  this.nxtpg = this.nxtpg.bind(this);
  }
  componentDidMount() {
if (this.state.fp === false ){ 
    var requestOptions = {
      method: 'GET',

      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        
      }
    };

    fetch(`http://localhost:3001/messagestome/?id=${document.getElementById('useridrec').value}`, requestOptions)
   //fetch(`http://localhost:1128/reviews?itemid=${document.getElementById('itemid1').textContent}`, requestOptions)
      .then(r => r.text())
      .then(r =>  this.setState({messages: JSON.parse(r).messages}));
   


}
  }
refr(b) {

    var requestOptions = {
        method: 'GET',
  
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          
        }
      };
  
      fetch(`http://localhost:3001/messagestome/?id=${document.getElementById('useridrec').value}`, requestOptions)
     //fetch(`http://localhost:1128/reviews?itemid=${document.getElementById('itemid1').textContent}`, requestOptions)
        .then(r => r.text())
        .then(r =>  this.setState({messages: JSON.parse(r).messages}));
     
  
  
  
}
nxtpg(b) {
    this.setState({fp: false})
}
decrypt1(b) {
 var allmsgs = document.getElementsByClassName('encmsgs');
 openpgp.initWorker({ path:'/dist/openpgp.worker.js' })
 const privkey = document.getElementById('privvy').value;
 const passphrase = document.getElementById('passp').value;
 console.log(privkey)
 var privKeyObj;
   var umsg;
   Array.from(allmsgs).map(ee => {
    const decryptFunction = async() => {
       openpgp.key.readArmored(privkey)
      .then(e =>  e.keys[0])
      
   .then(e => {e.decrypt(passphrase); privKeyObj = e})
  
   .then(e =>  openpgp.message.readArmored('-----BEGIN PGP MESSAGE-----\r\n' +
   'Version: OpenPGP.js v4.10.10\r\n' +
   'Comment: https://openpgpjs.org\r\n' +
   '\r\n' + (ee.innerText.slice(88, ee.innerText.length - 25).replaceAll(' ', '\r\n')) + '-----END PGP MESSAGE-----\r\n'))
     
    .then(a => {
            
        console.log(a);
            const options = {
                message: a,    // parse armored message
             
                privateKeys: [privKeyObj]                                 // for decryption
            }
    
            openpgp.decrypt(options).then(plaintext => {
                console.log(plaintext.data)
                ee.innerText = plaintext.data;
          
            })
    
        })
    }

decryptFunction();
})
}

sendMsg(a) {

    var requestOptions = {
        method: 'POST',
  
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({message: document.getElementById('msgdraft').value})
      };
  
      fetch(`http://localhost:3001/messagestoyou/?id=${document.getElementById('useridsnd').value}&snd=${document.getElementById('useridrec').value}`, requestOptions)
      .then(console.log('yay'))
}

newUser(g) {
    var sonny;
   var reqopt;
  keygen.makekeys.generateKey({
    userIds: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
    rsaBits: 2048,                                              // RSA key size
    passphrase: 'super long and hard to guess secret'           // protects the private key
})
.then((result) => this.setState({jabba: result}))
//.then((r) => reqopt.body = JSON.stringify({pubpgpkey: sonny.publicKeyArmored}))
.then((r) => document.getElementById('privkey2').innerText = this.state.jabba.privateKeyArmored)
.then((r) => reqopt = {
    method: 'POST',

    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify({pubpgpkey: this.state.jabba.publicKeyArmored})
  })
.then((r) => fetch(`http://localhost:3001/newuser/?id=${document.getElementById('userid1').value}`, reqopt ))
    
    
  
 
}



  render() {
    return (
        (this.state.fp === true ? <div id='entrypoint1'><div id='title'>Welcome to EasyPGP </div>
        <span id='subtitle1'>convenient, complete security</span>
        <button id='contbtn' onClick={this.nxtpg}>Continue</button></div> :
      <div id='mainpart'> 
         
          <label for="useridsnd">send to:</label> <input id='useridsnd'  name='useridsnd'></input>
          <label for="useridrec">your username:</label>  <input id='useridrec' name='useridrec' ></input>
        
          <button id='newusr1' onClick={this.newUser}>&#9883; Create new user </button>
          
          <label for="userid1">new username:</label>
          <input type="text" id="userid1" name="userid1"></input>
          <div id='privkey2'> </div>
          <button id='refrbtn' onClick={this.refr} > &#8635; </button>
          <div id='mdl' for='msgdraft'>Raw message to encrypt &amp; send:</div>
          <textarea id="msgdraft" name="msgdraft" rows="11" cols="50">

</textarea>
<button onClick={this.sendMsg} id='sndbtn'>&#8594;</button>
<label id='pri22' for="privvy" style={{position: 'relative', bottom: '450px', left: '300px'}}>Private Key:</label>
          <textarea id="privvy" name="privvy" rows="30" cols="70" >
</textarea>
<label for='passp' style={{position: 'relative', top: '50px', right: '535px'}}>PGP passphrase</label><input type='text' id='passp' name='passp' style={{position: 'relative', top: '50px', right: '535px'}}></input>
          <div id='rectitle'>RECIEVED MESSAGES</div>
          <button id='decbtn' onClick={this.decrypt1}> &#9888; Decrypt &#9888;</button>
      <Mailbox msgs={this.state.messages}/>
     </div>
    ));
  }
}


ReactDOM.render(<App />, document.getElementById('helloworld'));

export default App;
