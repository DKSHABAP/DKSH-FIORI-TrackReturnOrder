sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "sap/ui/model/Filter",
	"sap/ui/model/Sorter", "sap/ui/model/FilterOperator", "sap/m/GroupHeaderListItem", "sap/ui/Device", "sap/ui/core/Fragment",
	"../model/formatter", "sap/ui/core/format/DateFormat", "sap/ui/model/odata/ODataModel", "sap/m/MessageBox"
], function (e, t, a, s, r, i, o, n, l, u, c, d, m) {
	"use strict";
	return e.extend("dksh.connectclient.TrackReturnOrder.controller.Master", {
		formatter: u,
		onInit: function () {
			this.getRouter().getRoute("master").attachPatternMatched(this._onObjectMatched, this);
			this.getLoggedInUserDetail()
		},
		_onObjectMatched: function (e) {
			if (e.getParameter("name") === "master") {
				if (sap.ui.Device.system.phone) {
					var t = this.getView().byId("ID_MASTER_LIST").getModel("MasterListSet");
					if (t !== undefined) {
						var a = t.getData().results;
						if (a.length === 1) {
							var s = this.getView().byId("ID_MASTER_LIST");
							s.getItems()[0].setSelected(false);
						}
					}
				}
			}
		},
		getLoggedInUserDetail: function () {
			var e;
			var t = this;
			$.ajax({
				type: "GET",
				async: false,
				url: "/services/userapi/currentUser",
				contentType: "application/scim+json",
				success: function (a, s, r) {
					var i = new sap.ui.model.json.JSONModel(a);
					t.getView().setModel(i, "userapi");
					e = t.getView().getModel("userapi").getData().name;
					t.userID = e;
					t.getLoggedInUserName(e);
				},
				error: function (e) {
					sap.m.MessageBox.error("Could not retrieve logged in user details");
				},
				complete: function (e) {}
			});
			return e;
		},
		getLoggedInUserName: function (e) {
			if (!this.getView().getModel()) {
				var oModel = {
					returnOrder: "",
					CustomerNo: "",
					Bname: "",
					RefInvoice: "",
					CustomerName: "",
					CustomerPoNumber: "",
					SelStatus: undefined,
					StartDate: null,
					EndDate: null
				};
				this.getView().setModel(new t(oModel));
			}
			var oDRS = u.getDefaultDateRangeSelectionValues();
			// Start: STRY0014353 - Incident: Track Return Order (data access)
			this.getView().setModel(new t(), "oLoggedInUserDetailModel");
			this.getView().getModel("oLoggedInUserDetailModel").loadData("/DKSHJavaService2/userDetails/findAllRightsForUserInDomain/" +
				e + "&cc").then(function (oRes) {
				var oData = this.getView().getModel("oLoggedInUserDetailModel").getData();
				if (oData) {
					this.custAttribute = true;
					this.salesOrgDataAccess = (oData.ATR01) ? oData.ATR01 : "No Access";
					this.distrChannelDataAccess = (oData.ATR02) ? oData.ATR02 : "No Access";
					this.divisionDataAccess = (oData.ATR03) ? oData.ATR03 : "No Access";
					this.materialGroupDataAccess = (oData.ATR04) ? oData.ATR04 : "No Access";
					this.materialGroup4DataAccess = (oData.ATR05) ? oData.ATR05 : "No Access";
					this.custCodeDataAccess = (oData.ATR06) ? oData.ATR06 : "No Access";
					var r = u.DateConversion(oDRS.secondDateValue);
					var i = u.DateConversion(oDRS.dateValue);
					var o = "CreationDate le datetime'" + r + "' and CreationDate ge datetime'" + i + "'";
					// Set defaults to the search fragment model properties
					// if(oData.ATR01)	oModel.SalesOrg = oData.ATR01;
					// if(oData.ATR02)	oModel.DistChan = oData.ATR02;
					// if(oData.ATR03)	oModel.Division = oData.ATR02;
					oModel.StartDate = oDRS.dateValue;
					oModel.EndDate = oDRS.secondDateValue;
					this.readMasterListData(o, "");
				}
			}.bind(this)).catch(function (oErr) {});
			// var t = this;
			// var a = new sap.ui.model.json.JSONModel;
			// t.getView().setModel(a, "oLoggedInUserDetailModel");
			// a.loadData("/IDPService/service/scim/Users/" + e, true, "GET", false, false);
			// a.attachRequestCompleted(function (e) {
			// 	var a = e.getSource().getData()["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"];
			// 	if (a != undefined) {
			// 		t.custAttribute = true;
			// 		if (a.attributes[0] !== undefined) {
			// 			t.salesOrgDataAccess = a.attributes[0].value
			// 		} else {
			// 			t.salesOrgDataAccess = "No Access"
			// 		}
			// 		if (a.attributes[2] !== undefined) {
			// 			t.distrChannelDataAccess = a.attributes[2].value
			// 		} else {
			// 			t.distrChannelDataAccess = "No Access"
			// 		}
			// 		if (a.attributes[3] !== undefined) {
			// 			t.divisionDataAccess = a.attributes[3].value
			// 		} else {
			// 			t.divisionDataAccess = "No Access"
			// 		}
			// 		if (a.attributes[4] !== undefined) {
			// 			t.materialGroupDataAccess = a.attributes[4].value
			// 		} else {
			// 			t.materialGroupDataAccess = "No Access"
			// 		}
			// 		if (a.attributes[5] !== undefined) {
			// 			t.materialGroup4DataAccess = a.attributes[5].value
			// 		} else {
			// 			t.materialGroup4DataAccess = "No Access"
			// 		}
			// 		if (a.attributes[6] !== undefined) {
			// 			t.custCodeDataAccess = a.attributes[6].value
			// 		} else {
			// 			t.custCodeDataAccess = "No Access"
			// 		}
			// 		var s = new Date;
			// 		var r = u.DateConversion(new Date(s.getFullYear(), s.getMonth(), s.getDate()));
			// 		var i = u.DateConversion(new Date(s.getFullYear(), s.getMonth(), s.getDate() - 7));
			// 		var o = "CreationDate le datetime'" + r + "' and CreationDate ge datetime'" + i + "'";
			// 		t.readMasterListData(o, "")
			// 	}
			// });
			// a.attachRequestFailed(function (e) {})
			// End: STRY0014353 - Incident: Track Return Order (data access)
		},
		readMasterListData: function (e, t) {
			var a = new sap.m.BusyDialog();
			if (this.custAttribute) {
				a.open();
				var s = this;
				if (!e) var e;
				var r = new d("/DKSHODataService/sap/opu/odata/sap/ZDKSH_CC_TRACK_RETURN_ORDER_SRV/");
				this.setModel(r, "oMasterDataModel");
				var i = "/masterDetailsSet";
				if (s.salesOrgDataAccess && s.salesOrgDataAccess != "No Access" && s.salesOrgDataAccess !== "*") {
					if (e !== "") {
						e = e + " and SalesOrgDac eq '" + s.salesOrgDataAccess + "'";
					} else {
						e = "SalesOrgDac eq '" + s.salesOrgDataAccess + "'";
					}
				}
				if (s.custCodeDataAccess && s.custCodeDataAccess !== "No Access" && s.custCodeDataAccess !== "*") {
					if (e !== "") {
						e = e + " and CustomerCodeDac eq '" + s.custCodeDataAccess + "'";
					} else {
						e = "CustomerCodeDac eq '" + s.custCodeDataAccess + "'";
					}
				}
				if (s.distrChannelDataAccess && s.distrChannelDataAccess !== "No Access" && s.distrChannelDataAccess !== "*") {
					if (e !== "") {
						e = e + " and DistChannelDac eq '" + s.distrChannelDataAccess + "'";
					} else {
						e = "DistChannelDac eq '" + s.distrChannelDataAccess + "'";
					}
				}
				if (s.divisionDataAccess && s.divisionDataAccess !== "No Access" && s.divisionDataAccess !== "*") {
					if (e !== "") {
						e = e + " and DivisionDac eq '" + s.divisionDataAccess + "'";
					} else {
						e = "DivisionDac eq '" + s.divisionDataAccess + "'";
					}
				}
				if (s.materialGroupDataAccess && s.materialGroupDataAccess !== "No Access" && s.materialGroupDataAccess !== "*") {
					if (e !== "") {
						e = e + " and MaterialGroupDac eq '" + s.materialGroupDataAccess + "'";
					} else {
						e = "MaterialGroupDac eq '" + s.materialGroupDataAccess + "'";
					}
				}
				if (s.materialGroup4DataAccess && s.materialGroup4DataAccess !== "No Access" && s.materialGroup4DataAccess !== "*") {
					if (e !== "") {
						e = e + " and MaterialGroup4Dac eq '" + s.materialGroup4DataAccess + "'";
					} else {
						e = "MaterialGroup4Dac eq '" + s.materialGroup4DataAccess + "'";
					}
				}
				if (e) 
					i = i + "?$filter=" + e;
				r.read(i, {
					async: true,
					success: function (e, t) {
						a.close();
						for (var r = 0; r < e.results.length; r++) {
							var i = e.results[r].CreationDate.split("T")[0].split("-");
							i[1] = i[1] - 1;
							var o = e.results[r].CreationTime.split("PT")[1].split("H")[0];
							var n = e.results[r].CreationTime.split("PT")[1].split("H")[1].split("M")[0];
							var l = e.results[r].CreationTime.split("PT")[1].split("H")[1].split("M")[1].split("S")[0];
							if (i !== null) {
								e.results[r].CreatedDateTime = new Date(i[0], i[1], i[2], o, n, l);
							} else {
								e.results[r].CreatedDateTime = null;
							}
							e.results[r].CreatedDateTime = u.dateTimeFormat(e.results[r].CreatedDateTime);
						}
						var c = new sap.ui.model.json.JSONModel({
							results: e.results
						});
						s.getView().setModel(c, "masterDataModel");
						if (e.results.length === 0 && !sap.ui.Device.system.phone) {
							var d = sap.ui.core.UIComponent.getRouterFor(s);
							d.navTo("notFound", true);
							return;
						}
						var m = s.getView().byId("ID_MASTER_LIST").getBinding("items");
						var D = s.i18nModel.getProperty("trackingDetailsMastPageTitle");
						s.getView().byId("ID_MAST_PAGE").setTitle(D + " (" + m.getLength() + ")");
						s.getView().byId("ID_MAST_PAGE").addStyleClass("title sapMIBar-CTX sapMTitle");
						if (s.searchMasterFrag) s.searchMasterFrag.close();
						if (!sap.ui.Device.system.phone) s.handleFirstItemSetSelected();
					},
					error: function (e) {
						a.close();
						var t = "";
						if (e.statusCode === 504) {
							t = "Request timed-out. Please try again!";
							s.errorMsg(t);
						} else {
							this.getView().getModel().refresh();
							// s.errorMsg("Data Not Found");
							if (s.searchMasterFrag) 
								s.searchMasterFrag.close();
							if (!sap.ui.Device.system.phone) {
								var p = sap.ui.core.UIComponent.getRouterFor(this);
								p.navTo("notFound", true);
							}
						}
					}.bind(this)
				});
			}
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
		handleFirstItemSetSelected: function (e) {
			var t = this.getView().byId("ID_MASTER_LIST");
			var a = t.getItems()[0].getBindingContext("masterDataModel").getObject();
			t.getItems()[0].setSelected(true);
			if (this.materialGroupDataAccess) a.materialGroupDataAccess = this.materialGroupDataAccess;
			if (this.materialGroup4DataAccess) a.materialGroup4DataAccess = this.materialGroup4DataAccess;
			sap.ui.getCore().setModel(a, "MasterModelSelData");
			var s = sap.ui.core.UIComponent.getRouterFor(this);
			s.navTo("object", {
				contextPath: a.ReturnOrderNumber
			}, true);
		},
		handleItemPressed: function (e) {
			var t = e.getParameter("listItem").getBindingContext("masterDataModel").getObject();
			if (this.materialGroupDataAccess) t.materialGroupDataAccess = this.materialGroupDataAccess;
			if (this.materialGroup4DataAccess) t.materialGroup4DataAccess = this.materialGroup4DataAccess;
			sap.ui.getCore().setModel(t, "MasterModelSelData");
			var a = sap.ui.core.UIComponent.getRouterFor(this);
			a.navTo("object", {
				contextPath: t.ReturnOrderNumber
			}, true);
		},
		fnGetStatus: function () {
			var e = this;
			var t = new d("/DKSHODataService/sap/opu/odata/sap/ZDKSH_CC_TRACK_RETURN_ORDER_SRV/");
			this.setModel(t, "oFilterModel");
			var a = this.getView().getModel("ZDKSH_CC_TRACK_RETURN_ORDER_SRV");
			t.read("/statusLookupSet", {
				async: true,
				success: function (t, a) {
					var s = new sap.ui.model.json.JSONModel({
						results: t.results
					});
					e.getView().setModel(s, "FilterModel");
				},
				error: function (t) {
					var a = "";
					if (t.statusCode === 504) {
						a = "Request timed-out. Please try again!";
						e.errorMsg(a);
					} else {
						a = JSON.parse(t.responseText);
						a = a.error.message.value;
						e.errorMsg(a);
					}
				}
			});
		},
		onSearchMasterList: function (e) {
			var oModel = this.getView().getModel().getData();
			var oDSR = u.getDefaultDateRangeSelectionValues();
			var t = this;
			if (e.getParameters().refreshButtonPressed) {
				var a = new Date();
				var s = {
					SalesOrder: "",
					CustomerNo: "",
					SelStatus: undefined,
					StartDate: u.DateConversion(oDSR.dateValue),
					EndDate: u.DateConversion(oDSR.secondDateValue)
				};
				var r = JSON.stringify(s);
				this.tempDataFragment = JSON.parse(r);
				oModel.StartDate = oDSR.dateValue;
				oModel.EndDate = oDSR.secondDateValue;
				var i = "CreationDate le datetime'" + s.EndDate + "' and CreationDate ge datetime'" + s.StartDate + "'";
				this.readMasterListData(i, "");
			} else {
				var o = e.getParameters().query;
				var mModel = t.getView().getModel("masterDataModel");
				if (!mModel || mModel.getData().results.length === 0) {
					if (o && o.trim() !== "") {
						var j = "ReturnOrderNumber eq '" + o + "'";
						this.readMasterListData(j, "");
					}
				} else {
					var n = [];
					var l = new sap.ui.model.Filter([new sap.ui.model.Filter("HeaderStatusDesc", sap.ui.model.FilterOperator.Contains, o), new sap.ui
						.model
						.Filter("ConditionGroup5Desc", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model.Filter("ReturnOrderNumber", sap.ui.model
							.FilterOperator.Contains, o), new sap.ui.model.Filter("TotalAmount", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model
						.Filter("ReturnReasonDesc", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model.Filter("RefInvoice", sap.ui.model.FilterOperator
							.Contains, o), new sap.ui.model.Filter("CustomerCode", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model.Filter(
							"CustomerName", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model.Filter("CustomerPoNumber", sap.ui.model.FilterOperator
							.Contains, o), new sap.ui.model.Filter("RefInvoice", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model.Filter(
							"CreationDate", sap.ui.model.FilterOperator.Contains, o), new sap.ui.model.Filter("LinkedExchangeOrder", sap.ui.model.FilterOperator
							.Contains, o)
					]);
					this.oSearchFilters = l;
					var c = [];
					if (this.oFilters && this.oFilters.length > 0) {
						c = this.oFilters;
					}
					var d = new sap.ui.model.Filter(c, false);
					if (c.length > 0) {
						var m = new sap.ui.model.Filter([l, d], true);
						n.push(m);
					} else {
						n.push(l);
					}
					var D = t.getView().byId("ID_MASTER_LIST").getBinding("items");
					D.filter(n);
					var g = t.i18nModel.getProperty("trackingDetailsMastPageTitle");
					t.getView().byId("ID_MAST_PAGE").setTitle(g + " (" + D.getLength() + ")");
					t.getView().byId("ID_MAST_PAGE").addStyleClass("title sapMIBar-CTX sapMTitle");
					if (D.getLength() == 0 && !sap.ui.Device.system.phone) {
						var p = sap.ui.core.UIComponent.getRouterFor(this);
						p.navTo("notFound", true);
						return;
					} else if (o.trim() == "" && !sap.ui.Device.system.phone) {
						this.handleFirstItemSetSelected();
					} else if (D.getLength() > 0 && !sap.ui.Device.system.phone) {
						var h = t.getView().byId("ID_MASTER_LIST");
						var v = this.getView().byId("ID_MASTER_LIST").getItems()[0].getBindingContext("masterDataModel").getObject();
						h.getItems()[0].setSelected(true);
						if (this.materialGroupDataAccess) v.materialGroupDataAccess = this.materialGroupDataAccess;
						if (this.materialGroup4DataAccess) v.materialGroup4DataAccess = this.materialGroup4DataAccess;
						sap.ui.getCore().setModel(v, "MasterModelSelData");
						h.getItems()[0].setSelected(true);
						var p = sap.ui.core.UIComponent.getRouterFor(this);
						p.navTo("object", {
							contextPath: v.ReturnOrderNumber
						}, true);
					}
				}
			}
		},
		handlefilter: function (e) {
			var t = this;
			var a = "";
			if (!this.searchMasterFrag) {
				this.fnGetStatus();
				// this.searchMasterFrag = sap.ui.xmlfragment("dksh.connectclient.TrackReturnOrder.view.SearchMaster", t);
				this.searchMasterFrag = sap.ui.xmlfragment("dksh.connectclient.TrackReturnOrder.Fragments.SearchMaster", t);
				this.getView().addDependent(this.searchMasterFrag);
				var s = {
					SalesOrder: "",
					CustomerNo: "",
					SelStatus: undefined,
					StartDate: null,
					EndDate: null
				};
				a = s;
			} else {
				a = this.searchMasterFrag.getModel().getData();
			}
			// var r = new sap.ui.model.json.JSONModel("FilterModel");
			// var r = new sap.ui.model.json.JSONModel(a);
			var r = this.getView().getModel();
			this.searchMasterFrag.setModel(r);
			var i = JSON.stringify(a);
			this.tempDataFragment = JSON.parse(i);
			if (sap.ui.Device.system.desktop) {
				this.searchMasterFrag.setContentWidth("50%");
			} else {
				this.searchMasterFrag.setContentWidth("100%");
			}
			this.searchMasterFrag.open();
		},
		handleReadAllSOIntial: function () {
			var oModel = this.getView().getModel().getData();
			var oDSR = u.getDefaultDateRangeSelectionValues();
			var e = {
				returnOrder: "",
				CustomerNo: "",
				Bname: "",
				RefInvoice: "",
				CustomerName: "",
				CustomerPoNumber: "",
				SelStatus: undefined,
				StartDate: oDSR.dateValue,
				EndDate: oDSR.secondDateValue
			};
			var t = new sap.ui.model.json.JSONModel(e);
			this.searchMasterFrag.setModel(t);
			var a = JSON.stringify(e);
			this.tempDataFragment = JSON.parse(a);
			var s = new Date();
			var r = u.DateConversion(oDSR.secondDateValue);
			var i = u.DateConversion(oDSR.dateValue);
			oModel.returnOrder = e.returnOrder;
			oModel.CustomerNo = e.CustomerNo;
			oModel.Bname = e.Bname;
			oModel.RefInvoice = e.RefInvoice;
			oModel.CustomerName = e.CustomerName;
			oModel.CustomerPoNumber = e.CustomerPoNumber;
			oModel.SelStatus = e.SelStatus;
			oModel.StartDate = oDSR.dateValue;
			oModel.EndDate = oDSR.secondDateValue;			
			var o = "CreationDate le datetime'" + r + "' and CreationDate ge datetime'" + i + "'";
			this.readMasterListData(o, "");
		},
		handleOkReadSoFilter: function () {
			var oModel = this.getView().getModel().getData();
			var oDSR = u.getDefaultDateRangeSelectionValues();
            var e = "";
			var t = this.searchMasterFrag.getModel().getData();
			if (t.returnOrder && t.returnOrder.trim() !== "") {
				e = "ReturnOrderNumber eq '" + t.returnOrder + "'"
			}
			if (t.CustomerNo) {
				if (e !== "") {
					e = e + " and CustomerCode eq '" + t.CustomerNo + "'";
				} else {
					e = "CustomerCode eq '" + t.CustomerNo + "'";
				}
			}
			if (t.CustomerName) {
				if (e !== "") {
					e = e + " and CustomerName eq '" + t.CustomerName + "'";
				} else {
					e = "CustomerName eq '" + t.CustomerName + "'";
				}
			}
			// [+] Start modification - STRY0015013
			if (t.Bname) {
				if (e !== "") {
					e = e + " and Bname eq '" + t.Bname + "'";
				} else {
					e = "Bname eq '" + t.Bname + "'";
				}
			}

			if (t.RefInvoice) {
				if (e !== "") {
					e = e + " and RefInvoice eq '" + t.RefInvoice + "'";
				} else {
					e = "RefInvoice eq '" + t.RefInvoice + "'";
				}
			}
			// [+] End modification - STRY0015013
			if (t.CustomerPoNumber) {
				if (e !== "") {
					e = e + " and CustomerPoNumber eq '" + t.CustomerPoNumber + "'";
				} else {
					e = "CustomerPoNumber eq '" + t.CustomerPoNumber + "'";
				}
			}
			if (t.StartDate) {
				var a = u.DateConversion(t.StartDate);
				var s = u.DateConversion(t.EndDate);
				if (e !== "") {
					e = e + " and (CreationDate ge datetime'" + a + "' and CreationDate le datetime'" + s + "')";
				} else {
					e = "(CreationDate ge datetime'" + a + "' and CreationDate le datetime'" + s + "')";
				}
			}
			if (t.SelStatus && t.SelStatus.length > 0) {
				var r = t.SelStatus;
				var i = "";
				if (e !== "") {
					for (var o = 0; o < r.length; o++) {
						if (o === r.length - 1)
							i = i + " HeaderStatus eq '" + r[o] + "'";
						else
							i = i + " HeaderStatus eq '" + r[o] + "' or ";
					}
					e = e + " and (" + i + ")";
				} else {
					for (var o = 0; o < r.length; o++) {
						if (o === r.length - 1)
							i = i + " HeaderStatus eq '" + r[o] + "'";
						else
							i = i + " HeaderStatus eq '" + r[o] + "' or ";
					}
					e = i;
				}
			}
			if (e) this.readMasterListData(e, "F");
			else {
				// var n = new Date;
				var a = u.DateConversion(oDSR.secondDateValue);
				var s = u.DateConversion(oDSR.dateValue);
				oModel.StartDate = oDSR.dateValue;
				oModel.EndDate = oDSR.secondDateValue;
				var l = "CreationDate le datetime'" + a + "' and CreationDate ge datetime'" + s + "'";
				this.readMasterListData(l, "");
			}
		},
		handleCancelMasterSearch: function () {
			this.tempDataFragment.StartDate = this.tempDataFragment.StartDate ? new Date(this.tempDataFragment.StartDate) : null;
			this.tempDataFragment.EndDate = this.tempDataFragment.EndDate ? new Date(this.tempDataFragment.EndDate) : null;
			var e = new sap.ui.model.json.JSONModel(this.tempDataFragment);
			this.searchMasterFrag.setModel(e);
			this.searchMasterFrag.close();
		},
		onAfterRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
			this.oModel = this.getView().getModel("TrackingODataModel");
		},
		onLiveChangeSalesOrderFilter: function (e) {
			e.getSource().setValue(e.getParameters().value.trim());
			e.getSource().setTooltip(e.getParameters().value.trim());
		},
		onLiveChangeCustIdFilter: function (e) {
			e.getSource().setValue(e.getParameters().value.trim());
			e.getSource().setTooltip(e.getParameters().value.trim());
		},
		handleBack: function () {
			var e = sap.ushell.Container.getService("CrossApplicationNavigation");
			e.toExternal({
				target: {
					semanticObject: "",
					action: ""
				}
			});
		},
		onChangeDateRange: function (e) {
			if (!e.getParameters().valid) {
				var t = this.searchMasterFrag.getModel().getData();
				t.StartDate = null;
				t.EndDate = null;
				this.searchMasterFrag.getModel().refresh();
				e.getSource().setValue("");
				var a = this.i18nModel.getProperty("enterValidDateRange");
				sap.m.MessageToast.show(a);
			}
		}
	});
});