<?php
/**
 * LiveRC SpecialPage for LiveRC extension
 *
 * @file
 * @ingroup Extensions
 */

class SpecialLiveRC extends SpecialPage {
	public function __construct() {
		parent::__construct( 'LiveRC', 'edit' );
	}

	public function execute( $sub ) {
		$out = $this->getOutput();

		$out->addModuleStyles( 'ext.liverc.styles' );
		$out->addModules( 'ext.liverc' );
		$out->setPageTitle( $this->msg( 'special-liverc-title' ) );
		$out->addWikiMsg( 'special-liverc-intro' );
	}

	protected function getGroupName() {
		return 'changes';
	}
}
