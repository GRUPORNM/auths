sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel) {
        "use strict";

        return BaseController.extend("auths.controller.Main", {
            onInit: function () {
                // Create and set the JSON model
                var oModel = new JSONModel(
                );
                this.getView().setModel(oModel, "Main");
                // Your onInit code here
            },

            onOpenPressed: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().getPath();
                this.getModel("global").setProperty("/create", false);
                this.getRouter().navTo("Detail", {
                    objectId: sPath.substring("/AuthorizationsHeader".length)
                });
                debugger;
            },

            onAddRole: function () {
                // Criar o diálogo
                var that = this;
                var dialog = new sap.m.Dialog({
                    type: sap.m.DialogType.Message,
                    title: this.getView().getModel("i18n").getResourceBundle().getText("CreateNewRole"),
                    content: [
                        new sap.m.Label({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("RoleName")
                        }).addStyleClass("dialog-label"),
                        new sap.m.Input({
                            width: "100%"
                        }).addStyleClass("dialog-input")
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("Create"),
                            press: function () {
                                // Lógica para processar o nome da função
                                var roleName = dialog.getContent()[1].getValue(); // Índice 1 representa o campo de entrada
                                // console.log("Nome da função:", roleName);
                                that.getModel("global").setProperty("/newRole", roleName);
                                that.getModel("global").setProperty("/create", "true");
                                dialog.close();

                                var sPath = "/AuthorizationsHeader('999')";
                                that.getRouter().navTo("Detail", {
                                    objectId: sPath.substring("/AuthorizationsHeader".length)
                                });
                            }
                        }),
                        new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("Cancel"),
                            press: function () {
                                dialog.close();
                            }
                        })
                    ],
                    afterClose: function () {
                        dialog.destroy();
                    }
                });

                // Abrir o diálogo
                dialog.open();

            },

            //USER SETTINGS


            onChangeStatus: function () {
                debugger;
                var that = this;
                var oTable = this.byId("requestTable");
                var sPath = oTable.getSelectedContextPaths()[0];
                var oModel = this.getModel();
                var oObject = oModel.getObject(sPath);
                delete oObject.__metadata;

                oObject.UsrStatus = "change";

                oModel.update(sPath, oObject, {
                    success: function (oData) {
                        that.getModel().refresh(true);
                        sap.m.MessageBox.success("Utilizador Atualizado");
                    },
                    error: function (e) {
                    }
                });
                
            },

            onRequestTablePress: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContextPath();
                this.getRouter().navTo("UserDetail", {
                    objectId: sPath.substring("/xTQAxUSR01_DD".length)
                });
            },

            onChangeSelection: function (oEvent) {
                this.byId("btUnlocked").setProperty("icon", "sap-icon://locked");
                var selectedsPath = oEvent.oSource.getSelectedContextPaths();
                var unlocked = true;

                selectedsPath.forEach(element => {
                    var oObject = this.getModel().getObject(element);
                    if (oObject.UsrStatus != "Blocked")
                        unlocked = false;
                });

                if (unlocked) {
                    this.byId("btUnlocked").setProperty("icon", "sap-icon://unlocked");
                    this.byId("btUnlocked").setProperty("enabled", true);
                }
                else {
                    this.byId("btUnlocked").setProperty("icon", "sap-icon://locked");
                    this.byId("btUnlocked").setProperty("enabled", true);
                }

            }

        });
    });
