---
layout: post
title: "Haskell is the Dark Souls of Programming"
date: 2016-02-06 11:22:29 -0500
comments: true
categories: 
- haskell
- Technical Skills
published: true
---

HUMOROUS POST AHEAD. Please don't hit me, Haskell does a great job of that
already.

{% img center solaire /images/altar_of_sunlight.gif 500 'solaire' 'solaire' %}

I decided to start the next version of my safety score posts. This time,
however, I decided to do it in Haskell. I love Haskell for the same reasons I
love Dark Souls. Fantasic and inscrutable lore, a great <del>combat</del> type
system, a cliff-wall difficulty curve, and unending punishment.

I want to collect a some statistics from the GitHub API. Follow along as I
retrace my steps attempting the Tomb of the Dread HTTPS GET Request.

### Step One - Stack (aka Pride Comes Before The Fall)

I download stack and start a project:

```
> cd /home/jack/programming && stack new github-stats && cd github-stats
Downloading template "new-template" to create project "github-stats" in github-stats/ ...
 ......
All done.
```

So far so good. Does it work? 

``` 
  > stack build && stack exec -- github-stats-exe 
   github-stats-0.1.0.0: configure
   ..... 
   Registering github-stats-0.1.0.0...
   someFunc
```

Awww yisss. This is going to be so easy!

### Step Two - HTTPS GET Request (aka The Fall After The Pride)

{% img center giants /images/tomb_of_the_giants.gif 450 'giants' 'giants' %}

