module Tests

let asserter x y = if x = y then printf "." else printf "F (%A != %A)" x y

let saveSum x = printfn "called save: %A" x

let addAndSave_ saveSum x y =
  let sum = x + y
  saveSum sum
  sum
let addAndSave = addAndSave_ saveSum

// Test code
let addAndSave_Test() =
  let calledVar = ref 0
  let result = addAndSave_ (fun sum -> calledVar := sum) 1 2
  asserter 3 result
  asserter 3 !calledVar

  // addAndSave 2 1 |> printfn "returned: %A"
addAndSave_Test()

