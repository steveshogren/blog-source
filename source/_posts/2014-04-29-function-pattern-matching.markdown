---
layout: post
title: "Pattern Matching"
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

Pattern matching
or
"Let the Compiler Do the Work".

Pattern matching is a simple tool that will make your code safer and
easier to read.

Consider the following code that converts an Int to a string.

``` csharp
public enum Language {
    Spanish,
    English
}
public static string convert(int number, Language lang) {
    string ret = "";
    if (lang == Language.English) {
        switch(number) {
            case 0: ret = "zero"; break;
            case 1: ret = "one"; break;
            default: ret = "..."; break;
        }
    } else if (lang == Language.Spanish) {
        switch(number) {
            case 0: ret = "zero"; break;
            case 1: ret = "uno"; break;
            default: ret = "~~~"; break;
        }
    }
    return ret;
}
```

What happens when we make this simple change?

``` csharp
public enum Language {
    Spanish,
    English,
    German
}
``` 

Does the code still compile? Sure does! Does the compiler/IDE offer us
any indication that something is missing? Nope! Our code has a
potential bug that is only exposed at runtime, and nothing will tell
us that. We made it fail gracefully by ensuring our code always
returns at least an empty string, but we have created a bug that can
only really be caught by something external: either automated tests or
manual checking.

The OO purists and "Anti-If" guys are probably leaping out of their
seats. "Use classes and an interface!" they yell. Ok, sure. I assert
that it just makes things even worse.


``` csharp
	public interface ILanguage {
		String convert(int num);
	}
	public class Spanish : ILanguage {
		public String convert (int num) {
			var ret = "";
	        switch (num) {
				case 0: ret = "zero"; break;
				case 1: ret = "uno"; break;
				default: ret = "~~~"; break;
	        }
			return ret;
		}
	}
	public class English : ILanguage {
		public String convert (int num) {
			var ret = "";
	        switch (num) {
				case 0: ret = "zero"; break;
				case 1: ret = "one"; break;
				default: ret = "..."; break;
	        }
			return ret;
		}
	}
    // somewhere else...
    public static string convert(int x, Language lang) {
        switch (lang) {
            case Language.English: new English().convert(x) ; break;
            case Language.Spanish: new Spanish().convert(x) ; break;
            default: return "";
        }
    }
``` 

This is the least amount of code I could imagine to do this simple
thing and still have it be separated with an interface. We have turned
21 lines in one file into 33 in three files (not counting namespances
and imports). Does the compiler give us any warning when we add a new
concrete implementor? How about when we add a new enum value? This
code is even more likely to cause bugs, because now we have an
implicit coupling between the enum and the concrete class. The enum
and the concrete classes now both have to change together, they are
linked, and a change to one without changing the other will cause
unexpected things to happen.

Imagine if the compiler could warn us when either the enum or the
class changed. Imagine if instead of having to hunt down the possible
uses, we could just compile and fix the errors.

Good news, we can!

Check out this F# code. If you have never seen F# before, I know, it
looks completely crazy! It still looks a little weird to me, but just
try to read it. I think you will surprise yourself. This is also a
function called "convert", and if you keep in mind that the types
always come AFTER the value, the code makes a lot more sense. A
parameter in C# would be "int number"; in F# it is written
"number:Int". Don't ask me why. The "match number with" is just how
you do the equivalent to a "switch/case" in C#, but you will see in a
second it is a lot more powerful!

``` fsharp
let convert(number:Int, lang:Language) :string =
    match lang with
        | Language.English -> 
            match number with
               | 1 -> "one" 
               | 2 -> "two" 
               | _ -> "..."
``` 

We are using the same enum from the C# file, but it is missing
something, right? Where are the Spanish and German parts? I try to
compile this and what do I see?

```
~/Program.fs(11,11): Warning FS0025: Incomplete pattern
matches on this expression. For example, the value 'enum<Language>
(0)' may indicate a case not covered by the pattern(s). (FS0025)
```

Whoa! The compiler just caught a potential bug for me! A C# runtime
bug, the F# compiler catches! Not only is this very powerful, but it
is so simple. I can code the way I normally do, only now I get
additional checking for free! Heck, if you really want to keep your
classes and interfaces in C#, you can have some "glue code" in F#, and
still get this benefit!

``` fsharp
let convert(number, lang) =
    match lang with
        | Language.English -> English().convert(number)
```

This still calls the C# class above, only now the compiler gives us a
warning when we add a new enum value!

In this way, pattern matching is able to clearly remove edge
cases. What would otherwise be an unsafe "if" or "switch" statement can now be
checked for us automatically by the compiler!



