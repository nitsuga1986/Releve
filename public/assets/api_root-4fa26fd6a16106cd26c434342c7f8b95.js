/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};

}));


/*!
 * jQuery UI Datepicker 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.extend($.ui, { datepicker: { version: "1.11.4" } });

var datepicker_instActive;

function datepicker_getZindex( elem ) {
	var position, value;
	while ( elem.length && elem[ 0 ] !== document ) {
		// Ignore z-index if position is set to a value where z-index is ignored by the browser
		// This makes behavior of this function consistent across browsers
		// WebKit always returns auto if the element is positioned
		position = elem.css( "position" );
		if ( position === "absolute" || position === "relative" || position === "fixed" ) {
			// IE returns 0 when zIndex is not specified
			// other browsers return a string
			// we ignore the case of nested elements with an explicit value of 0
			// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
			value = parseInt( elem.css( "zIndex" ), 10 );
			if ( !isNaN( value ) && value !== 0 ) {
				return value;
			}
		}
		elem = elem.parent();
	}

	return 0;
}
/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
	this._appendClass = "ui-datepicker-append"; // The name of the append marker class
	this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
	this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
	this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
	this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[""] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month link
		nextText: "Next", // Display text for next month link
		currentText: "Today", // Display text for current month link
		monthNames: ["January","February","March","April","May","June",
			"July","August","September","October","November","December"], // Names of months for drop-down and formatting
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
		weekHeader: "Wk", // Column header for week of the year
		dateFormat: "mm/dd/yy", // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: "" // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showAnim: "fadeIn", // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: "", // Display text following the input box, e.g. showing the format
		buttonText: "...", // Text for trigger button
		buttonImage: "", // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: "fast", // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: "", // Selector for an alternate field to store selected dates into
		altFormat: "", // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional[""]);
	this.regional.en = $.extend( true, {}, this.regional[ "" ]);
	this.regional[ "en-US" ] = $.extend( true, {}, this.regional.en );
	this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: "hasDatepicker",

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setDefaults: function(settings) {
		datepicker_extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachDatepicker: function(target, settings) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
		inline = (nodeName === "div" || nodeName === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {});
		if (nodeName === "input") {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName)) {
			return;
		}
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp);
		this._autoSize(inst);
		$.data(target, "datepicker", inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var showOn, buttonText, buttonImage,
			appendText = this._get(inst, "appendText"),
			isRTL = this._get(inst, "isRTL");

		if (inst.append) {
			inst.append.remove();
		}
		if (appendText) {
			inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
			input[isRTL ? "before" : "after"](inst.append);
		}

		input.unbind("focus", this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove();
		}

		showOn = this._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		}
		if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
			buttonText = this._get(inst, "buttonText");
			buttonImage = this._get(inst, "buttonImage");
			inst.trigger = $(this._get(inst, "buttonImageOnly") ?
				$("<img/>").addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$("<button type='button'></button>").addClass(this._triggerClass).
					html(!buttonImage ? buttonText : $("<img/>").attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? "before" : "after"](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
					$.datepicker._hideDatepicker();
				} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else {
					$.datepicker._showDatepicker(input[0]);
				}
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, "autoSize") && !inst.inline) {
			var findMax, max, maxI, i,
				date = new Date(2009, 12 - 1, 20), // Ensure double digits
				dateFormat = this._get(inst, "dateFormat");

			if (dateFormat.match(/[DM]/)) {
				findMax = function(names) {
					max = 0;
					maxI = 0;
					for (i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					"monthNames" : "monthNamesShort"))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
			}
			inst.input.attr("size", this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName)) {
			return;
		}
		divSpan.addClass(this.markerClassName).append(inst.dpDiv);
		$.data(target, "datepicker", inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or Date - the initial date to display
	 * @param  onSelect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if (!inst) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialogInput = $("<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>");
			this._dialogInput.keydown(this._doKeyDown);
			$("body").append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], "datepicker", inst);
		}
		datepicker_extendRemove(inst.settings, settings || {});
		date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI) {
			$.blockUI(this.dpDiv);
		}
		$.data(this._dialogInput[0], "datepicker", inst);
		return this;
	},

	/* Detach a datepicker from its control.
	 * @param  target	element - the target input field or division or span
	 */
	_destroyDatepicker: function(target) {
		var nodeName,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		$.removeData(target, "datepicker");
		if (nodeName === "input") {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind("focus", this._showDatepicker).
				unbind("keydown", this._doKeyDown).
				unbind("keypress", this._doKeyPress).
				unbind("keyup", this._doKeyUp);
		} else if (nodeName === "div" || nodeName === "span") {
			$target.removeClass(this.markerClassName).empty();
		}

		if ( datepicker_instActive === inst ) {
			datepicker_instActive = null;
		}
	},

	/* Enable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_enableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = false;
			inst.trigger.filter("button").
				each(function() { this.disabled = false; }).end().
				filter("img").css({opacity: "1.0", cursor: ""});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().removeClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_disableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = true;
			inst.trigger.filter("button").
				each(function() { this.disabled = true; }).end().
				filter("img").css({opacity: "0.5", cursor: "default"});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().addClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	 * @param  target	element - the target input field or division or span
	 * @return boolean - true if disabled, false if enabled
	 */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] === target) {
				return true;
			}
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	 * @param  target  element - the target input field or division or span
	 * @return  object - the associated instance data
	 * @throws  error if a jQuery problem getting data
	 */
	_getInst: function(target) {
		try {
			return $.data(target, "datepicker");
		}
		catch (err) {
			throw "Missing instance data for this datepicker";
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 * @param  name	object - the new settings to update or
	 *				string - the name of the setting to change or retrieve,
	 *				when retrieving also "all" for all instance settings or
	 *				"defaults" for all global defaults
	 * @param  value   any - the new value for the setting
	 *				(omit if above is an object or to retrieve a value)
	 */
	_optionDatepicker: function(target, name, value) {
		var settings, date, minDate, maxDate,
			inst = this._getInst(target);

		if (arguments.length === 2 && typeof name === "string") {
			return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name === "all" ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}

		settings = name || {};
		if (typeof name === "string") {
			settings = {};
			settings[name] = value;
		}

		if (inst) {
			if (this._curInst === inst) {
				this._hideDatepicker();
			}

			date = this._getDateDatepicker(target, true);
			minDate = this._getMinMaxDate(inst, "min");
			maxDate = this._getMinMaxDate(inst, "max");
			datepicker_extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
				inst.settings.minDate = this._formatDate(inst, minDate);
			}
			if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			}
			if ( "disabled" in settings ) {
				if ( settings.disabled ) {
					this._disableDatepicker(target);
				} else {
					this._enableDatepicker(target);
				}
			}
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  date	Date - the new date
	 */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  noDefault boolean - true if no default date is to be used
	 * @return Date - the current date
	 */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline) {
			this._setDateFromField(inst, noDefault);
		}
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var onSelect, dateStr, sel,
			inst = $.datepicker._getInst(event.target),
			handled = true,
			isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing) {
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
									$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						}

						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							dateStr = $.datepicker._formatDate(inst);

							// trigger custom callback
							onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, "stepBigMonths") :
							-$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, "stepBigMonths") :
							+$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) {
							$.datepicker._clearDate(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) {
							$.datepicker._gotoToday(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, -7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, +7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		} else {
			handled = false;
		}

		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var chars, chr,
			inst = $.datepicker._getInst(event.target);

		if ($.datepicker._get(inst, "constrainInput")) {
			chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
			chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var date,
			inst = $.datepicker._getInst(event.target);

		if (inst.input.val() !== inst.lastVal) {
			try {
				date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));

				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	 * If false returned from beforeShow event handler do not show.
	 * @param  input  element - the input field attached to the date picker or
	 *					event - if triggered by focus
	 */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
			input = $("input", input.parentNode)[0];
		}

		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
			return;
		}

		var inst, beforeShow, beforeShowSettings, isFixed,
			offset, showAnim, duration;

		inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}

		beforeShow = $.datepicker._get(inst, "beforeShow");
		beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
			return;
		}
		datepicker_extendRemove(inst.settings, beforeShowSettings);

		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);

		if ($.datepicker._inDialog) { // hide cursor
			input.value = "";
		}
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}

		isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css("position") === "fixed";
			return !isFixed;
		});

		offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			"static" : (isFixed ? "fixed" : "absolute")), display: "none",
			left: offset.left + "px", top: offset.top + "px"});

		if (!inst.inline) {
			showAnim = $.datepicker._get(inst, "showAnim");
			duration = $.datepicker._get(inst, "duration");
			inst.dpDiv.css( "z-index", datepicker_getZindex( $( input ) ) + 1 );
			$.datepicker._datepickerShowing = true;

			if ( $.effects && $.effects.effect[ showAnim ] ) {
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
			} else {
				inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
			}

			if ( $.datepicker._shouldFocusInput( inst ) ) {
				inst.input.focus();
			}

			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		datepicker_instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append(this._generateHTML(inst));
		this._attachHandlers(inst);

		var origyearshtml,
			numMonths = this._getNumberOfMonths(inst),
			cols = numMonths[1],
			width = 17,
			activeCell = inst.dpDiv.find( "." + this._dayOverClass + " a" );

		if ( activeCell.length > 0 ) {
			datepicker_handleMouseover.apply( activeCell.get( 0 ) );
		}

		inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
		if (cols > 1) {
			inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
		}
		inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
			"Class"]("ui-datepicker-multi");
		inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
			"Class"]("ui-datepicker-rtl");

		if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
			inst.input.focus();
		}

		// deffered render of the years select (to avoid flashes on Firefox)
		if( inst.yearshtml ){
			origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	// #6694 - don't focus the input if it's already focused
	// this breaks the change event in IE
	// Support: IE and jQuery <1.9
	_shouldFocusInput: function( inst ) {
		return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth(),
			dpHeight = inst.dpDiv.outerHeight(),
			inputWidth = inst.input ? inst.input.outerWidth() : 0,
			inputHeight = inst.input ? inst.input.outerHeight() : 0,
			viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
			viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

		offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var position,
			inst = this._getInst(obj),
			isRTL = this._get(inst, "isRTL");

		while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
			obj = obj[isRTL ? "previousSibling" : "nextSibling"];
		}

		position = $(obj).offset();
		return [position.left, position.top];
	},

	/* Hide the date picker from view.
	 * @param  input  element - the input field attached to the date picker
	 */
	_hideDatepicker: function(input) {
		var showAnim, duration, postProcess, onClose,
			inst = this._curInst;

		if (!inst || (input && inst !== $.data(input, "datepicker"))) {
			return;
		}

		if (this._datepickerShowing) {
			showAnim = this._get(inst, "showAnim");
			duration = this._get(inst, "duration");
			postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
			} else {
				inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
					(showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
			}

			if (!showAnim) {
				postProcess();
			}
			this._datepickerShowing = false;

			onClose = this._get(inst, "onClose");
			if (onClose) {
				onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
			}

			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
				if ($.blockUI) {
					$.unblockUI();
					$("body").append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst) {
			return;
		}

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
				$target.parents("#" + $.datepicker._mainDivId).length === 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
				$.datepicker._hideDatepicker();
		}
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var date,
			target = $(id),
			inst = this._getInst(target[0]);

		if (this._get(inst, "gotoCurrent") && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		inst["selected" + (period === "M" ? "Month" : "Year")] =
		inst["draw" + (period === "M" ? "Month" : "Year")] =
			parseInt(select.options[select.selectedIndex].value,10);

		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var inst,
			target = $(id);

		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}

		inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $("a", td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		this._selectDate(target, "");
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var onSelect,
			target = $(id),
			inst = this._getInst(target[0]);

		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input) {
			inst.input.val(dateStr);
		}
		this._updateAlternate(inst);

		onSelect = this._get(inst, "onSelect");
		if (onSelect) {
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		} else if (inst.input) {
			inst.input.trigger("change"); // fire the change event
		}

		if (inst.inline){
			this._updateDatepicker(inst);
		} else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) !== "object") {
				inst.input.focus(); // restore focus
			}
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altFormat, date, dateStr,
			altField = this._get(inst, "altField");

		if (altField) { // update alternate field too
			altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
			date = this._getDate(inst);
			dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	 * @param  date  Date - the date to customise
	 * @return [boolean, string] - is this date selectable?, what is its CSS class?
	 */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ""];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	 * @param  date  Date - the date to get the week for
	 * @return  number - the number of the week within the year that contains this date
	 */
	iso8601Week: function(date) {
		var time,
			checkDate = new Date(date.getTime());

		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

		time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	 * See formatDate below for the possible formats.
	 *
	 * @param  format string - the expected format of the date
	 * @param  value string - the date in the above format
	 * @param  settings Object - attributes include:
	 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  Date - the extracted date value or null if value is blank
	 */
	parseDate: function (format, value, settings) {
		if (format == null || value == null) {
			throw "Invalid arguments";
		}

		value = (typeof value === "object" ? value.toString() : value + "");
		if (value === "") {
			return null;
		}

		var iFormat, dim, extra,
			iValue = 0,
			shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
			shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			year = -1,
			month = -1,
			day = -1,
			doy = -1,
			literal = false,
			date,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Extract a number from the string value
			getNumber = function(match) {
				var isDoubled = lookAhead(match),
					size = (match === "@" ? 14 : (match === "!" ? 20 :
					(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
					minSize = (match === "y" ? size : 1),
					digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
					num = value.substring(iValue).match(digits);
				if (!num) {
					throw "Missing number at position " + iValue;
				}
				iValue += num[0].length;
				return parseInt(num[0], 10);
			},
			// Extract a name from the string value and convert to an index
			getName = function(match, shortNames, longNames) {
				var index = -1,
					names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
						return [ [k, v] ];
					}).sort(function (a, b) {
						return -(a[1].length - b[1].length);
					});

				$.each(names, function (i, pair) {
					var name = pair[1];
					if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
						index = pair[0];
						iValue += name.length;
						return false;
					}
				});
				if (index !== -1) {
					return index + 1;
				} else {
					throw "Unknown name at position " + iValue;
				}
			},
			// Confirm that a literal character matches the string value
			checkLiteral = function() {
				if (value.charAt(iValue) !== format.charAt(iFormat)) {
					throw "Unexpected literal at position " + iValue;
				}
				iValue++;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					checkLiteral();
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d":
						day = getNumber("d");
						break;
					case "D":
						getName("D", dayNamesShort, dayNames);
						break;
					case "o":
						doy = getNumber("o");
						break;
					case "m":
						month = getNumber("m");
						break;
					case "M":
						month = getName("M", monthNamesShort, monthNames);
						break;
					case "y":
						year = getNumber("y");
						break;
					case "@":
						date = new Date(getNumber("@"));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "!":
						date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'")){
							checkLiteral();
						} else {
							literal = true;
						}
						break;
					default:
						checkLiteral();
				}
			}
		}

		if (iValue < value.length){
			extra = value.substr(iValue);
			if (!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}

		if (year === -1) {
			year = new Date().getFullYear();
		} else if (year < 100) {
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		}

		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim) {
					break;
				}
				month++;
				day -= dim;
			} while (true);
		}

		date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
			throw "Invalid date"; // E.g. 31/02/00
		}
		return date;
	},

	/* Standard date formats. */
	ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
	COOKIE: "D, dd M yy",
	ISO_8601: "yy-mm-dd",
	RFC_822: "D, d M y",
	RFC_850: "DD, dd-M-y",
	RFC_1036: "D, d M y",
	RFC_1123: "D, d M yy",
	RFC_2822: "D, d M yy",
	RSS: "D, d M y", // RFC 822
	TICKS: "!",
	TIMESTAMP: "@",
	W3C: "yy-mm-dd", // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	 * The format can be combinations of the following:
	 * d  - day of month (no leading zero)
	 * dd - day of month (two digit)
	 * o  - day of year (no leading zeros)
	 * oo - day of year (three digit)
	 * D  - day name short
	 * DD - day name long
	 * m  - month of year (no leading zero)
	 * mm - month of year (two digit)
	 * M  - month name short
	 * MM - month name long
	 * y  - year (two digit)
	 * yy - year (four digit)
	 * @ - Unix timestamp (ms since 01/01/1970)
	 * ! - Windows ticks (100ns since 01/01/0001)
	 * "..." - literal text
	 * '' - single quote
	 *
	 * @param  format string - the desired format of the date
	 * @param  date Date - the date value to format
	 * @param  settings Object - attributes include:
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  string - the date in the above format
	 */
	formatDate: function (format, date, settings) {
		if (!date) {
			return "";
		}

		var iFormat,
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Format a number, with leading zero if necessary
			formatNumber = function(match, value, len) {
				var num = "" + value;
				if (lookAhead(match)) {
					while (num.length < len) {
						num = "0" + num;
					}
				}
				return num;
			},
			// Format a name, short or long as requested
			formatName = function(match, value, shortNames, longNames) {
				return (lookAhead(match) ? longNames[value] : shortNames[value]);
			},
			output = "",
			literal = false;

		if (date) {
			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						output += format.charAt(iFormat);
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							output += formatNumber("d", date.getDate(), 2);
							break;
						case "D":
							output += formatName("D", date.getDay(), dayNamesShort, dayNames);
							break;
						case "o":
							output += formatNumber("o",
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case "m":
							output += formatNumber("m", date.getMonth() + 1, 2);
							break;
						case "M":
							output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
							break;
						case "y":
							output += (lookAhead("y") ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
							break;
						case "@":
							output += date.getTime();
							break;
						case "!":
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'")) {
								output += "'";
							} else {
								literal = true;
							}
							break;
						default:
							output += format.charAt(iFormat);
					}
				}
			}
		}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var iFormat,
			chars = "",
			literal = false,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					chars += format.charAt(iFormat);
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d": case "m": case "y": case "@":
						chars += "0123456789";
						break;
					case "D": case "M":
						return null; // Accept anything
					case "'":
						if (lookAhead("'")) {
							chars += "'";
						} else {
							literal = true;
						}
						break;
					default:
						chars += format.charAt(iFormat);
				}
			}
		}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() === inst.lastVal) {
			return;
		}

		var dateFormat = this._get(inst, "dateFormat"),
			dates = inst.lastVal = inst.input ? inst.input.val() : null,
			defaultDate = this._getDefaultDate(inst),
			date = defaultDate,
			settings = this._getFormatConfig(inst);

		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			dates = (noDefault ? "" : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			},
			offsetString = function(offset) {
				try {
					return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						offset, $.datepicker._getFormatConfig(inst));
				}
				catch (e) {
					// Ignore
				}

				var date = (offset.toLowerCase().match(/^c/) ?
					$.datepicker._getDate(inst) : null) || new Date(),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate(),
					pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
					matches = pattern.exec(offset);

				while (matches) {
					switch (matches[2] || "d") {
						case "d" : case "D" :
							day += parseInt(matches[1],10); break;
						case "w" : case "W" :
							day += parseInt(matches[1],10) * 7; break;
						case "m" : case "M" :
							month += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						case "y": case "Y" :
							year += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
					}
					matches = pattern.exec(offset);
				}
				return new Date(year, month, day);
			},
			newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
				(typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

		newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(newDate);
	},

	/* Handle switch to/from daylight saving.
	 * Hours may be non-zero on daylight saving cut-over:
	 * > 12 when midnight changeover, but then cannot generate
	 * midnight datetime, so jump to 1AM, otherwise reset.
	 * @param  date  (Date) the date to check
	 * @return  (Date) the corrected date
	 */
	_daylightSavingAdjust: function(date) {
		if (!date) {
			return null;
		}
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, noChange) {
		var clear = !date,
			origMonth = inst.selectedMonth,
			origYear = inst.selectedYear,
			newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
			this._notifyChange(inst);
		}
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? "" : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function(inst) {
		var stepMonths = this._get(inst, "stepMonths"),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find("[data-handler]").map(function () {
			var handler = {
				prev: function () {
					$.datepicker._adjustDate(id, -stepMonths, "M");
				},
				next: function () {
					$.datepicker._adjustDate(id, +stepMonths, "M");
				},
				hide: function () {
					$.datepicker._hideDatepicker();
				},
				today: function () {
					$.datepicker._gotoToday(id);
				},
				selectDay: function () {
					$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
					return false;
				},
				selectMonth: function () {
					$.datepicker._selectMonthYear(id, this, "M");
					return false;
				},
				selectYear: function () {
					$.datepicker._selectMonthYear(id, this, "Y");
					return false;
				}
			};
			$(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
		});
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
			controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
			monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
			selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
			cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
			printDate, dRow, tbody, daySettings, otherMonth, unselectable,
			tempDate = new Date(),
			today = this._daylightSavingAdjust(
				new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
			isRTL = this._get(inst, "isRTL"),
			showButtonPanel = this._get(inst, "showButtonPanel"),
			hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
			navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
			numMonths = this._getNumberOfMonths(inst),
			showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
			stepMonths = this._get(inst, "stepMonths"),
			isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
			currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
				new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			drawMonth = inst.drawMonth - showCurrentAtPos,
			drawYear = inst.drawYear;

		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;

		prevText = this._get(inst, "prevText");
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));

		prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
			" title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

		nextText = this._get(inst, "nextText");
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));

		next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
			" title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

		currentText = this._get(inst, "currentText");
		gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

		controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
			this._get(inst, "closeText") + "</button>" : "");

		buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
			(this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
			">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

		firstDay = parseInt(this._get(inst, "firstDay"),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);

		showWeek = this._get(inst, "showWeek");
		dayNames = this._get(inst, "dayNames");
		dayNamesMin = this._get(inst, "dayNamesMin");
		monthNames = this._get(inst, "monthNames");
		monthNamesShort = this._get(inst, "monthNamesShort");
		beforeShowDay = this._get(inst, "beforeShowDay");
		showOtherMonths = this._get(inst, "showOtherMonths");
		selectOtherMonths = this._get(inst, "selectOtherMonths");
		defaultDate = this._getDefaultDate(inst);
		html = "";
		dow;
		for (row = 0; row < numMonths[0]; row++) {
			group = "";
			this.maxRows = 4;
			for (col = 0; col < numMonths[1]; col++) {
				selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				cornerClass = " ui-corner-all";
				calender = "";
				if (isMultiMonth) {
					calender += "<div class='ui-datepicker-group";
					if (numMonths[1] > 1) {
						switch (col) {
							case 0: calender += " ui-datepicker-group-first";
								cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
							case numMonths[1]-1: calender += " ui-datepicker-group-last";
								cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
							default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
						}
					}
					calender += "'>";
				}
				calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
					(/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
					(/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
					"<tr>";
				thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
				for (dow = 0; dow < 7; dow++) { // days of the week
					day = (dow + firstDay) % 7;
					thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
						"<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
				}
				calender += thead + "</tr></thead><tbody>";
				daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				}
				leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
				numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += "<tr>";
					tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
						this._get(inst, "calculateWeek")(printDate) + "</td>");
					for (dow = 0; dow < 7; dow++) { // create date picker days
						daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
						otherMonth = (printDate.getMonth() !== drawMonth);
						unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += "<td class='" +
							((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
							(otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
							((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							" " + this._dayOverClass : "") + // highlight selected day
							(unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
							(printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
							(printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
							(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
							(otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
							(unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
							(printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
							(printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
							(otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
							"' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + "</tr>";
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
							((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
				group += calender;
			}
			html += group;
		}
		html += buttonPanel;
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {

		var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
			changeMonth = this._get(inst, "changeMonth"),
			changeYear = this._get(inst, "changeYear"),
			showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
			html = "<div class='ui-datepicker-title'>",
			monthHtml = "";

		// month selection
		if (secondary || !changeMonth) {
			monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
		} else {
			inMinYear = (minDate && minDate.getFullYear() === drawYear);
			inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
			monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
			for ( month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
					monthHtml += "<option value='" + month + "'" +
						(month === drawMonth ? " selected='selected'" : "") +
						">" + monthNamesShort[month] + "</option>";
				}
			}
			monthHtml += "</select>";
		}

		if (!showMonthAfterYear) {
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
		}

		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = "";
			if (secondary || !changeYear) {
				html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
			} else {
				// determine range of years to display
				years = this._get(inst, "yearRange").split(":");
				thisYear = new Date().getFullYear();
				determineYear = function(value) {
					var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
						(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
						parseInt(value, 10)));
					return (isNaN(year) ? thisYear : year);
				};
				year = determineYear(years[0]);
				endYear = Math.max(year, determineYear(years[1] || ""));
				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
				inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
				for (; year <= endYear; year++) {
					inst.yearshtml += "<option value='" + year + "'" +
						(year === drawYear ? " selected='selected'" : "") +
						">" + year + "</option>";
				}
				inst.yearshtml += "</select>";

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html += this._get(inst, "yearSuffix");
		if (showMonthAfterYear) {
			html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
		}
		html += "</div>"; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period === "Y" ? offset : 0),
			month = inst.drawMonth + (period === "M" ? offset : 0),
			day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
			date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period === "M" || period === "Y") {
			this._notifyChange(inst);
		}
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			newDate = (minDate && date < minDate ? minDate : date);
		return (maxDate && newDate > maxDate ? maxDate : newDate);
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, "onChangeMonthYear");
		if (onChange) {
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
		}
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, "numberOfMonths");
		return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst),
			date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

		if (offset < 0) {
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		}
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var yearSplit, currentYear,
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			minYear = null,
			maxYear = null,
			years = this._get(inst, "yearRange");
			if (years){
				yearSplit = years.split(":");
				currentYear = new Date().getFullYear();
				minYear = parseInt(yearSplit[0], 10);
				maxYear = parseInt(yearSplit[1], 10);
				if ( yearSplit[0].match(/[+\-].*/) ) {
					minYear += currentYear;
				}
				if ( yearSplit[1].match(/[+\-].*/) ) {
					maxYear += currentYear;
				}
			}

		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()) &&
			(!minYear || date.getFullYear() >= minYear) &&
			(!maxYear || date.getFullYear() <= maxYear));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, "shortYearCutoff");
		shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
			monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day === "object" ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindHover(dpDiv) {
	var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
	return dpDiv.delegate(selector, "mouseout", function() {
			$(this).removeClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).removeClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).removeClass("ui-datepicker-next-hover");
			}
		})
		.delegate( selector, "mouseover", datepicker_handleMouseover );
}

function datepicker_handleMouseover() {
	if (!$.datepicker._isDisabledDatepicker( datepicker_instActive.inline? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
		$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
		$(this).addClass("ui-state-hover");
		if (this.className.indexOf("ui-datepicker-prev") !== -1) {
			$(this).addClass("ui-datepicker-prev-hover");
		}
		if (this.className.indexOf("ui-datepicker-next") !== -1) {
			$(this).addClass("ui-datepicker-next-hover");
		}
	}
}

/* jQuery extend now ignores nulls! */
function datepicker_extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props) {
		if (props[name] == null) {
			target[name] = props[name];
		}
	}
	return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick);
		$.datepicker.initialized = true;
	}

	/* Append datepicker main container to body if not exist. */
	if ($("#"+$.datepicker._mainDivId).length === 0) {
		$("body").append($.datepicker.dpDiv);
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	return this.each(function() {
		typeof options === "string" ?
			$.datepicker["_" + options + "Datepicker"].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.11.4";

return $.datepicker;

}));
/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

return $.widget;

}));
/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

return $.ui.position;

}));




/*!
 * jQuery UI Menu 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget",
			"./position"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.widget( "ui.menu", {
	version: "1.11.4",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left-1 top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;

		// Flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			});

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item": function( event ) {
				var target = $( event.target );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// Only set the mouseHandled flag if the event will bubble, see #9469.
					if ( !event.isPropagationStopped() ) {
						this.mouseHandled = true;
					}

					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) && $( this.document[ 0 ].activeElement ).closest( ".ui-menu" ).length ) {

						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				// Ignore mouse events while typeahead is active, see #10458.
				// Prevents focusing the wrong item when typeahead causes a scroll while the mouse
				// is over an item in the menu
				if ( this.previousFilter ) {
					return;
				}
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.find( this.options.items ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( this._closeOnDocumentClick( event ) ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-menu-icons ui-front" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.removeUniqueId()
			.removeClass( "ui-state-hover" )
			.removeAttr( "tabIndex" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.children().each( function() {
				var elem = $( this );
				if ( elem.data( "ui-menu-submenu-carat" ) ) {
					elem.remove();
				}
			});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip,
			preventDefault = true;

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			match = this._filterMenuItems( character );
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				match = this._filterMenuItems( character );
			}

			if ( match.length ) {
				this.focus( event, match );
				this.previousFilter = character;
				this.filterTimer = this._delay(function() {
					delete this.previousFilter;
				}, 1000 );
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.is( "[aria-haspopup='true']" ) ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus, items,
			that = this,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this.element.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-front" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.parent(),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );
		items = menus.find( this.options.items );

		// Initialize menu-items containing spaces and/or dashes only as dividers
		items.not( ".ui-menu-item" ).each(function() {
			var item = $( this );
			if ( that._isDivider( item ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Don't refresh list items that are already adapted
		items.not( ".ui-menu-item, .ui-menu-divider" )
			.addClass( "ui-menu-item" )
			.uniqueId()
			.attr({
				tabIndex: -1,
				role: this._itemRole()
			});

		// Add aria-disabled attribute to any disabled menu item
		items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.element.find( ".ui-menu-icon" )
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu );
		}
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
		}
		this._super( key, value );
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.addClass( "ui-state-focus" ).removeClass( "ui-state-active" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.outerHeight();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( ".ui-state-active" ).not( ".ui-state-focus" )
				.removeClass( "ui-state-active" );
	},

	_closeOnDocumentClick: function( event ) {
		return !$( event.target ).closest( ".ui-menu" ).length;
	},

	_isDivider: function( item ) {

		// Match hyphen, em dash, en dash
		return !/[^\-\u2014\u2013\s]/.test( item.text() );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.find( this.options.items )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.find( this.options.items )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	},

	_filterMenuItems: function(character) {
		var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			regex = new RegExp( "^" + escapedCharacter, "i" );

		return this.activeMenu
			.find( this.options.items )

			// Only match on items, not dividers or other content (#10571)
			.filter( ".ui-menu-item" )
			.filter(function() {
				return regex.test( $.trim( $( this ).text() ) );
			});
	}
});

}));





/*!
 * jQuery UI Autocomplete 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/autocomplete/
 */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget",
			"./position",
			"./menu"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.widget( "ui.autocomplete", {
	version: "1.11.4",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestIndex: 0,
	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element[ 0 ].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "input";

		this.isMultiLine =
			// Textareas are always multi-line
			isTextarea ? true :
			// Inputs are always single-line, even if inside a contentEditable element
			// IE also treats inputs as contentEditable
			isInput ? false :
			// All other element types are determined by whether or not they're contentEditable
			this.element.prop( "isContentEditable" );

		this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						if ( !this.isMultiLine ) {
							this._value( this.term );
						}
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
						event.preventDefault();
					}
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch ( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete ui-front" )
			.appendTo( this._appendTo() )
			.menu({
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.hide()
			.menu( "instance" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				var label, item;
				// support: Firefox
				// Prevent accidental activation of menu items in Firefox (#7024 #9118)
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				}

				// Announce the value in the liveRegion
				label = ui.item.attr( "aria-label" ) || item.value;
				if ( label && $.trim( label ).length ) {
					this.liveRegion.children().hide();
					$( "<div>" ).text( label ).appendTo( this.liveRegion );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[ 0 ] !== this.document[ 0 ].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "assertive",
				"aria-relevant": "additions"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.appendTo( this.document[ 0 ].body );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {

			// Search if the value has changed, or if the user retypes the same value (see #7434)
			var equalValues = this.term === this._value(),
				menuVisible = this.menu.element.is( ":visible" ),
				modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

			if ( !equalValues || ( equalValues && !menuVisible && !modifierKey ) ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[ 0 ].label && items[ 0 ].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend( {}, item, {
				label: item.label || item.value,
				value: item.value || item.label
			});
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ) );

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" ).text( item.label ).appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {

			if ( !this.isMultiLine ) {
				this._value( this.term );
			}

			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
	},
	filter: function( array, term ) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
		return $.grep( array, function( value ) {
			return matcher.test( value.label || value.value || value );
		});
	}
});

// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.children().hide();
		$( "<div>" ).text( message ).appendTo( this.liveRegion );
	}
});

