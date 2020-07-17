sap.ui.define(["sap/ui/model/PropertyBinding"], function (PropertyBinding) {
  var QxOrmPropertyBinding = PropertyBinding.extend(
    "de.mabenan.hrpwebpanel.model.QxOrmPropertyBinding",
    {
      getValue: function () {
        const parsed = parseInt(this.sPath.slice(1));
        if (isNaN(parsed)) {
          if (this.oContext.getValue) {
            return this.oContext.getValue()[this.sPath];
          }
        }
        return this.oContext.data[parsed];
      },
    }
  );
  return QxOrmPropertyBinding;
});
