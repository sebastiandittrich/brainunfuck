input -> executable_statements {% d => ({ type: 'code_block', value: d[0] }) %}

executable_statements
    -> _
        {% () => [] %}
    |  _ ";" executable_statements
        {% (d) => d[2] %}
    |  _ executable_statement _
        {% d => [d[1]] %}
    |  _ executable_statement _ ";" executable_statements
        {%
            d => [d[1], ...d[4]]
        %}

code_block -> "{" executable_statements "}" {% d => ({ type: 'code_block', value: d[1] }) %}

executable_statement
   -> print_statement     {% id %}
   | if_statement         {% id %}
   | while_statement         {% id %}
   | var_initialisation         {% id %}
   | var_assignment         {% id %}
   | expression           {% id %}

var_initialisation -> ("int"|"char") __ var_reference {% d => ({ type: 'var_initialisation', variable: d[2], var_type: d[0][0] }) %}

if_statement
   -> "if" __ expression __ code_block
       {%
           d => ({
               type: "if_statement",
               condition: d[2],
			   code: d[4],
           })
       %}

while_statement
   -> "while" __ expression __ code_block
       {%
           d => ({
               type: "while_statement",
               condition: d[2],
			   code: d[4],
           })
       %}


print_statement
   -> "print" __ expression
       {%
           d => ({
               type: "print_statement",
               value: d[2],
           })
       %}

var_assignment
   -> var_reference _ "=" _ expression
       {%
           d => ({
               type: "var_assignment",
               variable: d[0],
			   value: d[4]
           })
       %}

expression -> additive_expression {%id%}
additive_expression -> multiplicative_expression {%id%}
	| multiplicative_expression _ [+-] _ additive_expression {% d => ({ type: 'additive_expression', operation: d[2], left: d[0], right: d[4] }) %}

multiplicative_expression -> unary_expression {%id%}
	| unary_expression _ [*] _ additive_expression {% d => ({ type: 'multiplicative_expression', left: d[0], right: d[4] }) %}

unary_expression -> char {%id%}
	| int {%id%}
	| string {%id%}
	| read {%id%}
	| var_reference {%id%}

var_reference -> "$" [a-z]:+        {% function(d) {return { type: 'var_reference', name: d[1].join('') }} %}
read -> "read"        {% function(d) {return { type: 'read' }} %}
string -> "\"" [\x00-\x7F]:* "\""        {% function(d) {return { type: 'string', value: d[1].join('')}} %}
char -> "'" [\x00-\x7F] "'"        {% function(d) {return { type: 'char', value: d[1]}} %}
int -> [0-9]:+        {% function(d) {return { type: 'int', value: parseInt(d[0].join(""))}} %}
_ -> [\s]:*     {% function(d) {return null } %}
__ -> [\s]:+     {% function(d) {return null } %}
