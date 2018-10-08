'use strict';

( function ( mw, $, OO, lrc ) {

	/**
	 * Provide the Recent Changes of the current wiki
	 *
	 * @class lrc.RCProvider
	 * @mixins OO.EventEmitter
	 *
	 * @constructor
	 */
	lrc.RCProvider = function () {
		// Mixin constructors
		OO.EventEmitter.call( this );

		// Properties
		this.dbname = 'frwiki';// mw.config.get( 'wgDBname' );

		// Initialization
		this.source = new EventSource( 'https://stream.wikimedia.org/v2/stream/recentchange' );

		this.source.onopen = this.onOpen.bind( this );
		this.source.onmessage = this.onMessage.bind( this );
		this.source.onerror = this.onError.bind( this );
	};

	OO.mixinClass( lrc.RCProvider, OO.EventEmitter );

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

		this.emit( 'newrc', rc );
	};

	lrc.RCProvider.prototype.onError = function ( message ) {
		if ( !message.isTrusted ) {
			// console.log( message );
		}
	};

}( mediaWiki, jQuery, OO, mediaWiki.liverc ) );
