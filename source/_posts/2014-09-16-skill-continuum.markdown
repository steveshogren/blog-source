---
layout: post
title: "Software Skills Continuum"
date: 2014-12-02 7:26
comments: true
categories: 
- Technical Skills
- Meta Game
- management
type: post
---

        Learning Vim is a waste of time; I can prove it! - Anonymous
        
I recently had a gentle discussion with a new teammate about whether
or not they should learn to use Vim. My team uses a Vim emulator
inside Visual Studio and Emacs, and so we recommended he learn at
least the basics so to reduce friction when pair-programming (which we
do almost all the time).

He really had no desire to learn it, and took no small amount of
offense when we suggested it. The friction he felt trying to "start
over" really bothered him. He set out to prove that Vim was not worth
his time, and that it was actually us who needed to stop using it,
because we were the duped slow ones.

As any such localized experiments go, he never really came up with
anything conclusive either way. Personally, I suspect he spent more
time trying to figure out why Vim was worse than if he had just
buckled down and learned it. This got me thinking about skills we
learn as developers, and how much they cost.

# Skills

Most skills fall along a continuum of tactical to strategic.

### Tactical Skills

* Typing speed/accuracy
* Keyboard shortcuts
* "Mouse-free" editing systems: Vim, Emacs
* Clean coding practices
* Refactoring tools
* Repl Driven Development / Test Driven Development
* Debugging

### Mid-way Skills

* Unit testing
* Building abstractions
* Designing simple solutions
* Automating tasks
* Learning new languages and frameworks

### Strategic Skills

* Gathering requirements
* Training developers
* Organizing and leading teams
* "Understanding the real problem"

The more strategic the skills, the "softer" they become. The reason
for this is that soft skills often allow for the greatest leverage on
a project.

Why is this?

Consider the developer, who by more accurately gathering requirements
for a few extra days, realizes that the stakeholder can use a
preexisting solution instead of a six month planned project. If you
consider how many keystrokes he saved, there is no way he could have
possibly typed fast enough or refactored efficiently enough to make up
for that saved six months of effort. Unless he can typed out a six
month project in a few days, his time was better spent where it
was. Obviously, these opportunities do not happen all the time, but
they _do_ happen.

Think about the return on investment for training developers. If you
have an average team (and yes, we all do), there is a good chance you
have some lower performing developers. I have witnessed many times
where a few months of pairing to brush up the skills of a less skilled
developer allowed them to become much more productive. In terms of
total company effort, that small investment paid back many times
before the end of the year as the newly trained developer was able to
tackle their work with the renewed vigor that comes from a greater
mastery of their work.

Similarly, the judicious use of automation for deployment, testing,
and building greatly reduces the friction of development for entire
teams. Lowered friction means less cognitive burden.

That being said, I think there comes a point where you have to put
fingers to keyboard and actually produce working software. Of course,
the fastest and best software is the software you never have to
write. But, when you absolutely must write or modify software, the
skill to actually execute becomes very important. Tactical skills
increase in significance the closer you get to the work.

While a great software tactician will never "beat" a great strategist
in terms of raw business value, a great strategist that is a terrible
tactician can only talk their way out of work. A strategist who
forgets or ignores good tactics is what we call an "architecture
astronaut" or an "ivory tower architect". These disconnected
strategists eventually start to remove business value as their
solutions make less and less practical sense.

I think a developer who wants to improve should make sure they are
improving all across the spectrum. Don't focus only on strategic or
tactical skills, but seek projects and teams that will allow you to
gain skills across the board. I like to try to focus on one skill from
each side of the continuum each year. This year, it is emacs
automation and monads on the tactical side, and leading mature teams
on the strategic. By alternating readings, I find fuel to apply the
strategies using these new tactics!

Lastly, on the subject of "what to study", I think it is possible to
study a number of subjects all across the continuum. Unless you have
weeks where you never type any code at all, you can practice and learn
new tactical techniques all the time. If it slows you down today, but
speeds you up next week, it might just be worth it. Even if it slowed
you down to a quarter your usual speed for two weeks, but then gives
you a measly 5% boost to productively after that, you'll earn that
time back by the end of the year, plus some. And 5% is not hard to
do. I'd guess learning a few new navigation or refactoring shortcuts
would net you 5% easily.

