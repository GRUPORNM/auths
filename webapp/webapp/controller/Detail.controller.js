sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("auths.controller.Detail", {
		onInit: function () {
			// Create and set the JSON model
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "Detail");
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
		},

		onNavBack: function () {
			this.getRouter().navTo("RouteMain");
		},

		_onObjectMatched: function (oEvent) {
			var sObjectId = "/AuthorizationsHeader" + oEvent.getParameter("arguments").objectId;
			this._bindView(sObjectId);
			// this._loadAllapps(sObjectId);
		},


		// onRouteMatched: function(sObjectId)
		// {
		// 	
		// 	var sPath =  "/AuthorizationsHeader" + sObjectId.getParameter("arguments").objectId;

		// 	this._bindView(sObjectId);
		// },

		_requestAllapps: function (sPath) {
			
			var that = this;
			var oModel = this.getModel();
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
					// Manipule o erro da solicitação aqui
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
			// Criação da tabela SAP M

			var ovbContent = this.byId("vbContent");
			ovbContent.destroyItems();
			var that = this;
			var oTable = new sap.m.Table({
				id: "itContent",
				mode: sap.m.ListMode.Emphasized,
				headerToolbar: new sap.m.Toolbar({
					content: [
						new sap.m.Title({ text: this.getView().getModel("i18n").getResourceBundle().getText("applicationconfiguration") }),
						// new sap.m.ToolbarSpacer(), // Espaçador para alinhar à direita
						// new sap.m.Button({
						// 	text: this.getView().getModel("i18n").getResourceBundle().getText("addNewApp"),
						// 	type: sap.m.ButtonType.Emphasized,
						// 	press: function () {
						// 		that.addNewLine();
						// 	}
						// })
					]
				})
			});

			// GrpTitle
			oTable.addColumn(new sap.m.Column({
				mergeDuplicates: true,
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("GrpTitle") }),
				// template: new sap.m.Text({ text: "{AppHeader}", wrapping: false })
			}));

			// Criação das colunas
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("AppHeader") }),
				// template: new sap.m.Text({ text: "{AppHeader}", wrapping: false })
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("AppSubheader") }),
				// template: new sap.m.Text({ text: "{AppSubheader}" })
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("AppFooter") }),
				// template: new sap.m.Text({ text: "{AppFooter}" })
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Creatable") }),
				hAlign: sap.ui.core.TextAlign.Center,
				// template: new sap.m.CheckBox({ selected: "{Creatable}" })
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Readable") }),
				hAlign: sap.ui.core.TextAlign.Center,
				// template: new sap.m.CheckBox({ selected: "{Readable}" })
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Updatable") }),
				hAlign: sap.ui.core.TextAlign.Center,
				// template: new sap.m.CheckBox({ selected: "{Updatable}" })
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({ text: this.getView().getModel("i18n").getResourceBundle().getText("Deletable") }),
				hAlign: sap.ui.core.TextAlign.Center,
				// template: new sap.m.CheckBox({ selected: "{Deletable}" })
			}));
			// Criação do modelo de dados
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({ apps: apps });
			oTable.setModel(oModel);
			oTable.bindItems("/apps", new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({ text: "{GrpTitle}" }),
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								src: "{AppIcon}", // Substitua "example-icon" pelo ícone desejado
								size: "1rem", // Tamanho do ícone (opcional)
							}),
							new sap.m.Text({ text: "{AppHeader}", wrapping: false, layoutData: new sap.m.FlexItemData({ growFactor: 1 }) }).addStyleClass("sapUiTinyMarginBegin")
						]
					}),
					new sap.m.Text({ text: "{AppSubheader}" }),
					new sap.m.Text({ text: "{AppFooter}" }),
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

					// Adicione as outras células de acordo com os campos necessários
				]
			}));
			// Exibição da tabela
			ovbContent.addItem(oTable); // Substitua "content" pelo ID do elemento HTML onde você deseja exibir a tabela
			oTable.getBinding("items").sort(new sap.ui.model.Sorter("GrpTitle", false, false));
		},

		addNewLine: function () {

			var oTable = sap.ui.getCore().byId("itContent");
			var oModel = oTable.getModel();

			var data = oModel.getData();

			var newData = {
				AppHeader: "Novo Cabeçalho",
				AppSubheader: "Novo Subcabeçalho",
				AppFooter: "Novo Rodapé",
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
			
			// oTable.getItems()[2].getBindingContext().getObject()
			var that = this;
			var oModel = this.getModel();
			var oTable = sap.ui.getCore().byId("itContent");
			var oTableModel = oTable.getModel();
			var data = oTableModel.getData().apps;
			// var oEntry = {};
			var sPath = this.getModel("Detail").getProperty("/sPath");
			var oEntry = this.getModel().getObject(sPath);
			delete oEntry.__metadata;

			// delete __metadata
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
					// that.getModel().refresh(true);
					var sPath = "/AuthorizationsHeader('" + oData.RoleId + "')";
					that.getRouter().navTo("Detail", {
						objectId: sPath.substring("/AuthorizationsHeader".length)
					});
					that.getModel("global").setProperty("/create", "false");
				},
				error: function (e) {
					check = false;
				}
			});


		},

		onNavBack: function(){
			this.getRouter().navTo("RouteMain");
		},



		_bindView: function (sObjectPath) {
			var that = this;
			var thatObjectPath = sObjectPath;
			var oViewModel = this.getModel("Detail");
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
		// Other controller methods here
	});
});
