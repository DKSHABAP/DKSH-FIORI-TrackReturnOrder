sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter", "sap/m/library", "sap/ui/core/format/DateFormat",
	"sap/ui/model/odata/ODataModel"
], function (e, t, a, s, r, i) {
	"use strict";
	return e.extend("dksh.connectclient.TrackReturnOrder.controller.Detail", {
		formatter: a,
		onInit: function () {
			this.countBusyDialog = 0;
			var e = new sap.ui.model.json.JSONModel({
				first: true,
				second: true,
				firstlist: true,
				secondlist: true,
				Expanded: false,
				Expanded1: false,
				firstdoc: true,
				seconddoc: true
			});
			this.getView().setModel(e, "oNewModel");
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (e) {
			this.getView().byId("ID_TRCA_ICON_TAB").setSelectedKey("TrackKey");
			if (e.getParameter("name") === "object") {
				var t = sap.ui.getCore().getModel("MasterModelSelData");
				if (t === undefined) {
					var a = sap.ui.core.UIComponent.getRouterFor(this);
					a.navTo("master", true);
					return;
				}
				var s = new sap.ui.model.json.JSONModel(t);
				this.getView().byId("ID_OBJ_HDR").setModel(s);
				this.oModel = this.getView().getModel("TrackingODataModel");
				this.detailPageListData();
			}
		},
		onOrder: function (e) {
			var t = this.getView().getModel("oNewModel");
			var a = e.getParameters().item.getKey();
			t.setProperty("/firstlist", false);
			t.setProperty("/secondlist", false);
			if (a == "Return") t.setProperty("/firstlist", true);
			else if (a == "Exchange") t.setProperty("/secondlist", true);
			else {
				t.setProperty("/firstlist", true);
				t.setProperty("/secondlist", true);
			}
		},
		onDocument: function (e) {
			var t = this.getView().getModel("oNewModel");
			var a = e.getParameters().item.getKey();
			t.setProperty("/firstdoc", false);
			t.setProperty("/seconddoc", false);
			if (a == "Return") t.setProperty("/firstdoc", true);
			else if (a == "Exchange") t.setProperty("/seconddoc", true);
			else {
				t.setProperty("/firstdoc", true);
				t.setProperty("/seconddoc", true);
			}
		},
		onSummary: function (e) {
			var t = this.getView().getModel("oNewModel");
			var a = e.getParameters().item.getKey();
			t.setProperty("/first", false);
			t.setProperty("/second", false);
			if (a == "Return") t.setProperty("/first", true);
			else if (a == "Exchange") t.setProperty("/second", true);
			else {
				t.setProperty("/first", true);
				t.setProperty("/second", true);
			}
		},
		onExpandExchange: function (e) {
			var t = this.getView().getModel("oNewModel");
			if (e.getSource().getText() == "Expand All") {
				e.getSource().setText("Collapse All");
				t.setProperty("/Expanded1", true);
			} else {
				e.getSource().setText("Expand All");
				t.setProperty("/Expanded1", false);
			}
		},
		onExpandReturn: function (e) {
			var t = this.getView().getModel("oNewModel");
			if (e.getSource().getText() == "Expand All") {
				e.getSource().setText("Collapse All");
				t.setProperty("/Expanded", true);
			} else {
				e.getSource().setText("Expand All");
				t.setProperty("/Expanded", false);
			}
		},
		detailPageListData: function () {
			var e = "";
			if (sap.ushell && sap.ushell.Container) {
				e = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				e = "EN";
			}
			var t = sap.ui.getCore().getModel("MasterModelSelData").ReturnOrderNumber;
			var s = "$filter=(ReturnOrderNumber eq '" + t + "')";
			if (sap.ui.getCore().getModel("MasterModelSelData").materialGroupDataAccess != "*") {
				s = s + "and MaterialGroupDac eq '" + sap.ui.getCore().getModel("MasterModelSelData").materialGroupDataAccess + "'";
			}
			if (sap.ui.getCore().getModel("MasterModelSelData").materialGroup4DataAccess != "*") {
				s = s + "and MaterialGroup4Dac eq '" + sap.ui.getCore().getModel("MasterModelSelData").materialGroup4DataAccess + "'";
			}
			s = s +
				"&$expand=navToReturnHeader,navToReturnStatus,navToReturnItems,navToReturnDocDetails,navToExchangeHeader,navToExchangeStatus,navToExchangeItems,navToExchangeDocDetails";
			var r = this;
			var n = encodeURI("/masterDetailsSet");
			var l = new i("/DKSHODataService/sap/opu/odata/sap/ZDKSH_CC_TRACK_RETURN_ORDER_SRV/");
			var o = new sap.m.BusyDialog;
			o.open();
			l.read(n, {
				async: true,
				urlParameters: s,
				success: function (e, t) {
					o.close();
					var s = e.results[0].navToReturnHeader.results[0].CreationDate;
					if (s) {
						var i = s.slice(0, 4);
						var n = s.slice(4, 6) - 1;
						var l = s.slice(6, 8);
					}
					var T = e.results[0].navToReturnHeader.results[0].CreationTime;
					if (T) {
						var u = T.slice(0, 2);
						var D = T.slice(2, 4);
						var m = T.slice(4, 6);
					}
					if (s !== null) {
						e.results[0].navToReturnHeader.results[0].CreatedDateTime = new Date(i, n, l, u, D, m);
					} else {
						e.results[0].navToReturnHeader.results[0].CreatedDateTime = null;
					}
					e.results[0].navToReturnHeader.results[0].CreatedDateTime = a.dateTimeFormat(e.results[0].navToReturnHeader.results[0].CreatedDateTime);
					var c = new sap.ui.model.json.JSONModel({
						results: e.results[0]
					});
					r.getView().setModel(c, "detailsDataModel");
					r.getSummaryModel(e);
					r.getOrderItems(e);
					r.getTrackingDetails(e);
				},
				error: function (e) {
					o.close();
					var t = new sap.ui.model.json.JSONModel({});
					r.getView().setModel(t, "detailsDataModel");
					var a = new sap.ui.model.json.JSONModel({});
					r.getView().setModel(a, "summaryModel");
					var s = new sap.ui.model.json.JSONModel({});
					r.getView().setModel(s, "trackingModel");
					var i = new sap.ui.model.json.JSONModel({});
					r.getView().setModel(i, "OrderListSet");
					var n = "";
					n = "Error in retrieving Details";
					r.errorMsg(n);
				}
			});
		},
		getSummaryModel: function (e) {
			var t = new sap.ui.model.json.JSONModel({
				returns: e.results[0].navToReturnHeader.results[0],
				exchange: e.results[0].navToExchangeHeader.results[0]
			});
			this.getView().setModel(t, "summaryModel");
		},
		getTrackingDetails: function (e) {
			var t = new sap.ui.model.json.JSONModel({
				returns: [],
				exchange: []
			});
			this.getView().setModel(t, "trackingModel");
			var a = e.results[0].navToReturnStatus.results;
			for (var s = 0; s < a.length; s++) {
				t.getData().returns.unshift(a[s]);
			}
			if (t.getData().returns[0].HdrStatCode == "C") {
				t.getData().returns.pop();
				t.getData().returns.pop();
			}
			if (t.getData().returns[1] && t.getData().returns[1].HdrStatCode == "G") t.getData().returns.pop();
			if (e.results[0].navToExchangeStatus && e.results[0].navToExchangeStatus.results.length > 0) {
				var r = e.results[0].navToExchangeStatus.results;
				for (var i = 0; i < r.length; i++) {
					t.getData().exchange.unshift(r[i]);
				}
				if (t.getData().exchange[0].HdrStatCode == "X") {
					t.getData().exchange.pop();
					t.getData().exchange.pop();
					t.getData().exchange.pop();
				}
				if (t.getData().exchange[1] && t.getData().exchange[1].HdrStatDesc.toLowerCase() == "customer cancellation") {
					t.getData().exchange.pop();
					t.getData().exchange.pop();
				}
			}
			t.refresh();
		},
		getOrderItems: function (e) {
			var t = [],
				a = 0,
				s = [],
				r = 0;
			var i, n;
			if (e.results[0].navToReturnItems.results !== undefined) {
				for (var l = 0; l < e.results[0].navToReturnItems.results.length; l++) {
					var o = e.results[0].navToReturnItems.results[l];
			// [-]delete - DFCT0013981(STRY0015850)
			//		if (o.Blur == "B") {
			//			t.push({
			//				Blur: o.Blur + "",
			//				ItemDesc: "@@@@@@@@@ @@@@"
			//			});
			//		} else {
						t.push({
							Blur: o.Blur + "",
							RejDesc: o.ItemStatDesc,
							ItemCategoryDesc: o.ItemCategoryDesc,
							ItemDesc: o.MaterialDescription,
							Material: o.Material,
							SalesUnit: o.SalesUnit,
							ItemCategory: o.ItemCategory,
							GrossAmount: parseFloat(o.GrossAmount ? o.GrossAmount.replace(",", "") : "0").toFixed(2),
							Discount: o.Discount,
							Tax: parseFloat(o.Tax ? o.Tax.replace(",", "") : "0").toFixed(2),
							NetItemWorth: parseFloat(o.NetItemWorth ? o.NetItemWorth.replace(",", "") : "0").toFixed(2),
							Quantity: parseFloat(o.Quantity ? o.Quantity.replace(",", "") : "0").toFixed(3),
							Currency: o.Currency,
							UnitPrice: o.UnitPrice,
							ItemStatusDesc: o.ItemStatusDesc,
							RejectionReasonDesc: o.RejectionReasonDesc
						});
			//		}
			//[-] end delete - DFCT0013981(STRY0015850)
					if (o.Blur != "B" && o.ItemTextEdit) t[l].action = o.ItemTextEdit.split("|");
				//[+] delete - STRY0015850
				//	if (o.Blur == "B") i = "B";
				//[+] end delete - STRY0015850
				//[+] add - STRY0015850
					if(i !== "B"  ) i = o.Blur;
				//[+] end add - STRY0015850
					a = a + parseFloat(o.NetItemWorth);
					var T = o.Currency;
				}
			}
			a = parseFloat(a).toFixed(2);
			if (e.results[0].navToExchangeItems.results !== undefined) {
				for (var l = 0; l < e.results[0].navToExchangeItems.results.length; l++) {
					var o = e.results[0].navToExchangeItems.results[l];
				// [-]delete - DFCT0013981(STRY0015850)	
				//	if (o.Blur == "B") {
				//		s.push({
				//			Blur: o.Blur + "",
				//			ItemDesc: "@@@@@@@@@ @@@@"
				//		});
				//	} else {
						s.push({
							Blur: o.Blur + "",
							RejDesc: o.ItemStatDesc,
							ItemCategoryDesc: o.ItemCategoryDesc,
							ItemDesc: o.MaterialDescription,
							Material: o.Material,
							SalesUnit: o.SalesUnit,
							ItemCategory: o.ItemCategory,
							GrossAmount: parseFloat(o.GrossAmount ? o.GrossAmount.replace(",", "") : "0").toFixed(2),
							Discount: o.Discount,
							Tax: parseFloat(o.Tax ? o.Tax.replace(",", "") : "0").toFixed(2),
							NetItemWorth: parseFloat(o.NetItemWorth ? o.NetItemWorth.replace(",", "") : "0").toFixed(2),
							Quantity: parseFloat(o.Quantity ? o.Quantity.replace(",", "") : "0").toFixed(3),
							Currency: o.Currency,
							UnitPrice: o.UnitPrice,
							ItemStatusDesc: o.ItemStatusDesc,
							RejectionReasonDesc: o.RejectionReasonDesc
						});
				//	} end delete - DFCT0013981(STRY0015850)
					if (o.Blur != "B" && o.ItemTextEdit) s[l].action = o.ItemTextEdit.split("|");
				//[+] delete - STRY0015850	
				//	if (o.Blur == "B") n = "B";
				//[+] end delete - STRY0015850
				//[+] add - STRY0015850
					if ( n !== "B" ) n = o.Blur;
				//[+] end add - STRY0015850
					r = r + parseFloat(o.NetItemWorth);
					var T = o.Currency;
				}
			}
			r = parseFloat(r).toFixed(2);
			var u = new sap.ui.model.json.JSONModel({
				items: {
					returns: t,
					exchange: s
				}
			});
			u.getData().returnTotal = a;
			u.getData().exchangeTotal = r;
			u.getData().currency = T;
			u.getData().returnsBlur = i;
			u.getData().excBlur = n;
			u.getData().returnLength = e.results[0].navToReturnItems.results.length;
			u.getData().exchangeLength = e.results[0].navToExchangeItems.results.length;
			u.refresh();
			this.getView().setModel(u, "OrderListSet");
		},
		onFullscreen: function (e) {
			var t = this.getView().getParent().getParent();
			if (e.getParameter("pressed")) {
				t.setMode(sap.m.SplitAppMode.HideMode);
				var a = this.i18nModel.getProperty("fullscreenOnText");
				sap.m.MessageToast.show(a);
			} else {
				t.setMode(sap.m.SplitAppMode.ShowHideMode);
				var s = this.i18nModel.getProperty("fullscreenOff");
				sap.m.MessageToast.show(s);
			}
		},
		onNavBackMaster: function () {
			var e = sap.ui.core.UIComponent.getRouterFor(this);
			e.navTo("master", true);
		},
		onAfterRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
			this.getView().byId("idTimeline").setVisible(false);
			this.getView().byId("idTimeline").setVisible(true);
		},
		errorMsg: function (e) {
			sap.m.MessageBox.show(e, {
				styleClass: "sapUiSizeCompact",
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Error",
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function (e) {}
			});
		},
		handleIconTabSelect: function (e) {},
		readTrackingDetailsTabData: function (e) {
			var t = this;
			var s = a.stringDateTimeConvert(e.NAV_MASTTOHEADER.results[0].PODate, "000000");
			var r = "";
			var i = "";
			if (s !== "" && s !== undefined && s !== null) {
				r = s;
				i = "PO Date: " + r;
			}
			var n = a.stringDateTimeConvert(e.NAV_MASTTOHEADER.results[0].SOCreDate, e.NAV_MASTTOHEADER.results[0].SOCreTime);
			var l = "";
			if (n !== "" && n !== undefined && n !== null) {
				l = (i !== "" ? "\n" : "") + ("SO Date: " + n);
			}
			var o = "";
			var T = "";
			var u = "";
			var D = [{
				SDBlockDate: "",
				SDBlockTime: "",
				SDReleaseDate: "",
				SDReleaseTime: "",
				DODate: "",
				DOTime: "",
				PGIDate: "",
				PGITime: "",
				InvoiceDate: "",
				InvoiceTime: "",
				DispatchDate: "",
				DispatchTime: "",
				ShipmentDate: "",
				ShipmentTime: "",
				CustomerReceiptDate: "",
				CustomerReceiptTime: "",
				CustomerRejectDate: "",
				CustomerRejectTime: ""
			}];
			if (e.NAV_MASTTOITEM.results !== undefined) {
				for (var m = 0; m < e.NAV_MASTTOITEM.results.length; m++) {
					u = e.NAV_MASTTOITEM.results[m].Delivery;
					if (e.NAV_MASTTOITEM.results[m].ShedLineDelBDate !== "") {
						if (D[0].SDBlockDate === "") {
							D[0].SDBlockDate = parseInt(e.NAV_MASTTOITEM.results[m].ShedLineDelBDate);
							D[0].SDBlockTime = parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelReDate);
						} else {
							var c = Math.max(D[0].SDBlockDate, parseInt(e.NAV_MASTTOITEM.results[m].ShedLineDelBDate));
							if (c !== D[0].SDBlockDate) {
								D[0].SDBlockDate = parseInt(e.NAV_MASTTOITEM.results[m].ShedLineDelBDate);
								D[0].SDBlockTime = parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelReDate);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].ShedLineDelBDate)) {
								var d = Math.max(D[0].SDBlockTime, parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelReDate));
								if (d !== D[0].SDBlockTime) {
									D[0].SDBlockTime = parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelReDate);
								}
							}
						}
					}
					if (e.NAV_MASTTOITEM.results[m].ShedLinedelRelDate !== "") {
						if (D[0].SDReleaseDate === "") {
							D[0].SDReleaseDate = parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelRelDate);
							D[0].SDReleaseTime = parseInt(e.NAV_MASTTOITEM.results[m].ShedLineRelTime);
						} else {
							var c = Math.max(D[0].SDReleaseDate, parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelRelDate));
							if (c !== D[0].SDReleaseDate) {
								D[0].SDReleaseDate = parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelRelDate);
								D[0].SDReleaseTime = parseInt(e.NAV_MASTTOITEM.results[m].ShedLineRelTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].ShedLinedelRelDate)) {
								var d = Math.max(D[0].SDReleaseTime, parseInt(e.NAV_MASTTOITEM.results[m].ShedLineRelTime));
								if (d !== D[0].SDReleaseTime) {
									D[0].SDReleaseTime = parseInt(e.NAV_MASTTOITEM.results[m].ShedLineRelTime);
								}
							}
						}
					}
					if (e.NAV_MASTTOITEM.results[m].DoDate !== "") {
						if (D[0].DODate === "") {
							D[0].DODate = parseInt(e.NAV_MASTTOITEM.results[m].DoDate);
							D[0].DOTime = parseInt(e.NAV_MASTTOITEM.results[m].DoTime);
						} else {
							var c = Math.max(D[0].DODate, parseInt(e.NAV_MASTTOITEM.results[m].DoDate));
							if (c !== D[0].DODate) {
								D[0].DODate = parseInt(e.NAV_MASTTOITEM.results[m].DoDate);
								D[0].DOTime = parseInt(e.NAV_MASTTOITEM.results[m].DoTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].DoDate)) {
								var d = Math.max(D[0].DOTime, parseInt(e.NAV_MASTTOITEM.results[m].DoTime));
								if (d !== D[0].DOTime) {
									D[0].DOTime = parseInt(e.NAV_MASTTOITEM.results[m].DoTime);
								}
							}
						}
					}
					if (e.NAV_MASTTOITEM.results[m].PgiDate !== "") {
						if (D[0].PGIDate === "") {
							D[0].PGIDate = parseInt(e.NAV_MASTTOITEM.results[m].PgiDate);
							D[0].PGITime = parseInt(e.NAV_MASTTOITEM.results[m].PgiTime);
						} else {
							var c = Math.max(D[0].PGIDate, parseInt(e.NAV_MASTTOITEM.results[m].PgiDate));
							if (c !== D[0].PGIDate) {
								D[0].PGIDate = parseInt(e.NAV_MASTTOITEM.results[m].PgiDate);
								D[0].PGITime = parseInt(e.NAV_MASTTOITEM.results[m].PgiTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].PgiDate)) {
								var d = Math.max(D[0].PGITime, parseInt(e.NAV_MASTTOITEM.results[m].PgiTime));
								if (d !== D[0].PGITime) {
									D[0].PGITime = parseInt(e.NAV_MASTTOITEM.results[m].PgiTime);
								}
							}
						}
					}
					if (e.NAV_MASTTOITEM.results[m].InvCreDate !== "") {
						if (D[0].InvoiceDate === "") {
							D[0].InvoiceDate = parseInt(e.NAV_MASTTOITEM.results[m].InvCreDate);
							D[0].InvoiceTime = parseInt(e.NAV_MASTTOITEM.results[m].InvCreTime);
						} else {
							var c = Math.max(D[0].InvoiceDate, parseInt(e.NAV_MASTTOITEM.results[m].InvCreDate));
							if (c !== D[0].InvoiceDate) {
								D[0].InvoiceDate = parseInt(e.NAV_MASTTOITEM.results[m].InvCreDate);
								D[0].InvoiceTime = parseInt(e.NAV_MASTTOITEM.results[m].InvCreTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].InvCreDate)) {
								var d = Math.max(D[0].InvoiceTime, parseInt(e.NAV_MASTTOITEM.results[m].InvCreTime));
								if (d !== D[0].InvoiceTime) {
									D[0].InvoiceTime = parseInt(e.NAV_MASTTOITEM.results[m].InvCreTime);
								}
							}
						}
					}
					var M = "";
					var p = e.NAV_MASTTOITEM.results[m].ShipNo;
					if (e.NAV_MASTTOITEM.results[m].PackDate !== "") {
						if (D[0].DispatchDate === "") {
							D[0].DispatchDate = parseInt(e.NAV_MASTTOITEM.results[m].PackDate);
							D[0].DispatchTime = parseInt(e.NAV_MASTTOITEM.results[m].PackTime);
						} else {
							var c = Math.max(D[0].DispatchDate, parseInt(e.NAV_MASTTOITEM.results[m].PackDate));
							if (c !== D[0].DispatchDate) {
								D[0].DispatchDate = parseInt(e.NAV_MASTTOITEM.results[m].PackDate);
								D[0].DispatchTime = parseInt(e.NAV_MASTTOITEM.results[m].PackTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].PackDate)) {
								var d = Math.max(D[0].DispatchTime, parseInt(e.NAV_MASTTOITEM.results[m].PackTime));
								if (d !== D[0].DispatchTime) {
									D[0].DispatchTime = parseInt(e.NAV_MASTTOITEM.results[m].PackTime);
								}
							}
						}
					}
					if (e.NAV_MASTTOITEM.results[m].ShipCreDate !== "") {
						if (D[0].ShipmentDate === "") {
							D[0].ShipmentDate = parseInt(e.NAV_MASTTOITEM.results[m].ShipCreDate);
							D[0].ShipmentTime = parseInt(e.NAV_MASTTOITEM.results[m].ShipCreTime);
						} else {
							var c = Math.max(D[0].ShipmentDate, parseInt(e.NAV_MASTTOITEM.results[m].ShipCreDate));
							if (c !== D[0].ShipmentDate) {
								D[0].ShipmentDate = parseInt(e.NAV_MASTTOITEM.results[m].ShipCreDate);
								D[0].ShipmentTime = parseInt(e.NAV_MASTTOITEM.results[m].ShipCreTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].ShipCreDate)) {
								var d = Math.max(D[0].ShipmentTime, parseInt(e.NAV_MASTTOITEM.results[m].ShipCreTime));
								if (d !== D[0].ShipmentTime) {
									D[0].ShipmentTime = parseInt(e.NAV_MASTTOITEM.results[m].ShipCreTime);
								}
							}
						}
					}
					var S = "";
					if (e.NAV_MASTTOITEM.results[m].PodDate !== "") {
						if (D[0].CustomerReceiptDate === "") {
							D[0].CustomerReceiptDate = parseInt(e.NAV_MASTTOITEM.results[m].PodDate);
							D[0].CustomerReceiptTime = parseInt(e.NAV_MASTTOITEM.results[m].PodTime);
						} else {
							var c = Math.max(D[0].CustomerReceiptDate, parseInt(e.NAV_MASTTOITEM.results[m].PodDate));
							if (c !== D[0].CustomerReceiptDate) {
								D[0].CustomerReceiptDate = parseInt(e.NAV_MASTTOITEM.results[m].PodDate);
								D[0].CustomerReceiptTime = parseInt(e.NAV_MASTTOITEM.results[m].PodTime);
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].PodDate)) {
								var d = Math.max(D[0].CustomerReceiptTime, parseInt(e.NAV_MASTTOITEM.results[m].PodTime));
								if (d !== D[0].CustomerReceiptTime) {
									D[0].CustomerReceiptTime = parseInt(e.NAV_MASTTOITEM.results[m].PodTime);
								}
							}
						}
					}
					if (e.NAV_MASTTOITEM.results[m].PodRejDate !== "") {
						if (D[0].CustomerRejectDate === "") {
							D[0].CustomerRejectDate = parseInt(e.NAV_MASTTOITEM.results[m].PodRejDate);
							D[0].CustomerRejectTime = e.NAV_MASTTOITEM.results[m].PodRejTime;
						} else {
							var c = Math.max(D[0].CustomerRejectDate, parseInt(e.NAV_MASTTOITEM.results[m].PodRejDate));
							if (c !== D[0].CustomerRejectDate) {
								D[0].CustomerRejectDate = parseInt(e.NAV_MASTTOITEM.results[m].PodRejDate);
								D[0].CustomerRejectTime = e.NAV_MASTTOITEM.results[m].PodRejTime;
							} else if (c === parseInt(e.NAV_MASTTOITEM.results[m].PodRejDate)) {
								var d = Math.max(D[0].CustomerRejectTime, parseInt(e.NAV_MASTTOITEM.results[m].PodRejTime));
								if (d !== D[0].CustomerRejectTime) {
									D[0].CustomerRejectTime = parseInt(e.NAV_MASTTOITEM.results[m].PodRejTime);
								}
							}
						}
					}
				}
				var I = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy HH:mm:ss"
				});
				var g = a.stringDateTimeConvert(D[0].SDBlockDate.toString(), D[0].SDBlockTime.toString());
				if (g !== "" && g !== undefined && g !== null) {
					if (T !== "") {
						T = T + "\n SD Block Date: " + g;
					} else {
						T = "SD Block Date: " + g;
					}
				}
				var A = a.stringDateTimeConvert(D[0].SDReleaseDate.toString(), D[0].SDReleaseTime.toString());
				if (A !== "" && A !== undefined && A !== null) {
					if (T !== "") {
						T = T + "\n SD Release Date: " + A;
					} else {
						T = "SD Release Date: " + A;
					}
				}
				var f = a.stringDateTimeConvert(e.NAV_MASTTOHEADER.results[0].CredBlkDate, e.NAV_MASTTOHEADER.results[0].CredBlkTime);
				if (f !== "" && f !== undefined && f !== null) {
					if (T !== "") {
						T = T + "\n FI Block Date: " + f;
					} else {
						T = "FI Block Date: " + f;
					}
				}
				var h = a.stringDateTimeConvert(e.NAV_MASTTOHEADER.results[0].CredRelDate, e.NAV_MASTTOHEADER.results[0].CredRelTime);
				if (h !== "" && h !== undefined && h !== null) {
					if (T !== "") {
						T = T + "\n FI Release Date: " + h;
					} else {
						T = "FI Release Date: " + h;
					}
				}
				var v = a.stringDateTimeConvert(D[0].DODate.toString(), D[0].DOTime.toString());
				if (v !== "" && v !== undefined && v !== null) {
					if (T !== "") {
						T = T + "\n DO Date: " + v;
					} else {
						T = "DO Date: " + v;
					}
				}
				var O = a.stringDateTimeConvert(D[0].PGIDate.toString(), D[0].PGITime.toString());
				if (O !== "" && O !== undefined && O !== null) {
					if (T !== "") {
						T = T + "\n PGI Date: " + O;
					} else {
						T = "PGI Date: " + O;
					}
				}
				var R = a.stringDateTimeConvert(D[0].InvoiceDate.toString(), D[0].InvoiceTime.toString());
				if (R !== "" && R !== undefined && R !== null) {
					if (T !== "") {
						T = T + "\n Invoice Date: " + R;
					} else {
						T = "Invoice Date: " + R;
					}
				}
				var E = a.stringDateTimeConvert(D[0].DispatchDate.toString(), D[0].DispatchTime.toString());
				if (E !== "" && E !== undefined && E !== null) {
					if (M !== "") {
						M = M + "\n Dispatch Date: " + E;
					} else {
						M = "Dispatch Date: " + E;
					}
				}
				var V = a.stringDateTimeConvert(D[0].ShipmentDate.toString(), D[0].ShipmentTime.toString());
				if (V !== "" && V !== undefined && V !== null) {
					if (M !== "") {
						M = M + "\n Shipment Date: " + V;
					} else {
						M = "Shipment Date: " + V;
					}
				}
				var C = a.stringDateTimeConvert(D[0].CustomerReceiptDate.toString(), D[0].CustomerReceiptTime.toString());
				if (C !== "" && C !== undefined && C !== null) {
					if (S !== "") {
						S = S + "\n Customer Receipt Date: " + C;
					} else {
						S = "Customer Receipt Date: " + C;
					}
				}
				var N = a.stringDateTimeConvert(D[0].CustomerRejectDate.toString(), D[0].CustomerRejectTime.toString());
				if (N !== "" && N !== undefined && N !== null) {
					if (S !== "") {
						S = S + "\n Customer Reject Date: " + N;
					} else {
						S = "Customer Reject Date: " + N;
					}
				}
			}
			var _ = e.NAV_MASTTOHEADER.results[0].HdrStatus;
			var P = a.forLevelCheckStataus(_);
			this.masterData = [{
				HeadingTitle: t.i18nModel.getProperty("orderingTrackDet"),
				ValueState: a.statusFieldTrackingValueStateDetails(1, P, _),
				Status: a.OrderingStatusFieldTracking(_, P),
				RequestId: "12345",
				Clickable: P >= 1 ? true : false,
				Icon: "sap-icon://customer-order-entry",
				Dates: i + l,
				LevelCurrent: 1,
				VisibleField: a.visibleBasedOnStatusIfTopRejectDontShowBottomValue(1, P, _)
			}, {
				HeadingTitle: t.i18nModel.getProperty("processingTrackDet"),
				ValueState: a.statusFieldTrackingValueStateDetails(2, P, _),
				Status: a.processingStatusFieldTracking(_, P),
				RequestId: "12346",
				Clickable: P >= 2 ? true : false,
				Icon: "sap-icon://add-product",
				Dates: T,
				LevelCurrent: 2,
				VisibleField: a.visibleBasedOnStatusIfTopRejectDontShowBottomValue(2, P, _)
			}, {
				HeadingTitle: t.i18nModel.getProperty("deliveryTrackDet"),
				ValueState: a.statusFieldTrackingValueStateDetails(3, P, _),
				Status: a.deliveryStatusFieldTracking(_, P),
				Clickable: P >= 3 ? true : false,
				RequestId: "12347",
				Icon: "sap-icon://shipping-status",
				Dates: M,
				LevelCurrent: 3,
				VisibleField: a.visibleBasedOnStatusIfTopRejectDontShowBottomValue(3, P, _)
			}, {
				HeadingTitle: t.i18nModel.getProperty("customerConfirmationTrackDet"),
				ValueState: a.statusFieldTrackingValueStateDetails(4, P, _),
				Status: a.customerConfirmationStatusFieldTracking(_, P),
				RequestId: "12347",
				Clickable: P >= 4 ? true : false,
				Icon: "sap-icon://accept",
				Dates: S,
				LevelCurrent: 4,
				VisibleField: a.visibleBasedOnStatusIfTopRejectDontShowBottomValue(4, P, _)
			}];
			var x = new sap.ui.model.json.JSONModel({
				results: this.masterData
			});
			this.getView().byId("idTimeline").setModel(x, "StatusModelSet");
		},
		checkDateandTime: function (e, t) {
			if (e === undefined || e === null || e.trim() === "") {
				return "";
			} else if (t === undefined || t === null || t.trim() === "") {
				if (e.trim().length === 8) {
					var a = Date.UTC(e.trim().substr(0, 4), e.trim().substr(4, 2) - 1, e.trim().substr(6, 2), 0, 0, 0);
					return a;
				}
			} else if (e !== null && e.trim() !== "" && t.trim() !== null && t.trim() !== "") {
				if (e.trim().length === 8 && t.trim().length >= 4) {
					if (t === "000000") {
						var a = Date.UTC(e.trim().substr(0, 4), e.trim().substr(4, 2) - 1, e.trim().substr(6, 2), 0, 0, 0);
						return a;
					} else {
						var a = Date.UTC(e.trim().substr(0, 4), e.trim().substr(4, 2) - 1, e.trim().substr(6, 2), t.trim().substr(0, 2), t.trim().substr(
							2, 2), t.trim().substr(4, 2));
						return a;
					}
				} else {
					return "";
				}
			}
		}
	});
});