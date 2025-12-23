---
title: 6. Classes and Methods
linkTitle: 6. Classes and Methods
---

<div class="tutorial-nav">
<a class="tutorial-prev" href="../05-systems/">
  < Previous: 5. Systems and Libraries
</a>
<a class="tutorial-next" href="../07-structures/">
  Next: 7. Structures and Performance >
</a>
</div>

Recall that while discussing [literal objects](01-literals.md), we discussed different kinds of literal objects. Each object in Moonli (and Common Lisp) has a *class*.

```moonli
class-of("hello")
#=> #<built-in-class simple-character-string>

class-of(2)
#=> #<built-in-class fixnum>

class-of(42.0)
#=> #<built-in-class single-float>
```

This corresponds to how the object is implemented in the programming environment. Classes have *instances*. For example, above, 

- the string `"hello"` is an *instance* of the built-in class `simple-character-string`
- `2` is an *instance* of the built-in class `fixnum`
- `42.0` is an *instance* of the built-in class `single-float`

Most programming languages provide a way for the user to define their own classes. A paradigm of programming that centers around classes and objects is known as Object-Oriented Programming. This involves defining new classes of objects that mimic the structure of the real-world you want to represent.

For example, suppose we want to program basic geometry. We can start with a class `rectangle`:

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

This creates a class with two *slots*: `height` and `breadth`.

We can create an instance using the following. Note that `:height` and `:breadth` were specified as the respective `initarg`.

```moonli
defparameter *shape-1* = make-instance($rectangle, :height, 6, :breadth, 3)
```

And access the slots using the specified `accessor`.

```moonli
height(*shape-1*)
#=> 6
breadth(*shape-1*)
#=> 3
```

## Methods and generic functions

You may want some functions to have different behaviors depending on the class of the object they are called with. For example, `area` of a triangle may be computed differently than a square, which in turn may be computed differently than a circle.

We can achieve this by using *generic functions*. A generic function can be declared using:

```moonli
defgeneric area(shape)
```

This introduces the function name but not its behavior yet.

### Defining methods

A method specializes a generic function on specific classes. Below, the generic function `area` is specialized with the first argument `shape` being of class `rectangle`.

```moonli
defmethod area(shape :: rectangle):
  height(shape) * breadth(shape)
end
```

We can call it just like any other normal function.

```moonli
area(*shape-1*)
#=> 18
```

Moonli dispatches to the correct method based on the argument's class.

### Extensibility

We can also define a class and a method corresponding to a `circle` class:

```moonli
defclass circle():
  slots:
    radius:
      initarg: :radius,
      accessor: radius;
  end
end

defmethod area(shape :: circle):
  pi * radius(shape) ^ 2
end
```

`pi` is a constant provided by Moonli (and Common Lisp).

```moonli
pi
#=> 3.141592653589793d0
```

```
defparameter *shape-2* = make-instance($circle, :radius, 7)

area(*shape-2*)
```

Note how we were able to *extend* the generic function `area` without touching the earlier implementations. This *extensibility* is one of the crucial benefits provided by *generic functions*.

### Multiple dispatch

Moonli (and Common Lisp) support *multiple dispatch*. This means methods can specialize on not just one parameter, like Python and Java do, but multiple parameters at once(!)

```moonli
# Check whether shape-in fits inside shape-out
defgeneric fits-inside-p(shape-in, shape-out)
```

The following specialized `fits-inside-p` on `rectangle` and `rectangle`.

```
defmethod fits-inside-p(s1 :: rectangle, s2 :: rectangle):
  let h1 = height(s1), h2 = height(s2),
      b1 = breadth(s1), b2 = breadth(s2):
    if ((min(h1,b1) <= min(h2,b2)) 
        and (max(h1,b1) <= max(h2,b2))):  
      t
    else:
      nil
    end
  end 
end
```

While the following specializes `fits-inside-p` on `rectangle` and `circle`:

```
defmethod fits-inside-p(s1 :: rectangle, s2 :: circle):
  let h = height(s1), b = breadth(s1), r = radius(s2):
    let d = sqrt(h ^ 2 + b ^ 2):
      if (d <= 2 * r):
        t
      else:
        nil
      end if
    end let
  end let
end defmethod
```


## Inheritance

Classes can *inherit* slots from its *super* classes. To help us organize our code better, we can define a `shape` class with a slot `label` which we want to be common across all shapes.

```moonli
defparameter *shape-index* = -1;

defclass shape():
  slots:
    index:
      initarg: :index,
      reader: index,
      initform: incf(*shape-index*);
  end
end
```

We can now add this label slot to the `rectangle` and `circle` class above by redefining `rectangle` and `circle` to have `shape` as one of its *superclasses*. 

