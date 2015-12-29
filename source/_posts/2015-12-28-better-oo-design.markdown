---
layout: post
title: "Better OOP Design"
date: 2015-12-28 17:43:04 -0500
comments: true
categories: 
- technical skills
---

Unit testing in C# forces a functional program architecture. The architecture
and design of a unit-tested C# codebase will have more in common with a Lisp
codebase than with a Java codebase. While this may seem unwanted, it actually is
a indication of a design that is easier to test and understand.

Let's first agree on the terms. Pulled from the Wikipedia page on [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming#Encapsulation).

* **Encapsulation** - When a class disallows calling code from accessing
  internal object data and forces access through methods only.
* **Composition** - Objects can contain other objects in their instance
  variables; this is known as object composition.
* **Inheritance** - This allows classes to be arranged in a hierarchy that
  represents "is-a-type-of" relationships. All the data and methods available to
  the parent class also appear in the child class with the same names.
* **Polymorphism** - Subtyping, a form of polymorphism, is when calling code can
  be agnostic as to whether an object belongs to a parent class or one of its
  descendants.

The following code sample shows a real (but sanitized) class that was not unit
tested. The dependencies are in-line, since there is no need to replace them for
polymorphism or unit test mocking.

```csharp

public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;

    public User(int id, string name) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
    }

    public string MakeDropDownHtml() {
        if(isCustomer == true) {
            return String.Format("<option id="{0}">*{1}*</option>", id, name);
        }
        return String.Format("<option id="{0}">{1}</option>", id, name);
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        new Notifier().Broadcast("CustomerConverted", this.Id);
    }
}
```

This class is very difficult to test. Code that is hard to test also is harder
to reuse. Consider the function ```MakeDropDownHtml```. It cannot be reused
because it is inside the User class. It is also hard to test, because it
requires setting up the User class with correct fields. Because the fields are
encapsulated, both paths of ```MakeDropDownHtml``` can only be tested by also
called ```ConvertToCustomer```, which directly appears to broadcast a message.
The tests become more complicated and harder to get right.

The typical response to the above code is to inject the "verbs" via an
interface. This is a worse design for three main reasons. One, interfaces are
only used for unit testing, instead of for actual polymorphism. Two, neither
function inside of the ```User``` class can be reused. Three, we've allowed
testing concerns to mix in with our production code. Instead of polymorphism and
code reuse, we have tight coupling and polluted code.

```csharp
pubic interface INotifier {
    void Broadcast(String type, int id);
}
public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;
    private INotifier notifier;

    // INotifier interface only has one concrete implementor
    // and is hard-coded inside the class
    public User(int id, string name) : this(id, name, new Notifier()) {}

    public User(int id, string name, INotifier n) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
        this.notifier = n;
    }

    public string MakeDropDownHtml() {
        if(isCustomer == true) {
            return String.Format("<option id="{0}">*{1}*</option>", id, name);
        }
        return String.Format("<option id="{0}">{1}</option>", id, name);
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        this.notifier.Broadcast("CustomerConverted", this.Id);
    }
}
```

Better Unit Testing Design

* 1- Depend on Functions Over Interfaces
* 2- Interface Nouns Over Verbs
* 3- Separate Nouns From Verbs Via Interfaces
* 4- Verbs Depend on Nouns
* 5- Composition Over Inheritance

Here is the same class, broken up for unit testing following the "Better Unit
Testing Design"

```csharp
public interface DropDownItem {
    string Name {get;}
    int Id {get;}
    boolean MarkPreferred {get;}
}
// 2- Interface Nouns Over Verbs
// 3- Separate Nouns From Verbs Via Interfaces
public class User : DropDownItem {
    public string Name {get; private set;}
    public int Id {get; private set;}
    public boolean MarkPreferred {get { return this.IsCustomer;}}
    public boolean IsCustomer;
    public DateTime ConversionDate;

    public User(int id, string name, boolean isCustomer, DateTime converstionDate) {
        this.Name = name;
        this.Id = id;
        this.IsCustomer = isCustomer;
        this.ConverstionDate = converstionDate;
    }
}

public class HtmlHelpers {
    // 3- Separate Nouns From Verbs Via Interfaces
    // 4- Verbs Depend on Nouns
    public string MakeDropDownHtml(DropDownItem item) {
        if(item.MarkPreferred == true) {
            return String.Format("<option id="{0}">*{1}*</option>", item.Id, item.Name);
        }
        return String.Format("<option id="{0}">{1}</option>", item.Id, item.Name);
    }
}

public class CustomerConverter {
    // 1- Depend on Functions Over Interfaces
    // 5- Composition Over Inheritance
    internal Action<string, int> broadcast = new Notifier().Broadcast;

    // 4- Verbs Depend on Nouns
    public void ConvertToCustomer(User user) {
        user.IsCustomer = true;
        user.ConversionDate = DateTime.Now;
        broadcast("CustomerConverted", user.Id);
    }
}
```

