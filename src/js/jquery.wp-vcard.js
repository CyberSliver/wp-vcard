/**
 * WordPress vCard library
 * 
 * @version 0.01
 * @author Jeffrey Ridout
 * @copyright CC-Share-Alike
 * 
 */
/*global jQuery*/

/**
 * Wrap jQuery
 */

(function($) {
	
	var ns = { namespaces: { v: "http://www.w3.org/2006/vcard/ns#" }}, 
	v = $.uri("http://www.w3.org/2006/vcard/ns#"),
	vCardClass = $.rdf.resource('<' + v + 'Vcard>');
		
	var q = $('#main > div')
		.rdf()
		.prefix('v', v)
		.where('?vcard a v:Vcard')
		.where('?vcard v:fn ?fn')
		.optional('?vcard v:uid ?uid');
	console.debug(q);
	
	/*
	var cl = $('*.vcard');
	for (var i = 0, len = cl.length; i < len; i++) {
		console.debug(cl[i]);
		console.debug($(cl[i]));
		var c = $(cl[i]).rdf();
		c = c.where('?vcard a '+vCardClass);
		console.debug(c);
	}
	*/
	
})(jQuery);

/* EOF */