---
layout: post
title: "The Courage To Learn"
date: 2014-07-26 11:46
comments: true
categories: 
- Technical Skills
type: post
---

"It's my first job, what book should I read first?"

A few developers I am mentoring lately were curious about what book to
read first. Even mid and senior level developers I've know sometimes
struggle with this question.

If you want to be truly great, you have to read technical books and
white papers. You could figure the content out yourself from first
principles, but you will be about 50 years behind your peers.

But, you will never learn it all. You cannot possibly read all the
books, white papers, and open source projects.

Just like with adding new features to a project, you should prioritize
your learning into a list.

I'd start by getting into the mindset that you will need roughly a
decade and tens of thousands of high-value hours to become a master
programmer. To be able to get that many high-value hours, you will
need to carefully select your jobs, and constantly be learning new
things that actually make you a better developer holistically.

## Languages ##

I agree with other developers who assert that a language is not worth
learning unless it teaches you something new and mind-expanding. Maybe
early on you want to switch stacks to get an awesome high-value
job. Well, then, by all means, learn the new stack. 

If you want to follow the extremely good advice of others and learn
one new programming language a year, make each one count. For example,
if you are a Ruby guy, it is safe to say you will learn nothing of
really any mind-expanding value if you try to learn PHP, Python,
JavaScript, or Perl.

Same for the family of Java, C#, or VB.NET. One of each of those is
plenty.

Instead shoot for languages that will really beef up your thought
process. I like the advice given by Peter Norvig:

"Learn at least a half dozen programming languages. Include one
language that supports class abstractions (like Java or C++), one that
supports functional abstraction (like Lisp or ML), one that supports
syntactic abstraction (like Lisp), one that supports declarative
specifications (like Prolog or C++ templates), one that supports
coroutines (like Icon or Scheme), and one that supports parallelism
(like Sisal)."

I would add to that my own personal list: a language that forces you
to use monands for controlling side-effects (Haskell), and a language
that allows for dependent types (Idris).

If you are saying, "wow, in Python, you have to put a colon at the end
of the function signature line, unlike in Ruby, that blows my mind",
chances are you are getting a very low return for your investment of
time.

## Frameworks ##

These days, I would say almost no framework is going to expand your
mind in a way that is worth the effort to learn it. Some very select
frameworks can cause you to think of a problem in a novel way and thus
expand your mind (off the top of my head: React.js, Core.Async, Akka)
but those are very few and far between.

Obviously, in production use, frameworks have their place, and they
can provide a immense boost to your day-to-day productivity and
safety, but very few overall will expand your mind in such a way that
would make you better at the craft. It is not hard to reason why. A
framework can only do what is possible in the language. If the
language is only so powerful, the framework cannot be more powerful
than that. You will be using tools that you could've written
yourself. Hopefully, those tools will be safer and save you a lot of
time, but saved time only can earn you more money, not actually cause
you to better understand programming.

## Paradigms ##

It is fashionable these days to get into functional programming. If
you haven't learned a language that supports a functional paradigm, I
highly recommend that as a good place to start. That being the case,
don't forget to add a logic, a literate, and a declarative programming
language to your list too.

## Libraries ##

While it is important to be aware of the libraries in your space, I
would say these often provide the least mind-expanding opportunities. A
library, much like a framework, is usually constrained by the power of
the language. So in most languages, they are just convenience
abstractions at or below the same abstraction layer as the rest of
your code. Certainly, I would never consider doing my day-to-day work
without the full power of available libraries to available, but many
times I have found myself fighting with a library that doesn't do
exactly what I need, which can be a waste of time.

## "Meta" books ##

A vast number of books exist that attempt to impart something of a
"mindset" for the developer. Usually, the author is retelling his
experiences, which can be entertaining, but of limited reuse. The best
meta books are those that use actual research and data to try to
explain our industry. Books like Peopleware, Code Complete, and
Pragmatic Programmer are great in this regard. These best books can
cause you to see the creation of software artifacts with a totally
different light: e.g. I remember first reading about using a
programming language to generate automatically the source files for a
given project. At the time for me, it was revolutionary.

It takes courage to step outside your comfort zone and learn something new.


