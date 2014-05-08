---
layout: post
title: "Good Design, Java, or TDD. Pick two."
date: 2014-05-06 12:05
comments: true
categories: 
- Programming
tags:
- programming
status: publish
type: post
published: true
---

Every codebase I have seen or heard of that uses dependency injection
for all dependencies also performs strict test driven development. Why
is that?  What about unit testing and DI are so linked?

You cannot have unit testing in Java/C# without dependency injection.

If you see a codebase in Java/C# that has ten injected classes, right
there, you have a codebase that does heavy unit testing. If you are
deep into the unit testing culture, you will have been told to say,
"but it is good design to use DI everywhere!" Is it really? Do the
contortions required to do DI make your code easier to
use/reuse/refactor? Or do you do it because you have to? Can you think
of a single time where DI made anything easier?

The TDD proponents realized that you cannot perform unit testing
without DI in Java/C#, and so they have convinced us that a completely
dependency injected codebase is a good design. In reality, DI for unit
testing is a hack because Java/C# are so ill-suited to unit testing.

For example, how would we unit test a function that talks to the
database in C# without a framework that requires mappings and global
singletons? We would put an interface around the database connection,
then pass it into the constructor through an optional parameter. Our
test would then make another implementor of that interface, and pass
it in when testing. This is par for the course in Java as well.

``` csharp
// DBConnection.cs
public interface IDBConnection { }
public class DBConnection : IDBConnection{ }

// RepositoryFactory.cs
using System;
using System.Collections.Generic;
using System.Configuration;
using Helpers;

namespace Repositories
{
	public class RepositoryFactory {
		IDBConnection con;
		public RepositoryFactory(IDBConnection con) {
			this.con = con;
		}
		public RepositoryFactory() : this(new DBConnection()) { }
        public void Insert(string sql) {
            this.con.Execute(sql);
        }
	}
}
``` 

Tests grow in maintenance difficulty with the size of the function
being tested. Often this leads to a design with many small
one-function classes. Rather than having a single reason to change,
these classes have a single reason to "test". Usually, such a design
will have several classes in a row that each only calls the next. This
"chain" of classes together are cohesive, but instead of being a
single class together, they are all split apart. Such a functional
design would normally be fine, except every function needs a twenty line
wrapper of namespaces, imports, interfaces, and constructors.

Comparatively, in languages like Javascript, Ruby, and Clojure,
replacing a function for testing is easy! Every function does not need
a twenty-line wrapper, instead we simply replace the function we want
to "inject" with a new function. Here is an example in Javascript:

``` javascript
function Insert(sql) { getConnection().Execute(sql);}
function getConnection() { return new DatabaseConnection(); }

// "Mock" the getConnection function in a unit test
getConnection = function() { return { Execute: function(sql) {}}};
```

I am now able to test my "Insert" function without being afraid of it
calling any other dependencies. My design can take whatever shape
best fits the problem.