When studying more strategic skills, the same holds, but they are
harder to learn. The best way I have found for learning strategic
skills is to read books about it, and try to work around others who
are good at it. Neither books or working with others will get you all
the way there, you also have to apply it yourself.

# Progression

I usually recommend that the more experienced a person is, the more
mastery they should have in the tactical skills. A suggested path I've
recommended for a new developer would look like this:

### 0 - 6 Months:

* Typing speed/accuracy
* Keyboard shortcuts
* Repl Driven Development / Test Driven Development
* Unit testing
* Clean coding practices
* Designing simple solutions

### 0 - 2 Years:

* Debugging
* Refactoring tools
* Building abstractions
* Automating tasks
* Learning new languages and frameworks
* "Mouse-free" editing systems: Vim, Emacs

### 0 - 50+ Years:

* Gathering requirements
* Training developers
* Organizing and leading teams
* Understanding the real problem

This is not a hard and fast list. If you are completely unsure of what
to learn, I recommend this rough progression just to get you
started. If you are a two year developer, and you cannot touch type, I
think learning it can really help, alongside the other 0 - 2 year
skills.

Not all skills along the list build on a mastery of the ones below
it. A developer can absolutely get to a very senior mastery of the
strategic skills only knowing one language and using notepad.exe. I
believe that they are missing out on a deep richness that comes from
better knowing their field, and I suggest they spend some time learning new
languages and tools. The more tactical the skill, usually, the easier
it is to learn, so it won't take very much time to come up to
speed. 

The hardest thing I think a more senior developer has to deal with is
humbling themselves to learn a perceived "entry-level" skill. I have
another post brewing about this very topic, so I'll not get too much
into it here. But if you have gotten to a place where you feel like
you are so senior that some skills are too "entry-level" for you to
learn, I think you need to humble yourself and learn them. Nothing can
be gained from pretending like they are not valuable. Additionally,
the assumption that your time is now so valuable that it is "a waste"
to spend it on learning tactical skills is absurd.

Claiming you are too good to waste on low level skills not only
belittles everyone around you, but belies a deep misunderstanding of
our field. The senior developer who takes five times as long to enter
and edit code isn't just spending longer to do that task, but they are
paying a missed opportunity cost in time they could have spent in more
strategic endeavors. They could have been training, planning,
gathering requirements, building better automation, etc, instead they
stubbornly claim "typing isn't what software is about". By giving it
so little credence, they have made it most of their actual mental
effort! Take simple touch-typing. Imagine how much mental effort it
takes the hunt-and-peck typist to write out a single line of
code. That is mental overhead that is simply wasted. The developer who
doesn't have to think about how to move a file or edit a structure
finds themselves quickly through the tactical efforts with little
distraction, free to think deeply.

# Resources

Here are some links and books to get you started on these topics.

* Typing speed/accuracy - [Typing of the Dead](http://store.steampowered.com/agecheck/app/246580/)
* "Mouse-free" editing systems: Vim, Emacs - [Vim Adventures](http://vim-adventures.com/)
* Clean coding practices - [Clean Coders](https://cleancoders.com/)
* Repl Driven Development - [RDD](http://blog.jayfields.com/2014/01/repl-driven-development.html)
* Test Driven Development - [http://www.amazon.com/Test-Driven-Development-By-Example/dp/0321146530](http://www.amazon.com/Test-Driven-Development-By-Example/dp/0321146530) 
* Debugging - [Debugging](http://c.learncodethehardway.org/book/ex31.html)
* Building abstractions / Designing Simple Solutions - [Structure and Interpretation of Computer Programs](http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html#%_toc_start)
* Training developers - [Pair Programming](http://en.wikipedia.org/wiki/Pair_programming)
* Organizing and leading teams - [Managing Humans](http://managinghumans.com/)
* Understanding the real problem - [Thinking Fast and Slow](http://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow)
* Learning new languages and frameworks - [Teach Yourself Programming in Ten Years](http://norvig.com/21-days.html)
* Automating tasks [Rake to Automate Tasks](http://www.stuartellis.eu/articles/rake/)


