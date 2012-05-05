var transitionize = function (config) {
	
	
	
	var killTransition = function(node) {
		node.style.webkitTransition = 'none';
		node.style.OTransition = 'none'; // :(
		// not necessary for FF
	};
	
	var resetTransition = function(node) {
		setTimeout(function() {
			node.style.webkitTransition = '';
			node.style.OTransition = '';
		}, 0);
	};
	
	
	var getRealHeight = function(node) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(node, null).height;
		}
		
		// looks like we're gonna do this the hard way
		node.style.paddingTop = 0;
		node.style.paddingBottom = 0;
		killTransition(node);
		
		var realHeight = node.offsetHeight + 'px';
		
		node.style.paddingTop = '';
		node.style.paddingBottom = '';
		resetTransition(node);
		
		return realHeight;
	}
	
	
	
	
	var elements = document.querySelectorAll(config.selector);
	
	var eIndex = elements.length;
	while (eIndex--) {
		var node = elements[eIndex];
		
		killTransition(node);
		node.style.height = getRealHeight(node);
		resetTransition(node);
	}
	
	
	for (var sheetIndex=0; sheetIndex<document.styleSheets.length; sheetIndex++) {
		var styleSheet = document.styleSheets[sheetIndex];
		
		var rules = styleSheet.rules || styleSheet.cssRules;
		for (var ruleIndex=0,len=rules.length; ruleIndex<len; ruleIndex++) {
			var rule = rules[ruleIndex];
			if (rule.selectorText && rule.selectorText.match(config.selector)) {
				
				var hasHeight = false;
				for (var styleIndex=0; styleIndex<rule.style.length; styleIndex++) {
					if (rule.style[styleIndex] == 'height' && rule.style.height != 'auto') {
						rule.style.setProperty('height', rule.style.height, 'important');
					}
				}
				
			}
		}
	}
	
};
