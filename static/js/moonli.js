Prism.languages.moonli = {
    // Borrow from Julia
    'comment': {
        // support one level of nested comments
        // https://github.com/JuliaLang/julia/pull/6128
        pattern: /(^|[^\\])(?:#=(?:[^#=]|=(?!#)|#(?!=)|#=(?:[^#=]|=(?!#)|#(?!=))*=#)*=#|#.*)/,
        lookbehind: true
    },
    'regex': {
        // https://docs.julialang.org/en/v1/manual/strings/#Regular-Expressions-1
        pattern: /r"(?:\\.|[^"\\\r\n])*"[imsx]{0,4}/,
        greedy: true
    },
    'string': {
        // https://docs.julialang.org/en/v1/manual/strings/#String-Basics-1
        // https://docs.julialang.org/en/v1/manual/strings/#non-standard-string-literals-1
        // https://docs.julialang.org/en/v1/manual/running-external-programs/#Running-External-Programs-1
        pattern: /"""[\s\S]+?"""|(?:\b\w+)?"(?:\\.|[^"\\\r\n])*"|`(?:[^\\`\r\n]|\\.)*`/,
        greedy: true
    },
    'char': {
        // https://docs.julialang.org/en/v1/manual/strings/#man-characters-1
        pattern: /(^|[^\w'])'(?:\\[^\r\n][^'\r\n]*|[^\\\r\n])'/,
        lookbehind: true,
        greedy: true
    },
    'keyword': /(\b|:)(?:defparameter|defvar|defun|let|let\+|defconstant|loop|do|else|elif|declare|type|declaim|optimize|ifelse|end|in-package|finally|for|if|locally|defmacro|print|format|quote|return|defstruct|lambda|lm|inline|&values|&optional|&rest|&key)\b/,
    'boolean': /\b(?:nil|t)\b/,
    'number': /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+(?:_[\da-f]+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[efp][+-]?\d+(?:_\d+)*)?j?/i,
    // https://docs.julialang.org/en/v1/manual/mathematical-operations/
    // https://docs.julialang.org/en/v1/manual/mathematical-operations/#Operator-Precedence-and-Associativity-1
    // 'operator': /&&|\|\||[-+*^%÷⊻&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:|])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥'√∛]/,
    // 'variable': /\b\S+\b/,
    'operator': /\b[-+*/^&\|<>]|==\b/,
    'punctuation': /[\{\}\[\]\(\):;,]/,
    // https://docs.julialang.org/en/v1/base/numbers/#Base.im
    'constant': /\b(?:(?:Inf|NaN)(?:16|32|64)?|im|pi)\b|[πℯ]/

}
