---
layout: post
title: "Language Safety Score Mark 2"
date: 2015-07-24 10:13
comments: true
categories: 
- Technical Skills
type: post
published: true
---

I want to make a model that predicts bugs.

I previously wrote a table for scoring language safety:
[Programming Language Safety Score](http://deliberate-software.com/programming-language-safety-algorithm/),
but it was extremely time consuming to score new languages or make modifications.

## Simplify, Simplify

After being told I was [overfitting](https://en.wikipedia.org/wiki/Overfitting)
the data, I've attempted to clean up by simply checking if each category is
enforced, possible, or impossible. I score each as either 1 (language enforced),
0 (possible, but you have to remember to do it), or -1 (impossible). When the
magnitudes of the new model are compared with the previous model, they come out
very similar. The shape of the curve pretty much stays the same, which I was
told indicates that the character count weighting was a variable that didn't
matter. 

{% img center /images/rplot.jpg 'image' 'images' %}

The code I used to generate the plot and normalize the scores can be found here:
[scorePlot.R](https://github.com/steveshogren/datasciencecoursera/blob/817dec79e36b6e9a6c5a8fd5700aff7cc394b9d4/scoreplot.R)

## Safety Definitions

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

The new scores are shown here, with a lot more languages added in:

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


## So, What's the Point?

To see how this model corresponds with data in the real world, I used the GitHub
API to query for the number of bugs created in repositories with more than 15
forks created in a span from 2011 to 2015. Commits were counted by summing the
commit counts of all contributors.

I decided to rely on the count of commits as a standard for a unit of work. My
assumption was that across fifty different projects, the commit sizes would
average out. Once the unit of work was decided on, I wanted to find the ratio of
bugs per commit for each language.

I collected the ratio of bugs logged per commit for each repository, and after
grouping by primary language, removed the top and bottom 25% using the
bug/commit ratio, which is a common practice in statistics to help find a more
accurate average. I summed the bugs and commits of those remaining repositories
grouped by language, finding a total average bug/commit ratio for each language
grouping. Here is that data, sorted by safety score.

<table class="langtable">
<tr><th>Language</th>
<th>Bugs</th>
<th>Commits</th>
<th>Repositories</th>
<th>Bug/Commits</th>
<tr ng-repeat="lang in languageRatios">
<td>{% raw %} {{ lang.name }}{% endraw %} </td>
<td>{% raw %} {{ lang.bugs }}{% endraw %} </td>
<td>{% raw %} {{ lang.commits }}{% endraw %} </td>
<td>{% raw %} {{ lang.repos }}{% endraw %} </td>
<td>{% raw %} {{ getBugsRatio(lang) }}{% endraw %} </td>
</tr>
</table>

Here are the languages sorted by safety score with bug/commit ratios:

{% img center /images/errorChart.jpg 'image' 'images' %}
{% img center /images/bugsAverage.jpg 'image' 'images' %}

I took the magnitude of the safety scores and the bug/commit ratios. After
inverting the safety scores, I overlaid them both onto a single graph.

{% img center /images/bothMags.jpg 'image' 'images' %}

Immediately it is obvious that Ruby, Python, PHP, and Clojure all seem to strongly
buck the trend, but otherwise the languages follow a pretty consistent slope
down in bugs. Taking the correlation gives a
[correlation coefficient](https://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient)
of .55

## What About Unit Tests?

Thinking that Ruby, Clojure, PHP, and Python might not correlate well due to some
other factor, I collected data on how many tests each repository had. I counted
the number of files containing "test" or "spec", which gave the following,
sorted by tests per commit:

<table class="langtable">
<tr><th>Language</th>
<th>Tests</th>
<th>Commits</th>
<th>Repositories</th>
<th>Tests/Commits</th></tr>
<tr ng-repeat="lang in sorter(languageRatios)">
<td>{% raw %} {{ lang.name }}{% endraw %} </td>
<td>{% raw %} {{ lang.test }}{% endraw %} </td>
<td>{% raw %} {{ lang.commits }}{% endraw %} </td>
<td>{% raw %} {{ lang.repos }}{% endraw %} </td>
<td>{% raw %} {{ getTestsRatio(lang) }}{% endraw %} </td>
</tr>
</table>

PHP, Python, and Ruby all have a higher then average number of tests, but
Clojure does not. Additionally, Go, Scala, and Java all also have a higher than
average number of tests, yet they score relatively average in bugs/commit.

## Conclusion

In conclusion, the current safety model I have proposed seems to account for a
moderate reduction in bugs per commit across the sampled languages, but is not
the only factor. It currently is unable to account for a significantly lower
than expected bug count in Ruby and Clojure.

## Special Thanks

Special thanks to (in alphabetical order):
[Patrick Boe](https://twitter.com/traffichazard/) (Haskell, Sniff Test),
[Kyle Burton](http://asymmetrical-view.com/) (General Advice),
Nils Creque (Listening Board), 
Max Haley (Python, Ruby, Teaching me how to math),
[Daniel Miladinov](https://github.com/danielmiladinov) (Java, Scala, Morale Support),
Keith O'Brien (Ruby and JS),
[Chris Salch](https://github.com/arlaneenalra) (CoffeeScript and JS),
and [Tim Visher](https://github.com/timvisher) (Clojure).

Additional thanks to the posters on
[/r/rust](https://www.reddit.com/r/rust/comments/3egx49/language_safety_score_mark_2/),
including [/u/notriddle](https://www.reddit.com/user/notriddle),
[/u/killercup](https://www.reddit.com/user/killercup), and
[/u/diegobernardes](https://www.reddit.com/user/diegobernardes) who put together the Rust score.


## Complaints Department

Did I mess up something about a language here, or am I missing a safety check? I'll happily take pull
requests for new languages:
[blog source](https://github.com/steveshogren/blog-source/blob/master/source/javascripts/sliders2.js). Just
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
