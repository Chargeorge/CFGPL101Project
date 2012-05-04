start =
    expression

expression =
    atom / expressionlistencl
    
startparens = 
	"("

endparens = 
	")"
    
validchar
    = [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }
        
atomwhitespace=
        space:" " atom:atom
        {return atom;}

atomlist = 
        first:atom rest:atomwhitespace*
        {return [first].concat(rest);}

expressionlistencl = 
	start:startparens first:(atom / expressionlistencl) rest:(atomwhitespace/expressionlistenclwhtspc)*  end:endparens
        {return [first].concat(rest);}

       
expressionlistenclwhtspc = 
	white:" " rest:expressionlistencl
        {return rest;}
       
    