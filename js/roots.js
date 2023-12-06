function find_roots(f, f1, f2, a, b, n) {
    // Functions f(x) f'(x) f''(x)
    // Range from a to b with number of intervals n (accuracy)

    var roots = [];
    // List with the calculated roots
    var dx = (abs_value(a) + abs_value(b)) / n;
    // Size of each interval
    var x = a,
    // Current x-value of iteration
    fx, 
    // Current f(x) value
    f1x,
    // Current f'(x) value
    last_x = a,
    // Last x-value
    last_fx = 0, 
    // Last f(x) value
    last_f1x = 0;
    // Last f'(x) value

    for(x = a; x < b; x) { // Iteration from a to b
        fx = f(x);
        f1x = f1(x);
        if(sign_change(fx, last_fx)) { // f(x) change of sign to find root
            roots[roots.length] = parseFloat(newton(last_x + dx / 2, f, f1).toFixed(15)); 
            // Root is calculated via newtons method
        } else if(sign_change(f1x, last_f1x) && fx == 0) { // f'(x) change of sign and root
            roots[roots.length] = parseFloat(newton(last_x + dx / 2, f1, f2).toFixed(15));
            // Root is calculated via newtons method
        }

        last_x = x;
        last_fx = fx;
        last_f1x = f1x;
        x += dx;
    }
    return roots;
}




function sign_change(x, y) {
    if((x < 0 && y > 0) || (x > 0 && y < 0)) return true;
    return false;
}
function abs_value(x) {
    if(x < 0) x = x*-1;
    return x;
}