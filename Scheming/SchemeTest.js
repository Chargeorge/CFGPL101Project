var assert = require('assert');
var evalScheem
var PEG = require('pegjs');
var Scheem = require('./EvalScheem.js');
var fs = require('fs'); // for loading files
    
/*(// Read file contents
var data = fs.readFileSync('scheme.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
assert.deepEqual(parse("(a b c)"), ["a", "b", "c"]);
console.log("Test 2: ");
assert.deepEqual(parse("('(a  b  c))"), [["quote", "a", "b", "c"]]);*/

Scheem.alertTest();

assert.deepEqual(Scheem.evalScheem(['quote', 3], {}),
            3, "Basic Equal Failed"  );

var always3 = function (x) { return 3; };
var identity = function (x) { return x; };
var plusone = function (x) { return x + 1; };
var env = {
    bindings: { 'always3': always3,
        'identity': identity,
        'plusone': plusone
    }, outer: {}
};

console.log("Begin tests");
console.log(evalScheem(['always3', 5], env));
assert.deepEqual(evalScheem(['always3', 5], env), 3,
    '(always3 5)', "Always three failed");
/*
assert_eq(evalScheem(['identity', 5], env), 5,
    '(identity 5)');
assert_eq(evalScheem(['plusone', 5], env), 6,
    '(plusone 5)');
assert_eq(evalScheem(['plusone', ['always3', 5]], env), 4,
    '(plusone (always3 5))');
assert_eq(evalScheem(['plusone', ['+', ['plusone', 2],
                                       ['plusone', 3]]], env),
    8, '(plusone (+ (plusone 2) (plusone 3)))');*/
