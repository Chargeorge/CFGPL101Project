var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '*':
            return evalScheem(expr[1], env) * evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1, env]) / evalScheem(expr[2], env);
        case '+':
            return evalScheem(expr[1], env) + evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) - evalScheem(expr[2], env);
        case 'define':
            alert(expr[1] + " " + expr[2]);
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;

        case 'set!':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'begin':
            var retval;
            for (x = 1; x < expr.length; x++) {
                retval = evalScheem(expr[x], env);
            }
            return retval;
        case 'quote':
            return expr[1];
        case '=':
            var eq =
                (evalScheem(expr[1], env) ===
                 evalScheem(expr[2], env));
            if (eq) return '#t';
            return '#f';
        case '<':
            return (evalScheem(expr[1], env) <
                    evalScheem(expr[2], env) ? "#t" : "#f");
        case 'cons':
            return [evalScheem(expr[1])].concat(evalScheem(expr[2]));
        case 'car':
            return evalScheem(expr[1])[0];
        case 'cdr':
            alert(evalScheem(expr[1]));
            alert(evalScheem(expr[1]).slice(1, expr[1].length + 1));
            return evalScheem(expr[1]).slice(1, expr[1].length + 1);
        case 'if':
            return (evalScheem(expr[1]) == "#t") ? evalScheem(expr[2]) : evalScheem(expr[3]); 
    }
};