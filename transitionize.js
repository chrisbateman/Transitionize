/**
 * @fileOverview Allows transitioning to width & height:auto.
 * @author <a href="mailto:chris@cbateman.com">Chris Bateman</a>
 * @version 1.0
 */
var transitionize = (function () {
	
	var _config;
	var _selectorArray;
	var _elementData;
	var _testProps = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
	
	
	
	/**
	 * @private
	 * @returns {Boolean} Browser supports transitions
	**/
	var _transitionSupport = function() {
		var testStyle = document.body.style;
		for (var i in _testProps) {
            if (testStyle[_testProps[i]] !== undefined ) {
                return true;
            }
        }
		
		return false;
	};
	
	
	/**
	 * @private
	 * @param {DOM Node} node
	 * @description Removes transitions for some browsers
	**/
	var _killTransition = function(node) {
		node.style.webkitTransition = 'none';
		node.style.msTransition = 'none';
		node.style.transition = 'none';
		// not necessary for FF
	};
	
	
	/**
	 * @private
	 * @param {DOM Node} node
	 * @description Resets transitions set inline
	**/
	var _resetTransition = function(node) {
		setTimeout(function() {
			node.style.webkitTransition = '';
			node.style.msTransition = '';
			node.style.transition = '';
		}, 0);
	};
	
	
	/**
	 * @private
	 * @param {DOM Node} node
	 * @returns Height of node, not including padding or border
	**/
	var _getRealHeight = function(node) {
		node.style.setProperty('height', 'auto', 'important');
		var height = window.getComputedStyle(node, null).height;
		node.style.height = '';
		
		// removing alternate method unless needed
		
		return height;
	}
	
	
	
	var _matchesSelector = function(text) {
		for (var i=0,len=_selectorArray.length; i<len; i++) {
			if (text.match(_selectorArray[i])) {
				return true;
			}
		}
		return false;
	};
	
	
	/**
	 * @private
	 * @description Calls _sizeElements when window is resized
	**/
	var _setSizeListener = function() {
		var resizeTimeout;
		window.addEventListener('resize', function() {
			window.clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				//_updateElements();
				//_sizeElements();
				
			}, 50);
		});
	};
	
	var _updateElements = function() {
		for (var sheetIndex=0; sheetIndex<document.styleSheets.length; sheetIndex++) {
			var styleSheet = document.styleSheets[sheetIndex];
			
			var rules = styleSheet.cssRules || styleSheet.rules;
			for (var ruleIndex=0,len=rules.length; ruleIndex<len; ruleIndex++) {
				var rule = rules[ruleIndex];
				if (rule.selectorText && _matchesSelector(rule.selectorText)) {
					
					if (rule.style.height == 'auto') {
						console.log(rule.selectorText);
						top.tester = rule;
						_calcHeights(rule.selectorText);
					} else if (rule.style.height == '0px') {
						//console.log(rule.selectorText);

						rule.style.setProperty('height', rule.style.height, 'important');
					}
					
				}
			}
		}
	};
	
	var _calcHeights = function(selectorText) {
		var elements = document.querySelectorAll(selectorText);
		
		
		
		for (var i=0,len=elements.length; i<len; i++) {
			var node = elements[i];
			
			var id = _getUID();
			
			node.setAttribute('data-transitionize', id);
			
			var style = document.createElement('style');
			style.setAttribute('data-transitionize', id);
			
			_killTransition(node);
			var height = _getRealHeight(node);
			_resetTransition(node);
			
			style.innerHTML = selectorText + '[data-transitionize="' + id + '"] { height:' + height + '; }';
			
			document.body.appendChild(style);
		}
		
	};
	
	var uidIndex = 0;
	var _getUID = function() {
		uidIndex++;
		return uidIndex;
	}
	
	
	/**
	 * @public
	 * @param {Object} config
	 * @description Removes transitions for some browsers
	**/
	var _init = function(config) {
		_config = config;
		_selectorArray = config.selector.split(',');
		
		if (!_transitionSupport() || navigator.appName === 'Opera' || !window.getComputedStyle) {
			return;
		}
		
		if (window.innerWidth !== 0) { // fixes strange issue opening new tab with alt+enter
			//_sizeElements();
		}
		//_addCSSUpdates();
		_updateElements();
		_setSizeListener();
	};
	
	
	/**
	 * @public
	 * @description Manual notification that something has changed and we need to recalculate
	**/
	var _update = function() {
		//_addCSSUpdates();
		_sizeElements();
	};
	
	
	return {
		init: _init,
		update: _update
	};
	
})();
