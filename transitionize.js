/**
 * @fileOverview Allows transitioning to width & height:auto.
 * @author <a href="mailto:chris@cbateman.com">Chris Bateman</a>
 * @version 1.0
 */
var transitionize = (function () {
	
	var _config;
	var _elementData = [];
	var _styleNode;
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
		
		return height;
	}
	
	
	
	
	
	var _updateElements = function() {
		
		_elementData = [];
		
		for (var sheetIndex=0; sheetIndex<document.styleSheets.length; sheetIndex++) {
			var styleSheet = document.styleSheets[sheetIndex];
			
			var rules = styleSheet.cssRules || styleSheet.rules;
			for (var ruleIndex=0,len=rules.length; ruleIndex<len; ruleIndex++) {
				var rule = rules[ruleIndex];
				
				var matches = _matchesSelector(rule.selectorText);
				
				if (matches == 'primary') {
					if (rule.style.height == 'auto' || rule.style.height == '') {
						_calcHeights(rule.selectorText);
					} else if (rule.style.height == '0px') {
						_calcHeights(rule.selectorText, _getAlt(rule.selectorText));
					}
				} else if (matches == 'alt' && rule.style.height == '0px') {
					rule.style.setProperty('height', rule.style.height, '!important');
				}
				
			}
		}
		
		var styleText = '';
		
		for (var i=0,len=_elementData.length; i<len; i++) {
			styleText += _elementData[i].styleText + '\r\n';
		}
		
		_styleNode.innerHTML = styleText;
	};
	
	
	var _getAlt = function(text) {
		for (var i=0,len=_config.length; i<len; i++) {
			var item = _config[i];
			
			if (text == item.selector && item.selectorAlt) {
				return item.selectorAlt;
			}
		}
		return null;
	}
	
	
	var _matchesSelector = function(text) {
		for (var i=0,len=_config.length; i<len; i++) {
			var item = _config[i];
			if (text == item.selector) {
				return 'primary';
			} else if (item.selectorAlt && text.match(item.selectorAlt)) {
				return 'alt';
			}
		}
		
		return false;
	};
	
	
	var _calcHeights = function(selectorText, useSelector) {
		var elements = document.querySelectorAll(selectorText);
		
		
		for (var i=0,len=elements.length; i<len; i++) {
			var node = elements[i];
			
			var id = _getUID();
			
			node.setAttribute('data-transitionize', id);
			
			_killTransition(node);
			var height = _getRealHeight(node);
			_resetTransition(node);
			
			var styleText = '';
			
			if (useSelector) {
				styleText = useSelector;
			} else {
				styleText = selectorText;
			}
			styleText += '[data-transitionize="' + id + '"] { height:' + height + '; }';
			
			_elementData.push({
				id: id,
				node: node,
				styleText: styleText
			});
		}
	};
	
	var uidIndex = 0;
	var _getUID = function() {
		uidIndex++;
		return uidIndex;
	}
	
	
	/**
	 * @private
	 * @description Calls _sizeElements when window is resized
	**/
	var _setSizeListener = function() {
		var resizeTimeout;
		window.addEventListener('resize', function() {
			window.clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				_updateElements();
			}, 30);
		});
	};
	
	
	/**
	 * @public
	 * @param {Object} config
	 * @description Removes transitions for some browsers
	**/
	var _init = function(config) {
		_config = config;
		
		if (!_transitionSupport() || navigator.appName === 'Opera' || !window.getComputedStyle) {
			return;
		}
		
		_styleNode = document.createElement('style');
		document.body.appendChild(_styleNode);
		
		if (window.innerWidth !== 0) { // fixes strange issue opening new tab with alt+enter
			_updateElements();
		}
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
