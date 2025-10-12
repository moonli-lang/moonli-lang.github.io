---
title: Introduction to Moonli for Common Lispers
linkTitle: Introduction to Moonli for Common Lispers
---



## What

This is a syntax layer that transpiles to Common Lisp.

```moonli
defun sum(args):
  if null(args):
    0
  else:
    first(args) + sum(rest(args))
  end
end
```

transpiles to:

```lisp
(defun sum (args)
   (cond ((null args)
          0)
         (t
          (+ (first args)
             (sum (rest args))))))
```

See [./moonli-sample.asd](./moonli-sample.asd) and
[./sample/sample.moonli](./sample/sample.moonli) to include in your
project.

## Table of Contents

- [What](#what)
- [Why](#why)
- [Features](#features)
  - [For common lispers](#for-common-lispers)
  - [For programmers in general](#for-programmers-in-general)
- [Plan](#plan)
- [Syntax](#syntax)
  - [Global variables](#global-variables)
  - [Local variables](#local-variables)
  - [Symbols](#symbols)
  - [Function-like calls](#function-like-calls)
  - [Functions](#functions)
  - [Dictionaries or Hash-tables](#dictionaries-or-hash-tables)
  - [Sets or Hash-sets](#sets-or-hash-sets)
  - [Infix operators](#infix-operators)
  - [lm](#lm)
  - [declaim](#declaim)
  - [declare](#declare)
  - [ifelse](#ifelse)
  - [lambda](#lambda)
  - [let-plus:let+](#let-pluslet)
  - [loop](#loop)
  - [defun](#defun)
  - [if](#if)
  - [let](#let)
  - [for:for](#forfor)
:::

## Why

Due to tools like
[paredit](http://danmidwood.com/content/2014/11/21/animated-paredit.html)
and [lispy](https://github.com/abo-abo/lispy) (beyond
[macros](https://lispcookbook.github.io/cl-cookbook/macros.html) and
metaprogramming), s-expression (Lists) based syntax of lisps is very
powerful. However, not every one has the time or patience to become
comfortable with them, especially when it comes to reading code, or
sharing it with your colleagues.

In the 21st century, very many more people are familiar with python,
matlab and julia than they are with lisps. Given the power and
flexibility of common lisp, `moonli` is an attempt to provide
a thin syntax layer over common lisp. It is thin in the sense it can be
easily transpiled to common lisp. The semantics remain the same and
clean as common lisp. ([Common Lisp](https://common-lisp.net/) is also
good for [reasons beyond
macros](https://www.quora.com/What-is-your-favourite-non-mainstream-programming-language/answer/Shubhamkar-Ayare).)

## Features

### For common lispers

- Case sensitive, but invert-case reader to maintain common lisp
  compatibility
- Transpile to common lisp, so lispers need not \"learn a new language\"
- Extensible using `moonli:define-moonli-macro` and
  `moonli:define-short-moonli-macro`. See
  [./src/macros/](./src/macros/) directory for examples.
- Inability to access internal symbols of another package through
  \"A::B\" syntax; this syntax rather translates to
  `(the B A)`

### For programmers in general

- Sane variable scoping rules as given by common lisp
- Sane namespace scoping thanks to common lisp package system
- Sane restarts and condition system thanks to common lisp
- Optional typing, optional dynamic scoping
- Availability of optimizing compilers such as SBCL
- Sensitive to newlines and semicolons but not to spaces and tabs
  (indentation insensitive)
- Returning multiple values without an intermediate data structure
- Support for rapid prototyping through CLOS and image-based development

Here\'s a brief comparison of features across different languages.

```
    FEATURES                             MOONLI       COMMON LISP       JULIA       HASKELL         RUST         PYTHON       JAVASCRIPT         C  
  ----------------------------------- ------------ ----------------- ----------- ------------- -------------- ------------ ---------------- -----------
  Syntax                                    +              +              +            +            ---             +              -             -
  Interactivity (Rapid Prototyping)       High         Very High      Moderate        Low           None        Moderate       Moderate        None
  Typing (Strong/Weak)                   Strong         Strong         Strong       Strong         Strong        Strong          Weak          Weak
  Typing (Static/Dynamic)               Flexible       Flexible       Flexible      Static         Static       Dynamic        Dynamic        Dynamic
  Typing (Expressivity)                 Flexible       Flexible       Moderate     Very High     Very High        Low            Low            Low
  Compiler Speed                        Flexible       Flexible         Slow       Moderate         Slow        Moderate       Moderate      Moderate
  Runtime Speed                         Flexible       Flexible         Fast       Moderate         Fast          Slow         Moderate        Fast
  Runtime Error Recovery                Advanced       Advanced        Limited     Moderate         None        Moderate       Moderate        None
  Binary Size                           Flexible       Flexible         Large          ?           Small          None           None          Small
  User Extensibility                      High           High         Moderate        Low           Low           None           None          None
  Compiler built-in optimizations         Low             Low         Very High        ?         Very High        Low          Moderate      Very High
  Long Term Support                       Low          Very High      Moderate         ?          Moderate      Moderate         Low         Very High
  Ecosystem (without interop)            Small           Small        Moderate       Small        Moderate       Large          Large          Large
  Memory Management                       Heap           Heap         Reference      Heap       Compile Time   Reference          ?           Manual
```
  
## Plan

- [x] Real numbers, strings, characters, lists, infix arithmetic
  operators, literal hash-tables, literal hash-sets
- [x] Typing using \"expr::type\" operator
- [x] Support for declare and declaim
- [x] Literal syntax for vectors, array access
- [x] BODMAS rule for parsing expressions
- [x] Binaries
- [x] VS Code integration
- [ ] Emacs mode and integration with slime
- [x] Infix Logical operators
- [ ] Add more forms: progn, mvb, dsb, let+, more...
- [ ] Add more tests
- [ ] Reverse transpile from common lisp

## Syntax

As with lisp, everything is an expression.

Simple syntax table:

```
  Lisp                       Moonli
  -------------------------- -------------------------
  #\a                        'a'
  "hello world"              "hello world"
  2, 2.0, 2d-3, 2.0d-3       2, 2.0, 2d-3, 2.0d-3
  'quoted-symbol             $quoted-symbol
  package:exported-symbol    package:exported-symbol
  package::internal-symbol   <WONTDO>
  (the type expr)            expr :: type
  (list form-1 form-2)       (form-1, form-2)
  (fn arg1 arg2)             fn(arg1, arg2)
  #c(re, im)                 <TODO>
```

### Global variables

``` moonli
defparameter *global* = 23
```

### Local variables

``` moonli
let answer-to-everything = 42 :
  answer-to-everything
end
```

### Symbols

Most valid symbols can be written in moonli. For example, above
`*global*` and `answer-to-everything` are each
single symbols. This is unlike mainstream languages where
`* - ? !` and several other characters are not allowed in
symbols.

However, this means that symbols must be separated from each other by
space. This is necessary to make a distinction between whether a
character stands for an infix operation or is part of a symbol.
`a+b` is a single symbol, but `a + b` is
translated to the lisp expression `(+ a b)`.

### Function-like calls

``` moonli
identity("hello world")
function(identity)
```

Because lisp macros and functions follow similar syntax, moonli syntax
for function calls can also be used for macro calls when the macro
syntax is simple. (Indeed, this can be inconvenient; see
[*defining your own*]{.spurious-link target="defining your own"}.)

``` moonli
destructuring-bind(a(b),(1,2),+(1,2))
```

transpiles to

```lisp
(destructuring-bind (a b) (list 1 2)
  (+ 1 2))
```

### Functions

Like lisp, return is implicit.

``` moonli
defun fib(n):
  if n < 0:
     error("Don't know how to compute fib for n=~d < 0", n)
  elif n == 0 or n == 1:
     1
  else:
    fib(n-1) + fib(n-2)
  end
end
```

### Dictionaries or Hash-tables

``` moonli
{
  :a : 2,
  "b": $cl:progn
}
```

transpiles to

```lisp
(fill-hash-table (:a 2) ("b" 'progn))
```

which expands to

```lisp
(let ((#:hash-table413 (make-hash-table :test #'equal :size 2)))
  (setf (gethash :a #:hash-table413) 2
        (gethash "b" #:hash-table413) 'progn)
  #:hash-table413)
```

### Sets or Hash-sets

``` moonli
{:a, "b" , $cl:progn}
```

transpiles to

```lisp
(fill-hash-set :a "b" 'progn)
```

which expands to

```lisp
(let ((#:hash-set417 (make-hash-table :test #'equal :size 3)))
  (setf (gethash :a #:hash-set417) t
        (gethash "b" #:hash-set417) t
        (gethash 'progn #:hash-set417) t)
  #:hash-set417)
```

### Infix operators

The following infix operators are recognized:

- `+ - * / ^`
- `or and not`
- \< \<= == != \>= \>

### lm

``` moonli
lm (): nil
```

transpiles to

``` common-lisp
(lambda () nil)
```

``` moonli
lm (x): x
```

transpiles to

``` common-lisp
(lambda (x) x)
```

``` moonli
lm (x, y): x + y
```

transpiles to

``` common-lisp
(lambda (x y) (+ x y))
```

### declaim

``` moonli
declaim inline(foo)
```

transpiles to

``` common-lisp
(declaim (inline foo))
```

``` moonli
declaim type(hash-table, *map*)
```

transpiles to

``` common-lisp
(declaim (type hash-table *map*))
```

### declare

``` moonli
declare type(single-float, x, y)
```

transpiles to

``` common-lisp
(declare (type single-float x y))
```

``` moonli
declare type(single-float, x, y), optimize(debug(3))
```

transpiles to

``` common-lisp
(declare (type single-float x y)
         (optimize (debug 3)))
```

### ifelse

``` moonli
ifelse a 5
```

transpiles to

``` common-lisp
(if a
    5
    nil)
```

``` moonli
ifelse a :hello :bye
```

transpiles to

``` common-lisp
(if a
    hello
    bye)
```

### lambda

``` moonli
lambda (): nil end
```

transpiles to

``` common-lisp
(lambda () nil)
```

``` moonli
lambda (x):
  x
end
```

transpiles to

``` common-lisp
(lambda (x) x)
```

``` moonli
lambda (x, y):
  let sum = x + y:
    sum ^ 2
  end
end
```

transpiles to

``` common-lisp
(lambda (x y)
  (let ((sum (+ x y)))
    (expt sum 2)))
```

### let-plus:let+

``` moonli
let-plus:let+ x = 42: x
end
```

transpiles to

``` common-lisp
(let+ ((x 42))
  x)
```

``` moonli
let-plus:let+ (a,b) = list(1,2):
  a + b
end
```

transpiles to

``` common-lisp
(let+ (((a b) (list 1 2)))
  (+ a b))
```

``` moonli
let-plus:let+ let-plus:&values(a,b) = list(1,2):
  a + b
end
```

transpiles to

``` common-lisp
(let+ (((&values a b) (list 1 2)))
  (+ a b))
```

``` moonli
let-plus:let+
  let-plus:&values(a,b) = list(1,2),
  (c,d,e) = list(1,2,3):
  {a,b,c,d,e}
end
```

transpiles to

``` common-lisp
(let+ (((&values a b) (list 1 2)) ((c d e) (list 1 2 3)))
  (fill-hash-set a b c d e))
```

### loop

``` moonli
loop end loop
```

transpiles to

``` common-lisp
(loop)
```

``` moonli
loop :repeat n :do
  print("hello")
end
```

transpiles to

``` common-lisp
(loop repeat n
      do (print hello))
```

``` moonli
loop :for i :below n :do
  print(i + 1)
end
```

transpiles to

``` common-lisp
(loop for i below n
      do (print (+ i 1)))
```

### defun

``` moonli
defun our-identity(x): x end
```

transpiles to

``` common-lisp
(defun our-identity (x) x)
```

``` moonli
defun add (&rest, args):
 args
end defun
```

transpiles to

``` common-lisp
(defun add (&rest args) args)
```

``` moonli
defun add(args):
  if null(args):
    0
  else:
    first(args) + add(rest(args))
  end if
end
```

transpiles to

``` common-lisp
(defun add (args) (cond ((null args) 0) (t (+ (first args) (add (rest args))))))
```

``` moonli
defun foo(&optional, a = 5): a end
```

transpiles to

``` common-lisp
(defun foo (&optional (a 5)) a)
```

### if

``` moonli
if a: b end if
```

transpiles to

``` common-lisp
(cond (a b) (t))
```

``` moonli
if a:
  b; c
end
```

transpiles to

``` common-lisp
(cond (a b c) (t))
```

``` moonli
if a: b
else: c
end if
```

transpiles to

``` common-lisp
(cond (a b) (t c))
```

``` moonli
if a:
   b; d
else:
   c; e
end if
```

transpiles to

``` common-lisp
(cond (a b d) (t c e))
```

``` moonli
if a: b
elif c: d; e
else: f
end if
```

transpiles to

``` common-lisp
(cond (a b) (c d e) (t f))
```

``` moonli
(if a: b else: c; end)::boolean
```

transpiles to

``` common-lisp
(the boolean (cond (a b) (t c)))
```

``` moonli
if null(args): 0; else: 1 end
```

transpiles to

``` common-lisp
(cond ((null args) 0) (t 1))
```

``` moonli
if null(args):
    0
else:
    first(args)
end if
```

transpiles to

``` common-lisp
(cond ((null args) 0) (t (first args)))
```

``` moonli
if null(args):
  0
else:
  2 + 3
end if
```

transpiles to

``` common-lisp
(cond ((null args) 0) (t (+ 2 3)))
```

``` moonli
if null(args):
  0
else:
  first(args) + add(rest(args))
end if
```

transpiles to

``` common-lisp
(cond ((null args) 0) (t (+ (first args) (add (rest args)))))
```

### let

``` moonli
let a = 2, b = 3:
   a + b
end
```

transpiles to

``` common-lisp
(let ((a 2) (b 3))
  (+ a b))
```

``` moonli
let a = 2, b = 3:
   a + b
end let
```

transpiles to

``` common-lisp
(let ((a 2) (b 3))
  (+ a b))
```

### for:for

``` moonli
for:for (i,j) in ((1,2),(3,4)):
  print(i + j)
end
```

transpiles to

``` common-lisp
(for (((i j) in (list (list 1 2) (list 3 4))))
  (print (+ i j)))
```

``` moonli
for:for i in (1,2,3), j in (2,3,4):
  print(i + j)
end
```

transpiles to

``` common-lisp
(for ((i in (list 1 2 3)) (j in (list 2 3 4)))
  (print (+ i j)))
```
