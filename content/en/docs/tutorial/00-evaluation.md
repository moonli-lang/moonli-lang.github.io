---
title: 0. Evaluation
linkTitle: 0. Evaluation
---

Starting Moonli either using the included binary or using VS Code will start a Read–Eval–Print Loop (REPL).

> In VS Code, you will need to switch to a separate tab that contains the REPL.
> TODO: Elaborate more on evaluation in VS Code.

```moonli
MOONLI-USER> 
```

A REPL is how many interactive programming languages work. It’s a simple cycle: the computer reads what you type, *evaluates* it (figures out what it means and runs it), prints the result, and then loops back to wait for your next command. For example, if you type `2 + 3` in the REPL, it reads the expression, *evaluates* it to get `5`, prints that result, and waits for more input.

```moonli
MOONLI-USER> 2 + 3
[OUT]: 5

MOONLI-USER> 
```

This loop makes programming feel conversational -- you can test ideas instantly, explore code step by step, and see exactly how the language thinks and responds.

For any input expression, you can prevent *evaluation* by prefixing it with `$`. This is known as `quote`-ing.

```moonli
MOONLI-USER> $x
[OUT]: x
MOONLI-USER> $(1 + 2)
[OUT]: (+ 1 2)
```

Note that for `$(1 + 2)`, even though evaluation has been avoided, the expression is printed as it appears to Moonli internally, just before the step of evaluation. What you type at the REPL is converted to an internal representation that Moonli can then work with.

