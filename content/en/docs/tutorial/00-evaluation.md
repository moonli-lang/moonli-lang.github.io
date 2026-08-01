---
title: 0. Evaluation
linkTitle: 0. Evaluation
weight: 10
---

<div class="tutorial-nav">
<a class="tutorial-prev">
</a>
<a class="tutorial-next" href="../01-literals/">
  Next: 1. Literal Objects >
</a>
</div>

Starting Moonli either using the included binary or using VS Code will start a Read–Eval–Print Loop (REPL).

> In VS Code, you will need to switch to a separate tab that contains the REPL.
> TODO: Elaborate more on evaluation in VS Code.

```moonli
MOONLI-USER> 
```

A REPL is how many interactive programming languages work. It’s a simple cycle: the computer reads what you type, *evaluates* it (figures out what it means and runs it), prints the result, and then loops back to wait for your next command. For example, if you type `defparameter x = 5` in the REPL, it evaluates it. It binds the variable `x` to the value `5`.

```moonli
MOONLI-USER> defparameter x = 5
[OUT]: x

MOONLI-USER> 
```

Next, if you type `x`, it evaluates `x` to return the value `5`.

```moonli
MOONLI-USER> x
[OUT]: 5
```

This loop makes programming feel conversational -- you can test ideas instantly, explore code step by step, and see exactly how the language thinks and responds.

For any input, you can prevent *evaluation* by prefixing it with `$`. This is known as `quote`-ing.

```moonli
MOONLI-USER> $x
[OUT]: x
```

<div class="tutorial-nav">
<a class="tutorial-prev">
</a>
<a class="tutorial-next" href="../01-literals/">
  Next: 1. Literal Objects >
</a>
</div>
