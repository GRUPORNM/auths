sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel"
],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("auths.controller.App", {
      onInit: function () {
        var oViewModel = new JSONModel({
          busy: false,
          create: "false",
          delay: 0
        });

        this.setModel(oViewModel, "global");

        var urlParams = new URLSearchParams(window.location.search);
        var token = urlParams.get('token');
        this.setModelTQA(token);
        if (!sessionStorage.getItem("oLangu"))
          sap.ui.getCore().getConfiguration().setLanguage("EN");
        else {
          sap.ui.getCore().getConfiguration().setLanguage(sessionStorage.getItem("oLangu"));
        }

        var fnSetAppNotBusy = function () {
          oViewModel.setProperty("/busy", false);
          oViewModel.setProperty("/delay", 0);
        };
      }
    });
  });