return $.ui.autocomplete;

}));
/*
 AngularJS v1.3.0-beta.11
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/

(function(K,S,t){'use strict';function G(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.3.0-beta.11/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function hb(b){if(null==b||Da(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:z(b)||M(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(P(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(hb(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function $b(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function ed(b,
a,c){for(var d=$b(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function ac(b){return function(a,c){b(c,a)}}function ib(){for(var b=ha.length,a;b;){b--;a=ha[b].charCodeAt(0);if(57==a)return ha[b]="A",ha.join("");if(90==a)ha[b]="0";else return ha[b]=String.fromCharCode(a+1),ha.join("")}ha.unshift("0");return ha.join("")}function bc(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function D(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});bc(b,a);return b}function W(b){return parseInt(b,
10)}function cc(b,a){return D(new (D(function(){},{prototype:b})),a)}function A(){}function Ea(b){return b}function aa(b){return function(){return b}}function y(b){return"undefined"===typeof b}function F(b){return"undefined"!==typeof b}function Q(b){return null!=b&&"object"===typeof b}function z(b){return"string"===typeof b}function Fa(b){return"number"===typeof b}function oa(b){return"[object Date]"===wa.call(b)}function M(b){return"[object Array]"===wa.call(b)}function P(b){return"function"===typeof b}
function jb(b){return"[object RegExp]"===wa.call(b)}function Da(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function fd(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function gd(b){var a={};b=b.split(",");var c;for(c=0;c<b.length;c++)a[b[c]]=!0;return a}function hd(b,a,c){var d=[];q(b,function(b,f,h){d.push(a.call(c,b,f,h))});return d}function Pa(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ga(b,a){var c=Pa(b,a);0<=
c&&b.splice(c,1);return a}function xa(b,a,c,d){if(Da(b)||b&&b.$evalAsync&&b.$watch)throw Qa("cpws");if(a){if(b===a)throw Qa("cpi");c=c||[];d=d||[];if(Q(b)){var e=Pa(c,b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(M(b))for(var f=a.length=0;f<b.length;f++)e=xa(b[f],null,c,d),Q(b[f])&&(c.push(b[f]),d.push(e)),a.push(e);else{var h=a.$$hashKey;q(a,function(b,c){delete a[c]});for(f in b)e=xa(b[f],null,c,d),Q(b[f])&&(c.push(b[f]),d.push(e)),a[f]=e;bc(a,h)}}else(a=b)&&(M(b)?a=xa(b,[],c,d):oa(b)?a=new Date(b.getTime()):
jb(b)?a=RegExp(b.source):Q(b)&&(a=xa(b,{},c,d)));return a}function ia(b,a){if(M(b)){a=a||[];for(var c=0;c<b.length;c++)a[c]=b[c]}else if(Q(b))for(c in a=a||{},b)!Db.call(b,c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a||b}function ya(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(M(b)){if(!M(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ya(b[d],a[d]))return!1;return!0}}else{if(oa(b))return oa(a)&&
b.getTime()==a.getTime();if(jb(b)&&jb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||Da(b)||Da(a)||M(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!P(b[d])){if(!ya(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==t&&!P(a[d]))return!1;return!0}return!1}function dc(){return S.securityPolicy&&S.securityPolicy.isActive||S.querySelector&&!(!S.querySelector("[ng-csp]")&&!S.querySelector("[data-ng-csp]"))}function Eb(b,
a){var c=2<arguments.length?pa.call(arguments,2):[];return!P(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(pa.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function id(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)&&"$"===b.charAt(1)?c=t:Da(a)?c="$WINDOW":a&&S===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function qa(b,a){return"undefined"===typeof b?t:JSON.stringify(b,id,
a?"  ":null)}function ec(b){return z(b)?JSON.parse(b):b}function Ra(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=r(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function fa(b){b=w(b).clone();try{b.empty()}catch(a){}var c=w("<div>").append(b).html();try{return 3===b[0].nodeType?r(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+r(b)})}catch(d){return r(c)}}function fc(b){try{return decodeURIComponent(b)}catch(a){}}function gc(b){var a={},
c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=fc(c[0]),F(d)&&(b=F(c[1])?fc(c[1]):!0,a[d]?M(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Fb(b){var a=[];q(b,function(b,d){M(b)?q(b,function(b){a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))}):a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))});return a.length?a.join("&"):""}function kb(b){return za(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function za(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,
":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function jd(b,a){var c,d,e=hc.length;b=w(b);for(d=0;d<e;++d)if(c=hc[d]+a,z(c=b.attr(c)))return c;return null}function kd(b,a){function c(a){a&&d.push(a)}var d=[b],e,f,h={},g=["ng:app","ng-app","x-ng-app","data-ng-app"],n=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(g,function(a){g[a]=!0;c(S.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+a+"\\:"),c),q(b.querySelectorAll("["+
a+"]"),c))});q(d,function(a){if(!e){var b=n.exec(" "+a.className+" ");b?(e=a,f=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&g[b.name]&&(e=a,f=b.value)})}});e&&(h.strictDi=null!==jd(e,"strict-di"),a(e,f?[f]:[],h))}function ic(b,a,c){Q(c)||(c={});c=D({strictDi:!1},c);var d=function(){b=w(b);if(b.injector()){var d=b[0]===S?"document":fa(b);throw Qa("btstrpd",d);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");d=Gb(a,c.strictDi);d.invoke(["$rootScope",
"$rootElement","$compile","$injector",function(a,b,c,d){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return d},e=/^NG_DEFER_BOOTSTRAP!/;if(K&&!e.test(K.name))return d();K.name=K.name.replace(e,"");Sa.resumeBootstrap=function(b){q(b,function(b){a.push(b)});d()}}function lb(b,a){a=a||"_";return b.replace(ld,function(b,d){return(d?a:"")+b.toLowerCase()})}function md(){var b;(ra=K.jQuery)&&ra.fn.on?(w=ra,D(ra.fn,{scope:Ha.scope,isolateScope:Ha.isolateScope,controller:Ha.controller,injector:Ha.injector,
inheritedData:Ha.inheritedData}),b=ra.cleanData,b=b.$$original||b,ra.cleanData=function(a){for(var c=0,d;null!=(d=a[c]);c++)ra(d).triggerHandler("$destroy");b(a)},ra.cleanData.$$original=b):w=N;Sa.element=w}function Hb(b,a,c){if(!b)throw Qa("areq",a||"?",c||"required");return b}function Ta(b,a,c){c&&M(b)&&(b=b[b.length-1]);Hb(P(b),a,"not a function, got "+(b&&"object"==typeof b?b.constructor.name||"Object":typeof b));return b}function Aa(b,a){if("hasOwnProperty"===b)throw Qa("badname",a);}function jc(b,
a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,h=0;h<f;h++)d=a[h],b&&(b=(e=b)[d]);return!c&&P(b)?Eb(e,b):b}function Ib(b){var a=b[0];b=b[b.length-1];if(a===b)return w(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return w(c)}function nd(b){var a=G("$injector"),c=G("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||G;return b.module||(b.module=function(){var b={};return function(e,f,h){if("hasOwnProperty"===e)throw c("badname","module");f&&b.hasOwnProperty(e)&&
(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e,f){f||(f=c);return function(){f[e||"push"]([a,d,arguments]);return k}}if(!f)throw a("nomod",e);var c=[],d=[],l=[],p=b("$injector","invoke","push",d),k={_invokeQueue:c,_configBlocks:d,_runBlocks:l,requires:f,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide","constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider",
"register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:p,run:function(a){l.push(a);return this}};h&&p(h);return k}())}}())}function od(b){D(b,{bootstrap:ic,copy:xa,extend:D,equals:ya,element:w,forEach:q,injector:Gb,noop:A,bind:Eb,toJson:qa,fromJson:ec,identity:Ea,isUndefined:y,isDefined:F,isString:z,isFunction:P,isObject:Q,isNumber:Fa,isElement:fd,isArray:M,version:pd,isDate:oa,lowercase:r,uppercase:Ia,callbacks:{counter:0},$$minErr:G,$$csp:dc});
Ua=nd(K);try{Ua("ngLocale")}catch(a){Ua("ngLocale",[]).provider("$locale",qd)}Ua("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:rd});a.provider("$compile",kc).directive({a:sd,input:lc,textarea:lc,form:td,script:ud,select:vd,style:wd,option:xd,ngBind:yd,ngBindHtml:zd,ngBindTemplate:Ad,ngClass:Bd,ngClassEven:Cd,ngClassOdd:Dd,ngCloak:Ed,ngController:Fd,ngForm:Gd,ngHide:Hd,ngIf:Id,ngInclude:Jd,ngInit:Kd,ngNonBindable:Ld,ngPluralize:Md,ngRepeat:Nd,ngShow:Od,ngStyle:Pd,ngSwitch:Qd,
ngSwitchWhen:Rd,ngSwitchDefault:Sd,ngOptions:Td,ngTransclude:Ud,ngModel:Vd,ngList:Wd,ngChange:Xd,required:mc,ngRequired:mc,ngValue:Yd,ngModelOptions:Zd}).directive({ngInclude:$d}).directive(Jb).directive(nc);a.provider({$anchorScroll:ae,$animate:be,$browser:ce,$cacheFactory:de,$controller:ee,$document:fe,$exceptionHandler:ge,$filter:oc,$interpolate:he,$interval:ie,$http:je,$httpBackend:ke,$location:le,$log:me,$parse:ne,$rootScope:oe,$q:pe,$sce:qe,$sceDelegate:re,$sniffer:se,$templateCache:te,$timeout:ue,
$window:ve,$$rAF:we,$$asyncCallback:xe})}])}function Va(b){return b.replace(ye,function(a,b,d,e){return e?d.toUpperCase():d}).replace(ze,"Moz$1")}function Ae(b,a){var c,d,e=a.createDocumentFragment(),f=[];if(Kb.test(b)){c=c||e.appendChild(a.createElement("div"));d=(Be.exec(b)||["",""])[1].toLowerCase();d=ba[d]||ba._default;c.innerHTML=d[1]+b.replace(Ce,"<$1></$2>")+d[2];for(d=d[0];d--;)c=c.lastChild;f=f.concat(pa.call(c.childNodes,void 0));c=e.firstChild;c.textContent=""}else f.push(a.createTextNode(b));
e.textContent="";e.innerHTML="";q(f,function(a){e.appendChild(a)});return e}function N(b){if(b instanceof N)return b;z(b)&&(b=Y(b));if(!(this instanceof N)){if(z(b)&&"<"!=b.charAt(0))throw Lb("nosel");return new N(b)}if(z(b)){var a;a=S;var c;b=(c=De.exec(b))?[a.createElement(c[1])]:(c=Ae(b,a))?c.childNodes:[]}pc(this,b)}function Mb(b){return b.cloneNode(!0)}function Ja(b){qc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ja(b[a])}function rc(b,a,c,d){if(F(d))throw Lb("offargs");var e=ja(b,"events");
ja(b,"handle")&&(y(a)?q(e,function(a,c){Wa(b,c,a);delete e[c]}):q(a.split(" "),function(a){y(c)?(Wa(b,a,e[a]),delete e[a]):Ga(e[a]||[],c)}))}function qc(b,a){var c=b[mb],d=Xa[c];d&&(a?delete Xa[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),rc(b)),delete Xa[c],b[mb]=t))}function ja(b,a,c){var d=b[mb],d=Xa[d||-1];if(F(c))d||(b[mb]=d=++Ee,d=Xa[d]={}),d[a]=c;else return d&&d[a]}function sc(b,a,c){var d=ja(b,"data"),e=F(c),f=!e&&F(a),h=f&&!Q(a);d||h||ja(b,"data",d={});if(e)d[a]=c;else if(f){if(h)return d&&
d[a];D(d,a)}else return d}function Nb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function nb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",Y((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+Y(a)+" "," ")))})}function ob(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=Y(a);-1===c.indexOf(" "+a+" ")&&
(c+=a+" ")});b.setAttribute("class",Y(c))}}function pc(b,a){if(a){a=a.nodeName||!F(a.length)||Da(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function tc(b,a){return pb(b,"$"+(a||"ngController")+"Controller")}function pb(b,a,c){b=w(b);9==b[0].nodeType&&(b=b.find("html"));for(a=M(a)?a:[a];b.length;){for(var d=b[0],e=0,f=a.length;e<f;e++)if((c=b.data(a[e]))!==t)return c;b=w(d.parentNode||11===d.nodeType&&d.host)}}function uc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ja(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}
function vc(b,a){var c=qb[a.toLowerCase()];return c&&wc[b.nodeName]&&c}function Fe(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||S);if(y(c.defaultPrevented)){var f=c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;f.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var h=ia(a[e||
c.type]||[]);q(h,function(a){a.call(b,c)});8>=T?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ka(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===t&&(c=b.$$hashKey=ib()):c=b;return a+":"+c}function Ya(b){q(b,this.put,this)}function Ge(b){return(b=b.toString().replace(xc,"").match(yc))?"function("+(b[1]||"").replace(/[\s\r\n]+/,
" ")+")":"fn"}function Ob(b,a,c){var d;if("function"==typeof b){if(!(d=b.$inject)){d=[];if(b.length){if(a)throw z(c)&&c||(c=b.name||Ge(b)),La("strictdi",c);a=b.toString().replace(xc,"");a=a.match(yc);q(a[1].split(He),function(a){a.replace(Ie,function(a,b,c){d.push(c)})})}b.$inject=d}}else M(b)?(a=b.length-1,Ta(b[a],"fn"),d=b.slice(0,a)):Ta(b,"fn",!0);return d}function Gb(b,a){function c(a){return function(b,c){if(Q(b))q(b,ac(a));else return a(b,c)}}function d(a,b){Aa(a,"service");if(P(b)||M(b))b=
k.instantiate(b);if(!b.$get)throw La("pget",a);return p[a+n]=b}function e(a,b){return d(a,{$get:b})}function f(a){var b=[],c;q(a,function(a){function d(a){var b,c;b=0;for(c=a.length;b<c;b++){var e=a[b],f=k.get(e[0]);f[e[1]].apply(f,e[2])}}if(!l.get(a)){l.put(a,!0);try{z(a)?(c=Ua(a),b=b.concat(f(c.requires)).concat(c._runBlocks),d(c._invokeQueue),d(c._configBlocks)):P(a)?b.push(k.invoke(a)):M(a)?b.push(k.invoke(a)):Ta(a,"module")}catch(e){throw M(a)&&(a=a[a.length-1]),e.message&&(e.stack&&-1==e.stack.indexOf(e.message))&&
(e=e.message+"\n"+e.stack),La("modulerr",a,e.stack||e.message||e);}}});return b}function h(b,c){function d(a){if(b.hasOwnProperty(a)){if(b[a]===g)throw La("cdep",m.join(" <- "));return b[a]}try{return m.unshift(a),b[a]=g,b[a]=c(a)}catch(e){throw b[a]===g&&delete b[a],e;}finally{m.shift()}}function e(b,c,f,g){"string"===typeof f&&(g=f,f=null);var h=[];g=Ob(b,a,g);var n,l,s;l=0;for(n=g.length;l<n;l++){s=g[l];if("string"!==typeof s)throw La("itkn",s);h.push(f&&f.hasOwnProperty(s)?f[s]:d(s))}b.$inject||
(b=b[n]);return b.apply(c,h)}return{invoke:e,instantiate:function(a,b,c){var d=function(){};d.prototype=(M(a)?a[a.length-1]:a).prototype;d=new d;a=e(a,d,b,c);return Q(a)||P(a)?a:d},get:d,annotate:Ob,has:function(a){return p.hasOwnProperty(a+n)||b.hasOwnProperty(a)}}}a=!0===a;var g={},n="Provider",m=[],l=new Ya,p={$provide:{provider:c(d),factory:c(e),service:c(function(a,b){return e(a,["$injector",function(a){return a.instantiate(b)}])}),value:c(function(a,b){return e(a,aa(b))}),constant:c(function(a,
b){Aa(a,"constant");p[a]=b;s[a]=b}),decorator:function(a,b){var c=k.get(a+n),d=c.$get;c.$get=function(){var a=C.invoke(d,c);return C.invoke(b,null,{$delegate:a})}}}},k=p.$injector=h(p,function(){throw La("unpr",m.join(" <- "));},a),s={},C=s.$injector=h(s,function(a){var b=k.get(a+n);return C.invoke(b.$get,b,t,a)},a);q(f(b),function(a){C.invoke(a||A)});return C}function ae(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=
null;q(a,function(a){b||"a"!==r(a.nodeName)||(b=a)});return b}function f(){var b=c.hash(),d;b?(d=h.getElementById(b))?d.scrollIntoView():(d=e(h.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var h=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(f)});return f}]}function xe(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function Je(b,a,c,d){function e(a){try{a.apply(null,
pa.call(arguments,1))}finally{if(C--,0===C)for(;L.length;)try{L.pop()()}catch(b){c.error(b)}}}function f(a,b){(function Ke(){q(x,function(a){a()});I=b(Ke,a)})()}function h(){v=null;u!=g.url()&&(u=g.url(),q(V,function(a){a(g.url())}))}var g=this,n=a[0],m=b.location,l=b.history,p=b.setTimeout,k=b.clearTimeout,s={};g.isMock=!1;var C=0,L=[];g.$$completeOutstandingRequest=e;g.$$incOutstandingRequestCount=function(){C++};g.notifyWhenNoOutstandingRequests=function(a){q(x,function(a){a()});0===C?a():L.push(a)};
var x=[],I;g.addPollFn=function(a){y(I)&&f(100,p);x.push(a);return a};var u=m.href,E=a.find("base"),v=null;g.url=function(a,c){m!==b.location&&(m=b.location);l!==b.history&&(l=b.history);if(a){if(u!=a)return u=a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),E.attr("href",E.attr("href"))):(v=a,c?m.replace(a):m.href=a),g}else return v||m.href.replace(/%27/g,"'")};var V=[],O=!1;g.onUrlChange=function(a){if(!O){if(d.history)w(b).on("popstate",h);if(d.hashchange)w(b).on("hashchange",h);
else g.addPollFn(h);O=!0}V.push(a);return a};g.baseHref=function(){var a=E.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var R={},U="",ca=g.baseHref();g.cookies=function(a,b){var d,e,f,g;if(a)b===t?n.cookie=escape(a)+"=;path="+ca+";expires=Thu, 01 Jan 1970 00:00:00 GMT":z(b)&&(d=(n.cookie=escape(a)+"="+escape(b)+";path="+ca).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(n.cookie!==U)for(U=n.cookie,
d=U.split("; "),R={},f=0;f<d.length;f++)e=d[f],g=e.indexOf("="),0<g&&(a=unescape(e.substring(0,g)),R[a]===t&&(R[a]=unescape(e.substring(g+1))));return R}};g.defer=function(a,b){var c;C++;c=p(function(){delete s[c];e(a)},b||0);s[c]=!0;return c};g.defer.cancel=function(a){return s[a]?(delete s[a],k(a),e(A),!0):!1}}function ce(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new Je(b,d,a,c)}]}function de(){this.$get=function(){function b(b,d){function e(a){a!=p&&(k?k==a&&
(k=a.n):k=a,f(a.n,a.p),f(a,p),p=a,p.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw G("$cacheFactory")("iid",b);var h=0,g=D({},d,{id:b}),n={},m=d&&d.capacity||Number.MAX_VALUE,l={},p=null,k=null;return a[b]={put:function(a,b){if(m<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!y(b))return a in n||h++,n[a]=b,h>m&&this.remove(k.key),b},get:function(a){if(m<Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return n[a]},remove:function(a){if(m<Number.MAX_VALUE){var b=l[a];if(!b)return;
b==p&&(p=b.p);b==k&&(k=b.n);f(b.n,b.p);delete l[a]}delete n[a];h--},removeAll:function(){n={};h=0;l={};p=k=null},destroy:function(){l=g=n=null;delete a[b]},info:function(){return D({},g,{size:h})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function te(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function kc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,f=/(([\d\w_\-]+)(?:\:([^;]+))?;?)/,
h=gd("ngSrc,ngSrcset,src,srcset"),g=/^(on[a-z]+|formaction)$/;this.directive=function m(a,e){Aa(a,"directive");z(a)?(Hb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,f){try{var g=b.invoke(c);P(g)?g={compile:aa(g)}:!g.compile&&g.link&&(g.compile=aa(g.link));g.priority=g.priority||0;g.index=f;g.name=g.name||a;g.require=g.require||g.controller&&g.name;g.restrict=g.restrict||"A";e.push(g)}catch(h){d(h)}});return e}])),
c[a].push(e)):q(a,ac(m));return this};this.aHrefSanitizationWhitelist=function(b){return F(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return F(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,p,k,s,C,L,x,I,u,E,v){function V(a,
b,c,d,e){a instanceof w||(a=w(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=w(b).wrap("<span></span>").parent()[0])});var f=R(a,b,a,c,d,e);O(a,"ng-scope");return function(b,c,d,e){Hb(b,"scope");var g=c?Ha.clone.call(a):a;q(d,function(a,b){g.data("$"+b+"Controller",a)});d=0;for(var h=g.length;d<h;d++){var l=g[d].nodeType;1!==l&&9!==l||g.eq(d).data("$scope",b)}c&&c(g,b);f&&f(b,g,g,e);return g}}function O(a,b){try{a.addClass(b)}catch(c){}}function R(a,b,c,d,e,f){function g(a,c,
d,e){var f,l,k,m,p,s,I;f=c.length;var x=Array(f);for(p=0;p<f;p++)x[p]=c[p];I=p=0;for(s=h.length;p<s;I++)l=x[I],c=h[p++],f=h[p++],k=w(l),c?(c.scope?(m=a.$new(),k.data("$scope",m)):m=a,k=c.transcludeOnThisElement?U(a,c.transclude,e):!c.templateOnThisElement&&e?e:!e&&b?U(a,b):null,c(f,m,l,d,k)):f&&f(a,l.childNodes,t,e)}for(var h=[],l,k,m,s,p=0;p<a.length;p++)l=new Pb,k=ca(a[p],[],l,0===p?d:t,e),(f=k.length?J(k,a[p],l,b,c,null,[],[],f):null)&&f.scope&&O(w(a[p]),"ng-scope"),l=f&&f.terminal||!(m=a[p].childNodes)||
!m.length?null:R(m,f?(f.transcludeOnThisElement||!f.templateOnThisElement)&&f.transclude:b),h.push(f,l),s=s||f||l,f=null;return s?g:null}function U(a,b,c){return function(d,e,f){var g=!1;d||(d=a.$new(),g=d.$$transcluded=!0);e=b(d,e,f,c);if(g)e.on("$destroy",function(){d.$destroy()});return e}}function ca(a,b,c,d,g){var h=c.$attr,l;switch(a.nodeType){case 1:sa(b,la(Ma(a).toLowerCase()),"E",d,g);var k,m,p;l=a.attributes;for(var s=0,I=l&&l.length;s<I;s++){var x=!1,C=!1;k=l[s];if(!T||8<=T||k.specified){m=
k.name;p=la(m);Ba.test(p)&&(m=lb(p.substr(6),"-"));var u=p.replace(/(Start|End)$/,"");p===u+"Start"&&(x=m,C=m.substr(0,m.length-5)+"end",m=m.substr(0,m.length-6));p=la(m.toLowerCase());h[p]=m;c[p]=k=Y(k.value);vc(a,p)&&(c[p]=!0);Na(a,b,k,p);sa(b,p,"A",d,g,x,C)}}a=a.className;if(z(a)&&""!==a)for(;l=f.exec(a);)p=la(l[2]),sa(b,p,"C",d,g)&&(c[p]=Y(l[3])),a=a.substr(l.index+l[0].length);break;case 3:G(b,a.nodeValue);break;case 8:try{if(l=e.exec(a.nodeValue))p=la(l[1]),sa(b,p,"M",d,g)&&(c[p]=Y(l[2]))}catch(L){}}b.sort(y);
return b}function B(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ga("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return w(d)}function X(a,b,c){return function(d,e,f,g,h){e=B(e[0],b,c);return a(d,e,f,g,h)}}function J(a,c,d,e,f,g,h,m,k){function s(a,b,c,d){if(a){c&&(a=X(a,c,d));a.require=H.require;a.directiveName=D;if(v===H||H.$$isolateScope)a=Ac(a,{isolateScope:!0});h.push(a)}if(b){c&&
(b=X(b,c,d));b.require=H.require;b.directiveName=D;if(v===H||H.$$isolateScope)b=Ac(b,{isolateScope:!0});m.push(b)}}function I(a,b,c,d){var e,f="data",g=!1;if(z(b)){for(;"^"==(e=b.charAt(0))||"?"==e;)b=b.substr(1),"^"==e&&(f="inheritedData"),g=g||"?"==e;e=null;d&&"data"===f&&(e=d[b]);e=e||c[f]("$"+b+"Controller");if(!e&&!g)throw ga("ctreq",b,a);}else M(b)&&(e=[],q(b,function(b){e.push(I(a,b,c,d))}));return e}function x(a,e,f,g,k){function s(a,b){var c;2>arguments.length&&(b=a,a=t);Na&&(c=ca);return k(a,
b,c)}var u,E,zc,B,V,J,ca={},X;u=c===f?d:ia(d,new Pb(w(f),d.$attr));E=u.$$element;if(v){var ka=/^\s*([@=&])(\??)\s*(\w*)\s*$/;g=w(f);J=e.$new(!0);!R||R!==v&&R!==v.$$originalDirective?g.data("$isolateScopeNoTemplate",J):g.data("$isolateScope",J);O(g,"ng-isolate-scope");q(v.scope,function(a,c){var d=a.match(ka)||[],f=d[3]||c,g="?"==d[2],d=d[1],h,k,p,m;J.$$isolateBindings[c]=d+f;switch(d){case "@":u.$observe(f,function(a){J[c]=a});u.$$observers[f].$$scope=e;u[f]&&(J[c]=b(u[f])(e));break;case "=":if(g&&
!u[f])break;k=C(u[f]);m=k.literal?ya:function(a,b){return a===b};p=k.assign||function(){h=J[c]=k(e);throw ga("nonassign",u[f],v.name);};h=J[c]=k(e);J.$watch(function Me(){var a=k(e);m(a,J[c])||(m(a,h)?p(e,a=J[c]):J[c]=a);Me.$$unwatch=k.$$unwatch;return h=a},null,k.literal);break;case "&":k=C(u[f]);J[c]=function(a){return k(e,a)};break;default:throw ga("iscp",v.name,c,a);}})}X=k&&s;U&&q(U,function(a){var b={$scope:a===v||a.$$isolateScope?J:e,$element:E,$attrs:u,$transclude:X},c;V=a.controller;"@"==
V&&(V=u[a.name]);c=L(V,b);ca[a.name]=c;Na||E.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});g=0;for(zc=h.length;g<zc;g++)try{B=h[g],B(B.isolateScope?J:e,E,u,B.require&&I(B.directiveName,B.require,E,ca),X)}catch(Le){p(Le,fa(E))}g=e;v&&(v.template||null===v.templateUrl)&&(g=J);a&&a(g,f.childNodes,t,k);for(g=m.length-1;0<=g;g--)try{B=m[g],B(B.isolateScope?J:e,E,u,B.require&&I(B.directiveName,B.require,E,ca),X)}catch(r){p(r,fa(E))}}k=k||{};for(var u=-Number.MAX_VALUE,E,
U=k.controllerDirectives,v=k.newIsolateScopeDirective,R=k.templateDirective,J=k.nonTlbTranscludeDirective,sa=!1,ab=!1,Na=k.hasElementTranscludeDirective,y=d.$$element=w(c),H,D,r,Za=e,G,K=0,N=a.length;K<N;K++){H=a[K];var Ba=H.$$start,rb=H.$$end;Ba&&(y=B(c,Ba,rb));r=t;if(u>H.priority)break;if(r=H.scope)E=E||H,H.templateUrl||($a("new/isolated scope",v,H,y),Q(r)&&(v=H));D=H.name;!H.templateUrl&&H.controller&&(r=H.controller,U=U||{},$a("'"+D+"' controller",U[D],H,y),U[D]=H);if(r=H.transclude)sa=!0,H.$$tlb||
($a("transclusion",J,H,y),J=H),"element"==r?(Na=!0,u=H.priority,r=B(c,Ba,rb),y=d.$$element=w(S.createComment(" "+D+": "+d[D]+" ")),c=y[0],sb(f,w(pa.call(r,0)),c),Za=V(r,e,u,g&&g.name,{nonTlbTranscludeDirective:J})):(r=w(Mb(c)).contents(),y.empty(),Za=V(r,e));if(H.template)if(ab=!0,$a("template",R,H,y),R=H,r=P(H.template)?H.template(y,d):H.template,r=Bc(r),H.replace){g=H;r=Kb.test(r)?w(Cc(H.type,Y(r))):[];c=r[0];if(1!=r.length||1!==c.nodeType)throw ga("tplrt",D,"");sb(f,y,c);N={$attr:{}};r=ca(c,[],
N);var T=a.splice(K+1,a.length-(K+1));v&&F(r);a=a.concat(r).concat(T);ka(d,N);N=a.length}else y.html(r);if(H.templateUrl)ab=!0,$a("template",R,H,y),R=H,H.replace&&(g=H),x=A(a.splice(K,a.length-K),y,d,f,sa&&Za,h,m,{controllerDirectives:U,newIsolateScopeDirective:v,templateDirective:R,nonTlbTranscludeDirective:J}),N=a.length;else if(H.compile)try{G=H.compile(y,d,Za),P(G)?s(null,G,Ba,rb):G&&s(G.pre,G.post,Ba,rb)}catch(W){p(W,fa(y))}H.terminal&&(x.terminal=!0,u=Math.max(u,H.priority))}x.scope=E&&!0===
E.scope;x.transcludeOnThisElement=sa;x.templateOnThisElement=ab;x.transclude=Za;k.hasElementTranscludeDirective=Na;return x}function F(a){for(var b=0,c=a.length;b<c;b++)a[b]=cc(a[b],{$$isolateScope:!0})}function sa(b,e,f,g,h,k,l){if(e===h)return null;h=null;if(c.hasOwnProperty(e)){var s;e=a.get(e+d);for(var I=0,x=e.length;I<x;I++)try{s=e[I],(g===t||g>s.priority)&&-1!=s.restrict.indexOf(f)&&(k&&(s=cc(s,{$$start:k,$$end:l})),b.push(s),h=s)}catch(u){p(u)}}return h}function ka(a,b){var c=b.$attr,d=a.$attr,
e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,f){"class"==f?(O(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function A(a,b,c,d,e,f,g,h){var l=[],p,m,I=b[0],x=a.shift(),C=D({},x,{templateUrl:null,transclude:null,replace:null,$$originalDirective:x}),L=P(x.templateUrl)?
x.templateUrl(b,c):x.templateUrl,E=x.type;b.empty();k.get(u.getTrustedResourceUrl(L),{cache:s}).success(function(k){var s,u;k=Bc(k);if(x.replace){k=Kb.test(k)?w(Cc(E,Y(k))):[];s=k[0];if(1!=k.length||1!==s.nodeType)throw ga("tplrt",x.name,L);k={$attr:{}};sb(d,b,s);var v=ca(s,[],k);Q(x.scope)&&F(v);a=v.concat(a);ka(c,k)}else s=I,b.html(k);a.unshift(C);p=J(a,s,c,e,b,x,f,g,h);q(d,function(a,c){a==s&&(d[c]=b[0])});for(m=R(b[0].childNodes,e);l.length;){k=l.shift();u=l.shift();var B=l.shift(),V=l.shift(),
v=b[0];if(u!==I){var X=u.className;h.hasElementTranscludeDirective&&x.replace||(v=Mb(s));sb(B,w(u),v);O(w(v),X)}u=p.transcludeOnThisElement?U(k,p.transclude,V):V;p(m,k,v,d,u)}l=null}).error(function(a,b,c,d){throw ga("tpload",d.url);});return function(a,b,c,d,e){l?(l.push(b),l.push(c),l.push(d),l.push(e)):p(m,b,c,d,e)}}function y(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function $a(a,b,c,d){if(b)throw ga("multidir",b.name,c.name,a,fa(d));}
function G(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:aa(function(a,e){var f=e.parent(),g=f.data("$binding")||[];d=b(c);g.push(d);O(f.data("$binding",g),"ng-binding");a.$watch(d,function(a){e[0].nodeValue=a})})})}function Cc(a,b){a=r(a||"html");switch(a){case "svg":case "math":var c=S.createElement("div");c.innerHTML="<"+a+">"+b+"</"+a+">";return c.childNodes[0].childNodes;default:return b}}function ab(a,b){if("srcdoc"==b)return u.HTML;var c=Ma(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||
"IMG"!=c&&("src"==b||"ngSrc"==b))return u.RESOURCE_URL}function Na(a,c,d,e){var f=b(d,!0);if(f){if("multiple"===e&&"SELECT"===Ma(a))throw ga("selmulti",fa(a));c.push({priority:100,compile:function(){return{pre:function(c,d,k){d=k.$$observers||(k.$$observers={});if(g.test(e))throw ga("nodomevents");if(f=b(k[e],!0,ab(a,e),h[e]))k[e]=f(c),(d[e]||(d[e]=[])).$$inter=!0,(k.$$observers&&k.$$observers[e].$$scope||c).$watch(f,function(a,b){"class"===e&&a!=b?k.$updateClass(a,b):k.$set(e,a)})}}}})}}function sb(a,
b,c){var d=b[0],e=b.length,f=d.parentNode,g,h;if(a)for(g=0,h=a.length;g<h;g++)if(a[g]==d){a[g++]=c;h=g+e-1;for(var k=a.length;g<k;g++,h++)h<k?a[g]=a[h]:delete a[g];a.length-=e-1;break}f&&f.replaceChild(c,d);a=S.createDocumentFragment();a.appendChild(d);c[w.expando]=d[w.expando];d=1;for(e=b.length;d<e;d++)f=b[d],w(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function Ac(a,b){return D(function(){return a.apply(null,arguments)},a,b)}var Pb=function(a,b){this.$$element=a;this.$attr=b||{}};
Pb.prototype={$normalize:la,$addClass:function(a){a&&0<a.length&&E.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&E.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=Dc(a,b),d=Dc(b,a);0===c.length?E.removeClass(this.$$element,d):0===d.length?E.addClass(this.$$element,c):E.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=vc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=lb(a,"-"));e=
Ma(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=v(b,"src"===a);!1!==c&&(null===b||b===t?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){p(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);x.$evalAsync(function(){e.$$inter||b(c[a])});return function(){Ga(e,b)}}};var K=b.startSymbol(),N=b.endSymbol(),Bc="{{"==K||"}}"==N?Ea:function(a){return a.replace(/\{\{/g,
K).replace(/}}/g,N)},Ba=/^ngAttr[A-Z]/;return V}]}function la(b){return Va(b.replace(Ne,""))}function Dc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),f=0;a:for(;f<d.length;f++){for(var h=d[f],g=0;g<e.length;g++)if(h==e[g])continue a;c+=(0<c.length?" ":"")+h}return c}function ee(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Aa(a,"controller");Q(a)?D(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,f){var h,g,n;z(e)&&(h=e.match(a),g=h[1],n=h[3],e=
b.hasOwnProperty(g)?b[g]:jc(f.$scope,g,!0)||jc(d,g,!0),Ta(e,g,!0));h=c.instantiate(e,f,g);if(n){if(!f||"object"!=typeof f.$scope)throw G("$controller")("noscp",g||e.name,n);f.$scope[n]=h}return h}}]}function fe(){this.$get=["$window",function(b){return w(b.document)}]}function ge(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function Ec(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=r(Y(b.substr(0,e)));d=Y(b.substr(e+1));c&&(a[c]=
a[c]?a[c]+(", "+d):d)});return a}function Fc(b){var a=Q(b)?b:t;return function(c){a||(a=Ec(b));return c?a[r(c)]||null:a}}function Gc(b,a,c){if(P(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function je(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){z(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=ec(d)));return d}],transformRequest:[function(a){return Q(a)&&"[object File]"!==wa.call(a)&&
"[object Blob]"!==wa.call(a)?qa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ia(d),put:ia(d),patch:ia(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},f=this.interceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,l,p){function k(a){function c(a){var b=D({},a,{data:Gc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:l.reject(b)}var d={method:"get",transformRequest:e.transformRequest,
transformResponse:e.transformResponse},f=function(a){function b(a){var c;q(a,function(b,d){P(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=D({},a.headers),f,g,c=D({},c.common,c[r(a.method)]);b(c);b(d);a:for(f in c){a=r(f);for(g in d)if(r(g)===a)continue a;d[f]=c[f]}return d}(a);D(d,a);d.headers=f;d.method=Ia(d.method);(a=Qb(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:t)&&(f[d.xsrfHeaderName||e.xsrfHeaderName]=a);var h=[function(a){f=a.headers;var b=Gc(a.data,Fc(f),a.transformRequest);
y(a.data)&&q(f,function(a,b){"content-type"===r(b)&&delete f[b]});y(a.withCredentials)&&!y(e.withCredentials)&&(a.withCredentials=e.withCredentials);return s(a,b,f).then(c,c)},t],k=l.when(d);for(q(x,function(a){(a.request||a.requestError)&&h.unshift(a.request,a.requestError);(a.response||a.responseError)&&h.push(a.response,a.responseError)});h.length;){a=h.shift();var n=h.shift(),k=k.then(a,n)}k.success=function(a){k.then(function(b){a(b.data,b.status,b.headers,d)});return k};k.error=function(a){k.then(null,
function(b){a(b.data,b.status,b.headers,d)});return k};return k}function s(b,c,f){function g(a,b,c,e){q&&(200<=a&&300>a?q.put(X,[a,b,Ec(c),e]):q.remove(X));n(b,a,c,e);d.$$phase||d.$apply()}function n(a,c,d,e){c=Math.max(c,0);(200<=c&&300>c?s.resolve:s.reject)({data:a,status:c,headers:Fc(d),config:b,statusText:e})}function p(){var a=Pa(k.pendingRequests,b);-1!==a&&k.pendingRequests.splice(a,1)}var s=l.defer(),x=s.promise,q,B,X=C(b.url,b.params);k.pendingRequests.push(b);x.then(p,p);(b.cache||e.cache)&&
(!1!==b.cache&&"GET"==b.method)&&(q=Q(b.cache)?b.cache:Q(e.cache)?e.cache:L);if(q)if(B=q.get(X),F(B)){if(B.then)return B.then(p,p),B;M(B)?n(B[1],B[0],ia(B[2]),B[3]):n(B,200,{},"OK")}else q.put(X,x);y(B)&&a(b.method,X,c,g,f,b.timeout,b.withCredentials,b.responseType);return x}function C(a,b){if(!b)return a;var c=[];ed(b,function(a,b){null===a||y(a)||(M(a)||(a=[a]),q(a,function(a){Q(a)&&(a=qa(a));c.push(za(b)+"="+za(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var L=c("$http"),
x=[];q(f,function(a){x.unshift(z(a)?p.get(a):p.invoke(a))});k.pendingRequests=[];(function(a){q(arguments,function(a){k[a]=function(b,c){return k(D(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){k[a]=function(b,c,d){return k(D(d||{},{method:a,url:b,data:c}))}})})("post","put");k.defaults=e;return k}]}function Oe(b){if(8>=T&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!K.XMLHttpRequest))return new K.ActiveXObject("Microsoft.XMLHTTP");if(K.XMLHttpRequest)return new K.XMLHttpRequest;
throw G("$httpBackend")("noxhr");}function ke(){this.$get=["$browser","$window","$document",function(b,a,c){return Pe(b,Oe,b.defer,a.angular.callbacks,c[0])}]}function Pe(b,a,c,d,e){function f(a,b,c){var f=e.createElement("script"),h=null;f.type="text/javascript";f.src=a;f.async=!0;h=function(a){Wa(f,"load",h);Wa(f,"error",h);e.body.removeChild(f);f=null;var g=-1,C="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),C=a.type,g="error"===a.type?404:200);c&&c(g,C)};tb(f,"load",h);tb(f,"error",
h);e.body.appendChild(f);return h}var h=-1;return function(e,n,m,l,p,k,s,C){function L(){I=h;E&&E();v&&v.abort()}function x(a,d,e,f,g){O&&c.cancel(O);E=v=null;0===d&&(d=e?200:"file"==ta(n).protocol?404:0);a(1223===d?204:d,e,f,g||"");b.$$completeOutstandingRequest(A)}var I;b.$$incOutstandingRequestCount();n=n||b.url();if("jsonp"==r(e)){var u="_"+(d.counter++).toString(36);d[u]=function(a){d[u].data=a;d[u].called=!0};var E=f(n.replace("JSON_CALLBACK","angular.callbacks."+u),u,function(a,b){x(l,a,d[u].data,
"",b);d[u]=A})}else{var v=a(e);v.open(e,n,!0);q(p,function(a,b){F(a)&&v.setRequestHeader(b,a)});v.onreadystatechange=function(){if(v&&4==v.readyState){var a=null,b=null;I!==h&&(a=v.getAllResponseHeaders(),b="response"in v?v.response:v.responseText);x(l,I||v.status,b,a,v.statusText||"")}};s&&(v.withCredentials=!0);if(C)try{v.responseType=C}catch(V){if("json"!==C)throw V;}v.send(m||null)}if(0<k)var O=c(L,k);else k&&k.then&&k.then(L)}}function he(){var b="{{",a="}}";this.startSymbol=function(a){return a?
(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(a){return"\\\\\\"+a}function h(f,h,s,C){C=!!C;for(var L,x,I=0,u=[],E=[],v=[],V=f.length,O=!1,R=!1,U=[],r={},B={};I<V;)if(-1!=(L=f.indexOf(b,I))&&-1!=(x=f.indexOf(a,L+g)))I!==L&&(R=!0),u.push(f.substring(I,L)),I=f.substring(L+g,x),E.push(I),v.push(c(I)),I=x+n,O=!0;else{I!==V&&(R=!0,u.push(f.substring(I)));break}q(u,function(c,d){u[d]=u[d].replace(m,b).replace(l,
a)});u.length===E.length&&u.push("");if(s&&O&&(R||1<E.length))throw Hc("noconcat",f);if(!h||O){U.length=u.length+E.length;var X=function(a){for(var b=0,c=E.length;b<c;b++)U[2*b]=u[b],U[2*b+1]=a[b];U[2*c]=u[c];return U.join("")},J=function(a){return a=s?e.getTrusted(s,a):e.valueOf(a)},w=function(a){if(null==a)return"";switch(typeof a){case "string":break;case "number":a=""+a;break;default:a=qa(a)}return a};return D(function ka(a){var b=a&&a.$id||"notAScope",c=r[b],e=B[b],g=0,h=E.length,n=Array(h),
k,l=e===t?!0:!1;c||(c=[],l=!0,a&&a.$on&&a.$on("$destroy",function(){r[b]=null;B[b]=null}));try{for(ka.$$unwatch=!0;g<h;g++){k=J(v[g](a));if(C&&y(k)){ka.$$unwatch=t;return}k=w(k);k!==c[g]&&(l=!0);n[g]=k;ka.$$unwatch=ka.$$unwatch&&v[g].$$unwatch}l&&(r[b]=n,B[b]=e=X(n))}catch(m){a=Hc("interr",f,m.toString()),d(a)}return e},{exp:f,separators:u,expressions:E})}}var g=b.length,n=a.length,m=RegExp(b.replace(/./g,f),"g"),l=RegExp(a.replace(/./g,f),"g");h.startSymbol=function(){return b};h.endSymbol=function(){return a};
return h}]}function ie(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,h,g,n){var m=a.setInterval,l=a.clearInterval,p=c.defer(),k=p.promise,s=0,C=F(n)&&!n;g=F(g)?g:0;k.then(null,null,d);k.$$intervalId=m(function(){p.notify(s++);0<g&&s>=g&&(p.resolve(s),l(k.$$intervalId),delete e[k.$$intervalId]);C||b.$apply()},h);e[k.$$intervalId]=p;return k}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],
!0):!1};return d}]}function qd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Rb(b){b=b.split("/");for(var a=b.length;a--;)b[a]=kb(b[a]);return b.join("/")}function Ic(b,a,c){b=ta(b,c);a.$$protocol=
b.protocol;a.$$host=b.hostname;a.$$port=W(b.port)||Qe[b.protocol]||null}function Jc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=ta(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=gc(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function ma(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function bb(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Sb(b){return b.substr(0,
bb(b).lastIndexOf("/")+1)}function Kc(b,a){this.$$html5=!0;a=a||"";var c=Sb(b);Ic(b,this,b);this.$$parse=function(a){var e=ma(c,a);if(!z(e))throw Tb("ipthprfx",a,c);Jc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Fb(this.$$search),b=this.$$hash?"#"+kb(this.$$hash):"";this.$$url=Rb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=ma(b,d))!==t)return d=e,(e=ma(a,e))!==t?c+(ma("/",e)||e):b+d;if((e=ma(c,
d))!==t)return c+e;if(c==d+"/")return c}}function Ub(b,a){var c=Sb(b);Ic(b,this,b);this.$$parse=function(d){var e=ma(b,d)||ma(c,d),e="#"==e.charAt(0)?ma(a,e):this.$$html5?e:"";if(!z(e))throw Tb("ihshprfx",d,a);Jc(e,this,b);d=this.$$path;var f=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Fb(this.$$search),e=this.$$hash?"#"+kb(this.$$hash):"";this.$$url=Rb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=
b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(bb(b)==bb(a))return a}}function Vb(b,a){this.$$html5=!0;Ub.apply(this,arguments);var c=Sb(b);this.$$rewrite=function(d){var e;if(b==bb(d))return d;if(e=ma(c,d))return b+a+e;if(c===d+"/")return c};this.$$compose=function(){var c=Fb(this.$$search),e=this.$$hash?"#"+kb(this.$$hash):"";this.$$url=Rb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function ub(b){return function(){return this[b]}}function Lc(b,a){return function(c){if(y(c))return this[b];
this[b]=a(c);this.$$compose();return this}}function le(){var b="",a=!1;this.hashPrefix=function(a){return F(a)?(b=a,this):b};this.html5Mode=function(b){return F(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,f){function h(a){c.$broadcast("$locationChangeSuccess",g.absUrl(),a)}var g,n,m=d.baseHref(),l=d.url(),p;a?(p=l.substring(0,l.indexOf("/",l.indexOf("//")+2))+(m||"/"),n=e.history?Kc:Vb):(p=bb(l),n=Ub);g=new n(p,"#"+b);g.$$parse(g.$$rewrite(l));f.on("click",
function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var e=w(a.target);"a"!==r(e[0].nodeName);)if(e[0]===f[0]||!(e=e.parent())[0])return;var h=e.prop("href");Q(h)&&"[object SVGAnimatedString]"===h.toString()&&(h=ta(h.animVal).href);if(n===Vb){var k=e.attr("href")||e.attr("xlink:href");if(0>k.indexOf("://"))if(h="#"+b,"/"==k[0])h=p+h+k;else if("#"==k[0])h=p+h+(g.path()||"/")+k;else{for(var l=g.path().split("/"),k=k.split("/"),m=0;m<k.length;m++)"."!=k[m]&&(".."==k[m]?l.pop():k[m].length&&l.push(k[m]));
h=p+h+l.join("/")}}l=g.$$rewrite(h);h&&(!e.attr("target")&&l&&!a.isDefaultPrevented())&&(a.preventDefault(),l!=d.url()&&(g.$$parse(l),c.$apply(),K.angular["ff-684208-preventDefault"]=!0))}});g.absUrl()!=l&&d.url(g.absUrl(),!0);d.onUrlChange(function(a){g.absUrl()!=a&&(c.$evalAsync(function(){var b=g.absUrl();g.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(g.$$parse(b),d.url(b)):h(b)}),c.$$phase||c.$digest())});var k=0;c.$watch(function(){var a=d.url(),b=g.$$replace;k&&a==g.absUrl()||
(k++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",g.absUrl(),a).defaultPrevented?g.$$parse(a):(d.url(g.absUrl(),b),h(a))}));g.$$replace=!1;return k});return g}]}function me(){var b=!0,a=this;this.debugEnabled=function(a){return F(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=
c.console||{},e=b[a]||b.log||A;a=!1;try{a=!!e.apply}catch(n){}return a?function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function da(b,a){if("constructor"===b)throw Ca("isecfld",a);return b}function cb(b,a){if(b){if(b.constructor===b)throw Ca("isecfn",a);if(b.document&&b.location&&b.alert&&
b.setInterval)throw Ca("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw Ca("isecdom",a);}return b}function vb(b,a,c,d){a=a.split(".");for(var e,f=0;1<a.length;f++){e=da(a.shift(),d);var h=b[e];h||(h={},b[e]=h);b=h}e=da(a.shift(),d);return b[e]=c}function Mc(b,a,c,d,e,f){da(b,f);da(a,f);da(c,f);da(d,f);da(e,f);return function(f,g){var n=g&&g.hasOwnProperty(b)?g:f;if(null==n)return n;n=n[b];if(!a)return n;if(null==n)return t;n=n[a];if(!c)return n;if(null==n)return t;n=n[c];
if(!d)return n;if(null==n)return t;n=n[d];return e?null==n?t:n=n[e]:n}}function Re(b,a){da(b,a);return function(a,d){return null==a?t:(d&&d.hasOwnProperty(b)?d:a)[b]}}function Se(b,a,c){da(b,c);da(a,c);return function(c,e){if(null==c)return t;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?t:c[a]}}function Nc(b,a,c){if(Wb.hasOwnProperty(b))return Wb[b];var d=b.split("."),e=d.length;if(1===e)a=Re(d[0],c);else if(2===e)a=Se(d[0],d[1],c);else if(a.csp)a=6>e?Mc(d[0],d[1],d[2],d[3],d[4],c):function(a,
b){var f=0,m;do m=Mc(d[f++],d[f++],d[f++],d[f++],d[f++],c)(a,b),b=t,a=m;while(f<e);return m};else{var f="var p;\n";q(d,function(a,b){da(a,c);f+="if(s == null) return undefined;\ns="+(b?"s":'((k&&k.hasOwnProperty("'+a+'"))?k:s)')+'["'+a+'"];\n'});f+="return s;";a=new Function("s","k",f);a.toString=aa(f)}"hasOwnProperty"!==b&&(Wb[b]=a);return a}function ne(){var b={},a={csp:!1};this.$get=["$filter","$sniffer",function(c,d){a.csp=d.csp;return function(d){function f(a){function b(e,f){c||(d=a(e,f),b.$$unwatch=
F(d),b.$$unwatch&&(e&&e.$$postDigestQueue)&&e.$$postDigestQueue.push(function(){(c=F(d))&&!d.$$unwrapTrustedValue&&(d=xa(d,null))}));return d}var c=!1,d;b.literal=a.literal;b.constant=a.constant;b.assign=a.assign;return b}var h,g;switch(typeof d){case "string":d=Y(d);":"===d.charAt(0)&&":"===d.charAt(1)&&(g=!0,d=d.substring(2));if(b.hasOwnProperty(d))return g?f(b[d]):b[d];h=new Xb(a);h=(new db(h,c,a)).parse(d);"hasOwnProperty"!==d&&(b[d]=h);h.constant&&(h.$$unwatch=!0);return g?f(h):h;case "function":return d;
default:return A}}}]}function pe(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Te(function(a){b.$evalAsync(a)},a)}]}function Te(b,a){function c(a){return a}function d(a){return h(a)}var e=function(){var h=[],m,l;return l={resolve:function(a){if(h){var c=h;h=t;m=f(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],m.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(g(a))},notify:function(a){if(h){var c=h;h.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=
c[d],b[2](a)})}},promise:{then:function(b,f,g){var l=e(),L=function(d){try{l.resolve((P(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},x=function(b){try{l.resolve((P(f)?f:d)(b))}catch(c){l.reject(c),a(c)}},I=function(b){try{l.notify((P(g)?g:c)(b))}catch(d){a(d)}};h?h.push([L,x,I]):m.then(L,x,I);return l.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,f){var g=null;try{g=(a||c)()}catch(h){return b(h,
!1)}return g&&P(g.then)?g.then(function(){return b(e,f)},function(a){return b(a,!1)}):b(e,f)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},f=function(a){return a&&P(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},h=function(a){var b=e();b.reject(a);return b.promise},g=function(c){return{then:function(f,g){var h=e();b(function(){try{h.resolve((P(g)?g:d)(c))}catch(b){h.reject(b),a(b)}});return h.promise}}};return{defer:e,reject:h,
when:function(g,m,l,p){var k=e(),s,C=function(b){try{return(P(m)?m:c)(b)}catch(d){return a(d),h(d)}},L=function(b){try{return(P(l)?l:d)(b)}catch(c){return a(c),h(c)}},x=function(b){try{return(P(p)?p:c)(b)}catch(d){a(d)}};b(function(){f(g).then(function(a){s||(s=!0,k.resolve(f(a).then(C,L,x)))},function(a){s||(s=!0,k.resolve(L(a)))},function(a){s||k.notify(x(a))})});return k.promise},all:function(a){var b=e(),c=0,d=M(a)?[]:{};q(a,function(a,e){c++;f(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,
--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function we(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,f=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};f.supported=
e;return f}]}function oe(){var b=10,a=G("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,f,h){function g(){this.$id=ib();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings=
{}}function n(b){if(k.$$phase)throw a("inprog",k.$$phase);k.$$phase=b}function m(a,b){var c=f(a);Ta(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function p(){}g.prototype={constructor:g,$new:function(a){a?(a=new g,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(this.$$childScopeClass||(this.$$childScopeClass=function(){this.$$watchers=this.$$nextSibling=this.$$childHead=
this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=ib();this.$$childScopeClass=null},this.$$childScopeClass.prototype=this),a=new this.$$childScopeClass);a["this"]=a;a.$parent=this;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=m(a,"watch"),f=this.$$watchers,g={fn:b,last:p,get:e,exp:a,eq:!!d};c=null;if(!P(b)){var h=m(b||A,"listener");g.fn=function(a,
b,c){h(c)}}f||(f=this.$$watchers=[]);f.unshift(g);return function(){Ga(f,g);c=null}},$watchGroup:function(a,b){function c(){return h}var d=Array(a.length),e=Array(a.length),g=[],h=0,k=this,n=Array(a.length),l=a.length;q(a,function(a,b){var c=f(a);g.push(k.$watch(c,function(a,f){e[b]=a;d[b]=f;h++;n[b]&&!c.$$unwatch&&l++;!n[b]&&c.$$unwatch&&l--;n[b]=c.$$unwatch}))},this);g.push(k.$watch(c,function(){b(e,d,k);c.$$unwatch=0===l?!0:!1}));return function(){q(g,function(a){a()})}},$watchCollection:function(a,
b){function c(){e=l(d);var a,b;if(Q(e))if(hb(e))for(g!==m&&(g=m,B=g.length=0,n++),a=e.length,B!==a&&(n++,g.length=B=a),b=0;b<a;b++)g[b]!==g[b]&&e[b]!==e[b]||g[b]===e[b]||(n++,g[b]=e[b]);else{g!==p&&(g=p={},B=0,n++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,g.hasOwnProperty(b)?g[b]!==e[b]&&(n++,g[b]=e[b]):(B++,g[b]=e[b],n++));if(B>a)for(b in n++,g)g.hasOwnProperty(b)&&!e.hasOwnProperty(b)&&(B--,delete g[b])}else g!==e&&(g=e,n++);c.$$unwatch=l.$$unwatch;return n}var d=this,e,g,h,k=1<b.length,n=0,l=f(a),
m=[],p={},q=!0,B=0;return this.$watch(c,function(){q?(q=!1,b(e,e,d)):b(e,h,d);if(k)if(Q(e))if(hb(e)){h=Array(e.length);for(var a=0;a<e.length;a++)h[a]=e[a]}else for(a in h={},e)Db.call(e,a)&&(h[a]=e[a]);else h=e})},$digest:function(){var d,f,g,h,l=this.$$asyncQueue,m=this.$$postDigestQueue,q,v,r=b,O,R=[],t=[],w,B,y;n("$digest");c=null;do{v=!1;for(O=this;l.length;){try{y=l.shift(),y.scope.$eval(y.expression)}catch(J){k.$$phase=null,e(J)}c=null}a:do{if(h=O.$$watchers)for(q=h.length;q--;)try{if(d=h[q])if((f=
d.get(O))!==(g=d.last)&&!(d.eq?ya(f,g):"number"==typeof f&&"number"==typeof g&&isNaN(f)&&isNaN(g)))v=!0,c=d,d.last=d.eq?xa(f,null):f,d.fn(f,g===p?f:g,O),5>r&&(w=4-r,R[w]||(R[w]=[]),B=P(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,B+="; newVal: "+qa(f)+"; oldVal: "+qa(g),R[w].push(B)),d.get.$$unwatch&&t.push({watch:d,array:h});else if(d===c){v=!1;break a}}catch(F){k.$$phase=null,e(F)}if(!(q=O.$$childHead||O!==this&&O.$$nextSibling))for(;O!==this&&!(q=O.$$nextSibling);)O=O.$parent}while(O=q);
if((v||l.length)&&!r--)throw k.$$phase=null,a("infdig",b,qa(R));}while(v||l.length);for(k.$$phase=null;m.length;)try{m.shift()()}catch(D){e(D)}for(q=t.length-1;0<=q;--q)d=t[q],d.watch.get.$$unwatch&&Ga(d.array,d.watch)},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==k&&(q(this.$$listenerCount,Eb(null,l,this)),a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&
(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=A,this.$on=this.$watch=this.$watchGroup=function(){return A})}},$eval:function(a,b){return f(a)(this,b)},$evalAsync:function(a){k.$$phase||k.$$asyncQueue.length||
h.defer(function(){k.$$asyncQueue.length&&k.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return n("$apply"),this.$eval(a)}catch(b){e(b)}finally{k.$$phase=null;try{k.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[Pa(c,
b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,f=this,g=!1,h={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},k=[h].concat(pa.call(arguments,1)),n,l;do{d=f.$$listeners[a]||c;h.currentScope=f;n=0;for(l=d.length;n<l;n++)if(d[n])try{d[n].apply(null,k)}catch(m){e(m)}else d.splice(n,1),n--,l--;if(g)return h.currentScope=null,h;f=f.$parent}while(f);h.currentScope=null;return h},$broadcast:function(a,b){for(var c=this,d=this,
f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(pa.call(arguments,1)),h,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,g)}catch(n){e(n)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}f.currentScope=null;return f}};var k=new g;return k}]}function rd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,
a=/^\s*(https?|ftp|file|blob):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return F(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return F(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;if(!T||8<=T)if(f=ta(c).href,""!==f&&!f.match(e))return"unsafe:"+f;return c}}}function Ue(b){if("self"===b)return b;if(z(b)){if(-1<b.indexOf("***"))throw ua("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",
".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if(jb(b))return RegExp("^"+b.source+"$");throw ua("imatcher");}function Oc(b){var a=[];F(b)&&q(b,function(b){a.push(Ue(b))});return a}function re(){this.SCE_CONTEXTS=ea;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Oc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Oc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};
a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw ua("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var f=d(),h={};h[ea.HTML]=d(f);h[ea.CSS]=d(f);h[ea.URL]=d(f);h[ea.JS]=d(f);h[ea.RESOURCE_URL]=d(h[ea.URL]);return{trustAs:function(a,b){var c=h.hasOwnProperty(a)?h[a]:null;if(!c)throw ua("icontext",a,b);if(null===b||b===t||""===b)return b;if("string"!==
typeof b)throw ua("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===t||""===d)return d;var f=h.hasOwnProperty(c)?h[c]:null;if(f&&d instanceof f)return d.$$unwrapTrustedValue();if(c===ea.RESOURCE_URL){var f=ta(d.toString()),l,p,k=!1;l=0;for(p=b.length;l<p;l++)if("self"===b[l]?Qb(f):b[l].exec(f.href)){k=!0;break}if(k)for(l=0,p=a.length;l<p;l++)if("self"===a[l]?Qb(f):a[l].exec(f.href)){k=!1;break}if(k)return d;throw ua("insecurl",d.toString());}if(c===ea.HTML)return e(d);throw ua("unsafe");
},valueOf:function(a){return a instanceof f?a.$$unwrapTrustedValue():a}}}]}function qe(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw ua("iequirks");var e=ia(ea);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Ea);e.parseAs=function(b,c){var d=a(c);return d.literal&&
d.constant?d:function k(a,c){var f=e.getTrusted(b,d(a,c));k.$$unwatch=d.$$unwatch;return f}};var f=e.parseAs,h=e.getTrusted,g=e.trustAs;q(ea,function(a,b){var c=r(b);e[Va("parse_as_"+c)]=function(b){return f(a,b)};e[Va("get_trusted_"+c)]=function(b){return h(a,b)};e[Va("trust_as_"+c)]=function(b){return g(a,b)}});return e}]}function se(){this.$get=["$window","$document",function(b,a){var c={},d=W((/android (\d+)/.exec(r((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),
f=a[0]||{},h=f.documentMode,g,n=/^(Moz|webkit|O|ms)(?=[A-Z])/,m=f.body&&f.body.style,l=!1,p=!1;if(m){for(var k in m)if(l=n.exec(k)){g=l[0];g=g.substr(0,1).toUpperCase()+g.substr(1);break}g||(g="WebkitOpacity"in m&&"webkit");l=!!("transition"in m||g+"Transition"in m);p=!!("animation"in m||g+"Animation"in m);!d||l&&p||(l=z(f.body.style.webkitTransition),p=z(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!h||7<h),hasEvent:function(a){if("input"==
a&&9==T)return!1;if(y(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:dc(),vendorPrefix:g,transitions:l,animations:p,android:d,msie:T,msieDocumentMode:h}}]}function ue(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,g,n){var m=c.defer(),l=m.promise,p=F(n)&&!n;g=a.defer(function(){try{m.resolve(e())}catch(a){m.reject(a),d(a)}finally{delete f[l.$$timeoutId]}p||b.$apply()},g);l.$$timeoutId=g;f[g]=m;return l}var f={};e.cancel=function(b){return b&&
b.$$timeoutId in f?(f[b.$$timeoutId].reject("canceled"),delete f[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function ta(b,a){var c=b;T&&(Z.setAttribute("href",c),c=Z.href);Z.setAttribute("href",c);return{href:Z.href,protocol:Z.protocol?Z.protocol.replace(/:$/,""):"",host:Z.host,search:Z.search?Z.search.replace(/^\?/,""):"",hash:Z.hash?Z.hash.replace(/^#/,""):"",hostname:Z.hostname,port:Z.port,pathname:"/"===Z.pathname.charAt(0)?Z.pathname:"/"+Z.pathname}}function Qb(b){b=z(b)?ta(b):
b;return b.protocol===Pc.protocol&&b.host===Pc.host}function ve(){this.$get=aa(K)}function oc(b){function a(d,e){if(Q(d)){var f={};q(d,function(b,c){f[c]=a(c,b)});return f}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Qc);a("date",Rc);a("filter",Ve);a("json",We);a("limitTo",Xe);a("lowercase",Ye);a("number",Sc);a("orderBy",Tc);a("uppercase",Ze)}function Ve(){return function(b,a,c){if(!M(b))return b;var d=
typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Sa.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Db.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var f=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,
b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var h in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(h);break;case "function":e.push(a);break;default:return b}d=[];for(h=0;h<b.length;h++){var g=
b[h];e.check(g)&&d.push(g)}return d}}function Qc(b){var a=b.NUMBER_FORMATS;return function(b,d){y(d)&&(d=a.CURRENCY_SYM);return Uc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Sc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Uc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Uc(b,a,c,d,e){if(null==b||!isFinite(b)||Q(b))return"";var f=0>b;b=Math.abs(b);var h=b+"",g="",n=[],m=!1;if(-1!==h.indexOf("e")){var l=h.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&
l[3]>e+1?h="0":(g=h,m=!0)}if(m)0<e&&(-1<b&&1>b)&&(g=b.toFixed(e));else{h=(h.split(Vc)[1]||"").length;y(e)&&(e=Math.min(Math.max(a.minFrac,h),a.maxFrac));h=Math.pow(10,e+1);b=Math.floor(b*h+5)/h;b=(""+b).split(Vc);h=b[0];b=b[1]||"";var l=0,p=a.lgSize,k=a.gSize;if(h.length>=p+k)for(l=h.length-p,m=0;m<l;m++)0===(l-m)%k&&0!==m&&(g+=c),g+=h.charAt(m);for(m=l;m<h.length;m++)0===(h.length-m)%p&&0!==m&&(g+=c),g+=h.charAt(m);for(;b.length<e;)b+="0";e&&"0"!==e&&(g+=d+b.substr(0,e))}n.push(f?a.negPre:a.posPre);
n.push(g);n.push(f?a.negSuf:a.posSuf);return n.join("")}function wb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function $(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return wb(e,a,d)}}function xb(b,a){return function(c,d){var e=c["get"+b](),f=Ia(a?"SHORT"+b:b);return d[f][e]}}function Wc(b){var a=(new Date(b,0,1)).getDay();return new Date(b,0,(4>=a?5:12)-a)}function Xc(b){return function(a){var c=
Wc(a.getFullYear());a=+new Date(a.getFullYear(),a.getMonth(),a.getDate()+(4-a.getDay()))-+c;a=1+Math.round(a/6048E5);return wb(a,b)}}function Rc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,h=0,g=b[8]?a.setUTCFullYear:a.setFullYear,n=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=W(b[9]+b[10]),h=W(b[9]+b[11]));g.call(a,W(b[1]),W(b[2])-1,W(b[3]));f=W(b[4]||0)-f;h=W(b[5]||0)-h;g=W(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));n.call(a,f,h,g,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
return function(c,e){var f="",h=[],g,n;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;z(c)&&(c=$e.test(c)?W(c):a(c));Fa(c)&&(c=new Date(c));if(!oa(c))return c;for(;e;)(n=af.exec(e))?(h=h.concat(pa.call(n,1)),e=h.pop()):(h.push(e),e=null);q(h,function(a){g=bf[a];f+=g?g(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return f}}function We(){return function(b){return qa(b,!0)}}function Xe(){return function(b,a){if(!M(b)&&!z(b))return b;a=Infinity===Math.abs(Number(a))?Number(a):W(a);
if(z(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Tc(b){return function(a,c,d){function e(a,b){return Ra(b)?function(b,c){return a(c,b)}:a}function f(a,b){var c=typeof a,d=typeof b;return c==d?("string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!M(a)||!c)return a;c=M(c)?c:[c];c=hd(c,function(a){var c=!1,d=a||Ea;if(z(a)){if("+"==
a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a);if(d.constant){var g=d();return e(function(a,b){return f(a[g],b[g])},c)}}return e(function(a,b){return f(d(a),d(b))},c)});for(var h=[],g=0;g<a.length;g++)h.push(a[g]);return h.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function va(b){P(b)&&(b={link:b});b.restrict=b.restrict||"AC";return aa(b)}function Yc(b,a,c,d){function e(a,c){c=c?"-"+lb(c,"-"):"";d.removeClass(b,(a?yb:
zb)+c);d.addClass(b,(a?zb:yb)+c)}var f=this,h=b.parent().controller("form")||Ab,g=0,n=f.$error={},m=[];f.$name=a.name||a.ngForm;f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;h.$addControl(f);b.addClass(Oa);e(!0);f.$commitViewValue=function(){q(m,function(a){a.$commitViewValue()})};f.$addControl=function(a){Aa(a.$name,"input");m.push(a);a.$name&&(f[a.$name]=a)};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];q(n,function(b,c){f.$setValidity(c,!0,a)});Ga(m,a)};f.$setValidity=
function(a,b,c){var d=n[a];if(b)d&&(Ga(d,c),d.length||(g--,g||(e(b),f.$valid=!0,f.$invalid=!1),n[a]=!1,e(!0,a),h.$setValidity(a,!0,f)));else{g||e(b);if(d){if(-1!=Pa(d,c))return}else n[a]=d=[],g++,e(!1,a),h.$setValidity(a,!1,f);d.push(c);f.$valid=!1;f.$invalid=!0}};f.$setDirty=function(){d.removeClass(b,Oa);d.addClass(b,Bb);f.$dirty=!0;f.$pristine=!1;h.$setDirty()};f.$setPristine=function(){d.removeClass(b,Bb);d.addClass(b,Oa);f.$dirty=!1;f.$pristine=!0;q(m,function(a){a.$setPristine()})}}function na(b,
a,c,d){b.$setValidity(a,c);return c?d:t}function cf(b,a,c){var d=c.prop("validity");Q(d)&&b.$parsers.push(function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)})}function eb(b,a,c,d,e,f){var h=a.prop("validity"),g=a[0].placeholder,n={};if(!e.android){var m=!1;a.on("compositionstart",function(a){m=!0});a.on("compositionend",function(){m=!1;l()})}var l=function(e){if(!m){var f=a.val(),k=e&&e.type;if(T&&"input"===(e||n).type&&a[0].placeholder!==
g)g=a[0].placeholder;else if(Ra(c.ngTrim||"T")&&(f=Y(f)),d.$viewValue!==f||h&&""===f&&!h.valueMissing)b.$$phase?d.$setViewValue(f,k):b.$apply(function(){d.$setViewValue(f,k)})}};if(e.hasEvent("input"))a.on("input",l);else{var p,k=function(a){p||(p=f.defer(function(){l(a);p=null}))};a.on("keydown",function(a){var b=a.keyCode;91===b||(15<b&&19>b||37<=b&&40>=b)||k(a)});if(e.hasEvent("paste"))a.on("paste cut",k)}a.on("change",l);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var q=
c.ngPattern;q&&((e=q.match(/^\/(.*)\/([gim]*)$/))?(q=RegExp(e[1],e[2]),e=function(a){return na(d,"pattern",d.$isEmpty(a)||q.test(a),a)}):e=function(c){var e=b.$eval(q);if(!e||!e.test)throw G("ngPattern")("noregexp",q,e,fa(a));return na(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var C=W(c.ngMinlength);e=function(a){return na(d,"minlength",d.$isEmpty(a)||a.length>=C,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var L=W(c.ngMaxlength);
e=function(a){return na(d,"maxlength",d.$isEmpty(a)||a.length<=L,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Cb(b,a){return function(c){var d;return oa(c)?c:z(c)&&(b.lastIndex=0,c=b.exec(c))?(c.shift(),d={yyyy:0,MM:1,dd:1,HH:0,mm:0},q(c,function(b,c){c<a.length&&(d[a[c]]=+b)}),new Date(d.yyyy,d.MM-1,d.dd,d.HH,d.mm)):NaN}}function fb(b,a,c,d){return function(e,f,h,g,n,m,l){eb(e,f,h,g,n,m);g.$parsers.push(function(d){if(g.$isEmpty(d))return g.$setValidity(b,!0),null;if(a.test(d))return g.$setValidity(b,
!0),c(d);g.$setValidity(b,!1);return t});g.$formatters.push(function(a){return oa(a)?l("date")(a,d):""});h.min&&(e=function(a){var b=g.$isEmpty(a)||c(a)>=c(h.min);g.$setValidity("min",b);return b?a:t},g.$parsers.push(e),g.$formatters.push(e));h.max&&(e=function(a){var b=g.$isEmpty(a)||c(a)<=c(h.max);g.$setValidity("max",b);return b?a:t},g.$parsers.push(e),g.$formatters.push(e))}}function Yb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=
a[d],l=0;l<b.length;l++)if(e==b[l])continue a;c.push(e)}return c}function e(a){if(!M(a)){if(z(a))return a.split(" ");if(Q(a)){var b=[];q(a,function(a,c){a&&(b=b.concat(c.split(" ")))});return b}}return a}return{restrict:"AC",link:function(f,h,g){function n(a,b){var c=h.data("$classCounts")||{},d=[];q(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});h.data("$classCounts",c);return d.join(" ")}function m(b){if(!0===a||f.$index%2===a){var k=e(b||[]);if(!l){var m=n(k,1);g.$addClass(m)}else if(!ya(b,
l)){var q=e(l),m=d(k,q),k=d(q,k),k=n(k,-1),m=n(m,1);0===m.length?c.removeClass(h,k):0===k.length?c.addClass(h,m):c.setClass(h,m,k)}}l=ia(b)}var l;f.$watch(g[b],m,!0);g.$observe("class",function(a){m(f.$eval(g[b]))});"ngClass"!==b&&f.$watch("$index",function(c,d){var h=c&1;if(h!==(d&1)){var l=e(f.$eval(g[b]));h===a?(h=n(l,1),g.$addClass(h)):(h=n(l,-1),g.$removeClass(h))}})}}}]}var r=function(b){return z(b)?b.toLowerCase():b},Db=Object.prototype.hasOwnProperty,Ia=function(b){return z(b)?b.toUpperCase():
b},T,w,ra,pa=[].slice,df=[].push,wa=Object.prototype.toString,Qa=G("ng"),Sa=K.angular||(K.angular={}),Ua,Ma,ha=["0","0","0"];T=W((/msie (\d+)/.exec(r(navigator.userAgent))||[])[1]);isNaN(T)&&(T=W((/trident\/.*; rv:(\d+)/.exec(r(navigator.userAgent))||[])[1]));A.$inject=[];Ea.$inject=[];var Y=function(){return String.prototype.trim?function(b){return z(b)?b.trim():b}:function(b){return z(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Ma=9>T?function(b){b=b.nodeName?b:b[0];return b.scopeName&&
"HTML"!=b.scopeName?Ia(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var hc=["ng-","data-ng-","ng:","x-ng-"],ld=/[A-Z]/g,pd={full:"1.3.0-beta.11",major:1,minor:3,dot:0,codeName:"transclusion-deforestation"},Xa=N.cache={},mb=N.expando="ng"+(new Date).getTime(),Ee=1,tb=K.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Wa=K.document.removeEventListener?function(b,a,c){b.removeEventListener(a,
c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};N._data=function(b){return this.cache[b[this.expando]]||{}};var ye=/([\:\-\_]+(.))/g,ze=/^moz([A-Z])/,Lb=G("jqLite"),De=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Kb=/<|&#?\w+;/,Be=/<([\w:]+)/,Ce=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ba={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>",
"</tr></tbody></table>"],_default:[0,"",""]};ba.optgroup=ba.option;ba.tbody=ba.tfoot=ba.colgroup=ba.caption=ba.thead;ba.th=ba.td;var Ha=N.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===S.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),N(K).on("load",a))},toString:function(){var b=[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?w(this[b]):w(this[this.length+b])},length:0,push:df,sort:[].sort,splice:[].splice},qb={};
q("multiple selected checked disabled readOnly required open".split(" "),function(b){qb[r(b)]=b});var wc={};q("input select option textarea button form details".split(" "),function(b){wc[Ia(b)]=!0});q({data:sc,inheritedData:pb,scope:function(b){return w(b).data("$scope")||pb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return w(b).data("$isolateScope")||w(b).data("$isolateScopeNoTemplate")},controller:tc,injector:function(b){return pb(b,"$injector")},removeAttr:function(b,
a){b.removeAttribute(a)},hasClass:Nb,css:function(b,a,c){a=Va(a);if(F(c))b.style[a]=c;else{var d;8>=T&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=T&&(d=""===d?t:d);return d}},attr:function(b,a,c){var d=r(a);if(qb[d])if(F(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||A).specified?d:t;else if(F(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?t:b},prop:function(b,
a,c){if(F(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(y(d))return e?b[e]:"";b[e]=d}var a=[];9>T?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(y(a)){if("SELECT"===Ma(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(y(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ja(d[c]);b.innerHTML=
a},empty:uc},function(b,a){N.prototype[a]=function(a,d){var e,f;if(b!==uc&&(2==b.length&&b!==Nb&&b!==tc?a:d)===t){if(Q(a)){for(e=0;e<this.length;e++)if(b===sc)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;f=e===t?Math.min(this.length,1):this.length;for(var h=0;h<f;h++){var g=b(this[h],a,d);e=e?e+g:g}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});q({removeData:qc,dealoc:Ja,on:function a(c,d,e,f){if(F(f))throw Lb("onargs");var h=ja(c,"events"),g=ja(c,"handle");
h||ja(c,"events",h={});g||ja(c,"handle",g=Fe(c,h));q(d.split(" "),function(d){var f=h[d];if(!f){if("mouseenter"==d||"mouseleave"==d){var l=S.body.contains||S.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};h[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],
function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||g(a,d)})}else tb(c,d,g),h[d]=[];f=h[d]}f.push(e)})},off:rc,one:function(a,c,d){a=w(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ja(a);q(new N(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,
c){q(new N(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new N(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=w(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ja(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new N(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:ob,removeClass:nb,toggleClass:function(a,c,d){c&&
q(c.split(" "),function(c){var f=d;y(f)&&(f=!Nb(a,c));(f?ob:nb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Mb,triggerHandler:function(a,c,d){c=(ja(a,"events")||{})[c];d=d||[];var e=[{preventDefault:A,stopPropagation:A}];q(c,function(c){c.apply(a,
e.concat(d))})}},function(a,c){N.prototype[c]=function(c,e,f){for(var h,g=0;g<this.length;g++)y(h)?(h=a(this[g],c,e,f),F(h)&&(h=w(h))):pc(h,a(this[g],c,e,f));return F(h)?h:this};N.prototype.bind=N.prototype.on;N.prototype.unbind=N.prototype.off});Ya.prototype={put:function(a,c){this[Ka(a)]=c},get:function(a){return this[Ka(a)]},remove:function(a){var c=this[a=Ka(a)];delete this[a];return c}};var yc=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,He=/,/,Ie=/^\s*(_?)(\S+?)\1\s*$/,xc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
La=G("$injector");Gb.$$annotate=Ob;var ef=G("$animate"),be=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw ef("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,h,g){h?h.after(a):c.prepend(a);g&&d(g)},
leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,g){this.enter(a,c,d,g)},addClass:function(a,c,h){c=z(c)?c:M(c)?c.join(" "):"";q(a,function(a){ob(a,c)});h&&d(h)},removeClass:function(a,c,h){c=z(c)?c:M(c)?c.join(" "):"";q(a,function(a){nb(a,c)});h&&d(h)},setClass:function(a,c,h,g){q(a,function(a){ob(a,c);nb(a,h)});g&&d(g)},enabled:A}}]}],ga=G("$compile");kc.$inject=["$provide","$$sanitizeUriProvider"];var Ne=/^(x[\:\-_]|data[\:\-_])/i,Hc=G("$interpolate"),ff=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
Qe={http:80,https:443,ftp:21},Tb=G("$location");Vb.prototype=Ub.prototype=Kc.prototype={$$html5:!1,$$replace:!1,absUrl:ub("$$absUrl"),url:function(a,c){if(y(a))return this.$$url;var d=ff.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:ub("$$protocol"),host:ub("$$host"),port:ub("$$port"),path:Lc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;
case 1:if(z(a))this.$$search=gc(a);else if(Q(a))this.$$search=a;else throw Tb("isrcharg");break;default:y(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Lc("$$hash",Ea),replace:function(){this.$$replace=!0;return this}};var Ca=G("$parse"),gb={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:A,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return F(d)?F(e)?d+e:d:F(e)?e:t},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(F(d)?
d:0)-(F(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":A,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,
c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},gf={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Xb=function(a){this.options=a};Xb.prototype={constructor:Xb,lex:function(a){this.text=a;this.index=0;this.ch=t;for(this.tokens=[];this.index<this.text.length;)if(this.ch=
this.text.charAt(this.index),this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent();else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch}),this.index++;else if(this.isWhitespace(this.ch))this.index++;else{a=this.ch+this.peek();var c=a+this.peek(2),d=gb[this.ch],e=gb[a],f=gb[c];f?(this.tokens.push({index:this.index,text:c,fn:f}),this.index+=3):e?(this.tokens.push({index:this.index,
text:a,fn:e}),this.index+=2):d?(this.tokens.push({index:this.index,text:this.ch,fn:d}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=
a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=F(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw Ca("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=r(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&
e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,constant:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,f,h,g;this.index<this.text.length;){g=this.text.charAt(this.index);if("."===g||this.isIdent(g)||this.isNumber(g))"."===g&&(e=this.index),c+=g;else break;this.index++}if(e)for(f=
this.index;f<this.text.length;){g=this.text.charAt(f);if("("===g){h=c.substr(e-d+1);c=c.substr(0,e-d);this.index=f;break}if(this.isWhitespace(g))f++;else break}d={index:d,text:c};if(gb.hasOwnProperty(c))d.fn=gb[c],d.constant=!0;else{var n=Nc(c,this.options,this.text);d.fn=D(function(a,c){return n(a,c)},{assign:function(d,e){return vb(d,c,e,a.text)}})}this.tokens.push(d);h&&(this.tokens.push({index:e,text:"."}),this.tokens.push({index:e+1,text:h}))},readString:function(a){var c=this.index;this.index++;
for(var d="",e=a,f=!1;this.index<this.text.length;){var h=this.text.charAt(this.index),e=e+h;if(f)"u"===h?(h=this.text.substring(this.index+1,this.index+5),h.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+h+"]"),this.index+=4,d+=String.fromCharCode(parseInt(h,16))):d=(f=gf[h])?d+f:d+h,f=!1;else if("\\"===h)f=!0;else{if(h===a){this.index++;this.tokens.push({index:c,text:e,string:d,constant:!0,fn:function(){return d}});return}d+=h}this.index++}this.throwError("Unterminated quote",
c)}};var db=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};db.ZERO=D(function(){return 0},{constant:!0});db.prototype={constructor:db,parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=
this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.constant&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw Ca("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw Ca("ueoe",
this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var f=this.tokens[0],h=f.text;if(h===a||h===c||h===d||h===e||!(a||c||d||e))return f}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return D(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return D(function(e,f){return a(e,
f)?c(e,f):d(e,f)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return D(function(e,f){return c(e,f,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0;f<a.length;f++){var h=a[f];h&&(e=h(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,
c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];this.expect(":");)d.push(this.expression());return aa(function(a,f,h){h=[h];for(var g=0;g<d.length;g++)h.push(d[g](a,f));return c.apply(a,h)})},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),
function(d,f){return a.assign(d,c(d,f),f)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=
this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},
unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(db.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Nc(d,this.options,this.text);return D(function(c,d,g){return e(g||a(c,d))},{assign:function(e,h,g){return vb(a(e,g),d,h,c.text)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return D(function(e,f){var h=a(e,f),g=d(e,f);
return h?cb(h[g],c.text):t},{assign:function(e,f,h){var g=d(e,h);return cb(a(e,h),c.text)[g]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(f,h){for(var g=[],n=c?c(f,h):f,m=0;m<d.length;m++)g.push(d[m](f,h));m=a(f,h,n)||A;cb(n,e.text);cb(m,e.text);g=m.apply?m.apply(n,g):m(g[0],g[1],g[2],g[3],g[4]);return cb(g,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;
var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return D(function(c,d){for(var h=[],g=0;g<a.length;g++)h.push(a[g](c,d));return h},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return D(function(c,d){for(var e={},n=0;n<
a.length;n++){var m=a[n];e[m.key]=m.value(c,d)}return e},{literal:!0,constant:c})}};var Wb={},ua=G("$sce"),ea={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},Z=S.createElement("a"),Pc=ta(K.location.href,!0);oc.$inject=["$provide"];Qc.$inject=["$locale"];Sc.$inject=["$locale"];var Vc=".",bf={yyyy:$("FullYear",4),yy:$("FullYear",2,0,!0),y:$("FullYear",1),MMMM:xb("Month"),MMM:xb("Month",!0),MM:$("Month",2,1),M:$("Month",1,1),dd:$("Date",2),d:$("Date",1),HH:$("Hours",2),H:$("Hours",
1),hh:$("Hours",2,-12),h:$("Hours",1,-12),mm:$("Minutes",2),m:$("Minutes",1),ss:$("Seconds",2),s:$("Seconds",1),sss:$("Milliseconds",3),EEEE:xb("Day"),EEE:xb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(wb(Math[0<a?"floor":"ceil"](a/60),2)+wb(Math.abs(a%60),2))},ww:Xc(2),w:Xc(1)},af=/((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,$e=/^\-?\d+$/;Rc.$inject=["$locale"];var Ye=
aa(r),Ze=aa(Ia);Tc.$inject=["$parse"];var sd=aa({restrict:"E",compile:function(a,c){8>=T&&(c.href||c.name||c.$set("href",""),a.append(S.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===wa.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||a.preventDefault()})}}}),Jb={};q(qb,function(a,c){if("multiple"!=a){var d=la("ng-"+c);Jb[d]=function(){return{priority:100,link:function(a,f,h){a.$watch(h[d],function(a){h.$set(c,
!!a)})}}}}});q(["src","srcset","href"],function(a){var c=la("ng-"+a);Jb[c]=function(){return{priority:99,link:function(d,e,f){var h=a,g=a;"href"===a&&"[object SVGAnimatedString]"===wa.call(e.prop("href"))&&(g="xlinkHref",f.$attr[g]="xlink:href",h=null);f.$observe(c,function(a){a&&(f.$set(g,a),T&&h&&e.prop(h,f[g]))})}}}});var Ab={$addControl:A,$removeControl:A,$setValidity:A,$setDirty:A,$setPristine:A};Yc.$inject=["$element","$attrs","$scope","$animate"];var Zc=function(a){return["$timeout",function(c){return{name:"form",
restrict:a?"EAC":"E",controller:Yc,compile:function(){return{pre:function(a,e,f,h){if(!f.action){var g=function(c){a.$apply(function(){h.$commitViewValue()});c.preventDefault?c.preventDefault():c.returnValue=!1};tb(e[0],"submit",g);e.on("$destroy",function(){c(function(){Wa(e[0],"submit",g)},0,!1)})}var n=e.parent().controller("form"),m=f.name||f.ngForm;m&&vb(a,m,h,m);if(n)e.on("$destroy",function(){n.$removeControl(h);m&&vb(a,m,t,m);D(h,Ab)})}}}}}]},td=Zc(),Gd=Zc(!0),hf=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
jf=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,kf=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,$c=/^(\d{4})-(\d{2})-(\d{2})$/,ad=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/,Zb=/^(\d{4})-W(\d\d)$/,bd=/^(\d{4})-(\d\d)$/,cd=/^(\d\d):(\d\d)$/,lf=/(\s+|^)default(\s+|$)/,dd={text:eb,date:fb("date",$c,Cb($c,["yyyy","MM","dd"]),"yyyy-MM-dd"),"datetime-local":fb("datetimelocal",ad,Cb(ad,["yyyy","MM","dd","HH","mm"]),"yyyy-MM-ddTHH:mm"),time:fb("time",cd,Cb(cd,["HH","mm"]),"HH:mm"),week:fb("week",Zb,function(a){if(oa(a))return a;
if(z(a)){Zb.lastIndex=0;var c=Zb.exec(a);if(c){a=+c[1];var d=+c[2],c=Wc(a),d=7*(d-1);return new Date(a,0,c.getDate()+d)}}return NaN},"yyyy-Www"),month:fb("month",bd,Cb(bd,["yyyy","MM"]),"yyyy-MM"),number:function(a,c,d,e,f,h){eb(a,c,d,e,f,h);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||kf.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return t});cf(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=
parseFloat(d.min);return na(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return na(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return na(e,"number",e.$isEmpty(a)||Fa(a),a)})},url:function(a,c,d,e,f,h){eb(a,c,d,e,f,h);a=function(a){return na(e,"url",e.$isEmpty(a)||hf.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,f,h){eb(a,c,d,e,f,h);
a=function(a){return na(e,"email",e.$isEmpty(a)||jf.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){y(d.name)&&c.attr("name",ib());c.on("click",function(f){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value,f&&f.type)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var f=d.ngTrueValue,h=d.ngFalseValue;z(f)||(f=!0);z(h)||(h=!1);c.on("click",function(d){a.$apply(function(){e.$setViewValue(c[0].checked,
d&&d.type)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==f};e.$formatters.push(function(a){return a===f});e.$parsers.push(function(a){return a?f:h})},hidden:A,button:A,submit:A,reset:A,file:A},lc=["$browser","$sniffer","$filter",function(a,c,d){return{restrict:"E",require:["?ngModel"],link:function(e,f,h,g){g[0]&&(dd[r(h.type)]||dd.text)(e,f,h,g[0],c,a,d)}}}],zb="ng-valid",yb="ng-invalid",Oa="ng-pristine",Bb="ng-dirty",mf=["$scope","$exceptionHandler","$attrs",
"$element","$parse","$animate","$timeout",function(a,c,d,e,f,h,g){function n(a,c){c=c?"-"+lb(c,"-"):"";h.removeClass(e,(a?yb:zb)+c);h.addClass(e,(a?zb:yb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var m=f(d.ngModel),l=m.assign,p=null,k=this;if(!l)throw G("ngModel")("nonassign",d.ngModel,fa(e));this.$render=A;this.$isEmpty=function(a){return y(a)||
""===a||null===a||a!==a};var s=e.inheritedData("$formController")||Ab,r=0,L=this.$error={};e.addClass(Oa);n(!0);this.$setValidity=function(a,c){L[a]!==!c&&(c?(L[a]&&r--,r||(n(!0),k.$valid=!0,k.$invalid=!1)):(n(!1),k.$invalid=!0,k.$valid=!1,r++),L[a]=!c,n(c,a),s.$setValidity(a,c,k))};this.$setPristine=function(){k.$dirty=!1;k.$pristine=!0;h.removeClass(e,Bb);h.addClass(e,Oa)};this.$rollbackViewValue=function(){g.cancel(p);k.$viewValue=k.$$lastCommittedViewValue;k.$render()};this.$commitViewValue=function(){var d=
k.$viewValue;g.cancel(p);k.$$lastCommittedViewValue!==d&&(k.$$lastCommittedViewValue=d,k.$pristine&&(k.$dirty=!0,k.$pristine=!1,h.removeClass(e,Oa),h.addClass(e,Bb),s.$setDirty()),q(k.$parsers,function(a){d=a(d)}),k.$modelValue!==d&&(k.$modelValue=d,l(a,d),q(k.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}})))};this.$setViewValue=function(a,c){k.$viewValue=a;k.$options&&!k.$options.updateOnDefault||k.$$debounceViewValueCommit(c)};this.$$debounceViewValueCommit=function(a){var c=0,d=k.$options;
d&&F(d.debounce)&&(d=d.debounce,Fa(d)?c=d:Fa(d[a])?c=d[a]:Fa(d["default"])&&(c=d["default"]));g.cancel(p);c?p=g(function(){k.$commitViewValue()},c):k.$commitViewValue()};a.$watch(function(){var c=m(a);if(k.$modelValue!==c){var d=k.$formatters,e=d.length;for(k.$modelValue=c;e--;)c=d[e](c);k.$viewValue!==c&&(k.$viewValue=k.$$lastCommittedViewValue=c,k.$render())}return c})}],Vd=function(){return{require:["ngModel","^?form","^?ngModelOptions"],controller:mf,link:{pre:function(a,c,d,e){e[2]&&(e[0].$options=
e[2].$options);var f=e[0],h=e[1]||Ab;h.$addControl(f);a.$on("$destroy",function(){h.$removeControl(f)})},post:function(a,c,d,e){var f=e[0];if(f.$options&&f.$options.updateOn)c.on(f.$options.updateOn,function(c){a.$apply(function(){f.$$debounceViewValueCommit(c&&c.type)})})}}}},Xd=aa({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),mc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var f=function(a){if(d.required&&
e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(f);e.$parsers.unshift(f);d.$observe("required",function(){f(e.$viewValue)})}}}},Wd=function(){return{require:"ngModel",link:function(a,c,d,e){var f=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!y(a)){var c=[];a&&q(a.split(f),function(a){a&&c.push(Y(a))});return c}});e.$formatters.push(function(a){return M(a)?a.join(", "):t});e.$isEmpty=function(a){return!a||
!a.length}}}},nf=/^(true|false|\d+)$/,Yd=function(){return{priority:100,compile:function(a,c){return nf.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},Zd=function(){return{controller:["$scope","$attrs",function(a,c){var d=this;this.$options=a.$eval(c.ngModelOptions);this.$options.updateOn!==t?(this.$options.updateOnDefault=!1,this.$options.updateOn=Y(this.$options.updateOn.replace(lf,function(){d.$options.updateOnDefault=
!0;return" "}))):this.$options.updateOnDefault=!0}]}},yd=va(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==t?"":a)})}),Ad=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],zd=["$sce","$parse",function(a,c){return function(d,e,f){function h(){var a=g(d);h.$$unwatch=g.$$unwatch;return(a||"").toString()}e.addClass("ng-binding").data("$binding",
f.ngBindHtml);var g=c(f.ngBindHtml);d.$watch(h,function(c){e.html(a.getTrustedHtml(g(d))||"")})}}],Bd=Yb("",!0),Dd=Yb("Odd",0),Cd=Yb("Even",1),Ed=va({compile:function(a,c){c.$set("ngCloak",t);a.removeClass("ng-cloak")}}),Fd=[function(){return{scope:!0,controller:"@",priority:500}}],nc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=la("ng-"+a);nc[c]=["$parse",function(d){return{compile:function(e,
f){var h=d(f[c]);return function(c,d,e){d.on(r(a),function(a){c.$apply(function(){h(c,{$event:a})})})}}}}]});var Id=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,h){var g,n,m;c.$watch(e.ngIf,function(c){Ra(c)?n||h(function(c,f){n=f;c[c.length++]=S.createComment(" end ngIf: "+e.ngIf+" ");g={clone:c};a.enter(c,d.parent(),d)}):(m&&(m.remove(),m=null),n&&(n.$destroy(),n=null),g&&(m=Ib(g.clone),a.leave(m,function(){m=null}),g=null))})}}}],
Jd=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,f){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Sa.noop,compile:function(h,g){var n=g.ngInclude||g.src,m=g.onload||"",l=g.autoscroll;return function(g,h,q,r,L){var x=0,t,u,E,v=function(){u&&(u.remove(),u=null);t&&(t.$destroy(),t=null);E&&(e.leave(E,function(){u=null}),u=E,E=null)};g.$watch(f.parseAsResourceUrl(n),function(f){var n=function(){!F(l)||l&&!g.$eval(l)||d()},q=++x;f?(a.get(f,
{cache:c}).success(function(a){if(q===x){var c=g.$new();r.template=a;a=L(c,function(a){v();e.enter(a,null,h,n)});t=c;E=a;t.$emit("$includeContentLoaded");g.$eval(m)}}).error(function(){q===x&&v()}),g.$emit("$includeContentRequested")):(v(),r.template=null)})}}}}],$d=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,f){d.html(f.template);a(d.contents())(c)}}}],Kd=va({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),
Ld=va({terminal:!0,priority:1E3}),Md=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,h){var g=h.count,n=h.$attr.when&&f.attr(h.$attr.when),m=h.offset||0,l=e.$eval(n)||{},p={},k=c.startSymbol(),s=c.endSymbol(),t=/^when(Minus)?(.+)$/;q(h,function(a,c){t.test(c)&&(l[r(c.replace("when","").replace("Minus","-"))]=f.attr(h.$attr[c]))});q(l,function(a,e){p[e]=c(a.replace(d,k+g+"-"+m+s))});e.$watch(function(){var c=parseFloat(e.$eval(g));if(isNaN(c))return"";c in
l||(c=a.pluralCat(c-m));return p[c](e)},function(a){f.text(a)})}}}],Nd=["$parse","$animate",function(a,c){var d=G("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,f,h,g,n){var m=h.ngRepeat,l=m.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),p,k,s,r,t,x,y={$id:Ka};if(!l)throw d("iexp",m);h=l[1];g=l[2];(l=l[3])?(p=a(l),k=function(a,c,d){x&&(y[x]=a);y[t]=c;y.$index=d;return p(e,y)}):(s=function(a,c){return Ka(c)},r=function(a){return a});
l=h.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",h);t=l[3]||l[1];x=l[2];var u={};e.$watchCollection(g,function(a){var e,g,h=f[0],l,p={},y,B,F,J,I,D,z,A=[],G=function(a,c){a[t]=F;x&&(a[x]=B);a.$index=c;a.$first=0===c;a.$last=c===y-1;a.$middle=!(a.$first||a.$last);a.$odd=!(a.$even=0===(c&1))};if(hb(a))D=a,I=k||s;else{I=k||r;D=[];for(g in a)a.hasOwnProperty(g)&&"$"!=g.charAt(0)&&D.push(g);D.sort()}y=D.length;g=A.length=D.length;for(e=0;e<g;e++)if(B=a===D?e:D[e],F=a[B],
J=I(B,F,e),Aa(J,"`track by` id"),u.hasOwnProperty(J))z=u[J],delete u[J],p[J]=z,A[e]=z;else{if(p.hasOwnProperty(J))throw q(A,function(a){a&&a.scope&&(u[a.id]=a)}),d("dupes",m,J);A[e]={id:J};p[J]=!1}for(l in u)u.hasOwnProperty(l)&&(z=u[l],g=Ib(z.clone),c.leave(g),q(g,function(a){a.$$NG_REMOVED=!0}),z.scope.$destroy());e=0;for(g=D.length;e<g;e++)if(B=a===D?e:D[e],F=a[B],z=A[e],A[e-1]&&(h=A[e-1].clone[A[e-1].clone.length-1]),z.scope){l=h;do l=l.nextSibling;while(l&&l.$$NG_REMOVED);z.clone[0]!=l&&c.move(Ib(z.clone),
null,w(h));h=z.clone[z.clone.length-1];G(z.scope,e)}else n(function(a,d){z.scope=d;a[a.length++]=S.createComment(" end ngRepeat: "+m+" ");c.enter(a,null,w(h));h=a;z.clone=a;p[z.id]=z;G(z.scope,e)});u=p})}}}],Od=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Ra(c)?"removeClass":"addClass"](d,"ng-hide")})}}],Hd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Ra(c)?"addClass":"removeClass"](d,"ng-hide")})}}],Pd=va(function(a,c,d){a.$watch(d.ngStyle,
function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Qd=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var h=[],g=[],n=[],m=[];c.$watch(e.ngSwitch||e.on,function(d){var p,k;p=0;for(k=n.length;p<k;++p)n[p].remove();p=n.length=0;for(k=m.length;p<k;++p){var s=g[p];m[p].$destroy();n[p]=s;a.leave(s,function(){n.splice(p,1)})}g.length=0;m.length=0;if(h=f.cases["!"+d]||f.cases["?"])c.$eval(e.change),
q(h,function(d){var e=c.$new();m.push(e);d.transclude(e,function(c){var e=d.element;g.push(c);a.enter(c,e.parent(),e)})})})}}}],Rd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),Sd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),Ud=
va({link:function(a,c,d,e,f){if(!f)throw G("ngTransclude")("orphan",fa(c));f(function(a){c.empty();c.append(a)})}}),ud=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],of=G("ngOptions"),Td=aa({terminal:!0}),vd=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
e={$setViewValue:A};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var n=this,m={},l=e,p;n.databound=d.ngModel;n.init=function(a,c,d){l=a;p=d};n.addOption=function(c){Aa(c,'"option value"');m[c]=!0;l.$viewValue==c&&(a.val(c),p.parent()&&p.remove())};n.removeOption=function(a){this.hasOption(a)&&(delete m[a],l.$viewValue==a&&this.renderUnknownOption(a))};n.renderUnknownOption=function(c){c="? "+Ka(c)+" ?";p.val(c);a.prepend(p);a.val(c);p.prop("selected",
!0)};n.hasOption=function(a){return m.hasOwnProperty(a)};c.$on("$destroy",function(){n.renderUnknownOption=A})}],link:function(e,h,g,n){function m(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(E.parent()&&E.remove(),c.val(a),""===a&&x.prop("selected",!0)):y(a)&&x?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){E.parent()&&E.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Ya(d.$viewValue);q(c.find("option"),
function(c){c.selected=F(a.get(c.value))})};a.$watch(function(){ya(e,d.$viewValue)||(e=ia(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function p(e,f,g){function h(){var a={"":[]},c=[""],d,k,r,t,w;t=g.$modelValue;w=x(e)||[];var B=n?$b(w):w,E,A,C;A={};r=!1;var G,K;if(s)if(v&&M(t))for(r=new Ya([]),C=0;C<t.length;C++)A[m]=t[C],r.put(v(e,A),t[C]);else r=new Ya(t);for(C=0;E=B.length,
C<E;C++){k=C;if(n){k=B[C];if("$"===k.charAt(0))continue;A[n]=k}A[m]=w[k];d=p(e,A)||"";(k=a[d])||(k=a[d]=[],c.push(d));s?d=F(r.remove(v?v(e,A):q(e,A))):(v?(d={},d[m]=t,d=v(e,d)===v(e,A)):d=t===q(e,A),r=r||d);G=l(e,A);G=F(G)?G:"";k.push({id:v?v(e,A):n?B[C]:C,label:G,selected:d})}s||(z||null===t?a[""].unshift({id:"",label:"",selected:!r}):r||a[""].unshift({id:"?",label:"",selected:!0}));A=0;for(B=c.length;A<B;A++){d=c[A];k=a[d];y.length<=A?(t={element:u.clone().attr("label",d),label:k.label},w=[t],y.push(w),
f.append(t.element)):(w=y[A],t=w[0],t.label!=d&&t.element.attr("label",t.label=d));G=null;C=0;for(E=k.length;C<E;C++)r=k[C],(d=w[C+1])?(G=d.element,d.label!==r.label&&G.text(d.label=r.label),d.id!==r.id&&G.val(d.id=r.id),d.selected!==r.selected&&G.prop("selected",d.selected=r.selected)):(""===r.id&&z?K=z:(K=D.clone()).val(r.id).attr("selected",r.selected).text(r.label),w.push({element:K,label:r.label,id:r.id,selected:r.selected}),G?G.after(K):t.element.append(K),G=K);for(C++;w.length>C;)w.pop().element.remove()}for(;y.length>
A;)y.pop()[0].element.remove()}var k;if(!(k=r.match(d)))throw of("iexp",r,fa(f));var l=c(k[2]||k[1]),m=k[4]||k[6],n=k[5],p=c(k[3]||""),q=c(k[2]?k[1]:m),x=c(k[7]),v=k[8]?c(k[8]):null,y=[[{element:f,label:""}]];z&&(a(z)(e),z.removeClass("ng-scope"),z.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=x(e)||[],d={},h,k,l,p,r,u,w;if(s)for(k=[],p=0,u=y.length;p<u;p++)for(a=y[p],l=1,r=a.length;l<r;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(v)for(w=0;w<c.length&&
(d[m]=c[w],v(e,d)!=h);w++);else d[m]=c[h];k.push(q(e,d))}}else{h=f.val();if("?"==h)k=t;else if(""===h)k=null;else if(v)for(w=0;w<c.length;w++){if(d[m]=c[w],v(e,d)==h){k=q(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=q(e,d);1<y[0].length&&y[0][1].id!==h&&(y[0][1].selected=!1)}g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(n[1]){var k=n[0];n=n[1];var s=g.multiple,r=g.ngOptions,z=!1,x,D=w(S.createElement("option")),u=w(S.createElement("optgroup")),E=D.clone();g=0;for(var v=h.children(),A=v.length;g<A;g++)if(""===
v[g].value){x=z=v.eq(g);break}k.init(n,z,E);s&&(n.$isEmpty=function(a){return!a||0===a.length});r?p(e,h,n):s?l(e,h,n):m(e,h,n,k)}}}}],xd=["$interpolate",function(a){var c={addOption:A,removeOption:A};return{restrict:"E",priority:100,compile:function(d,e){if(y(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var m=d.parent(),l=m.data("$selectController")||m.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;f?a.$watch(f,function(a,c){e.$set("value",
a);c!==a&&l.removeOption(c);l.addOption(a)}):l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],wd=aa({restrict:"E",terminal:!1});K.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):(md(),od(Sa),w(S).ready(function(){kd(S,ic)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-animate){display:none !important;}ng\\:form{display:block;}</style>');
//# sourceMappingURL=angular.min.js.map
;
/*
 AngularJS v1.3.0-beta.11
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/

(function(H,d,A){'use strict';function C(g,q){q=q||{};d.forEach(q,function(d,h){delete q[h]});for(var h in g)!g.hasOwnProperty(h)||"$"===h.charAt(0)&&"$"===h.charAt(1)||(q[h]=g[h]);return q}var w=d.$$minErr("$resource"),B=/^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;d.module("ngResource",["ng"]).provider("$resource",function(){var g=this;this.defaults={stripTrailingSlashes:!0,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}}};
this.$get=["$http","$q",function(q,h){function t(d,k){this.template=d;this.defaults=s({},g.defaults,k);this.urlParams={}}function v(x,k,l,m){function f(b,c){var f={};c=s({},k,c);r(c,function(a,c){u(a)&&(a=a());var d;if(a&&a.charAt&&"@"==a.charAt(0)){d=b;var e=a.substr(1);if(null==e||""===e||"hasOwnProperty"===e||!B.test("."+e))throw w("badmember",e);for(var e=e.split("."),n=0,k=e.length;n<k&&d!==A;n++){var h=e[n];d=null!==d?d[h]:A}}else d=a;f[c]=d});return f}function E(b){return b.resource}function e(b){C(b||
{},this)}var F=new t(x,m);l=s({},g.defaults.actions,l);e.prototype.toJSON=function(){var b=s({},this);delete b.$promise;delete b.$resolved;return b};r(l,function(b,c){var k=/^(POST|PUT|PATCH)$/i.test(b.method);e[c]=function(a,c,m,x){var n={},g,l,y;switch(arguments.length){case 4:y=x,l=m;case 3:case 2:if(u(c)){if(u(a)){l=a;y=c;break}l=c;y=m}else{n=a;g=c;l=m;break}case 1:u(a)?l=a:k?g=a:n=a;break;case 0:break;default:throw w("badargs",arguments.length);}var t=this instanceof e,p=t?g:b.isArray?[]:new e(g),
z={},v=b.interceptor&&b.interceptor.response||E,B=b.interceptor&&b.interceptor.responseError||A;r(b,function(b,a){"params"!=a&&("isArray"!=a&&"interceptor"!=a)&&(z[a]=G(b))});k&&(z.data=g);F.setUrlParams(z,s({},f(g,b.params||{}),n),b.url);n=q(z).then(function(a){var c=a.data,f=p.$promise;if(c){if(d.isArray(c)!==!!b.isArray)throw w("badcfg",b.isArray?"array":"object",d.isArray(c)?"array":"object");b.isArray?(p.length=0,r(c,function(a){p.push(new e(a))})):(C(c,p),p.$promise=f)}p.$resolved=!0;a.resource=
p;return a},function(a){p.$resolved=!0;(y||D)(a);return h.reject(a)});n=n.then(function(a){var b=v(a);(l||D)(b,a.headers);return b},B);return t?n:(p.$promise=n,p.$resolved=!1,p)};e.prototype["$"+c]=function(a,b,d){u(a)&&(d=b,b=a,a={});a=e[c].call(this,a,this,b,d);return a.$promise||a}});e.bind=function(b){return v(x,s({},k,b),l)};return e}var D=d.noop,r=d.forEach,s=d.extend,G=d.copy,u=d.isFunction;t.prototype={setUrlParams:function(g,k,l){var m=this,f=l||m.template,h,e,q=m.urlParams={};r(f.split(/\W/),
function(b){if("hasOwnProperty"===b)throw w("badname");!/^\d+$/.test(b)&&(b&&RegExp("(^|[^\\\\]):"+b+"(\\W|$)").test(f))&&(q[b]=!0)});f=f.replace(/\\:/g,":");k=k||{};r(m.urlParams,function(b,c){h=k.hasOwnProperty(c)?k[c]:m.defaults[c];d.isDefined(h)&&null!==h?(e=encodeURIComponent(h).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"%20").replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),f=f.replace(RegExp(":"+c+"(\\W|$)","g"),function(b,
a){return e+a})):f=f.replace(RegExp("(/?):"+c+"(\\W|$)","g"),function(b,a,c){return"/"==c.charAt(0)?c:a+c})});m.defaults.stripTrailingSlashes&&(f=f.replace(/\/+$/,"")||"/");f=f.replace(/\/\.(?=\w+($|\?))/,".");g.url=f.replace(/\/\\\./,"/.");r(k,function(b,c){m.urlParams[c]||(g.params=g.params||{},g.params[c]=b)})}};return v}]})})(window,window.angular);
//# sourceMappingURL=angular-resource.min.js.map
;
/*
 AngularJS v1.3.0-beta.11
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/

(function(n,e,A){'use strict';function x(s,g,k){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,b,c,f,w){function y(){p&&(p.remove(),p=null);h&&(h.$destroy(),h=null);l&&(k.leave(l,function(){p=null}),p=l,l=null)}function v(){var c=s.current&&s.current.locals;if(e.isDefined(c&&c.$template)){var c=a.$new(),d=s.current;l=w(c,function(d){k.enter(d,null,l||b,function(){!e.isDefined(t)||t&&!a.$eval(t)||g()});y()});h=d.scope=c;h.$emit("$viewContentLoaded");h.$eval(u)}else y()}
var h,l,p,t=c.autoscroll,u=c.onload||"";a.$on("$routeChangeSuccess",v);v()}}}function z(e,g,k){return{restrict:"ECA",priority:-400,link:function(a,b){var c=k.current,f=c.locals;b.html(f.$template);var w=e(b.contents());c.controller&&(f.$scope=a,f=g(c.controller,f),c.controllerAs&&(a[c.controllerAs]=f),b.data("$ngControllerController",f),b.children().data("$ngControllerController",f));w(a)}}}n=e.module("ngRoute",["ng"]).provider("$route",function(){function s(a,b){return e.extend(new (e.extend(function(){},
{prototype:a})),b)}function g(a,e){var c=e.caseInsensitiveMatch,f={originalPath:a,regexp:a},k=f.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,e,c,b){a="?"===b?b:null;b="*"===b?b:null;k.push({name:c,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(b&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");f.regexp=RegExp("^"+a+"$",c?"i":"");return f}var k={};this.when=function(a,b){k[a]=e.extend({reloadOnSearch:!0},b,a&&g(a,b));if(a){var c=
"/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";k[c]=e.extend({redirectTo:a},g(c,b))}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache","$sce",function(a,b,c,f,g,n,v,h){function l(){var d=p(),m=r.current;if(d&&m&&d.$$route===m.$$route&&e.equals(d.pathParams,m.pathParams)&&!d.reloadOnSearch&&!u)m.params=d.params,e.copy(m.params,c),a.$broadcast("$routeUpdate",m);else if(d||m)u=!1,a.$broadcast("$routeChangeStart",
d,m),(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?b.path(t(d.redirectTo,d.params)).search(d.params).replace():b.url(d.redirectTo(d.pathParams,b.path(),b.search())).replace()),f.when(d).then(function(){if(d){var a=e.extend({},d.resolve),b,c;e.forEach(a,function(d,b){a[b]=e.isString(d)?g.get(d):g.invoke(d,null,null,b)});e.isDefined(b=d.template)?e.isFunction(b)&&(b=b(d.params)):e.isDefined(c=d.templateUrl)&&(e.isFunction(c)&&(c=c(d.params)),c=h.getTrustedResourceUrl(c),e.isDefined(c)&&(d.loadedTemplateUrl=
c,b=n.get(c,{cache:v}).then(function(a){return a.data})));e.isDefined(b)&&(a.$template=b);return f.all(a)}}).then(function(b){d==r.current&&(d&&(d.locals=b,e.copy(d.params,c)),a.$broadcast("$routeChangeSuccess",d,m))},function(b){d==r.current&&a.$broadcast("$routeChangeError",d,m,b)})}function p(){var a,c;e.forEach(k,function(f,k){var q;if(q=!c){var g=b.path();q=f.keys;var l={};if(f.regexp)if(g=f.regexp.exec(g)){for(var h=1,p=g.length;h<p;++h){var n=q[h-1],r="string"==typeof g[h]?decodeURIComponent(g[h]):
g[h];n&&r&&(l[n.name]=r)}q=l}else q=null;else q=null;q=a=q}q&&(c=s(f,{params:e.extend({},b.search(),a),pathParams:a}),c.$$route=f)});return c||k[null]&&s(k[null],{params:{},pathParams:{}})}function t(a,b){var c=[];e.forEach((a||"").split(":"),function(a,d){if(0===d)c.push(a);else{var e=a.match(/(\w+)(.*)/),f=e[1];c.push(b[f]);c.push(e[2]||"");delete b[f]}});return c.join("")}var u=!1,r={routes:k,reload:function(){u=!0;a.$evalAsync(l)}};a.$on("$locationChangeSuccess",l);return r}]});n.provider("$routeParams",
function(){this.$get=function(){return{}}});n.directive("ngView",x);n.directive("ngView",z);x.$inject=["$route","$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map
;
/**
 * @license AngularJS v1.2.19
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */

