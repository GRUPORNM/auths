sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/core/UIComponent"
], function (Controller, History, formatter, UIComponent) {
    "use strict";

    /**
     * @class
     * @author João Mota @
     * @since  May 2023
     * @name   initial.sapui5.BaseController
     */

    var TQAModel;

    return Controller.extend("auths.controller.BaseController", {

        formatter: formatter,

        getModelTQA: function () {
            return TQAModel;
        },

        setModelTQA: function (token) {
            var userLanguage = sessionStorage.getItem("oLangu");
            if (!userLanguage) {
                userLanguage = "EN";
            }
            var serviceUrlWithLanguage = this.getModel().sServiceUrl + (this.getModel().sServiceUrl.includes("?") ? "&" : "?") + "sap-language=" + userLanguage;

            TQAModel = new sap.ui.model.odata.v2.ODataModel({
                serviceUrl: serviceUrlWithLanguage,
                annotationURI: "/zsrv_iwfnd/Annotations(TechnicalName='%2FTQA%2FOD_AUTHORIZATIONS_ANNO_MDL',Version='0001')/$value/",
                headers: {
                    "authorization": token,
                    "applicationName": "AUTHORIZATIONS"
                }
            });

            var vModel = new sap.ui.model.odata.v2.ODataModel({
                serviceUrl: "/sap/opu/odata/TQA/OD_VARIANTS_MANAGEMENT_SRV",
                headers: {
                    "authorization": token,
                    "applicationName": "AUTHORIZATIONS"
                }
            });
            this.setModel(vModel, "vModel");
            this.setModel(TQAModel);
        },

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
            sessionStorage.setItem("goToLaunchpad", "X");
            this.getRouter().navTo("RouteMain", {}, true);
        },

        validateFields: function (aFieldIds) {
            var isValid = true;

            aFieldIds.forEach(fieldId => {
                var oField = this.byId(fieldId);
                var sValue = oField.getValue();

                if (sValue) {
                    oField.setValueState("None");
                } else {
                    oField.setValueState("Error");
                    isValid = false;
                }
            });

            return isValid;
        },

        getUserAuthentication: function (type) {
            var that = this,
                urlParams = new URLSearchParams(window.location.search),
                token = urlParams.get('token');

            if (token != null) {
                var headers = new Headers();
                headers.append("X-authorization", token);

                var requestOptions = {
                    method: 'GET',
                    headers: headers,
                    redirect: 'follow'
                };

                fetch("/sap/opu/odata/TQA/AUTHENTICATOR_SRV/USER_AUTHENTICATION", requestOptions)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Ocorreu um erro ao ler a entidade.");
                        }
                        return response.text();
                    })
                    .then(function (xml) {
                        var parser = new DOMParser(),
                            xmlDoc = parser.parseFromString(xml, "text/xml"),
                            successResponseElement = xmlDoc.getElementsByTagName("d:SuccessResponse")[0],
                            response = successResponseElement.textContent;

                        if (response != 'X') {
                            that.getRouter().navTo("NotFound");
                        }
                        else {
                            that.getModel("global").setProperty("/token", token);
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            } else {
                that.getRouter().navTo("NotFound");
                return;
            }
        },
    });
});