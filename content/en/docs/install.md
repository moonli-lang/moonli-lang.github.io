---
title: Installation
linkTitle: Installation
weight: 10
menu: {main: {weight: 15}}
---

## Method 1: Binaries - Best for checking out

Grab a binary from the [latest
release](https://github.com/digikar99/moonli/releases/latest). If you
want an interactive REPL as in the above gif, grab the binaries with
"repl" or "[ciel](https://ciel-lang.org/#/?id=ciel)" in their name.

If you want to run a few moonli files, grab the regular binaries.

However, the repl binaries depend on readline. This can be installed as
follows:

- Ubuntu: `sudo apt install libreadline-dev`
- Mac OS: `brew link readline --force`
- Windows: `pacman -S mingw-w64-x86_64-readline`

In case of any installation issues, please create an issue on
[github](https://github.com/digikar99/moonli/issues/new) or
[gitlab](https://gitlab.com/digikar/moonli/-/issues/new?type=ISSUE).

## Method 2: From fresh compilers - Best for serious development

### Step 0. Install a package manager for your OS

Mac OS: [brew](https://brew.sh/)

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

Windows:

- [MSYS2](https://www.msys2.org/): this will install the
  `pacman` package manager
- Or [choco](https://chocolatey.org/install)

### Step 1. Install a Common Lisp compiler and some tools

- Ubuntu: `sudo apt install git sbcl`
- Mac OS: `brew install git sbcl`
- Windows:
  - `pacman -S git mingw-w64-x86_64-sbcl`
  - `choco install git sbcl`

Once this step is successful, you should be able to type
`sbcl --help` and see something similar to the following:

    Usage: sbcl [runtime-options] [toplevel-options] [user-options]
    Common runtime options:
      --help                     Print this message and exit.
      --version                  Print version information and exit.
      --core <filename>          Use the specified core file instead of the default.
      --dynamic-space-size <MiB> Size of reserved dynamic space in megabytes.
      --control-stack-size <MiB> Size of reserved control stack in megabytes.
      --tls-limit                Maximum number of thread-local symbols.

    Common toplevel options:
      --sysinit <filename>       System-wide init-file to use instead of default.
      --userinit <filename>      Per-user init-file to use instead of default.
      --no-sysinit               Inhibit processing of any system-wide init-file.
      --no-userinit              Inhibit processing of any per-user init-file.
      --disable-debugger         Invoke sb-ext:disable-debugger.
      --noprint                  Run a Read-Eval Loop without printing results.
      --script [<filename>]      Skip #! line, disable debugger, avoid verbosity.
      --quit                     Exit with code 0 after option processing.
      --non-interactive          Sets both --quit and --disable-debugger.
    Common toplevel options that are processed in order:
      --eval <form>              Form to eval when processing this option.
      --load <filename>          File to load when processing this option.

    User options are not processed by SBCL. All runtime options must
    appear before toplevel options, and all toplevel options must
    appear before user options.

    For more information please refer to the SBCL User Manual, which
    should be installed along with SBCL, and is also available from the
    website <http://www.sbcl.org/>.

### Step 2. Install ocicl {#2-install-ocicl}

Follow the instructions at <https://github.com/ocicl/ocicl>.

Briefly:

- MacOS: `brew install ocicl && ocicl setup`
- Others:

<!-- -->

    git clone https://github.com/ocicl/ocicl
    cd ocicl
    sbcl --load setup.lisp
    ocicl setup

Edit the compiler init file (eg. `~/.sbclrc`) to include the
current directory, or

```common-lisp
#-ocicl
(when (probe-file #P"/Users/user/.local/share/ocicl/ocicl-runtime.lisp")
  (load #P"/Users/user/.local/share/ocicl/ocicl-runtime.lisp"))
(asdf:initialize-source-registry
 ;; (list :source-registry
 ;;       (list :tree (uiop:strcat (uiop:getenv "HOME") "/Common Lisp/"))
 ;;       :inherit-configuration)
 (list :source-registry
       (list :directory (uiop:getcwd))
       :inherit-configuration))
```

### Step 3. Install Moonli

#### 3.1. Obtain the source

    git clone https://github.com/moonli-lang/moonli

#### 3.2. Start the REPL

    sbcl --eval '(asdf:load-system "moonli/repl")' --eval '(cl-repl:main)'

Optionally, with [CIEL](https://ciel-lang.org/#/?id=ciel)

    sbcl --eval '(asdf:load-system "moonli/ciel")' --eval '(cl-repl:main)'

#### 3.3a. (Optional) Building basic binary

The following should create a `moonli` binary in the root
directory of moonli.

    sbcl --eval '(asdf:make "moonli")'

    ./moonli --help
    A basic moonli transpiler over SBCL
    Available options:
      -h, --help                 Print this help text
      -l, --load-lisp ARG        Load lisp file
      -m, --load-moonli ARG      Load moonli file
      -t, --transpile-moonli ARG
                                 Transpile moonli file to lisp file

#### 3.3b. (Optional) Build REPL

The following should create a `moonli.repl` binary in
the root directory of moonli.

    sbcl --eval '(asdf:make "moonli/repl")'

#### 3.3c. (Optional) Build REPL with CIEL

The following should create a `moonli.ciel` binary in
the root directory of moonli.

    sbcl --eval '(asdf:make "moonli/ciel")'


### Step 4. Set up VS Code

Install [VS Code](https://vscodium.com/) or [VSCodium](https://vscodium.com/) if they are not already installed.

Once the editor is installed, install the [Alive Moonli](https://marketplace.visualstudio.com/items?itemName=moonli-lang.alive-moonli) extension.

