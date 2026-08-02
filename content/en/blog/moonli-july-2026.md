---
title: Moonli Update (July 2026)
date: 2026-08-02
description: Updates about Moonli v0.0.9
---

[Moonli v0.0.9](https://github.com/moonli-lang/moonli/releases/tag/v0.0.9) is released this weekend. It's been 5 months since the last Moonli release. (If you want to install from source, [see here](https://moonli-lang.github.io/docs/install/).)

Besides some bug fixes, addition of new macros like `define-condition handler-bind print-unreadable-object`, a matrix chat room at [#moonli:matrix-for-lispers.net](https://web.matrix-for-lispers.net/home/%23moonli%3Amatrix-for-lispers.net), this release packs three important updates:

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
- [1. MIT licensed isocline](#1-mit-licensed-isocline)
- [2. Calling functions from terminal](#2-calling-functions-from-terminal)
- [3. Extensible Infix Macros](#3-extensible-infix-macros)
    - [Macros and Short Macros](#macros-and-short-macros)
    - [Extensible Infix Macros](#extensible-infix-macros)
- [Next Plans](#next-plans)
<!-- markdown-toc end -->

---

### 1. MIT licensed isocline

Perhaps the greatest change is the change from libreadline to [isocline](https://github.com/daanx/isocline). Readline has been GPL licensed. The (positively) infectious nature of GPL poses problems in software distribution. By contrast, isocline is MIT licensed. So you can do whatever you want with it. But that's not all. It comes with a multiline REPL, completions, and because it uses a minimal subset of ANSI escape sequences, it works across all of Unix, Windows and MacOS.

The [Moonli binary releases](https://github.com/moonli-lang/moonli/releases/tag/v0.0.9) link statically against isocline (as well as libssl and libtls and libcrypto). This means you can just download the binary and just run, without running into foreign library linking issues.

Now, you don't need to use Moonli in order to use isocline. The repository containing [isocline bindings for Common Lisp](https://github.com/digikar99/cl-isocline) itself contains [isocline-repl](https://github.com/digikar99/cl-isocline/releases/tag/latest) that is statically linked against libisocline (and others). Something I experimented with but haven't thoroughly tested is that you can take statically linked SBCL binary, use it to compile lisp code and dump the image with the new code. That new image is still a statically linked SBCL binary!

The static linking itself is thanks to [sbcl-goodies](https://github.com/sionescu/sbcl-goodies), which now also has an [experimental cross-platform variant](https://github.com/digikar99/sbcl-goodies). These work across Linux, MacOS, Windows, across x86-64 as well as arm64.

### 2. Calling functions from terminal

Returning back to Moonli, the binary itself can be used to call arbitrary Common Lisp functions from the terminal. (I got this inspiration from [kiln](https://github.com/ruricolist/kiln).) This means you can do something like:

```sh
$ moonli -f + 2 3
5
$ moonli -f round 2.345
2
$ moonli --eval 'defun add(x,y): x + y end' -f add 2.0 3.4
5.4
$ moonli -f uiop:strcat hello world
"helloworld"
```

It's actually [fairly trivial](https://github.com/moonli-lang/moonli/commit/b3639292735169cb0e3f37089deb26f448d2ce40) to implement this. That said, I haven't finalized the interface for this yet. The main limitation of this is that everything in the shell is a string. (But, there's [SHCL](https://codeberg.org/SquircleSpace/SHCL) -- and [several other projects](https://github.com/CodyReichert/awesome-cl#shells-shells-interfaces).)

### 3. Extensible Infix Macros

#### Macros and Short Macros

Moonli already has had extension points for macros and short-macros since the first release. Much of Moonli is actually [defined using define-moonli-macro and define-moonli-short-macro](https://github.com/moonli-lang/moonli/tree/v0.0.9/src/macros). For example, here is a moonli macro for `optima:match`:

```lisp
(esrap:defrule match/clauses
    (* (and *whitespace
            chain
            *whitespace/internal
            ":"
            *whitespace
            moonli-expression
            ";"))
  (:function (lambda (expr)
               (mapcar (lambda (expr)
                         (list (second expr)
                               (sixth expr)))
                       expr))))


(define-moonli-macro optima:match

  ((arg moonli-expression)
   (_ (and *whitespace/internal ":" *whitespace))
   (clauses match/clauses))

  `(optima:match ,arg
    ,@clauses))
```

With that defined, the Moonli can now transpile the below code

```moonli
optima:match [2,3,4]:
  vector(x, y, z) : x + y + z;
  sym : sym;
end
```

to Lisp:

```lisp
(optima:match (vector 2 3 4)
  ((vector x y z)
   (+ (+ x y) z))
  (sym sym))
```

When the `end` feels annoying at the end, you can define a short macro:

```lisp
(define-moonli-short-macro ifelse

  ((test moonli-expression)
   (_ +whitespace/internal)
   (then moonli-expression)
   (_ (esrap:? +whitespace/internal))
   (else (esrap:? moonli-expression)))

  `(if ,test ,then ,else))
```

Now `ifelse a :hello :bye` transpiles to `(if a :hello :bye)`.

#### Extensible Infix Macros

However, having used R, I felt a jealous at the lack of [extensible infix macros](https://stackoverflow.com/questions/25179457/r-what-are-operators-like-in-called-and-how-can-i-learn-about-them). But [we have them now](https://github.com/moonli-lang/moonli/commit/251b3e33dfb9bc085fcb5cdf62b80e7569e0f1ab). To define a new infix macro, simply:

```lisp
(define-moonli-infix-macro binding-arrows:->)
```

Now you can:

```moonli
## Assumes moonli/repl is loaded which defines 
## and exports additional macros including binding-arrows:->
in-package :moonli-user

t -> format(\"hello\");

- (3 + 4) 
  -> add(3)
  -> expt(2);
```

And these will be transpiled to:

```lisp
;; Assumes moonli/repl is loaded which defines and 
;; exports additional macros including binding-arrows:->
(in-package :moonli)

(-> t (format "hello"))

(-> (->
      (- (+ 3 4))
      (add 3))
  (expt 2))
```

The precedence for user defined infix macros is higher than unary minus but lower than other operators. All the user defined infix macros have the same precedence however.

### Next Plans

I'm mainly using Moonli for one of my own projects that I cannot publish about at the moment. So, its development is mainly in service of that.

However, I expect to improve the interface to calling functions from terminal. It can be possible to supply keyword arguments too!

The REPL itself needs more bugfixes. I still run into a number of bugs related to completion and unicode characters that should not exist in production.

The other aspect is libraries and documentation. In principle, this can be delegated to [CIEL](https://ciel-lang.org); however, CIEL also includes a number of libraries that rely on foreign libraries. Ideally, these need to be statically linked in.

Yet another aspect is actually making the binaries trustworthy for Windows and MacOS users. However, [this can be ugly.](https://www.reddit.com/r/lisp/comments/1sungew/comment/oi2mph2/)

There's also an [open request for coalton support](https://github.com/moonli-lang/moonli/issues/3). The main issue I currently have with this is defining the syntax itself. It's relatively easy to add it to Moonli using Parsing Expression Grammar implemented by [esrap](https://scymtym.github.io/esrap/) once the syntax is ready.
