var bracketPair = new Map(), s;
const oprChars = ["+", "-", "*", "/", ";"];
const brackets = ["(", ")"];

function startCalc(s1, oldans) {
    // Diese Funktion wird nach drücken von = aufgerufen
    bracketPair = new Map();
    // Klammern werden zurückgesetzt
    var ans; 
    s = s1;
    // Inhalt jeder Klammer wird von innen nach außen berechnet

    console.log("Calculating term: " + s);

    //Variablen
    replaceVariables(oldans);

    if(!checkSyntax(s)) {
        // Eingabe wird auf Syntax Fehler geprüft
        console.error("Syntax error");
        return "<span class=\"red\">Syntax Error<\\span>";
    }

    console.debug("Checking brackets...");

    getBrackets(s);
    // Eingabe wird auf Klammern durchsucht

    var res = brCalc();
    if(res) return "<span class=\"red\">"+res+"<\\span>";

    console.debug("Last calculations...");
    console.debug("s: " + s);

    ans = eval(s);
    if(ans < 0) {
        ans = -1*((-1*ans).toFixed(15))
    } else {
        ans = ans.toFixed(15);
    } 
    if(ans == 0) {
        console.log("ans = " + ans);
        console.log("_______________________________________");
        return "0";
    } else {
        ans = Number(ans);
        console.log("ans = " + ans);
        console.log("_______________________________________");
        return ans;
    }
}

