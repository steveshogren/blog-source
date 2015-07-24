---
layout: post
title: "Language Safety Score Mark 2"
date: 2015-02-17 14:13
comments: true
categories: 
- Technical Skills
- Meta Game
type: post
published: false
---

I previously wrote a table for scoring language safety:
[Programming Language Safety Score](http://deliberate-software.com/programming-language-safety-algorithm/)

After being told I was [overfitting](https://en.wikipedia.org/wiki/Overfitting)
the data, I've attempted to clean up by simply checking if each category is
enforced, possible, or impossible. I score each as either 1, 0, or -1. When the
magnitudes of the new model are compared with the previous model, they come out
very similar. The shape of the curve pretty much stays the same, which I was
told indicates that the character count weighting was a variable that didn't
matter. 

{% img center /images/rplot.jpg 'image' 'images' %}

The code I used to generate the plot and normalize the scores can be found here:
[scorePlot.R](https://github.com/steveshogren/datasciencecoursera/blob/817dec79e36b6e9a6c5a8fd5700aff7cc394b9d4/scoreplot.R)

A definition of the safety checks is as follows:

<div ng-app="TableApp2">
<div ng-controller="TableCtrl">

<table class="langtable">
<tr><th>Check</th> <th>Description</th></tr>
<tr ng-repeat="check in langChecks">
<td>{% raw %} {{ check.name }} {% endraw %}</td>
<td> {% raw %} {{ check.desc }} {% endraw %} </td>
</tr>
</table>

The new scores are calculated using the following table. 


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


Current Languages:
<span ng-repeat="lang in allLanguages">
{% raw %} {{ getName(lang) }}: {{ allLangTotals[$index] }}, {% endraw %}
</select>

I want to see your language represented here! I'll happily take pull
requests for new languages:
[blog source](https://github.com/steveshogren/blog-source/blob/master/source/javascripts/sliders.js). Just
pick an existing language, edit the name and values, and "copy to clipboard" to
build your own language data structure. Send it to me in a PR and I'll include
it along with a thanks on the page.

<div ng-show="showRealName">

<h2>Select Language:
<select ng-options="lang.name for lang in allLanguages" ng-model="selectedLang"></select>
<button ng-click="copyToClipboard(selectedLang)">Copy Changes to Clipboard</button>
</h2>
<h2><input ng-model="selectedLang.name"></input></h2>
<table class="langtable">
<tr><th>Check</th><th>Option</th></tr>
<tr ng-repeat="check in langChecks">
<td style="background-color:{% raw %} {{scoreClass(score(selectedLang[check.key]))}} {% endraw %}">
{% raw %} {{ check.name }}{% endraw %}: {% raw %} {{score(selectedLang[check.key]) }} {% endraw %}
</td>
<td>
<select ng-options="enforcedNice(e) for e in enforcedTypes" ng-model="selectedLang[check.key].enforced"></select>
</td>
</tr>
</table>

To see how this model corresponds with data in the real world, I used the GitHub
API to query for the number of bugs created in repositories with more than 15
forks created in a span from 2011 to 2015. Commits were counted by summing the
commit counts of all contributors. I collected the ratio of bugs logged per
commit for each repository, and after grouping by primary language, removed the
top and bottem 25% based on the bug/commit number. I took those repositories,
and again summed all bugs and all commits, this time across all repositories
grouped by language, and found a total average bug/commit for each language
grouping. The following table shows those numbers.

<table class="langtable">
<tr><th>Language</th><th>Bugs</th><th>Commits</th><th>Tests</th><th>Repositories</th><th>Bug/Commits</th></tr>
<tr ng-repeat="lang in languageRatios">
<td>{% raw %} {{ lang.name }}{% endraw %} </td>
<td>{% raw %} {{ lang.bugs }}{% endraw %} </td>
<td>{% raw %} {{ lang.commits }}{% endraw %} </td>
<td>{% raw %} {{ lang.test }}{% endraw %} </td>
<td>{% raw %} {{ lang.repos }}{% endraw %} </td>
<td>{% raw %} {{ getBugsRatio(lang) }}{% endraw %} </td>
</tr>
</table>

Here are the languages sorted by safety score with bug/commit ratios:

{% img center /images/bugsAverage.jpg 'image' 'images' %}

I took the magnitude of the safety scores and the bug/commit ratios. After
inverting the safety scores, I overlaid them both onto a single graph.

{% img center /images/bothMags.jpg 'image' 'images' %}

Immediately it is obvious that Ruby, Python, and Clojure all seem to strongly
buck the trend.
The numbers correlate at an R^2 score of 0.55. 


Hope this is a helpful way to think about language safety!

Special thanks to (in alphabetical order):
Patrick Boe [(twitter)](https://twitter.com/traffichazard/),
Kyle Burton [(blog)](http://asymmetrical-view.com/),
Daniel Miladinov [(github)](https://github.com/danielmiladinov),
Chris Salch [(github)](https://github.com/arlaneenalra), and
Tim Visher [(github)](https://github.com/timvisher)
