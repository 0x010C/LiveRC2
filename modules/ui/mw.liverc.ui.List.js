'use strict';

( function ( mw, $, OO, lrc ) {

	/**
	 *
	 *
	 * @class lrc.ui.List
	 *
	 * @constructor
	 */
	lrc.ui.List = function ( container ) {
		// Properties
		this.container = container;
		this.lines = [];
	};

	lrc.ui.List.prototype.showNewRC = function ( rc ) {
		var line = new lrc.ui.Line( rc, this.container.getElement() );
		this.lines.push( line );

		if ( this.lines.length > 15 ) {
			this.lines.shift().remove();
		}

		return;
	};

	lrc.ui.List.prototype.close = function () {
		var i,
			len = this.lines.length;

		for ( i = 0; i < len; i++ ) {
			this.lines[ i ].remove();
		}

		delete this.lines;
		delete this.container;
	};

}( mediaWiki, jQuery, OO, mediaWiki.liverc ) );
