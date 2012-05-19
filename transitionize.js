
var transitionize = (function () {
	
	var _selectors = [];
	var _selector;
	
	
	var _killTransition = function(node) {
		node.style.webkitTransition = 'none';
		//node.style.OTransition = 'none'; // :(
		// not necessary for FF
	};
	
	var _resetTransition = function(node) {
		setTimeout(function() {
			node.style.webkitTransition = '';
			//node.style.OTransition = '';
		}, 0);
	};
	
	
	var _getRealHeight = function(node) {
		var height;
		
		if (window.getComputedStyle) {
			//node.style.height = 'auto';
			node.style.setProperty('height', 'auto', 'important');
			height = window.getComputedStyle(node, null).height;
			node.style.height = '';
		} else { // looks like we're gonna do this the hard way
			node.style.paddingTop = 0;
			node.style.paddingBottom = 0;
			node.style.height = 'auto';
			
			height = node.offsetHeight + 'px';
			
			node.style.height = '';
			node.style.paddingTop = '';
			node.style.paddingBottom = '';
		}
		
		return height;
	}
	
	
	
	var _addCSSUpdates = function() {
		for (var sheetIndex=0; sheetIndex<document.styleSheets.length; sheetIndex++) {
			var styleSheet = document.styleSheets[sheetIndex];
			
			var rules = styleSheet.rules || styleSheet.cssRules;
			for (var ruleIndex=0,len=rules.length; ruleIndex<len; ruleIndex++) {
				var rule = rules[ruleIndex];
				
				if (rule.cssText.match('transition') && rule.style.height != '') {
					if (rule.style.height == 'auto') {
						_selectors.push(rule.selectorText);
					} else {
						rule.style.setProperty('height', rule.style.height, 'important');
					}
				}
			}
		}
	};
	
	
	var _sizeElements = function() {
		
		var elements = document.querySelectorAll(_selectors.join(', '));
		
		var eIndex = elements.length;
		while (eIndex--) {
			var node = elements[eIndex];
			
			_killTransition(node);
			node.style.height = _getRealHeight(node);
			_resetTransition(node);
		}
	};
	
	
	var _setSizeListener = function() {
		var resizeTimeout;
		window.addEventListener('resize', function() {
			window.clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(_sizeElements, 50);
		});
	};
	
	
	
	var _init = function() {
		if ((typeof Modernizr != 'undefined' && !Modernizr.csstransitions) || navigator.appName == 'Opera') {
			return;
		}
		
		_addCSSUpdates();
		
		if (window.innerWidth != 0) { // fixes strange issue opening new tab with alt+enter
			_sizeElements();
		}
		
		_setSizeListener();
	};
	
	_init();
	
	return {
		init: _init,
		update: _sizeElements
	};
	
})();