(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngCookies
 * @description
 *
 * # ngCookies
 *
 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
 *
 *
 * <div doc-module-components="ngCookies"></div>
 *
 * See {@link ngCookies.$cookies `$cookies`} and
 * {@link ngCookies.$cookieStore `$cookieStore`} for usage.
 */


angular.module('ngCookies', ['ng']).
  /**
   * @ngdoc service
   * @name $cookies
   *
   * @description
   * Provides read/write access to browser's cookies.
   *
   * Only a simple Object is exposed and by adding or removing properties to/from this object, new
   * cookies are created/deleted at the end of current $eval.
   * The object's properties can only be strings.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * function ExampleController($cookies) {
   *   // Retrieving a cookie
   *   var favoriteCookie = $cookies.myFavorite;
   *   // Setting a cookie
   *   $cookies.myFavorite = 'oatmeal';
   * }
   * ```
   */
   factory('$cookies', ['$rootScope', '$browser', function ($rootScope, $browser) {
      var cookies = {},
          lastCookies = {},
          lastBrowserCookies,
          runEval = false,
          copy = angular.copy,
          isUndefined = angular.isUndefined;

      //creates a poller fn that copies all cookies from the $browser to service & inits the service
      $browser.addPollFn(function() {
        var currentCookies = $browser.cookies();
        if (lastBrowserCookies != currentCookies) { //relies on browser.cookies() impl
          lastBrowserCookies = currentCookies;
          copy(currentCookies, lastCookies);
          copy(currentCookies, cookies);
          if (runEval) $rootScope.$apply();
        }
      })();

      runEval = true;

      //at the end of each eval, push cookies
      //TODO: this should happen before the "delayed" watches fire, because if some cookies are not
      //      strings or browser refuses to store some cookies, we update the model in the push fn.
      $rootScope.$watch(push);

      return cookies;


      /**
       * Pushes all the cookies from the service to the browser and verifies if all cookies were
       * stored.
       */
      function push() {
        var name,
            value,
            browserCookies,
            updated;

        //delete any cookies deleted in $cookies
        for (name in lastCookies) {
          if (isUndefined(cookies[name])) {
            $browser.cookies(name, undefined);
          }
        }

        //update all cookies updated in $cookies
        for(name in cookies) {
          value = cookies[name];
          if (!angular.isString(value)) {
            value = '' + value;
            cookies[name] = value;
          }
          if (value !== lastCookies[name]) {
            $browser.cookies(name, value);
            updated = true;
          }
        }

        //verify what was actually stored
        if (updated){
          updated = false;
          browserCookies = $browser.cookies();

          for (name in cookies) {
            if (cookies[name] !== browserCookies[name]) {
              //delete or reset all cookies that the browser dropped from $cookies
              if (isUndefined(browserCookies[name])) {
                delete cookies[name];
              } else {
                cookies[name] = browserCookies[name];
              }
              updated = true;
            }
          }
        }
      }
    }]).


  /**
   * @ngdoc service
   * @name $cookieStore
   * @requires $cookies
   *
   * @description
   * Provides a key-value (string-object) storage, that is backed by session cookies.
   * Objects put or retrieved from this storage are automatically serialized or
   * deserialized by angular's toJson/fromJson.
   *
   * Requires the {@link ngCookies `ngCookies`} module to be installed.
   *
   * @example
   *
   * ```js
   * function ExampleController($cookies) {
   *   // Put cookie
   *   $cookieStore.put('myFavorite','oatmeal');
   *   // Get cookie
   *   var favoriteCookie = $cookieStore.get('myFavorite');
   *   // Removing a cookie
   *   $cookieStore.remove('myFavorite');
   * }
   * ```
   */
   factory('$cookieStore', ['$cookies', function($cookies) {

      return {
        /**
         * @ngdoc method
         * @name $cookieStore#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        get: function(key) {
          var value = $cookies[key];
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookieStore#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         */
        put: function(key, value) {
          $cookies[key] = angular.toJson(value);
        },

        /**
         * @ngdoc method
         * @name $cookieStore#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         */
        remove: function(key) {
          delete $cookies[key];
        }
      };

    }]);


})(window, window.angular);
/*! ngTable v1.0.0 by Vitalii Savchuk(esvit666@gmail.com) - https://github.com/esvit/ng-table - New BSD License */

