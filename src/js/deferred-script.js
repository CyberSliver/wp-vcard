/*
 * 
 */

var deferredJS = [];

(function() {
	// Check if a script is loaded
	function isJSLoaded(id) {
		if (!id || id === '') {
			return false;
		}

		for (var i = 0, len = deferredJS.length; i < len; i++) {
			if (deferredJS[i].id === id) {
				console.log('isJSLoaded: ' + id + ' ' + (deferredJS[i].loaded === true));
				return (deferredJS[i].loaded === true); 
			}
		}
	}

	// Call script init function
	function initJS(index) {
		if (index < 0 || index >= deferredJS.length) {
			return false;
		}
		if (deferredJS[index] && deferredJS[index].loaded) {
			return false;
		}

		console.log('initJS: ' + deferredJS[index].id + ' loaded.');

		deferredJS[index].loaded = true;
		if (deferredJS[index].init) {
			if (!deferredJS[index].depends) {
				console.log('initJS: ' + deferredJS[index].id + ' no dependencies.');
				
				console.log('initJS: ' + deferredJS[index].id + ' initialised.');
				deferredJS[index].initialised = true;
				deferredJS[index].init();
			} else {
				var allJSLoaded = true;

				// Check dependencies
				console.log('initJS: ' + deferredJS[index].id + ' checking dependencies...');
				for (var i = 0, len = deferredJS[index].depends.length; i < len; i++) {
					if (allJSLoaded && !isJSLoaded(deferredJS[index].depends[i])) {
						allJSLoaded = false;
					}
				}
				console.log('initJS: ' + deferredJS[index].id + ' dependencies loaded: ' + allJSLoaded);

				if (allJSLoaded === true) {
					console.log('initJS: ' + deferredJS[index].id + ' initialised.');
					deferredJS[index].initialised = true;
					deferredJS[index].init();
				}
			}
		} else {
			console.log('initJS: ' + deferredJS[index].id + ' initialised.');
			deferredJS[index].initialised = true;
		}

		console.log('initJS: Re-checking dependencies...');
		for (var i = 0, len = deferredJS.length; i < len; i++) {
			if (deferredJS[i].loaded && !deferredJS[i].initialised) {
				console.log('initJS: Dependency ' + deferredJS[index].id + ' for ' + deferredJS[i].id + ' loaded, calling initJS...');
				initJS(i);
			}
		}
	}
	
	function createCallback(i)
	{
	    return function ()
	    {
	        initJS(i);
	    };
	}

	// Add a script element as a child of the body
	function downloadJSAtOnload() {
		console.log('window.onload');
		
		for (var i = 0, len =  deferredJS.length; i < len; i++) {
			if (deferredJS[i].added) {
				continue;
			}
			
			var element = document.createElement("script");

			element.src = deferredJS[i].url;

			if (!deferredJS[i].type) {
				element.type = 'text/javascript';
			} else {
				element.type = deferredJS[i].type;
			}
			
			if (element.addEventListener) {
				element.addEventListener('load', createCallback(i), false);
			} else if (element.attachEvent) {
				element.attachEvent('onload', createCallback(i));
			} else {
				element.onload = createCallback(i);
			}

			deferredJS[i].added = true;
			document.body.appendChild(element);
		}
	}

	// Check for browser support of event handling capability
	if (window.addEventListener) {
		window.addEventListener("load", downloadJSAtOnload, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", downloadJSAtOnload);
	} else {
		window.onload = downloadJSAtOnload;
	};
})();

/* EOF */