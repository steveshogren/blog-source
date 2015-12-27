---
layout: post
title: Ego Driven Development
categories:
- Meta Game
status: publish
type: post
published: true
---

Ego Driven Development, (EDD), is a software development anti-pattern where
developers and managers repeatedly act as if established best practices do not
apply to them, to the detriment of their organization. Institutional ego is most
often to blame.

EDD plagues many organizations; here just some of the symptoms you might
encounter:

* **"Not Invented Here" syndrome.** Expressed most commonly in a desire for
  everything needed to be developed in house. E.g.: "Need a CMS? Let's make our
  own from scratch!" Perhaps, you work at a place where all your teammates do is
  constantly bring you bad ideas. Are they really all terrible? Or are only your
  ideas good enough for the organization? Not Invented Here can also apply to
  your own head, not just the organization.


* **Little to no test coverage of domain logic.** There are plenty of great
developers who do not need automated tests to remember all the little quirks of
their systems when working alone, and that works fine until you bring on a
second developer. Domain logic tests are about increasing communication and
speed for the team, and they are part of being a good citizen of a team.

* **No dedicated UI person for external user interfaces or no actual user
testing.** Either the developers or the manager think they are good enough to
design excellent and understandable user interfaces or do not realize the
importance of this. Think of a "Steve Jobs"-type manager who imagines himself to
be a prodigy of design and usability, or the developer who "doesn't think design
is all that hard". Real users trying out your software for a few minutes will
tell you more than you would believe.

* **No dedicated QA for externally-facing software.** Someone who is experienced
at breaking software should have a crack at it before it goes to users.
Developers (including me) are too enamored with their own work to really take
the time to break it, so someone with a sense of pride in finding problems needs
to be given the task.

* **"<a href="http://en.wikipedia.org/wiki/Ivory_Tower">Ivory Tower</a>" or "<a
href="http://www.joelonsoftware.com/articles/fog0000000018.html">Architecture Astronaut</a>" team leads.** The team member that is focused on "perfection" of
the design or code to the detriment of the business. This is not an easy
distinction to make, and no one becomes this without a heart full of good
intentions. "If only the test coverage could be higher" (when it is already
high) or "we can make our own programming language to solve this so much more
elegantly". Like I said, a fine line that takes many years of experience and
deep familiarity with the business and the domain to discern.

* **Broad skill level spectrum (that stays static).** A huge gap in skill level
between the best and worst team members. Most often happens when a bunch of new
hires come on board, and were not skilled enough for the task or were not
trained properly. The original team members decide the new members are "not
worth the effort" and neglect to train them in the hopes they will be fired.
Months, or even years later, the "new members" are still struggling along,
berated by the "elites".

* **No pair programming.** Very few activities will raise the water level for
all the team members like pairing. It trains new developers quickly, as well as
allows the older developers to see the pain points of a system through a new set
of eyes.

* **Micro-management in some areas, no management in others.** When leads and
managers put too much effort and management into some areas, to the neglect of
other areas. Some tickets will be crammed with detail down to the database
column names, others will be one-liners covering a month of work. Typically,
this is a top-down effect, starting at upper management and trickling down to
the lowest levels. Whatever the "eye of Sauron" is focused on is what the whole
chain of command suddenly turns its laser focus towards, while the rest of the
projects/tickets are abandoned by all but the developer assigned to the ticket.

* **Agile "Lite".** Everyone pretty much has heard that agile is a fast
development methodology. What often happens is that management either does not
learn enough about it to implement correctly, or does not like the "chaotic"
nature of true agile, and so attempts to adopt the "best parts". Typically this
means splitting work into "sprints" and having a "stand-up", while developers
all just work off of tickets assigned and estimated by their leads. Often this
happens because the person who makes the call on whether or not to implement
agile falsely believes themselves (and the team) to be "good enough to not need
it".

* **Low <a href="http://www.joelonsoftware.com/articles/fog0000000043.html">Joel Test</a> score.** The Joel Test remains a great indicator of institutional ego.
A team that scores low on the Joel Test does so because someone along the way
decided that, "nah, we don't need that here, we are special", and almost
certainly they are not. I have yet to hear of a team with a legitimate reason
for a low Joel Test score.

* **Low pay.** Ah, yes, the shops that pay their developers significantly
lower than the average in that location, language, and experience. This one is
hard, because it really is almost always up to just one person, and the
developer usually only gets to vote with their feet: by either staying or going.
If you are that person, you had best consider what you are missing out on by
remaining in a positon where you are underpaid.

Ego driven development is unfortunately self-reinforcing. Much of it is caused
by individual pride, and usually it is driven by someone towards the top of the
chain of command. While it can be a <a
href="http://en.wikipedia.org/wiki/Virtuous_circle_and_vicious_circle#Vicious_circle_2">vicious cycle</a> trickling down, it is possible to break out of the loop by fighting
back against EDD with humility and an attitude of just doing what's best for the
team. I have seen managers take tremendous crap from above, and never let a bit
of it touch those below them. Those managers were heroes we all fought to
impress, because we knew how hard they worked to make our teams better. I have
seen experienced developers swallow their pride, and do the boring, tedious,
hard, and less fun work for the betterment of the whole, in the process grew
into someone much more productive.

EDD is possible to defeat. Treat everyone with respect, and praise what steps
they do take in the right direction. Set aside your ego, and when you get
micro-managed and treated with disdain from those above you, do what it takes to
make sure that doesn't trickle down to those below you and at your level. Pick a
few things on this list that you know you are not doing well, and tackle the
root cause. Swallow your pride, and do your part to be excellent, and your work
will thrive. 
