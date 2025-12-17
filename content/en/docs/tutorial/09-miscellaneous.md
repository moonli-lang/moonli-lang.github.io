---
title: 9. Miscellaneous
linkTitle: 9. Miscellaneous
---

So far, in this tutorial series, we have seen different aspects of Moonli (and Common Lisp) without seeing constructs to write your own code. Here we cover some of those constructs.

## Conditional Execution

Moonli supports the standard conditional form `if..elif..else`. This is translated to the Common Lisp form `cond`.

```moonli
if x > 10:
  format(t, "Large")
elif x > 5:
  format(t, "Medium")
else:
  format(t, "Small")
end
```

* Conditions evaluate top-to-bottom.
* The first true condition’s block is executed.
* The `elif` and `else` branches are optional.


## Looping

Moonli provides two main looping constructs

### for …

This is based on [Shinmera's for](https://shinmera.com/docs/for/) and corresponds to the standard `for` loops in other languages. These are useful for iterating over a data structures, or for iterating a fixed number of times.

For has a number of clauses. A generic clause is `over` that allows iteration over lists as well as vectors.

```moonli
# Iterate over lists
for x in (1, 2, 3):
  print(x)
end

# Iterate over vectors
for x in [1, 2, 3]:
  print(x)
end
```

To iterate over ranges:

```moonli
for i repeat 10:
  print(i)
end
```

### loop

Because Moonli runs on Common Lisp, you also have full access to the powerful `loop`. This is a mini-language for writing concise iteration and accumulation logic.

#### 1. Simple Repetition

The simplest form counts from 1 to N:

```moonli
loop :for i :from 1 :to 5 :do
  print(i)
end
```

```moonli
loop :for i :from 0 :to 20 :by 5 do
  print(i)
end
```

#### 2. Iterating Over Lists

You can loop directly over a list:

```moonli
loop :for x :in (10, 20, 30) :do
  print(x)
end
```

Or over any sequence:

```moonli
loop :for ch :across "moonli" :do
  print(ch)
end
```

#### 3. Conditional Execution Inside `loop`

The code following `:do` can be arbitrary Moonli code. This can include conditional statements. However, you can also put conditional statements with the `loop` itself:

```moonli
loop :for n :from 1 :to 10
     :when (rem(n, 2) == 0) :do
  format(t, "~d is even~%", n)
end
```

#### 4. Collect, Sum, Maximizing

One of the most powerful features is accumulation. `loop` can build lists, sums, and more without extra variables.

```moonli
loop :for i :in (1, 2, 3, 4)
     :collect i * 2
end
#=> (2, 4, 6, 8)


loop :for x :in (1, 2, 3, 4)
     :sum x
end
#=> 10


loop :for x :in (2, 3, 4, 1)
     :maximizing x
end
#=> 4
```

#### 5. Finally

A `finally` clause runs after the iteration and lets you return a final value:

```moonli
loop :for word :in ("hello", "world", "Moonli", "is", "powerful")
     :count word :into n
     :finally return(format(nil, "Found ~d words", n))
end
#=> "Found 5 words"
```

#### 6. Using Multiple Clauses

`loop` shines when you combine iteration, conditionals, and accumulation:

```moonli
loop :for x :in (-1, 2, 3, -1, 5)
     :when x > 0
       :collect x :into positives
     :finally return({
       :positives : positives,
       :total : apply(function(+), positives)
     })
end
#=> {
     :positives : (2, 3, 5),
     :total : 10
}
```

This runs in one pass but builds structured results.

## Format -- Producing Structured Output

Moonli’s `format` follows a simplified Lisp-style template mechanism. It allows inserting variables into strings or writing formatted text to output.

The first argument to `format` indicates the stream. This can be `t` which corresponds to the standard-output stream. Or `nil` which obtains the result as a string. Or any variable or expression that evaluates to a stream.

### 3.1 Basic formatting

```moonli
format(nil, "Hello, ~a!", "Moonli")
#=> "Hello, Moonli!"
```

`~a` inserts the argument using its “human-friendly” representation.

### 3.2 Multiple arguments

```moonli
format(nil, "~a + ~a = ~a", a, b, a + b)
```

### 3.3 Common directives

| Directive | Meaning                      |
|-----------|------------------------------|
| `~a`      | Insert readable form         |
| `~s`      | Insert literal/escaped form  |
| `~d`      | Insert decimal integer       |
| `~f`      | Insert floating-point number |
| `~%`      | Insert newline               |

Examples:

```moonli
format("Count: ~d", n)
format("Value: ~f", pi)
format("Debug: ~s", obj)
```

### 3.4 List Iteration with a joiner

```moonli
format(t, "~{~A~^, ~}", (1,2,3))
#=> (prints) 1, 2, 3
```

### More directives

The [wikipedia page on format](https://en.wikipedia.org/wiki/Format_(Common_Lisp)) lists the variety of directives supported by `format`.
