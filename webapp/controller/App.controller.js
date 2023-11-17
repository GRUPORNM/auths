sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
  "use strict";

  return BaseController.extend("auths.controller.App", {
    onInit() {
      var oViewModel = new JSONModel({
        busy: false,
        create: "false"
      });

      this.setModel(oViewModel, "global");
    },
  });
}
);
