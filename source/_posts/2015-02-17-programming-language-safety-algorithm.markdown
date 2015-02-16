---
layout: post
title: "Programming Language Safety Algorithm"
date: 2015-02-17 14:13
comments: true
categories: 
---

I think the time has come for a standard programming language scoring
algorithm that allows us to discuss the relative merits and, more
importantly, associated costs of various languages and idioms.

Rather than focus on what is _possible_ with a language, I will
instead suggest we focus on what is typically idiomatic. For example,
if it is possible to achieve a level of safety in a language but by
doing something uncommon, that should not be counted. 

To score a language, simply figure out how many characters it costs to
"prevent" a certain type of error, and add that to the total. If it is
idiomatic to include newlines, count those as one each. Spaces or tabs
do not count, but all other punctuation does. If a specific check is
compiler enforced, like F#'s Option, that is only scored as half as
many characters, to weight the fact that this is "safer" code. If
something needs a library to function, we will not count that either,
as the requiring of the namespace might have a negligible effect on the
code size.

For example, lets score C# and F#:

### Null Reference Method/Field Invocation

``` csharp
    //if(l!=null){}else{}
    if (l != null) {
        <consequent>
    } else {
        <alternative>
    }
```

For this I count 19 characters and 4 newlines, so +23. You could
remove the newlines or curly brackets, but it is idiomatic to write it
this way. It is possible to use the ternary operator as well, but a
quick SO search shows a lot of comments cautioning against using them
"too much", so we will count the traditional "if-else" for the most
idiomatic way of checking if the field is null before using it.

In F#, it is idiomatic to use Option instead of null (most classes
cannot be made null without special effort). Library functions like
sequential application (<*>) for automatically testing for Some or
None, and applying the consequent only if the value is Some.

``` fsharp
open FSharpx.Option
    //1234567890123456789012345678901234567890
    //<*>l
    <consequent> <*> l
```

This comes in at 4 characters, for the typical case of null checking
and performing some action with the inner value if it is there. Since
it is compiler enforced, divide that by 2 for +2.

### Null List Iteration

In C#, one would need to perform the same check as above, so +23.

In F#, the idiomatic list cannot be made null, so there is no check: 0.

### Putting wrong type into variable

C# and F# - Compiler enforced. +0


### Missing List Element

``` csharp
    //12345678901234567890123456789012345678901234567890
    //if(l.Count()>i){}else{}
    if (l.Count() > i) {
        <consequent>
    } else {
        <alternative>
    }
```

C# has 23 and 4 newlines for +27.

``` fsharp
    //12345678901234567890123456789012345678901234567890
    //ifl.Count()>ithenelse 
    if l.Count() > i then
        <consequent>
    else <alternative>
```

F# has 21 and 2 newlines for +23.

### Incorrect Type Casting

```csharp
    //1234567890123456789012345678901234567890
    //varm=oasT;if(m!=null){}else{}
    var m = o as T;
    if (m != null) {
        <consequent>
    } else {
        <alternative>
    }
```

C# - 29 characters and 6 newlines. +35.

``` fsharp
    //1234567890123456789012345678901234567890
    //matchowith|:?Tasm->|_->
    match o with
        | :? T as m -> <consequent>
        | _ -> <alternative>
```

F# - 23 characters and 2 newlines. +25.

### Variable Mutation Across Threads

Missed Exceptions
Variable Mutation Across Threads
Missing Polymorphic Dispatch Implementation
Value Pass Type mismatch
algebraic data types AND
algebraic data types OR
type casting
passing wrong type to method
putting wrong type into variable
