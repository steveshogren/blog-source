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

    A lower score is "safer", needing less code to achieve the same
    level of safety.

For example:

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

I want to see your language represented here! I'll happily take
pull requests so long as they are in the same data structure found
here: [language data structure](https://github.com/steveshogren/blog-source/blob/22f907bb2d43b1edf7ca8807c32bb4542c887d93/source/javascripts/sliders.js#L97-L158)

If you want to see what code was used to come up with those numbers,
and want to put in your own examples, feel free to play with the
samples below:

<h2>Select Language:
<select ng-options="lang.name for lang in languages" ng-model="selectedLang"></select>
</h2>
<h2>{% raw %} {{ selectedLang.name }} {% endraw %}</h2>
<div ng-repeat="check in langChecks">
<h3>{% raw %} {{ check.name }} {% endraw %}</h3>
<p>
{% raw %} {{ check.fn(selectedLang).desc }} {% endraw %}
{% raw %} {{ score(check.fn(selectedLang)) }} {% endraw %}

<div>Code: <input type="text" style="width:90%;" ng-model="check.fn(selectedLang).rawCode" /><div>
</p>
</div>

