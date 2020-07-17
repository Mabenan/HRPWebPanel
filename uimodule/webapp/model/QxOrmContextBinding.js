sap.ui.define([
  "sap/ui/model/ContextBinding"
], function(ContextBinding){
  var QxOrmContextBinding = ContextBinding.extend("de.mabenan.hrpwebpanel.model.QxOrmContextBinding", {
    constructor : function(oModel, sPath, oContext, mParameters, oEvents){
			ContextBinding.call(this, oModel, sPath, oContext, mParameters, oEvents);
    },
  });
  return QxOrmContextBinding;
});
