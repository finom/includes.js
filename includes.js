(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		window.includes = factory();
	}
}(this, function() {
	"use strict";
	var includes = function(o) {
			o = o || {};
			pattern = o.pattern || '{{include "FILE_NAME"}}'; // /\{\{include\s+"(\S+)"\}\}/;
			path = o.path || '';
			suffix = o.suffix || '';

			pattern = typeof pattern == 'string' ? new RegExp(pattern.replace(/\s+/g, '\\s+')
				.replace(/\(/g, '\\(')
				.replace(/\)/g, '\\)')
				.replace('FILE_NAME', '(\\S+)')) : pattern;

			all = document.querySelectorAll('*');
			for (i = 0; i < all.length; i++) {
				allItem = all[i];
				if (allItem.tagName == 'SCRIPT') continue;
				childNodes = allItem.childNodes;
				for (j = 0; j < childNodes.length; j++) {
					node = childNodes[j];
					nodeType = node.nodeType;
					nodeValue = nodeType == 8 ? '<!--' + node.nodeValue + '-->' : node.nodeValue;

					if ((nodeType == 3 || nodeType == 8) && pattern.test(nodeValue)) {
						count = 0;

						while (pattern.test(nodeValue)) {
							nodeValue = nodeValue.replace(pattern, function($0, $1) {
								if (cache[$1]) {
									return cache[$1];
								} else {
									request = new XMLHttpRequest();
									request.open('GET', path + $1 + suffix, false);
									request.send();
									return cache[$1] = request.responseText;
								}
							});

							count++;

							if (count > 1e3) {
								nodeValue = '<b>Include Error:</b> Circular Reference';
								break;
							}
						}

						if(node.nextElementSibling) {
							node.nextElementSibling.insertAdjacentHTML('beforebegin', nodeValue);
						} else {
							node.parentNode.insertAdjacentHTML('beforeend', nodeValue);
						}

						allItem.removeChild(node);
						j--;
					}
				}
			}
		},
		pattern,
		path,
		suffix,
		cache = {},
		all,
		allItem,
		node,
		childNodes,
		request,
		i, j,
		count,
		nodeType,
		nodeValue;

	return includes;
}));
