/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["normalizePMRatingFormAPI40/normalisationapi40/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
