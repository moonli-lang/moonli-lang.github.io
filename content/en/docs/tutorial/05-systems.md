---
title: 5. Systems and Libraries
linkTitle: 5. Systems and Libraries
---

Once you have someone else' code, you need to tell the REPL how to *load* their code. Or when you share your code with someone, you also need to tell them how to tell their REPL to load your code. At its simplest, the shared code is in the form of a single file. You can load a Moonli file using `moonli:load-moonli-file` and Common Lisp files using `cl:load`:

```moonli
MOONLI-USER> moonli:load-moonli-file("my-code.moonli")
...
MOONLI-USER> cl:load("my-code.lisp")
...
```

However, often times, shared code is in the form of multiple files. The shared code is essentially what is called a library. Different programming languages have different ways of defining or sharing libraries. In Moonli (and Common Lisp), libraries and tools for managing them are implemented in ASDF.

ASDF stands for Another System Definition Facility and is the standard build-and-load system for Common Lisp. It lets you group files into systems, declare dependencies (on other libraries), and provide metadata (author, version, license, etc.). 

If you’re writing a library (or project) that others might use — or you want to reuse your own code across different projects — you put an .asd file at the root describing that system.

## Anatomy of a system definition

At the root of your library directory, create a file named <your-system>.asd. Example of `my-awesome-lib.asd`:

```lisp
;;; my-awesome-lib.asd
(defsystem "my-awesome-lib"
  :version "0.1.0"
  :author "Your Name <you@example.com>"
  :description "Utilities for awesome tasks"
  :license "MIT"
  :depends-on ("alexandria")
  :serial t
  :pathname "./"
  :components ((:moonli-file "package")
               (:moonli-file "core")
               (:moonli-file "utils")))
```

Here:

- "my-awesome-lib" is the system name. ASDF expects the file my-awesome-lib.asd. 
- `:components` lists the source files (without extension). ASDF will compile and load them in the right order according to dependencies.
- You can declare external dependencies via `:depends-on`, naming other ASDF systems your code needs. For example, the above system (= library) says that it depends on a library called "alexandria". 

Optionally you can include metadata such as version, author, license, long description. This is useful for distribution/packaging if you share code.

## Putting code and system together

The above definition corresponds to the following directory structure:

```
my-awesome-lib/
  ├── my-awesome-lib.asd
  ├── package.moonli       ;; package definition
  ├── core.moonli          ;; core functions
  └── utils.moonli         ;; utility functions
```

## Loading and using your system

Once your .asd is in a directory ASDF can find, you can load your library from the REPL:

```
MOONLI-USER> asdf:load-system("my-awesome-lib")
...
```

ASDF ensures that the dependencies (in this case, alexandria) and their dependencies are loaded exactly once in the right order. Once the dependencies are loaded, ASDF loads the `:components` of your system in `:serial` order. This means, ASDF will first load `package.moonli`, then `core.moonli` and finally `utils.moonli`.

That will compile and load the system. From there you can (in-package :my-awesome-lib) (or whatever package you defined) and use its functions.

## Systems and Packages

Note that there are two senses of systems. Firstly, they are a collection of moonli (or lisp) files, along with an .asd file. However, this information is also available within the language in the form of an object:

```moonli
MOONLI-USER> asdf:find-system("my-awesome-lib")
[OUT]: #<system "my-awesome-lib">

MOONLI-USER> describe(*)

#<system "my-awesome-lib">
  [standard-object]

Slots with :instance allocation:
  name                           = "sample-asdf"
  source-file                    = #P"/Users/user/moonli/my-awesome-lib/my-awesome-lib.asd"
  definition-dependency-list     = nil
  definition-dependency-set      = {..
  version                        = nil
  description                    = nil
  long-description               = nil
  sideway-dependencies           = nil
  if-feature                     = nil
  in-order-to                    = nil
  inline-methods                 = nil
  relative-pathname              = #P"/Users/user/moonli/my-awesome-lib/"
  absolute-pathname              = #P"/Users/user/moonli/my-awesome-lib/"
...
```

You can reload the library by supplying additional option `:force` as `t`:

```moonli
MOONLI-USER> asdf:load-system("my-awesome-lib", :force, t)
...
```

## Configuring where ASDF looks for systems

By default, ASDF will search some standard directories (e.g. `~/common-lisp/`) for .asd files. 

If you prefer a custom layout, you can configure ASDF’s “source registry” by creating a configuration file (e.g. in `~/.config/common-lisp/source-registry.conf.d/`) that tells ASDF to scan your custom code directories. 
asdf.common-lisp.dev

Once configured, ASDF will find your libraries automatically — so you just load them by name, without worrying about full paths.

## Systems and Packages

It’s useful to remember the conceptual distinction:

- A package (in Moonli or Common Lisp) groups symbols (names)
- A system (in ASDF) groups files, code, dependencies, metadata

You use packages to manage symbol namespaces in code, and ASDF systems to manage your project’s files and dependencies. 

## Package Managers

ASDF defines *how* systems are organized and loaded, but it doesn’t tell you *where* to get them. This is the job of library managers. Below, we list a few of them

### 1. Quicklisp - The Standard Library Manager

[Quicklisp](https://www.quicklisp.org/beta/) is the de-facto ecosystem for installing and managing Common Lisp libraries.
It provides:

- A large, curated set of stable libraries
- Automatic dependency resolution
- One-line installation and loading
- A reproducible snapshot each month

Once you have quicklisp installed and loaded, you can install new libraries simply by quickload-ing them:

```lisp
ql:quickload("dexador")
```

Quicklisp automatically configures ASDF to locate the offline library after it is downloaded. Thus, ASDF knows where the system lives, so you can use it in your own project’s `:depends-on`.

### 2. Ultralisp - A Fast, Community-Driven Repository

[Ultralisp](https://ultralisp.org/) is a complementary distribution to Quicklisp.

It focuses on:

- Very fast updates (often every few minutes)
- Automatically including systems from GitHub/GitLab
- A broader, more experimental set of libraries

After installing quicklisp, you can install ultralisp simply by:

```lisp
ql-dist:install-dist("http://dist.ultralisp.org/")
```

### When to use Ultralisp

Use it when:

* You want bleeding-edge versions of a library
* You need something not yet in Quicklisp
* You want Quicklisp-style automatic dependency handling but with faster turnaround

Moonli developers can publish their own libraries to Ultralisp to reach users quickly.

### 3. OCICL - OCI-based ASDF system distribution

[OCICL](https://github.com/ocicl/ocicl) (pronounced *osicl*) is a more modern alternative to quicklisp and ultralisp. In addition to loading libraries, it also provides tools to version-lock the libraries.

## Summary

| Tool          | Purpose                                                | When to Use                                  |
|---------------|--------------------------------------------------------|----------------------------------------------|
| **ASDF**      | Build system and system loader                         | Every project; defines your system structure |
| **Quicklisp** | Stable, curated dependency manager                     | Most users; everyday library installation    |
| **Ultralisp** | Rapid updates, large community index                   | Fast-moving libraries; newest versions       |
| **OCICL**     | Modern alternative that also allows dependency-locking | Providing reproducible build environments    |


