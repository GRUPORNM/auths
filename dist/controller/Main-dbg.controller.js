sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/Popup",
    "sap/m/VBox",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/ColumnListItem",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, formatter, Popup, VBox, SimpleForm, ColumnListItem, MessageBox) {
        "use strict";

        var deleteCheck = false;

        return BaseController.extend("auths.controller.Main", {
            formatter: formatter,
            onInit: function () {
                // Create and set the JSON model
                var oModel = new JSONModel(
                    {
                        appeditable: false,
                        groupeditable: false
                    }
                );
                this.getView().setModel(oModel, "Main");
                // Your onInit code here
                document.addEventListener('keydown', this.handleF5Pressed.bind(this));
            },

            handleF5Pressed: function (oEvent) {
                if (oEvent.which === 116) {
                    oEvent.preventDefault();
                    var that = this;
                    var selectedKey = this.getModel("global").getProperty("/selectedKey");
                    if (selectedKey === "user-settings" || !selectedKey) {
                        that.onCreateRequest();
                    } else if (selectedKey === "role") {
                        that.onAddRole();
                    } else if (selectedKey === "applications") {
                        that.onCreateApp();
                    } else if (selectedKey === "group-settings") {
                        that.onCreateGroup();
                    }
                } else if (oEvent.which === 118) {
                    var that = this;
                    that.onViewDetail();
                }
            },

            onCreateRequest: function () {
                this.getRouter().navTo("UserDetail", {
                    objectId: "xTQAxUSR01_DD(('000')".substring("/xTQAxUSR01_DD".length)
                });
            },

            onCreateApp: function () {
                this.getRouter().navTo("AppDetail", {
                    objectId: "xTQAxAPPLICATIONS_DD(('000')".substring("/xTQAxAPPLICATIONS_DD".length)
                });
            },

            onAddRole: function () {
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

            onCreateGroup: function () {
                var that = this;
                var oDialog = new sap.m.Dialog({
                    type: sap.m.DialogType.Message,
                    title: that.getView().getModel("i18n").getResourceBundle().getText("CreateGroup"),
                    content: [
                        new sap.m.Label({
                            text: that.getView().getModel("i18n").getResourceBundle().getText("GrpName")
                        }),
                        new sap.m.Input({
                            id: "groupNameInput"
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: that.getView().getModel("i18n").getResourceBundle().getText("Create"),
                            press: function () {
                                var sGroupName = sap.ui.getCore().byId("groupNameInput").getValue();
                                that.onCreateGroupRequest(sGroupName);
                                oDialog.destroy();
                                oDialog.close();
                            }
                        }),
                        new sap.m.Button({
                            text: that.getView().getModel("i18n").getResourceBundle().getText("Cancel"),
                            press: function () {
                                oDialog.close();
                                oDialog.destroy();
                            }
                        })
                    ]
                });

                // Abrir o diálogo
                oDialog.open();
            },

            onChangeIconTabBar: function (oEvent) {
                var selectedKey = oEvent.oSource.getSelectedKey();
                this.getModel("global").setProperty("/selectedKey", selectedKey);
            },

            onViewDetail: function () {
                var that = this;
                var oIconTabBar = this.byId("idIconTabBarMulti");
                var selectedIndex = oIconTabBar.getSelectedKey();

                if (selectedIndex == "user-settings") {
                    that.onRequestTablePress();
                } else if (selectedIndex == "applications") {
                    that.onRequestAppTablePress();
                } else if (selectedIndex == "group-settings") {
                    that.onRequestGroupTablePress();
                }
            },

            // handleF7Pressed: function (oEvent) {
            //     if (oEvent.which === 118) {
            //         var that = this;
            //         that.onViewDetail();
            //     }
            // },

            onOpenPressed: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().getPath();
                this.getModel("global").setProperty("/create", false);
                this.getRouter().navTo("Detail", {
                    objectId: sPath.substring("/AuthorizationsHeader".length)
                });
            },

            onChangeStatus: function () {
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
                if (oEvent) {
                    var sPath = oEvent.getSource().getBindingContextPath();
                    this.getRouter().navTo("UserDetail", {
                        objectId: sPath.substring("/xTQAxUSR01_DD".length)
                    });
                } else {
                    var oTable = this.byId("requestTable"),
                        sPath = oTable.getSelectedItem().getBindingContext().sPath;

                    this.getRouter().navTo("UserDetail", {
                        objectId: sPath.substring("/xTQAxUSR01_DD".length)
                    });
                }
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

            },


            onChangeSelectionGroups: function (oEvent) {
                var selectedPath = oEvent.oSource.getSelectedContextPaths()[0];
                this.getModel("Main").setProperty("/groupeditable", true);
            },


            onDeleteGroup: function () {
                var selectedPath = this.byId("requestTableGroups").getSelectedContextPaths()[0];
                var that = this;
                var oModel = this.getModel();

                oModel.remove(selectedPath, {
                    success: function (oData, oResponse) {
                        // oResponse.headers.message
                        if (oResponse.headers.message != '') {
                            var oFullMessage = that.getView().getModel("i18n").getResourceBundle().getText("onGroupsAssigned") + " " + oResponse.headers.message;
                            sap.m.MessageBox.information(oFullMessage);
                        }
                        else {

                            sap.m.MessageBox.success(that.getView().getModel("i18n").getResourceBundle().getText("onDeleteSucessGroup"))
                        }

                    },
                    error: function (e) {
                    }
                });

            },

            onRequestGroupTablePress2: function (oEvent) {
                var that = this;
                if (oEvent) {
                    var selectedPath = oEvent.oSource.getBindingContextPath();
                    var oObject = this.getModel().getObject(selectedPath);
                } else {
                    var oTable = this.byId("requestTableGroups"),
                        sPath = oTable.getSelectedItem().getBindingContext().sPath,
                        oObject = oTable.getModel().getObject(sPath);
                }

                var oDialog = new sap.m.Dialog({
                    type: sap.m.DialogType.Message,
                    title: that.getView().getModel("i18n").getResourceBundle().getText("GrpSettings"),
                    content: [
                        new sap.m.Label({
                            text: that.getView().getModel("i18n").getResourceBundle().getText("GrpName")
                        }),
                        new sap.m.Input({
                            id: "groupNameInput",
                            value: oObject.grp_title
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: that.getView().getModel("i18n").getResourceBundle().getText("Change"),
                            press: function () {
                                var sGroupName = sap.ui.getCore().byId("groupNameInput").getValue();
                                that.onSaveGroup(sGroupName, selectedPath);
                                oDialog.destroy();
                                oDialog.close();
                            }
                        }),
                        new sap.m.Button({
                            text: that.getView().getModel("i18n").getResourceBundle().getText("Cancel"),
                            press: function () {
                                oDialog.close();
                                oDialog.destroy();
                            }
                        })
                    ]
                });
                oDialog.open();
            },

            onSaveGroup: function (newGroupName, sPath) {
                var that = this;
                var oModel = this.getModel();
                var oEntry = {};


                oEntry.grp_title = newGroupName;

                oModel.update(sPath, oEntry, {
                    success: function (oData) {
                        that.getModel().refresh(true);
                        sap.m.MessageBox.success("Grupo Atualizado");
                    },
                    error: function (e) {
                    }
                });
            },

            onCreateGroupRequest: function (sGroupName) {
                var that = this;
                var oModel = this.getModel();
                var oEntry = {};

                oEntry.grp_title = sGroupName;

                oModel.create("/xTQAxLAUNCHPAD_GROUP_VH", oEntry, {
                    success: function (oData) {
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
            },

            onChangeSelectionApps: function (oEvent) {
                var selectedPath = oEvent.oSource.getSelectedContextPaths()[0];
                var oObject = this.getModel().getObject(selectedPath);

                if (selectedPath) {
                    this.getModel("Main").setProperty("/appeditable", true);
                    if (oObject.app_actived) {
                        this.byId("btnActiveApp").setProperty("text", this.getView().getModel("i18n").getResourceBundle().getText("Disable"))
                    }
                    else {
                        this.byId("btnActiveApp").setProperty("text", this.getView().getModel("i18n").getResourceBundle().getText("Active"))
                    }

                } else {
                    this.getModel("Main").setProperty("/appeditable", false);
                }
            },

            onRequestAppTablePress: function (oEvent) {
                if (oEvent) {
                    var sPath = oEvent.getSource().getBindingContextPath();
                    this.getRouter().navTo("AppDetail", {
                        objectId: sPath.substring("/xTQAxAPPLICATIONS_DD".length)
                    });
                } else {
                    var oTable = this.byId("requestTableApps"),
                        sPath = oTable.getSelectedItem().getBindingContext().sPath;

                    this.getRouter().navTo("AppDetail", {
                        objectId: sPath.substring("/xTQAxAPPLICATIONS_DD".length)
                    });
                }
            },

            onRequestGroupTablePress: function (oEvent) {
                if (oEvent) {
                    var sPath = oEvent.getSource().getBindingContextPath();
                    this.getRouter().navTo("GroupDetail", {
                        objectId: sPath.substring("/xTQAxLAUNCHPAD_GROUP_VH".length)
                    });
                } else {
                    var oTable = this.byId("requestTableGroups"),
                        sPath = oTable.getSelectedItem().getBindingContext().sPath;

                    this.getRouter().navTo("GroupDetail", {
                        objectId: sPath.substring("/xTQAxLAUNCHPAD_GROUP_VH".length)
                    });
                }
            },

            onActiveApp: function () {

                var that = this;
                that.check = false;
                var oTable = this.byId("requestTableApps");
                var sPath = oTable.getSelectedContextPaths()[0];
                var oObject = this.getModel().getObject(sPath);
                var oModel = this.getModel();
                var oEntry = {};

                delete oObject.__metadata;

                if (oObject.app_actived)
                    oEntry.app_actived = false;
                else {
                    that.check = true;
                    oEntry.app_actived = true;
                }



                oModel.update(sPath, oEntry, {
                    success: function (oData) {
                        that.getModel().refresh(true);
                        sap.m.MessageBox.success("Aplicação Atualizada");
                        if (that.check) {
                            that.byId("btnActiveApp").setProperty("text", that.getView().getModel("i18n").getResourceBundle().getText("Disable"))
                        }
                        else {
                            that.byId("btnActiveApp").setProperty("text", that.getView().getModel("i18n").getResourceBundle().getText("Active"))
                        }
                    },
                    error: function (e) {
                    }
                });



                if (that.check) {
                    if (oEntry.app_actived) {
                        this.byId("btnActiveApp").setProperty("text", this.getView().getModel("i18n").getResourceBundle().getText("Disable"))
                    }
                    else {
                        this.byId("btnActiveApp").setProperty("text", this.getView().getModel("i18n").getResourceBundle().getText("Active"))
                    }

                }
            },

            onTranslateApp: function () {
                var oTable = this.byId("requestTableApps"),
                    sElectedItem = oTable.getSelectedItem();

                if (sElectedItem) {
                    var sPath = sElectedItem.getBindingContext().sPath,
                        oObject = this.getModel().getObject(sPath),
                        oSelected = oObject.app_id,
                        oAppHeader = oObject.app_header,
                        oAppSubHeader = oObject.app_subheader;

                    if (!this.oResizableDialog) {
                        var oForm = new SimpleForm({
                            layout: "ResponsiveGridLayout",
                            content: [
                                new sap.m.Label({
                                    text: "{i18n>AppLangu}"
                                }),
                                new sap.m.Select({
                                    id: "inAppLangu",
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "sapUiSmallMarginBottom"
                                    }),
                                    required: true,
                                    items: [
                                        new sap.ui.core.Item({
                                            text: "EN",
                                            key: "EN"
                                        }),
                                        new sap.ui.core.Item({
                                            text: "PT",
                                            key: "PT"
                                        }),
                                        new sap.ui.core.Item({
                                            text: "ES",
                                            key: "S"
                                        })
                                    ],
                                    change: function (oEvent) {
                                        sap.ui.getCore().byId("inAppHeader").setValue("");
                                        sap.ui.getCore().byId("inAppSubHeader").setValue("");
                                        var selectedKey = oEvent.getSource().getSelectedKey();
                                        var oAppHeaderInput = sap.ui.getCore().byId("inAppHeader");
                                        var oAppSubHeaderInput = sap.ui.getCore().byId("inAppSubHeader");

                                        if (selectedKey === "EN") {
                                            oAppHeaderInput.setValue(oAppHeader);
                                            oAppSubHeaderInput.setValue(oAppSubHeader);
                                        } else {
                                            oAppHeaderInput.setValue('');
                                            oAppSubHeaderInput.setValue('');
                                        }
                                    }
                                }),
                                new sap.m.Label({
                                    text: "{i18n>AppHeader}"
                                }),
                                new sap.m.Input({
                                    id: "inAppHeader",
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "sapUiSmallMarginBottom"
                                    }),
                                    required: true,
                                }),
                                new sap.m.Label({
                                    text: "{i18n>AppSubHeader}"
                                }),
                                new sap.m.Input({
                                    id: "inAppSubHeader",
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "sapUiSmallMarginBottom"
                                    }),
                                    required: true,
                                })
                            ]
                        });

                        var oSubmitButton = new sap.m.Button({
                            text: "{i18n>Save}",
                            press: function () {
                                var bAllFieldsFilled = true;
                                var oModel = this.getModel();

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
                                    var selectedKey = sap.ui.getCore().byId("inAppLangu").getSelectedKey();
                                    oEntry.APP_ID = oSelected;
                                    oEntry.Langu = selectedKey;
                                    oEntry.AppHeader = sap.ui.getCore().byId("inAppHeader").getValue();
                                    oEntry.AppSubheader = sap.ui.getCore().byId("inAppSubHeader").getValue();

                                    oModel.create("/Translations", oEntry, {
                                        success: function (oData) {
                                            sap.m.MessageBox.success(that.getResourceBundle().getText("createtranslate"));
                                        }
                                    });
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
                            var oAppHeaderInput = sap.ui.getCore().byId("inAppHeader");
                            var oAppSubHeaderInput = sap.ui.getCore().byId("inAppSubHeader");

                            oAppHeaderInput.setValue(oAppHeader);
                            oAppSubHeaderInput.setValue(oAppSubHeader);
                        }

                        this.getView().addDependent(this.oResizableDialog);
                    }
                } else {
                    sap.m.MessageBox.warning("Por favor selecione uma aplicação para traduzir!");
                }

                this.oResizableDialog.open();
            },

            onTranslateGroup: function () {
                var oTable = this.byId("requestTableGroups"),
                    sElectedItem = oTable.getSelectedItem();

                if (sElectedItem) {
                    var sPath = sElectedItem.getBindingContext().sPath,
                        oObject = this.getModel().getObject(sPath),
                        oSelected = oObject.grp_id,
                        oGroupHeader = oObject.grp_title;

                    if (!this.oResizableDialog) {
                        var oForm = new SimpleForm({
                            layout: "ResponsiveGridLayout",
                            content: [
                                new sap.m.Label({
                                    text: "{i18n>AppLangu}"
                                }),
                                new sap.m.Select({
                                    id: "inGroupLangu",
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "sapUiSmallMarginBottom"
                                    }),
                                    required: true,
                                    items: [
                                        new sap.ui.core.Item({
                                            text: "EN",
                                            key: "EN"
                                        }),
                                        new sap.ui.core.Item({
                                            text: "PT",
                                            key: "PT"
                                        }),
                                        new sap.ui.core.Item({
                                            text: "ES",
                                            key: "S"
                                        })
                                    ],
                                    change: function (oEvent) {
                                        sap.ui.getCore().byId("inGroupHeader").setValue("");
                                        var selectedKey = oEvent.getSource().getSelectedKey();
                                        var oAppHeaderInput = sap.ui.getCore().byId("inGroupHeader");

                                        if (selectedKey === "EN") {
                                            oAppHeaderInput.setValue(oGroupHeader);
                                        } else {
                                            oAppHeaderInput.setValue('');
                                        }
                                    }
                                }),
                                new sap.m.Label({
                                    text: "{i18n>GroupHeader}"
                                }),
                                new sap.m.Input({
                                    id: "inGroupHeader",
                                    layoutData: new sap.m.FlexItemData({
                                        styleClass: "sapUiSmallMarginBottom"
                                    }),
                                    required: true,
                                })
                            ]
                        });

                        var oSubmitButton = new sap.m.Button({
                            text: "{i18n>Save}",
                            press: function () {
                                var bAllFieldsFilled = true;
                                var oModel = this.getModel();

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
                                    var selectedKey = sap.ui.getCore().byId("inGroupLangu").getSelectedKey();
                                    oEntry.GrpId = oSelected;
                                    oEntry.Langu = selectedKey;
                                    oEntry.GrpTitle = sap.ui.getCore().byId("inGroupHeader").getValue();

                                    oModel.create("/TranslationGroups", oEntry, {
                                        success: function (oData) {
                                            sap.m.MessageBox.success(that.getResourceBundle().getText("createtranslate"));
                                            this.byId("inGroupHeader").setValue("");
                                        }
                                    });
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
                            var oAppHeaderInput = sap.ui.getCore().byId("inGroupHeader");

                            oAppHeaderInput.setValue(oGroupHeader);
                        }

                        this.getView().addDependent(this.oResizableDialog);
                    }
                } else {
                    var that = this;
                    sap.m.MessageBox.warning(that.getResourceBundle().getText("selectRow"));
                }

                this.oResizableDialog.open();
            },

            onDeleteApp: function (oDelete) {
                var that = this;
                var oTable = this.byId("requestTableApps");
                var sPath = oTable.getSelectedContextPaths()[0];
                var oModel = this.getModel();
                var message = 'false';

                if (oDelete == true) {
                    message = 'true';
                }

                oModel.remove(sPath, {
                    headers: {
                        "message": message
                    },
                    success: function (oData, oResponse) {
                        // oResponse.headers.message
                        var oMessage = oResponse.headers.message;
                        if (oMessage != '') {
                            if (oMessage != 'Success') {
                                var oFullMessage = that.getView().getModel("i18n").getResourceBundle().getText("onAppsAssigned") + " " + oMessage + " " + that.getView().getModel("i18n").getResourceBundle().getText("onContinueAppsAssigned");
                                sap.m.MessageBox.confirm(oFullMessage, {
                                    icon: "WARNING",
                                    actions: ["Continue", sap.m.MessageBox.Action.CLOSE],
                                    emphasizedAction: "Continue",
                                    textDirection: sap.ui.core.TextDirection.Inherit,
                                    onClose: function (sAction) {
                                        if (sAction == 'Continue') {
                                            deleteCheck = true;
                                            that.onDeleteApp(deleteCheck);
                                        }
                                    }
                                });
                            } else {
                                sap.m.MessageBox.success(that.getView().getModel("i18n").getResourceBundle().getText("onDeleteSucess"));
                            }
                        }


                        // that.getModel().refresh(true);
                        // sap.m.MessageBox.success("Aplicação Eliminada");
                        // if (that.check) {
                        //     that.byId("btnActiveApp").setProperty("text", that.getView().getModel("i18n").getResourceBundle().getText("Disable"))
                        // }
                        // else {
                        //     that.byId("btnActiveApp").setProperty("text", that.getView().getModel("i18n").getResourceBundle().getText("Active"))
                        // }
                    },
                    error: function (e) {
                    }
                });
            }

        });
    });
