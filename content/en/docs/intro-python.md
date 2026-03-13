---
title: Introduction to Moonli for Pythonistas
linkTitle: For Pythonistas
weight: 40
---

The below page provides a brief introduction to Moonli for someone who already knows Python.

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [Why Moonli over Python?](#why-moonli-over-python)
- [IDE and REPL are connected](#ide-and-repl-are-connected)
- [Variables](#variables)
    - [Symbols as data types](#symbols-as-data-types)
    - [Defining and assigning variables](#defining-and-assigning-variables)
    - [Checking and unbinding](#checking-and-unbinding)
- [Functions](#functions)
    - [Defining functions](#defining-functions)
    - [Optional and Keyword arguments: &optional, &key, arguments](#optional-and-keyword-arguments-optional-key-arguments)
    - [The same symbol can name a variable as well as function](#the-same-symbol-can-name-a-variable-as-well-as-function)
    - [To quote or not to quote: functions vs macros](#to-quote-or-not-to-quote-functions-vs-macros)
- [Namespaces and Packages](#namespaces-and-packages)
- [Systems and Libraries](#systems-and-libraries)
    - [Package managers](#package-managers)
- [Strings and Characters](#strings-and-characters)
- [Two Kinds of Floats](#two-kinds-of-floats)
- [Multiple Return Values](#multiple-return-values)
- [Classes and Methods](#classes-and-methods)
    - [Defining a class](#defining-a-class)
    - [Methods belong to generic functions, not classes](#methods-belong-to-generic-functions-not-classes)
    - [Multiple dispatch](#multiple-dispatch)
    - [Inheritance](#inheritance)
    - [Dynamic redefinition](#dynamic-redefinition)
    - [Method modifiers](#method-modifiers)
- [Structures: Classes for Performance](#structures-classes-for-performance)
    - [Performance with type declarations](#performance-with-type-declarations)
    - [Structures cannot be redefined](#structures-cannot-be-redefined)
    - [Classes vs structures at a glance](#classes-vs-structures-at-a-glance)
- [Types](#types)
    - [Range-constrained types](#range-constrained-types)
    - [Compound types](#compound-types)
    - [`eql`-types](#eql-types)
    - [Subtype relationships](#subtype-relationships)
- [Multiple kinds of equality](#multiple-kinds-of-equality)
- [Conditionals and Loops](#conditionals-and-loops)
    - [Conditionals](#conditionals)
    - [`loop` -- a powerful accumulation DSL](#loop----a-powerful-accumulation-dsl)
- [Output with `format`](#output-with-format)
- [Summary: Key Differences from Python](#summary-key-differences-from-python)

<!-- markdown-toc end -->

## Why Moonli over Python?

As you may wonder from below: why bother? Python is simpler, has a vast ecosystem, and gets most jobs done. Indeed, Moonli is not for everyone or every project -- but for certain kinds of work, the tradeoffs pay off substantially.

1. **Performance with interactivity.** Python is interpreted, and the usual fix is to -- rewrite hot paths in C or Cython. Moonli lets you start with flexible `defclass` objects at the REPL, profile, then switch to typed `defstruct` slots and `declare` type annotations in the same language, bringing performance close to compiled C without leaving the environment. You never have to drop into a different language or restart your session.

2. **A truly interactive development cycle.** Python's REPL is good for exploration, but a running Python program is largely frozen, in that you cannot redefine a class and have existing instances update, and reloading a module is fragile. In Moonli, the REPL is the program. You build a running system incrementally, redefine functions and classes on the fly, and inspect live objects at any point. This style of development, sometimes called *image-based programming*, can dramatically shorten the feedback loop when building complex systems.

3. **Macros and language extensibility.** Python gives you decorators and metaclasses, which provide some metaprogramming capability. Moonli gives you macros -- the ability to extend the language's syntax itself with new constructs that behave exactly like built-ins. If your problem domain has a natural notation, you can add it to the language rather than encoding everything awkwardly into existing constructs. This is not an exotic feature: `loop`, `defclass`, `let+`, and `with` are all macros, and you can write your own at the same level.

4. **A richer type and dispatch model.** Python's `isinstance` and single-dispatch methods work well for straightforward hierarchies, but break down when behavior genuinely depends on combinations of types. Moonli's multiple dispatch lets you express that cleanly without resorting to `isinstance` chains or visitor patterns. The type system's support for range types, union types, and `eql`-types makes type-driven logic more expressive without requiring a fully static type checker.

5. **Namespace hygiene at scale.** As Python projects grow, managing imports and avoiding circular dependencies becomes a real chore. Moonli's package system decouples namespace organisation from file structure entirely. A large codebase can expose a clean, explicitly declared public API through `:export` without any file needing to know where another file lives.

6. **Being explicit means you catch errors sooner ane make it easier for the compiler/interpreter to optimize.** Python is duck-typed. Moonli (and Common Lisp) are strongly typed. Python's equality predicates do not distinguish between objects not being of the same type vs objects being of the same type but different value. Moonli (and Common Lisp) does. Keeping &optional, &key distinct from regular function arguments means function calls can be faster when they need to be.

7. **Access to the Common Lisp ecosystem.** Moonli transpiles to Common Lisp, which means you get decades of mature, battle-tested libraries -- along with one of the most advanced condition and restart systems for error handling in any language. The runtime is also heavily optimised: SBCL, the Common Lisp implementation Moonli runs on, produces native machine code competitive with Java and sometimes C for numerical workloads.

Python optimises for getting started quickly and for breadth of available libraries. Moonli (and Common Lisp) optimises for the long game -- for programs that need to grow, be reshaped interactively, run fast without a rewrite, and express ideas that don't fit neatly into a fixed object hierarchy. If you are building something exploratory, performance-sensitive, or architecturally ambitious, the initial unfamiliarity is likely worth it.

## IDE and REPL are connected

Like Python's interactive shell (`python` or `ipython`), Moonli has a **Read–Eval–Print Loop (REPL)**. The REPL is a core part of how Moonli programs are developed - not just for quick tests, but for building and exploring entire programs interactively. You type an expression, Moonli evaluates it, and the result is printed. The prompt `MOONLI-USER>` tells you which package you are currently working in (more on packages later).

```moonli
MOONLI-USER> 2 + 3
[OUT]: 5
```

Even developing with VS Code (the [Alive Moonli extension](https://marketplace.visualstudio.com/items?itemName=moonli-lang.alive-moonli)) or Emacs (Slime + [moonli-mode](https://github.com/moonli-lang/moonli-mode.el)) involves a REPL. This means, in development, you literally talk to the compiler on the fly.

## Variables

### Symbols as data types

In Moonli, variables are explicit objects called `symbol`s. Symbols can be typed by prefixing `$` in front of a name.

Programmatically, *variables* are *symbols* that can be *eval*-uated to obtain the *value* they are bound to. Below, `$x` inputs a symbol

```moonli
MOONLI-USER> $x
[OUT]: x
MOONLI-USER> :i-am-a-keyword
[OUT]: :i-am-a-keyword
```

The `$`-prefix was used to *quote* the symbols to prevent their *eval*-uation. Omitting the `$`-prefix treats the name as a variable and results in accessing of that variable's value (which in this case it is unbound).

```moonli
MOONLI-USER> x
unbound-variable: The variable x is unbound.
```

Moonli (like all Lisps) treats code as data. Symbols are first-class objects you can inspect, pass around, and manipulate. This is different from Python, where variable names exist only at the language level and are not easily passed as values.

You can check which package a symbol belongs to with `symbol-package`, and look up symbols by name using `find-symbol`:

```moonli
symbol-package($list)
# => #<package "COMMON-LISP">

find-symbol("LIST", "CL")
# => list
#    :external
```

The second return value `:external` means `list` is a publicly exported symbol of the `"CL"` package. You can also check whether a symbol is exported (`:external`), internal (`:internal`), or absent (`nil`) -- a level of introspection Python doesn't expose natively.


### Defining and assigning variables

In Python, you create a variable simply by assigning to it: `x = 42`. Moonli requires an explicit variable introduction. This can be done using `defparameter` for global variables and `let` or `let+` for local variables. This also means that the scopes of the local variables are made very explicit.

By convention, global variables are wrapped in `*earmuffs*` to make them visually distinct:

```moonli
MOONLI-USER> defparameter *x* = 42
[OUT]: *x*

MOONLI-USER> *x*
[OUT]: 42
```

Reassigning a variable looks familiar:

```moonli
MOONLI-USER> *x* = 84
[OUT]: 84
```


The more common and recommended approach is local variables, scoped to a block using `let` or `let+`. This is analogous to how you'd use ordinary variables inside a Python function - except the scope is explicitly delimited:

```moonli
let a = 10, b = 20:
  a + b
end
# => 30
```

The key difference between `let` and `let+` is how bindings are made. `let` binds all variables simultaneously (parallel binding), so no binding can refer to another in the same `let`. `let+` binds sequentially, so later bindings can reference earlier ones:

```moonli
# This fails with let - a is not yet available when b = a is evaluated
let a = 1, b = a:
  a + b
end
# => ERROR: unbound variable a

# This works with let+
let+ a = 1, b = a:
  a + b
end
# => 2
```

Use `let` by default, as it enables thinking about each binding independently. Fall back to `let+` when you genuinely need sequential binding.

### Checking and unbinding

You can check whether a symbol is currently bound to a value using `boundp`. Note that the symbol must be quoted with `$`, since you want to pass the symbol itself rather than its value:

```moonli
boundp($*x*)   # => t   (true, *x* is bound)
boundp($y)     # => nil (false, y is unbound)
```

To remove a binding entirely, use `makunbound`. This is fine in REPL exploration but is best avoided in production code -- prefer local variables with clearly delimited lifetimes instead:

```moonli
makunbound($*x*)
*x*            # => ERROR: unbound variable
```

---

## Functions

### Defining functions

Functions in Moonli are defined with `defun`. The syntax is similar to Python's `def`, but there is no `return` keyword - a function automatically returns the value of its last expression:

```moonli
defun add(x, y):
  x + y
end

add(2, 3)
# => 5
```

A function can span multiple lines. Only the final expression (before `end`) is returned:

```moonli
defun describe-number(n):
  let description = if n > 0:
                      "positive"
                    elif n < 0:
                      "negative"
                    else:
                      "zero"
                    end:
    format(nil, "~a is ~a", n, description)
  end
end

describe-number(5)   # => "5 is positive"
describe-number(-3)  # => "-3 is negative"
describe-number(0)   # => "0 is zero"
```

### Optional and Keyword arguments: &optional, &key, arguments

Python supports default arguments (`def f(x, y=0)`), keyword arguments (`f(y=1, x=2)`), and variadic arguments (`*args`, `**kwargs`). Moonli has direct equivalents via `&optional`, `&key`, and `&rest` parameter markers.

`&optional` parameters are positional with a default value. They must come after all required parameters:

```
defun greet(&optional, name = "World"):
  format(nil, "Hello, ~a!", name)
end

greet()          # => "Hello, World!"
greet("Moonli")  # => "Hello, Moonli!"
```

`&key` parameters are passed by name (analogous to Python's keyword arguments). They can be supplied in any order, each may have a default value, which is `nil` if unspecified:

```
defun make-window(&key, width = 800, height = 600, title = "Untitled"):
  format(nil, "~a (~ax~a)", title, width, height)
end

make-window()                              # => "Untitled (800x600)"
make-window(:title, "Editor", :width, 1280) # => "Editor (1280x600)"
```

`&rest` collects all remaining positional arguments into a list, just like Python's `*args`:

```
defun sum(&rest, args):
  if null(args):
    0
  else:
    first(args) + apply(#'sum, rest(args))
  end
end

sum(1, 2, 3, 4)  # => 10
sum()            # => 0
```

These can be combined in a single function. Required parameters come first, then `&optional`, then `&rest`, then `&key`:

```
defun log-message(level, &rest, parts):
  format(t, "[~a] ~{~a ~}~%", level, parts)
end

log-message(:info, "User", "logged", "in")
# prints: [INFO] User logged in
```

### The same symbol can name a variable as well as function

In Python, a name can only refer to one thing at a time. If you write `list = [1, 2, 3]`, the name `list` now refers to your variable and the built-in class is shadowed -- you cannot use both at once. Python has a single namespace per scope for all names.

Moonli (following Common Lisp) is different: a symbol has several distinct *cells* that can each hold a different kind of binding simultaneously. The most important ones are:

- The **value cell** -- what the symbol refers to when used as a variable
- The **function cell** -- what gets called when the symbol is used as a function
- The **class cell** -- the class the symbol names (via `find-class`)

This means the same symbol `point` can simultaneously be a variable, a function, and a class, each looked up independently depending on context:

```
# Define a class named point
defclass point():
  slots:
    x: accessor: point-x, initarg: :x; end
    y: accessor: point-y, initarg: :y; end
  end
end

# Define a function also named point
defun point(x, y):
  make-instance($point, :x, x, :y, y)
end

# Define a local variable also named point
let point = point(3,4):
  # All three coexist without conflict:
  find-class($point)     # => #<standard-class point>    (class cell)
  point(1, 2)            # => #<point ...>               (function cell)
  point                  # => #<point x=3 y=4>           (value cell)
end
```

To explicitly refer to the *function* stored in a symbol's function cell (for example, to pass it as a value), you use `function(...)` (or even the quote `$`):

```
mapcar(function(point-x), (point(1,2), point(3,4), point(5,6)))
# => (1 3 5)
mapcar($point-x, (point(1,2), point(3,4), point(5,6)))
# => (1 3 5)
```

This separation is one of the reasons Moonli (and Common Lisp) are called *Lisp-2* languages -- they maintain at least two namespaces per symbol, unlike Python's *Lisp-1* single-namespace model. The practical upside is that you can freely name a function `list`, `count`, or `find` without clobbering the built-in variable (or vice versa), which makes it easier to write expressive, domain-specific code without constantly worrying about name collisions.

### To quote or not to quote: functions vs macros

You may have noticed something seemingly inconsistent while reading the earlier sections. `boundp` requires its argument to be quoted -- `boundp($x)` -- while `function` does not. Why does `makunbound($x)` need the `$` while `function(point-x)` does not?

The answer is the distinction between **functions** and **macros** (including special forms).

In Python, every callable receives already-evaluated arguments. When you write `f(x)`, Python evaluates `x` first, then passes the resulting value to `f`. There is no way for a callable to receive the unevaluated expression `x` itself.

Moonli (and Common Lisp) have two kinds of callables. **Functions** work exactly like Python: all arguments are evaluated before the function receives them. **Macros** (and special forms) are different -- they receive their arguments *unevaluated* and decide for themselves what to do with them. This is what gives macros the power to introduce new syntax and control structures.

Consider `boundp`. It is a plain function. Its job is to check whether a symbol object is bound to a value. If you write `boundp(x)` without the quote, Moonli evaluates `x` first, getting its value (say, `42`), and passes `42` to `boundp`. But `boundp` expects a symbol, not an integer -- hence the error. The `$` quote prevents evaluation, so `boundp($x)` passes the symbol `x` itself:

```
defparameter *x* = 42

boundp(*x*)   ; ERROR -- evaluates *x* to 42, then asks if 42 is a bound symbol
boundp($*x*)  ; => t -- passes the symbol *x* itself to boundp
```

The same logic applies to `makunbound`, `symbol-package`, `find-class`, and `class-of` when called with a symbol you want to introspect rather than evaluate:

```
symbol-package($list)     ; => #<package "COMMON-LISP">
symbol-package(list)      ; ERROR -- list evaluates to the list function object, not a symbol

find-class($rectangle)    ; => #<standard-class rectangle>
class-of($rectangle)      ; => #<built-in-class symbol>  (the symbol itself is just a symbol)
class-of(make-instance($rectangle, :height, 3, :breadth, 4))  ; => #<standard-class rectangle>
```

Now contrast this with `function` (or even `in-package`). These are **special forms**. They receive their arguments unevaluated by design, which is exactly why you can write `function(point-x)` without quoting `point-x` -- the special form `function` sees the raw symbol `point-x` . You can even write `defparameter` as a function, by writing `defparameter($*x*, 42)`. In fact, all lisp forms can be written as either atoms or function calls!

```
; defun is a macro -- it sees the symbol add and the parameter list unevaluated
defun add(x, y):
  x + y
end

; in-package is a macro -- it sees the symbol tutorial unevaluated
in-package tutorial
```

The general rule is simple: *if something looks like a definition or a control structure, it is almost certainly a macro* and handles its own argument evaluation. If it is a regular computation that receives objects and returns objects, it is a function and evaluates all its arguments first. When in doubt, quoting an argument that should be a symbol is the right instinct -- passing the wrong type will produce a clear error, and you will quickly learn which callables expect symbol objects versus evaluated values.

## Namespaces and Packages

Python namespaces are file-based: each `.py` file is a module, and you use `import` to bring names from one file into another. This means your namespace structure is tightly coupled to your file structure.

Moonli takes a different approach. Namespaces are **packages** - objects defined with `defpackage` that are independent of any particular file. Once a package exists, you can switch into it from any file in any project using `in-package`. This decouples namespace organization from file organization entirely, which eliminates circular import problems and lets you spread a single namespace across many files or merge many files into one without changing any names.

```moonli
defpackage "MY-LIB"
  :use "CL";
  :export "PROCESS-DATA", "LOAD-FILE";
end

in-package my-lib
```

The `:use` option imports all external symbols from another package (here, the standard `CL` package). The `:export` option explicitly declares which symbols are public - the API your library presents to its users. Symbols not listed in `:export` remain internal to the package.

To use a symbol from another package without switching into it, prefix the symbol name with the package name and a colon:

```moonli
alexandria:ensure-list(42)        # => (42)
alexandria:ensure-list((1, 2, 3)) # => (1 2 3)
```

## Systems and Libraries

In Python, sharing or reusing code across projects is done via packages managed by `pip` and described by a `pyproject.toml` or `setup.py`. Moonli uses **ASDF** (Another System Definition Facility) for the same role. An ASDF *system* is a named collection of source files with declared dependencies and metadata, described in a `.asd` file at the root of your project.

Here is an example `.asd` file for a project called `my-awesome-lib`:

```lisp
;;; my-awesome-lib.asd
(defsystem "my-awesome-lib"
  :version "0.1.0"
  :author "Your Name <you@example.com>"
  :description "Utilities for awesome tasks"
  :license "MIT"
  :depends-on ("alexandria")
  :serial t
  :components ((:moonli-file "package")
               (:moonli-file "core")
               (:moonli-file "utils")))
```

The corresponding directory layout is:

```
my-awesome-lib/
  ├── my-awesome-lib.asd
  ├── package.moonli
  ├── core.moonli
  └── utils.moonli
```

To load the system in the REPL (analogous to `import my_awesome_lib` in Python):

```lisp
asdf:load-system("my-awesome-lib")
```

ASDF resolves all declared dependencies, then loads the component files in order. Note the conceptual separation: **packages** manage symbol namespaces within code# **ASDF systems** manage files, dependencies, and project metadata.

### Package managers

Just as Python has `pip` pointing at PyPI, Moonli has several library managers:

- **Quicklisp** is the standard, curated package manager. Once installed, loading a library is one line: `ql:quickload("dexador")`.
- **Ultralisp** is a faster-updating community index, useful for bleeding-edge or experimental libraries.
- **OCICL** is a more modern alternative that also supports version-locking for reproducible builds.

## Strings and Characters

In Python, strings are immutable sequences, and accessing an element gives you another string of length one. In Moonli, **strings are mutable**, and accessing an element gives you a **character** -- a distinct type, not a string:

```moonli
defparameter *s* = "hello"

# Accessing a character (0-indexed)
char(*s*, 0)   # => #\h   (a character, not a string)

# Strings are mutable -- you can modify in place
setf(char(*s*, 0), 'H')
*s*            # => "Hello"
```

Characters are written with single quotes in source code and printed with the `#\` prefix. This means `'a'` (a character) and `"a"` (a one-character string) are different objects of different types. Functions like `char-upcase` and `char-downcase` operate on characters, while string functions like `string-upcase` operate on strings:

```moonli
char-upcase('a')      # => #\A
string-upcase("hello") # => "HELLO"
```

## Two Kinds of Floats

Python has exactly one floating-point type (`float`), which is a 64-bit IEEE 754 double. Moonli (assuming you are using SBCL) exposes two float types directly:

- **`single-float`**: 32-bit precision, written as an ordinary decimal literal like `3.14`
- **`double-float`**: 64-bit precision (equivalent to Python's `float`), written with a `d` exponent like `3.14d0`

```moonli
class-of(3.14)    # => #<built-in-class single-float>
class-of(3.14d0)  # => #<built-in-class double-float>

# pi is a double-float constant
pi                # => 3.141592653589793d0
```

This distinction matters for performance-sensitive numerical code. Single floats are faster and use less memory; double floats give you more precision. When working with scientific or financial computations, be deliberate about which you use -- mixing them in the same expression will trigger automatic promotion to the higher-precision type.


## Multiple Return Values

In Python, returning multiple values from a function means constructing a tuple, which is a real object that gets allocated:

```python
def min_max(lst):
    return min(lst), max(lst)   # creates a tuple

lo, hi = min_max([3, 1, 4])
```

Moonli can return multiple values *natively*, without constructing any intermediate container object, using `values(...)`. This is more efficient and semantically cleaner -- the caller receives separate values, not a tuple they then have to unpack:

```moonli
defun min-max(lst):
  values(reduce(#'min, lst), reduce(#'max, lst))
end
```

To receive multiple return values, use `let+` with the `&values` destructuring pattern:

```moonli
let+ &values(lo, hi) = min-max((3, 1, 4)):
  format(t, "min=~a, max=~a~%", lo, hi)
end
# prints: min=1, max=4
```

You can also use `multiple-value-bind` for more explicit handling, or `values-list` to convert a list into multiple values. The key advantage is that hot-path functions can return multiple pieces of information without any heap allocation.

## Classes and Methods

### Defining a class

Moonli supports object-oriented programming with `defclass`. Classes have *slots* (analogous to Python instance attributes), and each slot can declare an accessor function, a constructor keyword (`initarg`), a default value (`initform`), and [numerous other options](http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/mac_defclass.html):

```moonli
defclass rectangle():
  slots:
    length:
      accessor: height,
      initarg: :height;
    breadth:
      accessor: breadth,
      initarg: :breadth;
  end
end
```

Create an instance with `make-instance`, passing `initarg` keywords and their values:

```moonli
defparameter *r* = make-instance($rectangle, :height, 6, :breadth, 3)

height(*r*)   # => 6
breadth(*r*)  # => 3
```

### Methods belong to generic functions, not classes

This is the most important conceptual difference from Python's OOP model. In Python, methods are defined *inside* a class and dispatched on `self`. In Moonli, you first declare a **generic function** -- just the function's name and parameters -- and then add **methods** that specialize that function's behavior for particular argument types:

```moonli
defgeneric area(shape)

defmethod area(shape :: rectangle):
  height(shape) * breadth(shape)
end

area(*r*)   # => 18
```

The power of this approach is **extensibility**: you can define entirely new classes and add new methods to existing generic functions without touching any existing code. If a colleague writes a `circle` class, they can make `area` work on circles without modifying the `rectangle` code:

```moonli
defclass circle():
  slots:
    radius:
      accessor: radius,
      initarg: :radius;
  end
end

defmethod area(shape :: circle):
  pi * radius(shape) ^ 2
end

defparameter *c* = make-instance($circle, :radius, 7)
area(*c*)   # => 153.93...
```

### Multiple dispatch

Python dispatches methods on a single object (`self`). Moonli supports **multiple dispatch**: a method can specialize on *all* of its arguments at once. This is extremely useful when behavior depends on the combination of types, not just one:

```moonli
# Check whether shape-in fits inside shape-out
defgeneric fits-inside-p(shape-in, shape-out)

# Specialization for rectangle inside rectangle
defmethod fits-inside-p(s1 :: rectangle, s2 :: rectangle):
  let h1 = height(s1), h2 = height(s2),
      b1 = breadth(s1), b2 = breadth(s2):
    if ((min(h1,b1) <= min(h2,b2)) and (max(h1,b1) <= max(h2,b2))):
      t
    else:
      nil
    end
  end
end

# Specialization for rectangle inside circle
defmethod fits-inside-p(s1 :: rectangle, s2 :: circle):
  let h = height(s1), b = breadth(s1), r = radius(s2):
    sqrt(h^2 + b^2) <= 2 * r
  end
end
```

### Inheritance

Classes can inherit slots and behavior from superclasses, just like Python:

```moonli
defclass shape():
  slots:
    color:
      initarg: :color,
      accessor: color,
      initform: :black;
  end
end

# Make rectangle a subclass of shape
defclass rectangle(shape):
  slots:
    length:
      accessor: height,
      initarg: :height;
    breadth:
      accessor: breadth,
      initarg: :breadth;
  end
end
```

### Dynamic redefinition

One feature Python completely lacks: in Moonli, you can **redefine a class at the REPL and all existing instances update immediately**. If you add a new slot to `shape`, every live instance of every subclass automatically gains that slot -- no restart required. This makes exploratory, interactive development extremely fluid:

```moonli
# Before redefinition
describe(*r*)
# => slots: length = 6, breadth = 3

# Redefine shape to add a label slot
defclass shape():
  slots:
    color:  ...; end
    label:
      initarg: :label,
      accessor: label,
      initform: "unlabeled";
  end
end

# *r* already has the new slot!
describe(*r*)
# => slots: index = 0, length = 6, breadth = 3, label = "unlabeled"
```

### Method modifiers

Methods can be augmented with `:before`, `:after`, and `:around` modifiers, which run additional logic before or after the primary method -- similar in spirit to Python decorators, but more structured:

```moonli
defmethod :before fits-inside-p(s1, s2):
  format(t, "Checking if ~S fits inside ~S...~%", s1, s2)
end

defmethod :after fits-inside-p(s1, s2):
  format(t, "Done.~%")
end
```

## Structures: Classes for Performance

Moonli's `defclass` is very dynamic -- slots can be added, classes can be redefined, and dispatch is resolved at runtime. This flexibility has a cost. When you need tight, predictable performance, Moonli offers **structures** via `defstruct`. A structure is a fixed-layout data container, similar to a C struct or a Python `dataclass` with `__slots__`.

Defining a structure automatically generates a constructor, slot accessors, and a type predicate:

```moonli
defstruct point:
  x = 0;
  y = 0;
end

defparameter *p* = make-point(:x, 3, :y, 4)

point-x(*p*)  # => 3
point-y(*p*)  # => 4
point-p(*p*)  # => t  (type predicate)
```

### Performance with type declarations

The real performance gain comes from declaring slot types. Once types are known at compile time, Moonli can generate code that bypasses dynamic dispatch entirely:

```moonli
defstruct point-struct:
  (x = 0) :: fixnum;
  (y = 0) :: fixnum;
end
```

A tight loop accessing typed struct slots runs roughly **3× faster** than equivalent code using `defclass`, because the compiler can use direct memory reads instead of polymorphic dispatch. This makes structures the right choice for numerical or performance-critical inner loops.

### Structures cannot be redefined

The tradeoff for this performance is rigidity. Unlike classes, structures **cannot be cleanly redefined at the REPL**. Changing a struct's slots while instances exist results in an error (or requires a manual restart). This means structures are best for stable, well-understood data layouts -- not for exploratory development.

### Classes vs structures at a glance

| Feature | Classes (`defclass`) | Structures (`defstruct`) |
|---|---|---|
| Multiple inheritance | ✅ | ❌ |
| Dynamic redefinition | ✅ | ❌ |
| Performance | Moderate | High |
| Type-annotated slots | Little effect | ~3× speedup |
| Use with generic functions | ✅ | ✅ |

## Types

Every class defines a type, but every object belongs to one or more types. You can check type membership with `typep`, analogous to Python's `isinstance` but considerably more expressive:

```moonli
typep(2, $integer)   # => t
typep(2, $string)    # => nil

# All objects are of type t (the "universal" type)
typep(2, t)          # => t

# No object is of type nil
typep(2, nil)        # => nil
```

### Range-constrained types

Unlike Python's `isinstance`, Moonli's type system supports *parametric* types. You can ask whether a value is an integer within a specific range, or a string of a specific length:

```moonli
typep(3, $integer(1, 5))      # is 3 an integer between 1 and 5? => t
typep(10, $integer(1, 5))     # => nil

typep("hello", $string(5))    # is "hello" a string of length 5? => t
typep("hi", $string(5))       # => nil
```

### Compound types

Types can be combined with `or`, `and`, and `not` to express complex membership conditions. You can also define named compound types with `deftype`:

```moonli
# A union type
deftype rectangle-or-circle():
  $(rectangle or circle)
end

typep(*r*, $rectangle-or-circle)   # => t
typep(*c*, $rectangle-or-circle)   # => t
typep(42, $rectangle-or-circle)    # => nil

# Negation
typep(42, $not(integer))    # => nil
typep("hi", $not(integer))  # => t
```

### `eql`-types

A particularly precise type specifier is `eql`, which describes the type consisting of *exactly one specific object*:

```moonli
typep(5, $eql(5))    # => t
typep(5.0, $eql(5))  # => nil  (5.0 and 5 are different objects)
```

### Subtype relationships

You can check whether one type is a subtype of another with `subtypep`:

```moonli
subtypep($fixnum, $integer)   # => t t
# (first value: yes, fixnum is a subtype of integer;
#  second value: this relation was determinable)

subtypep($not(integer), t)    # => t t
# (everything is a subtype of t)
```

Note that method dispatch in generic functions can only specialize on class-based types and `eql`-types -- not on arbitrary compound type specifiers like `integer(1, 5)`. For dispatch on richer types, third-party libraries like `polymorphic-functions` fill this gap.

## Multiple kinds of equality

Python has two equality operators: `is` (identity -- are these the exact same object in memory?) and `==` (value equality -- do these objects represent the same thing?). For most purposes, Python programmers use `==` and rarely think about the distinction. Moonli inherits from Common Lisp a richer set of equality predicates, each answering a subtly different question: *in what sense are these two things the same?*

The reason there are several is that "sameness" is genuinely ambiguous. Are two separate `$point` symbols the same because they have the same name? Are `5` and `5.0` the same because they represent the same mathematical quantity? Are two lists the same because they contain the same elements, or only if they are literally the same list object? Different answers are appropriate in different situations, and Moonli makes each choice explicit.

`eq` is the strictest notion: two objects are `eq` if and only if they are the *exact same object in memory* -- identical in the sense of pointer equality. This is Moonli's equivalent of Python's `is`. It is fast (a single pointer comparison) but narrow. Symbols with the same name in the same package are always `eq` to each other, because Moonli interns them -- there is only ever one object for each symbol name. Numbers and strings, however, are generally not `eq` even if they look identical, because the runtime may create separate objects for each:

```
eq($hello, $hello)    ; => t   -- same interned symbol object
eq(1, 1)              ; => t   -- small integers are often cached
eq("hi", "hi")        ; => nil -- two separate string objects
```

`eql` extends `eq` to cover numbers and characters by value, while still being stricter than general structural equality. Two numbers are `eql` if they have the same type *and* the same value; `5` and `5.0` are not `eql` because they are of different types. This is the default equality used inside `case` expressions and hash tables:

```
eql(1, 1)       ; => t
eql(1, 1.0)     ; => nil -- same mathematical value, but different types
eql('a', 'a')   ; => t   -- characters with the same code
eql("hi", "hi") ; => nil -- strings are not compared by value with eql
```

`equal` is the most commonly useful general-purpose equality, similar in spirit to Python's `==`. It compares objects *structurally* and recursively: two lists are `equal` if they have the same length and every corresponding element is `equal`; two strings are `equal` if they contain the same characters in the same order. It does not, however, smooth over type differences in numbers:

```
equal("hello", "hello")        ; => t
equal((1, 2, 3), (1, 2, 3))    ; => t   -- same structure
equal((1, (2, 3)), (1, (2, 3))); => t   -- recursive
equal(1, 1.0)                  ; => nil -- different numeric types
```

`equalp` is the most permissive predicate. It is like `equal` but additionally ignores case in strings and characters, and considers numbers equal if they represent the same mathematical value regardless of type. Think of it as "equal up to superficial presentation differences":

```
equalp("Hello", "hello")    ; => t   -- case-insensitive
equalp(1, 1.0)              ; => t   -- same mathematical value
equalp((1, 2), (1, 2))      ; => t
```

Beyond these four, there are type-specific equality predicates for situations where you want to be explicit about what you are comparing. `string=` compares strings character-by-character (case-sensitive, like `equal` for strings), while `string-equal` is the case-insensitive version. `char=` compares characters exactly, and `char-equal` ignores case:

```
string=("Hello", "hello")      ; => nil
string-equal("Hello", "hello") ; => t

char=('A', 'a')      ; => nil
char-equal('A', 'a') ; => t
```

In fact, `=`, `string=`, `char=` will even type error if their arguments are not numbers, strings, and characters respectively!

The practical takeaway is: use `eql` when comparing numbers, symbols, or characters; use `equal` for general structural comparison of lists and strings; use `equalp` when you want to be lenient about case or numeric type; and reach for `string=` or `char=` when you are deliberately working with text and want to be explicit. The four-level hierarchy -- from `eq` (same object) through `eql` (same type and value) through `equal` (same structure) to `equalp` (same up to presentation).

## Conditionals and Loops

### Conditionals

Moonli's `if`/`elif`/`else` works exactly like Python's `if`/`elif`/`else`, with the block delimited by `end` instead of indentation:

```moonli
if x > 10:
  format(t, "Large~%")
elif x > 5:
  format(t, "Medium~%")
else:
  format(t, "Small~%")
end
```

Conditions are evaluated top-to-bottom; the first true branch runs. Both `elif` and `else` are optional.

### `loop` -- a powerful accumulation DSL

Moonli also gives you access to Common Lisp's `loop`, a mini-language for expressing iteration and accumulation in a single, readable expression. It is particularly useful when you want to iterate and build results at the same time -- avoiding the boilerplate of initializing and updating accumulator variables manually:

```moonli
# Sum all elements
loop :for x :in (1, 2, 3, 4)
     :sum x
end
# => 10

# Collect only even numbers
loop :for x :in (1, 2, 3, 4, 5, 6)
     :when (rem(x, 2) == 0)
       :collect x
end
# => (2 4 6)

# Iterate over a range with a step
loop :for i :from 0 :to 20 :by 5 :do
  print(i)
end
# prints: 0 5 10 15 20

# Combine multiple clauses in one pass
loop :for x :in (-1, 2, 3, -1, 5)
     :when x > 0
       :collect x :into positives
     :finally return(positives)
end
# => (2 3 5)
```

## Output with `format`

Python programmers typically use f-strings (`f"Hello, {name}!"`) or `str.format("Hello, {}!", name)` for formatted output. Moonli uses the `format` function, inherited from Common Lisp, which is more powerful than either.

The first argument to `format` is the *destination*: `t` writes to standard output, `nil` returns the formatted result as a string, and any stream variable writes to that stream. The second argument is a template string with *directives* (format specifiers prefixed with `~`):

```moonli
# Print to standard output
format(t, "Hello, ~a!~%", "Moonli")
# prints: Hello, Moonli!

# Return a formatted string (like Python's str.format)
format(nil, "~a + ~a = ~a", 1, 2, 3)
# => "1 + 2 = 3"

# Numeric formatting
format(nil, "pi ≈ ~f", pi)
# => "pi ≈ 3.1415927"

# Debug-style output (prints escaped/quoted form)
format(nil, "~s", "hello")
# => "\"hello\""
```

Common format directives:

| Directive | Meaning                               |
|-----------|---------------------------------------|
| `~a`      | Human-readable value (like `str()`)   |
| `~s`      | Escaped/quoted form (like `repr()`)   |
| `~d`      | Decimal integer                       |
| `~f`      | Floating-point number                 |
| `~%`      | Newline                               |
| `~{~a~^, ~}` | Iterate over a list with separator |

The list-iteration directive is particularly convenient -- it lets you join a list with a separator in-line, no `", ".join(...)` needed:

```moonli
format(t, "Items: ~{~a~^, ~}~%", (1, 2, 3))
# prints: Items: 1, 2, 3
```

## Summary: Key Differences from Python

| Feature                        | Python                            | Moonli                                           |
|--------------------------------|-----------------------------------|--------------------------------------------------|
| Variable declaration           | Implicit with assignment          | Explicit                                         |
| Global variables               | `x = 42` (implicit)               | `defparameter *x* = 42`                          |
| Local variables                | Scoped to function/block          | `let x = 42: ... end` (explicit block)           |
| Parallel vs sequential binding | NA                                | `let` (parallel) vs `let+` (sequential)          |
| Return values                  | Tuple for multiple                | Native multiple values via `values(...)`         |
| Namespaces                     | File-based modules + `import`     | Package objects, file-independent                |
| Build/dependency system        | `pip` + `pyproject.toml`          | ASDF + Quicklisp/Ultralisp/OCICL                 |
| Methods                        | Belong to the class               | Belong to generic functions                      |
| Dispatch                       | Single dispatch on `self`         | Multiple dispatch on all arguments               |
| Live class redefinition        | Doesn't update existing instances | Existing instances update automatically          |
| Performance-critical data      | `dataclass` with `__slots__`      | `defstruct` with typed slots                     |
| Strings                        | Immutable; indexing gives string  | Mutable; indexing gives character                |
| Floats                         | One type (`float`, 64-bit)        | `single-float` (32-bit), `double-float` (64-bit) |
| Type checks                    | `isinstance(x, T)`                | `typep(x, $T)` with compound/range types         |
| Formatted output               | f-strings / `str.format`          | `format` with `~` directives                     |
