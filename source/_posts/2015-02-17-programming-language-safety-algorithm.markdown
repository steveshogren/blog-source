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
types".

When someone says "programming language safety", it typically invokes
thoughts of unit tests, long build times, and red squiggles in an
IDE. But, in day-to-day development, there are so many times when we
are bitten by things that somehow just slip through the cracks.

I put together this scoring model to get a sense of how safe a
language is at the primitive level, and if it isn't safe by default,
how much it costs to manually make it safe. Since all abstractions
eventually result in a series of primitive operations, I decided that
focusing only on primitives would still be a valuable (if incomplete)
data point. While any good library will handle all primitive checks
and present the consumer with a well-designed abstraction, in the end,
the consumer is still left wiring libraries together, building their
own primitive abstractions for integration. Due to the impossibility of
measuring the quality of abstractions in all libraries for a language,
I left that entirely out of scope of this model, unless it is designed
as a primitive check.

By focusing on only primitive operations: making and calling
functions, naming data, working with sequences, and dealing with
language primitive data types, I slimmed down the large range of
possible error vectors to a small handful. While in some languages it
is common to use user-defined classes to wrap around a set of
primitives, those classes are still doing the same primitive work,
just hidden behind a user-created abstraction. The more ways it is
possible to make a "mistake" with a primitive, the more difficult it
is to build such good abstractions.

    This model is not about language "power".

This model is not about ranking the "power", "expressiveness", or
"abstract-ability" of a language. In any language that supports
abstractions (functions, classes, modules, naming data), I am
convinced, given enough code, all Turing complete langauges can do the
same work. This model is only about the costs to prevent unexpected
"confusion" between the programmer and the machine at the primitive
level.

Rather than focus on what is _possible_ with a language, I will
instead focus on what is typically idiomatic to that community. For
example, if it is possible to achieve a level of safety in a language
but by doing something uncommon, that should not be counted.

To score a language, simply figure out how many characters it costs to
"prevent" a certain type of error, and add that to the
total. Newlines, spaces, and tabs do not count, but all other
punctuation does. If a specific check is language enforced, like F#'s
Option or C#'s parameter type enforcement, that is given a -30 (by
default) to make up for the lack of unit tests and code exercising
needed to run that "path". Do not count import lines for libraries, as
importing the module will have a negligible effect on the code size
and complexity.

If there is a safety feature that is not possible to achieve
programmatically, we will add +30 (by default) for a "every change run
and debug to fix" cost, such as Java not having a way to prevent stack
overflow exceptions caused by recursion.

    A lower score is "safer", needing less (or no) code to achieve the same level of safety.

Rather than tell you my thoughts (or survey for) hard-coded
weightings, all checks are weighted the same by default. Feel free to
apply your own weightings, to better match to your or your team's
specific needs and preferences. The languages are masked by default to
protect the innocent. You can unmask the names and see the code used
below the table.

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
<select ng-options="getName(lang) for lang in allLanguages" ng-model="languages[0]"></select>
</th>
<th>
<select ng-options="getName(lang) for lang in allLanguages" ng-model="languages[1]"></select>
</th>
<th>
<select ng-options="getName(lang) for lang in allLanguages" ng-model="languages[2]"></select>
</th>
<th>
<select ng-options="getName(lang) for lang in allLanguages" ng-model="languages[3]"></select>
</th>
</tr>
<tr ng-repeat="check in langChecks" score-row name="check.name" row-key="check.key"></tr>
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

<h3><input ng-model="showRealName" type="checkbox" /><span
ng-click="showRealName = !!!showRealName">Click to see backing code and unmask names</span></h3>

Current Languages:
<span ng-repeat="lang in allLanguages">
{% raw %} {{ getName(lang) }}: {{ allLangTotals[$index] }}, {% endraw %}
</select>

I want to see your language represented here! I'll happily take pull
requests for new languages: [blog source](https://github.com/steveshogren/blog-source/blob/master/source/javascripts/sliders.js). Just
use the "edit language" and "copy to clipboard" to build your own
language data structure.

I would love to see every major language represented, including major
language "idiom communities". For example, Clojure and Typed Clojure
are vastly different in abilities. Similarly "Scala - The Better Java"
and "Scala - The JVM Haskell" have vastly different idioms with
apparently very separate communities.


<div ng-show="showRealName"> Feel free to put in your own examples by
playing with the samples below. Code surrounded with <! !> is ignored
from the tally, since it would vary heavily based on the language and
desired result. Variable and type names are kept at single characters,
which are counted. Feel free to add in your own language below, and
use the copy feature to extract the data structure to use in a pull
request.

<h2>Select Language:
<select ng-options="lang.name for lang in allLanguages" ng-model="selectedLang"></select>
</h2>
<button ng-click="showEdit = !showEdit">Edit Language</button>
<button ng-click="copyToClipboard(selectedLang)">Copy Changes to Clipboard</button>
<div ng-show="showEdit">
<h2><input ng-model="selectedLang.name"></input></h2>
<div ng-repeat="check in langChecks">
<h3>{% raw %} {{ check.name }} {% endraw %}: {% raw %} {{ score(selectedLang[check.key]) }} {% endraw %} </h3>
<p>
<textarea class="widetextarea" rows="5" ng-model="selectedLang[check.key].desc"></textarea> 
<div>
Code: <select ng-options="enforcedNice(e) for e in enforcedTypes" ng-model="selectedLang[check.key].enforced"></select>
<div class="tablecode">1234567890123456789012345678901234567890</div>
<div class="tablecode" > {% raw %} {{ cleanCode(selectedLang[check.key].rawCode) }} {% endraw %} </div>
<input type="text" style="width:90%;" ng-model="selectedLang[check.key].rawCode" />
</div>
</p>
</div>
</div>

<div ng-show="!showEdit">
<h2>{% raw %} {{ selectedLang.name }} {% endraw %}</h2>
<div ng-repeat="check in langChecks">
<h3>{% raw %} {{ check.name }} {% endraw %}: {% raw %} {{ score(selectedLang[check.key]) }} {% endraw %} </h3>
<p>
{% raw %} {{ selectedLang[check.key].desc }} {% endraw %}
<div>
Code: {% raw %} {{ enforcedNice(selectedLang[check.key].enforced)  }} {% endraw %}
<div class="tablecode" ng-if="selectedLang[check.key].rawCode">1234567890123456789012345678901234567890</div>
<div class="tablecode" > {% raw %} {{ cleanCode(selectedLang[check.key].rawCode) }} {% endraw %} </div>
<input type="text" style="width:90%;" ng-model="selectedLang[check.key].rawCode" />
</div>
</p>
</div>
</div>
</div>

Hope this is a helpful way to think about language safety!

Special thanks to (in alphabetical order):
Patrick Boe [(twitter)](https://twitter.com/traffichazard/),
Kyle Burton [(blog)](http://asymmetrical-view.com/),
Daniel Miladinov [(github)](https://github.com/danielmiladinov),
Chris Salch [(github)](https://github.com/arlaneenalra), and
Tim Visher [(github)](https://github.com/timvisher)
