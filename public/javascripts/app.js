var Markov = require('./markov'),
    fs = require('fs'),
    _ = require('underscore');

var abstracts = new Markov(fs.readFileSync('abstracts.txt', {encoding: 'utf8' }),
                          3);
var titles = new Markov(fs.readFileSync('titles.txt', {encoding: 'utf8' }),
                        2);

var title = titles.text({min_words: 10, capitalize:true });
var abstract = abstracts.text();
console.log(title);
console.log(abstract);
