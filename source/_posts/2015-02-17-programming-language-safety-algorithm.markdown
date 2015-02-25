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
"prevent" a certain type of error, and add that to the total. Do not
count newlines. Spaces or tabs do not count, but all other punctuation
does. If a specific check is compiler enforced, like F#'s Option, that
is only scored as half as many characters, to weight the fact that
this is "safer" code. If something needs a library to function, we
will not count the import either, as the importing the namespace will
have a negligible effect on the code size and complexity.

If there is a safety feature that is not possible to achieve
programmatically, we will add +30 for a "every change run and debug to
fix" cost.

For example, lets score C# and F#:

## Totals

| Safety Check | C#  | F# | Javascript|
|--|------------- |------------- |--|
| Null Reference Method/Field Invocation| 19 | 2 | 20 
| Null List Iteration                   | 19 | 0 | 20
| Putting wrong type into variable      | 0  | 0 | 30
| Missing List Element                  | 23 | 21 | 22
| Incorrect Type Casting                | 29 | 23 | 30
| Passing Wrong Type to Method          | 0 | 0 | 30
| Calling Missing Method/Field/Function/Variable/Constant | 0 | 0 | 15
| Missing Enum Dispatch Implementation  | 30  | 0 | 30
| Unexpected Variable Mutation          | 40 | 0 | 30
| Deadlock prevention                   | 30 | 30 | 0
| Memory Deallocation                   | 0 | 0 | 0
| Stack Overflow Exceptions Caused by Recursion | 30  | 0 | 30
    ||220 | 76| 237



### Null Reference Method/Field Invocation

``` csharp
    //1234567890123456789012345678901234567890
    //if(l!=null){}else{}

    if (l != null) {
        <consequent>
    } else {
        <alternative>
    }
```

I count 19 characters, so +19. It is possible to use the ternary
operator as well, but a quick StackOverflow search shows a lot of
comments cautioning against using them "too much", so we will count
the traditional "if-else" for the most idiomatic way of checking if
the field is null before using it.

In F#, it is idiomatic to use Option instead of null (most classes
cannot be made null without special effort). The FSharpx library
function "sequential application" written: (<*>) automatically tests
for Some or None, and applies the consequent only if the value is
Some.

``` fsharp
    //1234567890123456789012345678901234567890
    //<*>l

    <consequent> <*> l
```

This comes in at 4 characters, for the typical case of null checking
and performing some action with the inner value if it is there or
returning the None if it isn't. Since it is compiler enforced, divide
that by 2 for +2.

``` javascript
    //1234567890123456789012345678901234567890
    //if(l!==null){}else{}

    if (l !== null) {
        <consequent>
    } else {
        <alternative>
    }
```

Javascript comes in at +20.

### Null List Iteration

In C#, one would need to perform the same check as above: +19.

In F#, the idiomatic list cannot be made null, so there is no check: +0.

In Javascript, same if check as above: +20.

### Putting wrong type into variable

C# and F# - Compiler enforced. +0

Javascript, no real idiomatic way to check, so: +30.

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

C# has +23.

``` fsharp
    //12345678901234567890123456789012345678901234567890
    //ifl.Count()>ithenelse 
    if l.Count() > i then
        <consequent>
    else <alternative>
```

F# has +21.

``` javascript
    //12345678901234567890123456789012345678901234567890
    //if(l.length>i){}else{}

    if (l.length > i) {
        <consequent>
    } else {
        <alternative>
    }
```

Javascript: +22.

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

C# has +29.

``` fsharp
    //1234567890123456789012345678901234567890
    //matchowith|:?Tasm->|_->

    match o with
        | :? T as m -> <consequent>
        | _ -> <alternative>
```

F# has +23.

Javascript, no idiomatic way to check: +30.

### Passing Wrong Type to Method

Both C# and F# compilers check for this: +0

Javascript, no idiomatic way to check: +30.

### Calling Missing Method/Field/Function/Variable/Constant

Both C# and F# compilers check for this: +0

``` javascript
    //1234567890123456789012345678901234567890
    //if(t.f){}else{}

    if (t.f) {
        <consequent>
    } else {
        <alternative>
    }
```

Javascript, just check if it is there: +15.

### Missing Enum Dispatch Implementation

For example, using a switch-case in C# to dispatch on an enum
value. If you add a new value, the compiler does nothing, so no
safety. It isn't idiomatically possible to prevent this error, so +30.

In F#, the compiler offers this as a warning with no extra code (but
it is unenforced): +0.

Javascript, no way to idiomatically check: +30.

### Unexpected Variable Mutation 

For example, I pass data to a function, will the data come back the
same as I passed it, or will it have mutated in some way? To prevent
this, in C#, we would idiomatically make a new class and make the
field readonly.

``` csharp
    //123456789012345678901234567890123456789012345678901234567890
    //publicclassT{readonlyn;publicT(i){n=i;}}

    public class T {
        readonly <type> n;

        public T(<type> i) {
            n = i; 
        }
    }
```

C#: +40


In F# we idiomatically would use whatever fit the need most: an
existing class, a let bound primitive, a tuple, etc rather than make a
whole class just for the immutability. F# class fields and values are
immutable by default, so nothing extra for that. +0

### Deadlock prevention

As far as I know, neither C# nor F# provide any way to prevent
deadlocks at the compiler level, and it may not be possible, but it
gets scored: +30.

Javascript is single threaded, and uses a queue for asynchronous
execution responses like from calls to Ajax methods. As such,
deadlocks are not possible by design. Javascript therefore is
restricted in its abilities, but this is about categorizing safety
only: +0.

### Memory Deallocation

C#, F#, and Javascript garbage collectors handle this automatically:
+0

### Stack Overflow Exceptions Caused by Recursion

C# and Javascript have nothing to prevent these, and therefore the
alternative is to write algorithms in a loop construct. It is not
idiomatic to use recursion because of this. While any recursive
algorithm can be expressed in a loop, it can require more size and
possibly a less intuitive algorithm: +30.

F# recursive functions calls are converted into loop constructs by the
compiler automatically: +0



