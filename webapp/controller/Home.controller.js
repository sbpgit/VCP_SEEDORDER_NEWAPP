sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/ui/export/library",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    'sap/ui/export/Spreadsheet',
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter, MessageToast, FilterOperator, Dialog, mobileLibrary, exportLibrary, Button, Text, Sorter, MessageBox, Spreadsheet, formatter) {
        "use strict";
        var that, oGModel;
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;
        var aResults;

        var EdmType = exportLibrary.EdmType;
        return Controller.extend("vcp.vcpseedordercreationnew.controller.Home", {
            formatter: formatter,
            onInit: function () {
                that = this;
                that.oGModel = that.getOwnerComponent().getModel("oGModel");
                that.partModel = new JSONModel();
                that.locModel = new JSONModel();
                that.prodModel1 = new JSONModel();
                that.uniqModel = new JSONModel();
                that.custModel = new JSONModel();
                that.oNewModel = new JSONModel();
                this.variantModel = new JSONModel();
                this.viewDetails = new JSONModel();
                that.oErrorModel = new JSONModel();
                that.oAlgoListModel = new JSONModel();
                that.emptyModel = new JSONModel();
                that.emptyModel1 = new JSONModel();
                that.emptyModel2 = new JSONModel();
                that.viewDetails = new JSONModel();
                that.newClassModel = new JSONModel();
                that.newUniqueMode = new JSONModel();
                that.oCharModel = new JSONModel();
                that.oCharModel.setSizeLimit(5000);
                that.newUniqueMode.setSizeLimit(5000);
                that.newClassModel.setSizeLimit(5000);
                that.viewDetails.setSizeLimit(5000);
                // that.partModel.setSizeLimit(1000);
                // that.locModel.setSizeLimit(1000);
                // that.prodModel1.setSizeLimit(1000);
                that.uniqModel.setSizeLimit(1000);
                // that.custModel.setSizeLimit(1000);
                that.variantModel.setSizeLimit(5000);
                that.viewDetails.setSizeLimit(5000);
                that.oErrorModel.setSizeLimit(1200);
                that.oNewModel.setSizeLimit(5000);
                that.oAlgoListModel.setSizeLimit(5000);
                this._oCore = sap.ui.getCore();
                if (!this._valueHelpDialogLoc) {
                    this._valueHelpDialogLoc = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.LocDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogLoc);
                }
                if (!this._valueHelpDialogProd2) {
                    this._valueHelpDialogProd2 = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.ProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogProd2);
                }

                if (!this._valueHelpDialogCustomer) {
                    this._valueHelpDialogCustomer = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.CustomerGroup",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogCustomer);
                }
                if (!this._valueHelpDialogPart) {
                    this._valueHelpDialogPart = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.PartialProdDialog",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogPart);
                }
                if (!this._valueHelpDialogCharacter) {
                    this._valueHelpDialogCharacter = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.Characteristics",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogCharacter);
                }
                if (!this._valueHelpDialogSeedOrder) {
                    this._valueHelpDialogSeedOrder = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.GenerateSeedOrder",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogSeedOrder);
                }
                if (!this._valueHelpDialogUniqueId) {
                    this._valueHelpDialogUniqueId = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.UniqueId",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogUniqueId);
                }
                if (!this._UniqueIDs) {
                    this._UniqueIDs = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.UniqueIds",
                        this
                    );
                    this.getView().addDependent(this._UniqueIDs);
                }
                if (!this._valueHelpDialogUniquePrimary) {
                    this._valueHelpDialogUniquePrimary = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.UniqueIDPrimaryId",
                        this
                    );
                    this.getView().addDependent(this._valueHelpDialogUniquePrimary);
                }
                sap.ui.core.BusyIndicator.show();
                that.getOwnerComponent().getModel("BModel").read("/getUserPreferences", {
                    filters: [
                        new Filter("PARAMETER", FilterOperator.EQ, "MAX_RECORDS")
                    ],
                    success: function (oData) {
                        that.oGModel.setProperty("/MaxCount", oData.results[0].PARAMETER_VALUE);
                        that.getAllProds()
                    },
                    error: function (oData, error) {
                        console.log(error)
                    },
                });
                // that.oGModel.setProperty("/skipOnAfter","X");
            },
            getUser: function () {
                var vUser;
                if (sap.ushell.Container) {
                    let email = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
                    vUser = (email) ? email : "";
                }
                return vUser;
            },
            onAfterRendering: function () {
                that.skip = 0
                that.finaloTokens = [];
                that.allData = []
                that.oGModel.setProperty("/resetFlag", "");
                that.selectedChars = [], that.loadArray = [],
                    that.totalChars = [], that.uniqueIds = [];
                that.charsProd = [];
                sap.ui.core.BusyIndicator.show()
                var dateSel = that.byId("idDateRange");
                $("#" + dateSel.sId + " input").prop("disabled", true);
                dateSel.setMaxDate(new Date());
                that.byId("idInput").addStyleClass("inputClass");
                this.oLoc1 = that.byId("idloc");
                this.oProd = that.byId("prodInput");
                this.oCust = that.byId("idCustGrp");
                this.oLocList = sap.ui.getCore().byId("LocationList");
                this.oProdList = sap.ui.getCore().byId("prodSlctListJS");
                this.oCustList = sap.ui.getCore().byId("custGrpList");
                // that.getAllProds()
                // this.getOwnerComponent().getModel("BModel").read("/getProducts",{
                //     method: "GET",
                //     success: function (oData){
                //         that.newProds = [],
                //             that.newProds = oData.results;
                //         that.prodModel1.setData({ prodDetails: oData.results });
                //         sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
                //         sap.ui.core.BusyIndicator.hide()
                //     },
                //     error: function () {
                //         sap.ui.core.BusyIndicator.hide();
                //         MessageToast.show("Failed to get configurable products");
                //     },
                // });
                // that.getVariantData();
            },
            /**Removing duplicates */
            removeDuplicate(array, key1, key2) {
                const seen = new Set();

                return array.filter(item => {
                    // Create a unique combination string based on the two properties
                    const key = `${item[key1]}|${item[key2]}`;

                    // Check if the combination is already in the Set
                    if (seen.has(key)) {
                        return false; // Skip if combination is a duplicate
                    }

                    // Add the combination to the Set and include the item in the result
                    seen.add(key);
                    return true;
                });
            },
            /**
             * on Press of value helps on filters and fragments
             * @param {} oEvent 
             */
            handleValueHelp2: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("prod")) {
                    var oProd = that.oGModel.getProperty("/setProduct");
                    for (var k = 0; k < that.oProdList.getItems().length; k++) {
                        if (that.oProdList.getItems()[k].getTitle() === oProd) {
                            that.oProdList.getItems()[k].setSelected(true);
                        }
                    }
                    that._valueHelpDialogProd2.open();
                    // Prod Dialog
                }
                else if (sId.includes("loc")) {
                    if (that.byId("prodInput").getValue()) {
                        var oLoc = that.oGModel.getProperty("/setLocation");
                        for (var k = 0; k < that.oLocList.getItems().length; k++) {
                            if (that.oLocList.getItems()[k].getTitle() === oLoc) {
                                that.oLocList.getItems()[k].setSelected(true);
                            }
                        }
                        that._valueHelpDialogLoc.open();
                    } else {
                        MessageToast.show("Select Configurable Product");
                    }
                }
                else if (sId.includes("Cust")) {
                    if (that.byId("prodInput").getValue() && that.byId("idloc").getValue()) {
                        var tokens = that.byId("idCustGrp").getTokens();
                        var items = sap.ui.getCore().byId("custGrpList").getItems();
                        for (var i = 0; i < tokens.length; i++) {
                            for (var k = 0; k < items.length; k++) {
                                if (tokens[i].getKey() === items[k].getCells()[0].getText()) {
                                    items[k].setSelected(true);
                                }
                            }
                        }
                        that._valueHelpDialogCustomer.open();
                    } else {
                        MessageToast.show("Select Configurable Product/Demand Location");
                    }
                }
                else if (sId.includes("idPartProd")) {
                    that._valueHelpDialogPart.open();
                }
                else if (sId.includes("Char")) {
                    var tokens = that.byId("idCharName").getTokens();
                    var items = sap.ui.getCore().byId("idCharSelect").getItems();
                    for (var i = 0; i < tokens.length; i++) {
                        for (var k = 0; k < items.length; k++) {
                            if (tokens[i].getKey() === items[k].getCells()[0].getText()) {
                                items[k].setSelected(true);
                            }
                        }
                    }
                    that._valueHelpDialogCharacter.open();
                }
                else if (sId.includes("Uniq")) {
                    that._valueHelpDialogUniqueId.open();
                }

            },
            /**
             * On Press of confirm in COnfig Prod Fragment 
             * @param {} oEvent 
             */
            handleProdSelection: function (oEvent) {
                sap.ui.core.BusyIndicator.show()
                var selectedProdItem = oEvent.getParameters().selectedItem.getTitle();
                that.byId("prodInput").setValue(selectedProdItem);
                that.oGModel.setProperty("/setProduct", selectedProdItem);
                that.getAllLocProd();
                that.byId("idMatList123").setModified(true);
                that.byId("idloc").setValue();
                that.byId("idDateRange").setValue();
                that.byId("idCustGrp").removeAllTokens();
                that.byId("idCharSearch").setVisible(false);
                that.emptyModel.setData([]);
                that.byId("idCharTable").setModel(that.emptyModel);
                that.byId("idCharTable").setVisible(false);
                that.emptyModel1.setData({ setPanel: [] });
                that.byId("idVBox").setModel(that.emptyModel1);
                that.byId("idVBox").removeAllItems();
                that.emptyModel1.setData({ setCharacteristics: [] });
                sap.ui.getCore().byId("idCharSelect").setModel(that.emptyModel1);
                that.byId("idCharName").removeAllTokens();
                that.byId("CreateProductWizard").setVisible(false);
                that.emptyModel2.setData({ res: [] });
                that.byId("LogList").setModel(that.emptyModel2);
                that.byId("idIconTabBar").setVisible(false);
                if (sap.ui.getCore().byId("custGrpList").getBinding("items")) {
                    sap.ui.getCore().byId("custGrpList").getBinding("items").filter([]);
                }
                that.byId("idInput").setText();
                that.partModel.setData({ partDetails: [] });
                sap.ui.getCore().byId("partProdSlct").clearSelection();
                sap.ui.getCore().byId("partProdSlct").setModel(that.partModel);
                sap.ui.getCore().byId("partProdSlct").getBinding("items").filter([]);
                that.newUniqueMode.setData({ uniqueDetails: [] });
                that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                // }
                sap.ui.core.BusyIndicator.hide()
            },
            /**
             * On Press of confirm in Demand Location Fragment 
             * @param {} oEvent 
             */
            handleLocSelection: function (oEvent) {
                that.selectedChars = [], that.uniqueIds = [];
                sap.ui.core.BusyIndicator.show()
                var sProduct = that.byId("prodInput").getValue();
                var selectedLocItem = oEvent.getParameters().selectedItem.getTitle();
                that.byId("idloc").setValue(selectedLocItem);
                if (that.oGModel.getProperty("/defaultLocation") !== selectedLocItem) {
                    that.byId("idMatList123").setModified(true);
                }
                that.oGModel.setProperty("/setLocation", selectedLocItem);
                that.getAllCustGrp();
            },
            /**
             * On Press of reset button on header filters
             */
            onResetDate: function () {
                that.selectedChars = []
                var vBoxItems = that.byId("idVBox").getItems();
                for (var i = 0; i < vBoxItems.length; i++) {
                    var childItems = vBoxItems[i].getContent()[0].getItems();
                    for (var k = 0; k < childItems.length - 1; k++) {
                        if (childItems[k].getCells()[1])
                            (childItems[k].getCells()[1].setValue() === "")
                    }
                }
                that.oGModel.setProperty("/fromFunction", "X");
                that.oGModel.setProperty("/saveFunction", "X");
                that.byId("prodInput").setValue();
                that.byId("idloc").setValue();
                that.byId("idCustGrp").removeAllTokens();
                that.byId("idDateRange").setValue(null);
                that.byId("idCharSearch").setVisible(false);
                that.emptyModel.setData([]);
                that.byId("idCharTable").setModel(that.emptyModel);
                that.byId("idCharTable").setVisible(false);
                that.emptyModel1.setData({ setPanel: [] });
                that.byId("idVBox").setModel(that.emptyModel1);
                that.byId("idVBox").removeAllItems();
                that.emptyModel1.setData({ setCharacteristics: [] });
                sap.ui.getCore().byId("idCharSelect").setModel(that.emptyModel1);
                // that.byId("idpartInput").removeAllTokens();
                that.byId("idCharName").removeAllTokens();
                that.byId("CreateProductWizard").setVisible(false);
                // that.byId("CreateProductWizard").destroySteps();
                that.byId("idGenSeedOrder").setEnabled(false);
                that.emptyModel2.setData({ res: [] })
                that.byId("LogList").setModel(that.emptyModel2)
                that.byId("idIconTabBar").setVisible(false);
                if (sap.ui.getCore().byId("custGrpList").getBinding("items")) {
                    sap.ui.getCore().byId("custGrpList").getBinding("items").filter([]);
                }
                if (sap.ui.getCore().byId("partProdSlct").getBinding("items")) {
                    sap.ui.getCore().byId("partProdSlct").clearSelection();
                    sap.ui.getCore().byId("partProdSlct").getBinding("items").filter([]);
                }
                that.partModel.setData({ partDetails: [] });
                sap.ui.getCore().byId("partProdSlct").setModel(that.partModel);
                that.newUniqueMode.setData({ uniqueDetails: [] });
                that.byId("idUniqueDetails").setModel(that.newUniqueMode);
            },
            /**
             * On search in various fragments 
             * @param {} oEvent 
             */
            handleSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = oEvent.getParameter("id"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";
                // Location
                if (sId.includes("Loc")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("DEMAND_LOC", FilterOperator.Contains, sQuery),
                                    new Filter("DEMAND_DESC", FilterOperator.Contains, sQuery),
                                    // new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                    // new Filter("CHARVAL_DESC", FilterOperator.Contains, sQuery)
                                ],
                                and: false,
                            })
                        );
                    }
                    sap.ui.getCore().byId("LocationList").getBinding("items").filter(oFilters);

                } // Customer
                else if (sId.includes("cust")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CUSTOMER_GROUP", FilterOperator.Contains, sQuery),
                                    new Filter("CUSTOMER_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    sap.ui.getCore().byId("custGrpList").getBinding("items").filter(oFilters);
                    // Product
                } else if (sId.includes("prod")) {
                    // if (sQuery !== "") {
                    //     oFilters.push(
                    //         new Filter({
                    //             filters: [
                    //                 new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                    //                 new Filter("PROD_DESC", FilterOperator.Contains, sQuery),
                    //             ],
                    //             and: false,
                    //         })
                    //     );
                    // }
                    // sap.ui.getCore().byId("prodSlctListJS").getBinding("items").filter(oFilters);
                    oFilters.push(new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery.toUpperCase()))
                    sap.ui.core.BusyIndicator.show()
                    this.getOwnerComponent().getModel("BModel").read("/getProducts", {
                        method: "GET",
                        filters: oFilters,
                        success: function (oData) {
                            that.prodModel1.setData({ prodDetails: oData.results });
                            sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
                            sap.ui.core.BusyIndicator.hide()
                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get configurable products");
                        },
                    });
                }
                //Partial Product
                else if (sId.includes("partProd")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("PRODUCT_ID", FilterOperator.Contains, sQuery),
                                    new Filter("PROD_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    sap.ui.getCore().byId("partProdSlct").getBinding("items").filter(oFilters);

                }
                else if (sId.includes("idCharSearch")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_NAME", FilterOperator.EQ, sQuery),
                                    new Filter("CHAR_DESC", FilterOperator.Contains, sQuery),
                                    new Filter("CHAR_VALUE", FilterOperator.EQ, sQuery),
                                    new Filter("CHARVAL_DESC", FilterOperator.Contains, sQuery)
                                ],
                                and: false,
                            })
                        );
                    }
                    sap.ui.getCore().byId("idMatvarItem").getBinding("items").filter(oFilters);
                }
                //CHaracteristics Fragment
                else if (sId.includes("Char")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CHAR_NAME", FilterOperator.Contains, sQuery),
                                    new Filter("CHAR_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    sap.ui.getCore().byId("idCharSelect").getBinding("items").filter(oFilters);
                }
                /**Search in CUstomer group fragment */
                else if (sId.includes("custGrpList")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("CUSTOMER_GROUP", FilterOperator.Contains, sQuery),
                                    new Filter("CUSTOMER_DESC", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                            })
                        );
                    }
                    sap.ui.getCore().byId("custGrpList").getBinding("items").filter(oFilters);
                }
                /**Search in Unique ID fragment */
                // else if (sId.includes("idUniqueDetails")) {
                //     if (sQuery !== "") {
                //         oFilters.push(
                //             new Filter({
                //                 filters: [
                //                     new Filter("UNIQUE_ID", FilterOperator.EQ, sQuery),
                //                     new Filter("UNQIUE_DESC", FilterOperator.Contains, sQuery),
                //                 ],
                //                 and: false,
                //             })
                //         );
                //     }
                //     sap.ui.getCore().byId("idUniqueDetails").getBinding("items").filter(oFilters);
                // }

                else if (sId.includes("idUniqueSearch")) {
                    if (sQuery !== "") {
                        oFilters.push(
                            new Filter({
                                filters: [
                                    new Filter("UNIQUE_ID", FilterOperator.EQ, sQuery)
                                ],
                                and: false,
                            })
                        );
                    }
                    that.byId("idUniqueDetails").getBinding("items").filter(oFilters);
                }

            },
            /**
             * On Press of Go on header fitler
             */
            onGetData: function () {
                that.newpartprodChars = [];
                sap.ui.core.BusyIndicator.show()
                that.partProdItems = [];
                that.initialSelectedChars = [], that.selectedChars = [];
                var prodItem = that.byId("prodInput").getValue();
                var locItem = that.byId("idloc").getValue();
                var dateRange = that.byId("idDateRange").getValue();
                var customerGroup = that.byId("idCustGrp").getTokens();
                var tableData = that.byId("idCharTable");
                var tableDataItems = tableData.getItems()
                for (var k = 0; k < tableDataItems.length; k++) {
                    tableDataItems[k].setSelected(false);
                }

                var oFilters = [];
                oFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, prodItem));
                oFilters.push(new Filter("UID_TYPE", FilterOperator.EQ, "U"));

                if (prodItem && locItem && dateRange && customerGroup.length > 0) {
                    this.getOwnerComponent().getModel("BModel").callFunction("/getUniqueIdsNewFun", {
                        method: "GET",
                        urlParameters: {
                            PRODUCT_ID: prodItem,
                            UID_TYPE: "U"
                        },
                        success: function (oData) {
                            that.count1 = 0;
                            if ((JSON.parse(oData.getUniqueIdsNewFun)).length > 0) {
                                that.totalUniqueIds = [], that.uniqueIds1 = [];
                                that.totalUniqueIds = JSON.parse(oData.getUniqueIdsNewFun);
                                var combinedUIDs = Array.from(
                                    new Map(
                                        that.totalUniqueIds.flatMap(entry => entry.UIDS)
                                            .map(uidObj => [uidObj.UNIQUE_ID, uidObj]) // Use UNIQUE_ID as the key in the map
                                    ).values() // Get the unique values from the map
                                );
                                that.oGModel.setProperty("/totUID", that.totalUniqueIds);
                                that.uniqueIds1 = combinedUIDs;
                                that.count1 = that.uniqueIds1.length;
                                that.byId("idInput").setText(that.count1);
                                that.uniqueIds = that.uniqueIds1;
                                that.oGModel.setProperty("/distUID", that.uniqueIds);
                                if (that.count1 !== 0) {
                                    that.newUniqueMode.setData({ uniqueDetails: that.uniqueIds });
                                    that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                                }
                                else {
                                    that.newUniqueMode.setData({ uniqueDetails: [] });
                                    that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                                    MessageToast.show("No Unique Id's available to show for the selection");
                                    that.emptyModel.setData({ items1: [] });
                                    tableData.setModel(that.emptyModel);
                                    sap.ui.getCore().byId("idCharSelect").setModel(that.emptyModel);
                                }
                                that.loadArray = that.totalUniqueIds;
                                that.loadArray1 = that.removeDuplicates(that.loadArray, "CHAR_NAME");
                                that.oNewModel.setData({ setCharacteristics: that.loadArray1 });
                                sap.ui.getCore().byId("idCharSelect").setModel(that.oNewModel);
                                var filteredProdData = that.removeDuplicate(that.loadArray, "CHAR_VALUE");
                                that.charsProd = filteredProdData;
                                that.newClassModel.setData({ items1: filteredProdData });
                                tableData.setModel(that.newClassModel);
                                sap.ui.core.BusyIndicator.hide();
                            }
                            else {
                                that.byId("idInput").setText(that.count1);
                                that.byId("idGenSeedOrder").setEnabled(false);
                                that.newUniqueMode.setData({ uniqueDetails: [] });
                                that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                                MessageToast.show("No Unique Id's available to show for the selection");
                                that.emptyModel.setData({ items1: [] });
                                tableData.setModel(that.emptyModel);
                                sap.ui.getCore().byId("idCharSelect").setModel(that.emptyModel);
                                sap.ui.core.BusyIndicator.hide();
                            }
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                    that.byId("CreateProductWizard").setVisible(true);

                    //adding skip and top for genPartialProd
                    that.getAllGenParProd();
                    tableData.setVisible(true);
                    that.byId("idCharSearch").setVisible(true);
                    that.byId("idGenSeedOrder").setEnabled(true);
                }
                else {
                    sap.ui.core.BusyIndicator.hide()
                    MessageToast.show("Please select Configurable Product/ Location/ Date Range/ Customer Group");
                }
            },
            /**
             * 
             * @param {On Selection of partial product in step 1 wizard } oEvent 
             */
            handlePartSelection: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oProdFilters = [], count = 0;
                var selectedPartial = oEvent.getParameters().selectedItems;
                var locationId = that.byId("idloc").getValue();
                var tableItemsFull = that.byId("idCharTable").getItems();
                var configProd = that.byId("prodInput").getValue();
                if (that.selectedChars.length > 0) {
                    that.selectedChars = removeElementById(that.selectedChars, configProd);
                    function removeElementById(array, idToRemove) {
                        return array.filter(function (obj) {
                            return obj.PRODUCT_ID === idToRemove;
                        });
                    }
                }
                if (selectedPartial.length > 0) {
                    for (var i = 0; i < selectedPartial.length; i++) {
                        oProdFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, selectedPartial[i].getTitle()));
                    }
                    oProdFilters.push(new Filter("LOCATION_ID", FilterOperator.EQ, locationId));
                    that.byId("idCharTable").removeSelections();
                    that.selectedChars = [], that.newpartprodChars = [];
                    that.getAllParChar(oProdFilters, tableItemsFull);
                } else {
                    that.byId("idCharTable").removeSelections();
                    that.selectedChars = that.selectedChars.filter(item2 =>
                        !that.newpartprodChars.some(item1 =>
                            item1.CHAR_NUM === item2.CHAR_NUM &&
                            item1.CHARVAL_DESC === item2.CHARVAL_DESC
                        )
                    );
                    that.newpartprodChars = [];
                    for (var k = 0; k < tableItemsFull.length; k++) {
                        tableItemsFull[k].setSelected(false);
                        for (var s = 0; s < that.selectedChars.length; s++) {
                            if (that.selectedChars[s].CHAR_NUM === tableItemsFull[k].getCells()[0].getText()
                                && that.selectedChars[s].CHAR_VALUE === tableItemsFull[k].getCells()[1].getText()
                                && that.selectedChars[s].CHARVAL_DESC === tableItemsFull[k].getCells()[1].getTitle()
                            ) {
                                tableItemsFull[k].setSelected(true);
                            }
                        }
                    }
                    var tableItems = that.selectedChars, object = {}, array = [];
                    if (tableItems.length > 0) {
                        for (var i = 0; i < tableItems.length; i++) {
                            var array3 = [];
                            object = { CHAR_VALUE: tableItems[i].CHAR_VALUE, CHAR_NUM: tableItems[i].CHAR_NUM };
                            var filteredArray = that.removeDuplicates(that.totalUniqueIds.filter(a => a.CHAR_VALUE === object.CHAR_VALUE && a.CHAR_NUM === object.CHAR_NUM), 'UNIQUE_ID');
                            if (filteredArray.length > 0) {
                                filteredArray.forEach(function (oItem) {
                                    array3.push(oItem.UNIQUE_ID)
                                })
                                // array.push(array3);
                                array = array.concat(array3);
                            }
                            else {
                                count = 1;
                                break;
                            }
                        }
                        if (count === 1) {
                            that.byId("idInput").setText('0');
                            that.newUniqueMode.setData({ uniqueDetails: [] });
                            that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                            MessageToast.show("No combination of Unique Id's available for selections");
                            that.byId("idGenSeedOrder").setEnabled(false);
                        }
                        else {
                            var uniqueIds = that.getMatchingUIDs(array);
                            var arrayIds = [];
                            for (var i = 0; i < uniqueIds.length; i++) {
                                var object = {};
                                object = { UNIQUE_ID: uniqueIds[i] };
                                arrayIds.push(object);
                            }
                            that.uniqueIds = arrayIds;
                            that.uniqueIds = [...new Set(that.uniqueIds)];
                            that.byId("idInput").setText(that.uniqueIds.length);
                            that.newUniqueMode.setData({ uniqueDetails: that.uniqueIds });
                            that.byId("idUniqueDetails").setModel(that.newUniqueMode);

                            if (that.byId("idVBox").getItems().length === 0) {
                                that.byId("idGenSeedOrder").setEnabled(true);
                            }
                            else {
                                var oDataSet = that.byId("idVBox").getModel().oData.setPanel, count = 0;
                                for (var k = 0; k < oDataSet.length; k++) {
                                    var child = oDataSet[k].child;
                                    if (child[child.length - 1].CHARVAL_INPUT !== "100") {
                                        count++;
                                        break;
                                    }
                                }
                                if (count !== 0) {
                                    that.byId("idGenSeedOrder").setEnabled(false);
                                    MessageToast.show("Total Percentage not equal to 100 in step2");
                                }
                                else {
                                    that.byId("idGenSeedOrder").setEnabled(true);
                                }
                            }
                        }
                    }
                    else {
                        that.uniqueIds = that.uniqueIds1;
                        that.uniqueIds = [...new Set(that.uniqueIds)];
                        that.byId("idInput").setText(that.uniqueIds.length);
                        that.newUniqueMode.setData({ uniqueDetails: that.uniqueIds });
                        that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                    }
                    sap.ui.core.BusyIndicator.hide()
                }
            },
            /**Remoing duplicates function */
            removeDuplicates: function (array, key) {
                var check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            },
            /**
             * 
             * @param {ON Selection of Characteristics in step 2 in wizard} oEvent 
             */
            handleCharSelection: function (oEvent) {
                that.byId("idIconTabBar").setVisible(false);
                that.byId("LogList").setVisible(false)
                that.byId("idHBox100").setVisible(true);
                that.emptyModel2.setData({ res: [] });
                that.byId("LogList").setModel(that.emptyModel2);
                that.sumArray = [];
                that.uniqueName = [];
                that.byId("idCharName").removeAllTokens();
                var selectedItem = oEvent.getParameter("selectedContexts");
                that.charNum = that.byId("idCharName");
                selectedItem.forEach(function (oItem) {
                    that.charNum.addToken(
                        new sap.m.Token({
                            key: oItem.getModel().getProperty(oItem.sPath).CHAR_NAME,
                            text: oItem.getModel().getProperty(oItem.sPath).CHAR_NAME,
                            editable: false
                        })
                    );
                });

                for (var i = 0; i < selectedItem.length; i++) {
                    that.uniqueName.push({
                        PRODUCT_ID: that.byId("prodInput").getValue(),
                        CHAR_NAME: selectedItem[i].getObject().CHAR_NAME,
                        child: that.newChildArray(selectedItem[i].getObject().CHAR_NUM)
                    });
                    var length = that.uniqueName[i].child.length;
                    that.uniqueName[i].LENGTH = length;
                    that.uniqueName[i].child.push({
                        CHAR_VALUE: "Total Percentage",
                        FLAG: false,
                        CHARVAL_DESC: "(Sum value to be equal to 100)",
                        CHARVAL_INPUT: ''
                    });

                }
                for (var i = 0; i < that.uniqueName.length; i++) {
                    if (that.uniqueName[i].LENGTH === 1) {
                        that.uniqueName[i].child[0].CHARVAL_INPUT = "100";
                        that.uniqueName[i].child[1].CHARVAL_INPUT = "100";
                    }
                }
                that.uniqueTabNames = that.uniqueName;
                that.oAlgoListModel.setData({ setPanel: [] });
                that.oAlgoListModel.setData({ setPanel: that.uniqueName });
                that.byId("idVBox").setModel(that.oAlgoListModel);
                that.byId("idVBox").setVisible(true);
                sap.ui.getCore().byId("idCharSelect").getBinding("items").filter([]);
                if (that.oGModel.getProperty("/Flag1") === "X") {
                    that.onAddition();
                }
            },
            /**
             * Function for addition of option percentages in Step 2 wizard
             */
            onAddition: function () {
                var count1 = 0;
                var tableItems = that.byId("idVBox").getItems();
                for (var k = 0; k < tableItems.length; k++) {
                    var tablePanelItems = tableItems[k].getContent()[0].getItems();
                    this._totalValue1 = 0;
                    for (var l = 0; l < tablePanelItems.length - 1; l++) {
                        var tabInput = tablePanelItems[l].getCells()[1].getValue();
                        var inputValue = parseFloat(tabInput) || 0;
                        this._totalValue1 += inputValue;
                    }
                    tablePanelItems[l].getCells()[1].setValue(this._totalValue1);
                    if (+this._totalValue1 === 100) {
                        tablePanelItems[l].getCells()[1].setValueState("Success");
                        tablePanelItems[l].getCells()[1].setValueStateText("Sum equal to 100")
                    }
                    else if (+this._totalValue1 === 0) {
                        tablePanelItems[l].getCells()[1].setValueState("None");
                    }
                    else {
                        tablePanelItems[l].getCells()[1].setValueState("Error");
                        tablePanelItems[l].getCells()[1].setValueStateText("Sum not equal to 100")
                    }

                }

                for (var s = 0; s < tableItems.length; s++) {
                    var childItems = tableItems[s].getContent()[0].getItems();
                    if (childItems[childItems.length - 1].getCells()[1].getValue() !== "100"
                        && childItems[childItems.length - 1].getCells()[1].getValue() !== "0" &&
                        childItems[childItems.length - 1].getCells()[1].getValue() !== "") {
                        count1++;
                        break;
                    }
                }
                if (count1 === 0) {
                    that.byId("idSaveBtn").setEnabled(true);
                }
                else {
                    that.byId("idSaveBtn").setEnabled(false);
                }

            },
            /**
             * 
             * @param {*} oEvent 
             */
            onOptEnter: function (oEvent) {
                that.oGModel.setProperty("/Flag1", "X");
                var count = 0;
                var input = oEvent.getSource();
                var inputValue = input.getValue();
                // Use a regular expression to remove non-numeric characters
                var numericValue = inputValue.replace(/[^\d.]/g, '');
                // Update the input value with the cleaned numeric value
                input.setValue(numericValue);
                var tableItems = oEvent.getSource().getParent().getTable().getItems();

                this._totalValue = 0;

                for (var k = 0; k < tableItems.length - 1; k++) {
                    var tabInput = tableItems[k].getCells()[1].getValue();
                    var inputValue = parseFloat(tabInput) || 0;
                    this._totalValue += inputValue;
                }
                tableItems[tableItems.length - 1].getCells()[1].setValue(this._totalValue);
                if (+this._totalValue === 100) {
                    tableItems[tableItems.length - 1].getCells()[1].setValueState("Success");
                    tableItems[tableItems.length - 1].getCells()[1].setValueStateText("Sum equal to 100")
                }
                else if (+this._totalValue === 0) {
                    tableItems[tableItems.length - 1].getCells()[1].setValueState("None");
                }

                else {
                    tableItems[tableItems.length - 1].getCells()[1].setValueState("Error");
                    tableItems[tableItems.length - 1].getCells()[1].setValueStateText("Sum not equal to 100")
                }
                var boxModel = that.byId("idVBox").getItems();
                for (var s = 0; s < boxModel.length; s++) {
                    var childItems = boxModel[s].getContent()[0].getItems();
                    if (childItems[childItems.length - 1].getCells()[1].getValue() !== "100"
                        && childItems[childItems.length - 1].getCells()[1].getValue() !== "0" && childItems[childItems.length - 1].getCells()[1].getValue() !== "") {
                        count++;
                        break;
                    }
                }
                if (count === 0) {
                    if (that.byId("idInput").getText() !== "0") {
                        that.byId("idGenSeedOrder").setEnabled(true);
                    }
                    else {
                        MessageToast.show("No combination of Unique Id's available for selections in Step1");
                        that.byId("idGenSeedOrder").setEnabled(false);
                    }
                }
                else {
                    that.byId("idGenSeedOrder").setEnabled(false);
                }
                // Use the map method to create a new array with the updated value
                that.uniqueTabNames = that.uniqueTabNames.map(obj =>
                    obj.CHAR_VALUE === oEvent.getSource().getBindingContext().getObject().CHAR_VALUE ? { ...obj, CHARVAL_INPUT: numericValue } : obj
                );
            },

            /**
            * On selection of customer group in filters/home view
            * */
            handleCustSelection: function (oEvent) {
                var oTokensCust = {}, newToken = [];
                that.byId("idCustGrp").removeAllTokens();
                var selectedCustomer = oEvent.getParameter("selectedContexts");
                selectedCustomer.forEach(function (oItem) {
                    that.byId("idCustGrp").addToken(
                        new sap.m.Token({
                            key: oItem.getModel().getProperty(oItem.sPath).CUSTOMER_GROUP,
                            text: oItem.getModel().getProperty(oItem.sPath).CUSTOMER_DESC,
                            editable: false
                        })
                    );
                    oTokensCust = {
                        FIELD: "Customer Group",
                        VALUE: oItem.getObject().CUSTOMER_GROUP
                    }
                    newToken.push(oTokensCust);

                });
                sap.ui.getCore().byId("custGrpList").getBinding("items").filter([]);
                newToken = newToken.sort(that.dynamicSortMultiple("VALUE"));
                if (that.finaloTokens.length > 0) {
                    that.finaloTokens = that.finaloTokens.sort(that.dynamicSortMultiple("VALUE"));
                }
                if (JSON.stringify(newToken) !== JSON.stringify(that.finaloTokens)) {
                    that.byId("idMatList123").setModified(true);
                }

            },
            /**
            * On press of generate seed order in home view 
            * */
            onGenSeedOrder: function () {
                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new Text({ text: "Do you want to generate Seed Orders?" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                that.generateSeedOrder();
                                this.oApproveDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "No",
                            press: function () {
                                this.oApproveDialog.close();
                            }.bind(this)
                        })
                    });
                }

                this.oApproveDialog.open();
            },
            /**
            * On press of cancel in Unique ID fragment
            * */
            handleClose2: function (oEvent) {
                sap.ui.getCore().byId("idUniqueSearch").setValue("");
                if (sap.ui.getCore().byId("idUniqueDetails").getBinding("items")) {
                    sap.ui.getCore().byId("idUniqueDetails").getBinding("items").filter([]);
                }
                that._UniqueIDs.close();
            },
            /**
            * On press of cancel in cofig Product
            * */
            handleClose: function (oEvent) {
                that.prodModel1.setData({ prodDetails: that.newProds });
                sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
            },
            /**
            * On press of cancel in generate seed order fragment 
            * */
            onCancelOrder: function () {
                sap.ui.getCore().byId("idLocation").setValue("");
                sap.ui.getCore().byId("idProduct").setValue("");
                sap.ui.getCore().byId("idCust").setValue("");
                sap.ui.getCore().byId("idUniq").setValue("");
                sap.ui.getCore().byId("idQuantity").setValue("");
                sap.ui.getCore().byId("idDate").setValue("");
                sap.ui.getCore().byId("idUniq").setEditable(true);
                sap.ui.getCore().byId("idQuantity").setValueState("None");
                that._valueHelpDialogSeedOrder.close();
            },
            /**
            * On press of Save in Step 2 on wizard 
            * */
            onCharSave: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var objectData = {}, objectArray = [], count = 0;
                var aTreeBoxItems = that.byId("LogList").getModel().getData().res
                if (aTreeBoxItems.length > 0) {
                    for (let i = 0; i < aTreeBoxItems.length; i++) {
                        var aChild = aTreeBoxItems[i].children
                        for (let j = 0; j < aChild.length; j++) {
                            objectData = {
                                PRODUCT_ID: that.byId("prodInput").getValue(),
                                CHAR_NUM: aChild[j].CHAR_NUM,
                                CHARVAL_NUM: aChild[j].CHAR_VALUE,
                                OPT_PERCENT: aChild[j].OPT_PERCENT
                            }
                            objectArray.push(objectData);
                            objectData = {}
                        }
                    }
                }
                else {
                    var vBoxItems = that.byId("idVBox").getItems();
                    for (var i = 0; i < vBoxItems.length; i++) {
                        var childItems = vBoxItems[i].getContent()[0].getItems();
                        if (childItems[childItems.length - 1].getCells()[1].getValue() === "100") {
                            for (var k = 0; k < childItems.length - 1; k++) {
                                if (childItems[k].getCells()[1].getValue() === "") {
                                    var opt_percent = "0";
                                }
                                else {
                                    var opt_percent = childItems[k].getCells()[1].getValue();
                                }
                                objectData = {
                                    PRODUCT_ID: that.byId("prodInput").getValue(),
                                    CHAR_NUM: childItems[k].getBindingContext().getObject().CHAR_NUM,
                                    CHARVAL_NUM: childItems[k].getBindingContext().getObject().CHAR_VALUE,
                                    OPT_PERCENT: opt_percent
                                }
                                objectArray.push(objectData);
                                objectData = {}
                            }
                        }
                    }

                }
                if (count === 0) {
                    this.getOwnerComponent().getModel("BModel").callFunction("/postCharOptionPercent", {
                        method: "GET",
                        urlParameters: {
                            CHAROPTPERCENT: JSON.stringify(objectArray)
                        },
                        success: function (oData) {
                            that.newGenSeedOrder();
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                }
                else {
                    that.oGModel.setProperty("/CharOptFlag", '')
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Please Provide Option percentages for Characteristic Values in Step 2");
                }

            },
            /**
            * On press of cancel in Step 2 on wizard 
            * */
            onCharCancel: function () {
                var vBoxItems = that.byId("idVBox").getItems();
                for (var i = 0; i < vBoxItems.length; i++) {
                    var childItems = vBoxItems[i].getContent()[0].getItems();
                    for (var k = 0; k < childItems.length - 1; k++) {
                        if (childItems[k].getCells()[1])
                            (childItems[k].getCells()[1].setValue() === "")
                    }
                }
                var selectedItems = sap.ui.getCore().byId("idCharSelect").getItems();
                for (var i = 0; i < selectedItems.length; i++) {
                    selectedItems[i].setSelected(false);
                }
                if (sap.ui.getCore().byId("idCharSelect").getBinding("items")) {
                    sap.ui.getCore().byId("idCharSelect").getBinding("items").filter([]);
                }
                that.uniqueTabNames = [];
                that.byId("idCharName").removeAllTokens();
                that.emptyModel1.setData({ setPanel: [] });
                that.emptyModel2.setData({ res: [] })
                that.byId("LogList").setModel(that.emptyModel2)
                that.byId("idVBox").setModel(that.emptyModel1);
                that.byId("idIconTabBar").setVisible(false)
            },
            /**
            * On press of cancel in Step 1 on wizard 
            * */
            onListCancel: function () {
                // that.byId("idpartInput").removeAllTokens();
                that.byId("idCharSearch").setVisible(false);
                that.emptyModel.setData({ items1: [] });
                that.byId("idCharTable").setModel(that.emptyModel);
                that.byId("idCharTable").setVisible(false);
            },
            /**
             * On press of save in Step 1 in wizard 
             * */
            onCharsLoad: function () {
                sap.ui.core.BusyIndicator.show()
                var charItems = {}, charArray = [];
                var table = that.byId("idCharTable");
                var tabMode = table.getMode();
                var selectedLocation = that.byId("idloc").getValue();
                var selectedProduct = that.byId("prodInput").getValue();
                if (that.selectedChars.length > 0) {
                    for (var i = 0; i < that.selectedChars.length; i++) {
                        charItems.LOCATION_ID = selectedLocation;
                        charItems.PRODUCT_ID = selectedProduct;
                        charItems.CHAR_NUM = that.selectedChars[i].CHAR_NUM;
                        charItems.CHAR_DESC = that.selectedChars[i].CHAR_DESC;
                        charItems.CHAR_VALUE = that.selectedChars[i].CHAR_VALUE;
                        charItems.CHARVAL_DESC = that.selectedChars[i].CHARVAL_DESC;
                        charItems.CHARVAL_NUM = that.selectedChars[i].CHAR_VALUE;
                        charArray.push(charItems);
                        charItems = {};
                    }
                }
                else {
                    var charAllData = that.removeCharDuplicate(that.totalUniqueIds, ["CHAR_VALUE", "CHAR_NUM"]);
                    for (var i = 0; i < charAllData.length; i++) {
                        charItems.LOCATION_ID = selectedLocation;
                        charItems.PRODUCT_ID = selectedProduct;
                        charItems.CHAR_NUM = charAllData[i].CHAR_NUM;
                        charItems.CHAR_DESC = charAllData[i].CHAR_DESC;
                        charItems.CHAR_VALUE = charAllData[i].CHAR_VALUE;
                        charItems.CHARVAL_DESC = charAllData[i].CHARVAL_DESC;
                        charItems.CHARVAL_NUM = charAllData[i].CHAR_VALUE;
                        charArray.push(charItems);
                        charItems = {};
                    }

                }
            },
            /**
             * 
             * @param {On selection/deselection of characteristics in Partial Prod Step 1} oEvent 
             */
            onTableItemsSelect: function (oEvent) {
                that.oGModel.setProperty("/selectedChars", "X")
                var oEntry = {}, count = 0;
                that.allCharacterstics1 = that.charsProd;
                var UID = that.oGModel.getProperty("/totUID");
                sap.ui.core.BusyIndicator.show();
                if (oEvent.getParameter("selectAll")) {
                    that.selectedChars = [], that.uniqueIds = [];
                    var filterData = that.oGModel.getProperty("/distUID");
                    for (var i = 0; i < that.allCharacterstics1.length; i++) {
                        oEntry = {
                            LOCATION_ID: that.byId("idloc").getValue(),
                            PRODUCT_ID: that.byId("prodInput").getValue(),
                            CHAR_NUM: that.allCharacterstics1[i].CHAR_NUM,
                            CHAR_DESC: that.allCharacterstics1[i].CHAR_DESC,
                            CHARVAL_DESC: that.allCharacterstics1[i].CHARVAL_DESC,
                            CHAR_VALUE: that.allCharacterstics1[i].CHAR_VALUE,
                            CHARVAL_NUM: that.allCharacterstics1[i].CHAR_VALUE
                        }
                        that.selectedChars.push(oEntry);
                    }

                    that.newUniqueMode.setData({ uniqueDetails: filterData });
                    that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                    that.byId("idInput").setText(filterData.length);
                    unselectFlag = "X";
                    // if (filterData.length === 0) {                        
                    //     that.byId("idGenSeedOrder").setEnabled(false);
                    // } else {
                    //     that.byId("idGenSeedOrder").setEnabled(true);
                    // }
                }
                else {
                    var selected = oEvent.getParameters().selected;
                    var unselectFlag = "";
                    if (selected) {
                        that.selectedChars = [];
                        var tabSelectedItems = that.byId("idCharTable").getSelectedItems();
                        for (var k = 0; k < tabSelectedItems.length; k++) {
                            var totalData = tabSelectedItems[k].getCells()[0].getBindingContext().getObject();
                            oEntry = {
                                LOCATION_ID: that.byId("idloc").getValue(),
                                PRODUCT_ID: that.byId("prodInput").getValue(),
                                CHAR_NUM: totalData.CHAR_NUM,
                                CHAR_DESC: totalData.CHAR_DESC,
                                CHARVAL_DESC: totalData.CHARVAL_DESC,
                                CHAR_VALUE: totalData.CHAR_VALUE,
                                CHARVAL_NUM: totalData.CHAR_VALUE
                            }
                            that.selectedChars.push(oEntry);
                        }
                    }
                    else {
                        if (oEvent.getParameters().listItems.length > 1) {
                            that.selectedChars = [];
                            var filterData = that.oGModel.getProperty("/distUID");
                            that.newUniqueMode.setData({ uniqueDetails: filterData });
                            that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                            that.byId("idInput").setText(filterData.length);
                            unselectFlag = "X";
                            if (filterData.length === 0) {
                                MessageToast.show("No combination of Unique Id's available for selections");
                                that.byId("idGenSeedOrder").setEnabled(false);
                            } else {
                                that.byId("idGenSeedOrder").setEnabled(true);
                            }
                        }
                        else {
                            var Charnum = oEvent.getParameters().listItem.getCells()[0].getText();
                            var Charvalue = oEvent.getParameters().listItem.getCells()[1].getText();
                            var index = that.selectedChars.findIndex(el => el.CHAR_NUM === Charnum && el.CHAR_VALUE === Charvalue);
                            that.selectedChars.splice(index, 1);
                            if (that.selectedChars.length === 0) {
                                var filterData = that.oGModel.getProperty("/distUID");
                                that.newUniqueMode.setData({ uniqueDetails: filterData });
                                that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                                that.byId("idInput").setText(that.oGModel.getProperty("/distUID").length);
                                unselectFlag = "X";
                            }
                        }
                    }
                    if (unselectFlag === "") {
                        var tableItems = that.selectedChars, object = {}, array = [];
                        var count = 0;
                        var tempData = [];
                        for (var i = 0; i < tableItems.length; i++) {
                            if (tableItems.length === 1 || tableItems.length - 1 === i) {
                                if (count === 1) {
                                    tempData.push(tableItems[i]);
                                    count = 0;
                                } else {
                                    tempData.push(tableItems[i]);
                                    count = 0;
                                }
                            } else {
                                if (tableItems[i].CHAR_NUM === tableItems[i + 1].CHAR_NUM) {
                                    tempData.push(tableItems[i]);
                                    // i++;
                                    count = 1;
                                } else {
                                    count = 0;
                                    tempData.push(tableItems[i]);
                                }
                            }

                            if (count === 0) {
                                var data = [];
                                tempData.forEach(ele => {
                                    var char = UID.filter(el => el.CHAR_NUM === ele.CHAR_NUM && el.CHAR_VALUE === ele.CHAR_VALUE);
                                    data = data.concat(char.sort());
                                });
                            }
                        }
                        data = data.map(item => item.UIDS);
                        data.forEach(ele => {
                            ele.sort((a, b) => a.UNIQUE_ID - b.UNIQUE_ID)
                        })

                        // Step 1: Get arrays of UNIQUE_IDs from each set
                        var uniqueIdSets = data.map(set => set.map(item => item.UNIQUE_ID));

                        // Step 2: Find common UNIQUE_IDs across all sets
                        var repeatedIdsInAllSets = uniqueIdSets.reduce((a, b) => a.filter(c => b.includes(c)));

                        // Step 3: Filter objects with those common UNIQUE_IDs
                        var repeatedObjectsInAllSets = data.flat().filter(
                            item => repeatedIdsInAllSets.includes(item.UNIQUE_ID)
                        );

                        // Step 4: Remove duplicates in the result
                        var finalRepeatedObjects = repeatedObjectsInAllSets.filter(
                            (item, index, array) => array.findIndex(obj => obj.UNIQUE_ID === item.UNIQUE_ID) === index
                        );

                        var filterData = that.removeDuplicates(finalRepeatedObjects, 'UNIQUE_ID');
                        that.newUniqueMode.setData({ uniqueDetails: filterData });
                        that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                        that.byId("idInput").setText(filterData.length);
                    }
                }
                var hideButton = "";
                if (filterData.length > 0) {
                    that.byId("idGenSeedOrder").setEnabled(true);
                    that.byId("idHBox100").setVisible(true);
                    var newEmptyModel = new JSONModel();
                    newEmptyModel.setData({ setCharacteristics: [] });
                    sap.ui.getCore().byId("idCharSelect").setModel(newEmptyModel);
                    newEmptyModel.setData({ setPanel: [] });
                    that.byId("idVBox").setModel(newEmptyModel);
                    that.byId("idCharName").removeAllTokens();
                    // Extract the UNIQUE_ID values from the objects in uniqueIdsToFind
                    const uniqueIds = filterData.map(idObj => idObj.UNIQUE_ID);
                    var uniqueData = UID.filter(data => data.UIDS.some(uid => uniqueIds.includes(uid.UNIQUE_ID)))
                        .map(data => ({
                            CHAR_NAME: data.CHAR_NAME,
                            CHAR_DESC: data.CHAR_DESC,
                            CHAR_VALUE: data.CHAR_VALUE,
                            CHAR_NUM: data.CHAR_NUM
                        }));
                    uniqueData = that.removeDuplicates(uniqueData, "CHAR_NAME");
                    that.oNewModel.setData({ setCharacteristics: uniqueData });
                    sap.ui.getCore().byId("idCharSelect").setModel(that.oNewModel);
                } else if (filterData.length === 0) {
                    MessageToast.show("No combination of Unique Id's available for selections");
                    that.byId("idGenSeedOrder").setEnabled(false);
                    var newEmptyModel = new JSONModel();
                    newEmptyModel.setData({ setCharacteristics: [] });
                    sap.ui.getCore().byId("idCharSelect").setModel(newEmptyModel);
                    newEmptyModel.setData({ setPanel: [] });
                    that.byId("idVBox").setModel(newEmptyModel);
                    that.byId("idCharName").removeAllTokens();
                    that.byId("idHBox100").setVisible(false);
                }
                else {
                    var idBox = that.byId("idVBox").getItems();
                    for (var k = 0; k < idBox.length; k++) {
                        var content = idBox[k].getContent()[0].getItems();
                        var countfull = content[content.length - 1].getCells()[1].getValue();
                        if (parseInt(countfull) !== 100) {
                            hideButton = "X";
                            break;
                        }
                    }
                    if (hideButton === "X") {
                        that.byId("idGenSeedOrder").setEnabled(false);
                        MessageToast.show("Total Percentage not equal to 100 in step2");
                    }
                    else {
                        that.byId("idGenSeedOrder").setEnabled(true);
                    }
                }
                sap.ui.core.BusyIndicator.hide();
            },
            /**For getting combination of unique ids */
            getMatchingUIDs: function (arrays) {
                if (arrays.length === 0) return [];
                // Initialize with the first array's elements
                let commonElements = new Set(arrays);
                // Intersect the common elements with each array in arrays
                // for (let i = 1; i < arrays.length; i++) {
                //     commonElements = new Set(arrays[i].filter(item => commonElements.has(item)));
                // }
                return Array.from(commonElements);
            },
            /**
             * 
             * @param {Search on Step 1} oEvent 
             */
            handleSearch1: function (oEvent) {
                var sQuery =
                    oEvent.getParameter("value") || oEvent.getParameter("newValue"),
                    sId = oEvent.getParameter("id"),
                    oFilters = [];
                // Check if search filter is to be applied
                sQuery = sQuery ? sQuery.trim() : "";
                if (sQuery !== "") {
                    oFilters.push(
                        new Filter({
                            filters: [
                                new Filter("CHAR_NUM", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_DESC", FilterOperator.Contains, sQuery),
                                new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                new Filter("CHARVAL_DESC", FilterOperator.Contains, sQuery)
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idCharTable").getBinding("items").filter(oFilters);
            },
            generateSeedOrder: function () {
                sap.ui.core.BusyIndicator.show();
                var aTreeBoxItems = [];
                var tableSelected = that.byId("idCharTable").getSelectedItems();
                if (that.byId("LogList").getModel()) {
                    aTreeBoxItems = that.byId("LogList").getModel().getData().res
                }
                var vBoxItems = that.byId("idVBox").getItems();
                if (aTreeBoxItems.length > 0 || vBoxItems.length > 0) {
                    that.oGModel.setProperty("/CharOptFlag", "X");
                    that.onCharSave();
                }
                else {
                    that.newGenSeedOrder();
                }

            },
            newGenSeedOrder: function () {
                var count = 0, newArray = [], charItems = {}, charArray = [];
                that.messageArray = [];
                var productConfig = that.byId("prodInput").getValue();
                var demandLocation = that.byId("idloc").getValue();
                var customerGroup = that.byId("idCustGrp").getTokens();
                var fromDate = that.byId("idDateRange").getFrom();
                var toDate = that.byId("idDateRange").getTo();
                fromDate = fromDate.toLocaleDateString('en-US');
                fromDate = that.convertDateFormat(fromDate);
                toDate = toDate.toLocaleDateString('en-US');
                toDate = that.convertDateFormat(toDate);
                var Flag = that.oGModel.getProperty("/CharOptFlag");
                if (Flag === undefined) {
                    var FLAG = '';
                }
                else {
                    var FLAG = Flag;
                }
                var aScheduleSEDT = {};
                // Get Job Schedule Start/End Date/Time
                aScheduleSEDT = that.getScheduleSEDT();
                var dCurrDateTime = new Date().getTime();
                var actionText = "/v2/catalog/generateSeedOrders";
                var JobName = "Seed Order Generation" + dCurrDateTime;
                sap.ui.core.BusyIndicator.show();
                // if(that.selectedChars.length>0){
                var selectedUniques = that.byId("idUniqueDetails").getModel().oData.uniqueDetails;
                for (var i = 0; i < selectedUniques.length; i++) {
                    charArray.push(selectedUniques[i].UNIQUE_ID);
                }

                for (var i = 0; i < customerGroup.length; i++) {
                    // Define the URL and request body
                    const data = {
                        LOCATION_ID: demandLocation,
                        PRODUCT_ID: productConfig,
                        CUSTOMER_GROUP: customerGroup[i].getKey(),
                        FROMDATE: fromDate,
                        TODATE: toDate,
                        CHARDATA: JSON.stringify(charArray),
                        CHAROPTFLAG: FLAG
                    };
                    if (i === 0) {
                        count = count;
                    }
                    else {
                        count = count + 2;
                    }
                    var Obj = {
                        data: data,
                        cron: "",
                        time: aScheduleSEDT.oneTime,
                        active: true,
                        startTime: that.addMinutesToDateTime(aScheduleSEDT.dsSDate, count),
                        endTime: that.addMinutesToDateTime(aScheduleSEDT.dsEDate, count)
                    }
                    newArray.push(Obj);
                }

                var finalList = {
                    name: JobName,
                    description: "Seed Order Generation",
                    action: encodeURIComponent(actionText),
                    active: true,
                    httpMethod: "POST",
                    startTime: aScheduleSEDT.djSdate,
                    endTime: aScheduleSEDT.djEdate,
                    createdAt: aScheduleSEDT.djSdate,

                    schedules: newArray
                };
                this.getOwnerComponent().getModel("JModel").callFunction("/addMLJob", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(finalList),
                    },
                    success: function (oData) {
                        that.byId("idGenSeedOrder").setEnabled(false);
                        sap.ui.core.BusyIndicator.hide();
                        that.onResetDate();
                        that.oGModel.setProperty("/CharOptFlag", '')
                        sap.m.MessageToast.show(oData.addMLJob + ": Job Created");
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Service Connectivity Issue!");
                    },
                });

            },
            addMinutesToDateTime: function (dateTimeString, minutesToAdd) {
                // Split the datetime string into its components
                const [datePart, timePart, offset] = dateTimeString.split(" ");
                // Create a combined string that JavaScript Date can parse
                const dateTime = `${datePart}T${timePart}:00${offset}`;
                // Create a Date object
                const date = new Date(dateTime);
                // Add the specified minutes
                date.setMinutes(date.getMinutes() + minutesToAdd);
                // Format the updated Date object back to the original format
                const updatedDatePart = date.toISOString().slice(0, 10);
                const updatedTimePart = date.toISOString().slice(11, 16);
                const updatedOffset = offset;

                return `${updatedDatePart} ${updatedTimePart} ${updatedOffset}`;
            },
            convertDateFormat: function (dateString) {
                // Split the original date string into day, month, and year components
                var parts = dateString.split('/');
                var day = parts[1]; // Day component
                var month = parts[0]; // Month component
                var year = parts[2]; // Year component

                // Pad single-digit month and day with leading zeros
                month = month.padStart(2, '0');
                day = day.padStart(2, '0');

                // Concatenate the components in yyyy-MM-dd format
                return `${year}-${month}-${day}`;
            },
            onNavPress: function () {
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                    // generate the Hash to display 
                    var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "VCPDocument",
                            action: "Display"
                        }
                    })) || "";
                    //Generate a  URL for the second application
                    var url = window.location.href.split('#')[0] + hash;
                    //Navigate to second app
                    sap.m.URLHelper.redirect(url, true);
                }
            },
            getScheduleSEDT: function () {
                var aScheduleSEDT = {};
                var dDate = new Date();
                // 07-09-2022-1                
                var idSchTime = dDate.setSeconds(dDate.getSeconds() + 20);
                // 07-09-2022-1
                var idSETime = dDate.setHours(dDate.getHours() + 2);
                idSchTime = new Date(idSchTime);
                idSETime = new Date(idSETime);
                //var onetime = idSchTime;
                var djSdate = new Date(),
                    djEdate = idSETime,
                    dsSDate = new Date(),
                    dsEDate = idSETime,
                    tjStime,
                    tjEtime,
                    tsStime,
                    tsEtime;

                djSdate = djSdate.toISOString().split("T");
                tjStime = djSdate[1].split(":");
                djEdate = djEdate.toISOString().split("T");
                tjEtime = djEdate[1].split(":");
                dsSDate = dsSDate.toISOString().split("T");
                tsStime = dsSDate[1].split(":");
                dsEDate = dsEDate.toISOString().split("T");
                tsEtime = dsEDate[1].split(":");

                var dDate = new Date().toLocaleString().split(" ");
                aScheduleSEDT.djSdate = djSdate[0] + " " + tjStime[0] + ":" + tjStime[1] + " " + "+0000";
                aScheduleSEDT.djEdate = djEdate[0] + " " + tjEtime[0] + ":" + tjEtime[1] + " " + "+0000";
                aScheduleSEDT.dsSDate = dsSDate[0] + " " + tsStime[0] + ":" + tsStime[1] + " " + "+0000";
                aScheduleSEDT.dsEDate = dsEDate[0] + " " + tsEtime[0] + ":" + tsEtime[1] + " " + "+0000";
                aScheduleSEDT.oneTime = idSchTime;

                return aScheduleSEDT;

            },
            removeCharDuplicate: function (array, properties) {
                const seen = new Set();
                return array.filter(item => {
                    const key = properties.map(prop => item[prop]).join('|');
                    if (seen.has(key)) {
                        return false;
                    }
                    seen.add(key);
                    return true;
                });
            },
            // DownLoad func Starts
            onDownLoad: function (oEvent) {
                var aDown = []
                var aCols, oSettings, oSheet;
                var sFileName = "Seed Order Creation";
                // + new Date().getTime();
                if (that.byId("idCharName").getTokens().length <= 0) {
                    var oTableBind = []
                    for (var i = 0; i < that.loadArray1.length; i++) {
                        oTableBind.push({
                            PRODUCT_ID: that.byId("prodInput").getValue(),
                            CHAR_NAME: that.loadArray1[i].CHAR_NAME,
                            child: that.newChildArray(that.loadArray1[i].CHAR_NUM)
                        });
                        var length = oTableBind[i].child.length;
                        oTableBind[i].LENGTH = length;
                        oTableBind[i].child.push({
                            CHAR_VALUE: "Total Percentage",
                            CHARVAL_DESC: "(Sum value to be equal to 100)",
                            CHARVALUE_INPUT: ''
                        });

                    }
                    for (var i = 0; i < oTableBind.length; i++) {
                        if (oTableBind[i].LENGTH === 1) {
                            oTableBind[i].child[0].CHARVAL_INPUT = "100";
                            oTableBind[i].child[1].CHARVAL_INPUT = "100";
                        }
                    }
                }
                else {
                    var oTableBind = that.byId("idVBox").getItems()[0].oBindingContexts.undefined.oModel.oData.setPanel
                }
                for (let i = 0; i < oTableBind.length; i++) {
                    if (oTableBind[i].CHAR_NAME !== "") {
                        if (oTableBind[i].child.length > 0) {
                            for (let j = 0; j < oTableBind[i].child.length; j++) {
                                if (oTableBind[i].child[j].CHAR_VALUE == "Total Percentage") {
                                }
                                else {
                                    if (oTableBind[i].child[j].CHARVAL_INPUT == "") {
                                        aDown.push({
                                            Characteristic_Name: oTableBind[i].CHAR_NAME,
                                            Characteristic_Value: oTableBind[i].child[j].CHAR_VALUE,
                                            Characteristic_Value_Desc: oTableBind[i].child[j].CHARVAL_DESC,
                                            Option_Percentage: parseInt(0),
                                            Comment: ""
                                        })
                                    }
                                    else if (oTableBind[i].child[j].CHARVAL_INPUT == "100") {
                                        aDown.push({
                                            Characteristic_Name: oTableBind[i].CHAR_NAME,
                                            Characteristic_Value: oTableBind[i].child[j].CHAR_VALUE,
                                            Characteristic_Value_Desc: oTableBind[i].child[j].CHARVAL_DESC,
                                            Option_Percentage: parseInt(100),
                                            Comment: ""
                                        })
                                    } else {
                                        aDown.push({
                                            Characteristic_Name: oTableBind[i].CHAR_NAME,
                                            Characteristic_Value: oTableBind[i].child[j].CHAR_VALUE,
                                            Characteristic_Value_Desc: oTableBind[i].child[j].CHARVAL_DESC,
                                            Option_Percentage: parseInt(0),
                                            Comment: "No Unique ID available for this characteristic value"
                                        })
                                    }

                                }
                            }
                        }
                    }
                }
                var aCols = []
                for (var j = 0; j < Object.keys(aDown[0]).length; j++) {
                    aCols.push({
                        property: Object.keys(aDown[0])[j],
                        type: EdmType.String,
                        label: Object.keys(aDown[0])[j]
                    });
                }
                var oSettings = {
                    workbook: {
                        columns: aCols
                    },
                    dataSource: aDown,
                    fileName: sFileName,
                    worker: true
                };
                var oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            // DownLoad Func Ends


            // Upload Func Starts
            onUpload: function (e) {
                sap.ui.core.BusyIndicator.show()
                that.byId("idGenSeedOrder").setEnabled(true);
                this.importExcel(e.getParameter("files") && e.getParameter("files")[0]);
            },
            Emport: function (array) {
                that.byId("idVBox").setVisible(false);
                var selectedProduct = that.byId("prodInput").getValue();
                var oModel = that.getOwnerComponent().getModel("oGModel");
                oModel.setProperty("/", array)
                var otreemodel = that.getOwnerComponent().getModel("oGModel");
                // debugger;
                // var aValidArray= []
                if (array.every(item => item.hasOwnProperty('Characteristic_Value')
                    && item.hasOwnProperty('Characteristic_Name')
                    && item.hasOwnProperty('Characteristic_Value_Desc'))) {
                    for (let i = 0; i < array.length; i++) {
                        // if(array[i].some(item => item.hasOwnProperty('Characteristic_value'))){
                        for (let k = 0; k < that.loadArray.length; k++) {
                            if (that.loadArray[k].CHAR_NAME == array[i].Characteristic_Name
                                && that.loadArray[k].CHAR_VALUE == array[i].Characteristic_Value) {
                                array[i].CHARVAL_NUM = that.loadArray[k].Characteristic_Value
                                array[i].CHAR_NUM = that.loadArray[k].CHAR_NUM
                            }
                            // }
                        }
                    }
                }
                else {
                    sap.ui.core.BusyIndicator.hide();
                    return setTimeout(function () { MessageToast.show("Uploaded file contains null values in Characteristic_Name or Characteristic_Value or Characteristic_Value_Desc. Please reupload again") }, 1000);
                }
                var targetNames = array.map(item => item.Characteristic_Name);
                // Filter that.loadArray1 based on targetNames
                var filteredLoadArray1 = that.loadArray1.filter(item => targetNames.includes(item.CHAR_NAME));
                var resultArray = filteredLoadArray1.map(item => ({
                    CHAR_NAME: item.CHAR_NAME,
                    CHARVAL_NUM: item.CHAR_VALUE,
                    CHAR_NUM: item.CHAR_NUM,
                }));
                if (resultArray.length <= 0) {
                    MessageToast.show("Unique Characteristic values doesn't belong to this Product ID");
                    sap.ui.core.BusyIndicator.hide()
                    return false
                }
                var SubResults = array;
                var Array1 = [];
                var dArray = [];
                var oTableBind = [];
                for (let i = 0; i < SubResults.length; i++) {
                    oTableBind.push({
                        CHAR_NAME: SubResults[i].Characteristic_Name,
                        child: that.newChildArray(SubResults[i].CHAR_NUM)
                    });
                    oTableBind[i].child.push({
                        CHAR_VALUE: "Total Percentage",
                        CHARVAL_DESC: "(Sum value to be equal to 100)"
                    });
                }
                var UniWeek = {};
                //NOC is removed Duplicates of oTableBind
                var NOC = oTableBind.filter(function (obj) {
                    if (!UniWeek[obj.CHAR_NAME]) {
                        UniWeek[obj.CHAR_NAME] = true;
                        return true;
                    }
                    return false;
                });
                for (let i = 0; i < SubResults.length; i++) {
                    var index = dArray.indexOf(SubResults[i].Characteristic_Name);
                    if (index === -1) {
                        var obj1 = {
                            CHAR_NAME: SubResults[i].Characteristic_Name,
                            child: false,
                            parent: true,
                            children: [{
                                CHAR_VALUE: SubResults[i].Characteristic_Value,
                                CHARVAL_DESC: SubResults[i].Characteristic_Value_Desc,
                                CHARVAL_NUM: SubResults[i].Characteristic_Value,
                                CHAR_NUM: SubResults[i].CHAR_NUM,
                                OPT_PERCENT: (SubResults[i].Option_Percentage),

                                child: true,
                                parent: false,
                            }]
                        }
                        dArray.push(SubResults[i].Characteristic_Name)
                        Array1.push(obj1)
                    }
                    else {
                        var oChd = {
                            CHAR_VALUE: SubResults[i].Characteristic_Value,
                            CHARVAL_DESC: SubResults[i].Characteristic_Value_Desc,
                            CHARVAL_NUM: SubResults[i].Characteristic_Value,
                            CHAR_NUM: SubResults[i].CHAR_NUM,
                            OPT_PERCENT: (SubResults[i].Option_Percentage),

                            child: true,
                            parent: false,
                        }
                        Array1[index].children.push(oChd)
                    }
                }
                let aFinalData = [];
                let aNonValid = [];
                for (let i = 0; i < Array1.length; i++) {
                    let matched = false;
                    for (let y = 0; y < NOC.length; y++) {
                        if (Array1[i].CHAR_NAME === NOC[y].CHAR_NAME) {
                            matched = true;

                            for (let k = 0; k < Array1[i].children.length; k++) {
                                // Check corresponding child in NOC
                                if (NOC[y].child[k].CHARVAL_INPUT === "") {
                                    // Condition where CHARVAL_INPUT is ""
                                    // Array1.OPT_PERCENT should be a number
                                    if (!isNaN(parseFloat(Array1[i].children[k].OPT_PERCENT)) && !isNaN(parseFloat(Array1[i].children[k].OPT_PERCENT) > 0)) {
                                        aFinalData.push(Array1[i]);
                                    }
                                    else if (Array1[i].children[k].OPT_PERCENT === "0") {
                                        aFinalData.push(Array1[i]);
                                    }
                                    else if (Array1[i].children[k].OPT_PERCENT === undefined) {
                                        Array1[i].children[k].OPT_PERCENT = '0';
                                        aFinalData.push(Array1[i]);
                                    }
                                    else {
                                        sap.m.MessageToast.show("Uploaded file contains invalid values in Option_Percentage column.");
                                        sap.ui.core.BusyIndicator.hide()
                                        return false;
                                    }
                                } else if (NOC[y].child[k].CHARVAL_INPUT === "0") {
                                    // Condition where CHARVAL_INPUT is "0"
                                    // Array1.OPT_PERCENT should include "No Unique ID"
                                    if (parseInt(Array1[i].children[k].OPT_PERCENT) > 0) {
                                        Array1[i].children[k].COMMENT = "No Unique Id's available for this characteristic value"
                                        aNonValid.push(Array1[i]);
                                    }
                                }

                            }
                            break;
                        }
                    }
                    if (!matched) {
                        sap.m.MessageToast.show("No matching CHAR_NAME found");
                        sap.ui.core.BusyIndicator.hide()
                        return false;
                    }
                }
                var UniWeek = {};
                var filteredDOC = aFinalData.filter(function (obj) {
                    if (!UniWeek[obj.CHAR_NAME]) {
                        UniWeek[obj.CHAR_NAME] = true;
                        return true;
                    }
                    return false;
                });
                var nonValidSet = new Set(aNonValid.map(item => item.CHAR_NAME));
                var DOC = filteredDOC.filter(item => !nonValidSet.has(item.CHAR_NAME));

                that.aSucces = [];
                that.aErrorLog = [];
                that.aValidZeros = [];
                for (let i = 0; i < DOC.length; i++) {
                    if (DOC[i].children) {
                        var iTotal = 0;
                        for (let j = 0; j < DOC[i].children.length; j++) {
                            if (DOC[i].children[j]) {
                                if ((DOC[i].children[j].OPT_PERCENT).includes("No Unique ID")) {

                                } else {
                                    iTotal += parseInt(DOC[i].children[j].OPT_PERCENT)
                                }

                            }
                        }
                        if (iTotal == parseInt(100)) {
                            DOC[i].TotalPercentage = 100;
                            that.aSucces.push(DOC[i])
                        } else if (iTotal == parseInt(0)) {
                            that.aValidZeros.push(DOC[i])

                        } else {
                            if (iTotal > 100) {
                                DOC[i].COMMENT = "Option Percentage More than 100"
                            }
                            else {
                                DOC[i].COMMENT = "Option Percentage Less than 100"
                            }
                            DOC[i].TotalPercentage = parseInt(iTotal)
                            that.aErrorLog.push(DOC[i])
                        }
                    }
                }

                that.aErrorLog = that.aErrorLog.concat(aNonValid);
                // let duplicates = new Set(that.aErrorLog.map(item => item.CHAR_NAME));
                // var aTotalError = that.aErrorLog.filter(item => !duplicates.has(item.CHAR_NAME));
                var aTotalError = [...new Set(that.aErrorLog)];

                that.aErrorLog = aTotalError
                if (that.aSucces.length == 0 && that.aErrorLog.length == 0) {
                    MessageToast.show("All the values contains 0  ")
                    that.byId("idIconTabBar").setVisible(false);
                    sap.ui.core.BusyIndicator.hide()
                    return false
                } else {
                    if (that.byId("idCharName").getTokens().length > 0) {
                        let iMatch = 0;
                        if (that.uniqueName.length == (NOC.length)) {
                            // var LOC = that.aSucces.push(that.aErrorLog)
                            // merge array1 and array2
                            const LOC = [...that.aSucces, ...that.aErrorLog, ...that.aValidZeros]


                            let op = that.uniqueName.map((e, i) => {
                                let temp = NOC.find(element => element.CHAR_NAME === e.CHAR_NAME)
                                if (temp == undefined) {
                                    that.byId("idIconTabBar").setVisible(false)
                                    MessageToast.show("Uploaded file doesn't correspond to selected/downloaded characteristic values. Please upload correct characteristic values file")
                                    sap.ui.core.BusyIndicator.hide()
                                    return false
                                }
                                else {
                                    e.CHAR_NAME = temp.CHAR_NAME;
                                    iMatch++
                                }
                                return e;
                            })
                            if (iMatch == NOC.length) {
                                console.log(op)
                                that.byId("LogList").setVisible(true)
                                that.byId("idIconTabBar").setVisible(true);
                                that.byId("idIconTabBar").setSelectedKey("Success")
                                // var otreemodel = that.getOwnerComponent().getModel("oGModel");
                                otreemodel.setData({
                                    res: that.aSucces
                                });

                                that.byId("LogList").setModel(otreemodel).expandToLevel(1)
                                that.byId("BulKSave").setVisible(true);
                                // that.byId("idHBox1").setVisible(false)
                                // that.byId("idHBox2").setVisible(true)

                            } else {
                                that.byId("idIconTabBar").setVisible(false)
                                MessageToast.show("Uploaded file doesn't correspond to selected/downloaded characteristic values. Please upload correct characteristic values file")
                                sap.ui.core.BusyIndicator.hide()
                                return false
                            }

                        } else {
                            that.byId("idIconTabBar").setVisible(false)
                            MessageToast.show("Uploaded file doesn't correspond to selected/downloaded characteristic values. Please upload correct characteristic values file")
                            sap.ui.core.BusyIndicator.hide()
                            return false
                        }
                    } else {
                        that.byId("LogList").setVisible(true);
                        that.byId("idIconTabBar").setVisible(true);
                        that.byId("idIconTabBar").setSelectedKey("Success");
                        otreemodel.setData({
                            res: that.aSucces
                        });
                        that.byId("LogList").setModel(otreemodel).expandToLevel(1)
                        that.byId("BulKSave").setVisible(true);
                        that.byId("idGenSeedOrder").setEnabled(true);
                        sap.ui.core.BusyIndicator.hide()
                    }
                }
                if (that.aErrorLog.length > 0) {
                    sap.ui.core.BusyIndicator.hide()
                    MessageToast.show("Uploaded file contains errors. Please re-upload a valid file");
                    that.byId("idGenSeedOrder").setEnabled(false);
                }
                else {
                    sap.ui.core.BusyIndicator.hide()
                    if (that.byId("idInput").getText() !== "0") {
                        that.byId("idGenSeedOrder").setEnabled(true);
                    }
                    else {
                        sap.ui.core.BusyIndicator.hide()
                        MessageToast.show("No combination of Unique Id's available for selections in Step1");
                        that.byId("idGenSeedOrder").setEnabled(false);
                    }
                }
            },
            importExcel: function (file) {
                if (file.type.endsWith("spreadsheetml.sheet") == false) {
                    return MessageToast.show("Please upload only files of type XLSX");
                }
                sap.ui.core.BusyIndicator.show();
                that.oExcel = {
                    SEEDDATA: [],
                };
                var excelData = [];
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            if (excelData.length > 0) {
                                that.Emport(excelData);
                            }
                            else {
                                sap.ui.core.BusyIndicator.hide();
                                return MessageToast.show("Wrong file uploaded")
                            }
                        });
                    }
                    reader.onerror = function (ex) {
                        sap.ui.core.BusyIndicator.hide();
                        console.log(ex);

                    };
                    reader.readAsBinaryString(file);

                }

            },
            //tabSelection code starts 
            onTabSelect: function () {
                if (that.byId("idIconTabBar").mProperties.selectedKey == "Success") {
                    that.byId("LogList").setVisible(true)
                    that.byId("idIconTabBar").setVisible(true)
                    var otreemodel = that.getOwnerComponent().getModel("oGModel");
                    otreemodel.setData({
                        res: that.aSucces
                    });
                    that.byId("LogList").setModel(otreemodel).expandToLevel(1)
                    that.byId("BulKSave").setVisible(true);
                    // that.byId("idHBox1").setVisible(false)
                    // that.byId("idHBox2").setVisible(true)
                } else {
                    that.byId("LogList").setVisible(true)
                    that.byId("idIconTabBar").setVisible(true)
                    var otreemodel = that.getOwnerComponent().getModel("oGModel");
                    otreemodel.setData({
                        res: that.aErrorLog
                    });
                    that.byId("LogList").setModel(otreemodel).expandToLevel(1)
                    that.byId("BulKSave").setVisible(false);
                }
            },
            /**On Press of UniqueID button in step1 */
            onUniqueIdShow: function () {
                var input = that.byId("idInput").getText();
                if (input !== "0") {
                    that.newUniqueMode.setData({ uniqueDetails: that.uniqueIds });
                    sap.ui.getCore().byId("idUniqueDetails").setModel(that.newUniqueMode);
                    that._UniqueIDs.open();
                }
                else {
                    MessageToast.show("No Unique Id's available to show for the selection");
                }
            },
            /**Generate child array for enabled true/false in step 2 */
            newChildArray: function (CHAR_NUM) {
                that.newTotalCharValues = [];
                var selectedCharNum = CHAR_NUM;
                var totalCharValues = that.removeDuplicates(that.loadArray.filter(a => a.CHAR_NUM === selectedCharNum), 'CHAR_VALUE');
                that.newTotalCharValues = totalCharValues;
                for (var j = 0; j < totalCharValues.length; j++) {
                    var availableUniqueId = that.totalUniqueIds.filter(a => a.CHAR_VALUE === totalCharValues[j].CHAR_VALUE && a.CHAR_NUM === selectedCharNum);
                    if (availableUniqueId.length > 0) {
                        that.newTotalCharValues[j].ENABLED = true;
                        that.newTotalCharValues[j].CHARVAL_INPUT = '';
                    }
                    else if (availableUniqueId.length === 0) {
                        that.newTotalCharValues[j].ENABLED = false;
                        that.newTotalCharValues[j].CHARVAL_INPUT = '0';
                    }
                }
                that.newTotalCharValues.sort((a, b) => a.CHAR_VALUE.localeCompare(b.CHAR_VALUE, undefined, { numeric: true }));
                return that.newTotalCharValues;
            },
            /**On Press of Unique Id's in UniqueID fragment */
            onUniqueIdPress: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var selectedItem = oEvent.getSource().getText();
                that.getOwnerComponent().getModel("BModel").read("/getUniqueItem", {
                    filters: [
                        new Filter("UNIQUE_ID", FilterOperator.EQ, selectedItem),
                    ],
                    success: function (oData) {
                        that.oCharModel.setData({
                            resultsChar: oData.results,
                        });
                        if (!that._valueHelpDialogUniquePrimary) {
                            that._valueHelpDialogUniquePrimary = sap.ui.xmlfragment(
                                "vcp.vcpseedordercreationnew.view.UniqueIDPrimaryId",
                                that
                            );
                            that.getView().addDependent(that._valueHelpDialogUniquePrimary);
                        }
                        sap.ui.getCore().byId("idMatvarItem").setModel(that.oCharModel);
                        that._valueHelpDialogUniquePrimary.open();
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("No data");
                    },
                });
            },
            onCloseDesc: function () {
                sap.ui.getCore().byId("idCharSearch").setValue("");
                that._valueHelpDialogUniquePrimary.destroy();
                that._valueHelpDialogUniquePrimary = "";
            },
            getAllProds: function () {
                var topCount = that.oGModel.getProperty("/MaxCount")
                this.getOwnerComponent().getModel("BModel").read("/getProducts", {
                    urlParameters: {
                        "$skip": that.skip,
                        "$top": topCount
                    },
                    success: function (oData) {
                        if (topCount == oData.results.length) {
                            that.skip += topCount;
                            that.allData = that.allData.concat(oData.results);
                            that.getAllProds();
                        } else {
                            that.skip = 0;
                            that.allData = that.allData.concat(oData.results);
                            oData.results = that.allData
                            that.allData = [];
                            that.newProds = [],
                                that.newProds = oData.results;
                            that.prodModel1.setData({ prodDetails: oData.results });
                            sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
                            sap.ui.core.BusyIndicator.hide()
                        }
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get configurable products");
                    },
                });
            },
            getAllLocProd: function (selectedProdItem) {
                var selectedProdItem = that.byId("prodInput").getValue();
                var topCount = that.oGModel.getProperty("/MaxCount")
                this.getOwnerComponent().getModel("BModel").read("/getfactorylocdesc", {
                    filters: [
                        new Filter(
                            "REF_PRODID",
                            FilterOperator.EQ,
                            selectedProdItem
                        ),
                    ],
                    urlParameters: {
                        "$skip": that.skip,
                        "$top": topCount
                    },
                    success: function (oData) {
                        if (topCount == oData.results.length) {
                            that.skip += topCount;
                            that.allData = that.allData.concat(oData.results);
                            that.getAllLocProd();
                        } else {
                            that.skip = 0;
                            that.allData = that.allData.concat(oData.results);
                            oData.results = that.allData
                            that.allData = []
                            if (oData.results.length > 0) {
                                var finalItems = that.removeDuplicates(oData.results, "DEMAND_LOC");
                                that.locModel.setData({ locDetails: finalItems });
                                sap.ui.getCore().byId("LocationList").setModel(that.locModel);
                                that.prodModel1.setData({ prodDetails: that.newProds });
                                sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
                                sap.ui.getCore().byId("prodSlctListJS").getBinding("items").filter([]);
                            }
                            else {
                                that.locModel.setData({ locDetails: [] });
                                sap.ui.getCore().byId("LocationList").setModel(that.locModel);
                                that.prodModel1.setData({ prodDetails: that.newProds });
                                sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
                                sap.ui.getCore().byId("prodSlctListJS").getBinding("items").filter([]);
                                MessageToast.show("No demand locations available for selected product");
                            }
                        }
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get configurable products");
                    },
                });
            },
            getAllCustGrp: function () {
                var topCount = that.oGModel.getProperty("/MaxCount")
                this.getOwnerComponent().getModel("BModel").read("/getCustgroup", {
                    urlParameters: {
                        "$skip": that.skip,
                        "$top": topCount
                    },
                    success: function (oData) {
                        if (topCount == oData.results.length) {
                            that.skip += topCount;
                            that.allData = that.allData.concat(oData.results);
                            that.getAllCustGrp();
                        } else {
                            that.skip = 0;
                            that.allData = that.allData.concat(oData.results);
                            oData.results = that.allData
                            that.allData = [];
                            that.custModel.setData({ custDetails: oData.results });
                            sap.ui.getCore().byId("custGrpList").setModel(that.custModel);
                            sap.ui.getCore().byId("LocationList").getBinding("items").filter([]);
                            sap.ui.core.BusyIndicator.hide()

                        }
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get configurable products");
                    },
                });
            },
            getAllGenParProd: function () {
                var topCount = that.oGModel.getProperty("/MaxCount")
                var prodItem = that.byId("prodInput").getValue();
                var locItem = that.byId("idloc").getValue();
                var oFilters = [];
                oFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, prodItem));
                oFilters.push(new Filter("UID_TYPE", FilterOperator.EQ, "U"));
                this.getOwnerComponent().getModel("BModel").read("/genPartialProd", {
                    filters: [
                        new Filter("REF_PRODID", FilterOperator.EQ, prodItem),
                        new Filter("LOCATION_ID", FilterOperator.EQ, locItem)
                    ],
                    urlParameters: {
                        "$skip": that.skip,
                        "$top": topCount
                    },
                    success: function (oData) {
                        if (topCount == oData.results.length) {
                            that.skip += topCount;
                            that.allData = that.allData.concat(oData.results);
                            that.getAllGenParProd();
                        } else {
                            that.skip = 0;
                            that.allData = that.allData.concat(oData.results);
                            oData.results = that.allData;
                            that.allData = [];
                            if (oData.results.length > 0) {
                                for (var i = 0; i < oData.results.length; i++) {
                                    if (prodItem !== oData.results[i].PRODUCT_ID) {
                                        that.partProdItems.push(oData.results[i])
                                    }
                                }
                                if (that.partProdItems.length > 0) {
                                    that.partModel.setData({ partDetails: that.partProdItems });
                                    sap.ui.getCore().byId("partProdSlct").clearSelection();
                                    sap.ui.getCore().byId("partProdSlct").setModel(that.partModel);
                                    that.byId("idPartProd").setVisible(true);
                                }
                                else {
                                    that.byId("idPartProd").setVisible(false);
                                }
                            }
                            else {
                                // MessageToast.show("No Partial products available for selected Config Product/Location");
                                that.byId("idPartProd").setVisible(false);
                            }
                        }
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get Partial Products");
                    }
                });
            },
            getAllParChar: function (oProdFilters, tableItemsFull) {
                var topCount = that.oGModel.getProperty("/MaxCount")
                this.getOwnerComponent().getModel("BModel").read("/getPartialChar", {
                    filters: [oProdFilters],
                    urlParameters: {
                        "$skip": that.skip,
                        "$top": topCount
                    },
                    success: function (oData) {
                        if (topCount == oData.results.length) {
                            that.skip += topCount;
                            that.allData = that.allData.concat(oData.results);
                            that.getAllParChar();
                        } else {
                            that.skip = 0;
                            that.allData = that.allData.concat(oData.results);
                            oData.results = that.allData;
                            that.allData = [];
                            if (oData.results.length > 0) {
                                var partProdDetails = oData.results;
                                sap.ui.getCore().byId("partProdSlct").getBinding("items").filter([]);
                                for (var k = 0; k < tableItemsFull.length; k++) {
                                    for (var s = 0; s < partProdDetails.length; s++) {
                                        if (partProdDetails[s].CHAR_NUM === tableItemsFull[k].getCells()[0].getText()
                                            && partProdDetails[s].CHAR_VALUE === tableItemsFull[k].getCells()[1].getText()
                                            && partProdDetails[s].CHARVAL_DESC === tableItemsFull[k].getCells()[1].getTitle()
                                        ) {
                                            tableItemsFull[k].setSelected(true);
                                            that.newpartprodChars.push(partProdDetails[s]);
                                        }
                                    }
                                }
                                that.newpartprodChars = that.removeCharDuplicate(that.newpartprodChars, ['CHAR_NUM', 'CHAR_VALUE', 'CHARVALUE_DESC']);
                                that.selectedChars = that.selectedChars.concat(that.newpartprodChars);
                                that.selectedChars = that.removeCharDuplicate(that.selectedChars, ['CHAR_NUM', 'CHAR_VALUE', 'CHARVALUE_DESC']);
                                var tableItems = that.selectedChars, object = {}, array = [];
                                var count = 0;
                                var tempData = [];
                                var UID = that.oGModel.getProperty("/totUID");
                                for (var i = 0; i < tableItems.length; i++) {
                                    if (tableItems.length === 1 || tableItems.length - 1 === i) {
                                        if (count === 1) {
                                            tempData.push(tableItems[i]);
                                            count = 0;
                                        } else {
                                            tempData.push(tableItems[i]);
                                            count = 0;
                                        }
                                    } else {
                                        if (tableItems[i].CHAR_NUM === tableItems[i + 1].CHAR_NUM) {
                                            tempData.push(tableItems[i]);
                                            // i++;
                                            count = 1;
                                        } else {
                                            count = 0;
                                            tempData.push(tableItems[i]);
                                        }
                                    }
                                    if (count === 0) {
                                        var data = [];
                                    }
                                }
                                tempData.forEach(ele => {
                                    var char = UID.filter(el => el.CHAR_NUM === ele.CHAR_NUM && el.CHAR_VALUE === ele.CHAR_VALUE);
                                    data = data.concat(char);
                                });
                                data = data.map(item => item.UIDS);
                                data.forEach(ele => {
                                    ele.sort((a, b) => a.UNIQUE_ID - b.UNIQUE_ID)
                                })
                                // Step 1: Get arrays of UNIQUE_IDs from each set
                                var uniqueIdSets = data.map(set => set.map(item => item.UNIQUE_ID));
                                // Step 2: Find common UNIQUE_IDs across all sets
                                // var repeatedIdsInAllSets = uniqueIdSets.reduce((a, b) => a.filter(c => b.includes(c)));
                                var repeatedIdsInAllSets = uniqueIdSets.reduce((common, currentSet) => {
                                    return common.filter(item =>
                                        currentSet.some(element => element === item)
                                    );
                                });

                                // Step 3: Filter objects with those common UNIQUE_IDs
                                var repeatedObjectsInAllSets = data.flat().filter(
                                    item => repeatedIdsInAllSets.includes(item.UNIQUE_ID)
                                );
                                // Step 4: Remove duplicates in the result
                                var finalRepeatedObjects = repeatedObjectsInAllSets.filter(
                                    (item, index, array) => array.findIndex(obj => obj.UNIQUE_ID === item.UNIQUE_ID) === index
                                );

                                var filterData = that.removeDuplicates(finalRepeatedObjects, 'UNIQUE_ID');
                                that.newUniqueMode.setData({ uniqueDetails: filterData });
                                that.byId("idUniqueDetails").setModel(that.newUniqueMode);
                                that.byId("idInput").setText(filterData.length);
                                if (filterData.length === 0) {
                                    that.byId("idGenSeedOrder").setEnabled(false);
                                    var newEmptyModel = new JSONModel();
                                    newEmptyModel.setData({ setCharacteristics: [] });
                                    sap.ui.getCore().byId("idCharSelect").setModel(newEmptyModel);
                                    newEmptyModel.setData({ setPanel: [] });
                                    that.byId("idVBox").setModel(newEmptyModel);
                                    that.byId("idCharName").removeAllTokens();
                                    that.byId("idHBox100").setVisible(false);
                                } else {
                                    that.byId("idHBox100").setVisible(true);
                                    that.byId("idGenSeedOrder").setEnabled(true);
                                    var newEmptyModel = new JSONModel();
                                    newEmptyModel.setData({ setCharacteristics: [] });
                                    sap.ui.getCore().byId("idCharSelect").setModel(newEmptyModel);
                                    newEmptyModel.setData({ setPanel: [] });
                                    that.byId("idVBox").setModel(newEmptyModel);
                                    that.byId("idCharName").removeAllTokens();
                                    // Extract the UNIQUE_ID values from the objects in uniqueIdsToFind
                                    const uniqueIds = filterData.map(idObj => idObj.UNIQUE_ID);
                                    var uniqueData = UID.filter(data => data.UIDS.some(uid => uniqueIds.includes(uid.UNIQUE_ID)))
                                        .map(data => ({
                                            CHAR_NAME: data.CHAR_NAME,
                                            CHAR_DESC: data.CHAR_DESC,
                                            CHAR_VALUE: data.CHAR_VALUE,
                                            CHAR_NUM: data.CHAR_NUM
                                        }));
                                    uniqueData = that.removeDuplicates(uniqueData, "CHAR_NAME");
                                    that.oNewModel.setData({ setCharacteristics: uniqueData });
                                    sap.ui.getCore().byId("idCharSelect").setModel(that.oNewModel);
                                }

                                // if (that.byId("idVBox").getItems().length === 0 && filterData.length > 0) {
                                //     that.byId("idGenSeedOrder").setEnabled(true);
                                // } else if (filterData.length === 0) {
                                //     that.byId("idGenSeedOrder").setEnabled(false);
                                // }
                                // else {
                                //     var oDataSet = that.byId("idVBox").getModel().oData.setPanel, count = 0;

                                //     var idBox = that.byId("idVBox").getItems();
                                //     var hideButton = "";
                                //     for (var k = 0; k < idBox.length; k++) {
                                //         var content = idBox[k].getContent()[0].getItems();
                                //         var countfull = content[content.length - 1].getCells()[1].getValue();

                                //         if (parseInt(countfull) !== 100) {
                                //             hideButton = "X";
                                //             break;
                                //         }
                                //     }
                                //     if (hideButton === "X") {
                                //         that.byId("idGenSeedOrder").setEnabled(false);
                                //         MessageToast.show("Total Percentage not equal to 100 in step2");
                                //     }
                                //     else {
                                //         that.byId("idGenSeedOrder").setEnabled(true);
                                //     }
                                // }
                                sap.ui.core.BusyIndicator.hide()
                            }
                            else {
                                sap.ui.core.BusyIndicator.hide()
                                MessageToast.show("No data available for selected partial product");
                            }
                        }
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get Partial Products");
                    }
                });
            },
            /*Getting variant view data*/
            getVariantData: function () {
                var ndData = [];
                var dData = [], uniqueName = [];
                that.uniqueName = [];
                sap.ui.core.BusyIndicator.show();
                // var variantUser = this.getUser();
                var variantUser = 'pradeepkumardaka@sbpcorp.in';
                var appName = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                that.oGModel.setProperty("/UserId", variantUser);
                // Define the filters
                var filters = [
                    new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("APPLICATION_NAME", sap.ui.model.FilterOperator.EQ, appName),
                            new sap.ui.model.Filter("USER", sap.ui.model.FilterOperator.EQ, variantUser)
                        ],
                        and: true
                    }),
                ];

                // Combine the filters with an OR condition
                var filter = new sap.ui.model.Filter({
                    filters: filters,
                    and: false
                });
                this.getView().getModel("BModel").read("/getVariantHeader", {
                    filters: [filter],
                    success: function (oData) {
                        if (oData.results.length === 0) {
                            that.oGModel.setProperty("/variantDetails", "");
                            that.oGModel.setProperty("/fromFunction", "X");
                            uniqueName.unshift({
                                "VARIANTNAME": "Standard",
                                "VARIANTID": "0",
                                "DEFAULT": "Y",
                                "REMOVE": false,
                                "CHANGE": false,
                                "USER": "SAP",
                                "SCOPE": "PUBLIC"
                            })
                            that.oGModel.setProperty("/viewNames", uniqueName);
                            that.oGModel.setProperty("/defaultDetails", "");
                            that.viewDetails.setData({
                                items1: uniqueName
                            });
                            that.varianNames = uniqueName;
                            that.byId("idMatList123").setModel(that.viewDetails);
                            that.byId("idMatList123").setDefaultKey(uniqueName[0].VARIANTID);
                            that.byId("idMatList123").setSelectedKey(uniqueName[0].VARIANTID);
                            var Default = "Standard";
                            if (that.oGModel.getProperty("/newVaraintFlag") === "X") {
                                var newVariant = that.oGModel.getProperty("/newVariant");
                                that.handleSelectPress(newVariant[0].VARIANTNAME);
                                that.oGModel.setProperty("/newVaraintFlag", "");
                            } else {
                                // that.handleSelectPress(Default);
                            }
                        }
                        else {
                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].DEFAULT === "Y" && oData.results[i].USER === variantUser) {
                                    dData.push(oData.results[i]);
                                    that.byId("idMatList123").setDefaultKey((oData.results[i].VARIANTID));
                                    that.byId("idMatList123").setSelectedKey((oData.results[i].VARIANTID))
                                }
                                ndData.push(oData.results[i]);
                            }

                            if (dData.length > 0) {
                                that.oGModel.setProperty("/defaultVariant", dData);
                            }
                            that.oGModel.setProperty("/VariantData", ndData);

                            that.getTotalVariantDetails();
                        }
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error while loading variant details");
                    },
                });
            },
            getTotalVariantDetails: function () {
                var aData = [], uniqueName = [], details = {}, defaultDetails = [], oFilters = [];
                var headerData = that.oGModel.getProperty("/VariantData");
                if (headerData.length > 0) {
                    for (var i = 0; i < headerData.length; i++) {
                        oFilters.push(new Filter("VARIANTID", FilterOperator.EQ, headerData[i].VARIANTID));
                    }
                }
                var userVariant = that.oGModel.getProperty("/UserId");
                this.getOwnerComponent().getModel("BModel").read("/getVariant", {
                    filters: [oFilters],
                    success: function (oData) {
                        var variantNewData = oData.results;
                        aData = variantNewData.map(item1 => {
                            const item2 = headerData.find(item2 => item2.VARIANTID === item1.VARIANTID);
                            return item2 ? { ...item1, ...item2 } : { ...item1 };
                        });
                        that.oGModel.setProperty("/variantDetails", aData);
                        if (aData.length > 0) {
                            uniqueName = that.removeDuplicate(aData, "VARIANTNAME");
                            that.oGModel.setProperty("/saveBtn", "");
                            for (var k = 0; k < uniqueName.length; k++) {
                                if (uniqueName[k].DEFAULT === "Y" && uniqueName[k].USER === userVariant) {
                                    var Default = uniqueName[k].VARIANTNAME;
                                    details = {
                                        "VARIANTNAME": uniqueName[k].VARIANTNAME,
                                        "VARIANTID": uniqueName[k].VARIANTID,
                                        "USER": uniqueName[k].USER,
                                        "DEFAULT": "N"
                                    };
                                    defaultDetails.push(details);
                                    details = {};
                                }
                            }
                        }

                        that.oGModel.setProperty("/fromFunction", "X");
                        if (Default) {
                            uniqueName.unshift({
                                "VARIANTNAME": "Standard",
                                "VARIANTID": "0",
                                "DEFAULT": "N",
                                "REMOVE": false,
                                "CHANGE": false,
                                "USER": "SAP",
                                "SCOPE": "PUBLIC"
                            })
                            that.oGModel.setProperty("/viewNames", uniqueName);
                            that.variantModel.setData({
                                items1: uniqueName
                            });
                            that.varianNames = uniqueName;
                            that.oGModel.setProperty("/defaultDetails", defaultDetails);
                            that.byId("idMatList123").setModel(that.variantModel);
                            if (that.oGModel.getProperty("/newVaraintFlag") === "X") {
                                var newVariant = that.oGModel.getProperty("/newVariant");
                                that.handleSelectPress(newVariant[0].VARIANTNAME);
                                if (newVariant[0].DEFAULT === "Y") {
                                    that.byId("idMatList123").setDefaultKey((newVariant[0].VARIANTID));
                                }
                                that.byId("idMatList123").setSelectedKey((newVariant[0].VARIANTID))
                                that.oGModel.setProperty("/newVaraintFlag", "");
                            } else {
                                that.handleSelectPress(Default);
                            }
                        } else {
                            uniqueName.unshift({
                                "VARIANTNAME": "Standard",
                                "VARIANTID": "0",
                                "DEFAULT": "Y",
                                "REMOVE": false,
                                "CHANGE": false,
                                "USER": "SAP",
                                "SCOPE": "PUBLIC"
                            })
                            that.oGModel.setProperty("/viewNames", uniqueName);
                            that.oGModel.setProperty("/defaultDetails", "");

                            that.viewDetails.setData({
                                items1: uniqueName
                            });
                            that.varianNames = uniqueName;
                            that.byId("idMatList123").setModel(that.viewDetails);
                            var Default = "Standard";
                            if (that.oGModel.getProperty("/newVaraintFlag") === "X") {
                                var newVariant = that.oGModel.getProperty("/newVariant");
                                that.handleSelectPress(newVariant[0].VARIANTNAME);
                                if (newVariant[0].DEFAULT === "Y") {
                                    that.byId("idMatList123").setDefaultKey((newVariant[0].VARIANTID));
                                }
                                that.byId("idMatList123").setSelectedKey((newVariant[0].VARIANTID))
                                that.oGModel.setProperty("/newVaraintFlag", "");
                            } else {
                                that.byId("idMatList123").setDefaultKey((uniqueName[0].VARIANTID));
                                that.byId("idMatList123").setSelectedKey((uniqueName[0].VARIANTID));
                                that.handleSelectPress(Default);
                            }
                        }

                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide()
                        MessageToast.show("error while loading variant details");
                    },
                });
            },
            removeDuplicate: function (array, key) {
                var check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            },
            /**On Press of Variant Name */
            handleSelectPress: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oLoc, oProd, oTokens = {}, custToken = [];
                that.locProdFilters = [];
                that.finaloTokens = [];
                var oTableItems = that.oGModel.getProperty("/variantDetails");
                that.byId("idMatList123").setModified(false);
                var appName = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                that.oGModel.setProperty("/setCust", []);
                that.oGModel.setProperty("/setLocation", '');
                that.oGModel.setProperty("/setProduct", '');
                that.oGModel.setProperty("/defaultLocation", "");
                that.oGModel.setProperty("/defaultProduct", "");
                that.oGModel.setProperty("/defaultCustomer", []);
                if (that.oGModel.getProperty("/fromFunction") === "X") {
                    that.oGModel.setProperty("/fromFunction", "");
                    that.selectedApp = oEvent;
                    that.oGModel.setProperty("/variantName", that.selectedApp);
                }
                else {
                    that.selectedApp = oEvent.getSource().getTitle().getText();
                    that.oGModel.setProperty("/variantName", that.selectedApp);
                }
                if (that.selectedApp !== "Standard") {
                    for (var i = 0; i < oTableItems.length; i++) {
                        if (that.selectedApp === oTableItems[i].VARIANTNAME && oTableItems[i].APPLICATION_NAME === appName) {
                            if (oTableItems[i].FIELD.includes("Loc")) {
                                oLoc = oTableItems[i].VALUE;
                                that.oGModel.setProperty("/defaultLocation", oLoc);
                                var sFilter = new sap.ui.model.Filter({
                                    path: "LOCATION_ID",
                                    operator: sap.ui.model.FilterOperator.EQ,
                                    value1: oTableItems[i].VALUE,
                                });
                                that.locProdFilters.push(sFilter);

                            }
                            else if (oTableItems[i].FIELD.includes("Prod")) {
                                oProd = oTableItems[i].VALUE;
                                that.oGModel.setProperty("/defaultProduct", oProd);
                                var sFilter = new sap.ui.model.Filter({
                                    path: "PRODUCT_ID",
                                    operator: sap.ui.model.FilterOperator.EQ,
                                    value1: oTableItems[i].VALUE,
                                });
                                that.locProdFilters.push(sFilter);

                            }
                            else if (oTableItems[i].FIELD.includes("Cust")) {
                                var oCustTemplate = new sap.m.Token({
                                    key: oTableItems[i].FIELD_CENTER,
                                    text: oTableItems[i].VALUE
                                });
                                custToken.push(oCustTemplate);
                                oCustTemplate = {};
                                oTokens = {
                                    FIELD: oTableItems[i].FIELD,
                                    VALUE: oTableItems[i].FIELD_CENTER
                                }
                                that.finaloTokens.push(oTokens);
                                that.oGModel.setProperty("/defaultCustomer", custToken);
                            }

                        }
                    }
                    that.oProd.setValue(oProd);
                    that.oCust.removeAllTokens();
                    this._valueHelpDialogProd2
                        .getAggregation("_dialog")
                        .getContent()[1]
                        .removeSelections();
                    this._valueHelpDialogCustomer
                        .getAggregation("_dialog")
                        .getContent()[1]
                        .removeSelections();
                    this._valueHelpDialogLoc
                        .getAggregation("_dialog")
                        .getContent()[1]
                        .removeSelections();
                    if (oProd) {
                        that.oGModel.setProperty("/setProduct", oProd);
                        that.getAllLocProd(oProd);
                        that.getAllCustGrp();
                        that.oLoc1.setValue();
                    }
                    if (oLoc) {
                        that.oLoc1.setValue(oLoc);
                        that.oGModel.setProperty("/setLocation", oLoc);
                    }
                    if (custToken.length > 0) {
                        custToken.forEach(item => {
                            that.oCust.addToken(new sap.m.Token({
                                key: item.getKey(),
                                text: item.getText(),
                                editable: false
                            })
                            )
                        })
                        that.oGModel.setProperty("/setCust", custToken);

                    }
                    sap.ui.core.BusyIndicator.hide();
                }
                else {
                    sap.ui.core.BusyIndicator.hide();
                    //do nothing
                    that.byId("prodInput").setValue();
                    that.byId("idloc").setValue();
                    that.byId("idCustGrp").removeAllTokens();
                    that.onResetDate();
                }
            },
            dynamicSortMultiple: function () {
                let props = arguments;
                const that = this;
                return function (obj1, obj2) {
                    var i = 0,
                        result = 0,
                        numberOfProperties = props.length;
                    while (result === 0 && i < numberOfProperties) {
                        result = that.dynamicSort(props[i])(obj1, obj2);
                        i++;
                    }
                    return result;
                };
            },
            dynamicSort: function (property) {
                var sortOrder = 1;
                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a, b) {
                    var result =
                        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
                    return result * sortOrder;
                };
            },
            /**
             * Saving the VIEW on press of save in NameVariant fragment
             * @param {*} oEvent 
             */
            onCreate: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var array = [];
                var details = {};
                var sLocation = that.byId("idloc").getValue();
                var Field1 = that.byId("idloc").getParent().getItems()[0].getText();
                var sProduct = that.byId("prodInput").getValue();
                var Field2 = that.byId("prodInput").getParent().getItems()[0].getText();
                var sCust = that.byId("idCustGrp").getTokens();
                var Field3 = that.byId("idCustGrp").getParent().getItems()[0].getText();
                var varName = oEvent.getParameters().name;
                var sDefault = oEvent.getParameters().def;
                var appName = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                if (!sLocation && !sProduct && sCust.length === 0) {
                    sap.ui.core.BusyIndicator.hide();
                    return MessageToast.show("No values selected in filters Configurable Product,Demand Location & Customer Group")
                }

                if (varName) {
                    if (sDefault && that.oGModel.getProperty("/defaultDetails").length > 0) {
                        var defaultChecked = "Y";
                        this.getOwnerComponent().getModel("BModel").callFunction("/updateVariant", {
                            method: "GET",
                            urlParameters: {
                                VARDATA: JSON.stringify(that.oGModel.getProperty("/defaultDetails"))
                            },
                            success: function (oData) {
                            },
                            error: function (error) {
                                MessageToast.show("Failed to create variant");
                            },
                        });

                    }
                    else if (sDefault && that.oGModel.getProperty("/defaultDetails").length === 0) {
                        var defaultChecked = "Y";
                    }
                    else {
                        var defaultChecked = "N";
                    }
                    if (oEvent.getParameters().public) {
                        var Scope = "PUBLIC";
                    }
                    else {
                        var Scope = "PRIVATE";
                    }
                    if (sLocation) {
                        details = {
                            Field: Field1,
                            FieldCenter: (1).toString(),
                            Value: sLocation,
                            Default: defaultChecked
                        }
                        array.push(details);
                    }
                    if (sProduct) {
                        details = {
                            Field: Field2,
                            FieldCenter: (1).toString(),
                            Value: sProduct,
                            Default: defaultChecked
                        }
                        array.push(details);
                    }
                    for (var s = 0; s < sCust.length; s++) {
                        details = {
                            Field: Field3,
                            FieldCenter: sCust[s].getKey(),
                            Value: sCust[s].getText(),
                            Default: defaultChecked
                        }
                        array.push(details);
                    }
                    if (!oEvent.getParameters().overwrite) {
                        for (var j = 0; j < array.length; j++) {
                            array[j].IDNAME = varName;
                            array[j].App_Name = appName;
                            array[j].SCOPE = Scope;
                        }
                        var flag = "X";
                    }
                    else {
                        var flag = "E";
                        for (var j = 0; j < array.length; j++) {
                            array[j].ID = oEvent.getParameters().key;
                            array[j].IDNAME = varName;
                            array[j].App_Name = appName;
                            array[j].SCOPE = Scope;
                        }
                    }
                    //    console.log(JSON.stringify(array));
                    this.getOwnerComponent().getModel("BModel").callFunction("/createVariant", {
                        method: "GET",
                        urlParameters: {
                            Flag: flag,
                            USER: (that.oGModel.getProperty("/UserId")),
                            VARDATA: JSON.stringify(array)
                        },
                        success: function (oData) {
                            that.oGModel.setProperty("/newVariant", oData.results);
                            that.oGModel.setProperty("/newVaraintFlag", "X");
                            that.byId("idMatList123").setModified(false);
                            that.onAfterRendering();
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to create variant");
                        },
                    });
                }
                else {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Please fill View Name");
                }
            },
            /**On press of save in manage fragment */
            onManage: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                var oDelted = {}, deletedArray = [], newSelection = {}, newItems = [];
                var totalVariantData = that.oGModel.getProperty("/VariantData");
                var selected = oEvent.getParameters();
                //Delete the selected variant names
                if (selected.deleted) {
                    selected.deleted.forEach(item1 => {
                        totalVariantData.forEach(item2 => {
                            if (JSON.parse(item1) === item2.VARIANTID) {
                                oDelted = {
                                    ID: item2.VARIANTID,
                                    NAME: item2.VARIANTNAME
                                };
                                deletedArray.push(oDelted);
                            }
                        })
                    });
                    if (deletedArray.length > 0) {
                        that.deleteVariant(deletedArray)
                    }
                }
                //Updating the default variants
                if (selected.def) {
                    //If selected default is not standard
                    if (JSON.parse(selected.def) !== 0) {
                        //Update the existing default to a new default
                        var defaultVariant = totalVariantData.filter(item => item.DEFAULT === "Y");
                        if (defaultVariant.length > 0) {
                            defaultVariant[0].DEFAULT = "N";
                            that.getView().getModel("BModel").callFunction("/updateVariant", {
                                method: "GET",
                                urlParameters: {
                                    VARDATA: JSON.stringify(defaultVariant)
                                },
                                success: function (oData) {
                                    var newDefault = totalVariantData.filter(item => item.VARIANTID === JSON.parse(selected.def));
                                    newDefault[0].DEFAULT = "Y";
                                    that.getView().getModel("BModel").callFunction("/updateVariant", {
                                        method: "GET",
                                        urlParameters: {
                                            VARDATA: JSON.stringify(newDefault)
                                        },
                                        success: function (oData) {
                                            that.onAfterRendering();
                                            sap.ui.core.BusyIndicator.hide();
                                        },
                                        error: function (error) {
                                            MessageToast.show("Failed to update variant");
                                        },
                                    });
                                },
                                error: function (error) {
                                    sap.ui.core.BusyIndicator.hide();
                                    MessageToast.show("Failed to update variant");
                                },
                            });

                        }
                        else {
                            var selectedVariant = totalVariantData.filter(item => item.VARIANTID === JSON.parse(selected.def));
                            selectedVariant[0].DEFAULT = "Y";
                            that.getView().getModel("BModel").callFunction("/updateVariant", {
                                method: "GET",
                                urlParameters: {
                                    VARDATA: JSON.stringify(selectedVariant)
                                },
                                success: function (oData) {
                                    that.onAfterRendering();
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (error) {
                                    sap.ui.core.BusyIndicator.hide();
                                    MessageToast.show("Failed to update variant");
                                },
                            });
                        }
                    }
                    //If selected default is standard then remove the existing default variant
                    else {
                        var defaultItem = totalVariantData.filter(item => item.DEFAULT === "Y");
                        defaultItem[0].DEFAULT = "N";
                        that.getView().getModel("BModel").callFunction("/updateVariant", {
                            method: "GET",
                            urlParameters: {
                                VARDATA: JSON.stringify(defaultItem)
                            },
                            success: function (oData) {
                                that.onAfterRendering();
                                sap.ui.core.BusyIndicator.hide();
                            },
                            error: function (error) {
                                sap.ui.core.BusyIndicator.hide();
                                MessageToast.show("Failed to update variant");
                            },
                        });
                    }
                }
                sap.ui.core.BusyIndicator.hide();
            },
            deleteVariant: function (oEvent) {
                var deletedItems = JSON.stringify(oEvent);
                that.getView().getModel("BModel").callFunction("/createVariant", {
                    method: "GET",
                    urlParameters: {
                        Flag: "D",
                        USER: that.oGModel.getProperty("/UserId"),
                        VARDATA: deletedItems
                    },
                    success: function (oData) {
                        that.deletedArray = [];
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to delete variant");
                    },
                });
            }
        });
    });
