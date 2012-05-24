    var lookup = function (env, v) {
	    if(!env || !env.bindings){
		    throw 'invalid variable ' + v;
		   
	    }

	    if(env.bindings.hasOwnProperty(v)){
		    return env.bindings[v];
	    }

	    return lookup(env.outer, v);
    };

    var update = function (env, v, val) {
	    if(!env || !env.bindings){
		    throw 'invalid variable ' + v;
		   
	    }

		if (env.bindings.hasOwnProperty(v)) {
		    return env.bindings[v] =  val;
	    }

		return update(env.outer, v, val);
    };


    var add_binding = function (env, v, val) {
        env.bindings[v] = val;
    };

    var createDefault = function () {
        var defaultEnv = {};
        defaultEnv.bindings = {};
        defaultEnv.bindings['alert'] = function (arg) { alert(arg); };
        defaultEnv.bindings['+'] = function (x, y) { return x + y; };
        defaultEnv.bindings['-'] = function (x, y) { return x - y; };
        defaultEnv.bindings['*'] = function (x, y) { return x * y; };
        defaultEnv.bindings['/'] = function (x, y) { return x / y; };
        defaultEnv.bindings['DoDebug'] = false;
        defaultEnv.bindings['>'] = function (x, y) { return x > y; };
        defaultEnv.bindings['<'] = function (x, y) { return x < y; };
        defaultEnv.bindings['='] = function (x, y) { return (x == y) ? '#t' : '#f'; };

        defaultEnv.bindings['car'] = function (x) { return x[0] };
        defaultEnv.bindings['cons'] = function (x, y) { y.unshift(x); return y; };
        defaultEnv.bindings['cdr'] = function (x) { x.splice(0, 1); return x; };
        defaultEnv.outer = {};
        return defaultEnv;
    }
    var evalScheem = function (expr, env) {
        if (lookup(env, '_DoDebug')) {

            if (typeof expr === 'number') {
                log_console("Current expr: " + expr + " Current env:" + JSON.stringify(env));
            }
            if (typeof expr === 'string') {
                log_console("Current expr: " + expr + " Current env:" + JSON.stringify(env));
            } else {
                log_console("Current expr: " + expr[0] + " Current env:" + JSON.stringify(env));
            }
        }
        if (env === null)
            throw new Error(expr + " has undefined env");
        // Numbers evaluate to themselves
        if (typeof expr === 'number') {
            return expr;
        }
        if (typeof expr === 'string') {

            return lookup(env, expr);

        }
        // Look at head of list for operation
        switch (expr[0]) {
            /*case '*':
                if (expr.length != 3)
                    throw new Error("Invalid Length at character " + expr[0]);
                return evalScheem(expr[1], env) * evalScheem(expr[2], env);
            case '/':
                if (expr.length != 3)
                    throw new Error("Invalid Length at character " + expr[0]);
                return evalScheem(expr[1, env]) / evalScheem(expr[2], env);
            case '+':
                if (expr.length != 3)
                    throw new Error("Invalid Length");
                return evalScheem(expr[1], env) + evalScheem(expr[2], env);
            case '-':
                if (expr.length != 3)
                    throw new Error("Invalid Length");

                return evalScheem(expr[1], env) - evalScheem(expr[2], env);*/
            case 'define':
                add_binding(env, expr[1], evalScheem(expr[2], env));
                return 0;

            case 'set!':
                if (expr.length != 3)
                    throw new Error("Invalid Length at character " + expr[0]);
                update(env, expr[1], evalScheem(expr[2], env));
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
                if (expr.length != 3)
                    throw new Error("Invalid Length");
                return (evalScheem(expr[1], env) <
                        evalScheem(expr[2], env) ? "#t" : "#f");
            case '>':
                if (expr.length != 3)
                    throw new Error("Invalid Length");
                return (evalScheem(expr[1], env) <
                        evalScheem(expr[2], env) ? "#t" : "#f");
            case 'cons':
                if (expr.length != 3)
                    throw new Error("Invalid Length");
                if (Object.prototype.toString.call(expr[2]) === '[object Array]') {
                    throw new Error("Object 2 not an array");
                }
                return [evalScheem(expr[1])].concat(evalScheem(expr[2]));
            case 'car':
                if (expr.length != 2)
                    throw new Error("Invalid Length");
                if (Object.prototype.toString.call(expr[1], env) === '[object Array]') {
                    throw new Error("Object 2 not an array");
                }
                return evalScheem(expr[1])[0];
            case 'cdr':
                if (expr.length != 2)
                    throw new Error("Invalid Length");
                if (Object.prototype.toString.call(expr[1], env) === '[object Array]') {
                    throw new Error("Object 1 not an array");
                }
                return evalScheem(expr[1], env).slice(1, expr[1].length + 1);
            case 'if':
                return (evalScheem(expr[1], env) == "#t") ? evalScheem(expr[2], env) : evalScheem(expr[3], env);

            case 'lambda-one':
                var labdaFunc = function (_arg) {
                    var newEnv = {};
                    newEnv.bindings = {};
                    newEnv.bindings[expr[1]] = _arg;
                    newEnv.outer = env;
                    return evalScheem(expr[2], newEnv);
                };
                return labdaFunc;
            case 'lambda':
                var lambdafunc = function () {
                    var args = Array.prototype.slice.apply(arguments);
                    var newEnv = {};
                    newEnv.bindings = {};

                    expr[1].forEach(function (element, index, array) {

                        //alert("here");
                        newEnv.bindings[element] = args[index];
                    });



                    newEnv.outer = env;
                    return evalScheem(expr[2], newEnv);
                }
                return lambdafunc;
            default:
                //alert("In Default for" + expr[0]);
                //alert(evalScheem(expr[0], env));
                var lookedup = evalScheem(expr[0], env);
                var callingArray = [];


                expr.slice(1, expr.length).forEach(function (element, index, array) {

                    //alert("here");
                    callingArray[index] = evalScheem(element, env);
                });


                return lookedup.apply(null, callingArray);

        }
    };
    var alerttest = function () { console.log("hello world"); };
