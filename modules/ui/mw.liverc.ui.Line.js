'use strict';

( function ( mw, $, lrc ) {

	/**
	 *
	 *
	 * @class lrc.ui.Line
	 *
	 * @constructor
	 */
	lrc.ui.Line = function ( rc, parentContainer ) {
		// Properties
		this.container = $( '<div>' );

		// Initialization
		this.update( rc );
		parentContainer.prepend( this.container );

		// Events
		// lrc.singleton.eventHub.on( '' )
	};

	lrc.ui.Line.prototype.update = function ( rc ) {
		var content = "";

		// TODO: stuff
		content = JSON.stringify( rc );

		this.container.html( content );
		return;
	};

	lrc.ui.Line.prototype.remove = function () {
		this.container.remove();
	};

}( mediaWiki, jQuery, mediaWiki.liverc ) );
