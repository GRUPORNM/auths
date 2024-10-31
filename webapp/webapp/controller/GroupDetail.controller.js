sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/layout/form/SimpleForm"
], function (BaseController, JSONModel, SimpleForm) {
    "use strict";

    return BaseController.extend("auths.controller.GroupDetail", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);

            // Your onInit code here
            this.getRouter().getRoute("GroupDetail").attachPatternMatched(this._onObjectMatched, this);

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
            this.getView().setModel(oModel, "GroupDetail");

            this.byId("inAppHeader").setValue("");
            this.byId("inAppSubHeader").setValue("");
            this.byId("btCreateUpdate").setText("Save");
        },

        onNavBack: function () {
            this.getRouter().navTo("RouteMain");
        },

        _onObjectMatched: function (oEvent) {
            var sObjectId = "/xTQAxLAUNCHPAD_GROUP_VH" + oEvent.getParameter("arguments").objectId;
            this._bindView(sObjectId);
        },

        _bindView: function (sObjectPath) {
            this.getModel("GroupDetail").setProperty("/sPath", sObjectPath);
            this.getModel("GroupDetail").setProperty("/editable", false);
            var oViewModel = this.getModel("GroupDetail");

            if (sObjectPath != "/xTQAxLAUNCHPAD_GROUP_VH('000')") {
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
            this.getModel("GroupDetail").setProperty("/editable", true);
            this.byId("btChange").setProperty("visible", false);
            this.byId("btCreateUpdate").setText("Create");
            this.getModel("GroupDetail").setProperty("/createMethod", true);
        },

        onTranslateGroup: function () {
            var oTable = this.byId("RequestTableGroupLanguage"),
                oObject = oTable.getSelectedItem().getCells(),
                oGrpId = oObject[0].getText(),
                oSelected = oObject[1].getText(),
                oGroupHeaderTitle = oObject[2].getText();

            if (!this.oResizableDialog) {
                var oForm = new SimpleForm({
                    layout: "ResponsiveGridLayout",
                    content: [
                        new sap.m.Label({
                            text: "{i18n>AppLangu}"
                        }),
                        new sap.m.Input({
                            id: "inGroupId",
                            enabled: false,
                            layoutData: new sap.m.FlexItemData({
                                styleClass: "sapUiSmallMarginBottom"
                            }),
                            required: true,
                        }),
                        new sap.m.Label({
                            text: "{i18n>AppHeader}"
                        }),
                        new sap.m.Input({
                            id: "inGroupHeader",
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
                        var oTable = this.byId("RequestTableGroupLanguage")
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
                            oEntry.GrpTitle = sap.ui.getCore().byId("inGroupHeader").getValue();
                            debugger;
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
                    var oGroupSelected = sap.ui.getCore().byId("inGroupId");
                    var oGroupHeader = sap.ui.getCore().byId("inGroupHeader");

                    oGroupSelected.setValue(oSelected);
                    oGroupHeader.setValue(oGroupHeaderTitle);
                }

                this.getView().addDependent(this.oResizableDialog);
            }

            this.oResizableDialog.open();
        }
    });
});
