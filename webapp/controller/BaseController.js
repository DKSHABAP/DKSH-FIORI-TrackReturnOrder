sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (e, t) {
	"use strict";
	return e.extend("dksh.connectclient.TrackReturnOrder.controller.BaseController", {
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		getModel: function (e) {
			return this.getView().getModel(e);
		},
		setModel: function (e, t) {
			return this.getView().setModel(e, t);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		onNavBack: function () {
			var e = t.getInstance().getPreviousHash(),
				n = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (e !== undefined || !n.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}
	});
});