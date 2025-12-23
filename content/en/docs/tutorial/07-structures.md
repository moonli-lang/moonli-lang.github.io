---
title: 7. Structures and Performance
linkTitle: 7. Structures and Performance
---

<div class="tutorial-nav">
<a class="tutorial-prev" href="../06-classes/">
  < Previous: 6. Classes and Methods
</a>
<a class="tutorial-next" href="../08-types/">
  Next: 8. Types, Classes and Structures >
</a>
</div>

As we saw [last](06-classes.md), classes in Moonli (and Common Lisp) are very dynamic. A lot many things take place at run-time. Unfortunately, this also incurs a run-time cost.

In some cases, you may not need all that dynamicity, but may instead need better performance. This is achieved through *structures*. 

A *structure* is a simple container for data. They have fixed fields and no multiple inheritance. Structure of instances of classes with metaclass `structure-class`. For example, the below defines an instance `point` of  `structure-class`.

> If you are using the Moonli REPL for trying out the code in this tutorial series, you should start the REPL with `--enable-debugger` option for this tutorial. You can also do this by starting the REPL the usual way and then calling `cl-repl:enable-debugger()`.

```moonli
defstruct point:
  x = 0;
  y = 0;
end
```

This defines:

* a constructor `make-point(:x, …, :y, …)`
* accessors `point-x(obj)` and `point-y(obj)`
* a predicate `point-p`
* a printed representation

Creating a structure instance:

```moonli
defparameter *point* = make-point(:x, 3, :y, 4)
```

Accessing fields:

```moonli
point-x(*point*)
#=> 3

point-y(*point*)
#=> 4

point-p(*point*)
#=> t
```

## Redefining structures

There's no standard way to redefine structures. If you redefine `point` class to include a third slot for `z`, the existing instances as well as the code associated with the older (before update) class may behave unpredictably. This is quite unlike the classes that we discussed in the last chapter.

```moonli
defstruct point:
  x = 0;
  y = 0;
  z = 0;
end
```

In fact, if you are using the Moonli REPL in its default settings, you will simply get an error message if you try to run the new definition of `point`:

```
warning: change in instance length of class point:
  current length: 3
  new length: 4
simple-error: attempt to redefine the structure-object class point incompatibly
              with the current definition
Backtrace for: #<SB-THREAD:THREAD tid=259 "main thread" RUNNING {70054D05F3}>
0: ((LAMBDA NIL :IN UIOP/IMAGE:PRINT-BACKTRACE))
1: ((FLET "THUNK" :IN UIOP/STREAM:CALL-WITH-SAFE-IO-SYNTAX))
2: (SB-IMPL::%WITH-STANDARD-IO-SYNTAX #<FUNCTION (FLET "THUNK" :IN UIOP/STREAM:CALL-WITH-SAFE-IO-SYNTAX) {1014D13BB}>)
...
```

On the other hand, if you have enabled the debugger either by running `cl-repl:enable-debugger()` or by starting Moonli REPL with `--enable-debugger`, you will be dropped into the debugger:

```
warning: change in instance length of class point:
  current length: 3
  new length: 4
attempt to redefine the structure-object class point incompatibly with the
current definition
 [Condition of type simple-error]

Restarts:
 0: [continue] Use the new definition of point, invalidating already-loaded
                   code and instances.
 1: [recklessly-continue] Use the new definition of point as if it were
                          compatible, allowing old accessors to use new
                          instances and allowing new accessors to use old
                          instances.
 ...
 
Backtrace:
 0: (sb-kernel::%redefine-defstruct #<sb-kernel:structure-classoid point> #<sb-kernel:layout (ID=376) for point {700A180063}> #<sb-kernel:layout for point, INVALID=:uninitialized {7007551CE3}>)
 1: (sb-kernel::%defstruct #<sb-kernel:defstruct-description point {70074B6DA3}> #(#<sb-kernel:layout for t {7003033803}> #<sb-kernel:layout (ID=1) for structure-object {7003033883}>) #S(sb-c:definition-source-location :namestring nil :indices 0))
 ...
```

The debugger has essentially paused code execution, and is waiting for you to select a *restart*. You can select the restart by pressing `Ctrl + r` and then pressing `0` or `1` (or another restart number). Suppose we select the restart numbered `0`.

The redefinition of the `point` structure-class would proceed. However

