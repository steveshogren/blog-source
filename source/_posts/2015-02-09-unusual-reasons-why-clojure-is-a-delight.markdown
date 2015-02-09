---
layout: post
title: "Unusual Reasons Why Clojure Is a Delight"
date: 2015-02-09 11:36
comments: false
categories: 
- Clojure
- Technical Skills
- Lisp
- Unit Testing
tags:
- programming
categories: 
---

Clojure is a delightful language.

# Unit Test Mocking

Clojure is the easiest language to unit test I have ever seen. To mock
a function in a test only requires a simple replacement of the
function definition. The ```with-redefs``` function will replace any
function with a new definition.

``` clojure
(defn next-id [connection]
  (+ 1 (get-current-id connection)))

(testing "next-id"
  (with-redefs [get-current-id (fn [_] 4)]
    (is (= (next-id nil) 5))))
```

We "mock" the ```get-current-id``` function to always return 4 inside
the scope of the with-redefs. Couldn't be more simple!

# Amazing Editing

Many arguments have been made over these contentious
parenthesis. While the most powerful use of s-expressions is to easily
allow macros, for the day to day, s-expressions have a very important
use: amazing editing!

For example, I define a function, and want to name some of the inner
expressions for clarity.

With Paredit (available in most editors), it is trivial to select,
move, replace, grow, or shrink any s-expression. Languages that don't
have a surrounding delimiter leave you jumping around with the cursor
a whole lot more, which is a mental burden.

# Live Attached Repl

Developing a in Clojure against a running version of the program is a
huge bonus for speed. While possible to get similar behavior with an
attached debugger in other languages, the fluidity of an always-on
live attached repl is incredible. At any point, it is possible to run
and rerun any given s-expression to see the results. More than once, I
have seen an exception caused by calling a certain function. I trace
that function to see the exact inputs that cause the exception, and am
able to quickly run every line of the offending function to see the
source.

If a debugger sheds light on a single line at a time when running an
application, 