Now I need to query the GitHub API. Not my first time to the rodeo, I generate a
personal access token from GitHub and copy it to a local file. What query should
I run first? How about the count for all ASM tetris repositories? Poking around
the [docs](https://developer.github.com/v3/search/#search-repositories) comes up
with:

``` 
GET https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc
User-Agent: steveshogren
Authorization: token PUT_TOKEN_HERE
```

Easy life. Now how do you GET a resource in Haskell? Ah,
[Network.HTTP](https://hackage.haskell.org/package/HTTP-4000.3.2/docs/Network-HTTP.html)!
I copy the front page sample into ```src/Lib.hs```

``` haskell
module Lib
    ( someFunc
    ) where

x = simpleHTTP (getRequest "https://www.github.com/") >>= fmap (take 100) . getResponseBody

someFunc :: IO ()
someFunc = 
   print x
```

So simple! This is why laugh at my NodeJS loving friends! What a bunch of Cretans.

```
> stack build
src/Lib.hs:5:5: Not in scope: ‘simpleHTTP’
src/Lib.hs:5:17: Not in scope: ‘getRequest’
src/Lib.hs:5:77: Not in scope: ‘getResponseBody’
Compilation failed.
```

Doesn't compile. Durp, hackage is a package library, I need to add this to my
cabal. What is the name of the package? HTTP-4000? HTTP-4000.3.2? Nothing in
hackage seems to indicate what goes into the cabal file. I discover it is just
HTTP through trial and error. I update my cabal file... in all three
build-depends...?

```
  build-depends:       base >= 4.7 && < 5
                       , HTTP
```

Hrm, same error.

```
> stack build
src/Lib.hs:5:5: Not in scope: ‘simpleHTTP’
src/Lib.hs:5:17: Not in scope: ‘getRequest’
src/Lib.hs:5:77: Not in scope: ‘getResponseBody’
Compilation failed.
```

Oh, derp, I'd need an import. (WHY ISN'T THIS IN THE CODE SAMPLE?!). Also, print
doesn't work, I need putStrLn.

``` haskell
import Network.HTTP

x = simpleHTTP (getRequest "https://www.github.com/") >>= fmap (take 100) . getResponseBody

someFunc :: IO ()
someFunc = x >>= putStrLn
```

Here goes!!!

```
 > stack build && stack exec -- github-stats-exe
github-stats-exe: user error (https not supported)
```


Wat. Further inspection of the docs shows a line in paragraph 5. 


> NOTE: This package only supports HTTP;

{% img center giants /images/nope_better.gif 250 'giants' 'giants' %}

When <del>playing Dark Souls</del>programming Haskell, sometimes the best move is to run
away. I search again. ```haskell https request``` comes up with "http-conduit".
After adding http-conduit to my cabal, I come up with this beast:

``` haskell
query :: IO String
query = do
    initReq <- parseUrl "https://api.github.com/search/repositories"
    let r = initReq
                   { method = "GET"
                    , requestHeaders = [(hUserAgent, "steveshogren")
                                      , (hAuthorization, "token PUT_TOKEN_HERE")]}
    let request = setQueryString [("q", Just "tetris+language:assembly")
                                 ,("order", Just "desc")
                                 ,("sort", Just "stars")] r
    manager <- newManager tlsManagerSettings
    res <- httpLbs request manager
    return . show . responseBody $ res

someFunc :: IO ()
someFunc = do
   query >>= putStrLn
```

Huzzah! Results! I'm getting back a monster string of json data.

{% img center solaire /images/praisethesun.gif 150 'solaire' 'solaire' %}

### Step Three - Parsing JSON

Now how to parse this. Aeson seems to be the biggest contender. To use Aeson and
get the total_count value, I needed the following additions:

``` haskell
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

import GHC.Generics
import Data.Aeson

data ResultCount = ResultCount {
  total_count :: Int }
  deriving (Generic, Show)

instance ToJSON ResultCount
instance FromJSON ResultCount
```

ResultCount allows me to use ```decode``` from aeson instead of ```show``` to
parse the "total_count" from the JSON response into an Int. Sure enough, it
does! 

``` haskell
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}
module Lib
    ( someFunc
    ) where

import Control.Monad
import Network
import Network.HTTP.Conduit
import Network.HTTP.Types.Header
import GHC.Generics
import Data.Aeson

data ResultCount = ResultCount {
  total_count :: Int }
  deriving (Generic, Show)

instance ToJSON ResultCount
instance FromJSON ResultCount

query :: IO (Maybe Int)
query = do
    initReq <- parseUrl "https://api.github.com/search/repositories"
    let r = initReq
                   { method = "GET"
                    , requestHeaders = [(hUserAgent, "steveshogren")
                                      , (hAuthorization, "token PUT_TOKEN_HERE")]}
    let request = setQueryString [("q", Just "tetris+language:assembly")
                                 ,("order", Just "desc")
                                 ,("sort", Just "stars")] r
    manager <- newManager tlsManagerSettings
    res <- httpLbs request manager
    return . liftM total_count . decode . responseBody $ res

someFunc :: IO ()
someFunc = query >>= print
``` 

Puts out: ``` Just 66```. Success! Wait. 66 isn't the same count I got when
running from the browser. Check again. Sure enough, browser comes up with a
totally different count.

{% img center solaire /images/come_at_me_bro.gif 400 'solaire' 'solaire' %}

Maybe the query request isn't correct? Adding a "print request" after building
the request shows:

```
Request {
  host                 = "api.github.com"
  port                 = 443
  secure               = True
  requestHeaders       = [("User-Agent","steveshogren"),("Authorization","token PUT_TOKEN_HERE")]
  path                 = "/search/repositories"
  queryString          = "?q=tetris%2Blanguage%3Aassembly&order=desc&sort=stars"
  method               = "GET"
  proxy                = Nothing
  rawBody              = False
  redirectCount        = 10
  responseTimeout      = Just (-3425)
  requestVersion       = HTTP/1.1
}
```

The queryString isn't right!
```?q=tetris%2Blanguage%3Aassembly&order=desc&sort=stars``` It encoded my ```+``` 
and ```:```! After an hour of reading through docs and researching URL encoding
specs, it dawns on me. ```+``` is an encoded whitespace.

> No face-palm gif could ever represent the shear magnitude of my current
> emotions... You'll have to use your imagination

I change my query to ```("q", Just "tetris language:assembly")``` and the right
count comes back! ```Just 354```

I finally have something that correctly fetches a count of repositories from
GitHub and parses it into an Int. After over four hours of <del>Dark
Souls</del>Haskell punishment, we deserve to enjoy a bonfire!

{% img center solaire /images/solaire_sitting.gif 400 'solaire' 'solaire' %}

> Pixel gifs sourced from
> [zedotagger](http://zedotagger.deviantart.com/gallery/54317550/Dark-Souls) on
> deviantart, thanks zedotagger!
