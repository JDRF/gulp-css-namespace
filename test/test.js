var test = require('tape');
var fs = require('fs');
var File = require('vinyl');
var cleanCSS = require('clean-css');
var namespace = require('../');

test('result test', function (t) {
	t.plan(2);

	var result = new File({
		contents: new Buffer(fs.readFileSync('./test/fixtures/styles.css'))
	});
	var expected = new File({
		contents: new Buffer(fs.readFileSync('./test/expected/styles.css'))
	});

	var myNamespacer = namespace({
		namespace: 'namespace',
		exclude: ['first-selector']
	});

	// write the fake file to it
	myNamespacer.write(result);

	myNamespacer.once('data', function(file) {
		t.assert(file.isBuffer(), 'Is buffer');
		var r = new cleanCSS().minify(file.contents.toString('utf8')).styles;
		var e = new cleanCSS().minify(expected.contents.toString('utf8')).styles;
		t.equal(r, e, 'CSS equals');
	});

});