!function(a,b){"use strict";return"function"==typeof define&&define.amd?void define(["angular"],function(a){return b(a)}):b(a)}(window.angular||null,function(a){"use strict";return function(){a.module("ngTable",[])}(),function(){a.module("ngTable").value("ngTableDefaults",{params:{},settings:{}})}(),function(){function b(b){function c(b,c){var f=b.charAt(0).toUpperCase()+b.substring(1),g={};return g["on"+f]=d(b),g["publish"+f]=e(b),a.extend(c,g)}function d(c){return function(d){var e=a.identity,g=b;if(2===arguments.length?a.isFunction(arguments[1].$new)?g=arguments[1]:e=arguments[1]:arguments.length>2&&(g=arguments[1],e=arguments[2]),a.isObject(e)){var h=e;e=function(a){return a===h}}return g.$on("ngTable:"+c,function(a,b){if(!b.isNullInstance){var c=f(arguments,2),g=[b].concat(c);e.apply(this,g)&&d.apply(this,g)}})}}function e(a){return function(){var c=["ngTable:"+a].concat(Array.prototype.slice.call(arguments));b.$broadcast.apply(b,c)}}function f(a,b){return Array.prototype.slice.call(a,null==b?1:b)}var g={};return g=c("afterCreated",g),g=c("afterReloadData",g),g=c("datasetChanged",g),g=c("pagesChanged",g)}a.module("ngTable").factory("ngTableEventsChannel",b),b.$inject=["$rootScope"]}(),function(){function b(){function b(){c()}function c(){f=g}function d(b){var c=a.extend({},f,b);c.aliasUrls=a.extend({},f.aliasUrls,b.aliasUrls),f=c}function e(){function b(b,c){return a.isObject(b)&&(b=b.id),-1!==b.indexOf("/")?b:e.getUrlForAlias(b,c)}function c(a){return f.aliasUrls[a]||f.defaultBaseUrl+a+f.defaultExt}var d,e={config:d,getTemplateUrl:b,getUrlForAlias:c};return Object.defineProperty(e,"config",{get:function(){return d=d||a.copy(f)},enumerable:!0}),e}var f,g={defaultBaseUrl:"ng-table/filters/",defaultExt:".html",aliasUrls:{}};this.$get=e,this.resetConfigs=c,this.setConfig=d,b(),e.$inject=[]}a.module("ngTable").provider("ngTableFilterConfig",b),b.$inject=[]}(),function(){function b(){function b(b){function d(d){var e=d.settings().filterOptions;return a.isFunction(e.filterFn)?e.filterFn:b(e.filterFilterName||c.filterFilterName)}function e(){return b(c.sortingFilterName)}function f(a,b){if(!b.hasFilter())return a;var c=b.filter(!0),e=Object.keys(c),f=e.reduce(function(a,b){return a=j(a,c[b],b)},{}),g=d(b);return g.call(b,a,f,b.settings().filterOptions.filterComparator)}function g(a,b){var c=a.slice((b.page()-1)*b.count(),b.page()*b.count());return b.total(a.length),c}function h(a,b){var c=b.orderBy(),d=e(b);return c.length?d(a,c):a}function i(b,c){if(null==b)return[];var d=a.extend({},k,c.settings().dataOptions),e=d.applyFilter?f(b,c):b,i=d.applySort?h(e,c):e;return d.applyPaging?g(i,c):i}function j(a,b,c){var d=c.split("."),e=a,f=d[d.length-1],g=e,h=d.slice(0,d.length-1);return h.forEach(function(a){g.hasOwnProperty(a)||(g[a]={}),g=g[a]}),g[f]=b,e}var k={applyFilter:!0,applySort:!0,applyPaging:!0};return i.applyPaging=g,i.getFilterFn=d,i.getOrderByFn=e,i}var c=this;c.$get=b,c.filterFilterName="filter",c.sortingFilterName="orderBy",b.$inject=["$filter"]}a.module("ngTable").provider("ngTableDefaultGetData",b),b.$inject=[]}(),function(){a.module("ngTable").factory("ngTableColumn",[function(){function b(b,d,f){var g=Object.create(b),h=c();for(var i in h)void 0===g[i]&&(g[i]=h[i]),a.isFunction(g[i])||!function(a){var c=function d(){return 1!==arguments.length||e(arguments[0])?b[a]:void d.assign(null,arguments[0])};c.assign=function(c,d){b[a]=d},g[a]=c}(i),function(c){var h=g[c];g[c]=function(){if(1!==arguments.length||e(arguments[0])){var c=arguments[0]||d,i=Object.create(c);return a.extend(i,{$column:g,$columns:f}),h.call(b,i)}h.assign(null,arguments[0])},h.assign&&(g[c].assign=h.assign)}(i);return g}function c(){return{"class":d(""),filter:d(!1),groupable:d(!1),filterData:a.noop,headerTemplateURL:d(!1),headerTitle:d(""),sortable:d(!1),show:d(!0),title:d(""),titleAlt:d("")}}function d(a){var b=a,c=function d(){return 1!==arguments.length||e(arguments[0])?b:void d.assign(null,arguments[0])};return c.assign=function(a,c){b=c},c}function e(b){return null!=b&&a.isFunction(b.$new)}return{buildColumn:b}}])}(),function(){a.module("ngTable").factory("NgTableParams",["$q","$log","$filter","ngTableDefaults","ngTableDefaultGetData","ngTableEventsChannel",function(b,c,d,e,f,g){var h=function(a){return!isNaN(parseFloat(a))&&isFinite(a)},i=function(d,i){function j(b){var c=A.groupOptions&&A.groupOptions.defaultSort;if(a.isFunction(b))return null==b.sortDirection&&(b.sortDirection=c),b;if(a.isString(b)){var d={};return d[b]=c,d}if(a.isObject(b)){for(var e in b)null==b[e]&&(b[e]=c);return b}return b}function k(a){var b=[];for(var c in a)b.push(("asc"===a[c]?"+":"-")+c);return b}function l(){var b={params:z};return a.isFunction(z.group)&&(b.groupSortDirection=z.group.sortDirection),b}function m(){var b=z.filter&&z.filter.$,c=q&&q.params.filter&&q.params.filter.$;return!a.equals(b,c)}function n(){A.filterOptions.filterDelay===w.filterDelay&&A.total<=A.filterOptions.filterDelayThreshold&&A.getData===y.getData&&(A.filterOptions.filterDelay=0)}function o(a){var c=A.interceptors||[];return c.reduce(function(a,c){var d=c.response&&c.response.bind(c)||b.when,e=c.responseError&&c.responseError.bind(c)||b.reject;return a.then(function(a){return d(a,s)},function(a){return e(a,s)})},a)}function p(){function c(a){return f(a.settings().dataset,a)}function d(c){var d,g=c.group(),h=void 0;if(a.isFunction(g))d=g,h=g.sortDirection;else{var i=Object.keys(g)[0];h=g[i],d=function(a){return e(a,i)}}var j=c.settings(),l=j.dataOptions;j.dataOptions={applyPaging:!1};var m=b.when(j.getData(c));return m.then(function(b){var e={};a.forEach(b,function(a){var b=d(a);e[b]=e[b]||{data:[],$hideRows:!j.groupOptions.isExpanded,value:b},e[b].data.push(a)});var g=[];for(var i in e)g.push(e[i]);if(h){var l=f.getOrderByFn(),m=k({value:h});g=l(g,m)}return f.applyPaging(g,c)})["finally"](function(){j.dataOptions=l})}function e(a,b){return"string"==typeof b&&(b=b.split(".")),void 0===a?void 0:0===b.length?a:null===a?void 0:e(a[b[0]],b.slice(1))}return{getData:c,getGroups:d}}"boolean"==typeof d&&(this.isNullInstance=!0);var q,r,s=this,t=!1,u=[],v=function(){A.debugMode&&c.debug&&c.debug.apply(c,arguments)},w={filterComparator:void 0,filterDelay:500,filterDelayThreshold:1e4,filterFilterName:void 0,filterFn:void 0,filterLayout:"stack"},x={defaultSort:"asc",isExpanded:!0},y=p();this.data=[],this.parameters=function(b,c){if(c=c||!1,a.isDefined(b)){for(var d in b){var e=b[d];if(c&&d.indexOf("[")>=0){for(var f=d.split(/\[(.*)\]/).reverse(),g="",i=0,k=f.length;k>i;i++){var l=f[i];if(""!==l){var m=e;e={},e[g=l]=h(m)?parseFloat(m):m}}"sorting"===g&&(z[g]={}),z[g]=a.extend(z[g]||{},e[g])}else z[d]="group"===d?j(b[d]):h(b[d])?parseFloat(b[d]):b[d]}return v("ngTable: set parameters",z),this}return z},this.settings=function(b){if(a.isDefined(b)){b.filterOptions&&(b.filterOptions=a.extend({},A.filterOptions,b.filterOptions)),b.groupOptions&&(b.groupOptions=a.extend({},A.groupOptions,b.groupOptions)),a.isArray(b.dataset)&&(b.total=b.dataset.length);var c=A.dataset;A=a.extend(A,b),a.isArray(b.dataset)&&n();var d=b.hasOwnProperty("dataset")&&b.dataset!=c;if(d){t&&this.page(1),t=!1;var e=function(){g.publishDatasetChanged(s,b.dataset,c)};u?u.push(e):e()}return v("ngTable: set settings",A),this}return A},this.page=function(b){return a.isDefined(b)?this.parameters({page:b}):z.page},this.total=function(b){return a.isDefined(b)?this.settings({total:b}):A.total},this.count=function(b){return a.isDefined(b)?this.parameters({count:b,page:1}):z.count},this.filter=function(b){if(a.isDefined(b)&&a.isObject(b))return this.parameters({filter:b,page:1});if(b===!0){for(var c=Object.keys(z.filter),d={},e=0;e<c.length;e++){var f=z.filter[c[e]];null!=f&&""!==f&&(d[c[e]]=f)}return d}return z.filter},this.group=function(b,c){if(!a.isDefined(b))return z.group;var d={page:1};if(a.isFunction(b)&&a.isDefined(c))b.sortDirection=c,d.group=b;else if(a.isDefined(b)&&a.isDefined(c)){var e={};e[b]=c,d.group=e}else d.group=b;return this.parameters(d),this},this.sorting=function(b){if(2==arguments.length){var c={};return c[b]=arguments[1],this.parameters({sorting:c}),this}return a.isDefined(b)?this.parameters({sorting:b}):z.sorting},this.isSortBy=function(b,c){return void 0!==c?a.isDefined(z.sorting[b])&&z.sorting[b]==c:a.isDefined(z.sorting[b])},this.orderBy=function(){return k(z.sorting)},this.generatePagesArray=function(a,b,c,d){arguments.length||(a=this.page(),b=this.total(),c=this.count());var e,f,g,h,i;if(d=d&&6>d?6:d,i=[],h=Math.ceil(b/c),h>1){i.push({type:"prev",number:Math.max(1,a-1),active:a>1}),i.push({type:"first",number:1,active:a>1,current:1===a}),f=Math.round((A.paginationMaxBlocks-A.paginationMinBlocks)/2),g=Math.max(2,a-f),e=Math.min(h-1,a+2*f-(a-g)),g=Math.max(2,g-(2*f-(e-g)));for(var j=g;e>=j;)i.push(j===g&&2!==j||j===e&&j!==h-1?{type:"more",active:!1}:{type:"page",number:j,active:a!==j,current:a===j}),j++;i.push({type:"last",number:h,active:a!==h,current:a===h}),i.push({type:"next",number:Math.min(h,a+1),active:h>a})}return i},this.isDataReloadRequired=function(){return!t||!a.equals(l(),q)||m()},this.hasFilter=function(){return Object.keys(this.filter(!0)).length>0},this.hasGroup=function(b,c){return null==b?a.isFunction(z.group)||Object.keys(z.group).length>0:a.isFunction(b)?null==c?z.group===b:z.group===b&&b.sortDirection===c:null==c?-1!==Object.keys(z.group).indexOf(b):z.group[b]===c},this.hasFilterChanges=function(){var b=q&&q.params.filter;return!a.equals(z.filter,b)||m()},this.url=function(b){function c(a,c){b?e.push(c+"="+encodeURIComponent(a)):e[c]=encodeURIComponent(a)}function d(b,c){return"group"===c?!0:a.isDefined(b)&&""!==b}b=b||!1;var e=b?[]:{};for(var f in z)if(z.hasOwnProperty(f)){var g=z[f],h=encodeURIComponent(f);if("object"==typeof g){for(var i in g)if(d(g[i],f)){var j=h+"["+encodeURIComponent(i)+"]";c(g[i],j)}}else!a.isFunction(g)&&d(g,f)&&c(g,h)}return e},this.reload=function(){var c=this,d=null;A.$loading=!0,q=a.copy(l()),t=!0,d=o(c.hasGroup()?b.when(A.getGroups(c)):b.when(A.getData(c))),v("ngTable: reload data");var e=c.data;return d.then(function(a){return A.$loading=!1,r=null,c.data=a,g.publishAfterReloadData(c,a,e),c.reloadPages(),a})["catch"](function(a){return r=q,b.reject(a)})},this.hasErrorState=function(){return!(!r||!a.equals(r,l()))},this.reloadPages=function(){var b;return function(){var c=b,d=s.generatePagesArray(s.page(),s.total(),s.count());a.equals(c,d)||(b=d,g.publishPagesChanged(this,d,c))}}();var z={page:1,count:10,filter:{},sorting:{},group:{}};a.extend(z,e.params);var A={$loading:!1,dataset:null,total:0,defaultSort:"desc",filterOptions:a.copy(w),groupOptions:a.copy(x),counts:[10,25,50,100],interceptors:[],paginationMaxBlocks:11,paginationMinBlocks:5,sortingIndicator:"span"};return this.settings(y),this.settings(e.settings),this.settings(i),this.parameters(d,!0),g.publishAfterCreated(this),a.forEach(u,function(a){a()}),u=null,this};return i}])}(),function(){a.module("ngTable").controller("ngTableController",["$scope","NgTableParams","$timeout","$parse","$compile","$attrs","$element","ngTableColumn","ngTableEventsChannel",function(b,c,d,e,f,g,h,i,j){function k(a){if(a&&!b.params.hasErrorState()){b.params.settings().$scope=b;var c=b.params,d=c.settings().filterOptions;if(c.hasFilterChanges()){var e=function(){c.page(1),c.reload()};d.filterDelay?r(e,d.filterDelay):e()}else c.reload()}}function l(){g.showFilter?b.$parent.$watch(g.showFilter,function(a){b.show_filter=a}):b.$watch(o,function(a){b.show_filter=a}),g.disableFilter&&b.$parent.$watch(g.disableFilter,function(a){b.$filterRow.disabled=a})}function m(){if(b.$groupRow={},g.showGroup){var a=e(g.showGroup);b.$parent.$watch(a,function(a){b.$groupRow.show=a}),a.assign&&b.$watch("$groupRow.show",function(c){a.assign(b.$parent,c)})}else b.$watch("params.hasGroup()",function(a){b.$groupRow.show=a})}function n(){return(b.$columns||[]).filter(function(a){return a.show(b)})}function o(){return b.$columns?p(b.$columns,function(a){return a.show(b)&&a.filter(b)}):!1}function p(a,b){for(var c=!1,d=0;d<a.length;d++){var e=a[d];if(b(e)){c=!0;break}}return c}function q(){function a(a,c){var d=n();a.hasGroup()?(b.$groups=c||[],b.$groups.visibleColumnCount=d.length):(b.$data=c||[],b.$data.visibleColumnCount=d.length)}function c(a,c){b.pages=c}function d(a){return b.params===a}j.onAfterReloadData(a,b,d),j.onPagesChanged(c,b,d)}b.$filterRow={},b.$loading=!1,b.hasOwnProperty("params")||(b.params=new c(!0)),b.params.settings().$scope=b;var r=function(){var a=0;return function(b,c){d.cancel(a),a=d(b,c)}}();b.$watch("params",function(a,b){a!==b&&a&&a.reload()},!1),b.$watch("params.isDataReloadRequired()",k),this.compileDirectiveTemplates=function(){if(!h.hasClass("ng-table")){b.templates={header:g.templateHeader?g.templateHeader:"ng-table/header.html",pagination:g.templatePagination?g.templatePagination:"ng-table/pager.html"},h.addClass("ng-table");var c=null,d=!1;a.forEach(h.children(),function(a){"THEAD"===a.tagName&&(d=!0)}),d||(c=a.element(document.createElement("thead")).attr("ng-include","templates.header"),h.prepend(c));var e=a.element(document.createElement("div")).attr({"ng-table-pagination":"params","template-url":"templates.pagination"});h.after(e),c&&f(c)(b),f(e)(b)}},this.loadFilterData=function(c){a.forEach(c,function(c){var d;if(d=c.filterData(b),!d)return void delete c.filterData;if(a.isObject(d)&&(a.isObject(d.promise)||a.isFunction(d.then))){var e=a.isFunction(d.then)?d:d.promise;return delete c.filterData,e.then(function(b){a.isArray(b)||a.isFunction(b)||a.isObject(b)||(b=[]),c.data=b})}return c.data=d})},this.buildColumns=function(a){var c=[];return(a||[]).forEach(function(a){c.push(i.buildColumn(a,b,c))}),c},this.parseNgTableDynamicExpr=function(a){if(!a||a.indexOf(" with ")>-1){var b=a.split(/\s+with\s+/);return{tableParams:b[0],columns:b[1]}}throw new Error("Parse error (expected example: ng-table-dynamic='tableParams with cols')")},this.setupBindingsToInternalScope=function(c){var d=e(c);b.$watch(d,function(c){a.isUndefined(c)||(b.paramsModel=d,b.params=c)},!1),l(),m()},q()}])}(),function(){a.module("ngTable").directive("ngTable",["$q","$parse",function(b,c){return{restrict:"A",priority:1001,scope:!0,controller:"ngTableController",compile:function(b){var d,e,f=[],g=0,h=[];return a.forEach(b.find("tr"),function(b){h.push(a.element(b))}),d=h.filter(function(a){return!a.hasClass("ng-table-group")})[0],e=h.filter(function(a){return a.hasClass("ng-table-group")})[0],d?(a.forEach(d.find("td"),function(b){var d=a.element(b);if(!d.attr("ignore-cell")||"true"!==d.attr("ignore-cell")){var h=function(a){return d.attr("x-data-"+a)||d.attr("data-"+a)||d.attr(a)},i=function(a,b){d.attr("x-data-"+a)?d.attr("x-data-"+a,b):d.attr("data"+a)?d.attr("data"+a,b):d.attr(a,b)},j=function(a){var b=h(a);if(!b)return void 0;var d,e=function(a){return void 0!==d?d:c(b)(a)};return e.assign=function(a,e){var f=c(b);f.assign?f.assign(a.$parent,e):d=e},e},k=h("title-alt")||h("title");k&&d.attr("data-title-text","{{"+k+"}}"),f.push({id:g++,title:j("title"),titleAlt:j("title-alt"),headerTitle:j("header-title"),sortable:j("sortable"),"class":j("header-class"),filter:j("filter"),groupable:j("groupable"),headerTemplateURL:j("header"),filterData:j("filter-data"),show:d.attr("ng-if")?j("ng-if"):void 0}),(e||d.attr("ng-if"))&&i("ng-if","$columns["+(f.length-1)+"].show(this)")}}),function(a,b,c,d){a.$columns=f=d.buildColumns(f),d.setupBindingsToInternalScope(c.ngTable),d.loadFilterData(f),d.compileDirectiveTemplates()}):void 0}}}])}(),function(){a.module("ngTable").directive("ngTableDynamic",[function(){return{restrict:"A",priority:1001,scope:!0,controller:"ngTableController",compile:function(b){var c;return a.forEach(b.find("tr"),function(b){b=a.element(b),b.hasClass("ng-table-group")||c||(c=b)}),c?(a.forEach(c.find("td"),function(b){var c=a.element(b),d=function(a){return c.attr("x-data-"+a)||c.attr("data-"+a)||c.attr(a)},e=d("title");e||c.attr("data-title-text","{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}");var f=c.attr("ng-if");f||c.attr("ng-if","$columns[$index].show(this)")}),function(a,b,c,d){var e=d.parseNgTableDynamicExpr(c.ngTableDynamic);d.setupBindingsToInternalScope(e.tableParams),d.compileDirectiveTemplates(),a.$watchCollection(e.columns,function(b){a.$columns=d.buildColumns(b),d.loadFilterData(a.$columns)})}):void 0}}}])}(),function(){function b(a){function b(b,c,d){var e=a(d.ngTableColumnsBinding).assign;e&&b.$watch("$columns",function(a){var c=(a||[]).slice(0);e(b,c)})}var c={restrict:"A",require:"ngTable",link:b};return c}a.module("ngTable").directive("ngTableColumnsBinding",b),b.$inject=["$parse"]}(),function(){a.module("ngTable").directive("ngTablePagination",["$compile","ngTableEventsChannel",function(b,c){return{restrict:"A",scope:{params:"=ngTablePagination",templateUrl:"="},replace:!1,link:function(d,e){c.onAfterReloadData(function(a){d.pages=a.generatePagesArray()},d,function(a){return a===d.params}),d.$watch("templateUrl",function(c){if(!a.isUndefined(c)){var f=a.element(document.createElement("div"));f.attr({"ng-include":"templateUrl"}),e.append(f),b(f)(d)}})}}}])}(),function(){function b(b,c){b.config=c,b.getFilterCellCss=function(a,b){if("horizontal"!==b)return"s12";var c=Object.keys(a).length,d=parseInt(12/c,10);return"s"+d},b.getFilterPlaceholderValue=function(b){return a.isObject(b)?b.placeholder:""}}a.module("ngTable").controller("ngTableFilterRowController",b),b.$inject=["$scope","ngTableFilterConfig"]}(),function(){function b(){var a={restrict:"E",replace:!0,templateUrl:"ng-table/filterRow.html",scope:!0,controller:"ngTableFilterRowController"};return a}a.module("ngTable").directive("ngTableFilterRow",b),b.$inject=[]}(),function(){function b(b){function c(){b.getGroupables=g,b.getGroupTitle=f,b.getVisibleColumns=h,b.groupBy=i,b.isSelectedGroup=j,b.toggleDetail=l,b.$watch("params.group()",k,!0)}function d(){var a;a=b.params.hasGroup(b.$selGroup,"asc")?"desc":b.params.hasGroup(b.$selGroup,"desc")?"":"asc",b.params.group(b.$selGroup,a)}function e(a){return b.$columns.filter(function(c){return c.groupable(b)===a})[0]}function f(c){return a.isFunction(c)?c.title:c.title(b)}function g(){var a=b.$columns.filter(function(a){return a.groupable(b)});return m.concat(a)}function h(){return b.$columns.filter(function(a){return a.show(b)})}function i(a){j(a)?d():b.params.group(a.groupable?a.groupable(b):a)}function j(a){return a.groupable?a.groupable(b)===b.$selGroup:a===b.$selGroup}function k(c){var d=e(b.$selGroup);if(d&&d.show.assign&&d.show.assign(b,!0),a.isFunction(c))m=[c],b.$selGroup=c,b.$selGroupTitle=c.title;else{var f=Object.keys(c||{})[0],g=e(f);g&&(b.$selGroupTitle=g.title(b),b.$selGroup=f,g.show.assign&&g.show.assign(b,!1))}}function l(){return b.params.settings().groupOptions.isExpanded=!b.params.settings().groupOptions.isExpanded,b.params.reload()}var m=[];c()}a.module("ngTable").controller("ngTableGroupRowController",b),b.$inject=["$scope"]}(),function(){function b(){var a={restrict:"E",replace:!0,templateUrl:"ng-table/groupRow.html",scope:!0,controller:"ngTableGroupRowController",controllerAs:"dctrl"};return a}a.module("ngTable").directive("ngTableGroupRow",b),b.$inject=[]}(),function(){function b(a){function b(b,c){var d=b.sortable&&b.sortable();if(d){var e=a.params.settings().defaultSort,f="asc"===e?"desc":"asc",g=a.params.sorting()&&a.params.sorting()[d]&&a.params.sorting()[d]===e,h=c.ctrlKey||c.metaKey?a.params.sorting():{};h[d]=g?f:e,a.params.parameters({sorting:h})}}a.sortBy=b}a.module("ngTable").controller("ngTableSorterRowController",b),b.$inject=["$scope"]}(),function(){function b(){var a={restrict:"E",replace:!0,templateUrl:"ng-table/sorterRow.html",scope:!0,controller:"ngTableSorterRowController"};return a}a.module("ngTable").directive("ngTableSorterRow",b),b.$inject=[]}(),function(){function b(){var a={restrict:"A",controller:c};return a}function c(b,c,d,e){function f(){j=c(d.ngTableSelectFilterDs)(b),b.$watch(function(){return j.data},g)}function g(){i(j).then(function(a){a&&!h(a)&&a.unshift({id:"",title:""}),a=a||[],b.$selectData=a})}function h(a){for(var b,c=0;c<a.length;c++){var d=a[c];if(d&&""===d.id){b=!0;break}}return b}function i(b){var c=a.isFunction(b.data)?b.data():b.data;return e.when(c)}var j={};f()}a.module("ngTable").directive("ngTableSelectFilterDs",b),b.$inject=[],c.$inject=["$scope","$parse","$attrs","$q"]}(),a.module("ngTable").run(["$templateCache",function(a){a.put("ng-table/filterRow.html",'<tr ng-show="show_filter" class="ng-table-filters"> <th data-title-text="{{$column.titleAlt(this) || $column.title(this)}}" ng-repeat="$column in $columns" ng-if="$column.show(this)" class="filter {{$column.class(this)}}" ng-class="params.settings().filterOptions.filterLayout===\'horizontal\' ? \'filter-horizontal\' : \'\'"> <div ng-repeat="(name, filter) in $column.filter(this)" ng-include="config.getTemplateUrl(filter)" class="filter-cell" ng-class="[getFilterCellCss($column.filter(this), params.settings().filterOptions.filterLayout), $last ? \'last\' : \'\']"> </div> </th> </tr> '),a.put("ng-table/filters/number.html",'<input type="number" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}"/> '),a.put("ng-table/filters/select-multiple.html",'<select ng-options="data.id as data.title for data in $column.data" ng-disabled="$filterRow.disabled" multiple ng-multiple="true" ng-model="params.filter()[name]" class="filter filter-select-multiple form-control" name="{{name}}"> </select> '),a.put("ng-table/filters/select.html",'<select ng-options="data.id as data.title for data in $selectData" ng-table-select-filter-ds="$column" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="filter filter-select form-control" name="{{name}}"> <option style="display:none" value=""></option> </select> '),a.put("ng-table/filters/text.html",'<input type="text" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}"/> '),a.put("ng-table/groupRow.html",'<tr ng-if="params.hasGroup()" ng-show="$groupRow.show" class="ng-table-group-header"> <th colspan="{{getVisibleColumns().length}}" class="sortable" ng-class="{ \'sort-asc\': params.hasGroup($selGroup, \'asc\'), \'sort-desc\':params.hasGroup($selGroup, \'desc\') }"> <a href="" ng-click="isSelectorOpen=!isSelectorOpen" class="ng-table-group-selector"> <strong class="sort-indicator">{{$selGroupTitle}}</strong> <button class="btn btn-default btn-xs ng-table-group-close" ng-click="$groupRow.show=false; $event.preventDefault(); $event.stopPropagation();"> <span class="glyphicon glyphicon-remove"></span> </button> <button class="btn btn-default btn-xs ng-table-group-toggle" ng-click="toggleDetail(); $event.preventDefault(); $event.stopPropagation();"> <span class="glyphicon" ng-class="{ \'glyphicon-resize-small\': params.settings().groupOptions.isExpanded, \'glyphicon-resize-full\': !params.settings().groupOptions.isExpanded }"></span> </button> </a> <div class="list-group" ng-if="isSelectorOpen"> <a href="" class="list-group-item" ng-repeat="group in getGroupables()" ng-click="groupBy(group)"> <strong>{{ getGroupTitle(group)}}</strong> <strong ng-class="isSelectedGroup(group) && \'sort-indicator\'"></strong> </a> </div> </th> </tr> '),a.put("ng-table/header.html","<ng-table-group-row></ng-table-group-row> <ng-table-sorter-row></ng-table-sorter-row> <ng-table-filter-row></ng-table-filter-row> "),a.put("ng-table/pager.html",'<div class="ng-cloak ng-table-pager" ng-if="params.data.length"> <div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right"> <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default"> <span ng-bind="count"></span> </button> </div> <ul ng-if="pages.length" class="pagination ng-table-pagination"> <li ng-class="{\'disabled\': !page.active && !page.current, \'active\': page.current}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> </li> </ul> </div> '),a.put("ng-table/sorterRow.html",'<tr class="ng-table-sort-header"> <th title="{{$column.headerTitle(this)}}" ng-repeat="$column in $columns" ng-class="{ \'sortable\': $column.sortable(this), \'sort-asc\': params.sorting()[$column.sortable(this)]==\'asc\', \'sort-desc\': params.sorting()[$column.sortable(this)]==\'desc\' }" ng-click="sortBy($column, $event)" ng-if="$column.show(this)" ng-init="template=$column.headerTemplateURL(this)" class="header {{$column.class(this)}}"> <div ng-if="!template" class="ng-table-header" ng-class="{\'sort-indicator\': params.settings().sortingIndicator==\'div\'}"> <span ng-bind="$column.title(this)" ng-class="{\'sort-indicator\': params.settings().sortingIndicator==\'span\'}"></span> </div> <div ng-if="template" ng-include="template"></div> </th> </tr> ')}]),a.module("ngTable")});
//# sourceMappingURL=ng-table.min.js.map
;
// start APP
angular.module("TurnosApp",['ngRoute','ngResource','ngTable','ngCookies']).run(['$rootScope','$location',function($rootScope,$location) {
	// callbackSuccess
	$rootScope.callbackSuccess = function(response) {
		console.log("success", response); if(!$rootScope.got_to_url_success){$rootScope.got_to_url_success="/";}
		$location.path($rootScope.got_to_url_success);
		return true
	}
	// callbackFailure
	$rootScope.callbackFailure = function(response) {
		window.scrollTo(0, 0);
		console.log("failure", response);
		return true
	}
	// deleteVariablesClaseToSend
	$rootScope.deleteVariablesClaseToSend = function(clase,instructor,users) {
		if(instructor){delete clase.instructor;}if(users){delete clase.users;}
		delete clase.reemplazo;delete clase.created_at;delete clase.updated_at;delete clase.trialable;delete clase.cancelada;delete clase.cant_users;delete clase.fecha_fixed;
		return clase
	}
	//condicionesClases
	$rootScope.condicionesClases = function(clases,alumno) {
		// Each clase:
		alumno.actividad_counter = []; // Count clases for each actividad
		alumno.actividad_counter_month = []; // Count clases for each actividad for month
		if(alumno.selected_counter==undefined){alumno.selected_counter = [];} // Count clases for each checkbox
		$.each(clases, function(index_clase, clase) {
			month = parseInt(clases[index_clase].fecha.match(/\-(.*?)\-/)[1]);
			clases[index_clase].mes = month;
			// joined?
			if(jQuery.isEmptyObject( $.grep(clase.users, function(e){ return e.id == alumno.id; }))){	clases[index_clase].joined = false;
			}else{																						clases[index_clase].joined = true;}
			// actividad_counter []
			pack = $.grep(alumno.packs, function(e){ return e.actividad_id == clases[index_clase].actividad_id; })[0];
			if(clases[index_clase].joined){
				if(pack==undefined||pack.noperiod||!pack.noperiod){
					if (alumno.actividad_counter[clases[index_clase].actividad_id] == undefined){
						alumno.actividad_counter[clases[index_clase].actividad_id] = [];
						alumno.actividad_counter[clases[index_clase].actividad_id][month] = 1;
						if (alumno.selected_counter[clases[index_clase].actividad_id] == undefined){
							alumno.selected_counter[clases[index_clase].actividad_id] = [];
							alumno.selected_counter[clases[index_clase].actividad_id][month] = 0;
						}
					}else{
						if (alumno.actividad_counter[clases[index_clase].actividad_id][month] == undefined){
						alumno.actividad_counter[clases[index_clase].actividad_id][month] = 1;
						if (alumno.selected_counter[clases[index_clase].actividad_id][month] == undefined){
							alumno.selected_counter[clases[index_clase].actividad_id][month] = 0;
						}
						}else{
						alumno.actividad_counter[clases[index_clase].actividad_id][month] += 1;
						}
					}
				}else{
					sd = new Date(pack.fecha_start+'T12:00:00Z');
					ed = new Date(pack.fecha_end+'T12:00:00Z');
					cd = new Date(events[key_event].fecha+'T12:00:00Z');
					if(cd>sd && ed>cd){
						if (alumno.actividad_counter[events[key_event].actividad_id] == undefined){	alumno.actividad_counter[events[key_event].actividad_id] = 1;
					}else{																			alumno.actividad_counter[events[key_event].actividad_id] += 1;}}
				}
			}
		});
		alumno.actividad_overquota = [];
		$.each(alumno.packs, function(key_packs, pack) {
            for(month = 1; month < 13; month++){
				if(alumno.actividad_counter[pack.actividad_id]!=undefined && alumno.actividad_counter[pack.actividad_id][month]!=undefined){
					if(alumno.actividad_overquota[pack.actividad_id]==undefined){alumno.actividad_overquota[pack.actividad_id]=[];}
						alumno.actividad_overquota[pack.actividad_id][month] = (pack.cantidad <= alumno.actividad_counter[pack.actividad_id][month])
				}
            }
		});
		return clases,alumno
	};
}]);
// Constants
var ActividadIndexDefault = 0; // Pilates
var InstructorIndexDefault = 0; // Victoria Barnfather
monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
monthNamesShort = ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
dayNamesShort = ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
dayNamesMin = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
// datepicker settings
$.datepicker.regional['es'] = {
	 closeText: 'Cerrar',
	 prevText: '<Ant',
	 nextText: 'Sig>',
	 currentText: 'Hoy',
	 monthNames: monthNames,
	 monthNamesShort: monthNamesShort,
	 dayNames: dayNames,
	 dayNamesShort: dayNamesShort,
	 dayNamesMin: dayNamesMin,
	 weekHeader: 'Sm',
	 dateFormat: 'dd/mm/yy',
	 firstDay: 1,
	 isRTL: false,
	 showMonthAfterYear: false,
	 yearSuffix: ''
 };
 $.datepicker.setDefaults($.datepicker.regional['es']);
 $.datepicker.setDefaults({
	showOtherMonths: true,
	selectOtherMonths: true,
	dateFormat: "yy-mm-dd",
	changeMonth: true,
	changeYear: true,
	yearRange: "-80:+0",
	//showButtonPanel: true
});
//  Agenda
var claseAgendaDefaultPage = 1;	var claseAgendaDefaultCount = 10;
var claseAgendaDefaultFilter = {}; var claseAgendaDefaultIncreaseScroll = 10;
var claseAgendaDefaultGroupingBy = 'fecha'; var claseAgendaDefaultGrouping = {fecha: "asc"}
var claseAgendaDefaultSorting = {fecha: 'desc',horario: 'asc'};
var claseAgendaPageSizes = [];
var columns_claseAgenda = [
	{title:"Fecha",field:"fecha",filter:"fecha",visible:false,filter:{'fecha':'text'}, sortable: "fecha", sortDirection: "asc",groupable:"fecha",hiddenxs:false},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",groupable:"horario",hiddenxs:false},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",groupable:"actividad",hiddenxs:false},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",groupable:"instructor",hiddenxs:false},
	{title:"Duración",field:"duracion",filter:"duracion",visible:true,filter:{'duracion':'text'}, sortable: "duracion", sortDirection: "desc",groupable:"duracion",hiddenxs:true},
];
//  Planificar
var columns_clasePlanificar = [
	{title:"Fecha",field:"fecha_fixed",filter:"fecha",visible:true,filter:{'fecha':'text'}},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",groupable:"actividad",hiddenxs:false},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",groupable:"instructor",hiddenxs:false},
	{title:"Duración",field:"duracion",filter:"duracion",visible:true,filter:{'duracion':'text'}, sortable: "duracion", sortDirection: "desc",groupable:"duracion",hiddenxs:true},
];
//  Mis Clases
var claseMisClasesDefaultPage = 1;	var claseMisClasesDefaultCount = 15;
var claseMisClasesDefaultFilter = {};
var claseMisClasesDefaultSorting = {fecha: 'desc',horario: 'asc'};
var claseMisClasesPageSizes = [15, 25, 50, 100];
var columns_claseMisClases = [
	{title:"Fecha",field:"fecha_fixed",filter:"fecha_fixed",visible:true,filter:{'fecha_fixed':'text'}, sortable: "fecha", sortDirection: "asc",hiddenxs:false},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",hiddenxs:false},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",hiddenxs:true},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",hiddenxs:false},
];
// Clase
var claseDefaultPage = 1;	var claseDefaultCount = 5;
var claseDefaultFilter = {};   
var claseDefaultGroupingBy = 'fecha'; var claseDefaultGrouping = {fecha: "desc"}
var claseDefaultSorting = {fecha: 'desc',horario: 'asc'};
var clasePageSizes = [5,15, 25, 50, 100];
var horariosArray = ["09:00","10:00","11:00","12:00","13:00","17:00","18:00","19:00","20:00","21:00","--","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
var columns_clase = [
	{title:"Fecha",field:"fecha",filter:"fecha",visible:true,filter:{'fecha':'text'}, sortable: "fecha", sortDirection: "asc",groupable:"fecha"},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",groupable:"horario"},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",groupable:"actividad"},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",groupable:"instructor"},
	{title:"Día",field:"dia",filter:"dia",visible:false,filter:{'dia':'text'}, sortable: "dia", sortDirection: "desc",groupable:"dia"},
	{title:"Duración",field:"duracion",filter:"duracion",visible:true,filter:{'duracion':'text'}, sortable: "duracion", sortDirection: "desc",groupable:"duracion"},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}, sortable: "cant_users", sortDirection: "desc",groupable:"cant_users"},
	{title:"Max.Alumnos",field:"max_users",filter:"max_users",visible:false,filter:{'max_users':'text'}, sortable: "max_users", sortDirection: "desc",groupable:"max_users"},
	{title:"Cancelada?",field:"cancelada",filter:"cancelada",visible:true,filter:{'cancelada':'text'}, sortable: "cancelada", sortDirection: "desc",groupable:"cancelada"},
	{title:"Prueba?",field:"trialable",filter:"trialable",visible:true,filter:{'trialable':'text'}, sortable: "trialable", sortDirection: "desc",groupable:"trialable"},
	{title:"Comentarios",field:"comment",filter:"comment",visible:false,filter:{'comment':'text'}, sortable: "comment", sortDirection: "desc",groupable:"comment"},
];
// Instructor
var claseInstructorSorting = {fecha: 'asc',horario: 'asc'};
var columns_instructor = [
	{title:"Fecha",field:"fecha_fixed",filter:"fecha",visible:true,filter:{'fecha':'text'}},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}, sortable: "cant_users", sortDirection: "desc",groupable:"cant_users"},
	{title:"Listado",field:"users",filter:"users",visible:true,filter:{'users':'text'}, sortable: "users", sortDirection: "desc",groupable:"users"},
];
// Dashboard
var claseDashboardSorting = {fecha: 'asc',horario: 'asc'};var claseDashboardDefaultPage = 1;	var claseDashboardDefaultCount = 100;
var claseDashboardDefaultFilter = {};   
var claseDashboardDefaultGroupingBy = 'fecha'; var claseDashboardDefaultGrouping = {fecha: "asc"}
var claseDashboardDefaultSorting = {fecha: 'desc',horario: 'asc'};
var columns_dashboard = [
	{title:"Fecha",field:"fecha",filter:"fecha",visible:false,filter:{'fecha':'text'}, sortable: "fecha", sortDirection: "asc",groupable:"fecha",hiddenxs:false},
	{title:"Horario",field:"horario",filter:"horario",visible:true,filter:{'horario':'text'}, sortable: "horario", sortDirection: "desc",groupable:"horario",hiddenxs:false},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}, sortable: "cant_users", sortDirection: "desc",groupable:"cant_users"},
];
// clases Agendar
var claseAgendarDefaultPage = 1;	var claseAgendarDefaultCount = 5;
var claseAgendarDefaultFilter = {};   
var claseAgendarDefaultGroupingBy = 'fecha'; var claseAgendarDefaultGrouping = {fecha: "asc"}
var claseAgendarDefaultSorting = {fecha: 'desc',horario: 'asc'};
var claseAgendarPageSizes = [5, 15, 25, 50, 100];
var columns_agendar = [
	{title:"Fecha",field:"fecha_fixed",filter:"fecha_fixed",visible:true,filter:{'fecha':'text'}, sortable: "fecha", sortDirection: "asc",groupable:"fecha",hiddenxs:false},
	{title:"Alumnos",field:"cant_users",filter:"cant_users",visible:true,filter:{'cant_users':'text'}, sortable: "cant_users", sortDirection: "desc",groupable:"cant_users"},
	{title:"Instructor",field:"instructor",filter:"instructor",visible:true,filter:{'instructor':'text'}, sortable: "instructor", sortDirection: "desc",groupable:"instructor",hiddenxs:false},
	{title:"Actividad",field:"actividad",filter:"actividad",visible:true,filter:{'actividad':'text'}, sortable: "actividad", sortDirection: "desc",groupable:"actividad",hiddenxs:false},
];
// Alumno
var alumnoDefaultPage = 1;	var alumnoDefaultCount = 100;
var alumnoDefaultFilter = {};
var alumnoDefaultSorting = {nombre: 'asc',apellido: 'asc'};
var sexosArray = ["Mujer","Hombre","No declara"];
var columns_alumno = [
	{title:"Nombre",field:"nombre",filter:"nombre",visible:true,filter:{'nombre':'text'}},
	{title:"Apellido",field:"apellido",filter:"apellido",visible:true,filter:{'apellido':'text'}},
	{title:"Email",field:"email",filter:"email",visible:true,filter:{'email':'text'}},
	{title:"DNI",field:"dni",filter:"dni",visible:false,filter:{'dni':'text'}},
	{title:"Profesión",field:"profesion",filter:"profesion",visible:false,filter:{'profesion':'text'}},
	{title:"Fecha de nacimiento",field:"fechanac",filter:"fechanac",visible:false,filter:{'fechanac':'text'}},
	{title:"Fecha de inicio",field:"fechaini",filter:"fechaini",visible:false,filter:{'fechaini':'text'}},
	{title:"Teléfono",field:"telefono",filter:"telefono",visible:true,filter:{'telefono':'text'}},
	{title:"Domicilio",field:"domicilio",filter:"domicilio",visible:false,filter:{'domicilio':'text'}},
	{title:"Localidad",field:"localidad",filter:"localidad",visible:false,filter:{'localidad':'text'}},
	{title:"Nombre de contacto",field:"nombre_contacto",filter:"nombre_contacto",visible:false,filter:{'nombre_contacto':'text'}},
	{title:"Apellido de contacto",field:"apellido_contacto",filter:"apellido_contacto",visible:false,filter:{'apellido_contacto':'text'}},
	{title:"Teléfono de contacto",field:"telefono_contacto",filter:"telefono_contacto",visible:false,filter:{'telefono_contacto':'text'}},
	{title:"Sexo",field:"sexo",filter:"sexo",visible:true,filter:{'sexo':'text'}},
	{title:"Registro confirmado?",field:"confirmed",filter:"confirmed",visible:false,filter:{'confirmed':'text'}},
	{title:"Primera clase?",field:"primera_clase",filter:"primera_clase",visible:true,filter:{'primera_clase':'text'}},
	{title:"Admin?",field:"admin",filter:"admin",visible:true,filter:{'admin':'text'}},
];
// Actividad
var actividadDefaultPage = 1;	var actividadDefaultCount = 25;
var actividadDefaultFilter = {}; 
var actividadDefaultSorting = {nombre: 'desc'};
var columns_actividad = [
	{title:"Nombre",field:"nombre",filter:"nombre",visible:true,filter:{'nombre':'text'}},
];
angular.module("TurnosApp").filter('html_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);
angular.module("TurnosApp").directive('onFinishRender',['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
}]);
angular.module("TurnosApp").filter('true_false', [function(){
    return function(text) {
        if (text===true) {
            return 'Si';
        }
        if (text===false) {
            return 'No';
        }
        return text;
    }
}]);
// Clase
angular.module("TurnosApp").factory("ResourceClase",['$resource', function($resource) {
  return $resource("/api/clases/:id", { id: "@id" },
    {
      'create':  			{ method: 'POST' },
      'index':   			{ method: 'GET', isArray: true, cache : true },
      'show':    			{ method: 'GET', isArray: false },
      'update':  			{ method: 'PUT' },
      'destroy': 			{ method: 'DELETE' },
      'join':    			{ method: 'POST', isArray: false, url: '/api/clases/:id/join' },
      'join_multiple': 		{ method: 'POST', isArray: false, url: '/api/clases/join_multiple' },
      'join_usr_multiple':  { method: 'POST', isArray: false, url: '/api/clases/join_usr_multiple' },
      'waitlist':    		{ method: 'POST', isArray: false, url: '/api/clases/:id/waitlist' },
      'unjoin':  			{ method: 'POST', isArray: false, url: '/api/clases/:id/unjoin' },
      'confirm':  			{ method: 'POST', isArray: false, url: '/api/clases/:id/confirm' },
      'unconfirm':  		{ method: 'POST', isArray: false, url: '/api/clases/:id/unconfirm' },
      'bulk':    			{ method: 'POST', isArray: false, url: '/api/clases/bulk' },
      'edit_bulk':    		{ method: 'POST', isArray: false, url: '/api/clases/edit_bulk' },
      'instructor':  		{ method: 'POST', isArray: true, url: '/api/clases/instructor' },
      'index_usr': 			{ method: 'GET', isArray: true, url: '/api/clases/index_usr', cache : true },
      'history_usr':  		{ method: 'GET', isArray: true, url: '/api/clases/history_usr', cache : true },
      'test_emails': 		{ method: 'GET', isArray: false, url: '/api/clases/test_emails'},
    }
  );
}]);

