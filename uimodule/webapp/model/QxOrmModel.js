sap.ui.define(
  [
    "sap/ui/model/Model",
    "./QxOrmContextBinding",
    "./QxOrmListBinding",
    "./QxOrmPropertyBinding",
    "sap/ui/model/Context",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/isPlainObject",
  ],
  function (
    Model,
    QxOrmContextBinding,
    QxOrmListBinding,
    QxOrmPropertyBinding,
    BaseContext,
    Log,
    jQuery,
    isPlainObject
  ) {
    "use strict";
    var QxOrmModel = Model.extend("de.mabenan.hrpwebpanel.model.QxOrmModel", {
      constructor: function (mParameters) {
        Model.call(this);
        this.sServiceUrl = mParameters;
        if (!this.sServiceUrl) {
          throw new Error("Missing service root URL");
        }
      },

      bindContext: function (sPath, oContext, mParameters, oEvents) {
        return QxOrmContextBinding(this, sPath, oContext, mParameters, oEvents);
      },

      bindList: function (sPath, oContext, vSorters, vFilters, mParameters) {
        return new QxOrmListBinding(
          this,
          sPath,
          oContext,
          vSorters,
          vFilters,
          mParameters
        );
      },
      bindProperty: function (sPath, oContext, mParameters) {
        return new QxOrmPropertyBinding(this, sPath, oContext, mParameters);
      },

      createBindingContext: function (sPath, oContext) {
        return new BaseContext(this, sPath);
      },

      refresh: function (sGroupId) {
        // Note: getBindings() returns an array that contains all bindings with change listeners (owned by Model)
        this.getBindings().forEach(function (oBinding) {
          if (oBinding.isRoot()) {
            // ignore the group ID for suspended bindings to avoid mismatches and errors; they
            // refresh via resume with their own group ID anyway
            oBinding.refresh(oBinding.isSuspended() ? undefined : sGroupId);
          }
        });
      },

      resolve: function (sPath, oContext) {
        var sResolvedPath;

        if (sPath && sPath[0] === "/") {
          sResolvedPath = sPath;
        } else if (oContext) {
          sResolvedPath = oContext.getPath();
          if (sPath) {
            if (!sResolvedPath.endsWith("/")) {
              sResolvedPath += "/";
            }
            sResolvedPath += sPath;
          }
        }

        if (
          sResolvedPath &&
          sResolvedPath !== "/" &&
          sResolvedPath[sResolvedPath.length - 1] === "/" &&
          sResolvedPath.indexOf("#") < 0
        ) {
          sResolvedPath = sResolvedPath.slice(0, sResolvedPath.length - 1);
        }

        return sResolvedPath;
      },

      requestList: function (oListBinding) {
        var xmlhttp = new XMLHttpRequest();
        var that = this;
        xmlhttp.onload = function (e) {
          if (e.target.responseType === 'json') {
            oListBinding.setData(xhr2.response.data);
       } else {
        oListBinding.setData(JSON.parse(e.target.responseText).data);
       }
       that.fireRequestCompleted();
        };
        xmlhttp.open("POST", this.sServiceUrl, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(
          JSON.stringify({
            request_id: "2b393e4c-a00c-45dc-a279-e9d76f1c55cf",
            action: "fetch_all",
            entity: oListBinding.sPath.slice(1),
          })
        );
      },
    });
    return QxOrmModel;
  }
);
