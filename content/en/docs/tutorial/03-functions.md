---
title: 3. Functions and Abstractions
linkTitle: 3. Functions and Abstractions
---

<div class="tutorial-nav">
<a class="tutorial-prev" href="../02-symbols/">
  < Previous: 2. Symbols, Variables, and Values
</a>
<a class="tutorial-next" href="../04-packages/">
  Next: 4. Packages and Namespaces >
</a>
</div>

Besides *variables* that we studied in the [last chapter](./02-symbols.md), the second key element to abstraction are *functions*.

Even if you write abstract code such as the one in the last chapter, you will need to write it again and again for different values of x:

```moonli
let x = 23:
  print(x * x * x)
end

let x = 47:
  print(x * x * x)
end
```

Functions help us get rid of this code repetition and further enable *reuse*. Functions are characterized by *parameters*, which are essentially lists of variables. For example, the below code defines a function `multiply-thrice` that has a single parameter `x`:

```moonli
defun multiply-thrice(x):
  print(x * x * x)
end
```

It takes this parameter, multiplies it with itself thrice, and *returns* the result.

```moonli
MOONLI-USER> multiply-thrice(23)

12167
[OUT]: 12167
MOONLI-USER> multiply-thrice(47)

103823
[OUT]: 103823
```

Thus, the lines of code `multiply-thrice(23)` or `multiply-thrice(47)` achieves the same effect as the two blocks of `let` we used earlier.

The full code looks something like the following:

```moonli
defun multiply-thrice(x):
  print(x * x * x)
end

multiply-thrice(23)
multiply-thrice(47)
```

There are many built-in functions that Moonli provides. `print` is one such function. You may have noticed that the result is printed twice in the REPL. This is because of `print`. If you omit the `print`, the REPL would look something like this:

```moonli
MOONLI-USER> defun new-multiply-thrice(x):
  x * x * x
end
[OUT]: new-multiply-thrice
MOONLI-USER> new-multiply-thrice(23)
[OUT]: 12167
MOONLI-USER> new-multiply-thrice(47)
[OUT]: 103823
```

A function can span multiple lines of code. By default, it returns the value resulting from the evaluation of the last line of code (excluding `end`). For our `new-multiply-thrice`, this refers to the value of `x * x * x`. For our old `multiply-thrice`, it would have been `print(x * x * x)`.

`print(x * x * x)` first multiplies `x` with itself thrice. Prints the result. And returns it. You can see this in action if you *instantiate* `x` with a concrete value such as `23` or `47`:

```moonli
MOONLI-USER> print(23 * 23 * 23)
12167
[OUT]: 12167
MOONLI-USER> print(47 * 47 * 47)
103823
[OUT]: 103823
```

Since `print(x * x * x)` was the last line of `muliply-thrice`, the return value of `multiply-thrice` is the same as the return value of `print(x * x * x)`.

```moonli
MOONLI-USER> multiply-thrice(23)

12167
[OUT]: 12167
MOONLI-USER> multiply-thrice(47)

103823
[OUT]: 103823
```

Similarly, the following code defines an `add` function that takes in two parameters `x` and `y`. It multiplies the values of these parameters and returns the result.

```moonli
MOONLI-USER> defun add(x,y):
  x + y
end
[OUT]: add
MOONLI-USER> add(2,3)
[OUT]: 5
```

## Error: Invalid number of arguments

What happens if you call `add` with just a single argument?

```moonli
MOONLI-USER> add(2)
simple-program-error: invalid number of arguments: 1
Backtrace for: #<SB-THREAD:THREAD tid=259 "main thread" RUNNING {7005490613}>
0: (MOONLI-USER::ADD 2) [external]
1: (SB-INT:SIMPLE-EVAL-IN-LEXENV (MOONLI-USER::ADD 2) #<NULL-LEXENV>)
2: (SB-INT:SIMPLE-EVAL-IN-LEXENV (PROGN (MOONLI-USER::ADD 2)) #<NULL-LEXENV>)
...
```

The first line of this says that there was an error in the code you asked the REPL to evaluate. In particular, the code has invalid number of arguments. Similarly, what happens when if you call `multiply-thrice` with three arguments? This results in a similar error:

```moonli
MOONLI-USER> multiply-thrice(2,3,4)
simple-program-error: invalid number of arguments: 3
Backtrace for: #<SB-THREAD:THREAD tid=259 "main thread" RUNNING {7005490613}>
0: (MOONLI-USER::MULTIPLY-THRICE 2 3 4) [external]
1: (SB-INT:SIMPLE-EVAL-IN-LEXENV (MOONLI-USER::MULTIPLY-THRICE 2 3 4) #<NULL-LEXENV>)
...
```

## Calling other functions

Notice how you called `print` function from inside the `multiply-thrice` function? Calling other functions from one function is very common. You can also write another function that uses both `new-multiply-thrice` and `add`:

```moonli
defun multiply-thrice-and-add(x,y):
  let x-cubed = new-multiply-thrice(x),
      y-cubed = new-multiply-thrice(y):
    add(x-cubed, y-cubed)
  end
end
```

The return value of `multiply-thrice-and-add` is determined by `add(x-cubed, y-cubed)` since that is the last line of code (excluding `end`).

You can see what this function is doing in more detail by printing the values of the variables in intermediate steps. This can be done using the `format` function. We will explain `format` in more detail later:

```moonli
defun multiply-thrice-and-add(x,y):
  let x-cubed = new-multiply-thrice(x),
      y-cubed = new-multiply-thrice(y):
    format(t, "x-cubed has value: ~a~%", x-cubed)
    format(t, "y-cubed has value: ~a~%", y-cubed)
    add(x-cubed, y-cubed)
  end
end
```

You can see the intermediate steps:

```moonli
MOONLI-USER> multiply-thrice-and-add(2,3)
x-cubed has value: 8
y-cubed has value: 27
[OUT]: 35
```

Usually, writing something as a function instead of repeating it needlessly everywhere is helpful because it enables *reuse*.

<div class="tutorial-nav">
<a class="tutorial-prev" href="../02-symbols/">
  < Previous: 2. Symbols, Variables, and Values
</a>
<a class="tutorial-next" href="../04-packages/">
  Next: 4. Packages and Namespaces >
</a>
</div>
