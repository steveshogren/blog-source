---
layout: post
title: "Pattern Matching Case Study"
date: 2015-03-14 09:42
comments: true
categories: 
---

Domain modeling is significantly easier and safer in F# than any other
.NET language. This is because of the increased safety of pattern
matching and the expressiveness of discriminated unions.

To illustrate this, I found some old code I'd written to interact with
a legacy system. The system uses many single enums on a record to keep
track of statuses. When one changes, it can cause others to change as
well.

Here is a typical function that combines two enums to recalculate a
third.

``` csharp
        public static PositionType GetPositionType (MovementType movementType, ApplyToParty applyToParty)
        {
            if ((movementType == MovementType.Deliver && applyToParty == ApplyToParty.Principal)
                || (movementType == MovementType.Return && applyToParty == ApplyToParty.Counterparty))
                return PositionType.Held;
            if ((movementType == MovementType.Return && applyToParty == ApplyToParty.Principal)
                || (movementType == MovementType.Deliver && applyToParty == ApplyToParty.Counterparty))
                return PositionType.Posted;

            return PositionType.Undefined;
        }
```

With some regularity, new records are added to these types of enums,
causing a dangerous search and update across the system fixing all the
if/else statements.

Right off the bat, pattern matching is a huge win here, taking a hard
to comprehend function and making the domain concepts clear.

``` fsharp
let GetPositionType = function
    | Deliver, Principal | Return, Counterparty -> Held
    | Return, Principal | Deliver, Counterparty -> Posted
    | MovementType.Undefined, _ | _, ApplyToParty.Undefined -> PositionType.Undefined
```

If we add a new status to either of these, we will get a compiler
warning in every place letting us know. If that alone was the win,
we'd be still be ahead by a lot. The domain is so clear here, I can
print this code out and hand it to my BA to ensure the logic is
correct.

Next though, this got me thinking. Why does this set of three enums
have to be calculated? Why are they even separate? Ah, of course,
right now they are stored in the database and ORM objects, each with a
separate field and set of enum ids. Changing that would be costly.

What I want is a domain layer a level higher than the typical database
ORM classes, something to convert my ORM classes into that will be
able to do work in a safer way.

Rather than three enums that are supposed to change in lock step (but
might get out of date), I really want a concept of the three combined
and "frozen" together.

``` fsharp
type Direction = 
    | Held_Deliver_Principal
    | Held_Return_Counterparty
    | Posted_Return_Principal
    | Posted_Deliver_Counterparty
    
let GetDirection = function
   | Deliver, Principal  -> Held_Deliver_Principal
   | Return, Counterparty -> Held_Return_Counterparty
   | Return, Principal -> Posted_Return_Principal
   | Deliver, Counterparty -> Posted_Deliver_Counterparty
``` 

Now I have a combined Direction that merges the three concepts into
one. It is impossible with this new merged type to have an invalid
state across the three. Getting any of the types back out to save to
the database or do some work is as simple as another match:

``` fsharp
let GetSendFn = function
   | Held_Deliver_Principal | Posted_Return_Principal -> SendMessageToPrincipal
   | Held_Return_Counterparty | Posted_Deliver_Counterparty -> SendMessageToCounterparty
```

While it is possible to make an equivalent C# enum and combine these
in a similar way, it is inherently unsafe and therefore appropriately
uncommon. The fewer conversions done in C# the better, as converting
sets of data from one shape to another creates more points where the
application can fail in the future when enums change. Additionally,
using enums to switch for business rules is dangerous, as it is so
common to miss one. Traditional thought would be to use a class to
dispatch, but something still has to switch case, either in the class
or at the time of class instantiation, and that is a vector for
errors.

Because F# interops so well with C#, it is possible to build in a
domain layer in F# immediately that calls down to your C# ORM
classes. Converting from a set of dangerous C# enums into a
constrained and safe F# discriminated union is easy and will simplify
your domain to its essence.

For reasons like this, when I have to build something with a rich
domain, I grab for F#. F# continues to be one of my favorite languages
best suited to get done lots of high quality work.


