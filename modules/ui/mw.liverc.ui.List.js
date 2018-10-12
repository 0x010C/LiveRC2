'use strict';

( function ( mw, $, lrc ) {

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
		this.nbMaxLines = 50;
		this.$notif = $( '<div class="liverc-notif">' );
		this.$table = $( '<table>' );
		this.notifCount = 0;
		this.lines = [];

		// Initialization
		this.container.getElement().append( this.$table );

		// Events
		this.container.on( 'tab', function( tab ) {
			tab.element.append( this.$notif );
		}, this );
		this.container.on( 'show', this.resetNotif, this );
	};

	lrc.ui.List.prototype.showNewRC = function ( rc ) {
		var line = new lrc.ui.Line( rc, this.$table );
		this.lines.push( line );

		// set the notification
		if ( this.container.isHidden ) {
			if ( this.notifCount < this.nbMaxLines ) {
				this.$notif.text( ++this.notifCount );
			}
			else {
				this.$notif.text( this.notifCount + '+' );
			}
		}

		// roll the line buffer
		if ( this.lines.length > this.nbMaxLines ) {
			this.lines.shift().remove();
		}

		return;
	};

	lrc.ui.List.prototype.resetNotif = function () {
		this.notifCount = 0;
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

}( mediaWiki, jQuery, mediaWiki.liverc ) );
