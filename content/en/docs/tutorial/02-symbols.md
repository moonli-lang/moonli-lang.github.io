---
title: 2. Symbols, Variables, and Values
linkTitle: 2. Symbols, Variables, and Values
---

A critical aspect of programming is building abstractions. The first step to such abstractions involves using *variables* to stand in for *[literal values](01-literals.md)* that we studied in the last section.

Programmatically, *variables* are *symbols* that can be *eval*-uated to obtain the *value* they are bound to. You have already seen a few symbols. Below, `x` and `:i-am-a-keyword` are two symbols.

```moonli
MOONLI-USER> $x
[OUT]: x
MOONLI-USER> :i-am-a-keyword
[OUT]: :i-am-a-keyword
```

Recall that the `$`-prefix was used to *quote* the symbols to prevent their *eval*-uation. (Recall the initial section on [evaluation](00-evaluation.md).) Recall also that *keywords* are symbols that begin with a colon `:`, and they do not need to be quoted. What happens when you omit the `$`-prefix for non-keywords?

```moonli
MOONLI-USER> x
unbound-variable: The variable x is unbound.
```

This time, instead of receiving the output, we received an error message. It tells us that the REPL does not know how to evaluate `x`. We can provide REPL this information by `defparameter`.

```moonli
MOONLI-USER> defparameter x = 42
[OUT]: x
```

This tells the REPL to *bind* the symbol `x` to the literal value `400`. After this, if you type the unquoted `x`, even without the `$`-prefix, you do not receive an error. Instead, the REPL tells you the value that the symbol is *bound* to.

```moonli
MOONLI-USER> x
[OUT]: 42
```

You can check whether a symbol is bound to using `boundp`. The output `t` means *true*. Indeed the symbol `x` is bound to some value!

```moonli
MOONLI-USER> boundp($x)
[OUT]: t
```

On the other hand, unless you had defined the value of `y` using `defparameter` beforehand, the symbol `y` would be unbound. This is indicated by the output `nil` which means false. The symbol `y` is not bound to any value.

```moonli
MOONLI-USER> boundp($y)
[OUT]: nil
```

The idea of a variable is *conceptual*. It is something we use to talk about or describe programming. On the other hand, for Moonli (and for Lisps in general), *symbols* are programmatic objects that we can manipulate. We will revisit this idea later.

The bindings of the variables can be updated. In other words, variables can be assigned new values. This is a frequent part of programming. For example:

```moonli
MOONLI-USER> x = 84
[OUT]: 84
MOONLI-USER> x
[OUT]: 84
```

## Global and Local

Variables defined using `defparameter` are *global* variables. 

*Global* variables are accessible from anywhere within the program. This means anyone can assign them new values or change the values they are assigned to. So, if used frequently, programs can be hard to understand because it will be difficult to figure out where a particular variable is being reassigned.

That is why, the more common approach to using a variable is by using *local* variables. In Moonli, These can be defined using `let` and `let+`. We show an example below.

```moonli
MOONLI-USER> let a = 1, b = 2:
  a + b
end
[OUT]: 3
MOONLI-USER> let+ a = 1, b = 2:
  a + b
end
[OUT]: 3
```

One difference between `let` and `let+` is that `let` can be described as performing *parallel* binding, while `let+` can be described as performing *sequential* binding. 

The following works with `let+` but not `let`.

```moonli
MOONLI-USER> let+ a = 1, b = a:
  a + b
end
[OUT]: 2

MOONLI-USER> let a = 1, b = a:
  a + b
end
; in: progn (let ((a 1) (b a))
;          (+ a b))
;     (MOONLI-USER::B MOONLI-USER::A)
;
; caught warning:
;   undefined variable: moonli-user::a
;
; compilation unit finished
;   Undefined variable:
;     a
;   caught 1 WARNING condition
unbound-variable: The variable a is unbound.
```

With `let`, we get the error that the variable `a` is unbound. This is because `let` binds all its variables as if they are made *at once*. In `let a = 1, b = a`, we are asking the REPL to bind `b` to its value at the same time as `a`. But the value of `b` is told to be `a`. At that point in the program, the value of `a` is unavailable, resulting in the error.

The algorithm for `let` can be written as:

1. Compute the values of all the expressions assigned to the variables, without assigning them.
2. Bind the variables to the values of the respective expressions
3. Execute the *body*. (In this case the body is simply `a + b`. But it could be any valid Moonli code.)
4. Unbind the variables.

In contrast the algorithm for `let+` can be written as:

1. Bind the first variable to the value of the corresponding expression.
2. Bind the second variable to the value of the corresponding expression.
   ... Repeat the same for all variables ...
3. Execute the *body*. (In this case the body is simply `a + b`. But it could be any valid Moonli code.)
4. Unbind the variables.

It is generally recommended to use `let` since it often allows you to think about the value of each variable independently of the other variables. But when you can't use `let`, feel free to use `let+`.

## Global variables should have earmuffs

Suppose you see an arbitrary variable in some code. How can you tell whether it is global or local? Different programming languages or projects have different conventions. For Moonli (and Lisps), it is recommended that global variables should have earmuffs `*...*` around them.

Thus one should write

```moonli
MOONLI-USER> defparameter *x* = 42
[OUT]: *x*
MOONLI-USER> *x*
[OUT]: 42
```

Instead of

```moonli
MOONLI-USER> defparameter x = 42
[OUT]: x
```

## Unbinding using `makunbound`

One can remove the binding of a variable using `makunbound`:

```moonli
MOONLI-USER> makunbound($x)
[OUT]: x
MOONLI-USER> x
unbound-variable: The variable x is unbound.
MOONLI-USER> boundp($x)
[OUT]: nil
```

While it is okay to use `makunbound` in the REPL, it is recommended to avoid using it in the code you write and save in files and share with others. Creation, deletion, re-creation is harder to understand that a single creation. Use local variables wherever possible.
