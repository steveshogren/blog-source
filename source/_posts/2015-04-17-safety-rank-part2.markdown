---
layout: post
title: "Programming Language Safety Score"
date: 2015-02-17 14:13
comments: true
categories: 
- Technical Skills
- Meta Game
type: post
---

I previously wrote a table for scoring language safety which can be
found here: 

<div ng-app="TableApp2">
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

<div ng-show="showRealName">

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
