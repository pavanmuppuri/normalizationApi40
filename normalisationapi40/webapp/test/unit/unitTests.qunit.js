/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"normalizePMRatingForm_API40/normalisationapi40/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
