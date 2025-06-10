const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

app.post('/sign', (req, res) => {
  const {
    method, uri, developerId, appId,
    appSecret, requestId, time,content,type,effectTime,expiredTime
  } = req.body;

  const signString =
    `method=${method}&uri=${uri}&developerId=${developerId}` +
    `&appId=${appId}&appSecret=${appSecret}` +
    `&requestId=${requestId}&time=${time}`;

  const credential = JSON.stringify({
    content:content,  // dynamically from request
    type:type,     // dynamically from request
    rule: {
      encryptedQrcode: "M",
      effectiveTime: effectTime,   // from request
      expiredTime: expiredTime     // from request
    }
  });
  const signature = crypto
    .createHash('md5')
    .update(signString, 'utf8')
    .digest('hex')
    .toUpperCase();

  res.json({ signString, signature });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MD5 service running on port ${PORT}`);
});

/*
const crypto = require("crypto");

const str = "method=GET&uri=/api/v1/cits/access/1081&developerId=2VE5aerqWs1P8nVZB9ECHB&appId=3dlRhfncSBpzAy8Bzo4Mlt&appSecret=72dJovbQ4i8rClgcLhtvin&requestId=111&time=1749028328419";

const signature = crypto
  .createHash("md5")
  .update(str, "utf8")
  .digest("hex")
  .toUpperCase();

console.log("Expected Signature:", signature);
*/