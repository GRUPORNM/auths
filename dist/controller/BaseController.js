sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/routing/History","../model/formatter"],function(e,t,o){"use strict";return e.extend("auths.controller.BaseController",{formatter:o,getRouter:function(){return this.getOwnerComponent().getRouter()},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onNavBack:function(){this.getRouter().navTo("RouteMain",{},true)}})});
//# sourceMappingURL=BaseController.js.map