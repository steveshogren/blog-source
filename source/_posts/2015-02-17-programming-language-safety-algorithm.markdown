---
layout: post
title: "Programming Language Safety Algorithm"
date: 2015-02-17 14:13
comments: true
categories: 
- Technical Skills
- Meta Game
type: post
---

I think the time has come for a standard programming language safety
score. I want to use this model to help show that the concept of
safety is much more nuanced than a binary bit of "has strong-static
types". There are many languages now that could benefit from adding a
richer set of safe-by-default functions.

When someone says "programming language safety", it typically invokes
for me thoughts of unit tests, long build times, and red squiggles in
an IDE. But, in day-to-day development, there are so many times when I
am bitten by something that somehow the compiler just didn't
catch. This got me thinking how if languages are not already perfectly
safe, what would be a way to consider how safe they are in relation to
a standard measure?

I put together this scoring model to get a sense of how safe a
language is at the primitive level, and if it isn't safe by default,
how much it costs to manually make it safe. Since all abstractions
eventually result in a series of primitive operations, I decided that
focusing only on primitives would still be a valuable (if incomplete)
data point. While any good library will handle these primitive checks
and present the consumer with a well-designed abstraction, in the end,
the consumer is still left wiring libraries together, building their
own primitive abstractions for integration. Since it would be
impossible to measure the quality of abstractions in all libraries for
a language, that seemed entirely out of scope for what could ever be
modeled.

By focusing on only the primitive operations of making and calling
functions, naming data, working with sequences, and dealing with
language primitive data types, I slimmed down the large range of
possible error vectors to a small handful. While in some languages it
is common to use user-defined classes to wrap around a set of
primitives, those classes are still doing the same primitive work,
just hidden behind a user-created abstraction. The more ways it is
possible to make a "mistake" with a primitive, the more difficult it
is to build good abstractions.

    This model is not about language "power".

This model is not about ranking the "power", "expressiveness", or
"abstract-ability" of a language. In any language that supports
abstractions (functions, classes, modules, naming data), I am
convinced it is possible to do almost anything, given enough
code. This model is only about the costs to prevent unexpected
"confusion" between the programmer and the machine at the primitive
level.

Rather than focus on what is _possible_ with a language, I will
instead focus on what is typically idiomatic to that community. For
example, if it is possible to achieve a level of safety in a language
but by doing something uncommon, that should not be counted.

    This is not about "whose language is better".

To score a language, simply figure out how many characters it costs to
"prevent" a certain type of error, and add that to the
total. Newlines, spaces, and tabs do not count, but all other
punctuation does. If a specific check is language enforced, like F#'s
Option or C#'s parameter type enforcement, that is given a (default)
-30 to make up for the lack of unit tests and code exercising needed
to run that "path". Do not count import lines for libraries, as the
importing the module will have a negligible effect on the code size
and complexity.

If there is a safety feature that is not possible to achieve
programmatically, we will add (a default) +30 for a "every change run
and debug to fix" cost, such as Java not having a way to prevent stack
overflow exceptions caused by recursion.

    A lower score is "safer", needing less code to achieve the same
    level of safety.

<div ng-app="TableApp">
<div ng-controller="TableCtrl">

Language Enforced Bonus:
{% raw %} {{ enforcedScore }} {% endraw %}
<input ng-model="enforcedScore" type="range" min="0" max="50" />

Language Inability Penalty:
{% raw %} {{ inabilityPenalty }} {% endraw %}
<input ng-model="inabilityPenalty" type="range" min="0" max="50" />

Show Weights <input type="checkbox" ng-model="showWeights" />
<p class="lead">
<div style="overflow-x:scroll">
<table class="langtable">
<tr>
<th>Safety Check</th>
<th></th>
<th>
<select ng-options="lang.name for lang in allLanguages" ng-model="languages[0]"></select>
</th>
<th>
<select ng-options="lang.name for lang in allLanguages" ng-model="languages[1]"></select>
</th>
<th>
<select ng-options="lang.name for lang in allLanguages" ng-model="languages[2]"></select>
</th>
<th>
<select ng-options="lang.name for lang in allLanguages" ng-model="languages[3]"></select>
</th>
</tr>
<tr ng-repeat="check in langChecks" score-row name="check.name" language-fn="check.fn"></tr>
<tr class="totals"><td>Totals</td>
<td></td>
<td ng-repeat="lang in langTotals track by $index">
{% raw %} {{ lang }} {% endraw %}
</td>
</tr>
<tr class="totals"><td>Magnitude</td>
<td></td>
<td ng-repeat="lang in langTotals track by $index">
{% raw %} {{ percentageTotals(lang) }}% {% endraw %}
</td>
</tr>
</table>
</div>

I want to see your language represented here! I'll happily take
pull requests so long as they are in the same data structure found
here: [language data structure](https://github.com/steveshogren/blog-source/blob/22f907bb2d43b1edf7ca8807c32bb4542c887d93/source/javascripts/sliders.js#L97-L158)

If you want to see what code was used to come up with those numbers,
and want to put in your own examples, feel free to play with the
samples below. Code surrounded with <! !> is ignored from the tally,
since it would vary heavily based on the language and desired
result. Variable and type names are kept at single characters, which
are counted.

<h2>Select Language:
<select ng-options="lang.name for lang in allLanguages" ng-model="selectedLang"></select>
</h2>
<h2>{% raw %} {{ selectedLang.name }} {% endraw %}</h2>
<div ng-repeat="check in langChecks">
<h3>{% raw %} {{ check.name }} {% endraw %}</h3>
<p>
{% raw %} {{ check.fn(selectedLang).desc }} {% endraw %}
{% raw %} {{ score(check.fn(selectedLang)) }} {% endraw %}

<div>
Code:
<div class="tablecode">1234567890123456789012345678901234567890</div>
<div class="tablecode" > {% raw %} {{ cleanCode(check.fn(selectedLang).rawCode) }} {% endraw %} </div>
<input type="text" style="width:90%;" ng-model="check.fn(selectedLang).rawCode" />
</div>
</p>
</div>

Hope this is a helpful way to think about language safety!
