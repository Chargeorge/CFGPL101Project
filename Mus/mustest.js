// maybe some helper functions
var endTime = function (time, expr) {
    // your code here
    if (expr.tag == 'seq') {
        return endTime(endTime(time, expr.left), expr.right);
    }
    else if (expr.tag == 'par') {
        var left = endTime(time, expr.left);
        var right = endTime(time, expr.right);

        return (left > right) ? left : right;
    }

    else {

        return time + expr.dur;
    }

};

var compileT = function (t, expr, arrayHolder) {
    if (expr.tag == 'seq') {
        compileT(t, expr.left, arrayHolder);
        compileT(endTime(t, expr.left), expr.right, arrayHolder);

    }
    else if (expr.tag == 'par') {
        compileT(t, expr.left, arrayHolder);
        compileT(t, expr.right, arrayHolder);

    }
    else if (expr.tag == 'rest') {
        { arrayHolder[arrayHolder.length] = { tag: 'rest',  start: t, dur: expr.dur }; }
    }
    else {
        arrayHolder[arrayHolder.length] = { tag: 'note', pitch: expr.pitch, start: t, dur: expr.dur };
    }

};



var compile = function (musexpr) {
    var arrayHolder = [];
    compileT(0, musexpr, arrayHolder);
    for (var i = 0; i < arrayHolder.length; i++) {
        var val = arrayHolder[i];
    }
    return arrayHolder;

};

var melody_mus =
    { tag: 'seq',
        left:
       { tag: 'seq',
           left: { tag: 'note', pitch: 'a4', dur: 250 },
           right: { tag: 'note', pitch: 'b4', dur: 250}
       },
        right:
       { tag: 'seq',
           left: { tag: 'note', pitch: 'c4', dur: 500 },
           right: { tag: 'seq',
               left: { tag: 'rest', dur: 100 },
               right: { tag: 'note', pitch: 'd4', dur: 500 }
           }
       }
    };

console.log ("hello world!");
console.log(melody_mus);
console.log(compile(melody_mus));