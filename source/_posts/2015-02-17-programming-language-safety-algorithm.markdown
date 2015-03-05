---
layout: post
title: "Programming Language Safety Algorithm"
date: 2015-02-17 14:13
comments: true
categories: 
---

I think the time has come for a standard programming language scoring
algorithm that allows us to discuss the relative merits and, more
importantly, associated costs of various languages and idioms.

Rather than focus on what is _possible_ with a language, I will
instead suggest we focus on what is typically idiomatic. For example,
if it is possible to achieve a level of safety in a language but by
doing something uncommon, that should not be counted. 

This is not about "whose language is better".

To score a language, simply figure out how many characters it costs to
"prevent" a certain type of error, and add that to the
total. Newlines, spaces, and tabs do not count, but all other
punctuation does. If a specific check is compiler enforced, like F#'s
Option or C#'s parameter type enforcement, that is given a -30 to make
up for the lack of unit tests and code exercising needed to run that
"path". Do not count import lines either, as the importing the module
will have a negligible effect on the code size and complexity.

If there is a safety feature that is not possible to achieve
programmatically, we will add +30 for a "every change run and debug to
fix" cost.

For example:


<div ng-app="TableApp">
<div ng-controller="TableCtrl">


Enforced Score:
{% raw %} {{ enforcedScore }} {% endraw %}
<input ng-model="enforcedScore" type="range" min="0" max="50" />

Show Weights <input type="checkbox" ng-model="showWeights" />
<p class="lead">
<table>
<tr>
<th>Safety Check (* indicates enforced)</th>
<th></th>
<th ng-repeat="lang in languages">
{% raw %} {{ lang.name }} {% endraw %}
</th>
</tr>
<tr ng-repeat="check in langChecks" score-row name="check.name" language-fn="check.fn"></tr>
<tr><td>Totals</td>
<td></td>
<td ng-repeat="lang in langTotals">
    {% raw %} {{ lang }} {% endraw %}
</td>
</tr>
</table>
<h2>Select Language:<select id="lang"><option value="csharp">C#  </option>
<option value="fsharp">F#  </option>
<option value="clojure">Clojure  </option>
<option value="javascript">JavaScript  </option>
</select>
</h2>
<div id="csharp"><h2>C#</h2>
<h3> Null Reference Method/Field Invocation</h3>
<p>It is possible to use the ternary operator as well, but a quick StackOverflow search shows a lot of comments cautioning against using them &#39;too much&#39;, so we will count the traditional &#39;if-else&#39; for the most idiomatic way of checking if the field is null before using it. Score: 19 </p>

``` csharp
//1234567890123456789012345678901234567890
//if(l!=null){}else{}

if (l != null) {<!consequent!>} else {<!alternative!>}
```

<h3> Null List Iteration</h3>
<p>Same check as for a null field. Score: 19 </p>

``` csharp
//1234567890123456789012345678901234567890
//if(l!=null){}else{}

if (l != null) {<!consequent!>} else {<!alternative!>}
```

<h3> Putting wrong type into variable</h3>
<p>Compiler Enforced. -30 </p>

<h3> Missing List Element </h3>
<p> Score: 23 </p>

``` csharp
//1234567890123456789012345678901234567890
//if(l.Count()>i){}else{}

if (l.Count() > i) {<!consequent!>} else {<!alternative!>}
```

<h3> Incorrect Type Casting</h3>
<p> Score: 29 </p>

``` csharp
//1234567890123456789012345678901234567890
//varm=oasT;if(m!=null){}else{}

var m = o as T; if (m != null) {<!consequent!>} else {<!alternative!>}
```

<h3> Passing Wrong Type to Method</h3>
<p>Compiler Enforced. -30 </p>

<h3> Calling Missing Method/Field/Function/Variable/Constant</h3>
<p>Compiler Enforced. -30 </p>

<h3> Missing Enum Dispatch Implementation</h3>
<p>For example, using a switch-case in C# to dispatch on an enum value. If you add a new value, the compiler does nothing, so no safety. It isn&#39;t idiomatically possible to prevent this error. 30 </p>

<h3> Unexpected Variable Mutation </h3>
<p>For example, I pass data to a function, will the data come back the same as I passed it, or will it have mutated in some way? To prevent this, in C#, we would idiomatically make a new class and make the field readonly. Score: 40 </p>

