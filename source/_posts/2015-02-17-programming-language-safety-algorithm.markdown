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
does. If a specific check is compiler enforced, like F#'s Option or
C#'s parameter type enforcement, that is given a -30 to make up for the
lack of unit tests and code exercising needed to run that "path", to
weight the fact that this is "safer" code.  If something needs a
library to function, we will not count the import either, as the
importing the module will have a negligible effect on the code size
and complexity.

If there is a safety feature that is not possible to achieve
programmatically, we will add +30 for a "every change run and debug to
fix" cost.

For example, lets score C# and F#:

## Totals

| Safety Check | C#  | F# | Javascript| Clojure
|--|------------- |------------- |--|
| Null Reference Method/Field Invocation| 19 | -26 | 20 | 6
| Null List Iteration                   | 19 | -30 | 20 | -30
| Putting wrong type into variable      | -30 | -30 | 30 | 13
| Missing List Element                  | 23 | 21 | 22 | 6
| Incorrect Type Casting                | 29 | 23 | 30 | 26
| Passing Wrong Type to Method          | -30 | -30 | 30 | 0
| Calling Missing Method/Field/Function/Variable/Constant | -30 | -30 | 15 | -30
| Missing Enum Dispatch Implementation  | 30  | 0 | 30 | 30
| Unexpected Variable Mutation          | 40 | -30 | 30 | -30
| Deadlock prevention                   | 30 | 30 | 0 | -30
| Memory Deallocation                   | -30 | -30 | -30 | -30
| Stack Overflow Exceptions Caused by Recursion | 30  | -30 | 30 | 14
| Ensure Code Executes When Passed To a Function | -30 | -30 | -30 | +30
|| 70 | -132 | 197 | -25 


### Null Reference Method/Field Invocation

For C# I count 19 characters, so +19. It is possible to use the
ternary operator as well, but a quick StackOverflow search shows a lot
of comments cautioning against using them "too much", so we will count
the traditional "if-else" for the most idiomatic way of checking if
the field is null before using it.

``` csharp
    //1234567890123456789012345678901234567890
    //if(l!=null){}else{}

    if (l != null) {
        <consequent>
    } else {
        <alternative>
    }
```

In F#, it is idiomatic to use Option instead of null (most classes
cannot be made null without special effort). The FSharpx library
function "sequential application" written: (<*>) automatically tests
for Some or None, and applies the consequent only if the value is
Some.

This comes in at 4 characters, for the typical case of null checking
and performing some action with the inner value if it is there or
returning the None if it isn't. Since it is compiler enforced,
subtract -30 for: -26.

``` fsharp
    //1234567890123456789012345678901234567890
    //<*>l

    <consequent> <*> l
```

Javascript the common pattern is to check if something is there comes in
at +20.

``` javascript
    //1234567890123456789012345678901234567890
    //if(l!==null){}else{}

    if (l !== null) {
        <consequent>
    } else {
        <alternative>
    }
```

In Clojure, it is idiomatic to put data or functions inside primitive
data structures like a hashmap. Retrieval and execution would likely
use "get" which checks for nil by default: +6

``` clojure
    ;;1234567890123456789012345678901234567890
    ;;(getl)
    (get l <lookup-keyword> <default-if-missing>)
```

### Null List Iteration

In C#, one would need to perform the same check as above: +19.

In F#, the idiomatic list cannot be made null by the compiler, so
there is no check: -30.

In Javascript, same if check as for missing method: +20.

In Clojure, the default iteration functions: map, reduce, filter all
check and return an empty list if nil, so no need for a check: -30;

### Putting wrong type into variable

C# and F# - Compiler enforced. -30.

Javascript, no real idiomatic way to check, so: +30.

In Clojure, the closest thing to a variable is a let bound function or
an atom, and neither can be annotated by default. A wrapping call to
"instance?" will give a runtime error: +13.

``` clojure
    ;;12345678901234567890123456789012345678901234567890
    ;;(instance?cx)

    (instance? c x)
```

### Missing List Element

C# has +23.

``` csharp
    //12345678901234567890123456789012345678901234567890
    //if(l.Count()>i){}else{}

    if (l.Count() > i) {
        <consequent>
    } else {
        <alternative>
    }
```