```moonli
*point*
#=> #<UNPRINTABLE instance of #<structure-classoid point> {700A37C8B3}>

point-p(*point*)
#=> nil
```

Unlike classes, where the redefinition of class resulted in a clean updation of instances, redefinition of structures requires a fair bit of manual work. To actually use the new definition of `point` structure-class, you will need to redefine the binding for `*point*`.

```moonli
defparameter *point* = make-point(:x, 3, :y, 4)
```

```moonli
*point*
#=> #S(point :x 3 :y 4 :z 5)

point-p(*point*)
#=> t
```

## Performance

To actually compare the performance of classes and structures, let us define an equivalent class and a structure:

```moonli
defclass point-class():
  slots:
    x:
      initarg: :x,
      accessor: class-x;
    y:
      initarg: :y,
      accessor: class-y;
  end
end

defstruct point-struct:
  x;
  y;
end
```

Then one can run a loop summing up the x and y a million times.

For the class:

```moonli
let point = make-instance($point-class, :x, 3, :y, 4),
    num-iter = 1e9,
    sum = 0:
  time loop :repeat num-iter :do
    sum = sum + class-x(point) + class-y(point)
  end
  sum
end
```

```
Evaluation took:
  13.849 seconds of real time
  13.865638 seconds of total run time (13.843339 user, 0.022299 system)
  100.12% CPU
  0 bytes consed
```

For the structure:

```moonli
let point = make-point-struct(:x, 3, :y, 4),
    num-iter = 1e9,
    sum = 0:
  time loop :repeat num-iter :do
    sum = sum + point-struct-x(point) + point-struct-y(point)
  end
  sum  
end
```

```
Evaluation took:
  12.229 seconds of real time
  12.229539 seconds of total run time (12.215391 user, 0.014148 system)
  100.01% CPU
  0 bytes consed
```

At first, this looks comparable. However, one can specify the types of the structure slots:

```moonli
defstruct point-struct:
  (x = 0) :: fixnum;
  (y = 0) :: fixnum;
end
```

Then

```
let point = make-point-struct(:x, 3, :y, 4),
    num-iter = 1e9,
    sum = 0:
  declare type(fixnum, sum)
  time loop :repeat num-iter :do
    sum = sum + point-struct-x(point) + point-struct-y(point)
  end
  sum
end
```

We are down to a third of the time!

```
Evaluation took:
  4.223 seconds of real time
  4.223535 seconds of total run time (4.219177 user, 0.004358 system)
  100.02% CPU
  0 bytes consed
```

Meanwhile, type specification on classes have little impact:

```moonli
defclass point-class():
  slots:
    x:
      type: fixnum,
      initarg: :x,
      accessor: class-x;
    y:
      type: fixnum,
      initarg: :y,
      accessor: class-y;
  end
end
```

```moonli
let point = make-instance($point-class, :x, 3, :y, 4),
    num-iter = 1e9,
    sum = 0:
  declare type(fixnum, sum)
  time loop :repeat num-iter :do
    sum = sum + class-x(point) + class-y(point)
  end
  sum
end
```

```
Evaluation took:
  15.313 seconds of real time
  15.305151 seconds of total run time (15.280037 user, 0.025114 system)
  100.01% CPU
  0 bytes consed
```

The gap becomes even more pronounced when one considers construction of new instances and more complex read or write operations.

In practice, there are projects such as [static-dispatch](https://github.com/alex-gutev/static-dispatch) and [fast-generic-functions](https://github.com/marcoheisig/fast-generic-functions) that attempt to overcome the performance limitations of generic functions and standard classes, trying to give you the best of both worlds. However, these are not standard. The standard way to obtain fast Moonli (or Common Lisp) code is to use structures.

## Classes vs Structures

Classes are perfect for flexible, evolving designs. Structures are ideal for performance-critical code.


| Feature                    | Classes | Structures |
|----------------------------|---------|------------|
| Single inheritance         | ✅      | ✅         |
| Multiple inheritance       | ❌      | ❌         |
| Dynamic redefinition       | ✅      | ❌         |
| Performance                | ❌      | ✅         |
| Use with generic functions | ✅      | ✅         |
    

<div class="tutorial-nav">
<a class="tutorial-prev" href="../06-classes/">
  < Previous: 6. Classes and Methods
</a>
<a class="tutorial-next" href="../08-types/">
  Next: 8. Types, Classes and Structures >
</a>
</div>