``` csharp
//1234567890123456789012345678901234567890
//publicclassT{readonlyn;publicT(i){n=i;}}

public class T {readonly <!type!> n; public T(<!type!> i) {n = i;}}
```

<h3> Deadlock prevention</h3>
<p>As far as I know, there is provide any way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored. 30 </p>

<h3> Memory Deallocation</h3>
<p>Handled by garbage collector. -30 </p>

<h3> Stack Overflow Exceptions Caused by Recursion</h3>
<p>No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm. 30 </p>

<h3> Ensure Code Executes When Passed To a Function</h3>
<p>Compiler Enforced. -30 </p>
</div>
<div id="fsharp"><h2>F#</h2>
<h3> Null Reference Method/Field Invocation</h3>
<p>In F#, it is idiomatic to use Option instead of null (most classes cannot be made null without special effort). The FSharpx library function &#39;sequential application&#39; written: (&lt;*&gt;) automatically tests for Some or None, and applies the consequent only if the value is Some, otherwise returning a default alternative of None. Score: -26 </p>

``` fsharp
//1234567890123456789012345678901234567890
//<*>l

<!consequent!> <*> l
```

<h3> Null List Iteration</h3>
<p>In F#, the idiomatic list cannot be made null by the compiler, so there is no check. -30 </p>

<h3> Putting wrong type into variable</h3>
<p>Compiler Enforced. -30 </p>

<h3> Missing List Element </h3>
<p> Score: 21 </p>

``` fsharp
//1234567890123456789012345678901234567890
//ifl.Count()>ithenelse

if l.Count() > i then <!consequent!> else <!alternative!>
```

<h3> Incorrect Type Casting</h3>
<p> Score: -7 </p>

``` fsharp
//1234567890123456789012345678901234567890
//matchowith|:?Tasm->|_->

match o with | :? T as m -> <!consequent!> | _ -> <!alternative!>
```

<h3> Passing Wrong Type to Method</h3>
<p>Compiler Enforced. -30 </p>

<h3> Calling Missing Method/Field/Function/Variable/Constant</h3>
<p>Compiler Enforced. -30 </p>

<h3> Missing Enum Dispatch Implementation</h3>
<p>The compiler offers this as a warning with no extra code (but it is not enforced). 0 </p>

<h3> Unexpected Variable Mutation </h3>
<p>In F# we idiomatically would use whatever fit the need most: an existing class, a let bound primitive, a tuple, etc rather than make a whole class just for the immutability. F# class fields and values are immutable by default, so nothing extra. 0 </p>

<h3> Deadlock prevention</h3>
<p>As far as I know, there is provide any way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored. 30 </p>

<h3> Memory Deallocation</h3>
<p>Handled By Garbage Collector. -30 </p>

<h3> Stack Overflow Exceptions Caused by Recursion</h3>
<p>F# recursive functions calls are converted into loop constructs by the compiler automatically. -30 </p>

<h3> Ensure Code Executes When Passed To a Function</h3>
<p>Compiler Enforced. -30 </p>
</div>
<div id="clojure"><h2>Clojure</h2>
<h3> Null Reference Method/Field Invocation</h3>
<p>In Clojure, it is idiomatic to put data or functions inside primitive data structures like a hashmap. Retrieval and execution would likely use &#39;get&#39; which checks for nil by default. Score: 6 </p>

``` clojure
;;1234567890123456789012345678901234567890
;;(getl)

(get l <!lookup-keyword!> <!default-if-missing!>)
```

<h3> Null List Iteration</h3>
<p>In Clojure, the default iteration functions: map, reduce, filter all check and return an empty list if nil, so no need for a check. -30 </p>

<h3> Putting wrong type into variable</h3>
<p>In Clojure, the closest thing to a variable is a let bound function or an atom, and neither can be annotated by default. A wrapping call to &#39;instance?&#39; will give a runtime error. Score: 13 </p>

``` clojure
;;1234567890123456789012345678901234567890
;;(instance?cx)

(instance? c x)
```

<h3> Missing List Element </h3>
<p>Clojure&#39;s &#39;get&#39; also gets values out of lists by index. Score: 6 </p>

