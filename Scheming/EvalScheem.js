
module.exports = {


    lookup: function (env, v) {
        //alert("var:" + v);
        if (env === {}) {

            throw new error("unitialized Variable");
        }
        if (env.bindings !== null) {
            if (env.bindings[v] !== null && env.bindings[v] !== undefined) {
                alert("var: " + v + " is " + env.bindings[v]);

                return env.bindings[v];
            }

            else {
                //alert("var: " + v + "is not found, looking up");
                if (env.outer != null) {

                    return lookup(env.outer, v);
                }
                else {
                    throw new error("unitialized variable");
                }
            }
        }
        else {
            throw new error("unitialized Variable");
        }
    },

    update: function (env, v, val) {
        if (env === {}) {
            throw new Error("unitialized variable");
            return null;

        }
        if (env.bindings !== null) {
            if (env.bindings[v] !== null && env.bindings[v] !== undefined) {
                //alert("var: " + v + " is " + env.bindings[v]);

                env.bindings[v] = val;
            }

            else {
                //alert("var: " + v + "is not found, looking up");

                return update(env.outer, v, val);
            }
        }
        else {

            throw new Error("unitialized variable");
            return null;
        }
    },
    evalScheem: function (expr, env) {
        // Numbers evaluate to themselves
        if (typeof expr === 'number') {
            return expr;
        }
        if (typeof expr === 'string') {
            if (env[expr] === null) {
                throw new Error("Unititialized variable");
            }
            return env[expr];
        }
        // Look at head of list for operation
        switch (expr[0]) {
            case '*':
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

                return evalScheem(expr[1], env) - evalScheem(expr[2], env);
            case 'define':
                if (expr.length != 2)
                    throw new Error("Invalid Length at character " + expr[0]);
                alert(expr[1] + " " + expr[2]);
                env[expr[1]] = evalScheem(expr[2], env);
                return 0;

            case 'set!':
                if (expr.length != 2)
                    throw new Error("Invalid Length at character " + expr[0]);
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
                if (Object.prototype.toString.call(expr[1]) === '[object Array]') {
                    throw new Error("Object 2 not an array");
                }
                return evalScheem(expr[1])[0];
            case 'cdr':
                if (expr.length != 2)
                    throw new Error("Invalid Length");
                if (Object.prototype.toString.call(expr[1]) === '[object Array]') {
                    throw new Error("Object 1 not an array");
                }
                alert(evalScheem(expr[1]));
                alert(evalScheem(expr[1]).slice(1, expr[1].length + 1));
                return evalScheem(expr[1]).slice(1, expr[1].length + 1);
            case 'if':
                return (evalScheem(expr[1]) == "#t") ? evalScheem(expr[2]) : evalScheem(expr[3]);

            case 'lambda-one':
                var labdaFunc = function (_arg) {
                    var newEnv = {};
                    newEnv.bindings = {};
                    newEnv.bindings[expr[1]] = _arg;
                    newEnv.outer = env;
                    return evalScheem(expr[2], newEnv);
                };
                return labdaFunc;

            default:
                /*console.log("In Default for" + expr[0]);
                var lookedup = this.lookup(env, evalScheem(expr[0], env));
                console.log("Looked up val" + lookedup);
                var callingArray = [];
                console.log("expr len:" + expr[1].length);
                if (expr[1].length == 0)

                    return lookedup.apply(null, []);

                if (expr[2].length > 0) {
                    expr[2].foreach(function (element, index, array) {
                        callingArray[index] = evalScheem(element, env);
                    });

                }
                return lookedup.apply(null, callingArray);*/
                var lookedup = lookup(env, expr[0]);

                return lookedup(evalScheem(expr[1], env));
        }
    },
    alertTest: function () { console.log("hello world"); }
};
