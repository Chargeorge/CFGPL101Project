
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
                returnable = evalStatements(stmt.body);

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

var Turtle = function (id) {
    var $elem = $('#' + id);
    this.paper = Raphael(id);
    this.originx = $elem.width() / 2;
    this.originy = $elem.height() / 2;
    this.clear();
};
Turtle.prototype.clear = function () {
    this.paper.clear();
    this.x = this.originx;
    this.y = this.originy;
    this.angle = 90;
    this.pen = true;
    this.turtleimg = undefined;
    this.updateTurtle();
};

Turtle.prototype.updateTurtle = function () {
    if (this.turtleimg === undefined) {
        this.turtleimg = this.paper.image(
            "http://nathansuniversity.com/gfx/turtle2.png",
            0, 0, 64, 64);
    }
    this.turtleimg.attr({
        x: this.x - 32,
        y: this.y - 32,
        transform: "r" + (-this.angle)
    });
    this.turtleimg.toFront();
};
Turtle.prototype.drawTo = function (x, y) {
    var x1 = this.x;
    var y1 = this.y;
    var params = { "stroke-width": 4 };
    var path = this.paper.path(Raphael.format("M{0},{1}L{2},{3}",
        x1, y1, x, y)).attr(params);
};
Turtle.prototype.forward = function (d) {
    var newx = this.x + Math.cos(Raphael.rad(this.angle)) * d;
    var newy = this.y - Math.sin(Raphael.rad(this.angle)) * d;
    if (this.pen) {
        this.drawTo(newx, newy);
    }
    this.x = newx;
    this.y = newy;
    this.updateTurtle();
};
Turtle.prototype.right = function (ang) {
    this.angle -= ang;
    this.updateTurtle();
};
Turtle.prototype.left = function (ang) {
    this.angle += ang;
    this.updateTurtle();
};

var createDefault = function () {
    var defaultEnv = {};
    defaultEnv.bindings = {};
    defaultEnv.bindings['alert'] = function (arg) { alert(arg); };
    defaultEnv.bindings['DoDebug'] = false;
    defaultEnv.outer = {};
    var myTurtle = new Turtle(0, 0, 400, 400);
    add_binding(defaultEnv, 'forward', function (d) {
        myTurtle.forward(d);
    });
    add_binding(defaultEnv, 'right', function (a) {
        myTurtle.right(a);
    });
    add_binding(defaultEnv, 'left', function (a) {
        myTurtle.left(a);
    });
    return defaultEnv;
}
