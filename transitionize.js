var transitionize = function(config) {
	
	
	var elements = document.querySelectorAll(config.selector);
	
	var i = elements.length;
	while (i--) {
		var node = elements[i];
		top.tester = node;
		
		node.style.paddingTop = 0;
		node.style.paddingBottom = 0;
		node.style.webkitTransition = 'none';
		
		node.style.height = node.offsetHeight + 'px';
		
		node.style.paddingTop = '';
		node.style.paddingBottom = '';
		setTimeout(function() { node.style.webkitTransition = ''; }, 0);
		
		
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
