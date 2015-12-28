---
layout: post
title: "Emacs Project Tip"
date: 2014-12-06 08:45
comments: true
categories: 
- Technical Skills
- emacs
type: post
published: true
---

I recently have been working in a Clojure project which is made up of
several microservices. While trying to build in a secure method for
each service to be able to call the others, I've been in several
different projects at the same time.

At least once I accidentally opened the wrong "handler.clj" buffer,
and spent a few minutes adding a function that never worked. Since I
hate doing things like this, I wanted a simple way to see what project
I was currently viewing.

I started with a changing the title of the frame to show the whole
path of the current buffer, like this:

{% img center /images/title.png 'image' 'images' %}

The code to change the title is simple, and the default in some of the
pre-packaged emacs bundles:

``` common-lisp
(setq frame-title-format
      '((:eval (if (buffer-file-name)
                   (abbreviate-file-name (buffer-file-name))
                 "%b"))))
```

This is fine, but still not great. The font is tiny and the important
part: "octopress" is buried. I wanted something a little more fluid,
so I could easily tell the different projects apart instantly. I came
up with the idea to color the background faintly different based on
the path of the file. Files with a path containing "octopress" might
be different from those containing ".emacs".

Thankfully, ```buffer-face-mode``` makes it easy to change a single
property of a single buffer's face without changing any other
buffer. So long as you disable buffer-face-mode when closing emacs,
your files will open with the correct coloring scheme, then have the
new background overlaid.

While not perfect, this was the result.

{% img center /images/colors.png 'image' 'images' %}

The colors I choose are only faintly different, but just enough for me
to tell instantly which is which.

The buffer colors are applied when opening a file, using these
functions:

``` common-lisp
(defun my-buffer-face-mode-variable (color)
  (interactive)
  (setq buffer-face-mode-face (list :background color))
  (buffer-face-mode 1))

(defun my-set-theme-on-mode ()
  (interactive)
  (let ((file-name (buffer-file-name)))
    (cond
    ;; add your own project/color mappings here
     ((string-match "halcyon" file-name) (my-buffer-face-mode-variable "#00001A"))
     ((string-match "dwarf" file-name) (my-buffer-face-mode-variable "#001A1A"))
     ((string-match "nimbus" file-name) (my-buffer-face-mode-variable "black"))
     (t ""))))
```

To force them to run when opening a file, since I use helm, I set it
to execute on exiting helm for any reason:

``` common-lisp
(add-hook 'helm-after-action-hook 'my-set-theme-on-mode)
;; uncomment if not using helm
;; (add-hook 'find-file-hook 'my-set-theme-on-mode)
```

Lastly, to make sure emacs applies my normal theme and settings to a
buffer when starting, I disable buffer-face-mode on all buffers before
exiting.


``` common-lisp
(defun disable-all-buffer-face-mode ()
  (interactive)
  (let ((current (get-buffer (current-buffer))))
    (-map (lambda (x) (progn (switch-to-buffer x)
                             (buffer-face-mode 0))) (buffer-list))
    (switch-to-buffer current 1)))

(add-hook 'kill-emacs-hook 'disable-all-buffer-face-mode)
```

This block needs [dash.el](https://github.com/magnars/dash.el) to get
the -map function.

While not the only solution, this seemed a simple and elegant way to
quickly be reminded of your current project.

Enjoy!
