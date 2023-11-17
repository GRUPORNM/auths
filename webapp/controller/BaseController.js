sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "../model/formatter"
], function (Controller, History, formatter) {
    "use strict";

    /**
     * @class
     * @author João Mota @
     * @since  May 2023
     * @name   initial.sapui5.BaseController
     */

    return Controller.extend("auths.controller.BaseController", {

        formatter: formatter,

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onNavBack: function () {
            this.getRouter().navTo("RouteMain", {}, true);
        },
    });
});