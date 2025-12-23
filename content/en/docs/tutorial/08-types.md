---
title: 8. Types, Classes and Structures
linkTitle: 8. Types, Classes and Structures
---

<div class="tutorial-nav">
<a class="tutorial-prev" href="../07-structures/">
  < Previous: 7. Structures and Performance
</a>
<a class="tutorial-next" href="../09-miscellaneous/">
  Next: 9. Miscellaneous >
</a>
</div>

So far, we have seen a number of *types*. Built-in types such as `string`, `fixnum`, `symbol`, as well as user-defined types such as `point`, `shape`, `rectangle` and `circle.

Classes -- either [standard-classes](06-classes.md) or [structure-classes](07-structures.md) -- and Types have a close correspondence. Every class defines a type. That is why, even though `point`, `shape`, etc were defined as classes, they are also types. Most types also have a corresponding class. The [Common Lisp Hyperspec page on *Integrating Types and Classes*](http://www.ai.mit.edu/projects/iiip/doc/CommonLISP/HyperSpec/Body/sec_4-3-7.html) go into this in detail.

To begin with, one can check whether an object is of a particular type using `typep`.

```moonli
typep(2, $fixnum)
#=> t

typep(2, $integer)
#=> t
```

All objects are of type `t`. This is also the boolean value true.

```moonli
typep(2, t)
#=> t
```

No objects are of type `nil`. This is also the boolean value false.

```moonli
typep(2, nil)
#=> nil
```

In contrast to classes and structures, however, some type specifiers also allow us to check whether an object is of a more specific type. The following checks whether the object `2` is an integer between `1` and `5`.

```moonli
typep(2, $integer(1, 5))
#=> t
```

Note that the second argument to `typep` is quoted using `$`. However, `t` and `nil` do not need to be quoted.

The following checks whether the object `"hello"` and `"hello world"` are strings of length 5.

```moonli
typep("hello", $string(5))
#=> t

typep("hello world", $string(5))
#=> nil
```

Classes and structures do not allow this detailed specification.

One can also define new types that are combinations of existing types. The following defines `rectangle-or-circle` as a type. Objects are of this type if they are a `rectangle` or a `circle`. In other words, `rectangle-or-circle` type is a disjunction of the types `rectangle` and `circle`.

```moonli
deftype rectangle-or-circle():
  $(rectangle or circle)
end
```

Like *disjunction*, one can define types corresponding to conjunctions using the `and` operator.

One can also talk about types corresponding to a specific object. These are `eql`-types. The type `eql(5)` only includes the object `5` and nothing else(!)

```moonli
typep(5, $eql(5))
#=> t

typep(5.0, $eql(5))
#=> nil
```

One can also talk about negative types. `not(integer)` includes all objects that are not integers.

```moonli
typep(5, $not(integer))
#=> nil

typep(5.0, $not(integer))
#=> t

typep("hello", $not(integer))
#=> t
```

Types also have `subtypep` relations between them. A type `t1` is a subtype of type `t2` if all members of `t1` are also members of `t2`. Thus, every type is a subtype of `t`.

```moonli
subtypep($not(integer), t)
#=> t t
```

Subtypep returns two return values:

- the first indicates whether the first argument is a subtype of the second
- the second indicates whether the subtype relation was determinable

For most common types, the second value is `t`, but eventually, you can expect to run into cases where the second value is `nil`.

While types allow powerful expressive capabilities, in general, they cannot all be used as the method specializers in generic functions. Only `eql`-types and types that correspond exactly to a class are allowed method specializers of the generic functions. Thus, there are no *standard* ways to make the behavior of a function depend on the detailed types of its objects.

However, there are again projects such as [peltadot](https://gitlab.com/digikar/peltadot) and [polymorphic-functions](https://github.com/digikar99/polymorphic-functions) that attempt to provide functions that dispatch on arbitrary type specifiers.

<div class="tutorial-nav">
<a class="tutorial-prev" href="../07-structures/">
  < Previous: 7. Structures and Performance
</a>
<a class="tutorial-next" href="../09-miscellaneous/">
  Next: 9. Miscellaneous >
</a>
</div>
