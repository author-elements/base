# AuthorElement

This is the base class used to build Author.io custom HTML elements (web components). It provides incredibly lightweight utilities and was designed for optimizing all `<author-*>` custom tags.

## Usage

This library must be included _once_ in HTML pages _before_ any `author-*` tags.

*Via Global CDN*

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@author.io/element-base/dist/author-element.min.js"></script>
    <script src="https://domain.com/path/to/custom/element.js"></script>
  </head>
</html>
```

*Via npm*

```html
<html>
  <head>
    <script src="./node_modules/@author.io/element-base/dist/author-element.min.js"></script>
    <script src="https://domain.com/path/to/custom/element.js"></script>
  </head>
</html>
```
