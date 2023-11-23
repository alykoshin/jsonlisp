<!-- @format -->

Изучение языка:

https://exercism.org/tracks/common-lisp/exercises/grains/edit

---

Названия функций:

- `(download "http://www.google.com/robots.txt" "/tmp/robots.txt")` -- https://github.com/eudoxia0/trivial-download

---

uLisp -- Lisp for microcontrollers -- Language reference
[http://www.ulisp.com/show?3L](http://www.ulisp.com/show?3L)

JSON-LISP is a very simple LISP interpreter that uses JSON as its concrete syntax
[https://github.com/gliese1337/json-lisp](https://github.com/gliese1337/json-lisp)

SBCL -- Package: COMMON-LISP -- public: home of symbols defined by the ANSI language specification
[https://koji-kojiro.github.io/sb-docs/build/html/common-lisp/](https://koji-kojiro.github.io/sb-docs/build/html/common-lisp/)

A brief introduction to Emacs Lisp for people with programming background
[http://lgmoneda.github.io/2017/03/15/elisp-summary.html](http://lgmoneda.github.io/2017/03/15/elisp-summary.html)

Common Lisp Programming Course -- Learn Lisp effectively, in videos
[https://github.com/vindarel/common-lisp-course-in-videos/](https://github.com/vindarel/common-lisp-course-in-videos/)

---

### Tutorials

https://www.tutorialspoint.com/lisp/

https://exercism.org/tracks/common-lisp/exercises/grains/edit

---

Pure versus Impure Lisp -- [https://dl.acm.org/doi/pdf/10.1145/244795.244798](https://dl.acm.org/doi/pdf/10.1145/244795.244798)

What is the difference between Lisp-1 and Lisp-2? -- [https://stackoverflow.com/questions/4578574/what-is-the-difference-between-lisp-1-and-lisp-2](https://stackoverflow.com/questions/4578574/what-is-the-difference-between-lisp-1-and-lisp-2)

### Minimal Core

- How many primitives does it take to build a LISP machine? Ten, seven or five? -- Basic Predicates/F-functions -- [https://stackoverflow.com/a/3484206](https://stackoverflow.com/a/3484206)

### Classical texts

Recursive Functions of Symbolic Expressions and Their Computation by Machine, Part I -- John McCarthy -- 1960 -- [http://www-formal.stanford.edu/jmc/recursive.pdf](http://www-formal.stanford.edu/jmc/recursive.pdf)

The Roots of Lisp -- Paul Graham -- 2002 -- [http://languagelog.ldc.upenn.edu/myl/llog/jmc.pdf](http://languagelog.ldc.upenn.edu/myl/llog/jmc.pdf) - local copy:

- [.pdf](./_doc/The%20Roots%20of%20Lisp%20-%20Paul%20Graham/jmc.pdf)
- [.lisp](./_doc/The%20Roots%20of%20Lisp%20-%20Paul%20Graham/jmc.lisp)

### Source codes

json-lisp

- [https://github.com/gliese1337/json-lisp/blob/master/src/preamble.ts](https://github.com/gliese1337/json-lisp/blob/master/src/preamble.ts)

Mary Had a Little Lambda: Implementing a Minimal Lisp for Assisting with Education

- [https://github.com/andybelltree/Mary/blob/master/lisp/stdlib.lisp](https://github.com/andybelltree/Mary/blob/master/lisp/stdlib.lisp)

maryrosecook --littlelisp.js

- [https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.js](https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.js)

miniMAL

- [https://github.com/kanaka/miniMAL](https://github.com/kanaka/miniMAL)

SBCL:

- [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/pred.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/pred.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/seq.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/seq.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/string.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/string.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/symbol.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/symbol.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/loop.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/loop.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/numbers.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/numbers.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/query.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/query.lisp)
  - [https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/list.lisp](https://sourceforge.net/p/sbcl/sbcl/ci/master/tree/src/code/list.lisp)
  - https://github.com/sbcl/sbcl/blob/master/src/code/target-format.lisp -- format

CLISP

- [https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/](https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/)
  - [https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/lispbibl.d](https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/lispbibl.d)
  - [https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/list.d](https://sourceforge.net/p/clisp/clisp/ci/tip/tree/src/list.d)
  - https://github.com/JoshCheek/clisp/blob/master/src/format.lisp -- format

Klisp:

- [https://github.com/thesephist/klisp/blob/main/src/klisp.ink](https://github.com/thesephist/klisp/blob/main/src/klisp.ink)
- [https://github.com/thesephist/klisp/blob/main/lib/klisp.klisp](https://github.com/thesephist/klisp/blob/main/src/klisp.ink)
- [https://github.com/thesephist/klisp/blob/main/lib/math.klisp](https://github.com/thesephist/klisp/blob/main/lib/math.klisp)

SICL:

- https://github.com/robert-strandh/SICL/tree/master
  - https://github.com/s-expressionists/Incless
  - https://github.com/s-expressionists/Invistra/tree/main/code

ECL:

- https://gitlab.com/embeddable-common-lisp/ecl/blob/develop/src/lsp/format.lsp -- format

ABCL -- Armed Bear Common Lisp is a conforming implementation of ANSI Common Lisp that runs in a Java virtual machine. It compiles Lisp code directly to Java byte code.

- https://github.com/slyrus/abcl/blob/master/src/org/armedbear/lisp/format.lisp -- format

Clozure

- https://github.com/Clozure/ccl/blob/003917cbbce90b7a7b5fa4bf90e9fe424e5637e9/lib/format.lisp -- format

---

LISP 1.5 Programmer's Manual -- 1960

- [https://www.softwarepreservation.org/projects/LISP/book/LISP%201.5%20Programmers%20Manual.pdf](https://www.softwarepreservation.org/projects/LISP/book/LISP%201.5%20Programmers%20Manual.pdf)
