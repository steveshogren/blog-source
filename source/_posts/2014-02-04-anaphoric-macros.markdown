---
layout: post
title: "Dangerous Clojure Macros"
date: 2014-02-04 16:56
comments: false
categories: 
---

Clojure allows you to write macros that mutate the world.


So what?


I'll walk you through it. What is the result of this expression?

``` clojure
(let [x 1]
  (let [x 4]
    x)
  x)
```
The result is 1, right? That was easy. How about this?

``` clojure
(defn addTen [x]
  (+ 10 x))

(let [z 1]
  (addTen (inc z)))

```
The let returns 12. What does x look like inside addTen? It is bound to 2.


What does this return?
Clojure macros by default are "hygenic", which means they cannot mutate bindings.

``` clojure
(defmacro addTen [x]
  `(let [z 100]
     (+ 10 ~x)))
(let [z 1]
   (addTen (inc z)))
;; => clojure.lang.Compiler$CompilerException: java.lang.RuntimeException: Can't let qualified name: user/z,
```

Clojure prevents you from accidentally shadowing a value by throwing such an exception.
This means that it is hygenic by default, but it is possible to "break out" and make it unhygenic.
Do force a value to shadow another, you simply have to give it the prefix ~'
Here is the same macro, only with z replaced by ~'z


``` clojure
(defmacro addTen [x]
  `(let [~'z 100]
     (+ 10 ~x)))

(let [z 1]
   (addTen (inc z)))
```
This returns 111.


Here it is with the macro expanded:

``` clojure
(let [z 1]
   (let [z 100]
     (+ 10 (inc z))))
```

Now the 111 makes more sense.
Unhygenic macros let you shadow bindings.
In this case, we shadowed [z 1] with [z 100].


Why would you ever want to do this?
Lets look at a real example.


I find prefix notation to be frustrating when I am writing a lot of arithmetic.

``` clojure
(- 1 (+ (/ 2 value) 1))
```

I constantly have to scan my eyes back and forth, and it makes it easy to loose track of an expression.
I wanted a syntax that was similar to the threading macro, but where I could place the previous result at arbitraray locations.

``` clojure
(_> value (/ 2 _) (/ 10 _) (- _ 1))
```
This is much easier for my western eyes to read, it replaces the previous "inside out" style with a more natural left to right.
To accomplish this syntax, we need a macro that can wrap every s-expression inside a single let binding using the previous value.
Since Clojure allows rebinding a value inside a single let, we can have our macro output something like this:

``` clojure
(let [_ value 
      _ (/ 2 _)
      _ (/ 10 _)
      _ (- _ 1)]
  _)
```
Which, with unhygenic macros, is easy to do:

``` clojure
(defmacro _> [init & body]
  `(let [~'_ ~init
         ~@(mapcat (fn [x] `[~'_ ~x])
                   body)]
     ~'_))
```
This takes the initial value as init, and the "rest" as the body.
For each element in the body, we bind its result to ~'_.