// User
angular.module("TurnosApp").factory("ResourceAlumno",['$resource', function($resource) {
  return $resource("/api/alumnos/:id", { id: "@id" },
    {
      'create':  		{ method: 'POST' },
      'index':   		{ method: 'GET', isArray: true },
      'show':    		{ method: 'GET', isArray: false },
      'update':  		{ method: 'PUT' },
      'update_current': { method: 'PUT', isArray: false, url: '/api/alumnos/update_current' },
      'destroy': 		{ method: 'DELETE' },
      'current': 		{ method: 'POST', isArray: false, url: '/api/alumnos/current' },
      'instructores': 	{ method: 'POST', isArray: true, url: '/api/alumnos/instructores' },
      'usr_clases': 	{ method: 'POST', isArray: true, url: '/api/alumnos/:id/usr_clases'},
      'usr_pagos': 		{ method: 'POST', isArray: true, url: '/api/alumnos/:id/usr_pagos'},
    }
  );
}]);

// Actividad
angular.module("TurnosApp").factory("ResourceActividad",['$resource', function($resource) {
  return $resource("/api/actividad/:id", { id: "@id" },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' },
    }
  );
}]);

// Pago
angular.module("TurnosApp").factory("ResourcePago",['$resource', function($resource) {
  return $resource("/api/pago/:id", { id: "@id" },
    {
      'create':  		{ method: 'POST' },
      'index':   		{ method: 'GET', isArray: true },
      'show':    		{ method: 'GET', isArray: false },
      'update':  		{ method: 'PUT' },
      'destroy': 		{ method: 'DELETE' },
    }
  );
}]);

