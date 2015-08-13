---
layout: post
title: "SimpleMock: Language Agnostic Unit Test Mocking"
date: 2015-08-13 06:53
comments: true
categories: 
published: false
---

# What Is It?

Don't worry, SimpleMock isn't a library. Like many good things, SimpleMock is a
pattern. The SimpleMock pattern breaks the need for a mocking library.

My examples are in C# because that is what I got paid to write today: so it is
freshest in memory. SimpleMock works in any language with closures that can be
passed around by reference, so off the top of my head: C#, Java, F#, Scala, PHP,
C++, Ruby, and Python. I'm sure you can think of others.

# Benefits

The SimpleMock pattern promotes a better design of your abstractions and simpler
tests. The pattern also reduces boilerplate and the pollution of your production
code with testing concerns. Bombastic? Read on!

# The Normal Way

If you are familiar with unit testing, this part is probably boring. Feel free
to skip.

The traditional way of performing C# unit test mocking involves dependency
injection and interface mocking using a mocking library. For dependency
injection, it is common to use a tool like Ninject or hand-rolled constructor
injection. For mocking, a library like Moq or Rhino Mocks is standard. Here is
an example of a class and its testing code without any business logic.

```
public interface ICurrentTime {
    DateTime GetCurrentTime();
}

public class CurrentTime : ICurrentTime {
    public DateTime GetCurrentTime() {
        return DateTime.Now();
    }
}

public class Translator {
    private readonly ICurrentTime ct;

    public Translator() : this(new CurrentTime()) {}

    public Translator(ICurrentTime currentTime) {
        this.ct = currentTime;
    }

    public string Translate(string input) {
        return string.Format("{0}: {1}", ct.GetCurrentTime().ToString(), input);
    }
}

/// Test Code with Moq
[TestCase]
public void TestCurrentTimeTranslator () {
    var rightNow = DateTime.Now;
    var mock = new Mock<ICurrentTime>();

    mock.Setup(a=>a.GetCurrentTime()).Returns(rightNow);

    var sut = new Translator(mock.Object);

    var result = sut.Translate("test");

    Assert.AreEqual(rightNow.ToString() + ": test", result);
}

```

If you've done much C# unit testing, this should look familiar. We want to
inject some code that is potentially long-running or dynamic. We put that code
into a class, add an interface, then inject that interface into the class we
want to test. To test it, we mock the interface, creating a different concrete
class at test runtime which implements that interface. We can setup that mock to
respond with anything, which we use for assertions.

The problem is we have created a whole interface just for testing. Interfaces
are for polymorphism, but we don't really need polymorphism for this class. We
simply want to mock it. The constructor injection is also test code polluting
our business logic. If mocking was easier, we wouldn't even need that extra
boilerplate.

What we have done is create a very small and very primitive dispatch table. The
table has one row: something that has a function with the signature of
```() -> DateTime``` or, as it is known in C#: ```Func<DateTime>```.
Because the language requires fields put into a variable to have a matching
type, we need to make an interface to replace the real all at test runtime.
We will need to
make this primitive dispatch table for every single mock in every single class
we wish to test.

Because all we really care about is the ```Func<DateTime>``` signature, why not
simplify everything? C# has an incredible ability to create and pass around
lambdas and function pointers, what if we used those instead?

```
public class CurrentTime {
    public DateTime GetCurrentTime() {
        return DateTime.Now();
    }
}

public class Translator {
    private Func<DateTime> GetCurrentTime;

    public Translator() : this(new CurrentTime().GetCurrentTime) {}

    public Translator(Func<DateTime> getCurrentTime) {
        this.GetCurrentTime = getCurrentTime;
    }

    public string Translate(string input) {
        return string.Format("{0}: {1}", GetCurrentTime().ToString(), input);
    }
}

/// Test Code with just lambdas
[TestCase]
    public void TestCurrentTimeTranslator () {
    var now = DateTime.Now;

    var sut = new Translator(() => now);

    var result = sut.Translate("test");

    Assert.AreEqual(now.ToString() + ": test", result);
}

```

The test code becomes much simpler! No longer do we need the dependency on Moq,
or the relatively complicated setup logic. Instead we can simply inject the
lambda at runtime, replacing that pointer. We didn't need the whole interface,
really we just needed the simple signature of the function.

We can take it even a step further. Why use constructor injection at all? Since
all we really want is a single mutable dispatch table row, why make it harder to
read? If I hit "go to definition" on either the GetCurrentTime lambda or the
ICurrentTime interface from the first example, I'll not be taken to the actual
executing code. In both cases I'll be taken to an abstraction level, in one the
lambda, in the other the Interface. Let's make it easier to read and navigate.

