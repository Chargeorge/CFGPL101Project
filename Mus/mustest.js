var compileInner = function(musexpr, notearray, timetonow){
    if(musexpr.tag == 'seq')
    {
        timetonow = compileInner(musexpr.left,notearray, timetonow);
        timetonow = compileInner(musexpr.right,notearray, timetonow);
        return timetonow;
    } 
    else
    {
        notearray[notearray.length] = {
            tag : 'note', 
            pitch: musexpr.pitch, 
            dur: musexpr.dur,
            start: timetonow
        };
        return timetonow + musexpr.dur;
    }
};

var compile = function (musexpr) {
   var returnable = [];
   compileInner(musexpr, returnable, 0);
   return returnable;
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };
console.log ("hello world!");
console.log(melody_mus);
console.log(compile(melody_mus));