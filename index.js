function Token(type, value=null) {
    return {type: type, value: value};
}


const input = "4+1-2";

function tokenize(input) {
    const digits = ['.','0','1','2','3','4','5','6','7','8','9'];

    let i = 0;

    let tokens = [];
    while (input[i] != undefined) {
        if(digits.includes(input[i])) {
            let val = input[i];
            i++;
            while((digits.includes(input[i])) && input[i]!=undefined) {
                val = val.concat(input[i]);
                i++;
            }
            if(isNaN(val)) {
                throw `ERROR: INVALID NUMBER`;
            }
            tokens.push(new Token('NUM', +val));
            continue;
        }
        
        switch(input[i]) {
            case ' ':
            case '\n':
                i++;
                continue;
                break;
            case '+':
                tokens.push(new Token('PLUS'));
                break;
            case '-':
                tokens.push(new Token('MINUS'));
                break;
            case '*':
                tokens.push(new Token('MUL'));
                break;
            case '/':
                tokens.push(new Token('DIV'));
                break;
            case '(':
                tokens.push(new Token('LPAREN'));
                break;
            case ')':
                tokens.push(new Token('RPAREN'));
                break;
            default:
                console.log(`ERROR: Illegal character at index ${i}`);
                break;
        }
        
        
        i++;
    }
    return tokens;
}

function parse(tokens) {
    let i=0;
    function match(t) {
        if(tokens[i] != undefined && t===tokens[i].type) {
            let v = tokens[i].value;
            i++;
            return v;
        }
        throw `ERROR: expected ${t} at index ${i}`;
    }
    function E() {
        let a = T(); 
        if (a == null) {
            console.log("ERROR");
            return null;
        }
        while(tokens[i]!=undefined) {
            if(tokens[i].type == 'PLUS') {
                i++;
                a+=T();
                continue;
            }
            else if(tokens[i].type == 'MINUS') {
                i++;
                a-=T();
                continue;
            }
            else break;
        }
        return a;
    }
    function T() {
        let a = F();
        if (a == null) {
            console.log("ERROR");
            return null;
        }
        while(tokens[i]!=undefined) {
            if(tokens[i].type == 'MUL') {
                i++;
                a *= F();
                continue;
            }
            else if(tokens[i].type == 'DIV') {
                i++;
                a /= F();
                continue;
            }
            else break;

        }
        return a;

    }
    function F() {
        if(tokens[i]==undefined) {
            throw `ERROR: Expected Value or Parenthesis at index ${i}`;
        }
        if(tokens[i].type == 'NUM') {
            return match('NUM');
        }
        if(tokens[i].type == 'LPAREN') {
            match('LPAREN');
            let a = E();
            match('RPAREN');
            return a;
        }
        else throw `ERROR: Unexpected ${tokens[i].type} at index ${i}`;
        
    }
    let result = E();
    if(tokens[i]!=undefined) {
        throw `ERROR: Unexpected ${tokens[i].type} at index ${i}`;
    }
    return result;
}


try{ 
    tokens = tokenize(input);
    console.log(parse(tokens));
}
catch(e) {
    console.log(e);
}
