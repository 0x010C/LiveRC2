'use strict';

( function ( mw, $, lrc ) {

	var LINE_TEMPLATE = '<td>$(time)</td><td><a href="' + mw.config.get( 'wgArticlePath' ).replace( '$1', 'User:$(username)' ) + '">$(username)</a></td><td>$(title)</td><td>$(comment)</td>';
	/**
	 *
	 *
	 * @class lrc.ui.Line
	 *
	 * @constructor
	 */
	lrc.ui.Line = function ( rc, parentContainer ) {
		// Properties
		this.container = $( '<tr>' );

		// Initialization
		this.update( rc );
		parentContainer.prepend( this.container );

		// Events
		// lrc.singleton.eventHub.on( '' )
	};

	lrc.ui.Line.prototype.update = function ( rc ) {
		var content = '';

		// TODO: stuff
		content = LINE_TEMPLATE
			.replace( /\$\(username\)/g, rc.user )
			.replace( /\$\(title\)/g, rc.title )
			.replace( /\$\(comment\)/g, rc.comment )
			.replace( /\$\(time\)/g, new Date( rc.timestamp ).toLocaleTimeString() );

		this.container.html( content );
		return;
	};

	lrc.ui.Line.prototype.remove = function () {
		this.container.remove();
	};

}( mediaWiki, jQuery, mediaWiki.liverc ) );
