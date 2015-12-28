---
layout: post
title: "Christmas F# Polymorphism"
date: 2014-12-06 13:37
comments: true
categories: 
- Technical Skills
- f#
type: post
status: publish
published: true
---

One of my favorite things about F# is how it lets you choose how you want
to align your data.

In the previous posts highlighting on
[pattern matching](http://deliberate-software.com/function-pattern-matching/)
and
[inverted polymorphism](http://deliberate-software.com/inversed-polymorphism/)
we covered how pattern matching in F# is safer than ```if```
statements and can replace classes and interfaces for polymorphism. If
you are unfamiliar with these concepts, you might want to skim those
first.

Today, for the 6th day of the
[F# Advent Calendar](https://sergeytihon.wordpress.com/2014/11/24/f-advent-calendar-in-english-2014/)
I wanted to highlight F#'s flexibility in solving the
"[expression problem](http://c2.com/cgi/wiki?ExpressionProblem)".

Let's show the two alternatives, first here is one with interfaces:

``` fsharp
type IChristmasTrees = 
    abstract member Cost : int -> int
    abstract member Colors : unit -> string list
    
type PlasticTree() =
    interface IChristmasTrees with
        member this.Cost(jolly_factor) = (100 * jolly_factor) / 2
        member this.Colors() = ["green";"silver"]
        
type LiveTree() =
    let HEAD_ACHE = 15
    interface IChristmasTrees with
        member this.Cost(jolly_factor) = (jolly_factor + 10) * HEAD_ACHE
        member this.Colors() = ["green";"brown"]
``` 

Now the same functionality using pattern matching and discriminated unions.

``` fsharp
type IChristmasTrees2 =
  | PlasticTree
  | LiveTree

let colors = function
  | PlasticTree -> ["green";"silver"]
  | LiveTree -> ["green";"brown"]

let cost tree jolly_factor =
  match tree with
    | PlasticTree -> (100 * jolly_factor) / 2
    | LiveTree ->
      let HEAD_ACHE = 15
      (jolly_factor + 10) * HEAD_ACHE
``` 

What changes if we want to add a new type of tree? In the class-based
example, adding a new type is quite simple, you only need to edit one
place to find all the definitions regarding the new type.

{% img center /images/new-interfaces.png 'image' 'images' %}

In the pattern matching example, adding a new type requires editing
every single place you created a function that matches on the
type.

{% img center /images/new-pattern-matching.png 'image' 'images' %}

Thankfully, in both cases the compiler gives warnings about missing
functions or matches, so both are equally "safe".

What about changing an existing function or adding a new function? We
now see the opposite behavior. Classes become harder to edit, because
the functions are spread across multiple classes.

{% img center /images/change-interfaces.png 'image' 'images' %}

A pattern matching system is now the easier to modify, each function
only lives in one place. 

{% img center /images/change-pattern-matching.png 'image' 'images' %}

And that is the expression problem! The best thing about F# is that
you get to pick which one is better for each type of data! If you know
a certain type will need new behavior often, but rarely need new
types, use pattern matching. If you know there is a static set of
functions for a set of types, but the type list changes often, maybe
the traditional interfaces and classes makes the most sense.

There is no reason not to mix and match the two ways to handle
polymorphism, so you are free to choose the best representation for
each type of data you have!

Happy F#-filled Festivities!
