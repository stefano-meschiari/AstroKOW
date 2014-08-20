/*
 * A naive Markov Chain text generator.
 *
 */

"use strict";

var _ = require('underscore'),
    fs = require('fs');
require('string').extendPrototype();

function Markov(text, order) {
    if (typeof(text) === 'object') {
        _.extend(this, text);
    } else {
        init(this, text, order);
    }
};

// Initializes the Markov object.
function init(m, text, order) {
    order = order || 1;
    var arro = text.split(/\s+/);
    var arr = [];
    var i;

    m.toks_s2n = {};
    m.toks_n2s = [];
    
    var idx = 0;

    if (order == 1)
        arr = arro;
    
    for (i = 0; i < arro.length; i+=order) {
        var word = (order == 1 ? arro[i] : arro.slice(i, i + order).join(' '));

        if (order != 1)
            arr.push(word);
        
        if (m.toks_s2n[word] === undefined) {
            m.toks_s2n[word] = m.toks_n2s.length;
            m.toks_n2s.push(word);
        }
    }

    
    m.nodes = [];
    m.starts = [];
    m._size = arr.length;
    
    for (i = 0; i < arr.length; i++) {
        var tokn = m.toks_s2n[arr[i]];
        
        m.nodes[tokn] = m.nodes[tokn] || { next : [] };
        
        if (i > 0) {
            var tokn1 = m.toks_s2n[arr[i-1]];
            
            m.nodes[tokn1].next.push(tokn);
            if (arr[i-1].endsWith('.'))
                m.starts.push(tokn);
        } else
            m.starts.push(tokn);
    }
    
}

Markov.prototype.next = function() {
    
    if (!this.current) {
        this.current = _.sample(this.starts);
    } else {
        this.current = _.sample(this.nodes[this.current].next);
    }

    return this.toks_n2s[this.current];    
};

Markov.prototype.reset = function() {
    this.current = null;
};

Markov.prototype.size = function() {
    return this._size;
};

Markov.prototype.text = function(options) {
    options = options || {};
    options.min_tokens = options.min_tokens || 30;
    options.end_char = options.end_char || '.';
    options.wrap_at_word = options.wrap_at_word || 0;
    
    var text = [], t;
    text.push(this.next().capitalize());
    for (var i = 0; i < options.min_tokens; i++) {
        t = this.next();
        text.push(t);
    }

    do {
        t = this.next();
        text.push(t);
    } while (!(t.endsWith(options.end_char)));

    
    
    var final = text.join(' ');

    if (options.capitalize) {
        final = _.map(final.split(/\s+/),
                      function(s) { return s.capitalize(); }).join(' ');
    }
    if (options.wrap_at_word > 0) {
        i = 0;
        final = final.replace(/\s+/g, function(s) {
            i++;
            return (i % options.wrap_at_word == 0 ? '\n' : s);
        });
    }

    
    return final;
};

Markov.prototype.freeze = function(fn, callback) {
    fs.writeFile(fn, JSON.stringify(this), {encoding:'utf8'}, callback);
};

Markov.defrost = function(fn) {
    var data = fs.readFileSync(fn, {encoding: 'utf8'});    
    var m = new Markov(JSON.parse(data));
    return m;
};

module.exports = Markov;