## Dynamic Redefinition

Before we see how to specify `shape` as one of the direct superclass of `rectangle`, let us briefly ponder over `*shape-1` we had defined earlier:

```
describe(*shape-1*)

#<rectangle {700A674383}>
  [standard-object]

Slots with :instance allocation:
  length                         = 6
  breadth                        = 3
```

What do you think will happen to the rectangle instance bound to `*shape-1*` if we redefine `rectangle`?

We can redefine `rectangle` using:

```moonli
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

This specifies `shape` as one of the *direct* superclasses of `rectangle` class.

Now, if you check the object bound to `*shape-1*` once more, you will find that the `index` slot has already been added!

```moonli
describe(*shape-1*)

#<rectangle {700A674383}>
  [standard-object]

Slots with :instance allocation:
  index                          = 0
  length                         = 6
  breadth                        = 3
```

We can repeat the same with the `circle` class. 

1. Check the object bound to `*shape-2*` before update:

    ```moonli
    describe(*shape-2*)

    #<circle {700A497AB3}>
      [standard-object]
    
    Slots with :instance allocation:
      radius                         = 7
    ```
    
2. Update the `circle` class to include `shape` in its list of direct superclasses.

    ```moonli
    defclass circle(shape):
      slots:
        radius:
          initarg: :radius,
          accessor: radius;
      end
    end
    ```
    
3. Check the object bound to `*shape-2*` after update:

    ```moonli
    describe(*shape-2*)

    #<circle {700A497AB3}>
      [standard-object]
    
    Slots with :instance allocation:
      index                          = 1
      radius                         = 7
    ```

Now that `shape` is a superclass of `circle` and `rectangle`, you can also add other slots that would be common across all shapes to the `shape` class. Perhaps, this could be `center-location`, or `color`, or something else. These changes will be automatically propagated to all instances of the subclasses of `shape`. You do not need to restart your Moonli REPL or load all files again! You can play with classes and their instances very much on the fly.

Of course, once you have reached a state where the code in the REPL reflects what you had in mind, you also want to make sure the code is written down in the files in appropriate order. This is necessary both for sharing it with others, as well as for your own self when you restart the REPL.

But, by and large, Moonli (and Common Lisp) provide a very interactive object system. There are also a large number of options for more fine-grained control for object updation as well as initiation. But these are outside the scope of this tutorial, and readers are requested to consult to appropriate resources to learn and explore more on these topics.

## Method modifiers

A last point of note would be method modifers. Methods can be *modified* by prefixing their names with `:before`, `:after`, and `:around` modifiers to customize method behavior.

Example:

```moonli
defmethod :before fits-inside-p(s1, s2):
  format(t, "Checking if ~S fits inside ~S...", s1, s2)
end
  
defmethod :after fits-inside-p(s1, s2):
  format(t, "Done~%")
end
```

`:before` methods run before the main methods. `:after` runs after the main methods.

## Metaclasses

One can find the class associated with a symbol using `find-class`:

```moonli
find-class($string)
#=> #<built-in-class common-lisp:string>

find-class($rectangle)
#=> #<standard-class rectangle>
```

Further, in Moonli (and Common Lisp), one can find the class of the class by using `find-class` followed by `class-of`.

```moonli
class-of(find-class($string))
#=> #<standard-class built-in-class>

class-of(find-class($rectangle))
#=> #<standard-class standard-class>
```

Class of a class is called a *metaclass*. They define how the class itself behaves. We do not dive into metaclasses in this tutorial. But to note, many Common Lisp implementations (and thus, Moonli) provide what is called a [*Meta-Object Protocol*](https://franz.com/support/documentation/mop/index.html), which can be used to modify the behavior of classes, their instances, and methods and generic functions.

Here, we merely point to the existence of metaclasses. The `built-in-class` is one metaclass and `standard-class` is another. In the [next chapter](07-structures.md), we will dive into objects and classes corresponding to the metaclass `structure-class`. 

## Summary

Moonli transpiles directly to Common Lisp’s CLOS:

* Methods belong to *generic functions*, not classes -- encouraging extensible design.
* You get full multiple dispatch.
* Classes and methods can be redefined at the REPL.
* Multiple inheritance is allowed and sane.
* Method combination allows fine-grained customization of behavior.

Moonli gives you a simple, readable syntax while inheriting the dynamic power of the Lisp object system beneath it.

<div class="tutorial-nav">
<a class="tutorial-prev" href="../05-systems/">
  < Previous: 5. Systems and Libraries
</a>
<a class="tutorial-next" href="../07-structures/">
  Next: 7. Structures and Performance >
</a>
</div>
