sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/core/Popup","sap/m/VBox","sap/ui/layout/form/SimpleForm","sap/m/ColumnListItem","sap/m/MessageBox"],function(e,t,s,a,o,i,n,r){"use strict";var l=false;return e.extend("auths.controller.Main",{formatter:s,onInit:function(){var e=new t({appeditable:false,groupeditable:false});this.getView().setModel(e,"Main");document.addEventListener("keydown",this.handleF5Pressed.bind(this))},handleF5Pressed:function(e){if(e.which===116){e.preventDefault();var t=this;var s=this.getModel("global").getProperty("/selectedKey");if(s==="user-settings"||!s){t.onCreateRequest()}else if(s==="role"){t.onAddRole()}else if(s==="applications"){t.onCreateApp()}else if(s==="group-settings"){t.onCreateGroup()}}else if(e.which===118){var t=this;t.onViewDetail()}},onCreateRequest:function(){this.getRouter().navTo("UserDetail",{objectId:"xTQAxUSR01_DD(('000')".substring("/xTQAxUSR01_DD".length)})},onCreateApp:function(){this.getRouter().navTo("AppDetail",{objectId:"xTQAxAPPLICATIONS_DD(('000')".substring("/xTQAxAPPLICATIONS_DD".length)})},onAddRole:function(){var e=this;var t=new sap.m.Dialog({type:sap.m.DialogType.Message,title:this.getView().getModel("i18n").getResourceBundle().getText("CreateNewRole"),content:[new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("RoleName")}).addStyleClass("dialog-label"),new sap.m.Input({width:"100%"}).addStyleClass("dialog-input")],buttons:[new sap.m.Button({text:this.getView().getModel("i18n").getResourceBundle().getText("Create"),press:function(){var s=t.getContent()[1].getValue();e.getModel("global").setProperty("/newRole",s);e.getModel("global").setProperty("/create","true");t.close();var a="/AuthorizationsHeader('999')";e.getRouter().navTo("Detail",{objectId:a.substring("/AuthorizationsHeader".length)})}}),new sap.m.Button({text:this.getView().getModel("i18n").getResourceBundle().getText("Cancel"),press:function(){t.close()}})],afterClose:function(){t.destroy()}});t.open()},onCreateGroup:function(){var e=this;var t=new sap.m.Dialog({type:sap.m.DialogType.Message,title:e.getView().getModel("i18n").getResourceBundle().getText("CreateGroup"),content:[new sap.m.Label({text:e.getView().getModel("i18n").getResourceBundle().getText("GrpName")}),new sap.m.Input({id:"groupNameInput"})],buttons:[new sap.m.Button({text:e.getView().getModel("i18n").getResourceBundle().getText("Create"),press:function(){var s=sap.ui.getCore().byId("groupNameInput").getValue();e.onCreateGroupRequest(s);t.destroy();t.close()}}),new sap.m.Button({text:e.getView().getModel("i18n").getResourceBundle().getText("Cancel"),press:function(){t.close();t.destroy()}})]});t.open()},onChangeIconTabBar:function(e){var t=e.oSource.getSelectedKey();this.getModel("global").setProperty("/selectedKey",t)},onViewDetail:function(){var e=this;var t=this.byId("idIconTabBarMulti");var s=t.getSelectedKey();if(s=="user-settings"){e.onRequestTablePress()}else if(s=="applications"){e.onRequestAppTablePress()}else if(s=="group-settings"){e.onRequestGroupTablePress()}},onOpenPressed:function(e){var t=e.getSource().getBindingContext().getPath();this.getModel("global").setProperty("/create",false);this.getRouter().navTo("Detail",{objectId:t.substring("/AuthorizationsHeader".length)})},onChangeStatus:function(){var e=this;var t=this.byId("requestTable");var s=t.getSelectedContextPaths()[0];var a=this.getModel();var o=a.getObject(s);delete o.__metadata;o.UsrStatus="change";a.update(s,o,{success:function(t){e.getModel().refresh(true);sap.m.MessageBox.success("Utilizador Atualizado")},error:function(e){}})},onRequestTablePress:function(e){if(e){var t=e.getSource().getBindingContextPath();this.getRouter().navTo("UserDetail",{objectId:t.substring("/xTQAxUSR01_DD".length)})}else{var s=this.byId("requestTable"),t=s.getSelectedItem().getBindingContext().sPath;this.getRouter().navTo("UserDetail",{objectId:t.substring("/xTQAxUSR01_DD".length)})}},onChangeSelection:function(e){this.byId("btUnlocked").setProperty("icon","sap-icon://locked");var t=e.oSource.getSelectedContextPaths();var s=true;t.forEach(e=>{var t=this.getModel().getObject(e);if(t.UsrStatus!="Blocked")s=false});if(s){this.byId("btUnlocked").setProperty("icon","sap-icon://unlocked");this.byId("btUnlocked").setProperty("enabled",true)}else{this.byId("btUnlocked").setProperty("icon","sap-icon://locked");this.byId("btUnlocked").setProperty("enabled",true)}},onChangeSelectionGroups:function(e){var t=e.oSource.getSelectedContextPaths()[0];this.getModel("Main").setProperty("/groupeditable",true)},onDeleteGroup:function(){var e=this.byId("requestTableGroups").getSelectedContextPaths()[0];var t=this;var s=this.getModel();s.remove(e,{success:function(e,s){if(s.headers.message!=""){var a=t.getView().getModel("i18n").getResourceBundle().getText("onGroupsAssigned")+" "+s.headers.message;sap.m.MessageBox.information(a)}else{sap.m.MessageBox.success(t.getView().getModel("i18n").getResourceBundle().getText("onDeleteSucessGroup"))}},error:function(e){}})},onRequestGroupTablePress2:function(e){var t=this;if(e){var s=e.oSource.getBindingContextPath();var a=this.getModel().getObject(s)}else{var o=this.byId("requestTableGroups"),i=o.getSelectedItem().getBindingContext().sPath,a=o.getModel().getObject(i)}var n=new sap.m.Dialog({type:sap.m.DialogType.Message,title:t.getView().getModel("i18n").getResourceBundle().getText("GrpSettings"),content:[new sap.m.Label({text:t.getView().getModel("i18n").getResourceBundle().getText("GrpName")}),new sap.m.Input({id:"groupNameInput",value:a.grp_title})],buttons:[new sap.m.Button({text:t.getView().getModel("i18n").getResourceBundle().getText("Change"),press:function(){var e=sap.ui.getCore().byId("groupNameInput").getValue();t.onSaveGroup(e,s);n.destroy();n.close()}}),new sap.m.Button({text:t.getView().getModel("i18n").getResourceBundle().getText("Cancel"),press:function(){n.close();n.destroy()}})]});n.open()},onSaveGroup:function(e,t){var s=this;var a=this.getModel();var o={};o.grp_title=e;a.update(t,o,{success:function(e){s.getModel().refresh(true);sap.m.MessageBox.success("Grupo Atualizado")},error:function(e){}})},onCreateGroupRequest:function(e){var t=this;var s=this.getModel();var a={};a.grp_title=e;s.create("/xTQAxLAUNCHPAD_GROUP_VH",a,{success:function(e){t.getModel().refresh(true)},error:function(e){var t=JSON.parse(e.responseText).error.message.value;sap.m.MessageBox.alert(t,{icon:"ERROR",onClose:null,styleClass:"",initialFocus:null,textDirection:sap.ui.core.TextDirection.Inherit})}})},onChangeSelectionApps:function(e){var t=e.oSource.getSelectedContextPaths()[0];var s=this.getModel().getObject(t);if(t){this.getModel("Main").setProperty("/appeditable",true);if(s.app_actived){this.byId("btnActiveApp").setProperty("text",this.getView().getModel("i18n").getResourceBundle().getText("Disable"))}else{this.byId("btnActiveApp").setProperty("text",this.getView().getModel("i18n").getResourceBundle().getText("Active"))}}else{this.getModel("Main").setProperty("/appeditable",false)}},onRequestAppTablePress:function(e){if(e){var t=e.getSource().getBindingContextPath();this.getRouter().navTo("AppDetail",{objectId:t.substring("/xTQAxAPPLICATIONS_DD".length)})}else{var s=this.byId("requestTableApps"),t=s.getSelectedItem().getBindingContext().sPath;this.getRouter().navTo("AppDetail",{objectId:t.substring("/xTQAxAPPLICATIONS_DD".length)})}},onRequestGroupTablePress:function(e){if(e){var t=e.getSource().getBindingContextPath();this.getRouter().navTo("GroupDetail",{objectId:t.substring("/xTQAxLAUNCHPAD_GROUP_VH".length)})}else{var s=this.byId("requestTableGroups"),t=s.getSelectedItem().getBindingContext().sPath;this.getRouter().navTo("GroupDetail",{objectId:t.substring("/xTQAxLAUNCHPAD_GROUP_VH".length)})}},onActiveApp:function(){var e=this;e.check=false;var t=this.byId("requestTableApps");var s=t.getSelectedContextPaths()[0];var a=this.getModel().getObject(s);var o=this.getModel();var i={};delete a.__metadata;if(a.app_actived)i.app_actived=false;else{e.check=true;i.app_actived=true}o.update(s,i,{success:function(t){e.getModel().refresh(true);sap.m.MessageBox.success("Aplicação Atualizada");if(e.check){e.byId("btnActiveApp").setProperty("text",e.getView().getModel("i18n").getResourceBundle().getText("Disable"))}else{e.byId("btnActiveApp").setProperty("text",e.getView().getModel("i18n").getResourceBundle().getText("Active"))}},error:function(e){}});if(e.check){if(i.app_actived){this.byId("btnActiveApp").setProperty("text",this.getView().getModel("i18n").getResourceBundle().getText("Disable"))}else{this.byId("btnActiveApp").setProperty("text",this.getView().getModel("i18n").getResourceBundle().getText("Active"))}}},onTranslateApp:function(){var e=this.byId("requestTableApps"),t=e.getSelectedItem();if(t){var s=t.getBindingContext().sPath,a=this.getModel().getObject(s),o=a.app_id,n=a.app_header,r=a.app_subheader;if(!this.oResizableDialog){var l=new i({layout:"ResponsiveGridLayout",content:[new sap.m.Label({text:"{i18n>AppLangu}"}),new sap.m.Select({id:"inAppLangu",layoutData:new sap.m.FlexItemData({styleClass:"sapUiSmallMarginBottom"}),required:true,items:[new sap.ui.core.Item({text:"EN",key:"EN"}),new sap.ui.core.Item({text:"PT",key:"PT"}),new sap.ui.core.Item({text:"ES",key:"S"})],change:function(e){sap.ui.getCore().byId("inAppHeader").setValue("");sap.ui.getCore().byId("inAppSubHeader").setValue("");var t=e.getSource().getSelectedKey();var s=sap.ui.getCore().byId("inAppHeader");var a=sap.ui.getCore().byId("inAppSubHeader");if(t==="EN"){s.setValue(n);a.setValue(r)}else{s.setValue("");a.setValue("")}}}),new sap.m.Label({text:"{i18n>AppHeader}"}),new sap.m.Input({id:"inAppHeader",layoutData:new sap.m.FlexItemData({styleClass:"sapUiSmallMarginBottom"}),required:true}),new sap.m.Label({text:"{i18n>AppSubHeader}"}),new sap.m.Input({id:"inAppSubHeader",layoutData:new sap.m.FlexItemData({styleClass:"sapUiSmallMarginBottom"}),required:true})]});var u=new sap.m.Button({text:"{i18n>Save}",press:function(){var e=true;var t=this.getModel();l.getContent().forEach(function(t){if(t instanceof sap.m.Input){if(t.getRequired()&&!t.getValue()){e=false;t.setValueState("Error");return false}else{t.setValueState("None")}}});if(e){var s={};var a=this;var i=sap.ui.getCore().byId("inAppLangu").getSelectedKey();s.APP_ID=o;s.Langu=i;s.AppHeader=sap.ui.getCore().byId("inAppHeader").getValue();s.AppSubheader=sap.ui.getCore().byId("inAppSubHeader").getValue();t.create("/Translations",s,{success:function(e){sap.m.MessageBox.success(a.getResourceBundle().getText("createtranslate"))}})}}.bind(this)});var g=new sap.m.Button({text:"{i18n>close}",press:function(){this.oResizableDialog.close();this.oResizableDialog.destroy();this.oResizableDialog.destroy();this.oResizableDialog=null}.bind(this)});this.oResizableDialog=new sap.m.Dialog({title:"{i18n>Translate}",contentWidth:"440px",contentHeight:"430px",resizable:true,content:[l],buttons:[u,g]});if(this.oResizableDialog){var p=sap.ui.getCore().byId("inAppHeader");var d=sap.ui.getCore().byId("inAppSubHeader");p.setValue(n);d.setValue(r)}this.getView().addDependent(this.oResizableDialog)}}else{sap.m.MessageBox.warning("Por favor selecione uma aplicação para traduzir!")}this.oResizableDialog.open()},onTranslateGroup:function(){var e=this.byId("requestTableGroups"),t=e.getSelectedItem();if(t){var s=t.getBindingContext().sPath,a=this.getModel().getObject(s),o=a.grp_id,n=a.grp_title;if(!this.oResizableDialog){var r=new i({layout:"ResponsiveGridLayout",content:[new sap.m.Label({text:"{i18n>AppLangu}"}),new sap.m.Select({id:"inGroupLangu",layoutData:new sap.m.FlexItemData({styleClass:"sapUiSmallMarginBottom"}),required:true,items:[new sap.ui.core.Item({text:"EN",key:"EN"}),new sap.ui.core.Item({text:"PT",key:"PT"}),new sap.ui.core.Item({text:"ES",key:"S"})],change:function(e){sap.ui.getCore().byId("inGroupHeader").setValue("");var t=e.getSource().getSelectedKey();var s=sap.ui.getCore().byId("inGroupHeader");if(t==="EN"){s.setValue(n)}else{s.setValue("")}}}),new sap.m.Label({text:"{i18n>GroupHeader}"}),new sap.m.Input({id:"inGroupHeader",layoutData:new sap.m.FlexItemData({styleClass:"sapUiSmallMarginBottom"}),required:true})]});var l=new sap.m.Button({text:"{i18n>Save}",press:function(){var e=true;var t=this.getModel();r.getContent().forEach(function(t){if(t instanceof sap.m.Input){if(t.getRequired()&&!t.getValue()){e=false;t.setValueState("Error");return false}else{t.setValueState("None")}}});if(e){var s={};var a=sap.ui.getCore().byId("inGroupLangu").getSelectedKey();s.GrpId=o;s.Langu=a;s.GrpTitle=sap.ui.getCore().byId("inGroupHeader").getValue();t.create("/TranslationGroups",s,{success:function(e){sap.m.MessageBox.success(p.getResourceBundle().getText("createtranslate"));this.byId("inGroupHeader").setValue("")}})}}.bind(this)});var u=new sap.m.Button({text:"{i18n>close}",press:function(){this.oResizableDialog.close();this.oResizableDialog.destroy();this.oResizableDialog.destroy();this.oResizableDialog=null}.bind(this)});this.oResizableDialog=new sap.m.Dialog({title:"{i18n>Translate}",contentWidth:"440px",contentHeight:"430px",resizable:true,content:[r],buttons:[l,u]});if(this.oResizableDialog){var g=sap.ui.getCore().byId("inGroupHeader");g.setValue(n)}this.getView().addDependent(this.oResizableDialog)}}else{var p=this;sap.m.MessageBox.warning(p.getResourceBundle().getText("selectRow"))}this.oResizableDialog.open()},onDeleteApp:function(e){var t=this;var s=this.byId("requestTableApps");var a=s.getSelectedContextPaths()[0];var o=this.getModel();var i="false";if(e==true){i="true"}o.remove(a,{headers:{message:i},success:function(e,s){var a=s.headers.message;if(a!=""){if(a!="Success"){var o=t.getView().getModel("i18n").getResourceBundle().getText("onAppsAssigned")+" "+a+" "+t.getView().getModel("i18n").getResourceBundle().getText("onContinueAppsAssigned");sap.m.MessageBox.confirm(o,{icon:"WARNING",actions:["Continue",sap.m.MessageBox.Action.CLOSE],emphasizedAction:"Continue",textDirection:sap.ui.core.TextDirection.Inherit,onClose:function(e){if(e=="Continue"){l=true;t.onDeleteApp(l)}}})}else{sap.m.MessageBox.success(t.getView().getModel("i18n").getResourceBundle().getText("onDeleteSucess"))}}},error:function(e){}})}})});
//# sourceMappingURL=Main.controller.js.map