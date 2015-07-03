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

I previously wrote a table for scoring language safety which can be
found here: 

After being told I was "overfitting" the data, I've attempted to clean up by
simply checking if each category is enforced, possible, or impossible. The shape
of the curve pretty much stays the same, which I was told indicates that the
character count weighting was a variable that didn't matter.

<div ng-app="TableApp2">
<div ng-controller="TableCtrl">

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
requests for new languages: [blog source](https://github.com/steveshogren/blog-source/blob/master/source/javascripts/sliders.js). Just
use the "edit language" and "copy to clipboard" to build your own
language data structure.

<div ng-show="showRealName">

<h2>Select Language:
<select ng-options="lang.name for lang in allLanguages" ng-model="selectedLang"></select>
</h2>
<button ng-click="copyToClipboard(selectedLang)">Copy Changes to Clipboard</button>
<div ng-show="showEdit">
<h2><input ng-model="selectedLang.name"></input></h2>

<table class="langtable">
<tr><th>Check</th><th>Option</th></tr>
<tr ng-repeat="check in langChecks">
<td>
{% raw %} {{ check.name }} {% endraw %}: {% raw %} {{score(selectedLang[check.key]) }} {% endraw %}
</td>
<td>
<select ng-options="enforcedNice(e) for e in enforcedTypes" ng-model="selectedLang[check.key].enforced"></select>
</td>
</tr>
</table>

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