``` clojure
;;1234567890123456789012345678901234567890
;;(geti)

(get i <!list!> <!default-value!>)
```

<h3> Incorrect Type Casting</h3>
<p>Requires a try/catch block around the primitive cast function. Score: 25 </p>

``` clojure
;;1234567890123456789012345678901234567890
;;(try(o)(catchExceptione))

(try (<!T!> o) (catch Exception e <!alternative!>))
```

<h3> Passing Wrong Type to Method</h3>
<p>In Clojure, parameters can be annotated with a type, which is checked at runtime:  0 </p>

<h3> Calling Missing Method/Field/Function/Variable/Constant</h3>
<p>Clojure, the language checks for this before runtime. -30 </p>

<h3> Missing Enum Dispatch Implementation</h3>
<p>No way to idiomatically check. 30 </p>

<h3> Unexpected Variable Mutation </h3>
<p>In Clojure, anything you would pass is immutable, so no check and enforced by the language before runtime. -30 </p>

<h3> Deadlock prevention</h3>
<p>The STM and agent model built into the language cannot deadlock, and data is immutable or changes are queued. -30 </p>

<h3> Memory Deallocation</h3>
<p>Handled by garbage collector. -30 </p>

<h3> Stack Overflow Exceptions Caused by Recursion</h3>
<p>Clojure provides a syntax for tail-call opimization, called loop/recur. Score: 15 </p>

``` clojure
;;1234567890123456789012345678901234567890
;;(loop[](recur))

(loop [<!params!>] (recur <!args!>))
```

<h3> Ensure Code Executes When Passed To a Function</h3>
<p>Clojure macros can prevent parameters from executing at all by rewriting the call, and it is impossible to prevent. 30 </p>
</div>
<div id="javascript"><h2>JavaScript</h2>
<h3> Null Reference Method/Field Invocation</h3>
<p>Javascript the common pattern is to check if something is there with an OR statement. Score: 20 </p>

``` javascript
//1234567890123456789012345678901234567890
//if(l!==null){}else{}

if (l !== null) {<!consequent!>} else {<!alternative!>}
```

<h3> Null List Iteration</h3>
<p>Same check as for a null field. Score: 20 </p>

``` javascript
//1234567890123456789012345678901234567890
//if(l!==null){}else{}

if (l !== null) {<!consequent!>} else {<!alternative!>}
```

<h3> Putting wrong type into variable</h3>
<p>No real idiomatic way to check. 30 </p>

<h3> Missing List Element </h3>
<p> Score: 22 </p>

``` javascript
//1234567890123456789012345678901234567890
//if(l.length>i){}else{}

if (l.length > i) {<!consequent!>} else {<!alternative!>}
```

<h3> Incorrect Type Casting</h3>
<p>No real idiomatic way to check. 30 </p>

<h3> Passing Wrong Type to Method</h3>
<p>No real idiomatic way to check. 30 </p>

<h3> Calling Missing Method/Field/Function/Variable/Constant</h3>
<p>It is common to use the OR statement to get a field OR something else if it isn&#39;t there or empty. Score: 18 </p>

``` javascript
//1234567890123456789012345678901234567890
//t.f||<alternative>

t.f || <alternative>
```

<h3> Missing Enum Dispatch Implementation</h3>
<p>No way to idiomatically check. 30 </p>

<h3> Unexpected Variable Mutation </h3>
<p>The Immutabile.js library offers a simple set of tools for adding in immutability, under the Immutabile namespace. Score: 15 </p>

``` javascript
//1234567890123456789012345678901234567890
//Immutable.Map()

Immutable.Map(<!object!>)
```

<h3> Deadlock prevention</h3>
<p>Javascript is single threaded, and uses a queue for asynchronous execution responses like from calls to Ajax methods. As such, deadlocks are not possible by design. Javascript therefore is restricted in its abilities, but this is about categorizing safety only. 0 </p>

<h3> Memory Deallocation</h3>
<p>Handled By Garbage Collector. -30 </p>

<h3> Stack Overflow Exceptions Caused by Recursion</h3>
<p>No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm. 30 </p>

<h3> Ensure Code Executes When Passed To a Function</h3>
<p>Compiler Enforced. -30 </p>
</div>
</p>
</div>
</div>

