---
title: Moonli Update (September 2026)
date: 2026-09-28
description: Updates about Moonli v0.0.10
---

[Moonli v0.0.10](https://github.com/moonli-lang/moonli/releases/tag/v0.0.10) is released this weekend. It's been just 2 months since the last Moonli release, however, there were lots of changes and additions in this period, that made a release hard to delay. (If you want to install from source, [see here](https://moonli-lang.github.io/docs/install/).)


<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [1. Binaries compiled against glibc 2.28](#1-binaries-compiled-against-glibc-228)
- [2. More helpful error messages](#2-more-helpful-error-messages)
- [3. There are no symbols at the terminal](#3-there-are-no-symbols-at-the-terminal)
- [4. Curated libraries](#4-curated-libraries)
- [5. `help`](#5-help)
- [6. `docsearch`](#6-docsearch)

<!-- markdown-toc end -->

---

### 1. Binaries compiled against glibc 2.28

This one has a short description, but a fair bit of work :). `glibc` versions are a major pain point for distributing binaries on linux. We now have [docker images with glibc 2.28, openssl 3.5 (LTS), SBCL and ECL](https://github.com/digikar99/oldglibc-openssl35-commonlisp). These are based on the [manylinux docker images](https://github.com/pypa/manylinux) and can be used to compile [sbcl-goodies](https://github.com/digikar99/sbcl-goodies), [isocline-repl](https://github.com/digikar99/cl-isocline/commit/0851b2dd132d2c05043ecff1fc2044ea3574d048) and also Moonli itself, with statically compiled libssl and the likes! You can check out the build scripts for each of these to adapt to your own programs!


### 2. More helpful error messages

This one is a bit silly. Nonetheless, it's one factor that draws me to Moonli. And of course, I'm biased :).

Languages that end with `end` have a problem. To see this, consider:

```moonli
defun map-array2(fn, a1, a2):
  declare type(array, a1, a2);

  assert(equal(array-dimensions(a1), array-dimensions(a2)))

  let result = make-array(array-dimensions(a1)):
    loop :for i :below array-total-size(result)
      :do row-major-aref(result, i) = funcall(
        fn,
        row-major-aref(a1, i),
        row-major-aref(a2, i),
      )
    end
  end

  result
end
```

This seems correct at the outset, but upon seeing the compiler error that `result` is undefined, one is left a bit confused. And this disconnect grows as the size of the function grows. In particular, this can look horrifying:

```moonli
        end
      end
    end
  end
end
```

It can become difficult to keep track of where some block ends. Editors can be helpful. But here's an alternative:

```moonli
      end if
    end loop
  end let
end defun
```

This can be verbose. But it is optional. With Moonli 0.0.10, mismatched block ends now signal a better message, instead of continuing the parse and ending up with something confusing.

```moonli
    end
  end loop

  result
end
```

For example, with the above `map-array2`, with the added `loop` after the but-last end, we get the error.

```
Parse error at line 13, column 7. Expected 'LET'
  .
  .
  .
    end
  end loop
------^---

  result
end
```

Likewise, there are several small ways the error messages have been improved, including but not limited to [shorter backtraces through isocline-repl](https://github.com/digikar99/cl-isocline/commit/ad8164a761a30fd9109792c0d2bc984aba71c5e8) and color coded funcall arguments on the stack through [styled-strings](https://codeberg.org/digikar/styled-strings).

### 3. There are no symbols at the terminal

Something I had explored [last time](./moonli-july-2026.md) was being able to call moonli/lisp functions from the terminal.

```sh
$ moonli --no-init --eval 'defun add(x,y): x + y end' -f add 2.0 3.4
5.4
```

Earlier, the arguments were simply kept as they were in string format, or they were parsed into numbers. With this release, Moonli goes full featured.

To understand how, one must ask: What's the difference between typing commands at the shell vs at the REPL of a programming language? Well, free symbols at the REPL are variables in that language. But free symbols in the shell are strings. Thus, if something cannot be parsed as an element of the language, then it is a string.

This leads to a natural grammar

```lisp
(esrap:defrule moonsh-atomic-expression
    ;; This is identical to moonli's atomic-expression, but without any symbol,
    ;; string or chain
    (or bracketed-expression
        quoted-expression
        expr:character
        number
        expr:vector
        expr:cons
        expr:list
        expr:hash-table
        expr:hash-set))
```

This allows

```lisp
$ moonli --no-init --funcall alexandria:hash-table-keys '{"a": 2, "b": [2,3,4]}'
("b", "a")
$ moonli --no-init --funcall 'lm (x): gethash("b", x)' '{"a": 2, "b": "zebra"}'
zebra, t
$ moonli --no-init --funcall str:split " " "The quick brown fox jumped over the lazy dog"
("The", "quick", "brown", "fox", "jumped", "over", "the", "lazy", "dog")
$ moonli --no-init --funcall string-downcase "The quick brown fox jumped over the lazy dog"
the quick brown fox jumped over the lazy dog
```

And indeed, you can load lisp or moonli files or libraries prior to `--funcall`!


### 4. Curated libraries

Last but not the least.

A big advantage of Moonli is that you can simply use Common Lisp libraries. And while there aren't *that much*, there are [lots of useful ones](https://github.com/CodyReichert/awesome-cl). However, scavenging for libraries can be difficult.

One approach is [CIEL](https://github.com/ciel-lang/CIEL) (see [here](https://github.com/ciel-lang/ciel-libraries/releases) for libraries). As much as I appreciate the effort, I have my own peculiarities, so I'm not exactly happy with the library selection.

But now, there is another collection! I wanted to mirror the [Python standard-library](https://docs.python.org/3/library/index.html), which is an ambituous goal in itself. But here's where we start. However, many of these rely on foreign-libraries, so if you use the moonli binary, these may not work as expected! Perhaps, some day in the future, all those foreign libraries become statically baked into the lisp image :).

```lisp
;; Threading
"bordeaux-threads"

;; Text Processing Services
"cl-ppcre"
"str"

;; Numeric and Mathematical Libraries
"array-operations"
"nibbles"

;; Functional Programming Libraries
"alexandria"
"coalton"
"fset"

;; File and Directory Access
"file-finder"
;; "trivial-posix-fs" ; experimental
"file-attributes"

;; Data Persistence
"postmodern"
"mito"
(:feature (:not :windows) "clsql")
;; "bknr.datastore" ; does not load on windows, also unmaintained now

;; TODO: Data Compression and Archiving

;; File Formats
;; "file-formats" ; experimental
"com.inuoe.jzon"
"shasht"
"fare-csv"

;; Cryptographic Services
"ironclad"

;; TODO: Generic Operating System Services

;; Command-line Interface
"unix-opts"
"clingon"

;; Concurrent Execution
"lparallel"

;; TODO: Internet Data Handling

;; TODO: Structured Markup Processing Tools

;; Internet Protocols and Support
"usocket"
"hunchentoot"
"hunchensocket"
"dexador"

;; TODO: Multimedia Services

;; Internationalization

"local-time"

;; Graphical User Interfaces
(:feature (:not :windows) "clog") ; depends on libsqlite3, does not load on windows, not out of the box anyways
"ltk"
"isocline-repl"

;; Development Tools
"esrap"
"quicksearch"
"quickproject"
(:feature (:not :ql-https) "ql-https")
(:feature (:not :swank) "swank")
"trivial-package-local-nicknames"

;; Debugging and Profiling
"swank"
"log4cl"

;; Software Packaging and Distribution
"deploy"

;; TODO: Runtime Services
"closer-mop"

;; TODO: Language Services
"trivial-features"
"policy-cond"
"cl-environments"
"cl-form-types"
"float-features"
"trivial-garbage"

;; Foreign Libraries
"cffi"
"cl-autowrap"
;; "py4cl2" ; experimental
;; "py4cl2-cffi" ; experimental

;; Iteration
"iterate"
"series"
"picl"

;; Pattern Matching
"optima"

;; Code Generation
"cl-who"
"parenscript"

;; Documentation
"mgl-pax"
"docsearch"


;; Testing
"fiveam"

;; TODO: Windows specific

;; Unix Specific
(:feature (:not :windows) "osicat") ; apparantly, it's supposed to work on windows, but it does not, not out of the box anyways
```

### 5. `help`

Example: *How do you look up a function's documentation in lisp when you are not using emacs? Eh, either use `describe` or `documentation`.*

*Ugh, so verbose.*

Duh, we should just define `help` that macroexpands to `describe`.

```moonli
MOONLI-USER> help(describe)
describe
  [symbol]

describe names a compiled function:
  Lambda-list: (object, &optional,
                (stream-designator, *standard-output*))
  Declared type: (function, (t, &optional, (or, stream, boolean)),
                  (values, &optional))
  Documentation:

    Print a description of OBJECT to STREAM-DESIGNATOR.

  Known attributes: unwind, any
  Source file: SYS:SRC;CODE;DESCRIBE.LISP
#=>
```

### 6. `docsearch`

Example: *How do I read a json file?*

```moonli
MOONLI-USER> docsearch("json")
 .
 .
 .
SHASHT:READ-JSON
  Function:
    Read a JSON value. Reading is influenced by the dynamic variables
    *read-default-true-value*, *read-default-false-value*, *read-default-null-value*,
    *read-default-array-format*, *read-default-object-format*, *read-hash-table-test* and
    common-lisp:*read-default-float-format* which each determine the default values
    and formats used. The following arguments also control the behavior of the read.

    * input-stream-or-string - a stream, a string or t. If t is passed then
      *standard-input* is used.
    * eof-error-p - if true signal eof with error, otherwise return eof-value.
    * eof-value - value used if eof-error-p is nil.
    * single-value-p - Check for trailing junk after read is complete.
 .
 .
 .
MOONLI-USER> help(shasht:read-json)
read-json
  [symbol]

read-json names a compiled function:
  Lambda-list: (&optional, (input-stream-or-string, t),
                (eof-error-p, t), eof-value, single-value-p)
  Derived type: (function, (&optional, t, boolean, t, boolean),
                 (values, t, &optional))
  Documentation:
    Read a JSON value. Reading is influenced by the dynamic variables
    *read-default-true-value*, *read-default-false-value*, *read-default-null-value*,
    *read-default-array-format*, *read-default-object-format*, *read-hash-table-test* and
    common-lisp:*read-default-float-format* which each determine the default values
    and formats used. The following arguments also control the behavior of the read.

    * input-stream-or-string - a stream, a string or t. If t is passed then
      *standard-input* is used.
    * eof-error-p - if true signal eof with error, otherwise return eof-value.
    * eof-value - value used if eof-error-p is nil.
    * single-value-p - Check for trailing junk after read is complete.

MOONLI-USER> *print-pretty* = nil
#=> nil

MOONLI-USER> with open-file(f, "~/ram-disk/sample.json"):
  shasht:read-json(f)
end
#=> #<hash-table :TEST equal :COUNT 1 {12091262A3}>

MOONLI-USER> alexandria:hash-table-alist(*)
#=> (("glossary" . #<hash-table :TEST equal :COUNT 2 {1209126423}>))

```

Enjoy :)
