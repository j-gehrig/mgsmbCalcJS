function decimal_to_fraction(x) {
    var f = [], d;
    if(Number.isInteger(x)) {
        f[0] = x; f[1] = 1;
    } else {
        d = x.toString().split(".");
        var z = pow(10, d[1].toString().length); // 1.5 => 10^1 = 10
        f[0] = x * z; f[1] = z; // 1.5 => 15/10 = 3/2
    }
    return f;
}

function betrag(x) {
    if(x < 0) x = x*-1;
    return x;
}

function vzwechsel(x, y) {
    if(x < 0 && y > 0) return true;
    if(x > 0 && y < 0) return true;
    //console.debug("false");
    return false;
}

function pow(a, n) {             
    if(isNaN(n) || n == null) { 
        return null;
    }
    if(isNaN(a) || a == null) {
        return null;
    }
    var n, a, p = 1.0;
    if(!(n % 1 === 0)) {
        return Math.pow(a, n);
    }
    if(n == 0) { 
        return p;
    } else if(n < 0.0) {
        for(i = 0.0; i > n; i--) {
            p = p / a;
        }
        return p;
    } else if(n >= 1.0) {
        for(i = 0.0; i < n; i++) {
            p = p * a;
        }
        return p;
    }
    return;
}

function sqroot_Heron(a, e) {
    var a, x, xa, e, xb; 
    x=1.0; xb=9999.0; 
    while (xb>e) {
        xa=x;
        
        x=0.5*(x+a/x);

        xb=x-xa; 
        if (xb<0) { xb=-1.0*xb;}
    }
    return x;
}




function newton(x_n, f, f1, p_1, p_2) {
    // f ist die Funktion f(x), f1 ist die Ableitungsfunktion f'(x), x_n ist der Startwert
    // p_1 und p_2 sind optionale Parameter, wie das n bei der n-ten Wurzel
    var x_n1 = x_n, x_betrag=9999.0, e=1e-10;
    // Variablen für den Betrag der Änderung von x und die gewünschte Genauigkeit e 
    // Der x-Wert für die Iterationsformel wird gesetzt
    while (x_betrag > e) {
        x_n = x_n1; // x-Wert der letzten Iteration wird gespeichert

        x_n1 = x_n - (f(x_n, p_1, p_2) / f1(x_n, p_1, p_2));
        // Nächst genaueres x wird mithilfe der Iterationsformel berechnet

        x_betrag = betrag(x_n1 - x_n); // Betrag der Änderung wird berechnet
    }
    return x_n1; // Berechneter x-Wert wird ausgegeben
}

function root(n, a) {
    console.log("[root] Berechne root("+ n + ";" + a + ")...");

    if(a == 0) return 0;
    if(n == 1) return a;
    if(n == 0) return 1; // Spezialfälle werden geprüft

    var f = function(x, n, a) { // Funktion f(x) wird in einer Variable gespeichert
        return (pow(x, n) - a); // "x hoch n - a"
    }
    var f1 = function(x, n) { // Ableitungsfunktion f'(x) wird in einer Variable gespeichert
        return (n * pow(x, n-1)); // "n mal x hoch n-1"
    }

    var x_0 = n+a; // Startwert x_0 wird geraten
    var x = newton(x_0, f, f1, n, a); // x wird mit dem Algorithmus angenähert

    console.info("[root] Berechnet: " + x);
    return x; // Das Ergebnis wird ausgegeben
}




function ln(x) {
    console.log("[ln] Berechne ln(" + x + ")...");

    var f = function(x, a) { 
        return (e_init(x) - a);
    }
    var f1 = function(x) {
        return (e_init(x));
    }

    var x_0 = -1 + sqroot_Heron(2*x-1, 1e-5);
    var x = newton(x_0, f, f1, x);

    console.info("[ln] Berechnet: " + x);
    return x;
}

function log(b, x) {
    return ln(x)/ln(b);
}

function fakult(x) {
    if(x == 0) {
        return 1;
    }
    if(x < 0) {
        return undefined;
    }
    for(var i = x; --i;) {
        x *= i;
    }
    return x;
}
function doppel_fakult(x) {
    var e = 1;
    if(x % 2 === 0) {
        while(x>2) {
            e = e * x;
            x = x - 2;
        }
    } else {
        while(x>1) {
            e = e * x;
            x = x - 2;
        }
    }
    return e;
}

