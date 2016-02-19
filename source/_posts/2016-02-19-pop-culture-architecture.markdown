---
layout: post
title: "Pop Culture Architecture"
date: 2016-02-19 06:55:30 -0500
comments: true
categories:
- architecture
- Technical Skills
- Meta game
published: true
---

> "ActiveRecord is so hot right now!" - comment in 2006

Pop Culture Architecture is the current "fad" of the day. I have seen it be
microservices, business capabilities, CQRS, test driven development,
service-oriented architecture, ORMs, and ActiveRecord. Each of these have been
fashionable at some point.

Fashion is ultimately a signaling mechanism for status. We are attracted to
fashionable architectures because they signal we have worked on elite teams. The
more difficult or costly the trade-offs of the architecture, the more elite and
special our team must have been to implement it successfully.

## Example: Microservices

Microservices is a current fashionable design. Microservices have very clear
pros and cons. They come with the ability to have a huge team or a fragmented
deployment that potentially allows for horizontal scaling. For that ability, you
will pay the immense costs: loss of strong consistency and transactions, a
labyrinthine operational footprint and deployment, increased communication
effort, expensive integration testing, and a code base that takes longer to
program. [(1)](http://martinfowler.com/articles/microservice-trade-offs.html).

If you have a small team or system that does not need horizontal scaling on
every single component, a microservice architecture is unlikely to solve your
communication or trust issues. You will spend dollars on deployment, consistency
issues, distributed debugging, and basic programming just to save a penny on
communication and teamwork.
[(2)](http://www.stackbuilders.com/news/the-hidden-costs-of-microservices)

For most teams, the logical conclusion probably will be: a microservice
architecture solves problems we don't have.

Microservices remain fashionable because they indicate work at the size and
scale of a handful of elite companies. You would only likely encounter a couple
hundred companies in the world that have a development staff so large or loads
so high as to truly require such a system. Because of the rarity of actual need,
it is a perfect signaling mechanism for status.

Saying that you implemented a microservice architecture implies "my team was so
large or my product so popular, my team could afford to pay almost any cost to
meet the demand."

Carefully consider your architecture decisions. Do not allow fashion to dictate
your choices. Take pride in selecting the appropriate architecture for the
project, no matter how unpopular.
