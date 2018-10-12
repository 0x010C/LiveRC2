'use strict';

( function ( mw, $, lrc ) {
	var ipv4 = /^(([0-1]?[0-9]{1,2}\.)|(2[0-4][0-9]\.)|(25[0-5]\.)){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
		ipv6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

	/**
	 * Provide many metadatas about revision, pages or users
	 *
	 * @class lrc.MetadataProvider
	 *
	 * @constructor
	 */
	lrc.MetadataProvider = function () {
		// Properties
		this.userInfos = {};
		this.revInfos = {};

		// Initialization

	};

	lrc.MetadataProvider.prototype.get = function ( request ) {
		var i, payload, username, revid,
			missingUsers = [],
			missingIps = [],
			missingRevs = [],
			deferred = $.Deferred();

		request.users = request.users || {};
		request.revs = request.revs || {};

		// Check which requested data is cached, and which is missing
		for ( i = 0; i < request.users.length; i++ ) {
			username = request.users[ i ];
			if ( this.userInfos[ username ] === undefined ) {
				if ( this.isIp( username ) ) {
					missingIps.push( username );
					this.userInfos[ username ] = { name: username, pending: deferred, isIp: true, isBlocked: false };
				} else {
					missingUsers.push( username );
					this.userInfos[ username ] = { name: username, pending: deferred, isIp: false, isBlocked: false };
				}
			}
		}
		for ( i = 0; i < request.revs.length; i++ ) {
			revid = request.revs[ i ];
			if ( this.revInfos[ revid ] === undefined ) {
				missingRevs.push( revid );
				this.revInfos[ revid ] = { pending: deferred };
			}
		}

		// Fetch missing datas from the API
		if ( missingRevs.length > 0 || missingUsers.length > 0 || missingIps.length > 0 ) {
			payload = this._forgeRequest( missingUsers, missingIps, missingRevs );
			lrc.singleton.api.get( payload )
				.then( this._storeApiResult.bind( this, request ) /* TODO: handle API error (timeouts,...), the second param of "then" */ )
				.then( deferred.resolve.bind( deferred ) );
		} else { // But if we have all requested datas, no API call is needed, return directly the cached data
			deferred.resolve();
		}

		return deferred.then( this._provideInfos.bind( this, request ) );
	};

	lrc.MetadataProvider.prototype.getUserInfos = function ( username ) {
		// Quick way for a single, already cached, user
		if ( this.userInfos[ username ] !== undefined && this.userInfos[ username ].pending === undefined ) {
			return $.Deferred().resolve( this.userInfos[ username ] );
		}

		return this.get( { users: [ username ] } ).then( function ( datas ) {
			return datas.users[ username ];
		} );
	};

	lrc.MetadataProvider.prototype.getRevInfos = function ( revid ) {
		// Quick way for a single, already cached, user
		if ( this.revInfos[ revid ] !== undefined && this.revInfos[ revid ].pending === undefined ) {
			return $.Deferred().resolve( this.revInfos[ revid ] );
		}

		return this.get( { revs: [ revid ] } ).then( function ( datas ) {
			return datas.revs[ revid ];
		} );
	};

	lrc.MetadataProvider.prototype._forgeRequest = function ( usernames, ips, revs ) {
		var payload = {
			action: 'query',
			format: 'json',
			formatversion: '2'
		};

		if ( usernames.length + ips.length > 0 ) {
			payload.list = 'blocks';
			payload.bkprop = 'user|by|expiry|reason';
			payload.bkusers = usernames.concat( ips ).join( '|' );
		}

		if ( usernames.length > 0 ) {
			payload.list += '|users';
			payload.usprop = 'groups|editcount|registration';
			payload.ususers = usernames.join( '|' );
		}

		if ( revs.length > 0 ) {
			payload.prop = 'revisions|info';
			payload.rvprop = 'tags|oresscores|ids';
			payload.inprop = 'protection|watchers';
			payload.revids = revs.join( '|' );
		}

		return payload;
	};

	lrc.MetadataProvider.prototype._storeApiResult = function ( request, data ) {
		var i, j, block, user, page, rev,
			blocks = data.query.blocks,
			users = data.query.users,
			pages = data.query.pages;

		if ( blocks !== undefined ) {
			for ( i = 0; i < blocks.length; i++ ) {
				block = blocks[ i ];
				this.userInfos[ block.user ].isBlocked = true;
				this.userInfos[ block.user ].block = {
					by: block.by,
					expiry: block.expiry,
					reason: block.reason
				};
			}
		}

		if ( users !== undefined ) {
			for ( i = 0; i < users.length; i++ ) {
				user = users[ i ];
				this.userInfos[ user.name ].editcount = user.editcount;
				this.userInfos[ user.name ].registration = new Date( user.registration );
				this.userInfos[ user.name ].groups = user.groups;
			}
		}

		if ( pages !== undefined ) {
			for ( i = 0; i < pages.length; i++ ) {
				page = pages[ i ];
				for ( j = 0; j < page.revisions.length; j++ ) {
					rev = page.revisions[ j ];
					this.revInfos[ rev.revid ].tags = rev.tags;
					this.revInfos[ rev.revid ].ores = {
						damaging: rev.oresscores.damaging.true,
						goodfaith: rev.oresscores.goodfaith.true
					};
					this.revInfos[ rev.revid ].protection = ( page.protection[ 0 ] === undefined ? false : page.protection[ 0 ].level );
					this.revInfos[ rev.revid ].watchers = page.watchers;
				}
			}
		}

		for ( i = 0; i < request.users.length; i++ ) {
			delete this.userInfos[ request.users[ i ] ].pending;
		}
		for ( i = 0; i < request.revs.length; i++ ) {
			delete this.revInfos[ request.revs[ i ] ].pending;
		}
	};

	lrc.MetadataProvider.prototype._provideInfos = function ( request ) {
		var i, username, revid,
			response = { users: {}, revs: {} };

		for ( i = 0; i < request.users.length; i++ ) {
			username = request.users[ i ];
			if ( this.userInfos[ username ].pending !== undefined ) {
				return this.userInfos[ username ].pending.then( this._provideInfos.bind( this, request ) );
			}
			response.users[ username ] = this.userInfos[ username ];
		}

		for ( i = 0; i < request.revs.length; i++ ) {
			revid = request.revs[ i ];
			if ( this.revInfos[ revid ].pending !== undefined ) {
				return this.revInfos[ revid ].pending.then( this._provideInfos.bind( this, request ) );
			}
			response.revs[ revid ] = this.revInfos[ revid ];
		}

		return response;
	};

	lrc.MetadataProvider.prototype.isIp = function ( username ) {
		if ( this.userInfos[ username ] !== undefined && this.userInfos[ username ].isIp !== undefined ) {
			return this.userInfos[ username ].isIp;
		}
		if ( ipv4.test( username ) || ipv6.test( username ) ) {
			return true;
		}
		return false;
	};

}( mediaWiki, jQuery, mediaWiki.liverc ) );
