sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/layout/form/SimpleForm"
], function (BaseController, JSONModel, SimpleForm) {
	"use strict";

	return BaseController.extend("auths.controller.AppDetail", {
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this.onRouteMatched, this);

			// Your onInit code here
			this.getRouter().getRoute("AppDetail").attachPatternMatched(this._onObjectMatched, this);

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
			this.getView().setModel(oModel, "AppDetail");

			this.byId("inAppHeader").setValue("");
			this.byId("inAppSubHeader").setValue("");
			this.byId("inAppIcon").setValue("");
			this.byId("inAppFooter").setValue("");
			this.byId("inAppLink").setValue("");
			this.byId("inAppLangu").setValue("EN");
			this.byId("btCreateUpdate").setText("Save");
			this.byId("btChange").setProperty("visible", true);
		},

		onIconSearchPressed: function () {
			window.open('https://sapui5.hana.ondemand.com/sdk/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/overview/SAP-icons');
		},

		onSaveChanges: function () {
			var that = this;
			var oModel = this.getModel();
			var checkUpdate = true;
			var oButton = this.byId("btChange");

			if (!this.getModel("AppDetail").getProperty("/createMethod")) {
				//UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE
				var sPath = this.getModel("AppDetail").getProperty("/sPath");
				var oObject = oModel.getObject(sPath);
				delete oObject.__metadata;

				var oEntry = {};
				oEntry.app_header = (this.byId("inAppHeader").getValue() != oObject.app_header ? this.byId("inAppHeader").getValue() : oObject.app_header);
				oEntry.app_subheader = (this.byId("inAppSubHeader").getValue() != oObject.app_subheader ? this.byId("inAppSubHeader").getValue() : oObject.app_subheader);
				oEntry.app_icon = (this.byId("inAppIcon").getValue() != oObject.app_icon ? this.byId("inAppIcon").getValue() : oObject.app_icon);
				oEntry.app_footer = (this.byId("inAppFooter").getValue() != oObject.app_footer ? this.byId("inAppFooter").getValue() : oObject.app_footer);
				oEntry.app_link = (this.byId("inAppLink").getValue() != oObject.app_link ? this.byId("inAppLink").getValue() : oObject.app_link);
				oEntry.grp_id = (this.byId("inGrpTitle").getSelectedKey() != oObject.grp_id ? this.byId("inGrpTitle").getSelectedKey() : oObject.grp_id);
				if (this.byId("inAppActived").getSelectedKey() == 'true')
					oEntry.app_actived = true;
				else
					oEntry.app_actived = false;

				if (oEntry.app_header) {
					this.byId("inAppHeader").setValueState("None");
				} else {
					this.byId("inAppHeader").setValueState("Error");
					checkUpdate = false;
				}

				if (oEntry.app_subheader) {
					this.byId("inAppSubHeader").setValueState("None");
				} else {
					this.byId("inAppSubHeader").setValueState("Error");
					checkUpdate = false;
				}

				if (oEntry.app_icon && sap.ui.core.IconPool.isIconURI(oEntry.app_icon)) {
					this.byId("inAppIcon").setValueState("None");
				} else {
					this.byId("inAppIcon").setValueState("Error");
					checkUpdate = false;
				}

				if (oEntry.app_footer) {
					this.byId("inAppFooter").setValueState("None");
				} else {
					this.byId("inAppFooter").setValueState("Error");
					checkUpdate = false;
				}

				if (oEntry.app_link) {
					this.byId("inAppLink").setValueState("None");
				} else {
					this.byId("inAppLink").setValueState("Error");
					checkUpdate = false;
				}

				if (checkUpdate) {
					oModel.update(sPath, oEntry, {
						success: function (oData) {
							sap.m.MessageBox.success("Aplicação Atualizada");
							that.onPermToChange(oButton);
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

			} else {

				var oEntry = {};
				var check = true;
				oEntry.app_header = this.byId("inAppHeader").getValue();
				oEntry.app_subheader = this.byId("inAppSubHeader").getValue();
				oEntry.app_icon = this.byId("inAppIcon").getValue();
				oEntry.app_footer = this.byId("inAppFooter").getValue();
				oEntry.app_link = this.byId("inAppLink").getValue();
				oEntry.grp_id = this.byId("inGrpTitle").getSelectedKey();
				oEntry.app_actived = this.byId("inAppActived").getSelectedKey() === "true";

				if (oEntry.app_header) {
					this.byId("inAppHeader").setValueState("None");
				} else {
					this.byId("inAppHeader").setValueState("Error");
					check = false;
				}

				if (oEntry.app_subheader) {
					this.byId("inAppSubHeader").setValueState("None");
				} else {
					this.byId("inAppSubHeader").setValueState("Error");
					check = false;
				}

				if (oEntry.app_icon && sap.ui.core.IconPool.isIconURI(oEntry.app_icon)) {
					this.byId("inAppIcon").setValueState("None");
				} else {
					this.byId("inAppIcon").setValueState("Error");
					check = false;
				}

				if (oEntry.app_footer) {
					this.byId("inAppFooter").setValueState("None");
				} else {
					this.byId("inAppFooter").setValueState("Error");
					check = false;
				}

				if (oEntry.app_link) {
					this.byId("inAppLink").setValueState("None");
				} else {
					this.byId("inAppLink").setValueState("Error");
					check = false;
				}

				if (check) {
					oModel.create("/xTQAxAPPLICATIONS_DD", oEntry, {
						success: function (oData) {
							sap.m.MessageBox.success("Aplicação criada com sucesso");
							that.onPermToChange(oButton);
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

			}
		},

		onVerifyIcon: function (oEvent) {
			var oIcon = oEvent.oSource.getValue();
			if (sap.ui.core.IconPool.isIconURI(oIcon)) {
				oEvent.oSource.setValueHelpIconSrc(oIcon);
				this.byId("OSIcon").setIcon(oIcon);
			}
			else {
				oEvent.oSource.setValueHelpIconSrc("sap-icon://sys-help-2");
				this.byId("OSIcon").setIcon("sap-icon://sys-help-2");
			}

		},

		onPermToChange: function (oEvent) {
			var editable = this.getModel("AppDetail").getProperty("/editable");
			if (editable) {
				this.getModel("AppDetail").setProperty("/editable", false);
				oEvent.oSource.setProperty("icon", "sap-icon://edit");
			}
			else {
				this.getModel("AppDetail").setProperty("/editable", true);
				oEvent.oSource.setProperty("icon", "sap-icon://not-editable");
			}
		},

		onNavBack: function () {
			this.getRouter().navTo("RouteMain");
		},

		_onObjectMatched: function (oEvent) {
			var sObjectId = "/xTQAxAPPLICATIONS_DD" + oEvent.getParameter("arguments").objectId;
			this._bindView(sObjectId);
		},

		_bindView: function (sObjectPath) {
			this.getModel("AppDetail").setProperty("/sPath", sObjectPath);
			this.getModel("AppDetail").setProperty("/editable", false);
			var oViewModel = this.getModel("AppDetail");

			if (sObjectPath != "/xTQAxAPPLICATIONS_DD('000')") {
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
			this.byId("MainPage").setTitle("Criar Aplicação");
			this.getModel("AppDetail").setProperty("/editable", true);
			this.byId("btChange").setProperty("visible", false);
			this.byId("btCreateUpdate").setText("Create");
			this.getModel("AppDetail").setProperty("/createMethod", true);
		},

		onTranslateApp: function () {
			var oTable = this.byId("requestTableLanguages"),
				oObject = oTable.getSelectedItem().getCells(),
				oAppLangu = oObject[0].getText(),
				oAppHeader2 = oObject[1].getText(),
				oAppSubHeader2 = oObject[2].getText();

			if (!this.oResizableDialog) {
				var oForm = new SimpleForm({
					layout: "ResponsiveGridLayout",
					content: [
						new sap.m.Label({
							text: "{i18n>AppLangu}"
						}),
						new sap.m.Input({
							id: "inLangu",
							enabled: false,
							setValue: "",
							layoutData: new sap.m.FlexItemData({
								styleClass: "sapUiSmallMarginBottom"
							}),
							required: true,
						}),
						new sap.m.Label({
							text: "{i18n>AppHeader}"
						}),
						new sap.m.Input({
							id: "inAppHeader",
							setValue: "",
							layoutData: new sap.m.FlexItemData({
								styleClass: "sapUiSmallMarginBottom"
							}),
							required: true,
						}),
						new sap.m.Label({
							text: "{i18n>AppHeader}"
						}),
						new sap.m.Input({
							id: "inAppSubHeader",
							setValue: "",
							layoutData: new sap.m.FlexItemData({
								styleClass: "sapUiSmallMarginBottom"
							}),
							required: true,
						}),
					]
				});

				var oSubmitButton = new sap.m.Button({
					text: "{i18n>Save}",
					press: function () {
						var bAllFieldsFilled = true;
						var oModel = this.getModel();
						var oTable = this.byId("requestTableLanguages")
						var sPath = oTable.getSelectedContexts()[0].sPath;

						oForm.getContent().forEach(function (formElement) {
							if (formElement instanceof sap.m.Input) {
								if (formElement.getRequired() && !formElement.getValue()) {
									bAllFieldsFilled = false;
									formElement.setValueState("Error");
									return false;
								}
								else {
									formElement.setValueState("None");
								}
							}
						});

						if (bAllFieldsFilled) {
							var oEntry = {};
							
							var that = this;
							oEntry.AppHeader = sap.ui.getCore().byId("inAppHeader").getValue();
							oEntry.AppSubheader = sap.ui.getCore().byId("inAppSubHeader").getValue();
							oModel.update(sPath, oEntry, {
								success: function () {
									sap.m.MessageBox.success(that.getResourceBundle().getText("translatesucess"));
									oModel.refresh(true);
								}
							});
							this.oResizableDialog.close();
							this.oResizableDialog.destroy();
							this.oResizableDialog.destroy();
							this.oResizableDialog = null;
						}
					}.bind(this)
				});

				var oCloseButton = new sap.m.Button({
					text: "{i18n>close}",
					press: function () {
						this.oResizableDialog.close();
						this.oResizableDialog.destroy();
						this.oResizableDialog.destroy();
						this.oResizableDialog = null;
					}.bind(this)
				});

				this.oResizableDialog = new sap.m.Dialog({
					title: "{i18n>Translate}",
					contentWidth: "440px",
					contentHeight: "430px",
					resizable: true,
					content: [oForm],
					buttons: [oSubmitButton, oCloseButton]
				});

				if (this.oResizableDialog) {
					var oLangu = sap.ui.getCore().byId("inLangu");
					var oAppHeader = sap.ui.getCore().byId("inAppHeader");
					var oAppSubHeader = sap.ui.getCore().byId("inAppSubHeader");

					oLangu.setValue(oAppLangu);
					oAppHeader.setValue(oAppHeader2);
					oAppSubHeader.setValue(oAppSubHeader2);
				}

				this.getView().addDependent(this.oResizableDialog);
			}

			this.oResizableDialog.open();
		}
	});
});
