sap.ui.define([
  "sap/ui/test/Opa5"
], function(Opa5) {
  "use strict";

  return Opa5.extend("de.mabenan..hrpwebpanel.test.integration.arrangements.Startup", {

    iStartMyApp: function () {
      this.iStartMyUIComponent({
        componentConfig: {
          name: "de.mabenan..hrpwebpanel",
          async: true,
          manifest: true
        }
      });
    }

  });
});