function brCalc() {
    console.debug("Calculating brackets...; " + s);
    var iterator = bracketPair[Symbol.iterator]();
    for(const bp of iterator) {
        var openedBr = bp[0], closedBr = bp[1], i=1, result;
        console.debug("Start of Bracket " + i);
        // Die gefundenen Klammern werden durchgegangen

        var cbb = openedBr - 1;
        if(isNaN(s[cbb]) && !oprChars.includes(s[cbb]) && !brackets.includes(s[cbb])) {
            // Falls das Zeichen vor der geöffneten Klammer weder Zahl, Operator noch Klammer ist (eine Mathematische Funktion ist)
            result = calcmfunc(cbb, i, openedBr, closedBr); 
            if(result) return result;
            s = s.replace("--", "+");
        } else {
            var bracketAns = calcTerm(openedBr, closedBr) ?? 0;
            console.debug("Value of Bracket "+ i +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet

            s = s.replace(getStringArea(s, openedBr, closedBr), bracketAns);
            // Term in der Klammer wird ersetzt durch dessen Wert

            s = s.replace("--", "+");
            // Falls die Klammer einen negativen Wert hat

            console.debug("Bracket term replaced by value: " + s);
        }

        
        console.debug("End of Bracket " + i);
        i++;
        getBrackets(s);
        brCalc(s);
        break;
        // Die neuen Stellen der Klammern werden gesucht
    }
    return false;
}

function calcmfunc(cbb, i, openedBr, closedBr) {
    var mfunc = "";
    var j = cbb;
    for(j; j >= 0; j--) {
        mfunc = s[j] + mfunc;

        if(s[j-1] == null || !isNaN(s[j-1]) || oprChars.includes(s[j-1]) || brackets.includes(s[j-1]) || s[j-1] == ";" || s[j-1] == ".") break;
    }

    console.debug("Bracket " + i + " is part of function \"" + mfunc + "\"");

    var bracketexp = getStringArea(s, openedBr, closedBr), bracketAns;

    // Funktionen
    switch (mfunc) {
        case "sin":
            bracketAns = calcTerm(openedBr, closedBr);
            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet

            var newval = sin_init(bracketAns).toFixed(15);
            console.debug("\""+getStringArea(s, j, closedBr)+"\" replaced by value: " + newval);
            
            s = s.replace(getStringArea(s, j, closedBr), newval);
            // Funktion wird ersetzt durch dessen Wert

            console.debug("New s: " + s);
            break;
        
        case "cos":
            bracketAns = calcTerm(openedBr, closedBr);
            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet

            var newval = sin_init(bracketAns + (Math.PI/2)).toFixed(15);
            console.debug("\""+getStringArea(s, j, closedBr)+"\" replaced by value: " + newval);

            s = s.replace(getStringArea(s, j, closedBr), newval);
            // Funktion wird ersetzt durch dessen Wert

            console.debug("New s: " + s);
            break;

        case "tan":   
            bracketAns = calcTerm(openedBr, closedBr);
            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet
            
            var newval = sin_init(bracketAns)/sin_init(bracketAns + (Math.PI/2)).toFixed(15);
            console.debug("\""+getStringArea(s, j, closedBr)+"\" replaced by value: " + newval);
            
            s = s.replace(getStringArea(s, j, closedBr), newval);
            // Funktion wird ersetzt durch dessen Wert

            console.debug("New s: " + s);
            break;

        case "arcsin":
            bracketAns = calcTerm(openedBr, closedBr);

            if(bracketAns > 1) {
                console.error("[arcsin] Definitionsmenge überschritten!");
                return "arcsin: x cannot be bigger than 1";
            } else if(bracketAns < -1) {
                console.error("[arcsin] Definitionsmenge überschritten!");
                return "arcsin: x cannot be smaller than -1";
            }

            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet
    
            var newval = arcsin(bracketAns).toFixed(15);
            console.debug("\""+getStringArea(s, j, openedBr)+"\" replaced by value: " + newval);
                
            s = s.replace(getStringArea(s, j, closedBr), newval);
            // Funktion wird ersetzt durch dessen Wert
    
            console.debug("New s: " + s);
            break;

        case "arccos":
            bracketAns = calcTerm(openedBr, closedBr);

            if(bracketAns > 1) {
                console.error("[arccos] Definitionsmenge überschritten!");
                return "arccos: x cannot be bigger than 1";
            } else if(bracketAns < -1) {
                console.error("[arccos] Definitionsmenge überschritten!");
                return "arccos: x cannot be smaller than -1";
            }

            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet

            var newval = Math.PI/2 - arcsin(bracketAns).toFixed(15);
            console.debug("\""+getStringArea(s, j, openedBr)+"\" replaced by value: " + newval);
            
            s = s.replace(getStringArea(s, j, closedBr), newval);
            // Funktion wird ersetzt durch dessen Wert
        
            console.debug("New s: " + s);
            break;

        case "arctan":
            bracketAns = calcTerm(openedBr, closedBr);

            if(bracketAns > 1) {
                console.error("[arccos] Definitionsmenge überschritten!");
                return "arccos: x cannot be bigger than 1";
            } else if(bracketAns < -1) {
                console.error("[arccos] Definitionsmenge überschritten!");
                return "arccos: x cannot be smaller than -1";
            }

            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet
        
            var newval = arctan(bracketAns).toFixed(15);
            console.debug("\""+getStringArea(s, j, openedBr)+"\" replaced by value: " + newval);
                    
            s = s.replace(getStringArea(s, j, closedBr), newval);
            // Funktion wird ersetzt durch dessen Wert
        
            console.debug("New s: " + s);
            break;

        case "ln":
            bracketAns = calcTerm(openedBr, closedBr);
            console.debug("Value of "+ bracketexp +" : " + bracketAns);
            // Der Term in den Klammern wird ausgerechnet
            
            if(bracketAns <= 0) {
                console.error("[ln] Definitionsmenge überschritten!");
                return "ln: x has to be higher than 0";
            }

            s = s.replace(getStringArea(s, j, closedBr), ln(bracketAns).toFixed(15));
            // Funktion wird ersetzt durch dessen Wert

            console.debug("Function \""+mfunc+"\" replaced by value: " + s);
            break;

        case "log":
            var arg1 = getStringArea(bracketexp, 1, bracketexp.lastIndexOf(";")-1);
            arg1 = eval(arg1) ?? arg1;
            if(isNaN(arg1)) {
                console.error("Syntax Error: First argument of log is not a number");
                return "Syntax Error: First argument of log is not a number";
            }
            var arg2 = getStringArea(bracketexp, bracketexp.lastIndexOf(";")+1, bracketexp.length-2);
            arg2 = eval(arg2) ?? arg2;
            if(isNaN(arg2)) {
                console.error("Syntax Error: Second argument of log is not a number");
                return "Syntax Error: Second argument of log is not a number";
            }

            if(arg1 <= 0) {
                console.error("[log] Definitionsmenge überschritten!");
                return "log: base has to be higher than 0";
            } else if(arg2 <= 0) {
                console.error("[log] Definitionsmenge überschritten!");
                return "log: x has to be higher than 0";
            }

            s = s.replace(getStringArea(s, j, closedBr), log(arg1, arg2).toFixed(15));
            console.debug("Calculating log base "+arg1+" of "+arg2);
            // Funktion wird ersetzt durch dessen Wert

            console.debug("Function \""+mfunc+"\" replaced by value: " + s);
            break;
            
        case "pow":
            var arg1 = getStringArea(bracketexp, 1, bracketexp.lastIndexOf(";")-1);
            arg1 = eval(arg1) ?? arg1; // a
            if(isNaN(arg1)) {
                console.error("Syntax Error: First argument of pow is not a number");
                return "Syntax Error: First argument of pow is not a number";
            }
            var arg2 = getStringArea(bracketexp, bracketexp.lastIndexOf(";")+1, bracketexp.length-2);
            arg2 = eval(arg2) ?? arg2; // n
            if(isNaN(arg2)) {
                console.error("Syntax Error: Second argument of pow is not a number");
                return "Syntax Error: Second argument of pow is not a number";
            }

            if(eval(arg1).toFixed(2) == Math.E.toFixed(2)){
                s = s.replace(getStringArea(s, j, closedBr), e_init(arg2).toFixed(15));
                console.debug("Calculating power of base "+arg1+" and exponent "+arg2);
                // Funktion wird ersetzt durch dessen Wert
            } else {
                s = s.replace(getStringArea(s, j, closedBr), pow(arg1, arg2).toFixed(15));
                console.debug("Calculating power of base "+arg1+" and exponent "+arg2);
                // Funktion wird ersetzt durch dessen Wert
            }

            console.debug("Function \""+mfunc+"\" replaced by value: " + s);
            break;    

        case "root":
            var arg1 = getStringArea(bracketexp, 1, bracketexp.lastIndexOf(";")-1);
            arg1 = eval(arg1) ?? arg1; // n
            if(isNaN(arg1)) {
                console.error("Syntax Error: First argument of root is not a number");
                return "Syntax Error: First argument of root is not a number";
            }
            var arg2 = getStringArea(bracketexp, bracketexp.lastIndexOf(";")+1, bracketexp.length-2);
            arg2 = eval(arg2) ?? arg2; // x
            if(isNaN(arg2)) {
                console.error("Syntax Error: Second argument of root is not a number");
                return "Syntax Error: Second argument of root is not a number";
            }
    
            if(arg1 == 2) {
                s = s.replace(getStringArea(s, j, closedBr), sqroot_Heron(arg2, 1e-15).toFixed(15));
                console.debug("Calculating square root of "+arg2);
                // Funktion wird ersetzt durch dessen Wert
            } else {
                s = s.replace(getStringArea(s, j, closedBr), root(arg1, arg2).toFixed(15));
                console.debug("Calculating "+arg1+"th root of "+arg2);
                // Funktion wird ersetzt durch dessen Wert
            }
    
            console.debug("Function \""+mfunc+"\" replaced by value: " + s);
            break;

        default:
            console.error("Syntax error: Unknown characters");
            return "Syntax Error";
    }
    return false;
}

function replaceVariables(oldans) {
    console.debug("Replacing variables...");

    var rall = function(oldans) {
        s = s.replaceAll("E", 10);
        s = s.replaceAll("e", Math.E);
        s = s.replaceAll("pi", Math.PI);
        s = s.replaceAll("ans", oldans);
    }

    for(i = 0; i < s.length; i++) {
        if(s[i] == "E") {
            console.debug("Found E...");
            if(s[i+1] != null && !oprChars.includes(s[i+1]) && s[i+1] != ")" && 
            s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*10*" + (getStringArea(s, i+1, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } else if(i+1<s.length && !oprChars.includes(s[i+1])) {
                s =(getStringArea(s, 0, i-1) ?? "")+ "10*" + (getStringArea(s, i+1, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } else if(s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0) {
                s = (getStringArea(s, 0, i-1) ?? "") + "*10" + (getStringArea(s, i+1, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            }
        } else if(s[i] == "e") {
            console.debug("Found e...");
            if(s[i+1] != null && !oprChars.includes(s[i+1]) && s[i+1] != ")" && 
            s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*" + Math.E + "*" + (getStringArea(s, i+1, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } else if(s[i+2] != null && !oprChars.includes(s[i+1]) && s[i+1] != ")") {
                s = (getStringArea(s, 0, i-1) ?? "") + Math.E + "*" + (getStringArea(s, i+1, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } else if(s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*" + Math.E + (getStringArea(s, i+1, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            }
        } else if(s[i] == "p" && s[i+1] == "i") {
            console.debug("Found pi...");
            if(s[i+2] != null && !oprChars.includes(s[i+2]) && s[i+2] != ")" && 
            s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*" + Math.PI + "*" + (getStringArea(s, i+2, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } else if(s[i+2] != null && !oprChars.includes(s[i+2]) && s[i+2] != ")") {
                s = (getStringArea(s, 0, i-1) ?? "") + Math.PI + "*" + (getStringArea(s, i+2, s.length-1) ?? "");
                
                console.debug("s = " + s);
                replaceVariables(oldans); rall(oldans); return;
            } else if(s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*" + Math.PI + (getStringArea(s, i+2, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } 
        } else if(s[i] == "a" && s[i+1] == "n" && s[i+2] == "s") {
            console.debug("Found ans...");
            if(s[i+3] != null && !oprChars.includes(s[i+3]) && s[i+3] != ")" && 
            s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*" + oldans + "*" + (getStringArea(s, i+3, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } else if(i+3<s.length && !oprChars.includes(s[i+3]) && s[i+3] != ")") {
                s = (getStringArea(s, 0, i-1) ?? "") + oldans + "*" + (getStringArea(s, i+3, s.length-1) ?? "");

                replaceVariables(oldans); rall(oldans); return;
            } else if(s[i-1] != null && !oprChars.includes(s[i-1]) && i != 0 && s[i-1] != "(") {
                s = (getStringArea(s, 0, i-1) ?? "") + "*" + oldans + (getStringArea(s, i+3, s.length-1) ?? "");
                
                replaceVariables(oldans); rall(oldans); return;
            } 
        }
    }
    rall(oldans);
}

function getBrackets() {
    var i = 0;
    var openedBrackets = [], openedBrackets2 = [], closedBrackets = [];
    bracketPair = new Map();
    for(i; i < s.length; i++) {
        // Geöffnete Klammern werden gesucht
        if(s[i] == "(") {
            openedBrackets[openedBrackets.length] = i; 
            openedBrackets2[openedBrackets.length] = i; 
            // Die neueste geöffnete Klammer wird gespeichert
            console.debug("Opened bracket: " + i);
        }
        if(s[i] == ")") {
            bracketPair.set(openedBrackets2[openedBrackets2.length-1], i);
            openedBrackets2.splice(openedBrackets2.length-1,1);
            closedBrackets[closedBrackets.length] = i; 
            // Neueste geschlossene Klammer.
            // Neueste geöffnete Klammer wird vergessen
            // To do: Sortieren, um von innen nach außen zu rechnen
            console.debug("Bracket pair: " + openedBrackets[openedBrackets.length-1] + " to " + i);
        }
    }
    
    var bracketDiff = openedBrackets.length - closedBrackets.length;
    // Differenz zwischen den Klammern wird ausgerechnet
    if(bracketDiff > 0) {
        // Zu wenig geschlossene Klammern
        for(z = 1; z <= bracketDiff; z++) {
            s = s + ')';
        }
        console.debug("Added " + bracketDiff + " closed Brackets.");
        console.debug("New s: " + s);
        getBrackets();
        return;
    } else if(bracketDiff < 0) {
        // Zu wenig geöffnete Klammern
        for(z = bracketDiff; z < 0; z++) {
            s = '(' + s;
        }
        console.debug("Added " + bracketDiff + " opened Brackets.");
        console.debug("New s: " + s);
        getBrackets();
        return;
    }

    bracketPair = new Map([...bracketPair.entries()].sort());
    console.log("Sorted brackets: ");
    bracketPair.forEach((value, key) => { console.log("O: " + key + "; C: " + value) });
}

function calcTerm(a, b) { 
    var ans;

    ans = eval(getStringArea(s, a, b));

    if(ans == null) ans = 0;

    return ans;
}

function getStringArea(s, a, b) { 
    // Der Bereich a bis b eines Strings wird ausgegeben
    var out = ""; 
    if(a > b) 
        return;
    for(let i = a; i <= b; i++) {
        out = out + s[i] + ""; 
        //console.debug("getStringArea: out=" + out);
    }
    return out; 
}

function checkSyntax() {
    // Die Eingabe wird auf Syntaxfehler geprüft.
    console.log("Checking syntax...");

    if(oprChars.includes(s[0]) || s[0] == ".") {
        // Wenn das Anfangszeichen ein Operator ist
        return "Syntax Error";
    }
    var news = s;
    for(a = 0; a < s.length; a++) {
        if(s[a] == ";") continue;
        if(s[a] == ".") {
            if(s[a+1] == null) {
                return false;
            }
            if(isNaN(s[a-1]) || isNaN(s[a+1])) {
                return false;
            }
        }
        if(s[a+1] != null) {
            if(oprChars.includes(s[a]) && oprChars.includes(s[a+1])) {
                // Wenn das Zeichen und das Zeichen darauf Operatoren sind
                return false;
            } if(!isNaN(s[a]) && s[a+1] == "(") {
                // Zahl vor Klammer ohne Operator
                news = getStringArea(news, 0, a) + "*" + getStringArea(news, a, s.length-1);
            } if(s[a] == ")" && s[a+1] == "(") {
                // Klammer vor Klammer ohne Operator
                news = getStringArea(news, 0, a) + "*" + getStringArea(news, a, s.length-1);
            } if(!isNaN(s[a]) && isNaN(s[a+1]) && !oprChars.includes(s[a+1]) && !brackets.includes(s[a+1]) && s[a+1] != "." && s[a] != ";") {
                // Zahl vor mathematischen Funktion ohne Operator
                news = getStringArea(news, 0, a) + "*" + getStringArea(news, a, s.length-1);
            } if(s[a] == ")" && isNaN(s[a+1]) && !oprChars.includes(s[a+1]) && !brackets.includes(s[a+1])) {
                // Klammer vor mathematischen Funktion ohne Operator
                news = getStringArea(news, 0, a) + "*" + getStringArea(news, a, s.length-1);
            }
        }
        if(oprChars.includes(s[a]) && s[a+1] == null) {
            // Wenn das letzte Zeichen ein Operator ist
            return false;
        } if(s[a-1] == null && oprChars.includes(s[a])) {
            // Wenn das erste Zeichen ein Operator ist
        } 
    }
    s = news;
    console.debug("Checked syntax.");
    return true;
}