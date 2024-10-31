sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("auths.controller.UserDetail", {
		formatter: formatter,
		onInit: function () {
			sessionStorage.setItem("goToLaunchpad", "");

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this.onRouteMatched, this);

			this.getRouter().getRoute("UserDetail").attachPatternMatched(this._onObjectMatched, this);
			document.addEventListener('keydown', this.handleF8Pressed.bind(this));
		},

		handleF8Pressed: function (event) {
			if (event.which === 119) {
				var that = this;

				that.onSaveChanges();
			}
		},

		onAfterRendering: function () {
			var that = this;
			sessionStorage.setItem("goToLaunchpad", "");
			window.addEventListener("message", function (event) {
				var data = event.data;
				if (data.action == "goToMainPage") {
					that.onNavBack();
				}
			});
		},

		onRouteMatched: function () {
			var oModel = new JSONModel({
				editable: false,
				createMethod: false,
			});
			this.getView().setModel(oModel, "UserDetail");
		},

		onSaveChanges: function () {
			var that = this,
				oModel = this.getModel();

			if (!this.getModel("UserDetail").getProperty("/createMethod")) {
				var sPath = this.getModel("UserDetail").getProperty("/sPath"),
					oObject = oModel.getObject(sPath);

				delete oObject.__metadata;

				oObject.Partner = this.byId("inPartner").getSelectedKey();
				oObject.Name = this.byId("inName").getValue();
				oObject.Contact = this.byId("inContact").getValue();
				oObject.Nationality = this.byId("inNationality").getSelectedKey();
				oObject.BirthDate = this.byId("DP2").getDateValue();
				oObject.UsrEmail = this.byId("inEmail").getValue();
				oObject.UsrTypeId = this.byId("inUsrTypeId").getSelectedKey();
				oObject.Password = this.byId("inPassword").getValue();
				oObject.RoleId = this.byId("inRoleId").getSelectedKey();

				oModel.update(sPath, oObject, {
					success: function (oData) {
						new sap.m.MessageBox.success(that.getResourceBundle().getText("userSuccessText"), {
							title: that.getResourceBundle().getText("userSuccessTitle"),
							actions: [sap.m.MessageBox.Action.OK],
							emphasizedAction: sap.m.MessageBox.Action.OK,
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									that.getModel().refresh(true);
									that.getRouter().navTo("RouteMain");
								}
							}
						});
					},
					error: function (oError) {
						var sError = JSON.parse(oError.responseText).error.message.value;
						sap.m.MessageBox.alert(sError, {
							icon: "ERROR",
							onClose: null,
							styleClass: '',
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}
				});
			} else {
				var oEntry = {},
					check = true;

				oEntry.Partner = this.byId("inPartner").getSelectedKey();
				oEntry.Name = this.byId("inName").getValue();
				oEntry.Contact = this.byId("inContact").getValue();
				oEntry.Nationality = this.byId("inNationality").getSelectedKey();
				oEntry.BirthDate = this.byId("DP2").getDateValue();
				oEntry.UsrEmail = this.byId("inEmail").getValue();
				oEntry.UsrTypeId = this.byId("inUsrTypeId").getSelectedKey();
				oEntry.Password = this.byId("inPassword").getValue();
				oEntry.RoleId = this.byId("inRoleId").getSelectedKey();

				oModel.create("/xTQAxUSR01_DD", oEntry, {
					success: function (oData) {
						new sap.m.MessageBox.success(that.getResourceBundle().getText("userCreatedSuccessText"), {
							title: that.getResourceBundle().getText("userCreatedSuccessTitle"),
							actions: [sap.m.MessageBox.Action.OK],
							emphasizedAction: sap.m.MessageBox.Action.OK,
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									that.getModel().refresh(true);
									that.getRouter().navTo("RouteMain");
								}
							}
						});
					},
					error: function (oError) {
						var sError = JSON.parse(oError.responseText).error.message.value;
						sap.m.MessageBox.alert(sError, {
							icon: "ERROR",
							onClose: null,
							styleClass: '',
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}
				});
			}
		},

		onPermToChange: function (oEvent) {
			var editable = this.getModel("UserDetail").getProperty("/editable");

			if (editable) {
				this.getModel("UserDetail").setProperty("/editable", false);
				oEvent.oSource.setProperty("icon", "sap-icon://edit");
			}
			else {
				this.getModel("UserDetail").setProperty("/editable", true);
				oEvent.oSource.setProperty("icon", "sap-icon://not-editable");
			}
		},

		onNavBack: function () {
			sessionStorage.setItem("goToLaunchpad", "X");
			this.getRouter().navTo("RouteMain");
		},

		_onObjectMatched: function (oEvent) {
			var sObjectId = "/xTQAxUSR01_DD" + oEvent.getParameter("arguments").objectId;
			this._bindView(sObjectId);
		},

		_bindView: function (sObjectPath) {
			this.getModel("UserDetail").setProperty("/sPath", sObjectPath);
			this.getModel("UserDetail").setProperty("/editable", false);
			this.getModel("UserDetail").setProperty("/createMethod", false);
			var oViewModel = this.getModel("UserDetail");

			if (sObjectPath != "/xTQAxUSR01_DD('000')") {
				this.byId("SimpleFormDisplayColumn_threeGroups234").setTitle("Detalhes Utilizador");
				this.getView().bindElement({
					path: sObjectPath,
					events: {
						dataRequested: function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function (oData) {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			} else {
				this.onCreateMethod();
			}
		},

		onCreateMethod: function () {
			var aButtons = [],
				aButtonsTitle = [],
				oPartner = {
					id: "inPartner",
					value: ""
				},
				oEmail = {
					id: "inEmail",
					value: ""
				},
				oName = {
					id: "inName",
					value: ""
				},
				oContact = {
					id: "inContact",
					value: ""
				},
				oPassword = {
					id: "inPassword",
					value: ""
				},
				oNationality = {
					id: "inNationality",
					value: ""
				},
				oDP2 = {
					id: "DP2",
					value: ""
				},
				oMainPage = {
					id: "MainPage",
					title: ""
				},
				oSimpleForm = {
					id: "SimpleFormDisplayColumn_threeGroups234",
					title: "Criar Utilizador"
				};

			this.getModel("UserDetail").setProperty("/editable", true);
			this.getModel("UserDetail").setProperty("/createMethod", true);


			aButtons.push(oPartner, oEmail, oName, oContact, oPassword, oNationality, oDP2);
			aButtonsTitle.push(oMainPage, oSimpleForm);

			this.onManageValues(aButtons);
			this.onManageTitle(aButtonsTitle);
		},

		onManageValues: function (aButtons) {
			if (aButtons.length > 0) {
				aButtons.forEach(oButton => {
					this.byId(oButton.id).setValue(oButton.value);
				});
			}
		},

		onManageTitle: function (aButtons) {
			if (aButtons.length > 0) {
				aButtons.forEach(oButton => {
					this.byId(oButton.id).setTitle(oButton.title);
				});
			}
		},

	});
});
