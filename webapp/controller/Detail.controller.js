sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("auths.controller.Detail", {
		onInit: function () {
			sessionStorage.setItem("goToLaunchpad", "");

			var oModel = new JSONModel();
			this.getView().setModel(oModel, "Detail");
			
			this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
		},

		onNavBack: function () {
			sessionStorage.setItem("goToLaunchpad", "X");
			this.getRouter().navTo("RouteMain");
		},

		onAfterRendering: function () {
			var that = this;
			sessionStorage.setItem("goToLaunchpad", "");
			window.addEventListener("message", function (event) {
				var data = event.data;
				if (data.action == "goToMainPage") {
					that.onNavBack();
				}
			});
		},

		_onObjectMatched: function (oEvent) {
			var sObjectId = "/AuthorizationsHeader" + oEvent.getParameter("arguments").objectId;
			this._bindView(sObjectId);
		},

		_requestAllapps: function (sPath) {
			var that = this,
				oModel = this.getModel();

			this.getModel("Detail").setProperty("/sPath", sPath);
			var oParameters = {
				"$expand": "AuthorizationItems"
			}

			oModel.read(sPath, {
				urlParameters: oParameters,
				success: function (oData, oResponse) {
					that._loadAllapps(oData.AuthorizationItems.results);
				},
				error: function (oError) {
					console.error("Erro na solicitação:", oError);
				}
			});
		},

		getGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.key,
				upperCase: false
			});
		},

		_loadAllapps: function (apps) {
			var ovbContent = this.byId("vbContent");
			ovbContent.destroyItems();

			var oTable = new sap.m.Table({
				id: "itContent",
				mode: sap.m.ListMode.Emphasized,
				headerToolbar: new sap.m.Toolbar({
					content: [
						new sap.m.Title({ text: this.getView().getModel("i18n").getResourceBundle().getText("applicationconfiguration") }),
					]
				})
			});

			oTable.addColumn(new sap.m.Column({
				mergeDuplicates: true,
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("GrpTitle") }),
			}));

			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("AppHeader") }),
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("AppSubheader") }),
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Creatable") }),
				hAlign: sap.ui.core.TextAlign.Center,
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Readable") }),
				hAlign: sap.ui.core.TextAlign.Center,
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Updatable") }),
				hAlign: sap.ui.core.TextAlign.Center,
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Deletable") }),
				hAlign: sap.ui.core.TextAlign.Center,
			}));

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({ apps: apps });
			oTable.setModel(oModel);
			oTable.bindItems("/apps", new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({ text: "{GrpTitle}" }),
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								src: "{AppIcon}",
								size: "1rem",
							}),
							new sap.m.Text({ text: "{AppHeader}", wrapping: false, layoutData: new sap.m.FlexItemData({ growFactor: 1 }) }).addStyleClass("sapUiTinyMarginBegin")
						]
					}),
					new sap.m.Text({ text: "{AppSubheader}" }),
					new sap.m.CheckBox({
						selected: {
							path: 'Creatable',
							formatter: function (value) {
								if (value === 'X') {
									return true;
								} else {
									return false;
								}
							}
						},
						select: function (oEvent) {
							var newValue = oEvent.getParameter("selected");
							if (newValue)
								newValue = 'X';
							else
								newValue = '';
							var oContext = oEvent.getSource().getBindingContext();
							oContext.getModel().setProperty("Creatable", newValue, oContext);
							oModel.refresh();
						}
					}),
					new sap.m.CheckBox({
						selected: {
							path: 'Readable',
							formatter: function (value) {
								if (value === 'X') {
									return true;
								} else {
									return false;
								}
							}
						},
						select: function (oEvent) {
							var newValue = oEvent.getParameter("selected");
							if (newValue)
								newValue = 'X';
							else
								newValue = '';
							var oContext = oEvent.getSource().getBindingContext();
							oContext.getModel().setProperty("Readable", newValue, oContext);
							oModel.refresh();
						}
					}),
					new sap.m.CheckBox({
						selected: {
							path: 'Updatable',
							formatter: function (value) {
								if (value === 'X') {
									return true;
								} else {
									return false;
								}
							}
						},
						select: function (oEvent) {
							var newValue = oEvent.getParameter("selected");
							if (newValue)
								newValue = 'X';
							else
								newValue = '';
							var oContext = oEvent.getSource().getBindingContext();
							oContext.getModel().setProperty("Updatable", newValue, oContext);
							oModel.refresh();
						}
					}),
					new sap.m.CheckBox({
						selected: {
							path: 'Deletable',
							formatter: function (value) {
								if (value === 'X') {
									return true;
								} else {
									return false;
								}
							}
						},
						select: function (oEvent) {
							var newValue = oEvent.getParameter("selected");
							if (newValue)
								newValue = 'X';
							else
								newValue = '';
							var oContext = oEvent.getSource().getBindingContext();
							oContext.getModel().setProperty("Deletable", newValue, oContext);
							oModel.refresh();
						}
					})
				]
			}));

			ovbContent.addItem(oTable);
			oTable.getBinding("items").sort(new sap.ui.model.Sorter("GrpTitle", false, false));
		},

		addNewLine: function () {
			var oTable = sap.ui.getCore().byId("itContent"),
				oModel = oTable.getModel(),
				data = oModel.getData(),
				newData = {
					AppHeader: "Novo Cabeçalho",
					AppSubheader: "Novo Subcabeçalho",
					Creatable: false,
					Readable: true,
					Updatable: false,
					Deletable: true
				};

			data.apps.push(newData);

			oModel.setData(data);
			oModel.refresh();

		},

		onSaveData: function () {
			var that = this,
				oModel = this.getModel(),
				oTable = sap.ui.getCore().byId("itContent"),
				oTableModel = oTable.getModel(),
				data = oTableModel.getData().apps,
				sPath = this.getModel("Detail").getProperty("/sPath"),
				oEntry = this.getModel().getObject(sPath);
			delete oEntry.__metadata;

			for (let i = 0; i < data.length; i++) {
				delete data[i].__metadata;
			}

			if (this.getModel("global").getProperty("/newRole") != null) {
				oEntry.RoleName = this.getModel("global").getProperty("/newRole");

			}
			oEntry.AuthorizationItems = data;

			var oHeader = that.getModel("global").getProperty("/create");

			oModel.create("/AuthorizationsHeader", oEntry, {
				headers: {
					"creatable": oHeader
				},
				success: function (oData) {
					new sap.m.MessageBox.success(that.getResourceBundle().getText("roleSuccessText"), {
						title: that.getResourceBundle().getText("roleSuccessTitle"),
						actions: [sap.m.MessageBox.Action.OK],
						emphasizedAction: sap.m.MessageBox.Action.OK,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								that.getRouter().navTo("RouteMain");
								that.getModel("global").setProperty("/create", "false");
							}
						}
					});
				},
				error: function (e) {
					check = false;
				}
			});
		},

		onNavBack: function () {
			sessionStorage.setItem("goToLaunchpad", "X");
			this.getRouter().navTo("RouteMain");
		},

		_bindView: function (sObjectPath) {
			var that = this,
				thatObjectPath = sObjectPath,
				oViewModel = this.getModel("Detail");

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function (oData) {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
			that._requestAllapps(thatObjectPath);
		}
	});
});
