//
// Online tester
// https://peggyjs.org/online
//

{
  function unqote(quote_type, expr) {
    return { type: "SEQ", value: [ { type: "SYMBOL", value: quote_type }, expr ] }
  }
  function unzip(a) {
    return [].concat(...a)
  }
}

// ----------------------------------------------------- //

start
  = l1:_ seq:expr_seq l2:_ eof:EOF
    { return [ ...l1, ...seq, ...l2, eof] } 
    
list_seq 
  = l0:list tail:(_ list)* { 
    var  ll  = unzip(unzip(tail))
    return [ l0, ...ll ];
  }

list
  = "(" s1:_ seq:expr_seq s2:_ ")"  
    { return { type: 'SEQ', value: [...s1, ...seq, ...s2] } }
  / "(" s1:_ ")"
    { return { type: 'SEQ', value: [...s1] } }
  
expr_seq                  
  = e0:expr tail:(_ expr)*  
    { 
      var  ee  = unzip(unzip(tail))
      return [ e0, ...ee ]
    }

expr
  = s1:atom
  / s2:quoted_expr 
  / s3:backquoted_expr 
  / s4:comma_expr
  / s5:list
  // SBCL simple vector
  // http://www.lispworks.com/documentation/lw51/CLHS/Body/02_dhc.htm
  // 
  // Test Examples:
  // ( #( ) )
  // ( #11( ) )
  // ( #11( 1 2 ) )
  // ("Hello" #(#\h #\E #\l #\l #\o) t)

  / CH_SHARPSIGN s0:integer? "(" s1:_ seq:expr_seq? s2:_ ")" { 
    return { type: 'SVEC', value: [ 
      s0,                               // length
      ...s1, ...(seq ? seq : []), ...s2 // objects
    ] } }

quoted_expr
  = CH_QUOTE _ expr:expr { return unqote('quote', expr)}

backquoted_expr
  = CH_BACKQUOTE _ expr:expr { return unqote('backquote', expr) }

comma_expr
  = CH_COMMA _ expr:expr { return unqote('comma', expr)}

atom
  = floating_point
  / sbcl_floating_point
  / integer 
  / keyword 
  / symbol 
  / string

keyword
  = CH_COLON kw:symbol
    { return { type: "KEYWORD", value: kw.value } }
        
reader_comment_start = CH_SHARPSIGN "|"

reader_comment_end = "|" CH_SHARPSIGN

symbol
  // Sharpsign -- http://clhs.lisp.se/Body/02_dh.htm
  = c0:CH_SHARPSIGN c1:"|" c2:(!reader_comment_end .)* c3:reader_comment_end { 
      c2 = unzip(c2)
      // return { type: 'READER_COMMENT', value: [c0, c1, c2.join(''), c3] } 
      return { type: 'READER_COMMENT', value: c2.join('') } 
    }
  / c0:CH_SHARPSIGN c1:CH_DIGIT* c2:CH_SHARPSIGN_OTHER
    { return { type: "READER", value: [c0, c1, c2] } }
//  / c0:CH_SHARPSIGN c1:CH_BACKSLASH c2:CH_SYMBOL |2..|
//    { return { type: "READER", value: [c0, c1,  c2] } }
  / c0:CH_SHARPSIGN c1:CH_BACKSLASH c2:.
    { return { type: "READER", value: [c0, c1,  c2] } }
  // Normal symbols
  / s:CH_SYMBOL+
    { return { type: "SYMBOL", value: s.join("") } }

// ----------------------------------------------------- //

//string_stop = !CH_BACKSLASH CH_DOUBLEQUOTE
//string_stop = [^\\]["]
//string_cont = .[^\\]["]
//
//string_
//  = string_stop
//    //s:[^"\n]+ // singleline string
//    s:(string_cont)     // multiline string
//    string_stop
//    { return { type: "STRING", value: s.join("") } }


// Test examples:
// " a b c "
// " { { { "
// " d \"e\" "
// " d \"{{{\" "
// " \"  foo \" #\a #\d  \"food\""
string
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  
DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / s:. { return `\\${s}` }
//  / "b"  { return "\b";   }
//  / "f"  { return "\f";   }
//  / "n"  { return "\n";   }
//  / "r"  { return "\r";   }
//  / "t"  { return "\t";   }
//  / "v"  { return "\x0B"; }
  
  
//string
//  = CH_DOUBLEQUOTE 
//    //s:[^"\n]+ // singleline string
//    s:[^"]*     // multiline string
//    CH_DOUBLEQUOTE 
//    { return { type: "STRING", value: s.join("") } }
	
// ----------------------------------------------------- //

integer
  = digits:CH_DIGIT+ 
    { return {type:"INTEGER", value:parseInt(digits.join(""))} }

floating_point
  = d0:[-]? d1:CH_DIGIT+ d2:[.] d3:CH_DIGIT+ { return parseFloat((d0?d0:'') + d1.join('') + d2 + d3.join('')) }

// SBCL source code floats are prefixed with "$" for cross-compiling
// more info: 
// - https://github.com/sbcl/sbcl/blob/fbd65addb5d7d9345a075b61c9d593db705bbae4/src/cold/chill.lisp#L48
// - https://github.com/sbcl/sbcl/commit/eb6b537de0054f0e87aa22e91a9ba4f83e9ac80e
//
sbcl_floating_point  
  = CH_DOLLAR floating_point

// ----------------------------------------------------- //

_ = s:IGNORE* { return unzip(s) }

IGNORE  
  = line:multiple_comment { return line } // { return [s,c].filter(v=>!!v) }
  / s:SS { return s }
  / s:EOL { return s }

comment_main "(comment)"
  // = ';' content:(!EOL .)*  // &(EOL / EOF) 
  = s:CH_SEMICOLON+ content:[^\n]* // &(EOL / EOF) 
    { 
      return {
        type: "COMMENT", 
        // value: content.map(c => c[1]).join(""),
        value: s.join("")+content.join(""),
      };
    }

single_comment = s:S c:comment_main e:comment_end { 
    return [s, { ...c, value: c.value + (e && e.value ? e.value : '') } ] 
  } 
  
multiple_comment = single_comment

comment_end = CH_EOL / &EOF

S
  = chars:CH_SPACE*
    { return { type:"SPACE", value: chars.join('') } }

SS
  = chars:CH_SPACE+
    { return { type:"SPACE", value: chars.join('') } }

// ----------------------------------------------------- //

EOL "(end of line)"
  = s:CH_EOL+
    { return { type: "EOL", value: s.join('') } }

EOF 
  = !.
    { return { type: "EOF", value: null } }

// ----------------------------------------------------- //

CH_SPACE       = [ \t]
CH_EOL         = '\r\n' / '\n' / '\r' / '\f' { return '\n' }
CH_QUOTE       = "'"
CH_BACKQUOTE   = "`"
CH_DOUBLEQUOTE = '"'
CH_COMMA       = ","
CH_SEMICOLON   = ";"
CH_DIGIT       = [0-9]
CH_COLON       = ":"
CH_SHARPSIGN   = "#"
CH_DOLLAR      = "$"
CH_BACKSLASH   = "\\"
CH_SHARPSIGN_OTHER = [+-./AaBbCc#'*:Oo=PpRrSsXx] 
CH_SYMBOL          = [-+*/\\<>!@%^&=.a-zA-Z0-9_] 
  / "?" // "?" - for Mary dialect: https://github.com/andybelltree/Mary/blob/master/lisp/stdlib.lisp
  / CH_COLON // "::" - Used by SBCL to separate classes and methods
  / '|' // Mary dialect - tic-tac-toe.lisp
