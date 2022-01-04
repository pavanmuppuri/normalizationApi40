/*global QUnit*/

sap.ui.define([
	"normalizePMRatingForm_API40/normalisationapi40/controller/normalizePMRating.controller"
], function (Controller) {
	"use strict";

	QUnit.module("normalizePMRating Controller");

	QUnit.test("I should test the normalizePMRating controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
