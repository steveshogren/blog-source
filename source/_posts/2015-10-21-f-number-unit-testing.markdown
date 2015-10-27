---
layout: post
title: "F# Unit Testing with SimpleMock"
date: 2015-10-21 16:41
comments: true
categories: 
- Technical Skills
---

If you are considering using F#, you might be curious how to handle unit test
mocking, especially if you want to use both modules and classes. In a language
like C# or Java, the common method is to a DI container or handmade constructor
injection on a class. These "entry points" allow for a unit test to replace a
real dependency with a test-only replacement.

I previously posted an example that shows a much simpler way to inject
dependencies called the [SimpleMock pattern](http://deliberate-software.com/simplemock-unit-test-mocking/). The SimpleMock pattern can also be
used in F#, even if you are only using modules.

## SimpleMock in F# Modules

We will assume you are mocking inside a module and not a class. Mocking inside
an F# class would look much the same as it does in C#, which we showed in the
SimpleMock post. Here is a sample program that does some work and persists the
results.

``` fsharp
let addAndSave x y =
  let sum = x + y
  DBModule.saveSum sum
  sum
``` 

To apply the SimpleMock pattern, we can use argument currying by adding a simple
function wrapper.

``` fsharp
let addAndSave' saveSum x y = 
  let sum = x + y
  saveSum sum
  sum
let addAndSave = addAndSave' DBModule.saveSum

// Test code
let addAndSave_Test =
  let calledVar = ref 0
  let result = addAndSave' (fun sum -> calledVar := sum) 1 2
  Assert.AreEqual(3, result)
  Assert.AreEqual(3, !calledVar)
``` 

We started by renaming the ```addAndSave``` function with a trailing ```'```. We
created a new ```addAndSave``` that calls ```addAndSave'``` with the correct
dependency for the first argument, leaving the rest of the arguments to be
called later. Currying is what allows this ability. The new ```addAndSave```
function only needs the ```x``` and ```y``` parameters. At test time, we called ```addAndSave'```, passing in the needed dependency, but using a lambda as the
"fake". The injection is as close to the dependency use as possible!

## Bonus: SimpleMock Fake Helper

The earlier replacement for DBModule.saveSum is a bit complex, and it does not
show us how many times the fake was called. We can easily make a helper that
takes parameters and returns them when called, along withe count of times it was
called.

``` fsharp
type TestFakeResults() =
  member val timesCalled = 0 with get,set
  member val args: obj list = [] with get,set

let makeFake_OneArg () =
  let results = new TestFakeResults()
  let fake = (fun p1 ->
                  results.args <- p1 :: results.args
                  results.timesCalled <- results.timesCalled + 1
                  ())
  (fake, results)
```

The above code might be hard to comprehend at first! We have made a generic
helper that can create any single argument fake we need. We return a tuple,
containing the fake lambda and an instance of ```TestFakeResults```. The fake
lambda will populate the ```TestFakeResults```, which we can access in the test
via the second arg of the tuple.

We can now re-write the previous test using ```makeFake_OneArg```:

``` fsharp
// Test code
let addAndSave_Test =
  let (fakeSave, fakeSaveCalling) = makeFake_OneArg()
  let result = addAndSave' fakeSave 1 2
  Assert.AreEqual(3, result)
  Assert.AreEqual(3, fakeSaveCalling.args.[0])
  Assert.AreEqual(1, fakeSaveCalling.timesCalled)
``` 

The TestFakeResults can return information about the way it was called,
including the list of all arguments. If we felt we needed the extra
expressiveness, we could also use a mocking library like RhinoMocks or Moq. The
TestFakeResults and its constructor are not essential to the pattern. The most
important part is learning to unit test in F# with confidence.

# Double Bonus: When to Use a Class Instead of a Record

When I first wrote this post, I used a record instead of a class for the ```TestFakeResults``` type. If you have been bitten by the functional programming bug,
you might have wondered at my usage of a mutable class. Here are two alternates
of ```makeFake_OneArg``` which use records. You can probably see why I switched to a class:

``` fsharp
type TestFakeResults = {timesCalled:int, args obj list}

// Using Record Alternate 1
let makeFake_OneArg_RecordAlternate1 () = 
  let t = ref 0
  let a : obj list ref = ref []
  let fake = (fun p1 ->
                  a := p1 :: !a
                  t := !t + 1
                  ())
  (fake, (fun () ->
                {TestFakeRecord.timesCalled = !t;
                 args = !a}))

// Using Record Alternate 2
let makeFake_OneArg_RecordAlternate2 () = 
  let result = ref {TestFakeRecord.timesCalled = 0; args = []}
  let fake = (fun p1 ->
              result := {timesCalled = (!result).timesCalled + 1;
                         args = p1 :: (!result).args}
              ())
  (fake, (fun () -> !result))
```

The only way to use a record is to delay its construction via a lambda which
must be executed by the test code. Both are complex: what we need is a mutable
data structure which we can access via a reference. A record is not that. We can
approximate it using tricks, but ultimately I find both alternatives to be too
complex to justify their use. Sometimes a mutable data structure is the best
choice to solve your problem efficiently. The power of F# is that it gives us
the ability to choose the best tool for the job: records for immutability,
classes for mutability.
