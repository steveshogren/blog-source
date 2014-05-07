---
layout: post
title: "Dependency Injection is a a Bad Design"
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

Every codebase I have seen or heard of that uses dependency injection
for all dependencies in a class also performs strict Test Driven
Development. Why is that?  What about TDD and DI are so linked?

You cannot have TDD in Java/C# without DI.

That is all. If you see a codebase in Java/C# that has ten injected
classes, either through a DI framework or through the constructor,
right there, you have a code base that does heavy TDD. If you are deep
into the TDD culture, you will say, "but it is good design to use DI
everywhere!" Is it really? Do you go through the contortions to do DI
because it makes your code easier to use/reuse/refactor? Or do you do
it because you have to? Can you think of any case where DI made
anything easier?

The TDD proponents realized that you cannot have TDD without DI in
Java/C#, and so they have convinced us that DI is a good design, when
in reality, DI is a hack because Java/C# are so weak.

For example, how would you

