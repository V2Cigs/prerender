var email = require('emailjs');
var emailServer = email.server.connect({
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASS,
    host: "smtp.gmail.com",
    ssl: true
});

module.exports = {
    beforeSend: function(req, res, next) {

        if (req.prerender.statusCode > 400) {
            emailServer.send({
                from: "PrerenderV2 <ravi@v2.com>",
                to: "Ravi <ravi@v2.com>",
                subject: "Prerender Error - Above 400",
                text: 'Url - ' + req.prerender.url + ' Status Code - ' + req.prerender.statusCode
            }, function(err, message) {
                console.log(err || message);
            });
        }
        if (!req.prerender.documentHTML || req.prerender.documentHTML.toString().length === 0) {
            emailServer.send({
                from: "PrerenderV2 <ravi@v2.com>",
                to: "Ravi <ravi@v2.com>",
                subject: "Prerender Error - Empty Response",
                text: 'Url - ' + req.prerender.url + ' Status Code - ' + req.prerender.statusCode + ' No Response'
            }, function(err, message) {
                console.log(err || message);
            });
        }
        next();
    }
};