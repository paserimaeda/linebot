

const axios = require('axios'); //追記
const express = require('express');
const line = require('@line/bot-sdk');

const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '04f43851bb878bcb25b1ac1d0a57a534',
    channelAccessToken: 'a0c3dAr/VbDEWJrBIo1fJhLma/K5u9dfmxGgQ4MbvVRPxZytkwz4k9UHcKN2P7nnlUratA3tOU1GQNtQu8No7hjMdKofQexxYSKRSlzVT99qi8egHg3rGsPr1sGKqAfE/jbpFyszWYGKZfG5/YiwxwdB04t89/1O/w1cDnyilFU='
};

const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//データベースの環境変数の読み込み
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'matiko222',
  database: 'list_app'
});



let messageList = [];

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    connection.query(
      'SELECT * FROM items',
      (error, results) =>{
        messageList = results;
        console.log(results);
        console.log(messageList);
    });
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = " ";
  if(event.message.text === "テスト配信"){
    replyText = "テスト配信成功";
  }
  else if(event.message.text === "テストです"){
    replyText = "テスト成功です";
  }
  else if(event.message.text === "テスト配信です"){
    replyText = messageList[0].name;
  }
  else{
    replyText = null;
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText //実際に返信の言葉を入れる箇所
  });
}

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);
