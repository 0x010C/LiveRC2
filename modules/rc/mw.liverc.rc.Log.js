'use strict';

( function ( mw, $, lrc ) {

	/**
	 *
	 *
	 * @class lrc.rc.Log
	 * @extends lrc.rc.Generic
	 *
	 * @constructor
	 * @param {Object} config
	 */
	lrc.rc.Log = function ( config ) {
		// Parent constructor
		lrc.rc.Log.parent.call( this, config );

		this.logId = config.log_id;
		this.logType = config.log_type;
		this.logAction = config.log_action;
		this.logParams = config.log_params;
		this.logActionComment = config.log_action_comment;
	};

	OO.inheritClass( lrc.rc.Log, lrc.rc.Generic );

}( mediaWiki, jQuery, mediaWiki.liverc ) );
