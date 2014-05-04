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
			if (Config.configuration["database"] == "inmemory") {
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
    match Config.configuration.["database"] with
        | "inmemory" -> InMemory
        | "postgres" -> Postgres 

// somewhere in the code ...
let repo = Payments.GetPaymentRepo
let payments = Payments.GetAll repo
```

Notice how we separated our behavior from our types? The
`PaymentRepository.InMemory` and the `PaymentRepository.Postgres` now are just empty
types, much like an `Enum`. We are still able to get polymorphic
behavior from them, using `match`! But why would we want to store our
behavior separate from the type?

By storing the behavior separate from the type, changes that effect a
single behavior (adding a new function, changing a function's api,
removing a function) are easier, because they are all grouped
together. A change to the api of the `GetAll` function is harder in
the traditional OO interface structure, requiring modifying several
files. That same change an a pattern matching structure is very easy,
only requiring changes to a few lines of code.

Similarly, a change requiring adding a new type is difficult in a
pattern matching structure, as it will require finding every pattern
match and adding in the additional case. Without the power of the
compiler to find missing cases, the pattern match dispatch is
dangerous: it would be easy to miss a case. For the same reason, if
the compiler did not verify that all implementors of an interface were
valid, interfaces would be dangerous to change. Thankfully, the F#
compiler checks both for us, letting us use the best tool for the job!

|| Modifying a Type  | Modifying Behavior |
|------------- |------------- | ------------- |
|**OO Interfaces/Classes**  |  Easier  | Harder 
|**Pattern Matching Types**  |         Harder  | Easier 

<br />
I almost always find myself modifying the functions of an
interface more than I find myself adding new types. Anecdotally, I
find that most often the changes I make are: adding new dependencies,
changing the return type, or adding a new parameter that one of the
subclasses need. For that use case, pattern matching is probably the
better choice.

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

In the pattern matching example, all the behavior for the types are in
one file, but we could just as easily write it anywhere. Since the
compiler will warn us if there are any missing cases, if in the future
we add a new type to PaymentRepository, all the places in the code
that are missing that type will show up in the warning list. This of
course would require editing every file that has a pattern match on
the PaymentRepostiory.

In case you were concerned that these F# types do not have any state,
they actually can have fields just like regular classes. The new field
does not need to be named until used in a pattern match, so the only
time it is named is `payments` inside the `Add` and `GetAll`
functions.

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

let GetPaymentRepo = 
    match Config.configuration.["database"] with
        // adding the empty dictionary to the InMemory type constructor
        | "inmemory" -> InMemory(new Dictionary<int, IPayment>())
        | "postgres" -> Postgres 
```

Between the options of traditional interfaces verses pattern matching,
neither way is truely the best for every circumstance: each comes with
a trade-off. I liken the trade-offs to the "grain of the
data". Whichever way your system is likely to change the most, that is
the way you want to optimize your type. The good news is: in F# you
can have a mix of both, and it is relatively easy to convert back and
forth depending on how your system is changing the most.

If you want additional reading on this topic, check out <a
href="http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-17.html#%_sec_2.4">section 2.4</a> in SICP.
