---
layout: post
title: "Better OOP Design"
date: 2015-12-28 17:43:04 -0500
comments: true
categories: 
- technical skills
---

Unit testing in C# forces a functional program architecture. The architecture
and design of a unit-tested C# codebase will have more in common with a Lisp
codebase than with a Java codebase. While this may seem unwanted, it actually is
a indication of a design that is easier to test and understand.

Let's first agree on the terms. Pulled from the Wikipedia page on [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming#Encapsulation).

* **Encapsulation** - When a class disallows calling code from accessing
  internal object data and forces access through methods only.
* **Composition** - Objects can contain other objects in their instance
  variables; this is known as object composition.
* **Inheritance** - This allows classes to be arranged in a hierarchy that
  represents "is-a-type-of" relationships. All the data and methods available to
  the parent class also appear in the child class with the same names.
* **Polymorphism** - Subtyping, a form of polymorphism, is when calling code can
  be agnostic as to whether an object belongs to a parent class or one of its
  descendants.

The following code sample shows a real (but sanitized) class that was not unit
tested. The dependencies are in-line, since there is no need to replace them for
polymorphism or unit test mocking.

{% include_code [Normal OOP] lang:csharp betterOOP-normal.cs %}

This class is very difficult to test. Code that is hard to test also is harder
to reuse. Consider the function ```MakeDropDownHtml```. It cannot be reused
because it is inside the User class. It is also hard to test, because it
requires setting up the User class with correct fields. Because the fields are
encapsulated, both paths of ```MakeDropDownHtml``` can only be tested by also
called ```ConvertToCustomer```, which directly appears to broadcast a message.
The tests become more complicated and harder to get right.

The typical response to the above code is to inject the "verbs" via an
interface. This produces very little benefit for three main reasons. One,
interfaces become primarily used for unit testing, instead of for actual
polymorphism. Two, neither function inside of the ```User``` class can be
reused. Three, we've allowed testing concerns to mix in with our production
code. Instead of polymorphism and code reuse, we have tight coupling and
polluted code.

{% include_code [OOP With DI] lang:csharp betterOOP-DI.cs %}

Better Unit Testing Design

* **Depend on Functions Over Interfaces** - Replace "verb" interfaces with
  function signatures, exampled in the
  [SimpleMock](http://deliberate-software.com/simplemock-unit-test-mocking/)
  pattern. By relying on the function signature, we reduce test-only interfaces.
* **Interface Nouns Over Verbs** - Instead of interfacing "verb" functions and
  injecting them into a "noun" class, put interfaces on "nouns" and pass to
  "verbs" which operate on interfaces only. This allows enormous reuse of code.
  Any data structure that "fits" can re-use that behavior.

Here is the same class, broken up for unit testing following the "Better Unit
Testing Design"

{% include_code [Better OOP] lang:csharp betterOOP-better.cs %}

While this inversion of nouns and verbs seems counter to traditional OOP advice,
it is better suited to model the domain. In our example, a real life ```User```
would not know how to convert itself to a ```Customer```. A ```User``` would not
know they had to broadcast their updated status, or that the date is important
to record. It even follows a more English pattern: "I want to convert a User"
instead of, "I want to User convert".
