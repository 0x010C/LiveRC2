'use strict';

( function ( mw, $, lrc ) {

	/**
	 *
	 *
	 * @class lrc.rc.Generic
	 * @abstract
	 *
	 * @constructor
	 * @param {Object} config
	 */
	lrc.rc.Generic = function ( config ) {
		this.id = config.id;
		this.type = config.type;
		this.title = config.title;
		this.namespace = config.namespace;
		this.comment = config.parsedcomment;
		this.timestamp = config.timestamp;
		this.user = config.user;
		this.bot = config.bot;
	};

}( mediaWiki, jQuery, mediaWiki.liverc ) );
