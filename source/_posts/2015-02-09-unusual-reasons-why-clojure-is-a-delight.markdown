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

Clojure is a delightful language, but I rarely hear anyone talk about
these simple reasons it is such an unusually delightful language to
use.

# Unit Testing

Clojure is the easiest language to unit test I have ever seen. To
"mock" a function in a test only requires a simple replacement of the
function definition to be replaced. No extraneous interfaces, no
dependency injection, no mocking framework. The built in
```with-redefs``` function will replace any function in any library or
namespace with a new definition.

``` clojure
(defn next-id [connection]
  (+ 1 (get-current-id connection)))

(testing "next-id"
  ;; set get-current-id to be a function that
  ;; always returns 4 and ignores its argument
  (with-redefs [get-current-id (fn [_] 4)]
    (is (= (next-id "fake connection")
           5))))
```

We "mock" the ```get-current-id``` function to always return 4 inside
the scope of the with-redefs. Couldn't be more simple! The binding
only is in scope for code inside and called by the s-expression of the
with-redefs, so no need to re-bind it or anything after the test.

# Amazing Editing

Many arguments have been made over those contentious
parenthesis. While the most powerful use of s-expressions is to easily
allow macros, for the day to day, s-expressions have a very important
use: amazing editing!

With Paredit (available in most editors), it is trivial to select,
move, replace, grow, or shrink any s-expression, string, map, or
list. Languages that don't have a surrounding delimiter for
expressions leave you jumping around with the cursor a whole lot more,
which is a mental burden. Think about it, it is so much easier to
write a parser to select ```(add 1 2)``` than it is for ```add(1,
2)```. The reason being, what if you got the add function out of a
list?  Something like: ```functions[0](1,2)``` in s-expressions still
has those surrounding parens for easy parsing: ```((first functions) 1
2)```. Easy parsing means better tools, and no tool I have seen comes
close to Vim+Paredit for almost speed of thought editing. Paredit also
prevents "unmatched" delimiters of any kind, so everything always
stays auto-balanced.

# Live Attached Repl

Developing a in Clojure against a running version of the program is a
huge bonus for speed. While possible to get similar behavior with an
attached debugger in other languages, the fluidity of an always-on
live attached repl is incredible. At any point, it is possible to run
and rerun any given expression to see the results. More than once, I
have seen an exception caused by calling a certain function. I trace
that function to see the exact inputs that cause the exception, and am
able to quickly run every line of the offending function to see the
source.

If a debugger sheds light on a single line at a time when running an
application, a live attached repl sheds light on the entire
application.

# No-fuss Polymorphism

One of the best claims about "traditional" Java OO is
polymorphism. The ability to make an interface with concrete classes
gives the powerful ability to replace behavior dynamically. A function
that takes an IRunner interface can be given anything that matches
that interface!

While most of the time, in any language with first class functions, it
is possible to achieve a similar effect by passing functions, it is
also possible to get a similar value with something called multimethods.

``` clojure
(defmulti speak :type)
(defmethod speak :dog [d] (str "woof says " (:name d)))
(defmethod speak :cat [c] (str "mow says " (:name c)))

(speak {:type :dog :id 1 :name "Spike"})
;; => "woof says Spike"
(speak {:type :cat :id 2 :name "Mr Cat"})
;; => "mow says Mr Cat"
```

In this example, we use the :type keyword to be the "route" function,
and the two methods fill in two of the possible concrete types. We are
not limited to just a keyword, we can dispatch on anything on the
passed map, for example, the oddness of the id:

``` clojure
(defmulti odds? (comp odd? :id))
(defmethod odds? true [d] "odd id")
(defmethod odds? false [c] "even id")

(odds? {:type :dog :id 1 :name "Spike"})
;; => "odd id"
(odds? {:type :cat :id 2 :name "Mr Cat"})
;; => "even id"
```

While both examples are a bit silly, they should demonstrate the power
of simple polymorphism. But you might think, what about inheritance?
Multimethods allow that too!

# Simple Hierarchical Polymorphism

First, a simple hierarchy of keywords using a built-in function
```derive```.

``` clojure
(derive ::cat ::mammal)
(derive ::dog ::mammal)
(derive ::poodle ::dog)

(isa? ::poodle ::mammal)
;; => true
(isa? ::poodle ::cat)
;; => false
```

With a built in ability to make arbitrary hierarchies, we can have
inherited behavior with even greater flexibility, because we are not
limited to a single type, but rather any number of attributes in the
data.

``` clojure
(defmulti speak :animal)
(defmethod speak ::poodle [d] "chirps")
(defmethod speak ::mammal [c] "breathes")

(speak {:animal ::poodle :id 1 :name "Spike"})
;; => "chirps"
(speak {:animal ::dog :id 2 :name "Mr Dog"})
;; => "breathes"
```

We can see the ::dog keyword doesn't have an explicit speak
implementation, which is fine, because it will then use the next
parent implementation, which returns "breathes".

This is possible because the default equality check of multimethod is
the ```isa?``` function!  Uses of multimethod hierarchies will now
correctly have inherited behavior for complex structures.