F# has +21.

``` fsharp
    //12345678901234567890123456789012345678901234567890
    //ifl.Count()>ithenelse 
    if l.Count() > i then
        <consequent>
    else <alternative>
```
Javascript: +22.

``` javascript
    //12345678901234567890123456789012345678901234567890
    //if(l.length>i){}else{}

    if (l.length > i) {
        <consequent>
    } else {
        <alternative>
    }
```
Clojure's "get" also gets values out of lists by index, so: +6.

``` clojure
    ;;1234567890123456789012345678901234567890
    ;;(geti)

    (get i <list> <default-value>)
```

### Incorrect Type Casting

C# has +29.

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
F# has +23.

``` fsharp
    //1234567890123456789012345678901234567890
    //matchowith|:?Tasm->|_->

    match o with
        | :? T as m -> <consequent>
        | _ -> <alternative>
```

Javascript has no idiomatic way to check: +30.

In Clojure, requires a try/catch block around the primitive cast
function: +26.

``` clojure
    ;;1234567890123456789012345678901234567890
    ;;(try(To)(catchExceptione))

    ;; In this case, T doesn't exist in the core functions,
    ;; but it stands in for double, float, etc.
    (try
      (<T> o)
      (catch Exception e <alternative>))
```

### Passing Wrong Type to Method

Both C# and F# compilers check for this: -30.

Javascript, no idiomatic way to check: +30.

In Clojure, parameters can be annotated with a type, which is checked
at runtime: +0.

### Calling Missing Method/Field/Function/Variable/Constant

Both C# and F# compilers check for this: -30.

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

Clojure, the language checks for this before runtime: -30.

### Missing Enum Dispatch Implementation

For example, using a switch-case in C# to dispatch on an enum
value. If you add a new value, the compiler does nothing, so no
safety. It isn't idiomatically possible to prevent this error, so +30.

In F#, the compiler offers this as a warning with no extra code (but
it is unenforced): +0.

Javascript and Clojure, no way to idiomatically check: +30.

### Unexpected Variable Mutation 

For example, I pass data to a function, will the data come back the
same as I passed it, or will it have mutated in some way? To prevent
this, in C#, we would idiomatically make a new class and make the
field readonly.

C#: +40

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

In F# we idiomatically would use whatever fit the need most: an
existing class, a let bound primitive, a tuple, etc rather than make a
whole class just for the immutability. F# class fields and values are
immutable by default, so nothing extra for that: -30.

In JavaScript, we would have to make the field inside an object, and
use an accessor to expose it.

In Clojure, anything you would pass is immutable, so no check and
enforced by the language before runtime: -30.

### Deadlock prevention

As far as I know, neither C# nor F# provide any way to prevent
deadlocks at the compiler level, and it may not be possible, but it
gets scored: +30.

Javascript is single threaded, and uses a queue for asynchronous
execution responses like from calls to Ajax methods. As such,
deadlocks are not possible by design. Javascript therefore is
restricted in its abilities, but this is about categorizing safety
only: +0.

Clojure's STM and agent model built into the language cannot deadlock
as there are no locks, data is immutable or changes are queued: -30.

### Memory Deallocation

C#, F#, Javascript, and Clojure garbage collectors handle this
automatically: -30.

### Stack Overflow Exceptions Caused by Recursion

C# and Javascript have nothing to prevent these, and therefore the
alternative is to write algorithms in a loop construct. It is not
idiomatic to use recursion because of this. While any recursive
algorithm can be expressed in a loop, it can require more size and
possibly a less intuitive algorithm: +30.

F# recursive functions calls are converted into loop constructs by the
compiler automatically: -30.

Clojure provides a syntax for tail-call opimization, called
loop/recur: +14.

``` clojure
    ;;1234567890123456789012345678901234567890
    ;;(loop[](recur))

    (loop [<params>]
      (recur <args>))
```

### Ensure Code Executes When Passed To a Function

C#, F#, and Javascript all execute code that is passed to a function
normally: -30.

Clojure macros can prevent parameters from executing at all by
rewriting the call, and it is impossible to prevent: +30.




