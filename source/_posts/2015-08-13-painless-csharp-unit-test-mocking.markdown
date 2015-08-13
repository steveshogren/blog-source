---
layout: post
title: "Painless C# Unit Test Mocking"
date: 2015-08-13 06:53
comments: true
categories: 
published: false
---

Here is a very simple way to perform DI and unit test mocking in C#.

# The Normal Way

The traditional way of performing C# unit test mocking involves dependency
injection and interface mocking using a mocking library. For dependency
injection, it is common to use a tool like Ninject or hand-rolled constructor
injection. For mocking, a library like Moq or Rhino Mocks are standard. Here is
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
    private readonly ICurrentTime CurrentTime;

    public Translator() : this(new CurrentTime()) {}

    public Translator(ICurrentTime currentTime) {
        this.CurrentTime = currentTime;
    }

    public string Translate(string input) {
        return string.Format("{0}: {1}", CurrentTime.GetCurrentTime().ToString(), input);
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

If you've done much C# unit testing, this shouldn't look all that unfamiliar. We
want to inject some code that is potentially long-running or dynamic. We put
that code into a class, add an interface, then inject that interface into the
class we want to test. To test it, we mock the interface, creating a different
concrete class at test runtime which implements that interface. We can setup
that mock to respond with anything, which assert against. 

The problem is we have created a whole interface just for testing. Interfaces
are for polymorphism, but we don't want a different concrete class for that
ICurrentTime interface. We simply want to mock it. That constructor injection is
also test code polluting our business logic. If mocking was easier, we wouldn't
even need that extra boilerplate.

What we have done is create a very small and very primitive dispatch table. The
table has one row: something that has a function with the signature of
```DateTime GetCurrentTime()```. 


