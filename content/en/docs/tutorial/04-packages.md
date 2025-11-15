---
title: 4. Packages and Namespaces
linkTitle: 4. Packages and Namespaces
---

Suppose you write some code and share it with other people. Or you want to use code written by other people. It may happen that both of you are using the same function names but are doing different things. For example, your `process-data` function might be doing something different that somebody else' `process-data` function.

To deal with this, most modern languages implement the concept of namespaces. The implementation of namespaces in Moonli (and Common Lisp) is made by a data structure called `package`. One way to find or identify packages is using strings.

```moonli
MOONLI-USER> find-package("CL")
[OUT]: #<package "COMMON-LISP">
MOONLI-USER> find-package("COMMON-LISP")
[OUT]: #<package "COMMON-LISP">
MOONLI-USER> find-package("MOONLI")
[OUT]: #<package "MOONLI">
```

The above says that `"CL"` and `"COMMON-LISP"` are both two different names of the same package. On the other hand, the string `"MOONLI"` identifies a different package. Note that package names are case sensitive. This means `"moonli"` and `"MOONLI"` identify different packages. In fact, if you are following the tutorial, so far there is no package named `"moonli"`, but only the package named `"MOONLI"`:

```moonli
MOONLI-USER> find-package("moonli")
[OUT]: nil
```

A `package` maps symbol names to symbols. Symbol names are again strings. You can use `find-symbol` to find a symbol in a particular package. For example, the following finds the symbol named `"LIST"` in package named `"CL"`.

```moonli
MOONLI-USER> find-symbol("LIST", "CL")
[OUT]: list
:external
```

Note that the second argument to `find-symbol` can be either a package name (a string) or the package itself, for example:

```moonli
MOONLI-USER> let pkg = find-package("CL"):
  print(pkg)
  find-symbol("LIST", pkg)
end

#<package "COMMON-LISP">
[OUT]: list
:external
```

In fact, the second argument is optional. When you do not supply it, `find-symbol` finds the symbol in the package bound to the special variable `*package*`.

```moonli
MOONLI-USER> find-symbol("LIST", "MOONLI-USER")
[OUT]: list
:external
MOONLI-USER> *package*
[OUT]: #<package "MOONLI-USER">
MOONLI-USER> find-symbol("LIST")
[OUT]: list
:external
```

You may wonder whether the symbol `list` above belongs to the package named `"MOONLI-USER"` or to the package named `"COMMON-LISP"` given that they look identical. To identify the package which a symbol belongs to, you can use the function `symbol-package`. Note that the symbol `list` is quoted by prefixing it with `$`, since we want to refer to the symbol itself and not the value it is bound to:

```moonli
MOONLI-USER> symbol-package($list)
[OUT]: #<package "COMMON-LISP">
```

This says that the symbol `list` belongs to the package `"COMMON-LISP"`. To confirm:

```moonli
MOONLI-USER> let sym = find-symbol("LIST", "MOONLI-USER"):
  symbol-package(sym)
end
[OUT]: #<package "COMMON-LISP">
```

Indeed, the symbol named `"LIST"` in package `"MOONLI-USER"` has as its package `"COMMON-LISP"`!

In fact, packages provide much more than simple mapping. They provide a way to *organize* the symbols themselves. Packages also have the notion of *internal* and *external* symbols. Above, the second return value `:external` shows that the `list` symbol is external to the respective packages.

While writing your own code, you should define your own package as the first step. You can define new packages using `defpackage`. This takes in a number of *options*, a few of them include:

- `:use`: which specifies preexisting packages the new package should use. This means that all the external symbols of these packages will be used in the new package.
- `:export`: which specifies which should be the external symbols of this new package. These are the symbols that you want to make available to other users of your code.

```moonli
MOONLI-USER> defpackage "TUTORIAL"
  :use "CL", "MOONLI-USER";
  :export "ADD";
end
[OUT]: #<package "TUTORIAL">
```

This specifies that the new package named `"TUTORIAL"` uses the external symbols of the existing packages `"CL"` and `"MOONLI-USER"`. It also specifies that the package `"TUTORIAL"` has a symbol named `"ADD"` as an external symbol. We can switch to the new package using `in-package`.

```moonli
MOONLI-USER> in-package tutorial
[OUT]: #<package "TUTORIAL">
TUTORIAL>
```

You will notice that the prompt `MOONLI-USER>` has changed to `TUTORIAL>`. The prompt also indicates the which package you are currently in. Once you have defined a new package, you can use `in-package` to switch to that package (or any other) no matter in which file you are in. This does not require quoting, because `in-package` is a special form (also called a macro).

You may note that we had said package names are case sensitive. Yet, we used the symbol `tutorial` to refer to the package named `"TUTORIAL"`. In Moonli, the symbols are related to their names by case inversion. This is for backward compatibility with Common Lisp and to enable the use of Common Lisp libraries with minimal disruption. The Common Lisp convention is to distinguish symbols not by their case, but by making the names themselves distinct regardless of case. However, Moonli wants to provide better names while interfacing with C and Python libraries, thus, the Moonli parser is case sensitive.

The external symbols from another package can be used by prefixing the symbol name with the package name and using a colon `:` as a separator (without spaces). For example, the function `ensure-list` in package `alexandria` takes any object, and if it is not a list, it wraps it into a list. You can access this symbol using `alexandria:ensure-list`.

```moonli
TUTORIAL> listp((1,2,3))
[OUT]: t
TUTORIAL> alexandria:ensure-list((1,2,3))
[OUT]: (1 2 3)
TUTORIAL> alexandria:ensure-list("a")
[OUT]: ("a")
TUTORIAL> alexandria:ensure-list(42.0)
[OUT]: (42.0)
```

