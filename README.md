# AuthorElement [![](https://data.jsdelivr.com/v1/package/npm/@author.io/element-base/badge)](https://www.jsdelivr.com/package/npm/@author.io/element-base?path=dist) [![Build Status](https://travis-ci.org/author-components/base.svg?branch=master&style=for-the-badge)](https://travis-ci.org/author-components/base)

This is the base class used to build Author.io custom HTML elements (web components). It provides incredibly lightweight utilities and was designed for optimizing all `<author-*>` custom tags.

![Source Size](https://img.shields.io/github/size/author-components/base/author-element.js.svg?colorB=%23333333&label=Source&logo=JavaScript&logoColor=%23aaaaaa&style=for-the-badge) ![Deliverable Size](https://img.shields.io/bundlephobia/minzip/@author.io/element-base.svg?colorB=%23333333&label=Minified-Gzipped&logo=JavaScript&style=for-the-badge) ![npm](https://img.shields.io/npm/v/@author.io/element-base.svg?colorB=%23333&label=%40author.io%2Felement-base&logo=npm&style=for-the-badge)

<a href="https://browserstack.com"><img src="https://github.com/author-components/base/raw/master/browserstack.png" style="max-height: 50px;"/></a>

## Usage

This library must be included _once_ in HTML pages _before_ any `author-*` tags.

There are 4 versions of the base class available:

1. *author-element.min.js* (ES6 Minified for Production)
1. _author-element.js_ (ES6 Unminified for Debugging)
1. *author-element.es5.min.js* (ES5 Minified for Production)
1. _author-element.es5.js_ (ES5 Unminified for Debugging)

Each version has it's own source map, so it's always possible to trace activity back to a specific code block in the source.

You only need to choose one of these files. If you need to support Internet Explorer, older versions of Chrome/Firefox/Safari, then you likely need the ES5 version.

*Via Global CDN*

```html
<html>
  <head>
    <script src="https://cdn.author.io/element/base/author-element.min.js"></script>
    <script src="https://cdn.author.io/element/whatever/element.min.js"></script>
  </head>
</html>
```

*Via npm*

First install the module locally:

`npm install @author.io/element-base -S`

Then include it in your HTML:

```html
<html>
  <head>
    <script src="./node_modules/@author.io/element-base/dist/author-element.min.js"></script>
    <script src="https://domain.com/path/to/custom/element.js"></script>
  </head>
</html>
```
