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
    function (BaseController, JSONModel, formatter, Popup, VBox, SimpleForm, ColumnListItem, MessageBox) {
        "use strict";

        var deleteCheck = false;

        var aTablesFields = [
            {
                id: "requestTable",
                icontabfilterID: "_IDGenIconTabFilter1",
                oStandard: "partner,usrid,name,UserTypeText,usr_email,status,last_logon",
                entitySet: "xTQAxUSR01_DD",
                smartFilterId: "smartFilterBarGroups",
                press: "onRequestTablePress",
                selectionChange: "onChangeSelection",
                oButtons: {
                    button1: {
                        id: "btCreate",
                        text: "i18n>Create",
                        press: "onCreateRequest",
                        type: "Emphasized"
                    },
                    button2: {
                        id: "btDelete",
                        text: "i18n>Delete",
                        press: "onDeleteRequest",
                    },
                    button3: {
                        id: "btUnlocked",
                        icon: "sap-icon://locked",
                        press: "onChangeStatus",
                    }
                }
            },
            {
                id: "requestTableApps",
                icontabfilterID: "_IdTabFilterAppsSettings",
                oStandard: "app_id,app_header,app_subheader,app_icon,app_link,grp_title,app_actived",
                entitySet: "xTQAxAPPLICATIONS_DD",
                smartFilterId: "",
                press: "onRequestAppTablePress",
                selectionChange: "onChangeSelectionApps",
                oButtons: {
                    button1: {
                        id: "btnCreateApp",
                        text: "i18n>Create",
                        press: "onCreateApp",
                        type: "Emphasized"
                    },
                    button3: {
                        id: "btnDeleteApp",
                        text: "i18n>Delete",
                        press: "onDeleteApp",
                        enabled: "Main>/appeditable"
                    },
                    button2: {
                        id: "btnTranslateApp",
                        text: "i18n>Translate",
                        press: "onTranslateApp",
                        enabled: "Main>/appeditable",
                    },
                    button4: {
                        id: "btnActiveApp",
                        text: "i18n>Active",
                        press: "onActiveApp",
                        enabled: "Main>/appeditable"
                    }
                }
            },
            {
                id: "requestTableGroups",
                icontabfilterID: "_IdTabFilterGroupSettings",
                oStandard: "grp_id,grp_title,created_by,created_at,changed_by,changet_at",
                entitySet: "xTQAxLAUNCHPAD_GROUP_VH",
                smartFilterId: "",
                press: "onRequestGroupTablePress",
                selectionChange: "onChangeSelectionGroups",
                oButtons: {
                    button1: {
                        id: "btnCreateGroup",
                        text: "i18n>Create",
                        press: "onCreateGroup",
                        type: "Emphasized"
                    },
                    button3: {
                        id: "btnDeleteGroup",
                        text: "i18n>Delete",
                        press: "onDeleteGroup",
                        enabled: "Main>/appeditable"
                    },
                    button2: {
                        id: "btnTranslateGroup",
                        text: "i18n>Translate",
                        press: "onTranslateGroup",
                        enabled: "Main>/groupeditable"
                    }
                }
            }
        ];


        return BaseController.extend("auths.controller.Main", {
            formatter: formatter,
            onInit: function () {
                var oViewModel = new JSONModel({
                    busy: false,
                    delay: 0,
                    oStandard: "partner,usrid,name,UserTypeText,usr_email,status,last_logon",
                    oSmartTableView: "",
                    variantInput: "Standard"
                }),
                    oModel = new JSONModel({
                        appeditable: false,
                        groupeditable: false
                    });

                sessionStorage.setItem("goToLaunchpad", "X");

                this.setModel(oViewModel, "mainView");
                this.getView().setModel(oModel, "Main");
                this.getRouter().attachRouteMatched(this.getUserAuthentication, this);
            },

            onBindingChange: function () {
                var oView = this.getView(),
                    oElementBinding = oView.getElementBinding();

                if (!oElementBinding.getBoundContext()) {
                    this.getRouter().getTargets().display("NotFound");

                    return;
                }
            },

            handleF5Pressed: function (oEvent) {
                if (oEvent.which === 116) {
                    oEvent.preventDefault();
                    var that = this,
                        selectedKey = this.getModel("global").getProperty("/selectedKey");

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
                sessionStorage.setItem("goToLaunchpad", "");
                this.getRouter().navTo("UserDetail", {
                    objectId: "xTQAxUSR01_DD(('000')".substring("/xTQAxUSR01_DD".length)
                });
            },

            onCreateApp: function () {
                sessionStorage.setItem("goToLaunchpad", "");
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
                                var roleName = dialog.getContent()[1].getValue();

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

                oDialog.open();
            },

            onChangeIconTabBar: function (oEvent) {
                var selectedKey = oEvent.oSource.getSelectedKey();

                if (selectedKey == "applications") {
                    this.onBuildSmartTable(aTablesFields[1]);
                } else if (selectedKey == "group-settings") {
                    this.onBuildSmartTable(aTablesFields[2]);
                }
                this.getModel("global").setProperty("/selectedKey", selectedKey);
            },

            onViewDetail: function () {
                var that = this,
                    oIconTabBar = this.byId("idIconTabBarMulti"),
                    selectedIndex = oIconTabBar.getSelectedKey();

                if (selectedIndex == "user-settings") {
                    that.onRequestTablePress();
                } else if (selectedIndex == "applications") {
                    that.onRequestAppTablePress();
                } else if (selectedIndex == "group-settings") {
                    that.onRequestGroupTablePress();
                }
            },

            onOpenPressed: function (oEvent) {
                sessionStorage.setItem("goToLaunchpad", "");
                var sPath = oEvent.getSource().getBindingContext().getPath();

                this.getModel("global").setProperty("/create", false);
                this.getRouter().navTo("Detail", {
                    objectId: sPath.substring("/AuthorizationsHeader".length)
                });
            },

            onChangeStatus: function () {
                var that = this,
                    oTable = sap.ui.getCore().byId("requestTable").getTable(),
                    sPath = oTable.getSelectedContextPaths()[0],
                    oModel = this.getModel(),
                    oObject = oModel.getObject(sPath);
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
                sessionStorage.setItem("goToLaunchpad", "");
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
                sap.ui.getCore().byId("btUnlocked").setProperty("icon", "sap-icon://locked");

                var selectedsPath = oEvent.oSource.getSelectedContextPaths(),
                    unlocked = true;

                selectedsPath.forEach(element => {
                    var oObject = this.getModel().getObject(element);
                    if (oObject.UsrStatus != "Blocked")
                        unlocked = false;
                });

                if (unlocked) {
                    sap.ui.getCore().byId("btUnlocked").setProperty("icon", "sap-icon://unlocked");
                    sap.ui.getCore().byId("btUnlocked").setProperty("enabled", true);
                }
                else {
                    sap.ui.getCore().byId("btUnlocked").setProperty("icon", "sap-icon://locked");
                    sap.ui.getCore().byId("btUnlocked").setProperty("enabled", true);
                }
            },


            onChangeSelectionGroups: function (oEvent) {
                var selectedPath = oEvent.oSource.getSelectedContextPaths()[0];
                this.getModel("Main").setProperty("/groupeditable", true);
            },


            onDeleteGroup: function () {
                var selectedPath = sap.ui.getCore().byId("requestTableGroups").getTable().getSelectedContextPaths()[0],
                    that = this,
                    oModel = this.getModel();

                oModel.remove(selectedPath, {
                    success: function (oData, oResponse) {
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
                    var selectedPath = oEvent.oSource.getBindingContextPath(),
                        oObject = this.getModel().getObject(selectedPath);
                } else {
                    var oTable = sap.ui.getCore().byId("requestTableGroups"),
                        sPath = oTable.getTable().getSelectedItem().getBindingContext().sPath,
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
                var that = this,
                    oModel = this.getModel(),
                    oEntry = {};

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
                var that = this,
                    oModel = this.getModel(),
                    oEntry = {};

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
                var selectedPath = oEvent.oSource.getSelectedContextPaths()[0],
                    oObject = this.getModel().getObject(selectedPath);

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
                    var oTable = sap.ui.getCore().byId("requestTableApps"),
                        sPath = oTable.getTable().getSelectedItem().getBindingContext().sPath;

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
                    var oTable = sap.ui.getCore().byId("requestTableGroups"),
                        sPath = oTable.getTable().getSelectedItem().getBindingContext().sPath;

                    this.getRouter().navTo("GroupDetail", {
                        objectId: sPath.substring("/xTQAxLAUNCHPAD_GROUP_VH".length)
                    });
                }
            },

            onActiveApp: function () {
                that.check = false;
                var that = this,
                    oTable = sap.ui.getCore.byId("requestTableApps"),
                    sPath = oTable.getTable().getSelectedContextPaths()[0],
                    oObject = this.getModel().getObject(sPath),
                    oModel = this.getModel(),
                    oEntry = {};

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
                var oTable = sap.ui.getCore().byId("requestTableApps"),
                    sElectedItem = oTable.getTable().getSelectedItem();

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
                var oTable = sap.ui.getCore().byId("requestTableGroups"),
                    sElectedItem = oTable.getTable().getSelectedItem();

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
                var that = this,
                    oTable = sap.ui.getCore().byId("requestTableApps"),
                    sPath = oTable.getTable().getSelectedContextPaths()[0],
                    oModel = this.getModel(),
                    message = 'false';

                if (oDelete == true) {
                    message = 'true';
                }

                oModel.remove(sPath, {
                    headers: {
                        "message": message
                    },
                    success: function (oData, oResponse) {
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
                    },
                    error: function (e) {
                    }
                });
            },

            onDeleteRequest: function () {
                var that = this,
                    oTable = sap.ui.getCore().byId("requestTable"),
                    sPath = oTable.getTable().getSelectedContextPaths()[0],
                    oModel = this.getModel(),
                    message = 'true';

                oModel.remove(sPath, {
                    headers: {
                        "message": message
                    },
                    success: function (oData, oResponse) {
                        sap.m.MessageBox.confirm("Utilizador Eliminado", {
                            icon: "SUCCESS",
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: "Continue",
                            textDirection: sap.ui.core.TextDirection.Inherit,
                        });
                    },
                    error: function (e) {
                    }
                });
            },





            onBeforeRendering: function () {
                this.onStartVariants();
            },

            onStartVariants: function () {
                var that = this,
                    oModel = this.getModel("vModel");

                oModel.read("/xTQAxUSR_VARIANTS_DD", {
                    success: function (oData) {
                        var oResults = oData.results;
                        oResults.forEach(element => {
                            if (element.v_default) {
                                that.getModel("mainView").setProperty("/variantInput", element.v_name)
                                that.getModel("mainView").setProperty("/selectedVariant", element.variant_id);

                                if (element.variant_id != "Main") {
                                    var visibleInFilterBar = JSON.parse(atob(element.fbar_settings));
                                    that.onUpdateFilterBar(visibleInFilterBar);

                                    var allFieldsInVariant = JSON.parse(atob(element.stable_settings));
                                    var allNames = allFieldsInVariant.map(function (obj) {
                                        return obj.name;
                                    }).join(',');

                                    // Remove a última vírgula, se necessário
                                    if (allNames.endsWith(',')) {
                                        allNames = allNames.substring(0, allNames.length - 1);
                                    }
                                    that.getModel("mainView").setProperty("/oSmartTableView", allNames);
                                    that.onBuildSmartTable(aTablesFields[0]);
                                }
                                else {
                                    that.getModel("mainView").setProperty("/oSmartTableView", that.getModel("mainView").getProperty("/oStandard"));
                                    that.onBuildSmartTable(aTablesFields[0]);
                                }
                            }
                        });
                    },
                    error: function (oError) {

                    }
                });
            },

            onBuildSmartTable: function (oTablesFields) {
                if (oTablesFields) {
                    var oOldSmartTable = sap.ui.getCore().byId(oTablesFields.id);
                    if (oOldSmartTable) {
                        oOldSmartTable.destroy();
                    }

                    var oDestroyedSmartTable = sap.ui.getCore().byId(oTablesFields.id);
                    if (!oDestroyedSmartTable) {
                        var oView = this.getView(),
                            oModel = this.getModel("mainView");

                        var oOverflowToolbar = new sap.m.OverflowToolbar({
                            design: "Transparent",
                        });

                        oOverflowToolbar.addContent(new sap.m.ToolbarSpacer());

                        for (var i = 1; i <= 4; i++) {
                            var buttonData = oTablesFields.oButtons['button' + i],
                                oButton;

                            if (buttonData) {
                                if (buttonData.text) {
                                    oButton = new sap.m.Button({
                                        id: buttonData.id + i,
                                        text: "{" + buttonData.text + "}",
                                        press: this[buttonData.press].bind(this),
                                        type: buttonData.type
                                    });
                                } else {
                                    oButton = new sap.m.Button({
                                        id: buttonData.id + i,
                                        icon: buttonData.icon,
                                        press: this[buttonData.press].bind(this)
                                    });
                                }

                                oOverflowToolbar.addContent(oButton);
                            } else {
                                break;
                            }
                        }

                        var oSmartTable = new sap.ui.comp.smarttable.SmartTable({
                            id: oTablesFields.id,
                            entitySet: oTablesFields.entitySet,
                            smartFilterId: oTablesFields.smartFilterId,
                            tableType: "ResponsiveTable",
                            header: "{i18n>entries}",
                            showRowCount: true,
                            customToolbar: oOverflowToolbar,
                            enableAutoBinding: true,
                            initialise: function () {
                                this.onSTinitialise.bind(this);
                                var oTable = oSmartTable.getTable();
                                oTable.setMode("SingleSelectLeft");
                                oTable.attachSelectionChange(this[oTablesFields.selectionChange].bind(this));

                                oTable.attachUpdateFinished(function () {
                                    var oItems = oTable.getItems();
                                    if (oItems.length > 0) {

                                        oItems.forEach(oItem => {
                                            if (oItem instanceof sap.m.ColumnListItem) {
                                                oItem.setType("Navigation");
                                                oItem.attachPress(this[oTablesFields.press].bind(this));
                                            }
                                        });
                                    }

                                }.bind(this));

                            }.bind(this),
                            beforeRebindTable: this.onBeforeRebindTable.bind(this),
                            initiallyVisibleFields: oTablesFields.oStandard
                        }).addStyleClass("sapUiSmallMarginTop");

                        var oAggregation = oView.byId(oTablesFields.icontabfilterID);
                        oAggregation.addContent(oSmartTable);

                        var oToolbar = new sap.m.OverflowToolbar({
                        });
                        oSmartTable.setCustomToolbar(oToolbar);
                    }
                }
            },

            onRouteMatched: function () {
                this.getUserAuthentication();
            },

            onFBarInitialise: function (oEvent) {
                var filterGroupItems = this.byId("smartFilterBarGroups").getFilterGroupItems(),
                    activeFiltersArray = [];

                filterGroupItems.forEach(function (item) {
                    if (item.mProperties.visibleInFilterBar) {
                        var filterInfo = {
                            name: item.mProperties.name,
                            visibleInFilterBar: item.mProperties.visibleInFilterBar
                        };
                        activeFiltersArray.push(filterInfo);
                    }
                });
                this.getModel("mainView").setProperty("/vStandard", activeFiltersArray);
            },

            onSTinitialise: function (oEvent) {
                var that = this,
                    oSmartTable = oEvent.getSource(),
                    oInnerTable = oSmartTable.getTable(),
                    aColumnData = [],
                    aColumns = oInnerTable.getColumns();

                aColumns.forEach(function (oColumn) {
                    var lastIndex = oColumn.sId.lastIndexOf('-');

                    if (lastIndex !== -1) {
                        var oName = oColumn.sId.substring(lastIndex + 1);
                    }
                    aColumnData.push({
                        name: oName
                    });
                });

                that.getModel("mainView").setProperty("/vSmartTableStandard", aColumnData);
            },


            onBeforeRebindTable: function (oEvent) {
                var that = this,
                    oSmartTable = oEvent.getSource(),
                    oInnerTable = oSmartTable.getTable(),
                    aNewColumnData = [],
                    aColumns = oInnerTable.getColumns();

                aColumns.forEach(function (oColumn) {
                    var lastIndex = oColumn.sId.lastIndexOf('-');

                    if (lastIndex !== -1) {
                        var oName = oColumn.sId.substring(lastIndex + 1);
                    }
                    if (oColumn.getVisible())
                        aNewColumnData.push({
                            name: oName
                        });
                });

                var isDifferent = this.checkArrayDifference(this.getModel("mainView").getProperty("/oSmartTableView"), aNewColumnData);
                if (isDifferent) {
                    var oInput = this.byId("variantInput"),
                        activeFiltersJSON = JSON.stringify(aNewColumnData),
                        activeFiltersBtoa = btoa(activeFiltersJSON);

                    this.getModel("mainView").setProperty("/SmartTableBtoa", activeFiltersBtoa);
                }
            },

            checkArrayDifference: function (a, b) {
                if (a.length !== b.length) {
                    return false;
                }

                var sortedA = a.slice().sort(),
                    sortedB = b.slice().sort();

                for (var i = 0; i < sortedA.length; i++) {
                    if (sortedA[i] !== sortedB[i]) {
                        return false;
                    }
                }

                return true;
            },

            onUpdateFilterBar: function (fbSettings) {
                var filterGroupItems = this.byId("smartFilterBarGroups").getFilterGroupItems();

                this.byId("smartFilterBarGroups").clear();

                filterGroupItems.forEach(oItem => {
                    oItem.setVisibleInFilterBar(false);
                });

                fbSettings.forEach(function (savedFilter) {
                    filterGroupItems.forEach(function (filterItem) {
                        if (savedFilter.name === filterItem.getName()) {
                            filterItem.setVisibleInFilterBar(true);

                            var control = filterItem.getControl();
                            var aFilters = savedFilter.aFilters;

                            if (aFilters && aFilters.length > 0) {
                                var filter = aFilters[0];
                                if (control instanceof sap.m.Input || control instanceof sap.m.MultiInput) {
                                    control.setValue("*" + filter.oValue1 + "*");
                                }
                                else if (control instanceof sap.m.Select || control instanceof sap.m.ComboBox) {
                                    control.setSelectedKey(filter.oValue1);
                                }
                                else if (control instanceof sap.m.CheckBox) {
                                    control.setSelected(filter.oValue1 === "true" || filter.oValue1 === true);
                                }
                            }
                        }
                    });
                });

            },

            onShowVariantList: function (oEvent) {
                var that = this,
                    oModel = this.getModel("vModel");

                if (!this._oPopover) {
                    var oList = new sap.m.List();
                    oList.setModel(oModel);
                    oList.bindItems({
                        path: "/xTQAxUSR_VARIANTS_DD",
                        template: new sap.m.StandardListItem({
                            title: "{v_name}"
                        })
                    });

                    oList.setMode(sap.m.ListMode.SingleSelectMaster);

                    oList.attachUpdateFinished(function () {
                        this.getItems().forEach(function (item) {
                            item.removeStyleClass("sapMSelectListItemBaseSelected");
                        });
                        this.getItems().forEach(function (item) {

                            var oBindingContext = item.getBindingContext();
                            var variant_id = oBindingContext.getProperty("variant_id");
                            var selectedV = that.getModel("mainView").getProperty("/selectedVariant");
                            if (!selectedV) {
                                if (variant_id === "Main") {
                                    item.addStyleClass("sapMSelectListItemBaseSelected");
                                }
                            }
                            else {
                                if (variant_id === selectedV) {
                                    item.addStyleClass("sapMSelectListItemBaseSelected");
                                    that.byId("variantInput").setValue(oBindingContext.getProperty("v_name"));
                                }
                            }
                        });
                    });

                    oList.attachSelectionChange(function (oEvent) {
                        this.getItems().forEach(function (item) {
                            item.removeStyleClass("sapMSelectListItemBaseSelected");
                        });

                        var oListItem = oEvent.getParameter("listItem");
                        oListItem.addStyleClass("sapMSelectListItemBaseSelected");

                        var oBindingContext = oListItem.getBindingContext();
                        var selectedVariant = oBindingContext.getProperty("variant_id");

                        that.getModel("mainView").setProperty("/selectedVariant", selectedVariant);
                        that.byId("variantInput").setValue(oBindingContext.getProperty("v_name"));

                        if (selectedVariant != "Main") {
                            var oObject = that.getModel("vModel").getObject(oBindingContext.sPath),
                                filterBarAtob = atob(oObject.fbar_settings),
                                filterBarArray = JSON.parse(filterBarAtob);
                            that.onUpdateFilterBar(filterBarArray);

                            var allFieldsInVariant = JSON.parse(atob(oObject.stable_settings));
                            var allNames = allFieldsInVariant.map(function (obj) {
                                return obj.name;
                            }).join(',');

                            // Remove a última vírgula, se necessário
                            if (allNames.endsWith(',')) {
                                allNames = allNames.substring(0, allNames.length - 1);
                            }

                            that.getModel("mainView").setProperty("/oSmartTableView", allNames);
                            that.onBuildSmartTable(aTablesFields[0]);
                        }
                        else {
                            that.onUpdateFilterBar(that.getModel("mainView").getProperty("/vStandard"));
                            that.getModel("mainView").setProperty("/oSmartTableView", that.getModel("mainView").getProperty("/oStandard"));
                            that.onBuildSmartTable(aTablesFields[0]);
                        }
                        that._oPopover.close();
                    });


                    this._oPopover = new sap.m.ResponsivePopover({
                        contentWidth: "25%",
                        title: this.getView().getModel("i18n").getResourceBundle().getText("MyViews"),
                        placement: "Bottom",
                        beginButton: new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("SaveAs"),
                            type: "Emphasized",
                            press: function () {
                                that.onBeforeSaveVariant();
                                this._oPopover.close();
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("Manage"),
                            press: function () {
                                that.onManageViews();
                                this._oPopover.close();
                            }.bind(this)
                        }),
                        content: [oList]
                    });
                }

                this._oPopover.openBy(oEvent.getSource());
            },

            onManageViews: function () {
                if (!this._oManageDialog) {
                    var oModel = this.getModel("vModel")
                    var oSearchBar = new sap.m.SearchField({
                        width: "100%",
                        placeholder: this.getView().getModel("i18n").getResourceBundle().getText("Search"),
                        liveChange: function (oEvent) {

                            var sQuery = oEvent.oSource.getValue();
                            var oFilter = new sap.ui.model.Filter("v_name", sap.ui.model.FilterOperator.Contains, sQuery);
                            oTable.getBinding("items").filter([oFilter]);
                        }
                    });

                    var oTable = new sap.m.Table({
                        columns: [
                            new sap.m.Column({ header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("VariantName") }) }),
                            new sap.m.Column({ header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Default") }) }),
                            new sap.m.Column({ header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("CreatedAt") }) }),
                            new sap.m.Column({ header: new sap.m.Label({ text: "" }) })
                        ]
                    });
                    oTable.setModel(oModel);

                    oTable.bindItems({
                        path: "/xTQAxUSR_VARIANTS_DD",
                        template: new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.Text({ text: "{v_name}" }),
                                new sap.m.CheckBox({
                                    enabled: {
                                        path: 'variant_id',
                                        formatter: function (value) {
                                            if (value == "Main")
                                                return false;
                                        }
                                    },
                                    selected: "{v_default}",
                                    select: function (oEvent) {
                                        var oCheckBox = oEvent.getSource();
                                        var oContext = oCheckBox.getBindingContext();
                                        var selectedState = oCheckBox.getSelected();

                                        var oEntry = {};
                                        oEntry.v_default = selectedState;

                                        oModel.update(oContext.sPath, oEntry, {
                                            success: function (oCreatedData) {
                                                oModel.refresh(true);
                                            },
                                            error: function (oError) {

                                            }
                                        });
                                    }
                                }),
                                new sap.m.Text({
                                    text: {
                                        path: "created_at",
                                        type: new sap.ui.model.type.Date({
                                            pattern: "dd-MM-yyyy"
                                        })
                                    }
                                }),
                                new sap.m.Button({
                                    icon: "sap-icon://decline",
                                    visible: {
                                        path: 'v_name',
                                        formatter: function (variantName) {
                                            if (variantName == "Standard") {
                                                return false;
                                            }
                                        }
                                    },
                                    press: function (oEvent) {
                                        var oCheckBox = oEvent.getSource();
                                        var oContext = oCheckBox.getBindingContext();

                                        oModel.remove(oContext.sPath, {
                                            success: function (oCreatedData) {
                                            },
                                            error: function (oError) {
                                            }
                                        });
                                    }
                                })
                            ]
                        })
                    });

                    this._oManageDialog = new sap.m.Dialog({
                        title: this.getView().getModel("i18n").getResourceBundle().getText("Manageviews"),
                        content: [oSearchBar, oTable],
                        beginButton: new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("Close"),
                            press: function () {
                                this._oManageDialog.close();
                            }.bind(this)
                        })
                    });
                }

                this._oManageDialog.open();
            },

            onBeforeSaveVariant: function () {
                var that = this;
                var oVariantName = new sap.m.Input({
                    id: "inVariantName"
                });

                var oCheckBox = new sap.m.CheckBox({
                    text: this.getView().getModel("i18n").getResourceBundle().getText("SetDefault")
                });

                var oDialog = new sap.m.Dialog({
                    title: this.getView().getModel("i18n").getResourceBundle().getText("SaveView"),
                    content: [
                        new sap.ui.layout.form.SimpleForm({
                            editable: true,
                            layout: "ResponsiveGridLayout",
                            content: [
                                new sap.m.Label({
                                    text: this.getView().getModel("i18n").getResourceBundle().getText("View")
                                }),
                                oVariantName,
                                oCheckBox
                            ]
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("Save"),
                            type: "Emphasized",
                            press: function () {
                                that.onSaveVariant(oVariantName.getValue(), oCheckBox.getSelected());
                                oDialog.destroy();
                            }
                        }),
                        new sap.m.Button({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("Close"),
                            press: function () {
                                oDialog.close();
                                oDialog.destroy();
                            }
                        })
                    ]
                });

                oDialog.open();
            },

            onSaveVariant: function (VariantName, vDefault) {
                var that = this,
                    oModel = this.getModel("vModel"),
                    oEntry = {},
                    oFilterBarContext = [],
                    oFilterBar = this.byId("smartFilterBarGroups"),
                    filterGroupItems = oFilterBar.getFilterGroupItems(),
                    activeFiltersArray = [];

                filterGroupItems.forEach(function (item) {
                    if (item.mProperties.visibleInFilterBar) {
                        var filterInfo = {
                            name: item.mProperties.name,
                            visibleInFilterBar: item.mProperties.visibleInFilterBar
                        };
                        activeFiltersArray.push(filterInfo);
                    }
                });

                var activeFiltersJSON = JSON.stringify(activeFiltersArray),
                    activeFiltersBtoa = btoa(activeFiltersJSON);

                this.getModel("mainView").setProperty("/fbarBtoa", activeFiltersBtoa);
                var oFilterAvailable = JSON.parse(atob(this.getModel("mainView").getProperty("/fbarBtoa")));

                oFilterBar.getFilters().forEach(element => {
                    var aFilters = element.aFilters;

                    var oMatchingFilter = oFilterAvailable.find(fs => fs.name === aFilters[0]?.sPath);

                    if (oMatchingFilter) {
                        oMatchingFilter.aFilters = aFilters.length > 0 ? aFilters : " ";

                    }
                });

                oEntry.v_name = VariantName;

                if (this.getModel("mainView").getProperty("/fbarBtoa"))
                    oEntry.fbar_settings = btoa(JSON.stringify(oFilterAvailable));
                else
                    oEntry.fbar_settings = btoa(JSON.stringify(this.getModel("mainView").getProperty("/vStandard")));
                if (this.getModel("mainView").getProperty("/SmartTableBtoa")) {
                    oEntry.stable_settings = this.getModel("mainView").getProperty("/SmartTableBtoa");
                }
                else {
                    var oTable = sap.ui.getCore().byId("usersTable").getTable(),
                        aColumnData = [],
                        aColumns = oTable.getColumns();

                    aColumns.forEach(function (oColumn) {
                        var lastIndex = oColumn.sId.lastIndexOf('-');

                        if (lastIndex !== -1) {
                            var oName = oColumn.sId.substring(lastIndex + 1);
                        }
                        if (oColumn.getVisible())
                            aColumnData.push({
                                name: oName
                            });
                    });

                    oEntry.stable_settings = btoa(JSON.stringify(aColumnData));
                }
                oEntry.app_link = 'AUTHORIZATIONS';
                oEntry.v_default = vDefault;

                oModel.create("/xTQAxUSR_VARIANTS_DD", oEntry, {
                    success: function (oCreatedData) {
                        that.getModel("mainView").setProperty("/selectedVariant", oCreatedData.variant_id);
                    },
                    error: function (oError) {

                    }
                });
            },

            onFilterChange: function (oEvent) {
                var filterGroupItems = oEvent.oSource.getFilterGroupItems(),
                    activeFiltersArray = [];

                filterGroupItems.forEach(function (item) {
                    if (item.mProperties.visibleInFilterBar) {
                        var filterInfo = {
                            name: item.mProperties.name,
                            visibleInFilterBar: item.mProperties.visibleInFilterBar
                        };
                        activeFiltersArray.push(filterInfo);
                    }
                });

                var activeFiltersJSON = JSON.stringify(activeFiltersArray),
                    activeFiltersBtoa = btoa(activeFiltersJSON);
                this.getModel("mainView").setProperty("/fbarBtoa", activeFiltersBtoa);

            },

        });
    });
