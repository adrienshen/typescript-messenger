var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var path = require('path');
var compression = require('compression');

const {
  addEventStreamHeaders,
  send200MessageReceived,
  coerceSSE,
  genChatbotResponseSSE
} = require("./ssehelpers");

app.use(compression());
app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.json());
app.use(cors());

const MOCK_ASYNC_WAIT = 750;
let connections = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

let oneDay = 1000*60*60*24;

// Stream endpoint
app.get('/chatbot', function(req, res) {
  req.socket.setTimeout(oneDay);

  addEventStreamHeaders(res);
  res.write('\n');

  req.addListener('message', client => {
    let sseResp = coerceSSE(genChatbotResponseSSE(client), 'message');
    console.log("sseResp: ", sseResp);
    setTimeout(() => {
      res.write(sseResp);
      res.flush();
    }, MOCK_ASYNC_WAIT); // mock the asynchronous nature of sse
  });

  req.addListener('ping', client => {
    let sseResp = coerceSSE(JSON.stringify({message: 'pong'}, 'ping'));
    res.write(sseResp);
  });

  connections.push(req);

  req.on('close', function() {
    for (var i = 0; i < connections.length; i++) {
      if (connections[i] == req) {
        connections.splice(i, 1);
        break;
      }
    }
  });
});

app.post('/chatbot/message', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (!req.body.transcriptId || req.body.transcriptId.length < 10) {
    console.log("no transcript id.", req.body.transcriptId);
    res.status(403).end();
    return;
  }
  for (var i = 0; i < connections.length; i++) {
    connections[i].emit('message', {...req.body});
  }
  send200MessageReceived(res);
});

app.get('/chatbot/ping', (req, res) => {
  for (let i = 0; i < connections.length; i++) {
    connections[i].emit('ping'); 
  }
  send200MessageReceived(res);
});

app.get('/chatbot/transcript', (req, res) => {

  let resp = {transcriptId: "", messages: []};
  res.send(resp);
});

app.listen(3000, function() {
  console.log('App running on port 3000');
});