// Event
angular.module("TurnosApp").factory("ResourceEvent",['$resource', function($resource) {
  return $resource("/api/event/:id", { id: "@id" },
    {
      'index':   { method: 'GET', isArray: true },
    }
  );
}]);
angular.module("TurnosApp").controller("UsrMisClasesCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	ResourceAlumno.current().$promise.then(function(data) {
		$scope.alumno = data;
		// ngTable
		function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
		td = new Date();
		var Api = ResourceClase;
		$scope.columns_claseMisClases = columns_claseMisClases;
		$scope.cant_visible_cols = $.grep(columns_claseMisClases, function(e){ return e.visible == true; }).length+1;
		$scope.tableParams = new NgTableParams({
			page: claseMisClasesDefaultPage,         	// initial first page
			count: claseMisClasesDefaultCount,         	// initial count per page
			filter: claseMisClasesDefaultFilter, 		// initial filter
			sorting: claseMisClasesDefaultSorting,		// initial sorting
		}, {
			total: 0,          			 			// length of data
			counts: claseMisClasesPageSizes,				// page size buttons
			getData: function(params) {
				// ajax request to api
				startLoading();
				return Api.history_usr().$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]["duracion"] = data[key]["duracion"]+' hs'
						data[key]["horario"] = data[key]["horario"]+' hs'
						data[key]["fecha_fixed"] = value.dia+' '+dateFormat(value.fecha) ;
					});
					data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
					$scope.clases = data;
					// Filter & Sort
					orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
					// Show
					params.total(orderedData.inlineCount);
					stopLoading();
					return orderedData;
				});
			}
		});
	});
	// eventModal
	$scope.eventModal = function(clase_id) {
		$scope.clase = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$('#events-modal').modal('show');
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/mis_clases";
		$cacheFactory.get('$http').remove("/api/clases/history_usr");
		ResourceClase.unjoin($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
}]);
angular.module("TurnosApp").controller("UsrAgendaCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	ResourceAlumno.current().$promise.then(function(data) {
		$scope.alumno = data;
		if ($scope.alumno.primera_clase){
			$scope.selectmultiple = false;
			if($scope.alumno.confirmed){$('#first-clase-modal').modal('show')}
		}else{
			$scope.selectmultiple = true;
		};
		// ngTable
		function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
		// changeselection
		$scope.changeselection = function() {
				$scope.selectmultiple = !$scope.selectmultiple;
		};	
		td = new Date();
		var Api = ResourceClase;
		$scope.columns_claseAgenda = columns_claseAgenda;
		$scope.cant_visible_cols = $.grep(columns_claseAgenda, function(e){ return e.visible == true; }).length+1;
		$scope.tableParams = new NgTableParams({
			page: claseAgendaDefaultPage,         	// initial first page
			count: claseAgendaDefaultCount,         // initial count per page
			filter: claseAgendaDefaultFilter, 		// initial filter
			sorting: claseAgendaDefaultSorting,		// initial sorting
			group: claseAgendaDefaultGrouping		// initial grouping
		}, {
			total: 0,          			 			// length of data
			counts: claseAgendaPageSizes,			// page size buttons
			groupBy: claseAgendaDefaultGroupingBy,
			groupOptions: {isExpanded: true},
			getData: function(params) {
				// ajax request to api
				startLoading();
				return Api.index_usr().$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						if($scope.clases!=undefined && $scope.clases[key]['checked'] == true){data[key]['checked'] = true}
						else{data[key]['checked'] = false};
						data[key]["duracion"] = data[key]["duracion"]+' hs'
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
					});
					data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
					$scope.clases = data;
					// Filter & Sort
					if($scope.filterDay.every(function(element,index){return element===[false,false,false,false,false,false,false][index];})){data=[];}
					dayData = jQuery.grep(data,function(clase){return ($scope.dayCriteria.indexOf(clase.dia) !== -1 && !clase.old);});
					filteredData = params.filter() ? $filter('filter')(dayData, params.filter()): dayData;	
					orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : data;
					// Show
					params.total(orderedData.inlineCount);
					stopLoading();
					return orderedData;
				});
			}
		});
	});
	// eventModal
	$scope.eventModal = function(clase_id) {
		$scope.clase = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$('#events-modal').modal('show');
	};
	// multipleEventModal
	$scope.multipleEventModal = function(clase_id) {
		$scope.selectedclases = $.grep($scope.clases, function(e){ return e.checked == true; });
		$('#multiple-events-modal').modal('show');
	};
	// verifyPlan
	$scope.verifyPlan = function(state,clase_id) {
		function preventClase(index_clase) {
			$scope.clases[index_clase].checked=false;
			$('#alert-modal').modal('show');
		}
		var clase = {}; var index_clase=0;
		$.each($scope.clases, function(index, each_clase) {if(each_clase.id == clase_id){clase = each_clase;index_clase = index;return false;}});
		pack = $.grep($scope.alumno.packs, function(e){ return e.actividad_id == clase.actividad_id; })[0];
		if (state){
			if (pack != undefined){
				if($scope.alumno.actividad_counter[clase.actividad_id]==undefined){$scope.alumno.actividad_counter[clase.actividad_id]=[];}
				if($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.actividad_counter[clase.actividad_id][clase.mes]=0;}
				if($scope.alumno.selected_counter[clase.actividad_id]==undefined){$scope.alumno.selected_counter[clase.actividad_id]=[];}
				if($scope.alumno.selected_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.selected_counter[clase.actividad_id][clase.mes]=0;}
				if(pack.cantidad > ($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]+$scope.alumno.selected_counter[clase.actividad_id][clase.mes])){
					$scope.alumno.selected_counter[clase.actividad_id][clase.mes] += 1;
				}else{preventClase(index_clase);}
			}else{preventClase(index_clase);}
		}else{$scope.alumno.selected_counter[clase.actividad_id][clase.mes] -= 1;}
		$scope.alumno.selected_counter_total = 0;
		$.each($scope.alumno.selected_counter, function(index, arr) {if(arr!=undefined){$scope.alumno.selected_counter_total += arr.reduce(function(a, b) { return a + b; }, 0);}});
	};
	// JoinMultiple
	$scope.JoinMultiple = function() {
		if($scope.selectedclases.length){
			startLoading();
			$rootScope.got_to_url_success = "/app/agenda";
			$cacheFactory.get('$http').remove("/api/clases/index_usr");
			ResourceClase.join_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya te agendamos para las clases seleccionadas, te esperamos!</div>').slideDown();
				$scope.tableParams.reload();
			});
		}
	};
	// Join
	$scope.JoinUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/agenda";
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		ResourceClase.join($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya hemos guardado tu lugar en la clase, te esperamos!</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
	// Unjoin
	$scope.UnJoinUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/agenda";
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		ResourceClase.unjoin($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-times" aria-hidden="true"></i> Clase cancelada! </strong> Ya hemos cancelado tu inscripción a la clase. Gracias por avisar!</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
	// WaitListUser
	$scope.WaitListUser = function() {
		startLoading();
		$rootScope.got_to_url_success = "/app/agenda";
		$cacheFactory.get('$http').remove("/api/clases/index_usr");
		ResourceClase.waitlist($scope.deleteVariablesClaseToSend($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Lista actualizada! </strong> Ya te hemos agregado a la lista de espera.</div>').slideDown();
			$scope.tableParams.reload();
		});
	};
	// filterDay
	var allTrueArray=[true,true,true,true,true,true,true];
	var allFalseArray=[false,false,false,false,false,false,false];
	
	$scope.dayCriteria = dayNames;
	$scope.filterDay=allTrueArray.slice(0);
	$scope.filterAll=true;
	filterDaychangeAllClass = function() {
		if($scope.filterDay.every(function(element,index){return element===allTrueArray[index];})){
				$( "button.changeAll > i" ).removeClass('fa-square-o').addClass('fa-square'); return true
		}else{	$( "button.changeAll > i" ).removeClass('fa-square').addClass('fa-square-o');return false
	}};
	changeDayCriteria = function() {
		dayCriteria=[]; 
		angular.forEach(dayNames,function(value,key){
			if($scope.filterDay[key]){
				dayCriteria.push(dayNames[key])
			}
			$scope.dayCriteria=dayCriteria;
		});
		$scope.tableParams.page(1);
	};
	$scope.filterDaychangeAll = function() {
		startLoading();
		if(filterDaychangeAllClass()){$scope.filterDay=allFalseArray.slice(0);}
		else{$scope.filterDay=allTrueArray.slice(0);};
		changeDayCriteria();
		filterDaychangeAllClass();
		$scope.tableParams.reload();
	};
	$scope.filterDaychange = function(day) {
		startLoading();
		if($scope.filterDay.every(function(element,index){return element===allTrueArray[index];})){$scope.filterDay=allFalseArray.slice(0);}
		$scope.filterDay[day] = !$scope.filterDay[day];
		changeDayCriteria();
		filterDaychangeAllClass();
		$('button.filterDayButton').blur();
		$scope.tableParams.reload();
	};
}]);
angular.module("TurnosApp").controller("UsrMiInfoCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceAlumno', 'ResourceActividad', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceAlumno, ResourceActividad) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.sexosArray = sexosArray;
	$scope.submiterror = false;
	$scope.ActividadIndex = [];
	$scope.formsuccessalert = false;
	$scope.formerroralert = false;
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Edit
	$scope.FormTitle = "<i class='fa fa-user'></i> Datos de mi cuenta";
	$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar';
	$scope.alumno = ResourceAlumno.current();
	$scope.alumno.$promise.then(function( value ){
		ResourceActividad.index().$promise.then(function(ActividadIndex){
			$scope.ActividadIndex = ActividadIndex;
			$.each($scope.ActividadIndex, function(index_actividades) {
				notincluded = true;
				$.each($scope.alumno.packs, function(index_pack) {
					if($scope.ActividadIndex[index_actividades].id==$scope.alumno.packs[index_pack].actividad_id){notincluded=false;}
				});
				if(notincluded){
					missing_pack = {"actividad_id":$scope.ActividadIndex[index_actividades].id,"cantidad":null,"noperiod":true,"fecha_start":null,"fecha_end":null,"actividad":$scope.ActividadIndex[index_actividades]}
					$scope.alumno.packs.push(missing_pack);
				}
			});
		});
	},function( error ){$location.path("/app/mi_info");});	// if id not exists => ToNew

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/app/mi_info";
		$scope.FormErrors = [];
		if ($scope.AlumnoForm.$valid) {
			console.log("valid submit");
			// Update
			ResourceAlumno.update_current($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure);
			$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> listo! </strong> Los datos se han guardado correctamente</div>').slideDown();
			window.scrollTo(0, 0);
		} else {
			$scope.AlumnoForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechanac" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechanac=dateText;
		   }
		});
	});
