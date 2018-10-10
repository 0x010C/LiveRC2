'use strict';

( function ( mw, $, lrc ) {

	/**
	 * Main object; used to setup and initialise everything.
	 *
	 * @class lrc.LiveRC
	 *
	 * @constructor
	 */
	lrc.LiveRC = function () {
		this.mainLayout = new GoldenLayout( this.getLayoutConfig() );

		this.mainLayout.registerComponent( 'listComponent', lrc.controller.List );
		// this.mainLayout.registerComponent( 'diffComponent', lrc.controller.Diff );

		$( 'body' ).empty();
		this.mainLayout.init();

		this.mainLayout.on( 'stateChanged', this.saveLayoutConfig, this );

		if ( !this.mainLayout.isSubWindow ) {
			lrc.singleton.eventHub = this.mainLayout.eventHub;
			lrc.singleton.rcProvider = new lrc.RCProvider();
			// TODO: UserInfoProvider
			// TODO: RevisionInfoProvider
			// TODO: RevisionProvider
		}

	};

	lrc.LiveRC.prototype.saveLayoutConfig = function () {
		var state = JSON.stringify( this.mainLayout.toConfig() );
		mw.storage.set( 'savedState', state );
	};

	lrc.LiveRC.prototype.getLayoutConfig = function () {
		var savedState = mw.storage.get( 'savedState' );

		// Return the saved configuration if one is found
		if ( savedState !== null ) {
			// return JSON.parse( savedState );
		}

		// Or the default configuration in the other case
		return {
			content: [ {
				type: 'row',
				content: [ {
					type: 'component',
					componentName: 'listComponent',
					componentState: { label: 'A' }
				}, {
					type: 'column',
					content: [ {
						type: 'component',
						componentName: 'listComponent',
						componentState: { label: 'B' }
					}, {
						type: 'component',
						componentName: 'listComponent',
						componentState: { label: 'C' }
					} ]
				} ]
			} ]
		};
	};

	$( function () {
		lrc.liveRC = new lrc.LiveRC();
	} );
}( mediaWiki, jQuery, mediaWiki.liverc ) );
