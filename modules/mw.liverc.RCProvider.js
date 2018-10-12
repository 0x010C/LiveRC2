'use strict';

( function ( mw, $, lrc ) {

	/**
	 * Provide the Recent Changes of the current wiki
	 *
	 * @class lrc.RCProvider
	 *
	 * @constructor
	 */
	lrc.RCProvider = function () {
		// Properties
		this.dbname = 'frwiki';// DEBUG: mw.config.get( 'wgDBname' );

		// Initialization
		this.source = new EventSource( 'https://stream.wikimedia.org/v2/stream/recentchange' );

		this.source.onopen = this.onOpen.bind( this );
		this.source.onmessage = this.onMessage.bind( this );
		this.source.onerror = this.onError.bind( this );
	};

	lrc.RCProvider.prototype.onOpen = function () {
		return;
	};

	lrc.RCProvider.prototype.onMessage = function ( message ) {
		var rc, rawRC = JSON.parse( message.data );
		if ( rawRC.wiki !== this.dbname ) {
			return;
		}

		switch ( rawRC.type ) {
			case 'new':
				// Fall-through
			case 'edit': // eslint-disable-line no-fallthrough
				rc = new lrc.rc.Edit( rawRC );
				break;
			case 'log':
				rc = new lrc.rc.Log( rawRC );
				break;
			default: // 'external' + 'categorize'
				rc = new lrc.rc.Generic( rawRC );
		}

		lrc.singleton.eventHub.emit( 'newrc', rc );
	};

	lrc.RCProvider.prototype.onError = function ( message ) {
		if ( !message.isTrusted ) {
			// console.log( message );
		}
	};

}( mediaWiki, jQuery, mediaWiki.liverc ) );
