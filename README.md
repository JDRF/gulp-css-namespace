# gulp-css-namespace

[gulp](http://gulpjs.com/) plugin to add a namespace to all CSS classes

## Installation

Install package with NPM and add it to your development dependencies:

```
npm install --save-dev gulp-css-namespace
```

## Usage

```javascript
var cssNamepsace = require('gulp-css-namespace');

gulp.task('css-namepsace', function() {
  return gulp.src('src/*.css')
	.pipe(cssNamepsace({selector:'.namespace-'}))
	.pipe(gulp.dest('dist'));
});
```

#### Properties

* obj._selector_
 * String: Namespace to use
* obj._html_
 * Boolean: Append namespace to singular HTML properties
* obj._exclude_
 * Array: Array of classes to exclude from the namespace

#### Example

The following, when run through `gulp-css-namespace`, will produce the second result.

```css
.foo {
	display: block;
}
a.foo {
	display: inline;
}
```

```css
.namespace-foo {
	display: block;
}
a.namespace-foo {
	display: inline;
}
```