stopLoading();}]);
angular.module("TurnosApp").controller("UsrPlanificarCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
	$scope.columns_clasePlanificar = columns_clasePlanificar;
	$scope.cant_visible_cols = $.grep(columns_clasePlanificar, function(e){ return e.visible == true; }).length+1;
	$scope.alumno = ResourceAlumno.current();
	// SUBMIT
	$scope.submit = function() {
		if ($scope.alumno!=undefined){
			$rootScope.got_to_url_success = "/clase/instructor";
			$scope.FormErrors = [];
			$scope.tableParams = new NgTableParams({
			}, {
				counts: [],							// hides page sizes
				getData: function(params) {
					// ajax request to api
					startLoading();
					return ResourceClase.index_usr().$promise.then(function(data) {
						dataFilteredByDay = [];
						data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
						angular.forEach(data, function(value, key) {
							data[key]["duracion"] = data[key]["duracion"]+' hs'
							data[key]["cant_users"] = value.users.length+" / "+value.max_users;
							data[key]["fecha_fixed"] = value.dia+" "+dateFormat(value.fecha)+" "+value.horario+"hs";
							if(!value.old&&(
								($scope.filterDay[0]&&value.dia=='Lunes'&&value.horario=='09:00')||($scope.filterDay[1]&&value.dia=='Lunes'&&value.horario=='10:00')||($scope.filterDay[2]&&value.dia=='Lunes'&&value.horario=='11:00')||($scope.filterDay[3]&&value.dia=='Lunes'&&value.horario=='12:00')||($scope.filterDay[4]&&value.dia=='Lunes'&&value.horario=='13:00')||($scope.filterDay[5]&&value.dia=='Lunes'&&value.horario=='14:00')||($scope.filterDay[6]&&value.dia=='Lunes'&&value.horario=='15:00')||($scope.filterDay[7]&&value.dia=='Lunes'&&value.horario=='16:00')||($scope.filterDay[8]&&value.dia=='Lunes'&&value.horario=='17:00')||($scope.filterDay[9]&&value.dia=='Lunes'&&value.horario=='18:00')||($scope.filterDay[10]&&value.dia=='Lunes'&&value.horario=='19:00')||($scope.filterDay[11]&&value.dia=='Lunes'&&value.horario=='20:00')||
								($scope.filterDay[12]&&value.dia=='Martes'&&value.horario=='09:00')||($scope.filterDay[13]&&value.dia=='Martes'&&value.horario=='10:00')||($scope.filterDay[14]&&value.dia=='Martes'&&value.horario=='11:00')||($scope.filterDay[15]&&value.dia=='Martes'&&value.horario=='12:00')||($scope.filterDay[16]&&value.dia=='Martes'&&value.horario=='13:00')||($scope.filterDay[17]&&value.dia=='Martes'&&value.horario=='14:00')||($scope.filterDay[18]&&value.dia=='Martes'&&value.horario=='15:00')||($scope.filterDay[19]&&value.dia=='Martes'&&value.horario=='16:00')||($scope.filterDay[20]&&value.dia=='Martes'&&value.horario=='17:00')||($scope.filterDay[21]&&value.dia=='Martes'&&value.horario=='18:00')||($scope.filterDay[22]&&value.dia=='Martes'&&value.horario=='19:00')||($scope.filterDay[23]&&value.dia=='Martes'&&value.horario=='20:00')||
								($scope.filterDay[24]&&value.dia=='Miércoles'&&value.horario=='09:00')||($scope.filterDay[25]&&value.dia=='Miércoles'&&value.horario=='10:00')||($scope.filterDay[26]&&value.dia=='Miércoles'&&value.horario=='11:00')||($scope.filterDay[27]&&value.dia=='Miércoles'&&value.horario=='12:00')||($scope.filterDay[28]&&value.dia=='Miércoles'&&value.horario=='13:00')||($scope.filterDay[29]&&value.dia=='Miércoles'&&value.horario=='14:00')||($scope.filterDay[30]&&value.dia=='Miércoles'&&value.horario=='15:00')||($scope.filterDay[31]&&value.dia=='Miércoles'&&value.horario=='16:00')||($scope.filterDay[32]&&value.dia=='Miércoles'&&value.horario=='17:00')||($scope.filterDay[33]&&value.dia=='Miércoles'&&value.horario=='18:00')||($scope.filterDay[34]&&value.dia=='Miércoles'&&value.horario=='19:00')||($scope.filterDay[35]&&value.dia=='Miércoles'&&value.horario=='20:00')||
								($scope.filterDay[36]&&value.dia=='Jueves'&&value.horario=='09:00')||($scope.filterDay[37]&&value.dia=='Jueves'&&value.horario=='10:00')||($scope.filterDay[38]&&value.dia=='Jueves'&&value.horario=='11:00')||($scope.filterDay[39]&&value.dia=='Jueves'&&value.horario=='12:00')||($scope.filterDay[40]&&value.dia=='Jueves'&&value.horario=='13:00')||($scope.filterDay[41]&&value.dia=='Jueves'&&value.horario=='14:00')||($scope.filterDay[42]&&value.dia=='Jueves'&&value.horario=='15:00')||($scope.filterDay[43]&&value.dia=='Jueves'&&value.horario=='16:00')||($scope.filterDay[44]&&value.dia=='Jueves'&&value.horario=='17:00')||($scope.filterDay[45]&&value.dia=='Jueves'&&value.horario=='18:00')||($scope.filterDay[46]&&value.dia=='Jueves'&&value.horario=='19:00')||($scope.filterDay[47]&&value.dia=='Jueves'&&value.horario=='20:00')||
								($scope.filterDay[48]&&value.dia=='Viernes'&&value.horario=='09:00')||($scope.filterDay[49]&&value.dia=='Viernes'&&value.horario=='10:00')||($scope.filterDay[50]&&value.dia=='Viernes'&&value.horario=='11:00')||($scope.filterDay[51]&&value.dia=='Viernes'&&value.horario=='12:00')||($scope.filterDay[52]&&value.dia=='Viernes'&&value.horario=='13:00')||($scope.filterDay[53]&&value.dia=='Viernes'&&value.horario=='14:00')||($scope.filterDay[54]&&value.dia=='Viernes'&&value.horario=='15:00')||($scope.filterDay[55]&&value.dia=='Viernes'&&value.horario=='16:00')||($scope.filterDay[56]&&value.dia=='Viernes'&&value.horario=='17:00')||($scope.filterDay[57]&&value.dia=='Viernes'&&value.horario=='18:00')||($scope.filterDay[58]&&value.dia=='Viernes'&&value.horario=='19:00')||($scope.filterDay[59]&&value.dia=='Viernes'&&value.horario=='20:00')
							)){
								data[key]['checked'] = false;
								dataFilteredByDay.push(data[key]);
							}
						});
						$scope.clases = dataFilteredByDay;
						// Filter & Sort
						filteredData = params.filter() ? $filter('filter')(dataFilteredByDay, params.filter()): dataFilteredByDay;	
						orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						// Show
						params.total(orderedData.inlineCount);
						stopLoading();
						return orderedData;
					});
				}
			});
		}else{$('#form_search_user').addClass('has-error');}
	};
	// filterDaychange
	$scope.filterDay = new Array(59).fill(false);
	$scope.filterDaychange = function(day,event) {
		event.preventDefault();
		$scope.filterDay[day] = !$scope.filterDay[day];
	};
	// checkboxShowFinished
	$scope.$on('checkboxShowFinished', function(ngRepeatFinishedEvent) {
		angular.forEach($scope.clases, function(clase, key) {
			if(!clase.cancelada && !clase.joined && !clase.completa){
				$scope.clases[key].checked=true;
				$scope.verifyPlan(true,clase.id,false);
			}
		})
	});
	// verifyPlan
	$scope.verifyPlan = function(state,clase_id,modalEnabled=true) {
		function preventClase(index_clase) {
			$scope.clases[index_clase].checked=false;
			if(modalEnabled){
				$('#alert-modal').modal('show');
			}
		}
		var clase = {}; var index_clase=0;
		$.each($scope.clases, function(index, each_clase) {if(each_clase.id == clase_id){clase = each_clase;index_clase = index;return false;}});
		pack = $.grep($scope.alumno.packs, function(e){ return e.actividad_id == clase.actividad_id; })[0];
		if (state){
			if (pack != undefined){
				if($scope.alumno.actividad_counter[clase.actividad_id]==undefined){$scope.alumno.actividad_counter[clase.actividad_id]=[];}
				if($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.actividad_counter[clase.actividad_id][clase.mes]=0;}
				if($scope.alumno.selected_counter[clase.actividad_id]==undefined){$scope.alumno.selected_counter[clase.actividad_id]=[];}
				if($scope.alumno.selected_counter[clase.actividad_id][clase.mes]==undefined){$scope.alumno.selected_counter[clase.actividad_id][clase.mes]=0;}
				if(pack.cantidad > ($scope.alumno.actividad_counter[clase.actividad_id][clase.mes]+$scope.alumno.selected_counter[clase.actividad_id][clase.mes])){
					$scope.alumno.selected_counter[clase.actividad_id][clase.mes] += 1;
				}else{preventClase(index_clase);}
			}else{preventClase(index_clase);}
		}else{$scope.alumno.selected_counter[clase.actividad_id][clase.mes] -= 1;}
		$scope.alumno.selected_counter_total = 0;
		$.each($scope.alumno.selected_counter, function(index, arr) {if(arr!=undefined){$scope.alumno.selected_counter_total += arr.reduce(function(a, b) { return a + b; }, 0);}});
	};
	// JoinMultiple
	$scope.JoinMultiple = function() {
		if($scope.selectedclases.length){
			startLoading();
			$scope.clases = {};
			$rootScope.got_to_url_success = "/app/planificar";
			$cacheFactory.get('$http').remove("/api/clases/index_usr");
			ResourceClase.join_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya te agendamos para las clases seleccionadas, te esperamos!</div>').slideDown();
				$scope.tableParams.reload();
			});
		}
	};
	// multipleEventModal
	$scope.multipleEventModal = function(clase_id) {
		$scope.selectedclases = $.grep($scope.clases, function(e){ return e.checked == true; });
		$('#multiple-events-modal').modal('show');
	};
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseIndexCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, $filter, NgTableParams, $timeout, $cacheFactory) {
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/clase/new");};
	$scope.GoToBulk = function() {$location.path("/clase/bulk");};
	$scope.GoToEditBulk = function() {$location.path("/clase/edit_bulk");};
	$cacheFactory.get('$http').remove("/api/clases");
	firstload=true;
	// currentDate
	for (i = 0; i < 3; i++) {
		var fullDate = new Date(new Date().getTime() + i*24 * 60 * 60 * 1000);
		var twoDigitMonth = (fullDate.getMonth() + 1)+"";if(twoDigitMonth.length==1)	twoDigitMonth="0" +twoDigitMonth;
		var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1)	twoDigitDate="0" +twoDigitDate;
		if(i==0){var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "-" +  twoDigitDate;}
		if(i==1){var currentDate1 = fullDate.getFullYear() + "-" + twoDigitMonth + "-" +  twoDigitDate;}
		if(i==2){var currentDate2 = fullDate.getFullYear() + "-" + twoDigitMonth + "-" +  twoDigitDate;}
	}
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceClase;
	$scope.columns_clase = columns_clase;
	$scope.cant_visible_cols = $.grep(columns_clase, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: claseDefaultPage,         	// initial first page
		count: claseDefaultCount,         	// initial count per page
		filter: claseDefaultFilter, 		// initial filter
		sorting: claseDefaultSorting, 		// initial sorting
		group: claseDefaultGrouping
	}, {
		total: 0,           				// length of data
		counts: clasePageSizes,				// page size buttons
		groupBy: claseDefaultGroupingBy,
		groupOptions: {isExpanded: true},
		getData: function(params) {
			// ajax request to api
			startLoading();
			return Api.index().$promise.then(function(data) {
				angular.forEach(data, function(value, key) {
					data[key]["cant_users"] = value.users.length+" / "+value.max_users;
					data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
				});
				$scope.clases = data;
				// Filter & Sort
				if($scope.filterDay.every(function(element,index){return element===[false,false,false,false,false,false,false][index];})){data=[];}
				dayData = jQuery.grep(data,function(clase){return $scope.dayCriteria.indexOf(clase.dia) !== -1;});
				filteredData = params.filter() ? $filter('filter')(dayData, params.filter()): dayData;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// Show
				params.total(orderedData.inlineCount);
				// set Page for current date
				if(firstload){
					lastfecha="";dateIndx=0;
					$.each(orderedData,function(idx, val){
						if(lastfecha!=val['fecha']){dateIndx++;lastfecha=val['fecha'];}
						if (val['fecha']==currentDate||val['fecha']==currentDate1||val['fecha']==currentDate2) {
							$scope.tableParams.page(1+Math.floor(dateIndx/params.count()));
							return false;
						}
					});
				firstload=false;}
				stopLoading();
				return orderedData;
			});
		}
    });
	// test_emails
	$scope.test_emails = function(id) {
		ResourceClase.test_emails();
	};
	// Reload button
	$scope.reloadTable = function(id) {
		$cacheFactory.get('$http').remove("/api/clases");
		$scope.tableParams.reload();
	};
	$scope.toDestroy = "";
	// Destroy
	$scope.toDestroy = function(clase_id) {
		$scope.IdToDestroy = clase_id;
	};
	$scope.destroyClase = function() {
		$cacheFactory.get('$http').remove("/api/clases");
		$rootScope.got_to_url_success = "/clase/dashboard";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceClase.destroy($scope.deleteVariablesClaseToSend($scope.clases[index],true,true), $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}    
			});
		})
	};
	// filterDay
	var allTrueArray=[true,true,true,true,true,true,true];
	var allFalseArray=[false,false,false,false,false,false,false];
	
	$scope.dayCriteria = dayNames;
	$scope.filterDay=allTrueArray.slice(0);
	$scope.filterAll=true;
	filterDaychangeAllClass = function() {
		if($scope.filterDay.every(function(element,index){return element===allTrueArray[index];})){
				$( "button.changeAll > i" ).removeClass('fa-square-o').addClass('fa-square'); return true
		}else{	$( "button.changeAll > i" ).removeClass('fa-square').addClass('fa-square-o');return false
	}};
	changeDayCriteria = function() {
		dayCriteria=[]; 
		angular.forEach(dayNames,function(value,key){
			if($scope.filterDay[key]){
				dayCriteria.push(dayNames[key])
			}
			$scope.dayCriteria=dayCriteria;
		});
		$scope.tableParams.page(1);
	};
	$scope.filterDaychangeAll = function() {
		startLoading();
		if(filterDaychangeAllClass()){$scope.filterDay=allFalseArray.slice(0);}
		else{$scope.filterDay=allTrueArray.slice(0);};
		changeDayCriteria();
		filterDaychangeAllClass();
		$scope.tableParams.reload();
	};
	$scope.filterDaychange = function(day) {
		startLoading();
		if($scope.filterDay.every(function(element,index){return element===allTrueArray[index];})){$scope.filterDay=allFalseArray.slice(0);}
		$scope.filterDay[day] = !$scope.filterDay[day];
		changeDayCriteria();
		filterDaychangeAllClass();
		$('button.filterDayButton').blur();
		$scope.tableParams.reload();
	};
}]);















