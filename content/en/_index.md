---
title: The Moonli Programming Language
---

{{< blocks/cover title="Welcome to the Moonli Programming Language!" image_anchor="top" height="full" >}}
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/">
  Learn More <i class="fas fa-arrow-alt-circle-right ms-2"></i>
</a>
<a class="btn btn-lg btn-secondary me-3 mb-4" href="https://github.com/moonli-lang/moonli/releases/latest">
  Download <i class="fab fa-github ms-2 "></i>
</a>
{{% blocks/lead color="tertiary" %}}

Moonli is an easy to use interactive programming language powered by battle-tested tools. Its syntax is reminiscent of familiar languages like Python or Julia.

{{% /blocks/lead %}}

{{< blocks/link-down color="info" >}}

{{< /blocks/cover >}}

{{% blocks/lead color="primary" %}}

Under the hood, it relies on a flexible, multiparadigm language [Common Lisp](https://common-lisp.net/), and particularly its optimizing compiler [SBCL](https://www.sbcl.org/).

{{% /blocks/lead %}}

{{% blocks/section color="light" type="row" %}}

{{% blocks/feature icon="fa fa-none" title="30+ years of rich heritage" %}}

<p style="text-align:justify">
Common Lisp was ANSI standardized over the course of early-1980s to mid-1990s. SBCL (earlier CMUCL) has been available since early-2000s and continues to have <a href="https://github.com/sbcl/sbcl/releases">monthly releases</a> to this day.
</p>

{{% /blocks/feature %}}

{{% blocks/feature icon="fa fa-none" title="Small but extensive ecosystem" %}}

<p style="text-align:justify">
The Common Lisp community curates its libraries from time to time at <a href="https://awesome-cl.com/">awesome-cl</a>.
</p>

{{% /blocks/feature %}}

{{% blocks/feature icon="fa fa-none" title="Multiple library managers" %}}

<p style="text-align:justify">
From <a href="https://www.quicklisp.org/beta/">quicklisp</a> that ensures all packages in a distribution work together, to <a href="https://ultralisp.org/">ultralisp</a> that builds every five minutes, and <a href="https://github.com/ocicl/ocicl">OCI-based ocicl</a>, there are multiple options to suit your needs.
</p>

{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-none" title="Optional Typing" %}}

<p style="text-align:justify">
Common Lisp is dynamically typed by default. This again aids prototyping. However, once the prototype is ready, the program can be documented or optimized using type information. SBCL (see also <a href="https://coalton-lang.github.io/">Coalton</a>) is immensely helpful.
</p>

{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-none" title="Interactive Programming" %}}

<p style="text-align:justify">
Designed for <a href="https://www.youtube.com/watch?v=NUpAvqa5hQw">interactive programming</a> from the ground up. This makes it easy to redefine not just variables and functions but also classes, types, packages (= modules/namespaces) and syntax all on the fly.</p>
<p style="text-align:justify">
In particular, each can be redefined in a piecemeal fashion. This makes it best suited for explorative programming without breaking your flow.
</p>

{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-none" title="Learning Resources and Features" %}}
<p style="text-align:justify">
From the hacker oriented books <a href="https://lispcookbook.github.io/cl-cookbook/">Cookbook</a> and <a href="https://gigamonkeys.com/book/">Practical Common Lisp</a> to <a href="https://www.cs.cmu.edu/~dst/LispBook/book.pdf">beginner</a> <a href="https://paulgraham.com/acl.html?viewfullsite=1">friendly</a> as well as <a href="https://www.paulgraham.com/onlisptext.html">advanced</a> <a href="https://link.springer.com/book/10.1007/978-1-4842-6134-7">and</a> <a href="https://en.wikipedia.org/wiki/The_Art_of_the_Metaobject_Protocol">beyond</a>, there's something for everybody.
<p>
{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-none" title="Transpile-based" %}}
<p style="text-align:justify">
Moonli transpiles to Common Lisp. Your colleague familiar with Python or Julia can read Moonli code, while lispers in the wild can consume the corresponding Common Lisp code.
<p>
{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-none" title="Familiar Syntax" %}}
<p style="text-align:justify">
The syntax for Moonli is based around Python or Julia. This means it should be accessible to a wider audience who are familiar with these languages but unfamiliar with Lisp.
<p>
{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-none" title="Extensible" %}}
<p style="text-align:justify">
Moonli syntax is defined using Parsing Expression Grammar. The resulting grammar has two entry points to extend Moonli syntax. This makes it easy to extend Moonli to your favorite Common Lisp construct!
<p>
{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/lead color="primary" %}}

<p style="text-align:justify">
Common Lisp and thus, Moonli, is mutable, but can be used in a functional manner. It is amongst the pioneers of multiple dispatch. It supports multithreading. SBCL supports SIMD instructions on x86-64 processors. C libraries can be used through the Common Foreign Function Interface. This includes access to CUDA. These days, experimental support for calling functions in Python libraries is also available.
<p>

{{% /blocks/lead %}}

{{% blocks/section color="dark" type="row" %}}

{{% blocks/feature icon="fab fa-github" title="Contributions welcome!" %}}
We do a [Pull Request](https://github.com/moonli-lang/moonli/pulls) contributions workflow on **GitHub**. New users are always welcome!
{{% /blocks/feature %}}


{{% blocks/feature icon="fa fa-star" title="<a href='https://github.com/moonli-lang/moonli'>Star</a> and <a href='https://github.com/moonli-lang/moonli/subscription'>Watch</a> us on Github!" %}}
For announcement of latest features etc
{{% /blocks/feature %}}

{{% blocks/feature icon="fa fa-question" title="Create an Issue!" %}}
To ask for help or report a bug, create an [issue](https://github.com/moonli-lang/moonli/issues).
{{% /blocks/feature %}}

{{% /blocks/section %}}
