$('#lang').on('change', function(){
    $("#lang option").each(function() {
        $('#' + $(this).val()).hide();
    });
    $('#' + $(this).val()).show();
});

var tableApp = angular.module('TableApp', []);

tableApp.controller('TableCtrl', function ($scope) {
    $scope.score = function(t){
        if (typeof t.humanScore !== "undefined") {
            return t.humanScore;
        } else {
            return t.rawCode.length;
        }
    };

    $scope.totalscore = function(l){
        return $scope.score(l.nullField) +
            $scope.score(l.nullList) +
            $scope.score(l.wrongVaribleType) +
            $scope.score(l.missingListElem) +
            $scope.score(l.wrongCast) +
            $scope.score(l.wrongTypeToMethod) +
            $scope.score(l.missingMethodOrField) +
            $scope.score(l.missingEnum) +
            $scope.score(l.variableMutation) +
            $scope.score(l.deadLocks) +
            $scope.score(l.memoryDeallocation) +
            $scope.score(l.recursionStackOverflow) +
            $scope.score(l.consistentCodeExecution); };

    $scope.languages = [
        {
            missingEnum: {
                humanScore: 30,
                enforced: false,
                desc: "For example, using a switch-case in C# to dispatch on an enum value. If you add a new value, the compiler does nothing, so no safety. It isn't idiomatically possible to prevent this error."
            },
            recursionStackOverflow: {
                humanScore: 30,
                enforced: false,
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm."
            },
            nullList: {
                enforced: false,
                desc: "Same check as for a null field.",
                rawCode: "if (l != null) {<!consequent!>} else {<!alternative!>}"
            },
            deadLocks: {
                humanScore: 30,
                enforced: false,
                desc: "As far as I know, there is provide any way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored."
            },
            missingMethodOrField: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            wrongVaribleType: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            name: "C#",
            consistentCodeExecution: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: false,
                desc: "",
                rawCode: "if (l.Count() > i) {<!consequent!>} else {<!alternative!>}"
            },
            wrongTypeToMethod: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            variableMutation: {
                enforced: false,
                desc: "For example, I pass data to a function, will the data come back the same as I passed it, or will it have mutated in some way? To prevent this, in C#, we would idiomatically make a new class and make the field readonly.",
                rawCode: "public class T {readonly <!type!> n; public T(<!type!> i) {n = i;}}"
            },
            markupName: "csharp",
            memoryDeallocation: {
                humanScore: -30,
                enforced: true,
                desc: "Handled by garbage collector."
            },
            comment: "//",
            wrongCast: {
                enforced: false,
                desc: "",
                rawCode: "var m = o as T; if (m != null) {<!consequent!>} else {<!alternative!>}"
            },
            nullField: {
                enforced: false,
                desc: "It is possible to use the ternary operator as well, but a quick StackOverflow search shows a lot of comments cautioning against using them 'too much', so we will count the traditional 'if-else' for the most idiomatic way of checking if the field is null before using it.",
                rawCode: "if (l != null) {<!consequent!>} else {<!alternative!>}"
            }
        },
        {
            missingEnum: {
                humanScore: 0,
                enforced: false,
                desc: "The compiler offers this as a warning with no extra code (but it is not enforced)."
            },
            recursionStackOverflow: {
                humanScore: -30,
                enforced: true,
                desc: "F# recursive functions calls are converted into loop constructs by the compiler automatically."
            },
            nullList: {
                humanScore: -30,
                enforced: true,
                desc: "In F#, the idiomatic list cannot be made null by the compiler, so there is no check."
            },
            deadLocks: {
                humanScore: 30,
                enforced: false,
                desc: "As far as I know, there is provide any way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored."
            },
            missingMethodOrField: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            wrongVaribleType: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            name: "F#",
            consistentCodeExecution: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: false,
                desc: "",
                rawCode: "if l.Count() > i then <!consequent!> else <!alternative!>"
            },
            wrongTypeToMethod: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            variableMutation: {
                humanScore: 0,
                enforced: false,
                desc: "In F# we idiomatically would use whatever fit the need most: an existing class, a let bound primitive, a tuple, etc rather than make a whole class just for the immutability. F# class fields and values are immutable by default, so nothing extra."
            },
            markupName: "fsharp",
            memoryDeallocation: {
                humanScore: -30,
                enforced: true,
                desc: "Handled By Garbage Collector."
            },
            comment: "//",
            wrongCast: {
                enforced: true,
                desc: "",
                rawCode: "match o with | :? T as m -> <!consequent!> | _ -> <!alternative!>"
            },
            nullField: {
                enforced: true,
                desc: "In F#, it is idiomatic to use Option instead of null (most classes cannot be made null without special effort). The FSharpx library function 'sequential application' written: (<*>) automatically tests for Some or None, and applies the consequent only if the value is Some, otherwise returning a default alternative of None.",
                rawCode: "<!consequent!> <*> l"
            }
        },
        {
            missingEnum: {
                humanScore: 30,
                enforced: false,
                desc: "No way to idiomatically check."
            },
            recursionStackOverflow: {
                enforced: false,
                desc: "Clojure provides a syntax for tail-call opimization, called loop/recur.",
                rawCode: "(loop [<!params!>] (recur <!args!>))"
            },
            nullList: {
                humanScore: -30,
                enforced: true,
                desc: "In Clojure, the default iteration functions: map, reduce, filter all check and return an empty list if nil, so no need for a check."
            },
            deadLocks: {
                humanScore: -30,
                enforced: true,
                desc: "The STM and agent model built into the language cannot deadlock, and data is immutable or changes are queued."
            },
            missingMethodOrField: {
                humanScore: -30,
                enforced: true,
                desc: "Clojure, the language checks for this before runtime."
            },
            wrongVaribleType: {
                enforced: false,
                desc: "In Clojure, the closest thing to a variable is a let bound function or an atom, and neither can be annotated by default. A wrapping call to 'instance?' will give a runtime error.",
                rawCode: "(instance? c x)"
            },
            name: "Clojure",
            consistentCodeExecution: {
                humanScore: 30,
                enforced: false,
                desc: "Clojure macros can prevent parameters from executing at all by rewriting the call, and it is impossible to prevent."
            },
            missingListElem: {
                enforced: false,
                desc: "Clojure's 'get' also gets values out of lists by index.",
                rawCode: "(get i <!list!> <!default-value!>)"
            },
            wrongTypeToMethod: {
                humanScore: 0,
                enforced: false,
                desc: "In Clojure, parameters can be annotated with a type, which is checked at runtime: "
            },
            variableMutation: {
                humanScore: -30,
                enforced: true,
                desc: "In Clojure, anything you would pass is immutable, so no check and enforced by the language before runtime."
            },
            markupName: "clojure",
            memoryDeallocation: {
                humanScore: -30,
                enforced: true,
                desc: "Handled by garbage collector."
            },
            comment: ";;",
            wrongCast: {
                enforced: false,
                desc: "Requires a try/catch block around the primitive cast function.",
                rawCode: "(try (<!T!> o) (catch Exception e <!alternative!>))"
            },
            nullField: {
                enforced: false,
                desc: "In Clojure, it is idiomatic to put data or functions inside primitive data structures like a hashmap. Retrieval and execution would likely use 'get' which checks for nil by default.",
                rawCode: "(get l <!lookup-keyword!> <!default-if-missing!>)"
            }
        },
        {
            missingEnum: {
                humanScore: 30,
                enforced: false,
                desc: "No way to idiomatically check."
            },
            recursionStackOverflow: {
                humanScore: 30,
                enforced: false,
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm."
            },
            nullList: {
                enforced: false,
                desc: "Same check as for a null field.",
                rawCode: "if (l !== null) {<!consequent!>} else {<!alternative!>}"
            },
            deadLocks: {
                humanScore: 0,
                enforced: true,
                desc: "Javascript is single threaded, and uses a queue for asynchronous execution responses like from calls to Ajax methods. As such, deadlocks are not possible by design. Javascript therefore is restricted in its abilities, but this is about categorizing safety only."
            },
            missingMethodOrField: {
                enforced: false,
                desc: "It is common to use the OR statement to get a field OR something else if it isn't there or empty.",
                rawCode: "t.f || <alternative>"
            },
            wrongVaribleType: {
                humanScore: 30,
                enforced: false,
                desc: "No real idiomatic way to check."
            },
            name: "JavaScript",
            consistentCodeExecution: {
                humanScore: -30,
                enforced: true,
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: false,
                desc: "",
                rawCode: "if (l.length > i) {<!consequent!>} else {<!alternative!>}"
            },
            wrongTypeToMethod: {
                humanScore: 30,
                enforced: false,
                desc: "No real idiomatic way to check."
            },
            variableMutation: {
                enforced: false,
                desc: "The Immutabile.js library offers a simple set of tools for adding in immutability, under the Immutabile namespace.",
                rawCode: "Immutable.Map(<!object!>)"
            },
            markupName: "javascript",
            memoryDeallocation: {
                humanScore: -30,
                enforced: true,
                desc: "Handled By Garbage Collector."
            },
            comment: "//",
            wrongCast: {
                humanScore: 30,
                enforced: false,
                desc: "No real idiomatic way to check."
            },
            nullField: {
                enforced: false,
                desc: "Javascript the common pattern is to check if something is there with an OR statement.",
                rawCode: "if (l !== null) {<!consequent!>} else {<!alternative!>}"
            }
        }
    ];
});
