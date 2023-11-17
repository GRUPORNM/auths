sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("auths.controller.Detail",{onInit:function(){var e=new t;this.getView().setModel(e,"Detail");this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched,this)},onNavBack:function(){this.getRouter().navTo("RouteMain")},_onObjectMatched:function(e){var t="/AuthorizationsHeader"+e.getParameter("arguments").objectId;this._bindView(t)},_requestAllapps:function(e){var t=this;var a=this.getModel();this.getModel("Detail").setProperty("/sPath",e);var r={$expand:"AuthorizationItems"};a.read(e,{urlParameters:r,success:function(e,a){t._loadAllapps(e.AuthorizationItems.results)},error:function(e){console.error("Erro na solicitação:",e)}})},getGroupHeader:function(e){return new GroupHeaderListItem({title:e.key,upperCase:false})},_loadAllapps:function(e){var t=this.byId("vbContent");t.destroyItems();var a=this;var r=new sap.m.Table({id:"itContent",mode:sap.m.ListMode.Emphasized,headerToolbar:new sap.m.Toolbar({content:[new sap.m.Title({text:this.getView().getModel("i18n").getResourceBundle().getText("applicationconfiguration")})]})});r.addColumn(new sap.m.Column({mergeDuplicates:true,header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("GrpTitle")})}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("AppHeader")})}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("AppSubheader")})}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("AppFooter")})}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("Creatable")}),hAlign:sap.ui.core.TextAlign.Center}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("Readable")}),hAlign:sap.ui.core.TextAlign.Center}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("Updatable")}),hAlign:sap.ui.core.TextAlign.Center}));r.addColumn(new sap.m.Column({header:new sap.m.Label({text:this.getView().getModel("i18n").getResourceBundle().getText("Deletable")}),hAlign:sap.ui.core.TextAlign.Center}));var n=new sap.ui.model.json.JSONModel;n.setData({apps:e});r.setModel(n);r.bindItems("/apps",new sap.m.ColumnListItem({cells:[new sap.m.Text({text:"{GrpTitle}"}),new sap.m.HBox({items:[new sap.ui.core.Icon({src:"{AppIcon}",size:"1rem"}),new sap.m.Text({text:"{AppHeader}",wrapping:false,layoutData:new sap.m.FlexItemData({growFactor:1})}).addStyleClass("sapUiTinyMarginBegin")]}),new sap.m.Text({text:"{AppSubheader}"}),new sap.m.Text({text:"{AppFooter}"}),new sap.m.CheckBox({selected:{path:"Creatable",formatter:function(e){if(e==="X"){return true}else{return false}}},select:function(e){var t=e.getParameter("selected");if(t)t="X";else t="";var a=e.getSource().getBindingContext();a.getModel().setProperty("Creatable",t,a);n.refresh()}}),new sap.m.CheckBox({selected:{path:"Readable",formatter:function(e){if(e==="X"){return true}else{return false}}},select:function(e){var t=e.getParameter("selected");if(t)t="X";else t="";var a=e.getSource().getBindingContext();a.getModel().setProperty("Readable",t,a);n.refresh()}}),new sap.m.CheckBox({selected:{path:"Updatable",formatter:function(e){if(e==="X"){return true}else{return false}}},select:function(e){var t=e.getParameter("selected");if(t)t="X";else t="";var a=e.getSource().getBindingContext();a.getModel().setProperty("Updatable",t,a);n.refresh()}}),new sap.m.CheckBox({selected:{path:"Deletable",formatter:function(e){if(e==="X"){return true}else{return false}}},select:function(e){var t=e.getParameter("selected");if(t)t="X";else t="";var a=e.getSource().getBindingContext();a.getModel().setProperty("Deletable",t,a);n.refresh()}})]}));t.addItem(r);r.getBinding("items").sort(new sap.ui.model.Sorter("GrpTitle",false,false))},addNewLine:function(){var e=sap.ui.getCore().byId("itContent");var t=e.getModel();var a=t.getData();var r={AppHeader:"Novo Cabeçalho",AppSubheader:"Novo Subcabeçalho",AppFooter:"Novo Rodapé",Creatable:false,Readable:true,Updatable:false,Deletable:true};a.apps.push(r);t.setData(a);t.refresh()},onSaveData:function(){var e=this;var t=this.getModel();var a=sap.ui.getCore().byId("itContent");var r=a.getModel();var n=r.getData().apps;var o=this.getModel("Detail").getProperty("/sPath");var s=this.getModel().getObject(o);delete s.__metadata;for(let e=0;e<n.length;e++){delete n[e].__metadata}if(this.getModel("global").getProperty("/newRole")!=null){s.RoleName=this.getModel("global").getProperty("/newRole")}s.AuthorizationItems=n;var l=e.getModel("global").getProperty("/create");t.create("/AuthorizationsHeader",s,{headers:{creatable:l},success:function(t){var a="/AuthorizationsHeader('"+t.RoleId+"')";e.getRouter().navTo("Detail",{objectId:a.substring("/AuthorizationsHeader".length)});e.getModel("global").setProperty("/create","false")},error:function(e){check=false}})},onNavBack:function(){this.getRouter().navTo("RouteMain")},_bindView:function(e){var t=this;var a=e;var r=this.getModel("Detail");this.getView().bindElement({path:e,events:{dataRequested:function(){r.setProperty("/busy",true)},dataReceived:function(e){r.setProperty("/busy",false)}}});t._requestAllapps(a)}})});
//# sourceMappingURL=Detail.controller.js.map