function sin_init(x) {
    var u = x / (Math.PI * 2), e;
    //console.debug("[init_sin] Berechne sin(" + x + ")...");
    //console.debug("[init_sin] u = " + u);
    if(u < -1) {
        u = u * -1;
        //console.debug("[init_sin] " + u + " Umdrehungen - x wird verkleinert...");
        x = (u - Math.floor(u)) * (Math.PI * 2) * -1;
        //console.debug("[init_sin] neues x = " + x);
    } else if(u > 1) {
        //console.debug("[init_sin] " + u + " Umdrehungen - x wird verkleinert...");
        x = (u - Math.floor(u)) * (Math.PI * 2);
        //console.debug("[init_sin] neues x = " + x);
    }
    if(x < 0) {
        x = sin_x_reduce(x * -1); 
        e = sin(x) * -1;
    } else {
        x = sin_x_reduce(x); 
        e = sin(x);
    }
    //console.info("[init_sin] Berechnet: " + e);
    return e;
}
function sin_x_reduce(x) { 
    if(x <= (Math.PI / 2)) {
        //console.debug("[sin_x_reduce] x <= PI/2");
    } else if(x <= Math.PI) {
        //console.debug("[sin_x_reduce] x <= PI");
        x = Math.PI - x;
    } else if(x <= (1.5*Math.PI)) {
        //console.debug("[sin_x_reduce] x <= 3PI/2");
        x = Math.PI - x;
    } else if(x <= (2*Math.PI)) {
        //console.debug("[sin_x_reduce] x <= 2PI");
        x = (-2*Math.PI) + x;
    }
    //console.debug("[sin_x_reduce] neues x = " + x);
    return x;
}
function sin(x) {
    var n = 0.0, e = 1e-17, sa, sb = 9999.0, s = 0.0;
    //console.debug("[sin] e = " + e + "; x = " + x);
    while(sb > e) {
        sa = s;

        s += Math.pow(-1, n) * (Math.pow(x, 2*n + 1) / fakult(2*n + 1));
        sb = s - sa;
        if(sb < 0.0) sb = -1.0*sb;
        //console.debug("[sin] n = " + n);
        //console.debug("[sin] sb = " + sb);
        //console.debug("[sin] s = " + s);

        n++;
    }
    return s ?? 0;
}
function cos(x) {
    //console.debug("[cos] x = " + x);
    return sin_init(Math.PI/2 + x);
}
function tan(x) {
    var e = sin_init(x)/cos(x);
    return e;
}

function arcsin(x) {
    //console.log("[arcsin] Berechne arcsin(" + x + ")...");

    if(x > 1) return;

    var f = function(x, a) { 
        return (sin_init(x) - a);
    }
    var f1 = function(x) {
        return cos(x);
    }

    var x = newton(0, f, f1, x);

    //console.info("[arcsin] Berechnet: " + x);
    return x;
}
function arccos(x) {
    var x = arcsin(x) - Math.PI/2;
    return x;
}
function arctan(x) {
    //console.log("[arctan] Berechne arctan(" + x + ")...");

    if(x > 1) return;

    var f = function(x, a) { 
        return (tan_init(x) - a);
    }
    var f1 = function(x) {
        return tan_init(x);
    }

    var x = newton(0, f, f1, x);

    //console.info("[arctan] Berechnet: " + x);
    return x;
}

function e_init(x) {
    var x_dez, x_betrag, x_ger;
    //console.log("[e_init] Berechne e^" + x + "...");
    if(x < 0) {
        x_betrag = x * -1;
        x_dez = -1 * (x_betrag - Math.floor(x_betrag));
        x_ger = -1 * Math.floor(x_betrag);
    } else {
        x_dez = x - Math.floor(x);
        x_ger = Math.floor(x);
    }
    //console.debug("[e] x1 = " + x_ger + "; x2 = " + x_dez + "; (x1 + x2 = x)");
    var erg = e(x_ger) * e(x_dez);
    //console.info("[e_init] Berechnet: " + erg);
    return erg;
}

function e(x) {
    var e = 1e-15, n = 1.0, s = 1.0, sa, sb = 9999.0;
    //console.debug("[e] e = " + e + "; x = " + x);
    while(sb > e) {
        sa = s;

        s = s + pow(x, n) / fakult(n);
        //console.debug("[e] s = " + s + "; n = " + n);
        
        sb = s - sa;
        if(sb < 0.0) sb = -1.0*sb;
        //console.debug("[e] sb = " + sb);
        //console.debug("[e] sb = " + s + " - " + sa + " = " + sb);

        n++
    }
    //console.info("[e] Zwischenergebniss: " + s);
    return s;
}

function ableiten(f) {
    var f1;

    return f1;
}