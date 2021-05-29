// Generated automatically by nearley, version undefined
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "input", "symbols": ["executable_statements"], "postprocess": id},
    {"name": "executable_statements", "symbols": ["executable_statement"], "postprocess": d => [d[0]]},
    {"name": "executable_statements", "symbols": ["executable_statement", "executable_statements"], "postprocess": 
        d => [d[0], ...d[1]]
                },
    {"name": "executable_statement", "symbols": ["plus"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["minus"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["right"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["left"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["print"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["read"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["loop"], "postprocess": id},
    {"name": "minus", "symbols": [{"literal":"-","pos":72}], "postprocess": d => ({ type: 'change_value', value: -1 })},
    {"name": "plus", "symbols": [{"literal":"+","pos":80}], "postprocess": d => ({ type: 'change_value', value: 1 })},
    {"name": "right", "symbols": [{"literal":">","pos":88}], "postprocess": d => ({ type: 'change_pointer', value: 1 })},
    {"name": "left", "symbols": [{"literal":"<","pos":96}], "postprocess": d => ({ type: 'change_pointer', value: -1 })},
    {"name": "print", "symbols": [{"literal":".","pos":104}], "postprocess": d => ({ type: 'print' })},
    {"name": "read", "symbols": [{"literal":",","pos":112}], "postprocess": d => ({ type: 'read' })},
    {"name": "loop", "symbols": [{"literal":"[","pos":120}, "executable_statements", {"literal":"]","pos":124}], "postprocess": d => ({ type: 'loop', value: d[1] })},
    {"name": "loop", "symbols": [{"literal":"[","pos":130}, {"literal":"]","pos":132}], "postprocess": () => ({ type: 'loop', value: [] })}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
