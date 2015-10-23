module T.Tests

let asserter (x:obj) (y:obj) = if x = y then printf "." else printf "F (%A != %A)" x y

let saveSum x = printfn "called save: %A" x


type TestFakeRecord = {timesCalled:int;
                       args: obj list}

let makeFake_OneArg () =
  let result = ref {TestFakeRecord.timesCalled = 0; args = []}
  let fake = (fun p1 ->
              result := {timesCalled = (!result).timesCalled + 1;
                         args = p1 :: (!result).args}
              ())
  (fake, (fun () -> !result))

let addAndSave' saveSum x y =
  let sum = x + y
  saveSum sum
  sum
let addAndSave = addAndSave' saveSum

// Test code
let addAndSave_Test() =
  let (fakeSave, fakeSaveCalling) = makeFake_OneArg()
  let result = addAndSave' fakeSave 1 2
  asserter 3 result
  asserter 3 (fakeSaveCalling().args.[0])
  asserter 1 (fakeSaveCalling().timesCalled)

addAndSave_Test()
