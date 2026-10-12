---
title: Tutorial
linkTitle: Tutorial
weight: 20
menu: {main: {weight: 20}}
---

To install, see the [Installation](../install/) page.

To run the REPL use

    moonli

or

    pixi run moonli

To run Moonli scripts, use

    moonli /path/to/script.moonli

or

    pixi run moonli /path/to/script.moonli


You can see the available options with `--help`.

```sh
$ pixi run moonli --help
A full-featured Moonli REPL

Usage: moonli [-h|--help] [-v|--version] [-n|--no-init] [--history-file ARG]
              [-l|--load ARG] [-t|--transpile ARG] [-e|--eval ARG] [-f|--funcall ARG]
              [--values-separator ARG] [-d|--enable-debugger] [-s|--silent] [--no-isocline] [--lisp] script-1 script-2 ...

Available options:
  -h, --help             Print this help and exit.
  -v, --version          Show the version info and exit.
  -n, --no-init          Skip to load init file.
  --history-file ARG     Specifies which history file to use. If unspecified, this is the .moonli-repl file in $HOME directory.
  -l, --load ARG         Load a file
  -t, --transpile ARG    Transpile moonli file to lisp file
  -e, --eval ARG         Eval a form
  -f, --funcall ARG      Call a function with given arguments. For example, -f uiop:strcat hello world
  --values-separator ARG String to use as the separator between multiple values
  -d, --enable-debugger  Enable debugger: print error and drop into the debugger
  -s, --silent           Don't print logo and program information
  --no-isocline          Start a dumb terminal without isocline
  --lisp                 Start in lisp mode
```

<br/>
<br/>

If you are already familiar with Python, you may be able to learn faster from [this page](../intro-python/).

Common Lispers can refer to [this page](../intro-lisp/).

The rest of the below pages present a conceptual introduction to Moonli.


