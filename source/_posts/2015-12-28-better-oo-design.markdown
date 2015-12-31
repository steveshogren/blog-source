---
layout: post
title: "Improving SOLID OOP Design"
date: 2015-12-28 17:43:04 -0500
comments: true
categories: 
- technical skills
---

The SOLID patterns are not sufficient to design a reusable and easy to test code
base. While still useful, a few minor adjustments make a huge difference in the
ability to write truly reusable code.

The following code sample shows a real (but sanitized) class. The dependencies
are in-line. The class clearly violates Single Responsibility Principle by
mixing display logic with business logic.

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
  pattern. By relying on the function signature, we reduce test-only interfaces
  and allow the code to have only the functions it needs, rather than everything
  from the interface.
* **Interface Nouns Before Verbs** - Instead of interfacing "verb" functions and
  injecting them into a "noun" class, put interfaces on "nouns" and pass to
  "verbs" which operate on interfaces only. This allows complete reuse of code.
  Any data structure that "fits" can re-use that behavior.
* **Verbs Operate On Interfaces** - Verbs are not passed to nouns, verbs are
  given interfaces to perform their work.

Here is the same class, broken up for unit testing following the "Better Unit
Testing Design"

{% include_code [Better OOP] lang:csharp betterOOP-better.cs %}

While this inversion of nouns and verbs seems counter to traditional OOP advice,
it is better suited to model the domain. In our example, a real life ```User```
would not know how to convert itself to a ```Customer```. A ```User``` would not
know they had to broadcast their updated status, or that the date is important
to record. It even follows a more English pattern: "I want to convert a User"
instead of, "I want to User convert".
