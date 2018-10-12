'use strict';

( function ( mw, $, lrc ) {

	/**
	 *
	 *
	 * @class lrc.rc.Edit
	 * @extends lrc.rc.Generic
	 *
	 * @constructor
	 * @param {Object} config
	 */
	lrc.rc.Edit = function ( config ) {
		// Parent constructor
		lrc.rc.Edit.parent.call( this, config );

		this.minor = config.minor;
		this.patrolled = config.patrolled;
		this.length = { old: config.length.old, 'new': config.length.new };
		this.revision = { old: config.revision.old, 'new': config.revision.new };
		this.isNew = ( config.revision.old === null );
	};

	OO.inheritClass( lrc.rc.Edit, lrc.rc.Generic );

}( mediaWiki, jQuery, mediaWiki.liverc ) );
