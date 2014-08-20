var Markov = require('./markov'),
    fs = require('fs'),
    _ = require('underscore'),
    wrap = require('wrap');
var readline = require('readline');

var abstracts = new Markov(fs.readFileSync('abstracts.txt', {encoding: 'utf8' }),
                         2);
var titles = new Markov(fs.readFileSync('titles.txt', {encoding: 'utf8' }),
                        2);

fs.writeFileSync('abstracts.json', JSON.stringify(abstracts));
fs.writeFileSync('titles.json', JSON.stringify(titles));
var title = titles.text({min_tokens: 2, capitalize:true });
var abstract = abstracts.text({min_tokens:40});
console.log(title);
console.log('\n');

console.log(abstract);