angular.module("TurnosApp").controller("ClaseEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.history_GoToClaseEdit = []; // Prevents loop search
	$scope.GoToIndex = function(id) {$location.path("/clase/dashboard");};
	$scope.GoToEdit = function(id) {if($scope.is_admin){$location.path("/alumno/"+id+"/edit/");}};
	$scope.GoToNewActividad = function() {if($scope.is_admin){$location.path("/actividad/new");}};
	$scope.ActividadIndex = [];
	$scope.ActividadIndex = ResourceActividad.index();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Editar datos de la clase";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.clase = ResourceClase.show({ id: $routeParams.id });
		$scope.clase.$promise.then(function( value ){
			$scope.clase.duracion = parseFloat($scope.clase.duracion);
			$scope.clase.instructor_id = $scope.clase.instructor.id;
			if($scope.clase.reemplazo!=null){$scope.clase.reemplazo_id = $scope.clase.reemplazo.id};
		},function( error ){$location.path("/clase/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-calendar'></i> Agregar nueva clase";
		$scope.FormButton = '<i class="fa fa-calendar fa-lg"></i> Agregar clase';
		$scope.clase = new ResourceClase();
		$scope.clase.users = [];
		$scope.clase.fecha = $scope.SetToday();
		$scope.clase.max_users = 4; 
		$scope.clase.duracion = 1; 
		$scope.clase.trialable = true; 
		$scope.clase.actividad = 'Pilates'; 
		$scope.ActividadIndex.$promise.then(function(data) {
			$scope.clase.actividad_id = $scope.ActividadIndex[ActividadIndexDefault].id;
		});
		$scope.InstructorIndex.$promise.then(function(data) {
			$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
		});
	}
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourceClase.update($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourceClase.create($scope.clase, $scope.callbackSuccess, $scope.callbackFailure); 	
			}
		} else {
			$scope.ClaseForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete User
	$scope.DeleteUser = function(id) {
		$.each($scope.clase.users, function(index) {
			if($scope.clase.users[index]!=undefined && $scope.clase.users[index].id == id) { //Remove from array
				$scope.clase.users.splice(index, 1);
			}    
		});
	};
	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/api/alumnos/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				$scope.clase.users = $scope.clase.users.concat(ui.item);
				console.log(ui.item);
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// GoTo Search
  	$scope.GoToClaseEdit = function() {
		if($scope.history_GoToClaseEdit.indexOf($scope.clase.fecha+$scope.clase.horario+$scope.clase.instructor_id) == -1){
			if($scope.clase.fecha!=undefined&&$scope.clase.fecha!=null&&$scope.clase.fecha!=''&&$scope.clase.horario!=undefined&&$scope.clase.horario!=null&&$scope.clase.horario!=''&&$scope.clase.instructor_id!=undefined&&$scope.clase.instructor_id!=null&&$scope.clase.instructor_id!=''){
				$scope.history_GoToClaseEdit.push($scope.clase.fecha+$scope.clase.horario+$scope.clase.instructor_id);
				$http.get('/api/clases/search', {params: { fecha:$scope.clase.fecha, horario:$scope.clase.horario, instructor:$scope.clase.instructor_id}}).
				success(function(data, status, headers, config) {
					if(data.id!=undefined){
						$location.path("/clase/"+data.id+"/edit");
					}else{};
				});
			};
		};
	};
	// Destroy
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.clase.users = null;
			ResourceClase.destroy($scope.deleteVariablesClaseToSend ($scope.clase,true,true), $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.clase.fecha=dateText;
		   }
		});
	});
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseAgendarCtrl",['$scope', '$rootScope', '$location', 'ResourceClase', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', '$cacheFactory', function($scope, $rootScope, $location, ResourceClase, ResourceAlumno, $filter, NgTableParams, $timeout, $cacheFactory) {
	function dateFormat(date) {date = date.split('-'); date = date[2]+' de '+monthNames[parseInt(date[1])-1]; return date;}
	$scope.columns_agendar = columns_agendar;
	$scope.cant_visible_cols = $.grep(columns_agendar, function(e){ return e.visible == true; }).length+1;
	// SUBMIT
	$scope.submit = function() {
		if ($scope.alumno!=undefined){
			$rootScope.got_to_url_success = "/clase/dashboard";
			$scope.FormErrors = [];
			$scope.tableParams = new NgTableParams({
			}, {
				counts: [],							// hides page sizes
				getData: function(params) {
					// ajax request to api
					startLoading();
					return ResourceClase.index_usr().$promise.then(function(data) {
						dataFilteredByDay = [];
						data,$scope.alumno = $scope.condicionesClases(data,$scope.alumno);
						angular.forEach(data, function(value, key) {
							data[key]["duracion"] = data[key]["duracion"]+' hs'
							data[key]["cant_users"] = value.users.length+" / "+value.max_users;
							data[key]["fecha_fixed"] = value.dia+" "+dateFormat(value.fecha)+" "+value.horario+"hs";
							if(!value.old&&(
								($scope.filterDay[0]&&value.dia=='Lunes'&&value.horario=='09:00')||($scope.filterDay[1]&&value.dia=='Lunes'&&value.horario=='10:00')||($scope.filterDay[2]&&value.dia=='Lunes'&&value.horario=='11:00')||($scope.filterDay[3]&&value.dia=='Lunes'&&value.horario=='12:00')||($scope.filterDay[4]&&value.dia=='Lunes'&&value.horario=='13:00')||($scope.filterDay[5]&&value.dia=='Lunes'&&value.horario=='14:00')||($scope.filterDay[6]&&value.dia=='Lunes'&&value.horario=='15:00')||($scope.filterDay[7]&&value.dia=='Lunes'&&value.horario=='16:00')||($scope.filterDay[8]&&value.dia=='Lunes'&&value.horario=='17:00')||($scope.filterDay[9]&&value.dia=='Lunes'&&value.horario=='18:00')||($scope.filterDay[10]&&value.dia=='Lunes'&&value.horario=='19:00')||($scope.filterDay[11]&&value.dia=='Lunes'&&value.horario=='20:00')||
								($scope.filterDay[12]&&value.dia=='Martes'&&value.horario=='09:00')||($scope.filterDay[13]&&value.dia=='Martes'&&value.horario=='10:00')||($scope.filterDay[14]&&value.dia=='Martes'&&value.horario=='11:00')||($scope.filterDay[15]&&value.dia=='Martes'&&value.horario=='12:00')||($scope.filterDay[16]&&value.dia=='Martes'&&value.horario=='13:00')||($scope.filterDay[17]&&value.dia=='Martes'&&value.horario=='14:00')||($scope.filterDay[18]&&value.dia=='Martes'&&value.horario=='15:00')||($scope.filterDay[19]&&value.dia=='Martes'&&value.horario=='16:00')||($scope.filterDay[20]&&value.dia=='Martes'&&value.horario=='17:00')||($scope.filterDay[21]&&value.dia=='Martes'&&value.horario=='18:00')||($scope.filterDay[22]&&value.dia=='Martes'&&value.horario=='19:00')||($scope.filterDay[23]&&value.dia=='Martes'&&value.horario=='20:00')||
								($scope.filterDay[24]&&value.dia=='Miércoles'&&value.horario=='09:00')||($scope.filterDay[25]&&value.dia=='Miércoles'&&value.horario=='10:00')||($scope.filterDay[26]&&value.dia=='Miércoles'&&value.horario=='11:00')||($scope.filterDay[27]&&value.dia=='Miércoles'&&value.horario=='12:00')||($scope.filterDay[28]&&value.dia=='Miércoles'&&value.horario=='13:00')||($scope.filterDay[29]&&value.dia=='Miércoles'&&value.horario=='14:00')||($scope.filterDay[30]&&value.dia=='Miércoles'&&value.horario=='15:00')||($scope.filterDay[31]&&value.dia=='Miércoles'&&value.horario=='16:00')||($scope.filterDay[32]&&value.dia=='Miércoles'&&value.horario=='17:00')||($scope.filterDay[33]&&value.dia=='Miércoles'&&value.horario=='18:00')||($scope.filterDay[34]&&value.dia=='Miércoles'&&value.horario=='19:00')||($scope.filterDay[35]&&value.dia=='Miércoles'&&value.horario=='20:00')||
								($scope.filterDay[36]&&value.dia=='Jueves'&&value.horario=='09:00')||($scope.filterDay[37]&&value.dia=='Jueves'&&value.horario=='10:00')||($scope.filterDay[38]&&value.dia=='Jueves'&&value.horario=='11:00')||($scope.filterDay[39]&&value.dia=='Jueves'&&value.horario=='12:00')||($scope.filterDay[40]&&value.dia=='Jueves'&&value.horario=='13:00')||($scope.filterDay[41]&&value.dia=='Jueves'&&value.horario=='14:00')||($scope.filterDay[42]&&value.dia=='Jueves'&&value.horario=='15:00')||($scope.filterDay[43]&&value.dia=='Jueves'&&value.horario=='16:00')||($scope.filterDay[44]&&value.dia=='Jueves'&&value.horario=='17:00')||($scope.filterDay[45]&&value.dia=='Jueves'&&value.horario=='18:00')||($scope.filterDay[46]&&value.dia=='Jueves'&&value.horario=='19:00')||($scope.filterDay[47]&&value.dia=='Jueves'&&value.horario=='20:00')||
								($scope.filterDay[48]&&value.dia=='Viernes'&&value.horario=='09:00')||($scope.filterDay[49]&&value.dia=='Viernes'&&value.horario=='10:00')||($scope.filterDay[50]&&value.dia=='Viernes'&&value.horario=='11:00')||($scope.filterDay[51]&&value.dia=='Viernes'&&value.horario=='12:00')||($scope.filterDay[52]&&value.dia=='Viernes'&&value.horario=='13:00')||($scope.filterDay[53]&&value.dia=='Viernes'&&value.horario=='14:00')||($scope.filterDay[54]&&value.dia=='Viernes'&&value.horario=='15:00')||($scope.filterDay[55]&&value.dia=='Viernes'&&value.horario=='16:00')||($scope.filterDay[56]&&value.dia=='Viernes'&&value.horario=='17:00')||($scope.filterDay[57]&&value.dia=='Viernes'&&value.horario=='18:00')||($scope.filterDay[58]&&value.dia=='Viernes'&&value.horario=='19:00')||($scope.filterDay[59]&&value.dia=='Viernes'&&value.horario=='20:00')
							)){
								if(value.cancelada || value.completa){data[key]['checked'] = false;}
								else{data[key]['checked'] = true;}
								dataFilteredByDay.push(data[key]);
							}
						});
						$scope.clases = dataFilteredByDay;
						// Filter & Sort
						filteredData = params.filter() ? $filter('filter')(dataFilteredByDay, params.filter()): dataFilteredByDay;	
						orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						// Show
						params.total(orderedData.inlineCount);
						stopLoading();
						return orderedData;
					});
				}
			});
		}else{$('#form_search_user').addClass('has-error');}
	};
	// filterDaychange
	$scope.filterDay = new Array(59).fill(false);
	$scope.filterDaychange = function(day,event) {
		event.preventDefault();
		$scope.filterDay[day] = !$scope.filterDay[day];
	};
	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/api/alumnos/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				$('#form_search_user').removeClass('has-error');
				$scope.alumno = ResourceAlumno.show({ id: ui.item.id });
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// JoinMultiple
	$scope.JoinMultiple = function() {
		if($scope.selectedclases.length){
			startLoading();
			$rootScope.got_to_url_success = "/clase/agendar";
			$scope.selectedclases[0]["alumno_id"] = $scope.alumno.id;
			ResourceClase.join_usr_multiple($scope.selectedclases, $scope.callbackSuccess, $scope.callbackFailure).$promise.then(function(data) {
				$('#alert-container').hide().html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong><i class="fa fa-check-square-o" aria-hidden="true"></i> Inscripción exitosa! </strong> Ya agendamos las clases seleccionadas!</div>').slideDown();
				$scope.tableParams.reload();
			});
		}
	};
	// multipleEventModal
	$scope.multipleEventModal = function(clase_id) {
		$scope.selectedclases = $.grep($scope.clases, function(e){ return e.checked == true; });
		$('#multiple-events-modal').modal('show');
	};
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseInstructorCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', '$filter', 'NgTableParams', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno, $filter, NgTableParams) {
	// SetDay
	SetDay = function(plusDays) {
		var currentDate = new Date(new Date().getTime() + plusDays * 24 * 60 * 60 * 1000);
		dd = currentDate.getDate();if(dd<10){dd='0'+dd } 
		mm = currentDate.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = currentDate.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}


	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/clase/instructor";
		$scope.FormErrors = [];
		$scope.tableParams = new NgTableParams({
			sorting: claseInstructorSorting, 		// initial sorting
		}, {
			counts: [],							// hides page sizes
			getData: function(params) {
				// ajax request to api
				startLoading();
				return ResourceClase.instructor($scope.clase).$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["fecha_fixed"] = value.dia+' ' +dateFormat(value.fecha);
					});
					$scope.clases = data;
					// Filter & Sort
					filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
					orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					// Show
					params.total(orderedData.inlineCount);
					stopLoading();
					return orderedData;
				});
			}
		});
	};
	// searchToday
	$scope.searchToday = function() {
		$scope.clase.fecha_start = SetDay(0);
		$scope.clase.fecha_end = SetDay(0);
		$scope.submit();
	}
	// moreClases
	$scope.moreClases = function() {
		oldate = $("#fecha_end").datepicker( "getDate" );
		oldate =  [oldate.getFullYear(),oldate.getMonth()+1,oldate.getDate()].join('-');
		$scope.clase.fecha_start = oldate
		var nwdate =  new Date($scope.clase.fecha_start);
		nwdate.setDate(nwdate.getDate()+10);
		nwdate =  [nwdate.getFullYear(),nwdate.getMonth()+1,nwdate.getDate()].join('-');
		$scope.clase.fecha_end = nwdate;
		$scope.submit();
		window.scrollTo(0, 0);
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha_start" ).datepicker({
			defaultDate: "+0d",
			onSelect: function(dateText) {
				$scope.clase.fecha_start=dateText;
				$("#fecha_end").datepicker("option", "minDate", dateText);
				var nwdate =  new Date(dateText);
				nwdate.setDate(nwdate.getDate()+10);
				nwdate =  [nwdate.getFullYear(),nwdate.getMonth()+1,nwdate.getDate()].join('-');
				$("#fecha_end").datepicker("setDate", nwdate);
				$scope.clase.fecha_end=nwdate;
		   }
		});
	});
	 $(function() {
		$( "#fecha_end" ).datepicker({
			defaultDate: '-2m',
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
	// Destroy
	$scope.toDestroy = function(clase_id) {
		$scope.IdToDestroy = clase_id;
	};
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/instructor";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceClase.destroy($scope.deleteVariablesClaseToSend($scope.clases[index],true,true), $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}    
			});
		})
	};
	// Defaults
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.columns_instructor = columns_instructor;
	$scope.clase = new ResourceClase();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	$scope.FormButton = '<i class="fa fa-search"></i> Buscar';
	$scope.InstructorIndex.$promise.then(function(data) {
		if (typeof $scope.is_instructor !== 'undefined' && $scope.is_instructor){	
				$scope.clase.instructor_id = $scope.instructor_id;}
		else{	$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;}
		$scope.clase.fecha_end = SetDay(+10);
		$scope.clase.fecha_start = SetDay(0);
		$("#fecha_end").datepicker("option", "minDate", SetDay(0));
		$scope.submit();
	});
	
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseDashboardCtrl",['$scope', '$cookieStore', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', '$filter', 'NgTableParams', function($scope, $cookieStore, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno, $filter, NgTableParams) {
	// SetDay
	SetDay = function(plusDays) {
		var currentDate = new Date(new Date().getTime() + plusDays * 24 * 60 * 60 * 1000);
		dd = currentDate.getDate();if(dd<10){dd='0'+dd } 
		mm = currentDate.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = currentDate.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$cookieStore.put('clase_searched', $scope.clase);
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		$scope.tableParams = new NgTableParams({
			page: claseDashboardDefaultPage,         	// initial first page
			count: claseDashboardDefaultCount,         // initial count per page
			filter: claseDashboardDefaultFilter, 		// initial filter
			sorting: claseDashboardDefaultSorting,		// initial sorting
			group: claseDashboardDefaultGrouping		// initial grouping
		}, {
			total: 0,          			 			// length of data
			counts: [],								// hides page sizes
			groupBy: claseDashboardDefaultGroupingBy,
			groupOptions: {isExpanded: true},
			getData: function(params) {
				// ajax request to api
				startLoading();
				return ResourceClase.instructor($scope.clase).$promise.then(function(data) {
					angular.forEach(data, function(value, key) {
						data[key]["cant_users"] = value.users.length+" / "+value.max_users;
						data[key]["horario"] = value.horario+'hs';
						data[key]["fecha_fixed"] = dateFormat(value.fecha);
					});
					$scope.clases = data;
					// Filter & Sort
					filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
					orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					// Show
					params.total(orderedData.inlineCount);
					stopLoading();
					return orderedData;
				});
			}
		});
	};
	// searchToday
	$scope.searchToday = function() {
		$scope.clase.fecha_start = SetDay(0);
		$scope.clase.fecha_end = SetDay(0);
		$scope.submit();
	}
	// moreClases
	$scope.moreClases = function() {
		oldate = $("#fecha_end").datepicker( "getDate" );
		oldate =  [oldate.getFullYear(),oldate.getMonth()+1,oldate.getDate()].join('-');
		// $scope.clase.fecha_start = oldate
		var nwdate =  new Date(oldate);
		nwdate.setDate(nwdate.getDate()+10);
		nwdate =  [nwdate.getFullYear(),nwdate.getMonth()+1,nwdate.getDate()].join('-');
		$scope.clase.fecha_end = nwdate;
		$scope.submit();
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha_start" ).datepicker({
			defaultDate: "+0d",
			onSelect: function(dateText) {
				$scope.clase.fecha_start=dateText;
				$("#fecha_end").datepicker("option", "minDate", dateText);
				var nwdate =  new Date(dateText);
				nwdate.setDate(nwdate.getDate()+10);
				nwdate =  [nwdate.getFullYear(),nwdate.getMonth()+1,nwdate.getDate()].join('-');
				$("#fecha_end").datepicker("setDate", nwdate);
				$scope.clase.fecha_end=nwdate;
		   }
		});
	});
	 $(function() {
		$( "#fecha_end" ).datepicker({
			defaultDate: '-2m',
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
	// Destroy
	$scope.toDestroy = function(clase_id) {
		$scope.IdToDestroy = clase_id;
	};
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.clases, function(index) {
				if($scope.clases[index]!=undefined && $scope.clases[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceClase.destroy($scope.deleteVariablesClaseToSend($scope.clases[index],true,true), $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}    
			});
		})
	};
	// Confirm / Unconfirm asistencia
	$scope.confirmPrescence = function(clase_id, asistencia_id) {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.claseToConfirm = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$scope.claseToConfirm['asistencia_id'] = asistencia_id;
		ResourceClase.confirm($scope.claseToConfirm, $scope.callbackSuccess, $scope.callbackFailure);
		$scope.tableParams.reload();
	};
	$scope.unconfirmPrescence = function(clase_id, asistencia_id) {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.claseToConfirm = $.grep($scope.clases, function(e){ return e.id == clase_id; })[0];
		$scope.claseToConfirm['asistencia_id'] = asistencia_id;
		ResourceClase.unconfirm($scope.claseToConfirm, $scope.callbackSuccess, $scope.callbackFailure);
		$scope.tableParams.reload();
	};
	// Defaults
	$scope.GoToAlumnoEdit = function(id) {$location.path("/alumno/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/clase/new");};
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.GoToBulk = function() {$location.path("/clase/bulk");};
	$scope.GoToEditBulk = function() {$location.path("/clase/edit_bulk");};
	$scope.columns_dashboard = columns_dashboard;
	$scope.cant_visible_cols = $.grep(columns_dashboard, function(e){ return e.visible == true; }).length+1;
	$scope.clase = new ResourceClase();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	$scope.FormButton = '<i class="fa fa-search"></i> Buscar';
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.InstructorIndex.push({id:9999999, nombre_completo:'Todxs'});
		cookie_search = $cookieStore.get('clase_searched');
		cookie_search = false;
		if (cookie_search){ $scope.clase = cookie_search;}else
		{
			if (typeof $scope.is_instructor !== 'undefined' && $scope.is_instructor){
					$scope.clase.instructor_id = $scope.instructor_id;}
			else{	$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;}
			$scope.clase.fecha_end = SetDay(+10);
			$scope.clase.fecha_start = SetDay(0);
		}
		$("#fecha_end").datepicker("option", "minDate", SetDay(0));
		$scope.submit();
	});
	
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseBulkCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.GoToIndex = function(id) {$location.path("/clase/dashboard");};
	$scope.GoToNewActividad = function() {$location.path("/actividad/new");};
	$scope.ActividadIndex = [];
	$scope.ActividadIndex = ResourceActividad.index();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Bulk
	$scope.FormTitle = "<i class='fa fa-calendar'></i> Agregar clases";
	$scope.FormButton = '<i class="fa fa-calendar fa-lg"></i> Agregar';
	$scope.clase = new ResourceClase();
	$scope.clase.users = [];
	$scope.clase.fecha_start = $scope.SetToday();
	$scope.clase.fecha_end = $scope.SetToday();
	$scope.clase.max_users = 4;
	$scope.clase.duracion = 1; 
	$scope.clase.trialable = true;
	$scope.ActividadIndex.$promise.then(function(data) {
		$scope.clase.actividad_id = $scope.ActividadIndex[ActividadIndexDefault].id;
	});
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
	});
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			ResourceClase.bulk($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);

		} else {
			$scope.ClaseForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete User
	$scope.DeleteUser = function(id) {
		$.each($scope.clase.users, function(index) {
			if($scope.clase.users[index]!=undefined && $scope.clase.users[index].id == id) { //Remove from array
				$scope.clase.users.splice(index, 1);
			}    
		});
	};
	// Autocomplete
	$(function() {
		$( "#search_user" ).autocomplete({
			source: '/api/alumnos/autocomplete',
			minLength: 2,
			select: function( event, ui ) {
				$scope.clase.users = $scope.clase.users.concat(ui.item);
				console.log(ui.item);
				$scope.$apply();
				$(this).val("");
				return false;
			}
		});
	});
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha_start" ).datepicker({
			defaultDate: "+0d",
			onSelect: function(dateText) {
				$scope.clase.fecha_start=dateText;
		   }
		});
	});
	 $(function() {
		$( "#fecha_end" ).datepicker({
			defaultDate: "+1m",
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseEditBulkCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceClase', 'ResourceActividad', 'ResourceAlumno', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceClase, ResourceActividad, ResourceAlumno) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.submiterror = false;
	$scope.GoToIndex = function(id) {$location.path("/clase/dashboard");};
	$scope.GoToNewActividad = function() {$location.path("/actividad/new");};
	$scope.ActividadIndex = [];
	$scope.ActividadIndex = ResourceActividad.index();
	$scope.InstructorIndex = ResourceAlumno.instructores();
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Bulk
	$scope.FormTitle = "<i class='fa fa-calendar'></i> Editar clases";
	$scope.FormButton = '<i class="fa fa-calendar fa-lg"></i> Editar';
	$scope.clase = new ResourceClase();
	$scope.clase.fecha_start = $scope.SetToday();
	$scope.clase.fecha_end = $scope.SetToday();
	$scope.clase.max_users = 4;
	$scope.clase.duracion = 1; 
	$scope.clase.trialable = true;
	$scope.ActividadIndex.$promise.then(function(data) {
		$scope.clase.actividad_id = $scope.ActividadIndex[ActividadIndexDefault].id;
	});
	$scope.InstructorIndex.$promise.then(function(data) {
		$scope.clase.instructor_id = $scope.InstructorIndex[InstructorIndexDefault].id;
	});
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$scope.FormErrors = [];
		if ($scope.ClaseForm.$valid) {
			console.log("valid submit");
			ResourceClase.edit_bulk($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);

		} else {
			$scope.ClaseForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete User
	$scope.DeleteUser = function(id) {
		$.each($scope.clase.users, function(index) {
			if($scope.clase.users[index]!=undefined && $scope.clase.users[index].id == id) { //Remove from array
				$scope.clase.users.splice(index, 1);
			}    
		});
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fecha_start" ).datepicker({
			defaultDate: "+0d",
			onSelect: function(dateText) {
				$scope.clase.fecha_start=dateText;
		   }
		});
	});
	 $(function() {
		$( "#fecha_end" ).datepicker({
			defaultDate: "+1m",
			onSelect: function(dateText) {
				$scope.clase.fecha_end=dateText;
		   }
		});
	});
stopLoading();}]);
angular.module("TurnosApp").controller("ClaseShowCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceClase', function($scope, $rootScope, $routeParams, $location, ResourceClase) {
	$scope.clase = ResourceClase.show({ id: $routeParams.id });
	$scope.clase.$promise.then(function(data){console.log(data);},function( error ){$location.path("/dashboard/index");});
	// Destroy
	$scope.destroyClase = function() {
		$rootScope.got_to_url_success = "/clase/dashboard";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.clase.users = null;
			ResourceClase.destroy($scope.clase, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
angular.module("TurnosApp").controller("AlumnoIndexCtrl",['$scope', '$rootScope', '$location', 'ResourceAlumno', '$filter','NgTableParams', '$timeout', function($scope, $rootScope, $location, ResourceAlumno, $filter, NgTableParams, $timeout) {
	$scope.GoToEdit = function(id) {$location.path("/alumno/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/alumno/new");};
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceAlumno;
	$scope.columns_alumno = columns_alumno
	$scope.cant_visible_cols = $.grep(columns_alumno, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: alumnoDefaultPage,         	// initial first page
		count: alumnoDefaultCount,         	// initial count per page
		filter: alumnoDefaultFilter, 		// initial filter
		sorting: alumnoDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function(params) {
			// ajax request to api
			startLoading();
			return Api.index().$promise.then(function(data) {
				$scope.alumnos = data;
				// Filter & Sort
				filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// Show
				params.total(orderedData.inlineCount);
				stopLoading();
				return orderedData;
			});
		}
    });
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
	$scope.toDestroy = "";
	// Destroy
	$scope.toDestroy = function(alumno_id) {
			console.log("alumno_id",alumno_id)
		$scope.IdToDestroy = alumno_id;
	};
	$scope.destroyAlumno = function() {
		$rootScope.got_to_url_success = "/alumno/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$.each($scope.alumnos, function(index) {
				console.log("Alumno",$scope.alumnos[index])
				if($scope.alumnos[index]!=undefined && $scope.alumnos[index].id == $scope.IdToDestroy) { //Remove from array
					ResourceAlumno.destroy($scope.alumnos[index], $scope.callbackSuccess, $scope.callbackFailure);
					$scope.tableParams.reload();
				}
			});
		})
	};
}]);















angular.module("TurnosApp").controller("AlumnoEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceAlumno', 'ResourceActividad', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceAlumno, ResourceActividad) {
	$scope.FormErrors = [];
	$scope.horariosArray = horariosArray;
	$scope.sexosArray = sexosArray;
	$scope.submiterror = false;
	$scope.GoToEdit = function(id) {$location.path("/clase/"+id+"/edit/");};
	$scope.history_GoToAlumnoEdit = []; // Prevents loop search
	$scope.GoToIndex = function(id) {$location.path("/alumno/index");};
	$scope.ActividadIndex = [];
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	// SetToday
	$scope.SetToday = function(scope_date) {
		today = new Date();
		dd = today.getDate();if(dd<10){dd='0'+dd } 
		mm = today.getMonth()+1;if(mm<10){mm='0'+mm }  //January is 0!
		yyyy = today.getFullYear();
		return yyyy+'-'+mm+'-'+dd
	};
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar cambios';
		$scope.alumno = ResourceAlumno.show({ id: $routeParams.id });
		$scope.ActividadIndex = ResourceActividad.index();
		$scope.clases = ResourceAlumno.usr_clases({ id: $routeParams.id }).$promise.then(function( data ){
			angular.forEach(data, function(value, key) {
				data[key]["fecha_fixed"] = dateFormat(value.fecha) ;
			});
			$scope.clases = data;
		});
		$scope.pagos = ResourceAlumno.usr_pagos({ id: $routeParams.id }).$promise.then(function( data ){
			$scope.pagos = data;
		});
		$scope.alumno.$promise.then(function( value ){
			ResourceActividad.index().$promise.then(function(ActividadIndex){
				$scope.ActividadIndex = ActividadIndex;
				$.each($scope.ActividadIndex, function(index_actividades) {
					notincluded = true;
					$.each($scope.alumno.packs, function(index_pack) {
						if($scope.ActividadIndex[index_actividades].id==$scope.alumno.packs[index_pack].actividad_id){notincluded=false;}
					});
					if(notincluded){
						missing_pack = {"actividad_id":$scope.ActividadIndex[index_actividades].id,"cantidad":null,"noperiod":true,"fecha_start":null,"fecha_end":null,"actividad":$scope.ActividadIndex[index_actividades]}
						$scope.alumno.packs.push(missing_pack);
					}
				});
			});
		},function( error ){$location.path("/alumno/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-user'></i> Agregar nuevo alumno";
		$scope.FormButton = '<i class="fa fa-alumno-plus fa-lg"></i> Agregar alumno';
		$scope.alumno = new ResourceAlumno();
		$scope.alumno.alumnos = [];
		$scope.alumno.fecha_inicio = $scope.SetToday();
		$scope.alumno.actividades = ResourceActividad.index();
	}
	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/alumno/index";
		$scope.FormErrors = [];
		if ($scope.AlumnoForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourceAlumno.update($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourceAlumno.create($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure); 	
			}
		} else {
			$scope.AlumnoForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
	// Delete Alumno
	$scope.DeleteAlumno = function(id) {
		$.each($scope.alumno.alumnos, function(index) {
			if($scope.alumno.alumnos[index]!=undefined && $scope.alumno.alumnos[index].id == id) { //Remove from array
				$scope.alumno.alumnos.splice(index, 1);
			}    
		});
	};
	// GoTo
  	$scope.GoToAlumnoEdit = function() {
		if($scope.history_GoToAlumnoEdit.indexOf($scope.alumno.email) == -1){
			if($scope.alumno.email!=undefined&&$scope.alumno.email!=null&&$scope.alumno.email!=''){
				$scope.history_GoToAlumnoEdit.push($scope.alumno.email);
				$http.get('/api/alumnos/search', {params: { email:$scope.alumno.email}}).
				success(function(data, status, headers, config) {
					if(data.id!=undefined){
						$location.path("/alumno/"+data.id+"/edit");
					}else{};
				});
			};
		};
	};
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechanac" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechanac=dateText;
		   }
		});
	});
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#fechaini" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechaini=dateText;
		   }
		});
	});
	// Datepicker
	 var datelist = []; // initialize empty array
	 $(function() {
		$( "#nuevopago_fecha" ).datepicker({
			defaultDate: "+0D",
			onSelect: function(dateText) {
				$scope.alumno.fechaini=dateText;
		   }
		});
	});
		
stopLoading();}]);
angular.module("TurnosApp").controller("AlumnoShowCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceAlumno', function($scope, $rootScope, $routeParams, $location, ResourceAlumno) {
	$scope.alumno = ResourceAlumno.show({ id: $routeParams.id });
	$scope.alumno.$promise.then(function(data){console.log(data);},function( error ){$location.path("/alumno/index");});
	// Destroy
	$scope.destroyAlumno = function() {
		$rootScope.got_to_url_success = "/alumno/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.alumno.alumnos = null;
			ResourceAlumno.destroy($scope.alumno, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
angular.module("TurnosApp").controller("ActividadIndexCtrl",['$scope', '$location', 'ResourceActividad', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceActividad, $filter, NgTableParams, $timeout) {
	//	$scope.practicantes = ResourcePracticante.index();
	$scope.GoToEdit = function(id) {$location.path("/actividad/"+id+"/edit/");};
	$scope.GoToNew = function() {$location.path("/actividad/new");};
	// ngTable
	function dateFormat(date) {date = date.split('-'); date = date[2]+'/'+date[1]; return date;}
	var Api = ResourceActividad;
	$scope.columns_actividad = columns_actividad
	$scope.cant_visible_cols = $.grep(columns_actividad, function(e){ return e.visible == true; }).length+1;
    $scope.tableParams = new NgTableParams({
		page: actividadDefaultPage,         	// initial first page
		count: actividadDefaultCount,         	// initial count per page
		sorting: actividadDefaultSorting 		// initial sorting
	}, {
		total: 0,           // length of data
		getData: function(params) {
			// ajax request to api
			startLoading();
			return Api.index().$promise.then(function(data) {
				$scope.actividades = data;
				// Filter & Sort
				filteredData = params.filter() ? $filter('filter')(data, params.filter()): data;	
				orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				// Show
				params.total(orderedData.inlineCount);
				stopLoading();
				return orderedData;
			});
		}
    });
	// Reload button
	$scope.reloadTable = function(id) {
		$scope.tableParams.reload();
	};
}]);















angular.module("TurnosApp").controller("ActividadEditCtrl",['$scope', '$rootScope', '$q', '$http', '$routeParams', '$location', 'ResourceActividad', function($scope, $rootScope, $q, $http, $routeParams, $location, ResourceActividad) {
	$scope.submiterror = false;
	// Edit or New
	if ($routeParams.id) { 	// Edit
		$scope.FormTitle = "<i class='fa fa-cog'></i> Editar datos de la actividad";
		$scope.FormButton = '<i class="fa fa-edit fa-lg"></i> Guardar';
		$scope.actividad = ResourceActividad.show({ id: $routeParams.id });
		$scope.actividad.$promise.then(function( value ){},function( error ){$location.path("/actividad/new");});	// if id not exists => ToNew
	} else { 				// New
		$scope.FormTitle = "<i class='fa fa-cog'></i> Agregar nueva actividad";
		$scope.FormButton = '<i class="fa fa-plus-square fa-lg"></i> Agregar';
		$scope.actividad = new ResourceActividad();
	}

	// SUBMIT
	$scope.submitted = false;
	$scope.submit = function() {
		$rootScope.got_to_url_success = "/actividad/index";
		if ($scope.ActividadForm.$valid) {
			console.log("valid submit");
			// Update or Create
			if ($routeParams.id) {
				ResourceActividad.update($scope.actividad, $scope.callbackSuccess, $scope.callbackFailure);
			} else {
				ResourceActividad.create($scope.actividad, $scope.callbackSuccess, $scope.callbackFailure); 	
			}
		} else {
			$scope.ActividadForm.submitted = true;
			window.scrollTo(0, 0);
		}
	};
stopLoading();}]);
angular.module("TurnosApp").controller("ActividadShowCtrl",['$scope', '$rootScope', '$routeParams', '$location', 'ResourceActividad', function($scope, $rootScope, $routeParams, $location, ResourceActividad) {
	$scope.actividad = ResourceActividad.show({ id: $routeParams.id });
	$scope.actividad.$promise.then(function(data){console.log(data);},function( error ){$location.path("/actividad/index");});
	// Destroy
	$scope.destroyPraticante = function() {
		$rootScope.got_to_url_success = "/actividad/index";
		$('.confirmation-modal').on('hidden.bs.modal', function (e) {
			$scope.actividad.practicantes = null;
			ResourceActividad.destroy($scope.actividad, $scope.callbackSuccess, $scope.callbackFailure);
		})
	};
stopLoading();}]);
angular.module("TurnosApp").controller("EventIndexCtrl",['$scope', '$location', 'ResourceEvent', '$filter','NgTableParams', '$timeout', function($scope, $location, ResourceEvent, $filter, NgTableParams, $timeout) {
	$scope.events = [];
	$scope.filter_join = true;
	$scope.filter_joinmultiple = true;
	$scope.filter_unjoin = true;
	$scope.filter_waitlist = true;
	$scope.filter_waitlistclear = true;
	$scope.filter_finish_signup = true;
	$scope.filter_pricing = true;
	ResourceEvent.index().$promise.then(function(data) {
		$scope.events = data;
		stopLoading();
	});
}]);















// ROUTING ================================================
angular.module("TurnosApp")
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
		// Api 
		.when("/app/mi_info", { title: 'Mi info',templateUrl: "/assets/usr/usr_mi_info.html ", controller: "UsrMiInfoCtrl", activetab: 'clase'})
		.when("/app/mis_clases", { title: 'Mis Clases',templateUrl: "/assets/usr/usr_mis_clases.html ", controller: "UsrMisClasesCtrl", activetab: 'clase'})
		.when("/app/planificar", { title: 'Planificar mis horarios',templateUrl: "/assets/usr/usr_planificar.html ", controller: "UsrPlanificarCtrl", activetab: 'clase'})
		.when("/app/agenda", { title: 'Agenda',templateUrl: "/assets/usr/usr_agenda.html ", controller: "UsrAgendaCtrl", activetab: 'clase'})
		.when("/app/", {  redirectTo: "/app/agenda" })
		// Clases
		.when("/clase/index", { title: 'Listado de clases',templateUrl: "/assets/clase/index.html ", controller: "ClaseIndexCtrl", activetab: 'clase'})
		.when("/clase/new", { title: 'Nueva clase',templateUrl: "/assets/clase/edit.html ", controller: "ClaseEditCtrl", activetab: 'clase'})
		.when("/clase/agendar", { title: 'Agendar alumno',templateUrl: "/assets/clase/agendar.html ", controller: "ClaseAgendarCtrl", activetab: 'clase'})
		.when("/clase/bulk", { title: 'Agregar en cantidad',templateUrl: "/assets/clase/bulk.html ", controller: "ClaseBulkCtrl", activetab: 'clase'})
		.when("/clase/edit_bulk", { title: 'Editar en cantidad',templateUrl: "/assets/clase/edit_bulk.html ", controller: "ClaseEditBulkCtrl", activetab: 'clase'})
		.when("/clase/instructor", { title: 'Clases por instructor',templateUrl: "/assets/clase/instructor.html ", controller: "ClaseInstructorCtrl", activetab: 'clase'})
		.when("/clase/dashboard", { title: 'Panel de clases',templateUrl: "/assets/clase/dashboard.html ", controller: "ClaseDashboardCtrl", activetab: 'clase'})
		.when("/clase/:id", { title: 'Detalles de la clase',templateUrl: "/assets/clase/show.html ", controller: "ClaseShowCtrl", activetab: 'clase'})
		.when("/clase/:id/edit", { title: 'Editar clase',templateUrl: "/assets/clase/edit.html ", controller: "ClaseEditCtrl", activetab: 'clase'})
		// Alumnos 
		.when("/alumno/index", { title: 'Listado de alumnos',templateUrl: "/assets/alumno/index.html ", controller: "AlumnoIndexCtrl", activetab: 'alumno'})
		.when("/alumno/new", { title: 'Nuevo alumno',templateUrl: "/assets/alumno/edit.html ", controller: "AlumnoEditCtrl", activetab: 'alumno'})
		.when("/alumno/:id", { title: 'Detalles de la alumno',templateUrl: "/assets/alumno/show.html ", controller: "AlumnoShowCtrl", activetab: 'alumno'})
		.when("/alumno/:id/edit", { title: 'Editar alumno',templateUrl: "/assets/alumno/edit.html ", controller: "AlumnoEditCtrl", activetab: 'alumno'})
		// Actividad 
		.when("/actividad/index", { title: 'Listado de actividades',templateUrl: "/assets/actividad/index.html ", controller: "ActividadIndexCtrl", activetab: 'actividad'})
		.when("/actividad/new", { title: 'Nuevo actividad',templateUrl: "/assets/actividad/edit.html ", controller: "ActividadEditCtrl", activetab: 'actividad'})
		.when("/actividad/:id", { title: 'Detalles de la actividad',templateUrl: "/assets/actividad/show.html ", controller: "ActividadShowCtrl", activetab: 'actividad'})
		.when("/actividad/:id/edit", { title: 'Editar actividad',templateUrl: "/assets/actividad/edit.html ", controller: "ActividadEditCtrl", activetab: 'actividad'})
		// Event 
		.when("/eventos/index", { title: 'Listado de eventos',templateUrl: "/assets/event/index.html ", controller: "EventIndexCtrl", activetab: 'event'})
		// Otros
		.otherwise({ redirectTo: "/" });
		// Fixes # in the routes. Not in IE...
		if(window.history && window.history.pushState){$locationProvider.html5Mode(true);}
}])
// AngularJS Interceptor
//The following AngularJS Interceptor can be used to globally handle any 401 error, and handle them by redirecting the user to the /login page.
.factory('authHttpResponseInterceptor',['$q','$location','$window',function($q,$location,$window){ 
    return {
        response: function(response){
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);
                $window.location.href = '/users/sign_in';
            }
            return $q.reject(rejection);
        }
    }
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);	

angular.module("TurnosApp").run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if(current.$$route.title!=undefined&&current.$$route.title!=''){
			$rootScope.title = " | "+current.$$route.title;
			document.title = document.title+$rootScope.title;
		}
		$rootScope.activetab = current.$$route.activetab;
	});
}]);

angular.module("TurnosApp").config(['$httpProvider',function($httpProvider) {
	$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);

































// startLoading
function startLoading() {
	$('#AppContainer').fadeOut();
	$('#ReleveImgNav').hide();
	$('#LoadingImg').show();
}
// stopLoading
function stopLoading() {
	$('#LoadingImg').hide();
	$('#ReleveImgNav').show();
	$('#AppContainer').fadeIn();
}
startLoading();
