var Markov = require('./markov'),
    fs = require('fs'),
    _ = require('underscore');
var readline = require('readline');

var abstracts = new Markov(fs.readFileSync('../data/abstracts.txt', {encoding: 'utf8' }),
                         2);
var titles = new Markov(fs.readFileSync('../data/titles.txt', {encoding: 'utf8' }),
                        1);

fs.writeFileSync('abstracts.json', JSON.stringify(abstracts));
fs.writeFileSync('titles.json', JSON.stringify(titles));

