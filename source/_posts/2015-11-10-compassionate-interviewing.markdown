---
layout: post
title: "Designing A Compassionate Interview For A High Performing Individual"
date: 2015-11-10 17:01:58 -0500
comments: true
categories: 
- Meta Game
published: true
---

After my post [Interview Humiliation](http://deliberate-software.com/on-defeat/), a number of
people have asked me how I interview compassionately. I strive to make my interviews as
stress-free and respectful as possible while still rendering a yes/no at the end.

Any good interview process needs to start with good goals:

  * The candidate should learn as much as possible about working here, good and bad
  * Respect the candidate's time
  * Make the candidate comfortable
  * Under-skilled candidates should feel no shame
  * Both passing and failing candidates should leave wishing they could work here
  * We should render the same decision if the interview is repeated multiple
  times
  * The candidate should know the process in advance and not need to "cram" in
    any way
  * Candidate should feel we are working "side-by-side" instead of "face-to-face"

## The Ideal Candidate

We want to hire for high-level skills. Fast learning, strategic thinking,
abstraction design, and emotional intelligence are more important than rote
memorization. We care more about "ability to grow" than "current skills". Our
job does not involve whiteboard coding, puzzle questions, or anything that can
be discovered with a decent IDE, so those are left out.

We do not care about any question that could be easily be answered by Google. If
an internet search can easily answer the question, it is pointless to care if
the human in front of me happens to know it. Given the search revolution of the
last decade, the value of memorized facts falls to almost zero. 

I'd love to believe that a perfect productivity score can be invented.
Unfortunately, measuring developer productivity needs to be solved first.
Counting bugs, features, correct answers, etc, are all proxies that poorly
represent actual productivity. If those actually worked, why don't we use them
for raises, bonuses, and reviews? Because. They. Do. Not. Work.

Rubrics do work. A rubric is a way of measuring the "un-measurable". You
probably have seen them in year-end reviews. A grid with categories on one side,
and a 0-4 score with a paragraph explanation for each. We only score what has to
be explained with a several paragraph description from the interviewers.

> "How was the candidate's communication skills?"

> "They misunderstood me only a few times, and I only had trouble understanding
> them once or twice. Between our best communicator and worst, they were
> definitely above average: 3/4."

> "Abstraction design skills?"

> "They were able to clearly design this abstraction here, -shows code-, notice
> how they added this value to the function? The other interviewers really
> thought that this change over there added a lot of value as well. They also
> seemed to deeply understand passing functions as values, notice how this takes
> a function to demonstrate polymorphism? All said, they did most of the heavy
> lifting for this whole project, and it is superbly designed: 4/4"

## Our Process

To "level-set" our expectations, we had several of our developers at different
levels perform the interview live in front of the team. We made them use various
languages and exercises they had never seen before. This "level-setting" helped
us to see how known good developers perform when way out of their element and
uncomfortable.

All interviews are assigned to developers randomly, and all are expected to
participate. The candidate should have at a minimum two developers around at all
time, to prevent bias by any individual. Usually, one will pair while others
rotate watching silently. The watchers are expected to stay quiet, to prevent
confusion.

Before the first interview, the candidate is sent something very much like this
document. From our position, it appears there is no way someone could "fake us
out" on any criteria. The things we look for take years to practice and
cultivate, so "cramming" should not help much (if at all).

### Phone Screen

We pair program over the internet using a shared programming environment
called [Cloud9](c9.io). We (currently) have projects set up for Java,
Javascript, Python, Ruby, and C#. The candidate may choose their desired
language. We then pair program using Test Driven Development to build out a
well defined exercise. The candidate may entirely verbally "navigate", while
one of our programmers entirely "drives" and types out the code. This is
acceptable. The ideal candidate will be able to demonstrate comfort with
programming concepts and abstraction design.

Most programmers will have not seen Test Driven Development, and as such will
have to "learn" it while we work on the project. This is acceptable. If the
candidate has never seen any of those languages, Google or asking the
interviewer is totally fair game, and does not count against them. If the
candidate has completely no idea, the interviewer is expected to politely
complete the task while keeping the candidate engaged.

The phone screen is under an hour, with 30 minutes for the pair programming.
The remaining time is for questions about our office. We let them drive the
second half of the interview, asking us questions about what our team and
process is like. We attempt to answer clearly and honestly, both good and bad.

### In-Person

At the start of the day, we spend 30 minutes chatting and asking questions
back and forth. Our questions are meant to tell us about the candidate's
background and "programming philosophy": books read, favorite languages,
interesting projects they've worked on, etc. 

The rest of the day is very much like a "typical day at work", but with
programming exercises instead of production code. We pair program on the
exercises, following the same idea from the phone screen. The exercises have
no "tricks", they are reasonably straightforward and don't require any prior
domain or CS theory knowledge. The candidate may pick their preferred language
and environment (we have several pre-setup). We pair like that all day, with a
break for lunch. Throughout the day, the candidate is free to get food,
drinks, and run to the restroom.

The developer who is pairing has a primary role of making the candidate feel
comfortable and accomplish any effort with a 50/50 split of effort. If the
candidate really is struggling, the developer is expected to keep working with
the candidate, even to the point of doing the hard parts and giving them the
easy parts. A completely unskilled candidate will see their pair doing all the
work with a smile and politely asking for "help" with variable names and such.

The developer pair is also expected to give the candidate some time to think
if they are lost. The candidate at the end of the interview should feel like
they have a complete understanding of what happened. The exercises are
designed to be "too much to finish", and as such finishing the exercises is
not a success criteria as much as working well together and writing
maintainable code.

We feel this gives us a highly accurate understanding of a candidate's skill,
while still putting them at ease. Many times we've seen a terrified candidate
light up fifteen minutes into a pairing session while watching their developer
pair do most of the work. Something about seeing code written "activates" even
the most nervous candidate. All the thoughts of nerves turn into a concrete
"oh, wait, I know what he just did, and I've got an opinion on that!"

## Conclusion

We like this process because it is exactly what our job is like. We pair program
for a lot of work, and the interview is meant to give candidates a sample of
that. No one should show up for their first day of work and say, "wait, I
actually hate pair programming."

By thinking through our goals and an "ideal candidate", we were able to design a
process that meets those goals. I recommend you take an hour to write out your
goals and needs. Then see how your interview process matches. Are you looking
for a "human Google"? Does your job involve whiteboard coding? Would telling the
candidate the exact process in advance






