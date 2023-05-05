sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel"], function (e, t) {
	"use strict";
	return e.extend("dksh.connectclient.TrackReturnOrder.controller.App", {
		onInit: function () {
			var e, n, o = this.getView().getBusyIndicatorDelay();
			e = new t({
				busy: true,
				delay: 0,
				layout: "OneColumn",
				previousLayout: "",
				actionButtonsInfo: {
					midColumn: {
						fullScreen: false
					}
				}
			});
			this.setModel(e, "appView");
			n = function () {
				e.setProperty("/busy", false);
				e.setProperty("/delay", o);
			};
		}
	});
});