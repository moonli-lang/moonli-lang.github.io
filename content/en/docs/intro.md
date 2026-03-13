---
title: Introduction
linkTitle: Introduction
weight: 5
---

Moonli is a beautiful programming language with a simple syntax and a very interactive development experience. This enables rapidly prototyping new programs. At the same time, once a prototype is ready, the programs can also be optimized for runtime performance as well as long term maintenance.

## Features

- Sane variable scoping rules as given by common lisp
- Sane namespace scoping thanks to common lisp package system
- Sane restarts and condition system thanks to common lisp
- Strong typing with optional static typing, optional dynamic scoping
- Availability of optimizing compilers such as SBCL
- Sensitive to newlines and semicolons but not to spaces and tabs
  (indentation insensitive)
- Returning multiple values without an intermediate data structure
- Support for rapid prototyping through CLOS and image-based development


## Plan

- [x] Real numbers, strings, characters, lists, infix arithmetic
  operators, literal hash-tables, literal hash-sets
- [x] Typing using \"expr::type\" operator
- [x] Support for declare and declaim
- [x] Literal syntax for vectors, array access
- [x] BODMAS rule for parsing expressions
- [x] Binaries
- [x] VS Code integration
- [x] Emacs mode and integration with slime: useable but less than ideal
- [x] Infix Logical operators
- [ ] Add more forms: progn, mvb, dsb, more...
- [ ] Add more tests
- [ ] Reverse transpile from common lisp
- [ ] Multidimensional arrays, broadcasting, other operations: needs an array library
