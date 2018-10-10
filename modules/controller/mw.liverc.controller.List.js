'use strict';

( function ( mw, $, lrc ) {

	/**
	 * Provide the Recent Changes of the current wiki
	 *
	 * @class lrc.RCProvider
	 * @mixins OO.EventEmitter
	 *
	 * @constructor
	 */
	lrc.controller.List = function ( container, state ) {
		// Properties
		this.container = container;
		this.state = state;

		// Initialization
		this.ui = new lrc.ui.List( container );
		this.container.layoutManager.eventHub.on( 'newrc', this.onNewRC, this );
	};

	lrc.controller.List.prototype.onNewRC = function ( rc ) {
		// Pre-filter Hooks
		// Widening Hooks
		// filter Hooks
		this.ui.showNewRC( rc );
		// post-update Hooks
		return;
	};

}( mediaWiki, jQuery, mediaWiki.liverc ) );