```
public class CurrentTime {
    public DateTime GetCurrentTime() {
        return DateTime.Now();
    }
}

public class Translator {
    public Func<DateTime> GetCurrentTime = new CurrentTime().GetCurrentTime;

    public string Translate(string input) {
        return string.Format("{0}: {1}", GetCurrentTime().ToString(), input);
    }
}

/// Test Code with just inline lambdas
[TestCase]
public void TestCurrentTimeTranslator () {
    var now = DateTime.Now;
    var sut = new Translator();
    sut.GetCurrentTime = () => now;

    var result = sut.Translate("test");

    Assert.AreEqual(now.ToString() + ": test", result);
}
```

Now we've cleaned up to a single dispatch table line! "Go to definition" inside
the class now takes me to the actual line with the actual called function! We've
replaced a dependency on a class based interface with a function signature. The
function signature _is_ the interface!

You probably noticed we have lost something with this final pattern. We have
lost the ability to inject polymorphic behavior through the constructor. I have
found this is needed very rarely, making the simpler pattern a better tool to
grab for first. You can still inject polymorphic behavior by simply going back
to injecting the function in the constructor.

With this pattern, we have greatly simplified the code. The dispatch row is
clear and easy to read. We have removed a third party dependency. We have also
removed a lot of "test only" boilerplate in our production code.

The pattern also works well in isolation. You can convert one class can use this
pattern while the others continue to use whatever they did before. That will
give you a chance to see how it all works.

# SimpleMock Pattern

Lastly, I believe this pattern actually promotes a better design. We were using
the test pattern today and came into a more complicated situation. Take the
following code:

```
public class WorkDoer {
    internal Action<Thing> ignoreElements = new ThingIgnorer().IgnoreElements;
    internal Action<Thing> removeIgnoredElements = new ThingRemover().RemoveElements;

    public void IgnoreAndRemoveThings(Thing t1, Thing t2) {
        ignoreElements(t1);
        ignoreElements(t2);
        removeIgnoredElements(t1);
        removeIgnoredElements(t2);
    }
}

```

How would you check that each section was called? A naive solution is
complicated lambda with a "timesCalled" counter and an if statement to assert
against each argument, but it turns nasty quickly: 

```
/// Nasty test code
[TestCase]
public void TestWorkDoer () {
    var sut = new WorkDoer();

    var ignoredCalledTimes = 0;
    sut.ignoreElements = (t) => {
        ignoredCalledTimes++;
        if (ignoredCalledTimes == 1) {
            Assert.AreEqual(t1, t);
        } else {
            Assert.AreEqual(t2, t);
        }
    };
    var removedCalledTimes = 0;
    sut.removeIgnoredElements = (t) => {
        removedCalledTimes++;
        if (removedCalledTimes == 1) {
            Assert.AreEqual(t1, t);
        } else {
            Assert.AreEqual(t2, t);
        }
    };

    var t1 = new Thing();
    var t2 = new Thing();

    var result = sut.IgnoreAndRemoveThings(t1, t2);
    Assert.AreEqual(2, removedCalledTimes);
    Assert.AreEqual(2, ignoredCalledTimes);
}
```

Nasty. Hard to get right. More complicated than the real code. With a situation
like this, we have two easy options. Option one is to just use a third party
mocking library, replacing the functions from inside the test code. This gives
us access to all the sophisticated mocking tools available. Another option is to
look to reduce complexity of the production code.

In my experience using this pattern, heavy reliance on mocking libraries just
allows a worse design. Consider the code, what makes it so hard to test? Not
knowing which element is called when. Doing the same work on two parameters. I
would consider this a bad abstraction. Why not simplify?

```
public class WorkDoer {
    internal Func<Thing, Thing> ignoreElements = new ThingIgnorer().IgnoreElements;
    internal Func<Thing, Thing> removeIgnoredElements = new ThingRemover().RemoveElements;

    public List<Thing> IgnoreAndRemoveThings(List<Thing> ts) {
        ts.Select(t => removeIgnoredElements(ignoreElements(t)));
    }
}

/// Simple
[TestCase]
public void TestWorkDoer () {
    var sut = new WorkDoer();
    var expected = new Thing();
    var ts = new List<Thing>{new Thing()};

    sut.ignoreElements = (t) => new Thing();

    sut.removeIgnoredElements = (t) => {
        Assert.AreEqual(t, sut.ignoreElements(null));
        return expected;
    };

    var result = sut.IgnoreAndRemoveThings(ts);

    Assert.AreEqual(expected, result.First())
}
```

Much better! Yes, we had to change a few signatures. We get the same work done,
but now the code is actually a lot more useful. We can easily change any calling
functions, but now 
