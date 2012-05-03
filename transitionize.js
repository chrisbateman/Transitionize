var transitionize = function (config) {
	
	
	
	var killTransition = function(node) {
		node.style.webkitTransition = 'none';
	};
	
	var resetTransition = function(node) {
		setTimeout(function() {
			node.style.webkitTransition = '';
		}, 0);
	};
	
	
	var getRealHeight = function(node) {
		
		if (window.getComputedStyle) {
			return window.getComputedStyle(node, null).height;
		}
		/*
		if (node.currentStyle) {
			return node.currentStyle.height;
		}
		*/
		
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
	
	var i = elements.length;
	while (i--) {
		var node = elements[i];
		top.tester = node;
		
		killTransition(node);
		node.style.height = getRealHeight(node);
		resetTransition(node);
		
		for (var j=0,len=document.styleSheets[0].rules.length; j<len; j++) {
			var rule = document.styleSheets[0].rules[j];
			if (rule.selectorText.match(/.container/)) {
				
				var hasHeight = false;
				for (var k=0; k<rule.style.length; k++) {
					if (rule.style[k] == 'height') {
						rule.style.setProperty('height', rule.style.height, 'important');
						
					}
				}
				
			}
		}
		
	}
	
	
	
};
