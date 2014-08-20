/*
 * Seed randomly from astro-ph.
 */

var http = require('http'),
    parseString = require('xml2js').parseString,
    fs = require('fs'),
    ss = require('simple-statistics'),
    _ = require('underscore');


function astroph_get(keyword, options, callback) {
    // Add a 1 second wait
    options = options || { };
    options.wait = options.wait || 1000;
    options.max_results = options.max_results || 500;
    
    // Fetch Atom XML response from Arxiv
    http.get("http://export.arxiv.org/api/query?search_query=" + keyword + "+AND+cat:astro-ph&sortBy=lastUpdatedDate&max_results=" + options.max_results, function(res) {
        
        res.setEncoding('utf8');
        var xml = [];

        // Add chunks to xml array...
        res.on('data', function(d) {
            xml.push(d);
        });
        
        res.on('end', function() {
            // ...and join it into a string
            var xmls = xml.join('');
            parseString(xmls, function(err, result) {
                if (err)
                    throw err;

                // Push the callback on the event loop
                setTimeout(callback(result), options.wait);
            });
        });
    });    
}

// Read keywords from keywords.txt 
var keywords = fs.readFileSync('keywords.txt',
                               {encoding:'utf8'}).split('\n');
var titles = [], abstracts = [], key = 0;

keywords = _.reject(keywords, function(s) { return(s.trim() === ''); });

// Callback that fills titles and abstracts
var cb =  function(result) {
    var feed = result.feed;
    for (var i = 0; i < feed.entry.length; i++) {
        titles.push(feed.entry[i].title[0].replace(/[\n\$]/g, ' '));
        abstracts.push(feed.entry[i].summary[0].replace(/[\n\$]/g, ' '));
    }

    console.log(keywords[key], titles.length);
    key++;
    
    if (key == keywords.length) {
        fs.writeFileSync('titles.txt', titles.join('. '));
        fs.writeFileSync('abstracts.txt', abstracts.join(' '));
        return;
    };
    
    astroph_get(keywords[key], null, cb);
};

// Start loop
astroph_get(keywords[key], null, cb);
