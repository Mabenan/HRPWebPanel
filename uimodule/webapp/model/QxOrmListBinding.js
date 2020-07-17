sap.ui.define(["sap/ui/model/ListBinding"], function (ListBinding) {
  var QxOrmListBinding = ListBinding.extend(
    "de.mabenan.hrpwebpanel.model.QxOrmListBinding",
    {
      constructor: function (
        oModel,
        sPath,
        oContext,
        vSorters,
        vFilters,
        mParameters
      ) {
        ListBinding.call(this, oModel, sPath);
        this.sFilterParams = null;
        this.sSortParams = null;
        this.sRangeParams = null;
        this.sCustomParams = undefined;
        this.iStartIndex = 0;
        this.bPendingChange = false;
        this.aKeys = [];
        this.bInitial = true;
        this.sCountMode = (mParameters && mParameters.countMode) || this.oModel.sDefaultCountMode;
        this.bRefresh = false;
        this.bNeedsUpdate = false;
        this.bDataAvailable = false;
        this.bIgnoreSuspend = false;
        this.oCombinedFilter = null;
        this.data = undefined;
        this.oContext = oContext;
      },

      getContexts: function (iStartIndex, iLength) {
        var contexts = [];
        if (!this.data) {
          contexts.dataRequested = true;
          this.oModel.requestList(this);
        }else{
          for (let index = 0; index < this.data.length; index++) {
            contexts.push(this.oModel.bindProperty("/"+index, this));
          }
        }

        return contexts;
      },

      getCurrentContexts: function() {
        return this.aLastContexts || [];
      },

      getLength: function(){
        if(this.data){
          return this.data.length;
        }else{
          return 0;
        }
      },

      isLengthFinal: function(){
        if(!this.data){
          return false;
        }else{
          return true;
        }
      },

      setData: function (data) {
        this.data = data;
        this.bPendingRequest = false;
        this.bNeedsUpdate = true;
        this.fireDataReceived();
        this.fireEvent("change");
      },
    }
  );
  return QxOrmListBinding;
});
