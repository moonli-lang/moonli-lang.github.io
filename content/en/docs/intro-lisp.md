---
title: Introduction to Moonli for Common Lispers
linkTitle: For Common Lispers
weight: 30
---

Moonli is a syntax layer that transpiles to Common Lisp.

For example,

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

See [moonli-sample.asd](https://github.com/moonli-lang/moonli/blob/main/moonli-sample.asd) and
[sample/sample.moonli](https://github.com/moonli-lang/moonli/blob/main/sample/sample.moonli) to include in your
project.

# Table of Contents

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

- [Core Syntax](#core-syntax)
- [Macros](#macros)
    - [declaim](#declaim)
    - [declare](#declare)
    - [defclass](#defclass)
    - [defgeneric](#defgeneric)
    - [defmethod](#defmethod)
    - [defpackage](#defpackage)
    - [defparameter](#defparameter)
    - [defstruct](#defstruct)
    - [deftype](#deftype)
    - [defun](#defun)
    - [defvar](#defvar)
    - [for](#for)
    - [if](#if)
    - [ifelse](#ifelse)
    - [in-package](#in-package)
    - [labels](#labels)
    - [lambda](#lambda)
    - [let](#let)
    - [let+](#let)
    - [lm](#lm)
    - [loop](#loop)
    - [time](#time)

<!-- markdown-toc end -->


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

## Contrasts with Common Lisp

- Case sensitive, but invert-case reader to maintain common lisp
  compatibility
- Extensible using `moonli:define-moonli-macro` and
  `moonli:define-short-moonli-macro`. See
  [src/macros/](https://github.com/moonli-lang/moonli/tree/main/src/macros) directory for examples.
- Inability to access internal symbols of another package through
  \"A::B\" syntax; this syntax rather translates to
  `(the B A)`

# Syntax

As with lisp, everything is an expression.

Moonli's syntax can be understood in terms of a (i) Core Syntax, and (ii) Macros. The core syntax makes space for macros, and macros provide extensibility. A third part concerns the `with`-special macros.

## Core Syntax

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

## Macros

One defines a *Moonli Macro* or a *Moonli Short Macro* that expands to a Common Lisp macro or special form. These can be defined by `moonli:define-moonli-macro` and `moonli:define-moonli-short-macro` respectively. The difference between a *Moonli Macro* and a *Moonli Short Macro* is that the former end with `end` and can stretch over multiple lines, while the latter are expected to either span a single line or have their components be separated by non-newline whitespaces. See [src/macros](https://github.com/moonli-lang/moonli/tree/main/src/macros) for examples.

Several Moonli macros are predefined as part of Moonli system, and you can add more Moonli macros as part of your own library or application.

Example transpilations for these predefined Moonli macros are given below:

### declaim

```moonli
declaim inline(foo)
```

transpiles to

```lisp
(declaim (inline foo))
```

```moonli
declaim type(hash-table, *map*)
```

transpiles to

```lisp
(declaim (type hash-table *map*))
```


### declare

```moonli
declare type(single-float, x, y)
```

transpiles to

```lisp
(declare (type single-float x y))
```

```moonli
declare type(single-float, x, y), optimize(debug(3))
```

transpiles to

```lisp
(declare (type single-float x y)
         (optimize (debug 3)))
```


### defclass

```moonli
defclass point():
end
```

transpiles to

```lisp
(defclass point nil nil)
```

```moonli
defclass point():
  options:
    metaclass: standard-class;
  end
end
```

transpiles to

```lisp
(defclass point nil nil (:metaclass standard-class))
```

```moonli
defclass point():
  options:
    metaclass: standard-class;
    documentation: "A class for Points!";
  end
end
```

transpiles to

```lisp
(defclass point nil nil (:metaclass standard-class)
          (:documentation "A class for Points!"))
```

```moonli
defclass point():
  slots:
  end
end
```

transpiles to

```lisp
(defclass point nil nil)
```

```moonli
defclass point():
  slots:
    x;
    y;
  end
end
```

transpiles to

```lisp
(defclass point nil ((x) (y)))
```

```moonli
defclass point():
  slots:
    x:
      initform: 2.0,
      type: single-float,
      accessor: point-x;
  end
end
```

transpiles to

```lisp
(defclass point nil ((x :initform 2.0 :type single-float :accessor point-x)))
```

```moonli
defclass point():
  slots:
    x:
      initform: 2.0,
      type: single-float,
      accessor: point-x;
    y:
      initform: 2.0,
      type: single-float,
      accessor: point-y;
  end
end
```

transpiles to

```lisp
(defclass point nil
          ((x :initform 2.0 :type single-float :accessor point-x)
           (y :initform 2.0 :type single-float :accessor point-y)))
```

```moonli
defclass point():
  slots:
    x:
      initform: 2.0,
      type: single-float,
      accessor: point-x;
    y:
      initform: 2.0,
      type: single-float,
      accessor: point-y;
  end
  options:
    metaclass: standard-class;

    documentation: "Two dimensional points.";

  end
end
```

transpiles to

```lisp
(defclass point nil
          ((x :initform 2.0 :type single-float :accessor point-x)
           (y :initform 2.0 :type single-float :accessor point-y))
          (:metaclass standard-class)
          (:documentation "Two dimensional points."))
```


### defgeneric

```moonli
defgeneric area(shape)
```

transpiles to

```lisp
(defgeneric area
    (shape))
```


### defmethod

```moonli
defmethod our-identity(x): x end
```

transpiles to

```lisp
(defmethod our-identity (x) x)
```

```moonli
defmethod :before our-identity(x):
  format(t, "Returning identity~%")
end
```

transpiles to

```lisp
(defmethod :before our-identity (x) (format t "Returning identity~%"))
```

```moonli
defmethod :after our-identity(x):
  format(t, "Returned identity~%")
end
```

transpiles to

```lisp
(defmethod :after our-identity (x) (format t "Returned identity~%"))
```

```moonli
defmethod add (x :: number, y :: number):
 x + y
end
```

transpiles to

```lisp
(defmethod add ((x number) (y number)) (+ x y))
```

```moonli
defmethod add (x :: number, y :: number, &rest, others):
  x + if null(others):
    y
  else:
    apply(function(add), y, others)
  end
end
```

transpiles to

```lisp
(defmethod add ((x number) (y number) &rest others)
  (+ x (cond ((null others) y) (t (apply #'add y others)))))
```

```moonli
defmethod add (x :: number, y :: number, &rest, others):
  x + (if null(others):
    y
  else:
    apply(function(add), y, others)
  end)
end
```

transpiles to

```lisp
(defmethod add ((x number) (y number) &rest others)
  (+ x (cond ((null others) y) (t (apply #'add y others)))))
```

```moonli
defmethod add (x :: string, y):
  uiop:strcat(x, y)
end
```

transpiles to

```lisp
(defmethod add ((x string) y) (uiop/utility:strcat x y))
```


### defpackage

```moonli
defpackage foo
  :use cl;
end
```

transpiles to

```lisp
(defpackage foo
  (:use cl))
```


### defparameter

```moonli
defparameter a = 5
```

transpiles to

```lisp
(defparameter a 5)
```


### defstruct

```moonli
defstruct foo:
  a;
  b;
end
```

transpiles to

```lisp
(defstruct foo a b)
```

```moonli
defstruct foo:
  (a = 4) :: number;
  b;
end
```

transpiles to

```lisp
(defstruct foo (a 4 :type number) b)
```

```moonli
defstruct foo:
  (a = 4), :read-only = t;
  b;
end
```

transpiles to

```lisp
(defstruct foo (a 4 :read-only t) b)
```

```moonli
defstruct foo:
  (a = 4), :read-only = t;
  (b = 2.0) :: single-float, :read-only = t;
end
```

transpiles to

```lisp
(defstruct foo (a 4 :read-only t) (b 2.0 :type single-float :read-only t))
```

```moonli
defstruct foo:
  a = 4;
  b = 2.0;
end
```

transpiles to

```lisp
(defstruct foo (a 4) (b 2.0))
```


### deftype


### defun

```moonli
defun our-identity(x): x end
```

transpiles to

```lisp
(defun our-identity (x) x)
```

```moonli
defun add (&rest, args):
 args
end defun
```

transpiles to

```lisp
(defun add (&rest args) args)
```

```moonli
defun add(args):
  if null(args):
    0
  else:
    first(args) + add(rest(args))
  end if
end
```

transpiles to

```lisp
(defun add (args) (cond ((null args) 0) (t (+ (first args) (add (rest args))))))
```

```moonli
defun foo(&optional, a = 5): a end
```

transpiles to

```lisp
(defun foo (&optional (a 5)) a)
```


### defvar

```moonli
defvar a = 5
```

transpiles to

```lisp
(defvar a 5)
```


### for

```moonli
for:for (i,j) in ((1,2),(3,4)):
  print(i + j)
end
```

transpiles to

```lisp
(for-minimal:for (((i j) in (list (list 1 2) (list 3 4))))
  (print (+ i j)))
```

```moonli
for:for i in (1,2,3), j in (2,3,4):
  print(i + j)
end
```

transpiles to

```lisp
(for-minimal:for ((i in (list 1 2 3)) (j in (list 2 3 4)))
  (print (+ i j)))
```


### if

```moonli
if a: b end if
```

transpiles to

```lisp
(cond (a b) (t))
```

```moonli
if a:
  b; c
end
```

transpiles to

```lisp
(cond (a b c) (t))
```

```moonli
if a: b
else: c
end if
```

transpiles to

```lisp
(cond (a b) (t c))
```

```moonli
if a:
   b; d
else:
   c; e
end if
```

transpiles to

```lisp
(cond (a b d) (t c e))
```

```moonli
if a: b
elif c: d; e
else: f
end if
```

transpiles to

```lisp
(cond (a b) (c d e) (t f))
```

```moonli
(if a: b else: c; end)::boolean
```

transpiles to

```lisp
(the boolean (cond (a b) (t c)))
```

```moonli
if null(args): 0; else: 1 end
```

transpiles to

```lisp
(cond ((null args) 0) (t 1))
```

```moonli
if null(args):
    0
else:
    first(args)
end if
```

transpiles to

```lisp
(cond ((null args) 0) (t (first args)))
```

```moonli
if null(args):
  0
else:
  2 + 3
end if
```

transpiles to

```lisp
(cond ((null args) 0) (t (+ 2 3)))
```

```moonli
if null(args):
  0
else:
  first(args) + add(rest(args))
end if
```

transpiles to

```lisp
(cond ((null args) 0) (t (+ (first args) (add (rest args)))))
```


### ifelse

```moonli
ifelse a 5
```

transpiles to

```lisp
(if a
    5
    nil)
```

```moonli
ifelse a :hello :bye
```

transpiles to

```lisp
(if a
    :hello
    :bye)
```


### in-package


### labels

```moonli
labels foo(x):
         bar(x - 1)
       end,
       bar(x):
         if (x < 0): nil else: foo(x - 1) end
       end:
  foo(42)
end
```

transpiles to

```lisp
(labels ((foo (x)
           (bar (- x 1)))
         (bar (x)
           (cond ((< x 0) nil) (t (foo (- x 1))))))
  (foo 42))
```

```moonli
labels foo(x):
         if (x < 0): nil else: foo(x - 1) end
       end:
  foo(42)
end
```

transpiles to

```lisp
(labels ((foo (x)
           (cond ((< x 0) nil) (t (foo (- x 1))))))
  (foo 42))
```

```moonli
labels :
  nil
end
```

transpiles to

```lisp
(labels ()
  nil)
```


### lambda

```moonli
lambda (): nil end
```

transpiles to

```lisp
(lambda () nil)
```

```moonli
lambda (x):
  x
end
```

transpiles to

```lisp
(lambda (x) x)
```

```moonli
lambda (x, y):
  let sum = x + y:
    sum ^ 2
  end
end
```

transpiles to

```lisp
(lambda (x y)
  (let ((sum (+ x y)))
    (expt sum 2)))
```


### let

```moonli
let a = 2, b = 3:
   a + b
end
```

transpiles to

```lisp
(let ((a 2) (b 3))
  (+ a b))
```

```moonli
let a = 2, b = 3:
   a + b
end let
```

transpiles to

```lisp
(let ((a 2) (b 3))
  (+ a b))
```


### let+

```moonli
let-plus:let+ x = 42: x
end
```

transpiles to

```lisp
(let+ ((x 42))
  x)
```

```moonli
let-plus:let+ (a,b) = list(1,2):
  a + b
end
```

transpiles to

```lisp
(let+ (((a b) (list 1 2)))
  (+ a b))
```

```moonli
let-plus:let+ let-plus:&values(a,b) = list(1,2):
  a + b
end
```

transpiles to

```lisp
(let+ (((&values a b) (list 1 2)))
  (+ a b))
```

```moonli
let-plus:let+
  let-plus:&values(a,b) = list(1,2),
  (c,d,e) = list(1,2,3):
  {a,b,c,d,e}
end
```

transpiles to

```lisp
(let+ (((&values a b) (list 1 2)) ((c d e) (list 1 2 3)))
  (fill-hash-set a b c d e))
```


### lm

```moonli
lm (): nil
```

transpiles to

```lisp
(lambda () nil)
```

```moonli
lm (x): x
```

transpiles to

```lisp
(lambda (x) x)
```

```moonli
lm (x, y): x + y
```

transpiles to

```lisp
(lambda (x y) (+ x y))
```


### loop

```moonli
loop end loop
```

transpiles to

```lisp
(loop)
```

```moonli
loop :repeat n :do
  print("hello")
end
```

transpiles to

```lisp
(loop :repeat n
      :do (print "hello"))
```

```moonli
loop :for i :below n :do
  print(i + 1)
end
```

transpiles to

```lisp
(loop :for i :below n
      :do (print (+ i 1)))
```


### time

```moonli
time length("hello world")
```

transpiles to

```lisp
(time (length "hello world"))
```

## with

Standard Common Lisp code uses a number of `with-` macros. These can all be generated using the `with-` special macro of Moonli. This is "special" because 

1. Unlike standard macros which are identified by symbols, the `with`-block is identified using the keyword "with", regardless of the package under consideration.

2. `with pkg:symbol` expands into `pkg:with-symbol` without the interning of `pkg:symbol`.

Example transpilations:


```moonli
with open-file(f, "/tmp/a.txt"):
  f
end
```

transpiles to

```lisp
(with-open-file (f "/tmp/a.txt") f)
```

```moonli
with-open-file(f, "/tmp/a.txt"):
  f
end
```

transpiles to

```lisp
(with-open-file (f "/tmp/a.txt") f)
```

```moonli
with output-to-string(*standard-output*),
     open-file(f, "/tmp/a.txt"):
  write-line(read-line(f))
end
```

transpiles to

```lisp
(with-output-to-string (*standard-output*)
  (with-open-file (f "/tmp/a.txt")
    (write-line (read-line f))))
```


```moonli
with alexandria:gensyms(a,b,c):
  list(a,b,c)
end
```

transpiles to

```lisp
(alexandria:with-gensyms (a b c)
  (list a b c))
```


```moonli
with alexandria:gensyms(a,b,c),
     open-file(f, "/tmp/a.txt", :direction, :output):
  write(list(a,b,c), f)
end
```

transpiles to

```lisp
(alexandria:with-gensyms (a b c)
  (with-open-file (f "/tmp/a.txt" :direction :output)
    (write (list a b c) f)))
```


```moonli
defstruct pair:
  x;
  y;
end

with access:dot():
  let pair = make-pair(:x, 2, :y, 3):
     format(t, "~&x + y = ~a~%", pair.x + pair.y)
  end
end
```

transpiles to

```lisp
(defstruct pair x y)

(access:with-dot
  (let ((pair (make-pair :x 2 :y 3)))
    (format t "~&x + y = ~a~%" (+ pair.x pair.y))))
```
