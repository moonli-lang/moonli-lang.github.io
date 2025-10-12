---
title: Tutorial
linkTitle: Tutorial
menu: {main: {weight: 20}}
---

Moonli follows the idiom \"everything is an expression\". Thus, one does
not need to worry about statements and expressions.

The simplest moonli program consists of a single expression. For
example, entering the string `"Hello, world!"`{.verbatim} at the REPL
will return the same value.

    MOONLI-USER> "Hello, world!"

    [OUT]: "Hello, world!"

You can also create a `tutorial.moonli`{.verbatim} file with the
contents

    "Hello, world!"

And then run it using `moonli tutorial.moonli`{.verbatim}. You will note
that it does not produce any output. The expression `"Hello, world!"`
*evaluates* to `"Hello, world!"`{.verbatim}, but it does not write
anything to the output. To write to the output, we can call the `format`
function.

    MOONLI-USER> format(t, "Hello, world!")
    Hello, world!
    [OUT]: NIL

This writes to the output, but returns a value `NIL`. This is a special
value with multiple meanings, but essentially, it corresponds to
\"nothing\".
