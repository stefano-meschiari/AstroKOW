var Markov = require('./js/markov'),
    fs = require('fs'),
    _ = require('underscore'),
    cow = require('cowsay'),
    wrap = require('wordwrap')(80);

var abstracts = Markov.defrost('js/abstracts.json');
var titles = new Markov.defrost('js/titles.json');

var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));

var template = fs.readFileSync("template.html", {encoding: 'utf8'});

var cows = ['default', 'default', 'default', 'dragon', 'kitty', 'meow', 'stegosaurus',
            'stegosaurus', 'stegosaurus', 'cower'];

app.get("/", function(req, res) {
    abstracts.reset();
    titles.reset();
    var title = titles.text({min_tokens: 1, capitalize:true });
    var abstract = abstracts.text({ min_tokens:40 });

    res.send(_.template(template,
                        { title: title,
                          article: cow.say( { text: wrap(abstract),
                                              f: _.sample(cows)} )}));
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
