var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res) {
  res.render('index', { community: config.community });
});

router.post('/invite', function(req, res) {
  if (req.body.email) {
    if (req.body.captcha.toLowerCase() == 'stöld') {
      request.post({
          url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
          form: {
            email: req.body.email,
            token: config.slacktoken,
            set_active: true
          }
        }, function(err, httpResponse, body) {
          // body looks like:
          //   {"ok":true}
          //       or
          //   {"ok":false,"error":"already_invited"}
          if (err) { return res.send('Error:' + err); }
          body = JSON.parse(body);
          if (body.ok) {
            res.status(200).send('Ja! En Slack-inbjudan har skickats till "'+ req.body.email +'".');
          } else {
            res.status(400).send('Åh nej! ' + body.error)
          }
        });
    } else {
      res.status(400).send('Tänk lite till kring vad skatt egentligen är.');
    }
  } else {
    res.status(400).send('Du måste alltså fylla i din e-postadress för att det här skall fungera.');
  }
});

module.exports = router;
