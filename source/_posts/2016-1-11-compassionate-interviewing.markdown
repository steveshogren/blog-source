---
layout: post
title: "Designing A Compassionate Interview For A High Performing Individual"
date: 2016-1-11 07:01:58 -0500
comments: true
categories: 
- Meta Game
- management
published: true
---

{% img right emailImage /images/2.Why_Algorithm_Important.png 400 'finding' 'finding' %}

After my post [Interview Humiliation](http://deliberate-software.com/on-defeat/), a number of
people have asked me how I interview compassionately. I strive to make my interviews as
stress-free and respectful as possible while still rendering a yes/no at the end.

Any good interview process needs to start with goals:

  * Respect the candidate's time
  * Make the candidate comfortable
  * Under-skilled candidates should feel no shame
  * Both passing and failing candidates should want to tell their friends to
    apply
  * We should render the same decision if the interview is repeated multiple
    times (with different exercises each time)
  * The candidate should know the process in advance and not be able to earn a
    pass through short term "cramming"
  * The candidate should feel we are all working collaboratively, instead of us
    against them

## The Ideal Candidate

{% img right emailImage /images/whiteboards2.jpg 400 'whiteboard 'whiteboard' %}

We want to hire for high-level skills. Fast learning, strategic thinking, good
design, and emotional intelligence are more important than rote memorization. We
care more about "ability to grow" than "current skills". Our job does not
involve whiteboard coding, puzzle questions, or anything that can be discovered
with a decent IDE, so those are left out.

We care a lot about "no jerks". We want our workplace to be fun, relaxing, and
supportive. We want candidates who are comfortable being wrong and corrected
regularly, and who can correct others politely.

We do not care about any question that could be easily be answered by Google. If
an internet search can easily answer the question, it is pointless to care if
the human in front of me happens to know it. Given the search revolution of the
last decade, the value of memorized facts falls to almost zero. Facts as a proxy
for actual job skill probably used to be accurate until the internet allowed
every interview question to become public record.

## Scoring

I hope someone one day invents a perfect productivity score! For now, counting
bugs, features, correct answers, etc, are all proxies that poorly represent
actual productivity. If those actually worked, why don't we use them for raises,
bonuses, and reviews? Because. They. Do. Not. Work.

> Counting bugs, features, correct answers, etc, are all proxies that poorly
> represent actual productivity

A well-designed rubric _can_ work. A rubric is a way of measuring the
"un-measurable". You probably have seen them in year-end reviews. A grid with
categories on one side, and a 1-5 score with a paragraph explanation for each.
We only score what has to be explained with a description from the interviewers.

> "How was the candidate's communication skills?"

> "They misunderstood me only a few times, and I only had trouble understanding
> them once or twice. The watchers all felt like the communication was pretty
> good. They were definitely above average: 3/4."

> "How about design skills?"

> "They were able to clearly design every abstraction. They deeply understood
> passing functions as values, see how this takes a function for polymorphism?
> We prodded a bit, and they were able to give a couple other ways to achieve
> the same behavior. We all agreed it was best the way it was. All said, they
> did most of the heavy lifting for this whole project, and it is superbly
> designed: 4/4"

## Our Process

To "level-set" our expectations, we had several of our developers at different
levels perform the interview live in front of the team. We made them use various
languages and exercises they had never seen before. This "level-setting" helped
us to see how known good developers perform when way out of their element and
uncomfortable.

All interviews are assigned to developers randomly, and all are expected to
participate. The candidate should have two developers around at all time, to
prevent bias by any individual. One pairs while the others rotate watching
silently. The watchers are expected to stay quiet, to prevent confusion.

Before the first interview, the candidate is sent something very much like this
document. We think there is no way someone could "fake us out" on any criteria.
The things we look for take years of practice to cultivate, so "cramming" should
not help much (if at all). The one exception to that is if they have never heard
of Test Driven Development, we do recommend they Google it for a few minutes, as
prior knowledge helps smooth the phone screen considerably.

### Phone Screen

We pair program over the internet using a shared programming environment called
[Cloud9](c9.io). We (currently) have projects set up for Java, JavaScript,
Python, Ruby, and C#. The candidate may choose their desired language. We then
pair program using Test Driven Development to build out a well defined exercise.
The candidate may entirely verbally "navigate", while one of our programmers
entirely "drives" and types out the code. This is acceptable.

If the candidate has never seen any of those languages, Google or asking the
interviewer is totally fair game, and does not count against them. If the
candidate has completely no idea, the interviewer is expected to politely
complete the task while keeping the candidate engaged.

The phone screen is under an hour, with 30 minutes for the pair programming.
The remaining time is for questions about our office. We let them drive the
second half of the interview, asking us questions about what our team and
process is like. We attempt to answer clearly and honestly, both good and bad.

### In-Person

The in-person interview is from 9:30 to 3:00. We are not thrilled with how much
time it takes and would like to shorten it, but so far have no superior
alternatives.

At the start of the day, we spend 30 minutes chatting and asking questions back
and forth. Our questions are meant to tell us about the candidate's background
and "programming philosophy": books read, favorite languages, interesting
projects they've worked on, etc. We allow them as many questions as they would
like.

The rest of the day is very much like a "typical day at work", but with
programming exercises instead of production code. We pair program on the
exercises, following the same flow from the phone screen. The exercises have no
"tricks", they are reasonably straightforward and don't require any prior domain
or CS theory knowledge. Throughout the day, the candidate is free to get food,
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
actually hate pair programming." By thinking through our goals and an "ideal
candidate", we were able to design a process that meets those goals.

I recommend you take an hour to write out your goals and needs. Then see how
your interview process matches. Are you looking for a "human Google"? Does your
job involve whiteboard coding? Would telling the candidate the exact process in
advance with all the questions let them game the system? Because every single
interview question I've seen is up on Google to be found and memorized on easy
to read lists. How much time does your process take? Could it be shortened? Does
it require the candidate to spend a lot of time at home? You might be surprised
at what you find!
