( function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.includes = factory();
    }
}(this, function() {
	"use strict";
	var includes = function( o ) {
		o = o || {};
		pattern = o.pattern || '{{include "FILE_NAME"}}'; // /\{\{include\s+"(\S+)"\}\}/;
		path = o.path || '';
		suffix = o.suffix || '';
		
		pattern = typeof pattern == 'string' 
			? new RegExp( pattern.replace( /\s+/, '\\s+' )
				.replace( 'FILE_NAME', '(\\S+)' ) ) 
			: pattern;

		all = doc.querySelectorAll( '*' );
		for( i = 0; i < all.length; i++ ) {
			allItem = all[ i ];
			if( allItem.tagName === 'SCRIPT' ) continue;
			childNodes = allItem.childNodes;
			for( j = 0; j < childNodes.length; j++ ) {
				node = childNodes[ j ];

				if( node.nodeType === 3 && pattern.test( node.nodeValue ) ) {
					
					html = node.nodeValue;
					
					while( pattern.test( html ) ) {
						html = html.replace( pattern, function( $0, $1 ) {
							if( cache[ $1 ]  ) {
								return cache[ $1 ];
							} else {
								request = new XMLHttpRequest();
								request.open( 'GET', path + $1 + suffix, false );
								request.send();
								return cache[ $1 ] = request.responseText;
							}
						});
					}
					
					node.nextSibling
						? node.nextSibling.insertAdjacentHTML( 'beforebegin', html ) 
						: node.parentNode.insertAdjacentHTML( 'beforeend', html );
										
					allItem.removeChild( node );
					j--;
				}
			}
		}
	},
	pattern,
	path,
	suffix,
	doc = document,
	cache = {},
	html,
	all,
	allItem,
	node,
	childNodes,
	request,
	i, j;
	
	return includes;
}));