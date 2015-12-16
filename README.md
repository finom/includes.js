includes.js - Client Side HTML Includes
===========
This tiny script allows you to use HTML includes without any server-side solution. It needs for creating huge single-page applications and for further compilation using [grunt-includes](https://github.com/vanetix/grunt-includes) or similar compiling system. The script supports multi-level includes and catches recursive links (10k links restriction). **includes** function doesn't break event listeners because it uses **insertAdjacentHTML** for replacing include text.

```js
includes(options);
```

## Options
- ``pattern`` (String|Regexp) - uses for matching and replacing include text (``{{include "FILE_NAME"}}`` by default).
- ``path`` (String) - Indicates the path to use when looking for included files.
- ``suffix`` (String) - Append the defined string to each included filename before reading them.

## Example
```html
<html>
<body>
	<div>
		<!-- This code includes inc/somefile.html  -->
		{{include "somefile"}}
	</div>
	<script>
		includes({
			pattern: '{{include "FILE_NAME"}}', // same as Regexp: /\{\{include\s+"(\S+)"\}\}/
			path: 'inc/',
			suffix: '.html'
		});
	</script>
</body>
</html>
```

## Compilation
You can use [grunt-includes](https://github.com/vanetix/grunt-includes) for compiling your template to single HTML file.
```js
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		includes: {
			foo:{
				files: [{
					src: ['index.tmpl.html'],
					dest: '_index.html',
					flatten: true,
					cwd: '.'
				}],
				options: {
					includeRegexp: /^(\s*)\{\{include\s+"(\S+)"\}\}\s*$/,
					includePath: 'includes/',
					filenameSuffix: '.html'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-includes');

	grunt.registerTask('default', ['includes']);

}; 
```


**Licensed under WTFPL**
