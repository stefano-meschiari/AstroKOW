var Markov = require('./markov'),
    fs = require('fs'),
    _ = require('underscore');
var readline = require('readline');

var abstracts = new Markov(fs.readFileSync('abstracts.txt', {encoding: 'utf8' }),
                         2);
var titles = new Markov(fs.readFileSync('titles.txt', {encoding: 'utf8' }),
                        2);

fs.writeFileSync('abstracts.json', JSON.stringify(abstracts));
fs.writeFileSync('titles.json', JSON.stringify(titles));

