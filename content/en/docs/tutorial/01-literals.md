---
title: 1. Literal Objects
linkTitle: 1. Literal Objects
---

<div class="tutorial-nav">
<a class="tutorial-prev" href="../00-evaluation/">
  < Previous: 0. Evaluation
</a>
<a class="tutorial-next" href="../02-symbols/">
  Next: 2. Symbols, Variables, and Values >
</a>
</div>

In a programming language, a literal object is something the evaluator doesn’t need to compute—it already is its own value. When the REPL reads a literal like 5, "hello", or #t, the eval step simply returns it unchanged, because it directly represents itself.

For example, since `5` is already a number:

```moonli
MOONLI-USER> 5
[OUT]: 5
```

By contrast, when you type an expression like `2 + 3`, the result is a new value obtained through the process of *evaluation*. Literals skip that process entirely.

```moonli
MOONLI-USER> 2 + 3
[OUT]: 5
```

Moonli has several kinds of literal objects.

## Literal Objects in Moonli

### Symbols

A symbol is a name that represents something else, like a label attached to a value or concept. In Moonli, symbols are the basic building blocks of code.

For example, recall the `x` that you typed at the REPL. It was a symbol. When you had quoted the symbol `x`, Moonli returned the symbol itself.

```moonli
MOONLI-USER> $x
[OUT]: x
```

A special kind of symbols that do not require to be quoted are *keywords*.

```moonli
MOONLI-USER> :i-am-a-keyword
[OUT]: :i-am-a-keyword
```

However, *keywords* require to be prefixed with a colon `:`. Note also that symbols in Moonli can contain hyphens.

We will look at symbols in more detail in the [next chapter](./02-symbols.md).

### Numbers

Recall from high school mathematics, that there can be different kinds of numbers, like integers, and real numbers. Programming languages can also represent different kinds of numbers. Two important ones include integers and floats.

Integers are whole numbers without fractions -- like -3, 0, or 42. They’re exact and good for counting or discrete steps.

```moonli
MOONLI-USER> 42
[OUT]: 42
```

Floating-point numbers (or floats) represent real numbers that may include decimals -- like 3.14 or -0.001. They’re useful for measurements or continuous values but can lose precision because they’re stored in binary form.

When evaluated, both kinds of numbers are literal objects -- they evaluate to themselves. So typing 3.14 in a REPL simply returns 3.14, already fully evaluated.

```moonli
MOONLI-USER> 3.14
[OUT]: 3.14
MOONLI-USER> -0.001
[OUT]: -0.001
```

Note that it is important that there is no space between `-` and `0.001` for Moonli to understand it as `-0.001`. 

### Strings

Strings are sequences of characters used to represent text -- like "hello", "42", or "Moonli rocks!". They’re written between quotation marks so the evaluator knows they’re text, not symbols or code.

```moonli
MOONLI-USER> "Moonli rocks!"
[OUT]: "Moonli rocks!"
```

When the REPL reads a string, it treats it as a literal object, meaning it already represents its own value and needs no further evaluation. For example, typing `"cat"` simply returns `"cat"`.

```moonli
MOONLI-USER> "cat"
[OUT]: "cat"
```

Strings can contain letters, digits, spaces, or even special symbols, and most languages let you combine (concatenate) or inspect them with built-in functions. They’re essential for displaying messages, storing words, or communicating with users.

While symbols are useful for working with code, strings are useful for working with text.

### Characters

Characters can be understood as blocks of strings. Each string is a sequence of characters. An individual character can be input to the REPL using single quotation marks.

```moonli
MOONLI-USER> 'a'
[OUT]: #\a
```

<div class="tutorial-nav">
<a class="tutorial-prev" href="../00-evaluation/">
  < Previous: 0. Evaluation
</a>
<a class="tutorial-next" href="../02-symbols/">
  Next: 2. Symbols, Variables, and Values >
</a>
</div>

