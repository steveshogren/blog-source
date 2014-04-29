---
layout: post
title: "Pattern Matching"
date: 2014-04-28 22:05
comments: true
categories: 
- Programming
tags:
- programming
status: publish
type: post
published: false
---

What is pattern matching? It is the simplest tool you've probably
never heard of, but it adds a lot of expressivity.

Consider the following code that converts a List<T> to a List<U>

``` csharp
public IEnumerable<U> map<T, U>(Func<T, U> f, IEnumerable<T> list) {
    var ret = new List<string>();
    foreach(var l in list) {
        ret.Add(f(l));
    }
    return ret;
}
```

I know I could just use the Linq "Map", the point is to illustrate how
one could make their own version. This example is iterative, looping over the
input list to produce a result, but it could be made recursive:

``` csharp
public IEnumerable<U> map<T, U>(Func<T, U> f, IEnumerable<T> list) {
    if (list.Count() == 0) {
        return new List<string>();
    }

    return map(list.Skip(1)).Add(f(list.First()));
}
```

To my eyes, the recursive example is more wordy and harder to
read. The fincky parts of what to do when the list is empty and how to
get all but the first in the list add edge cases. I wrote this code
without a C# compiler available to check it, and without that, I am
not even 100% confident it would work as written.

Imagine if we could add a lanaguage feature to C#, something like
this:

``` csharp
// only callable like: do(0)
public void do(int 0) {
 Console.Write("Called with 0");
}
// only callable if x != 0
public void do(int x) {
 Console.Write("Called with x != 0");
}
do(0);
//"Called with 0"
do(1);
//"Called with x != 0"
```

If we had this pattern matching, with a way to get the first and rest
of a list, we could rewrite our code even more sucinctly.

``` csharp
public IEnumerable<U> map<T, U>(Func<T, U> f, IEnumerable<T> list.Count() == 0) {
    return new List<string>();
}
public IEnumerable<U> map<T, U>(Func<T, U> f, IEnumerable<T> [first : rest]) {
    return f(first).Concat(map(rest));
}
```

Here is the same code in Haskell, which does have that pattern
matching. Don't worry, it is just as type safe as the C# example.

``` haskell
map :: (a -> b) -> List a -> List b
map _ Nil = Nil
map f (first :. rest) =
    f(first) :. map f rest
```

Whoa, right? To my untrained eyes, that still looks like gibberish for
a second. Let's break it down:

``` haskell
map :: (a -> b) -> List a -> List b
```

The function type signature. The first argument is a function that
takes a generic 'a' and returns a generic 'b', just like our Func<T,
U> in C#. The second argument is obvious, a generic List of 'a'. The
return, (the last in the chain) a generic List of 'b'.

Now the first body:

``` haskell
map _ Nil = Nil
```

Functions in Haskell apply pattern matching much like functions in C#
and Java, but instead of matching on types and argument counts, they
match on the _values_ of the parameters. The first function here just
ignores the first parameter, and checks if the second is a Nil. If it is,
it returns Nil without any further work. 

``` haskell
map f (first :. rest) =
    f(first) :. map f rest
```

The first parameter "f" is the function we already discussed (a ->
b). The second parameter is a "List a". We decompose that list of "a"
into the first and the rest. The ":." composes a new list, with the
left side being the new first, and the right side being the new rest.

In this way, pattern matching was able to remove the



