sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageBox",
  ],
  function (
    Device,
    Controller,
    JSONModel,
    Popover,
    Button,
    library,
    MessageBox
  ) {
    "use strict";

    var ButtonType = library.ButtonType,
      PlacementType = library.PlacementType;

    return Controller.extend("de.mabenan.hrpwebpanel.controller.MainView", {
      onInit: function () {
        var viewModel = new sap.ui.model.json.JSONModel();
        viewModel.setProperty("/loggedIn", false);
        this.getView().setModel(viewModel, "view");
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.username = new sap.m.Input({});
        this.password = new sap.m.Input({});
        this.loginDialog = new sap.m.Dialog({
          content: [this.username, this.password],

          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: "OK",
            press: function () {
              this.loginDialog.close();
              this.login();
            }.bind(this),
          }),
          endButton: new sap.m.Button({
            text: "Close",
            press: function () {
              this.loginDialog.close();
            }.bind(this),
          }),
        });
      },

      onItemSelect: function (oEvent) {
        var item = oEvent.getParameter("item");
        var key = item.getKey();
        this.oRouter.navTo(key, {});
      },
      handleUserButtonPressed: function (event) {
        var self = this;
        if (this.getView().getModel("view").getProperty("/loggedIn")) {
          var oPopover = new Popover({
            showHeader: false,
            placement: PlacementType.Bottom,
            content: [
              new Button({
                text: "Settings",
                type: ButtonType.Transparent,
                press: function (oEvent) {
                  self.settingsPressed(oEvent);
                  oPopover.close();
                },
              }),
              new Button({
                text: "Logout",
                type: ButtonType.Transparent,
                press: function (oEvent) {
                  self.logoutPressed(oEvent);
                  oPopover.close();
                },
              }),
            ],
          }).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

          oPopover.openBy(event.getSource());
        } else {
          this.loginDialog.open();
        }
      },
      settingsPressed(oEvent) {
        this.oRouter.navTo("auth.view.Settings", {});
      },
      logoutPressed(oEvent) {
        var self = this;
        $.ajax({
          type: "POST",
          url: "/api/logout",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            user: self.getView().getModel("view").getProperty("/user"),
          }),
          dataType: "json",
          beforeSend: function (request) {
            request.setRequestHeader(
              "auth_guid",
              self.getView().getModel("view").getProperty("/auth_guid")
            );
          },
          processData: false,
          success: function (result) {
            // process result
            self.getOwnerComponent().getModel("default").changeHttpHeaders({
              auth_guid: "-",
              user: "-",
            });
            self.getView().getModel("view").setProperty("/loggedIn", false);
            self.getOwnerComponent().getModel("default").refresh();
            self
              .getOwnerComponent()
              .getModel("session")
              .setProperty("/username", "");
          },
          error: function (e) {
            // log error in browser
            MessageBox.error(e.message);
          },
        });
      },
      login() {
        var self = this;
        $.ajax({
          type: "POST",
          url: "/api/login",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            user: this.username.getValue(),
            password: this.password.getValue(),
          }),
          dataType: "json",
          processData: false,
          success: function (result) {
            // process result
            self.getOwnerComponent().getModel("default").changeHttpHeaders({
              auth_guid: result.auth_guid,
              user: self.username.getValue(),
            });
            self.getView().getModel("view").setProperty("/loggedIn", true);
            self
              .getView()
              .getModel("view")
              .setProperty("/auth_guid", result.auth_guid);
            self
              .getView()
              .getModel("view")
              .setProperty("/user", self.username.getValue());
            self
              .getOwnerComponent()
              .getModel("session")
              .setProperty("/username", self.username.getValue());
            self.getOwnerComponent().getModel("default").refresh();
          },
          error: function (e) {
            // log error in browser
            MessageBox.error(e.message);
          },
        });
      },
      onSideNavButtonPress: function () {
        var oToolPage = this.byId("toolPage");

        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },
    });
  }
);
