---
layout: post
title: "Inverted Polymorphism with Pattern Matching"
date: 2014-04-28 22:05
comments: true
categories: 
- Programming
tags:
- programming
status: publish
type: post
published: true
---

In my last post we saw how powerful the `match` statement is in
F#. Using `match` allows the compiler to give us warnings for missing
cases, no matter what the type.

Let's look at how pattern matching changes our design, allowing for an
inversion of the usual OO way of polymorphism. Here is an example that
is probably familiar to everyone: getting a database connection.

``` csharp
	public interface IPaymentRepository {
		IEnumerable<IPayment> GetAll ();
	}
    // InMemory.cs
	public class InMemory : IPaymentRepository {
		public IEnumerable<IPayment> GetAll (){
			return Config.payments.Values;
		}
	}
    // Postgres.cs
	public class Postgres : IPaymentRepository {
		public IEnumerable<IPayment> GetAll (){
			throw new NotImplementedException();
		}
	}
    // RepositoryFactory.cs
	public class RepositoryFactory {
		public static IPaymentRepository GetPaymentRepo () {
			if (Config.configuration["useInMemory"] == "true") {
				return new InMemory();
			} else {
				return new Postgres();
			}
		}
	}

    // somewhere in the code...
    var repo = RepositoryFactory.GetPaymentRepo();
    var payments = repo.GetAll();
```

In our example here, we have two concrete implementors of the
`IPaymentRepository`, each one with their own implementations. This is
a typical OO way to deal with polymorphism. Usually, "best practices"
would put each of these classes in their own files.

Let's look at how we would invert the polymorphism of the C# classes
and interfaces to use pattern matching.

``` fsharp
type PaymentRepository = 
   | InMemory
   | Postgres

let GetAll = function
    | InMemory -> Config.payments.Values;
    | Postgres -> raise(NotImplementedException())
        
let GetPaymentRepo = 
    match Config.configuration.["useInMemory"] with
        | "true" -> InMemory
        | _ -> Postgres 

// somewhere in the code ...
let repo = Payments.GetPaymentRepo
let payments = Payments.GetAll repo
```

Notice how we separated our behavior from our types? The
`PaymentRepository.InMemory` and the `PaymentRepository.Postgres` now
are just empty types, much like an `Enum`. We are still able to get
polymorphic behavior from them, using `match`. 

But why would we want to store our behavior separate from the type?

By storing the behavior separate from the type, changes that effect a
single behavior (adding a new function, changing a function's api,
removing a function) are easier, because they are all grouped
together. A change to the api of the `GetAll` function is harder in
the traditional OO interface structure, requiring modifying several
files.

Similarly, a change requiring adding a new type is difficult in a
pattern matching structure, as it will require finding every pattern
match and adding in the additional case. Thankfully, the F# compiler
checks both pattern matches and interfaces for us, letting us use the
best tool for the job!

As to safety, adding a new type is easy with interfaces, but the
developer is left without assistance to find all places the concrete
classes are instantiated and add the new type. Niether compiler will
offer any warnings for a new interface subclass. For pattern matching
polymorphism, the compiler will warn that there are missing cases
every place a change needs to be made. So while harder to add a new
type with pattern matching, it is safer.

|| Adding a Type  | Modifying Behavior |
|------------- |------------- | ------------- |
|**OO Interfaces/Classes**  |  Easier / Less Safe  | Harder / Safe 
|**Pattern Matching Types**  |  Harder / Safe  | Easier / Safe

<br />
I almost always find myself modifying the functions of an
interface more than I find myself adding new types. For that typical
use case, pattern matching is probably the better choice.

Consider the change where we want to add a new function to the
`IPaymentRepository` interface and change the location of the in
memory dictionary to be stored internally. In the interfaces and
classes example, that requires editing _three separate files_.

``` csharp
    // IPaymentRepostory.cs
	public interface IPaymentRepository {
		IEnumerable<IPayment> GetAll ();
		void Add(IPayment payment);
	}
    // InMemory.cs
	public class InMemory : IPaymentRepository {
		public Dictionary<int, IPayment> payments = new Dictionary<int, IPayment>();
		public void Add(IPayment payment) {
			payments.Add(payment.GetId(),payment);
		}
		public IEnumerable<IPayment> GetAll (){
			return payments.Values;
		}
	}
    // Postgres.cs
	public class Postgres : IPaymentRepository {
		public void Add(IPayment payment) {
			throw new NotImplementedException();
		}
		public IEnumerable<IPayment> GetAll (){
			throw new NotImplementedException();
		}
	}
```

Here is the change to add a new function in the pattern matching example:

``` fsharp
type PaymentRepository = 
   | InMemory of Dictionary<int, IPayment>
   | Postgres

let Add db (payment:IPayment) = 
    match db with
        | InMemory payments -> payments.Add(payment.GetId(),payment);
        | Postgres -> raise(NotImplementedException())

let GetAll = function
        | InMemory payments -> payments.Values;
        | Postgres -> raise(NotImplementedException())
```

In case you were concerned that these F# types do not have any state,
they actually can have fields just like regular classes. Notice the
`Dictionary<int, IPayment>` next to the `InMemory` type? That is a
field! The new field does not need to be named until used in a pattern
match, so the only time it is named is `payments` inside the `Add` and
`GetAll` functions after we pattern match `InMemory`. In fact, if we
didn't add it in the pattern match, the compiler would give us a
warning!

Between the options of traditional interfaces verses pattern matching,
neither way is truely the best for every circumstance: each comes with
a trade-off. I liken the trade-offs to the "grain of the
data". Whichever way your system is likely to change the most, that is
the way you want to optimize your type. The good news is: in F# you
can have a mix of both, and it is relatively easy to convert back and
forth depending on how your system is changing the most.

Personally, I find F# pattern matching to be significantly easier to
read. The same code in C# requires twice the lines in three separate
files, which adds a complexity burden that brings no benefit. The F#
code is safer, smaller, and easier to read than the C# equivalent.

If you write code in C# or VB.NET right now, you could add in a
project in F# today. All three languages are callable from the other
two, so you could start by breaking out a small library that uses
these feature immediately. F# modules and classes are callable from C#
just like any other DLL library. In my mind, this is what sets F#
apart from other languages: it is more powerful and safe than C#, but
with high performance and interoperability with existing C# libraries.

If you want additional reading on the topic of polymorphism, check out
<a href="http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-17.html#%_sec_2.4">section 2.4</a> in SICP.
