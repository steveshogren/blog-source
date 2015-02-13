---
layout: post
title: "Six Unusual Reasons Why Clojure Is a Delight"
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
published: true
---

Clojure is a delightful language, and here are six uncommonly
discussed reasons why.

## 1 - Unit Testing

Clojure is the easiest language to unit test I have ever
seen. "Mocking" a function in a test only requires a simple
replacement of the function definition. No extraneous interfaces, no
dependency injection, no mocking framework.  The built in function ```with-redefs```
will replace any function in any library or
namespace with a new definition.

``` clojure
(defn next-id [connection]
  (+ 1 (get-current-id connection)))

(testing "next-id"
  ;; bind get-current-id to a function that always returns 4 
  (with-redefs [get-current-id (fn [_] 4)]
    (is (= (next-id "fake connection")
           
```

We "mock" the ```get-current-id``` function to always return 4 inside
the scope of ```with-redefs```. Couldn't be more simple! The binding
only is in scope for code inside and called by the s-expression of the
with-redefs, so no need to re-bind it or anything after the test.

## 2 - Amazing Editing

Many arguments have been made over those contentious
parenthesis. While the most powerful use of s-expressions is to easily
allow macros, for the day to day, s-expressions have a very important
use: amazing editing!

{% img center http://danmidwood.com/assets/animated-paredit/paredit-slurp-barf.gif 'image' 'images' %}

With ParEdit (available in most editors), it is trivial to select,
move, replace, grow, or shrink any s-expression, string, map, or
list. [This animated guide](http://danmidwood.com/content/2014/11/21/animated-paredit.html)
shows excellent examples of ParEdit that are too
complex to explain here.

Languages that don't have a surrounding delimiter for expressions
leave you jumping around with the mouse and arrow keys a whole lot more.
Because it is so much easier to write a parser to select ```(add 1 2)```
than it is for ```add(1, 2)```, the tooling is so much better.

No local editing tool I have seen comes close to Vim with ParEdit for
effective editing. 

## 3 - Live Attached Repl

Developing in Clojure against a running version of the program is a
huge bonus for development speed. While possible to get similar
behavior with an attached debugger in other languages, the fluidity of
an always-on live attached repl is incredible. At any point, it is
possible to run and rerun any given expression to see the
results. More than once, I have seen an exception caused by calling a
certain function. I trace that function to see the exact inputs that
cause the exception, and am able to quickly run every line of the
offending function to see the source.

If a debugger sheds light on a single line at a time when running an
application, a live attached repl sheds light on the entire
application.

## 4 - No-fuss Polymorphism

One of the best claims about "traditional" Java OO is
polymorphism. The ability to make an interface with concrete classes
gives the powerful ability to replace behavior dynamically.

While most of the time, in any language with first class functions, it
is possible to achieve a similar effect by passing functions, it is
also possible to get a similar value with something called multimethods.

``` clojure
(defmulti speak :animal)
(defmethod speak :dog [this] (str "woof says " (:name this)))
(defmethod speak :cat [this] (str "mow says " (:name this)))

(speak {:animal :dog :id 1 :name "Spike"})
;; => "woof says Spike"
(speak {:animal :cat :id 2 :name "Mr Cat"})
;; => "mow says Mr Cat"
```

In this example, we use the ```:animal``` keyword to be the "route" function,
and the two methods fill in two of the possible concrete types. We are
not limited to just a keyword, we can dispatch on anything on the
passed map, for example, the oddness of the id:

``` clojure
(defmulti odds? (comp odd? :id))
(defmethod odds? true [d] "odd id")
(defmethod odds? false [c] "even id")

(odds? {:animal :dog :id 1 :name "Spike"})
;; => "odd id"
(odds? {:animal :cat :id 2 :name "Mr Cat"})
;; => "even id"
```

While both examples are a bit silly, they should demonstrate the power
of simple polymorphism. But you might think, what about inheritance?
Multimethods allow that too!

## 5 - Simple Multiple Inheritance

We don't build inheritance on a single type, but on a hierarchy of
keywords. Those can be dispatched on just like any other
keyword. First, an example hierarchy of keywords using the built-in
functions ```derive``` and ```isa?```. These ```::``` keywords are
namespaced, which prevents collisions.

``` clojure
(derive ::cat ::mammal)
(derive ::dog ::mammal)
(derive ::dog ::hairy)
(derive ::poodle ::dog)

(isa? ::poodle ::dog)
;; => true
(isa? ::poodle ::mammal)
;; => true
(isa? ::poodle ::hairy)
;; => true
(isa? ::poodle ::cat)
;; => false
(isa? ::mammal ::hairy)
;; => false
```

A ```::dog``` is-a ```::mammal``` and is-a ```::hairy```, the
classical diamond problem (without the common ancestor, which is
possible, but unneeded for the example).

``` clojure
(defmulti speak :animal)
(defmethod speak ::poodle [d] "chirps")
(defmethod speak ::mammal [c] "breathes")

(speak {:animal ::poodle :id 1 :name "Spike"})
;; => "chirps"
(speak {:animal ::dog :id 2 :name "Mr Dog"})
;; => "breathes"

(defmulti shave :animal)
(defmethod shave ::poodle [d] "shivers")
(defmethod shave ::hairy [c] "stuggles")
(defmethod shave ::mammal [c] "maybe cant be shaved!")
(prefer-method shave ::hairy ::mammal)

(shave {:animal ::poodle :id 1 :name "Spike"})
;; => "shivers"
(shave {:animal ::dog :id 2 :name "Rufs"})
;; => "stuggles"
```

We can see the ```::dog``` keyword doesn't have an explicit speak or shave
implementation, which is fine, because it will then use the "preferred"
parent implementation, which returns "breathes" for speak or
"struggles" for shave. Since we can have a keyword be the child of
multiple parents, we get a multiple inherited behavior, where the
preferred match is the one returned.

This is possible because the default equality check of multimethod is
the ```isa?``` function. Because of this, uses of multimethod
hierarchies can have inherited behavior for complex structures.

## 6 - Mostly Monadic

Languages like Haskell and F# have tools like the maybe monad that add
safety to operations. For example, using the maybe monad can
completely prevent null reference exceptions by making you ensure you
"unpack" the value every time.

How does Clojure address this? In a typical Clojure way, which gives
80% of the value for 20% of the effort, Clojure has a great
relationship with empty lists and nil. Rather than wrapping every
value that is nullable in a type, Clojure's default functions all
_mostly_ deal with nil and empty without throwing exceptions. For
example:

``` clojure
(get {:id 5} :id)
;; => 5
(get nil :id)
;; => nil

(first [3 2 1])
;; => 3
(first nil)
;; => nil
(count nil)
;; => 0
```

This allows functions to be chained without fear that along the way a
nil will get returned.

Since for most of the core functions are smart like this, it is
possible to gain much of the value and safety of monads without most
of the hassle. Ultimately, a more rich type system would allow for
custom types which can be domain specific, but in day-to-day working,
primitive safety is still a huge win.

## Conclusion

These are a few simple features that keep me coming back to Clojure,
even from languages like F# and Haskell. While Clojure is a bit more
wordy than the ML family, and not as type safe, the simplicity of
these features keep me coming back for more!
