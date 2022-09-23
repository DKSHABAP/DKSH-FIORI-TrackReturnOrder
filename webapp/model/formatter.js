jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
sap.ui.define([], function () {
	"use strict";
	return {
		concatHdrDateTime: function (e, t) {
			if (t) {
				var r = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy HH:mm:ss"
				});
				var n = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()).toLocaleString();
				return e + " " + r.format(n);
			} else {
				return e;
			}
		},
		dateTimeFormat: function (e) {
			if (e) {
				var t = sap.ca.ui.model.format.DateFormat.getTimeInstance({
					pattern: "dd.MM.yyyy HH:mm:ss"
				});
				if (e.getDate().toString().length === 1) {
					var r = "0" + e.getDate();
				} else {
					var r = e.getDate();
				}
				if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
					var n = "0" + (e.getMonth() + 1);
				} else {
					var n = e.getMonth() + 1;
				}
				if (e.getHours().toString().length === 1) {
					var i = "0" + e.getHours();
				} else {
					var i = e.getHours();
				}
				if (e.getMinutes().toString().length === 1) {
					var s = "0" + e.getMinutes();
				} else {
					var s = e.getMinutes();
				}
				if (e.getSeconds().toString().length === 1) {
					var u = "0" + e.getSeconds();
				} else {
					var u = e.getSeconds();
				}
				var r = e.getFullYear() + "-" + n + "-" + r + "T" + i + ":" + s + ":" + u + ".00+08:00";
				e = new Date(r);
				return t.format(e);
			} else {
				return "";
			}
		},
		valueDateTimeConcat: function (e, t) {
			if (t) {
				var r = t.split(" ");
				var n = r[0].split(".");
				var i = r[1].split(":");
				var s = sap.ca.ui.model.format.DateFormat.getTimeInstance({
					pattern: "dd.MM.yyyy HH:mm:ss"
				});
				var u = n[2] + "-" + n[1] + "-" + n[0] + "T" + i[0] + ":" + i[1] + ":" + i[2] + ".00+08:00";
				t = new Date(u);
				return e + " " + s.format(t);
			} else if (e) {
				return e;
			}
		},
		visiblityDate: function (e) {
			if (e) return true;
			return false;
		},
		setBlur: function () {},
		StatusHandleIcon: function (e) {
			if (e === "P") {
				return "sap-icon://document";
			} else if (e === "O") {
				return "sap-icon://multi-select";
			} else if (e === "J") {
				return "sap-icon://message-success";
			} else if (e === "C") {
				return "sap-icon://message-error";
			} else if (e === "A") {
				return "sap-icon://approvals";
			} else if (e === "F") {
				return "sap-icon://shipping-status";
			} else if (e === "H") {
				return "sap-icon://duplicate";
			} else if (e === "G") {
				return "sap-icon://decline";
			} else if (e === "K") {
				return "sap-icon://add-product";
			} else if (e === "Z") {
				return "sap-icon://sales-quote";
			}
		},
		statusHandleRet: function (e, t) {
			if (t === "RO") {
				return "sap-icon://undo";
			} else if (t === "RP") {
				if (e == "G") return "sap-icon://decline";
				else return "sap-icon://supplier";
			} else if (t === "RC") {
				return "sap-icon://sales-order-item";
			}
		},
		statusHandleExc: function (e, t) {
			if (e === "EO") {
				return "sap-icon://create-form";
			} else if (e === "EP") {
				return "sap-icon://add-product";
			} else if (e === "ED") {
				return "sap-icon://shipping-status";
			} else if (e === "EC") {
				if (t == "D") return "sap-icon://accept";
				if (t == "R") return "sap-icon://cancel";
				if (t == "M") return "sap-icon://split";
				else return "sap-icon://accept";
			}
		},
		statusFieldTrackingValueStateDetails: function (e, t, r) {
			if (e === 1 && t >= 1) {
				return "Error";
			} else if (e === 2 && t >= 2) {
				if (r === "W") {
					return "None";
				} else if (r === "B") {
					return "Success";
				} else {
					return "Error";
				}
			} else if (e === 3 && t >= 3) {
				return "Success";
			} else if (e === 4 && t >= 4) {
				return "Error";
			}
		},
		handleColor: function (e, t) {
			if (t != "RC") {
				if (e) return "Error";
				return "None";
			} else {
				if (e) return "Success";
				return "None";
			}
		},
		handleColorExc: function (e, t) {
			if (t != "ED") {
				if (e) return "Error";
				return "None";
			} else {
				if (e) return "Success";
				return "None";
			}
		},
		visibleBasedOnStatusIfTopRejectDontShowBottomValue: function (e, t, r) {
			if (r === "X" && e > 1 && t === 1) {
				return false;
			} else if (r === "S" && e > 3 && t === 3) {
				return false;
			}
		},
		addCommas: function (e, t) {
			if (e !== undefined && e !== null) {
				e = e.toString();
			}
			if (t == null) t = "";
			if (e == "" || e == undefined) {
				return "";
			} else {
				var r = e;
				r = r.toString();
				var n = "";
				if (r.indexOf(".") > 0) n = r.substring(r.indexOf("."), r.length);
				r = Math.floor(r);
				r = r.toString();
				var i = r.substring(r.length - 3);
				var s = r.substring(0, r.length - 3);
				if (s != "") i = "," + i;
				var u = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + i + n;
				if (t != "") return u + " (" + t + ")";
				else if (t == "" || t == undefined) return u;
			}
		},
		stringDateTimeConvert: function (e, t, r) {
			if (t === undefined || t === null || t.trim() === "") {
				return e;
			} else if (r === undefined || r === null || r.trim() === "") {
				if (t.trim().length === 8) {
					var n = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					var i = new Date(t.trim().substr(0, 4), t.trim().substr(4, 2) - 1, t.trim().substr(6, 2));
					if (e) {
						return e + ", " + n.format(i) + "00:00:00";
					} else {
						return n.format(i);
					}
				}
			} else if (t !== null && t.trim() !== "" && r.trim() !== null && r.trim() !== "") {
				if (t.trim().length === 8 && r.trim().length >= 4) {
					if (r === "000000") {
						var n = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "dd.MM.yyyy"
						});
						var i = new Date(t.trim().substr(0, 4), t.trim().substr(4, 2) - 1, t.trim().substr(6, 2));
						return e + ", " + n.format(i) + " " + "00:00:00";
					} else {
						var n = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "dd.MM.yyyy  HH:mm:ss"
						});
						if ((t.trim().substr(4, 2) - 1).toString().length === 1 && t.trim().substr(4, 2) < 9) {
							var s = "0" + t.trim().substr(4, 2).toString();
						} else {
							var s = t.trim().substr(4, 2).toString();
						}
						var t = t.trim().substr(0, 4) + "-" + t.trim().substr(4, 2).toString() + "-" + t.trim().substr(6, 2) + "T" + r.trim().substr(0, 2) +
							":" + r.trim().substr(2, 2) + ":" + r.trim().substr(4, 2) + ".00+08:00";
						var i = new Date(t);
						if (e) return e + ", " + n.format(i);
						else return n.format(i);
					}
				} else {
					return e;
				}
			}
		},
		documentState: function (e) {
			if (e) return "Warning";
			return "None";
		},
		dateValueConcat: function (e, t) {
			if (e && t) {
				if (t.trim().length === 8) {
					var r = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					var n = new Date(t.trim().substr(0, 4), t.trim().substr(4, 2) - 1, t.trim().substr(6, 2));
					return e + "," + r.format(n);
				}
			}
			return e;
		},
		dateValue: function (e) {
			if (e && e.trim().length === 8) {
				var t = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var r = new Date(e.trim().substr(0, 4), e.trim().substr(4, 2) - 1, e.trim().substr(6, 2));
				return t.format(r);
			}
			return e;
		},
		dateTimeConcat: function (e, t) {
			if (t && t.trim().length >= 4) {
				if (t === "000000") {
					var r = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					var n = new Date(e.trim().substr(0, 4), e.trim().substr(4, 2) - 1, e.trim().substr(6, 2));
				} else {
					var r = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy  HH:mm:ss"
					});
					if ((e.trim().substr(4, 2) - 1).toString().length === 1 && e.trim().substr(4, 2) < 9) {
						var i = "0" + e.trim().substr(4, 2).toString();
					} else {
						var i = e.trim().substr(4, 2).toString();
					}
					var e = e.trim().substr(0, 4) + "-" + e.trim().substr(4, 2).toString() + "-" + e.trim().substr(6, 2) + "T" + t.trim().substr(0, 2) +
						":" + t.trim().substr(2, 2) + ":" + t.trim().substr(4, 2) + ".00+08:00";
					var n = new Date(e);
					return r.format(n);
				}
			} else {
				if (e && e.trim().length === 8) {
					var r = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					var n = new Date(e.trim().substr(0, 4), e.trim().substr(4, 2) - 1, e.trim().substr(6, 2));
					return r.format(n);
				}
				return e;
			}
		},
		descCodeConcat: function (e, t) {
			if (e === "" && t === "") {
				return "";
			} else if (t !== "") {
				return e + " " + t;
			}
		},
		statusdforDetailPage: function (e) {
			if (e) return e;
			return "Pending";
		},
		OrderingStatusFieldTracking: function (e, t) {
			if (e === "O" || e === "X") {
				return e;
			} else {
				if (t >= 1) {
					return "O";
				} else {
					return "";
				}
			}
		},
		processingStatusFieldTracking: function (e, t) {
			if (e === "K" || e === "W" || e === "B" || e === "Q") {
				return e;
			} else {
				if (t >= 2) {
					return "K";
				} else {
					return "";
				}
			}
		},
		deliveryStatusFieldTracking: function (e, t) {
			if (e === "S") {
				return e;
			} else {
				if (t >= 3) {
					return "S";
				} else {
					return "";
				}
			}
		},
		customerConfirmationStatusFieldTracking: function (e, t) {
			if (e === "D" || e === "R" || e === "M") {
				return e;
			} else {
				if (t >= 4) {
					return "D";
				} else {
					return "";
				}
			}
		},
		forLevelCheckStataus: function (e) {
			if (e === "O" || e === "X") {
				return 1;
			} else if (e === "K" || e === "W" || e === "B" || e === "Q") {
				return 2;
			} else if (e === "S") {
				return 3;
			} else if (e === "D" || e === "R" || e === "M") {
				return 4;
			} else {
				return 0;
			}
		},
		f4ValueBind: function (e, t) {
			if (e && t) {
				return e + " (" + t + ")";
			} else if (e && !t) {
				return e;
			} else if (!e && t) {
				return t;
			} else {
				return "";
			}
		},
		f4EValueBind: function (e, t) {
			if (e && t) {
				return e + " (" + t + ")";
			} else if (e && !t) {
				return e;
			} else {
				return "";
			}
		},
		deleteDuplicateRowVal: function (e) {
			if (e) {
				return true;
			} else {
				return false;
			}
		},
		basedDeviceToggeleShow: function (e) {
			if (e) {
				return false;
			} else {
				return true;
			}
		},
		sameValueReturn: function (e) {
			return e;
		},
		masterListIconColorHandle: function (e) {
			if (e === "W") {
				return "#878787";
			} else if (e === "B" || e === "S") {
				return "green";
			} else {
				return "#AB1032";
			}
		},
		DateConversion: function (e) {
			if (e) {
				var t = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "yyyy-MM-dd'T'HH:mm:ss"
				});
				return t.format(e);
			} else {
				return null;
			}
		},
		visibleRODate: function (e, t) {
			if (t) {
				if (e == "RO") return true;
			}
			return false;
		},
		visibleRPDate: function (e, t) {
			if (t) {
				if (e == "RP") return true;
			}
			return false;
		},
		visibleRCDate: function (e, t) {
			if (t) {
				if (e == "RC") return true;
			}
			return false;
		},
		visibleEODate: function (e, t) {
			if (t) {
				if (e == "EO") return true;
			}
			return false;
		},
		visibleEPDate: function (e, t) {
			if (t) {
				if (e == "EP") return true;
			}
			return false;
		},
		visibleEDDate: function (e, t) {
			if (t) {
				if (e == "ED") return true;;
			}
			return false;
		},
		visibleECDate: function (e, t) {
			if (t) {
				if (e == "EC") return true;
			}
			return false;
		},
		blurValue: function (e) {
			if (e == "B") return true;
			return false;
		},
		blurNValue: function (e) {
			if (e != "B") return true;
			return false;
		},
		
		/** 
		 * Get default date range selection values
		 * @returns dateValue Date From date
		 * @returns secondDateValue Date To date
		 */
		getDefaultDateRangeSelectionValues: function () {
			var secondDateValue = new Date();
			var dateValue = new Date();
			dateValue.setDate(dateValue.getDate() - 7);
			return {
				dateValue: dateValue,
				secondDateValue: secondDateValue
			};
		}
	};
});