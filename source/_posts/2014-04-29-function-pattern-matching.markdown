---
layout: post
title: "Pattern Matching - Make Compiler Work for You"
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
            case 0: rte = "zero"; break;
            case 1: rte = "uno"; break;
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
potential bug that is only exposed at run-time, and nothing will tell
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
21 lines in one file into 33 in three files (not counting namespaces
and imports). Does the compiler give us any warning when we add a new
concrete implementation? How about when we add a new enum value? This
code is even more likely to cause bugs than the first, because now we
have an implicit coupling between the enum and the concrete class. The
enum and the concrete classes now both have to change together, they
are linked, and a change to one without changing the other will cause
unexpected things to happen. We could go without the enum, but
SOMETHING still has to say which concrete class to instantiate, and
enums are easy enough to store in a database or a config file.

Imagine if the compiler could warn us when either the enum or the
class changed. Imagine if instead of having to hunt down the possible
uses, we could just compile and fix the errors.

Good news, we can!

Check out this F# code. If you have never seen F# before, I know, it
looks completely crazy! It _still_ looks a little weird to me, but
just try to read it. I think you will surprise yourself. This is a
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

Spittake mushroom soup, the compiler just caught a potential bug for
us! A C# run-time bug no less! Not only is this very powerful, but it
is so simple. I can code the way I normally do, only now I get
additional safety for free! And no unit or integration test would ever
catch this class of errors. 

Heck, if you really want to keep your classes and interfaces in C#,
you can have some "glue code" in F#, and still get all the benefit!

``` fsharp
let convert(number, lang) =
    match lang with
        | Language.English -> English().convert(number)
```

This still calls the C# class above, and now the compiler gives us a
warning when we add a new enum value!

In this way, pattern matching is able to clearly remove edge
cases. What would otherwise be an unsafe "if" or "switch" statement
can now be checked for us automatically by the compiler!

BONUS ROUND!

If we left the pattern matching in for the numbers but changed the
patterns matched to have a "when" which only matches when the
condition is true:

``` fsharp
let convert(number, lang) =
    match lang with
        | Language.English -> 
            match number with 
                | x when x > 5 -> "Large!"
                | 0 -> "zero"
        | Language.Spanish -> 
            match number with 
                | x when x > 5 -> "Grande!"
                | 0 -> "zero"
``` 

Running the compiler again give us:

```
/home/jack/programming/monads-fsharp/monads-fsharp/Program.fs(19,19):
Warning FS0025: Incomplete pattern matches on this expression. For
example, the value '1' may indicate a case not covered by the
pattern(s). However, a pattern rule with a 'when' clause might
successfully match this value. (FS0025) (monads-fsharp)
```

That's right, it checks numbers too. It was able to detect that the
"value '1' may not be covered by the pattern(s)." The compiler is able
to detect all manner of missing cases in a pattern match
expression. It can even detect a missing match in something more
complicated:

``` fsharp
let convert(number, lang) =
    match lang, number with
        | Language.English, 0 -> "zero" 
        | Language.English, 1 -> "one"
        | Language.English, x when x > 1 -> "Larger than one!"
        | Language.English, _ -> "dunno"
        | Language.Spanish, 0 -> "zero" 
        | Language.Spanish, x when x > 5 -> "Grande!"
``` 

Here we introduce the "_" which is equivalent to a "default" in a C#
"switch/case" statement. The bug in the code here is the missing
Language.Spanish with numbers 1-5. The compiler dutifully points out
the missing case: "(_, 1)", indicating that some combination of a
Language with the number 1 is likely to be missing. While not able to
perfectly detect which Language it is, the fact that it detects it at
all is astonishingly helpful. Imagine how much safer this makes all
conditionals! This is a truely type aware "switch/case" that will give
compiler warnings whenever a new type is introduced.

If you are not convinced at this point that pattern matching is a big
step forward in the safety and ease of development, I am not sure what
else would convince you. While not always perfect, pattern matching is
a good demonstration of the increased safety of having a more powerful
compiler. More safety means less time spent tracking down bugs and
more time adding on features!
