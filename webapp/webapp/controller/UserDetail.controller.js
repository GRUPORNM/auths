sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("auths.controller.UserDetail", {
		formatter: formatter,
		onInit: function () {

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this.onRouteMatched, this);

			// Your onInit code here
			this.getRouter().getRoute("UserDetail").attachPatternMatched(this._onObjectMatched, this);

			document.addEventListener('keydown', this.handleF8Pressed.bind(this));
		},

		handleF8Pressed: function (event) {
			if (event.which === 119) {
				var that = this;

				that.onSaveChanges();
			}
		},

		onRouteMatched: function () {
			var oModel = new JSONModel(
				{
					editable: false,
					createMethod: false,
				}
			);
			this.getView().setModel(oModel, "UserDetail");
		},

		onSaveChanges: function () {
			var that = this;
			var oModel = this.getModel();

			if (!this.getModel("UserDetail").getProperty("/createMethod")) {
				var sPath = this.getModel("UserDetail").getProperty("/sPath");
				var oObject = oModel.getObject(sPath);
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
						that.getModel().refresh(true);
						sap.m.MessageBox.success("Utilizador Atualizado");
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
				var oEntry = {};
				var check = true;
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
						sap.m.MessageBox.success("Utilizador criado com sucesso");
						that.getRouter().navTo("RouteMain");
						that.getModel().refresh(true);
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
			this.byId("SimpleFormDisplayColumn_threeGroups234").setTitle("Criar Utilizador");
			this.byId("inPartner").setValue("");
			this.byId("inEmail").setValue("");
			this.byId("inName").setValue("");
			this.byId("inContact").setValue("");
			this.byId("inNationality").setValue("");
			this.byId("DP2").setValue("");
			this.getModel("UserDetail").setProperty("/editable", true);
			this.byId("MainPage").setTitle("");
			this.getModel("UserDetail").setProperty("/createMethod", true);
		},

		// Other controller methods here
	});
});
