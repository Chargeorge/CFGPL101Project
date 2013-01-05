
var lookup = function (env, v) {
    if (!env || !env.bindings) {
        throw 'invalid variable ' + v;

    }

    if (env.bindings.hasOwnProperty(v)) {
        return env.bindings[v];
    }

    return lookup(env.outer, v);
};

var update = function (env, v, val) {
    if (!env || !env.bindings) {
        throw 'invalid variable ' + v;

    }

    if (env.bindings.hasOwnProperty(v)) {
        return env.bindings[v] = val;
    }

    return update(env.outer, v, val);
};


var add_binding = function (env, v, val) {
    env.bindings[v] = val;
};

var evalExpr = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Look at tag to see what to do
    switch (expr.tag) {
        case '<':
            return evalExpr(expr.left, env) <
                   evalExpr(expr.right, env);
        case '<=':
            return evalExpr(expr.left, env) <=
                   evalExpr(expr.right, env);
        case '>':
            return evalExpr(expr.left, env) >
                   evalExpr(expr.right, env);
        case '>=':
            return evalExpr(expr.left, env) >=
                   evalExpr(expr.right, env);
        case '==':
            return evalExpr(expr.left, env) ==
                   evalExpr(expr.right, env);
        case '!=':
            return evalExpr(expr.left, env) !=
                   evalExpr(expr.right, env);
        case '+':
            return evalExpr(expr.left, env) +
                   evalExpr(expr.right, env);
        case '*':
            return evalExpr(expr.left, env) *
                   evalExpr(expr.right, env);
        case '/':
            return evalExpr(expr.left, env) *
                    evalExpr(expr.right, env);
        case 'ident':
            return lookup(env, expr.name);
        case 'call':
            // Get function value
            var func = lookup(env, expr.name);
            // Evaluate arguments to pass
            var ev_args = [];
            var i = 0;
            for (i = 0; i < expr.args.length; i++) {
                ev_args[i] = evalExpr(expr.args[i], env);
            }
            return func.apply(null, ev_args);
    }
};


var evalStatement = function (stmt, env) {
    // Statements always have tags
    switch (stmt.tag) {
        // A single expression 
        case 'ignore':
            return evalExpr(stmt.body, env);
            // Repeat
        case 'repeat':
            var returnable;
            for (var x = 0; x < evalExpr(stmt.expr, env); x++) {
                returnable = evalStatements(stmt.body, env);

            }
        case 'while':
            var returnable;
            while( evalExpr(stmt.expr, env)) {
                returnable = evalStatements(stmt.body, env);

            }
        case 'var':
            // New variable gets default value of 0
            add_binding(env, stmt.name, 0);
            return 0;
            return returnable;
        case ':=':
            // Evaluate right hand side
            val = evalExpr(stmt.right, env);
            update(env, stmt.left, val);
            return val;
        case 'if':
            if (evalExpr(stmt.expr, env)) {
                val = evalStatements(stmt.body, env);
            }
            return val;

        case 'define':
            // name args body
            var new_func = function () {
                // This function takes any number of arguments
                var i;
                var new_env;
                var new_bindings;
                new_bindings = {};
                for (i = 0; i < stmt.args.length; i++) {
                    new_bindings[stmt.args[i]] = arguments[i];
                }
                new_env = { bindings: new_bindings, outer: env };
                return evalStatements(stmt.body, new_env);
            };
            add_binding(env, stmt.name, new_func);
            return 0;
        default:
            var val  = evalExpr(stmt, env);
            return val;
        
    }
};

var evalStatements = function (seq, env) {
    var i;
    var val = undefined;
    for (i = 0; i < seq.length; i++) {
        val = evalStatement(seq[i], env);
    }
    return val;
};

var createDefault = function (myTurtle) {
    var defaultEnv = {};
    defaultEnv.bindings = {};
    defaultEnv.bindings['alert'] = function (arg) { alert(arg); };
    defaultEnv.bindings['DoDebug'] = false;
    defaultEnv.outer = {};
    
    add_binding(defaultEnv, 'forward', function (d) {
        myTurtle.forward(d);
    });
    add_binding(defaultEnv, 'right', function (a) {
        myTurtle.right(a);
    });
    add_binding(defaultEnv, 'left', function (a) {
        myTurtle.left(a);
    });
    add_binding(defaultEnv, 'color', function (a) {
        myTurtle.setColor(a);
    });
    add_binding(defaultEnv, 'penUp', function () {
        myTurtle.penup();
    });
    add_binding(defaultEnv, 'penDown', function () {
        myTurtle.pendown();
    });
    add_binding(defaultEnv, 'home', function () {
        myTurtle.home();
    });
    return defaultEnv;
}
