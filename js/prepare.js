var Markow = require('./markow'),
    fs = require('fs'),
    _ = require('underscore');
var readline = require('readline');

var abstracts = new Markow(fs.readFileSync('../data/abstracts.txt', {encoding: 'utf8' }),
                         2);
var titles = new Markow(fs.readFileSync('../data/titles.txt', {encoding: 'utf8' }),
                        1);

fs.writeFileSync('abstracts.json', JSON.stringify(abstracts));
fs.writeFileSync('titles.json', JSON.stringify(titles));

