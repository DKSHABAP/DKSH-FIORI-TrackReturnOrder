sap.ui.define(["./BaseController"], function (t) {
	"use strict";
	return t.extend("dksh.connectclient.TrackReturnOrder.controller.NotFound", {
		onInit: function () {
			this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this)
		},
		_onNotFoundDisplayed: function () {
			this.getModel("appView").setProperty("/layout", "OneColumn")
		}
	})
});