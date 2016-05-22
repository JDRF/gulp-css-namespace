var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var through     = require('through2');
var deepmerge   = require('deepmerge');
var parse       = require('css-parse');
var stringify   = require('css-stringify');

const PLUGIN_NAME = 'gulp-css-namespace';

module.exports = function (options) {

	function processNode(node, className) {
		var instance = true,
			string = '',
			properties1 = node.split('::'),
			properties2 = properties1[0].split(':'),
			nodes = properties2[0].split('.');

		nodes.forEach( function(n, index) {
			if (n) {
				string += n;
				if (instance || index < nodes.length - 1) {
					if (options.html) {
						string += (1 === nodes.length) ? '.' + className : '.' + className + '-';
					} else if (1 !== nodes.length) {
						string += '.' + className + '-';
					}
				}
				instance = false;
			} else {
				instance = false;
				string += '.' + className + '-';
			}
		});

		if ( 'undefined' !== typeof properties1[1] ) {
			string =  string + '::' + properties1[1];
		} else if ( 'undefined' !== typeof properties2[1] ) {
			string =  string + ':' + properties2[1];
		} else {
			string =  string;
		}
		return string;
	}

	function processRules(list, options) {
		return list.map( function(r) {
			if (r.selectors) {
				r.selectors.forEach( function(s, index) {
					if (options.namespace) {
						s = processNode(s, options.namespace)
					}
					r.selectors[ index ] = s;
				});
			}
			if (r.type === 'media') {
				r.rules = processRules(r.rules, options);
			}
			return r;
		});
	}

	function css_namepsace(file) {
		options = deepmerge({
			namespace: false,
			html: false,
		}, options || {});

		var css = parse(file);
		css.stylesheet.rules = processRules(css.stylesheet.rules, options);
		return stringify( css );
	}

	function transform(file, encoding, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}
		if (file.isStream()) {
			return callback(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}
		file.contents = new Buffer(css_namepsace(file.contents.toString()));
		callback(null ,file);
	}

	return through.obj(transform);
};
