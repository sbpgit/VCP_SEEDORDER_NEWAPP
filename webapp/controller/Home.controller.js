sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter, MessageToast, FilterOperator, Dialog, mobileLibrary, Button, Text, Sorter, MessageBox, Spreadsheet) {
        "use strict";
        var that, oGModel;
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;
        var aResults;
        return Controller.extend("vcp.vcpseedordercreationnew.controller.Home", {
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
                that.newClassModel.setSizeLimit(5000);
                that.viewDetails.setSizeLimit(5000);
                that.partModel.setSizeLimit(1000);
                that.locModel.setSizeLimit(1000);
                that.prodModel1.setSizeLimit(1000);
                that.uniqModel.setSizeLimit(1000);
                that.custModel.setSizeLimit(1000);
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
                if (!this._nameFragment) {
                    this._nameFragment = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.NameVariant",
                        this
                    );
                    this.getView().addDependent(this._nameFragment);
                }
                if (!this._popOver) {
                    this._popOver = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.PopOver",
                        this
                    );
                    this.getView().addDependent(this._popOver);
                }
                if (!this._manageVariant) {
                    this._manageVariant = sap.ui.xmlfragment(
                        "vcp.vcpseedordercreationnew.view.VariantNames",
                        this
                    );
                    this.getView().addDependent(this._manageVariant);
                }
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
                that.selectedChars = [], that.loadArray = [],
                    that.totalChars = [];
                that.charsProd = [];
                sap.ui.core.BusyIndicator.show()
                var dateSel = that.byId("idDateRange");
                $("#" + dateSel.sId + " input").prop("disabled", true);
                this.getOwnerComponent().getModel("BModel").read("/getProducts", {
                    method: "GET",
                    success: function (oData) {
                        that.prodModel1.setData({ prodDetails: oData.results });
                        sap.ui.getCore().byId("prodSlctListJS").setModel(that.prodModel1);
                        // sap.ui.core.BusyIndicator.hide()
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get configurable products");
                    },
                });

                this.getOwnerComponent().getModel("BModel").read("/getProdClsChar", {
                    success: function (oData) {
                        that.allCharacterstics = [];
                        for (let i = 0; i < oData.results.length; i++) {
                            that.loadArray.push(oData.results[i]);
                        }
                        let aDistinct = that.removeDuplicate(that.loadArray, 'CHAR_NAME');
                        that.allCharacterstics = that.loadArray;

                    },
                    error: function () {
                        MessageToast.show("Failed to get profiles");
                    },
                });

                this.getOwnerComponent().getModel("BModel").read("/getLocProdChars", {
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            that.totalChars = oData.results;
                            sap.ui.core.BusyIndicator.hide();
                        }
                    },
                    error: function (oData, error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
                // that.getVariantsData();
            },
            /**Removing duplicates */
            removeDuplicate(array, key) {
                var check = new Set();
                return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
            },
            /**
             * on Press of value helps on filters and fragments
             * @param {} oEvent 
             */
            handleValueHelp2: function (oEvent) {
                var sId = oEvent.getParameter("id");
                if (sId.includes("prod")) {
                    that._valueHelpDialogProd2.open();
                    // Prod Dialog
                }
                else if (sId.includes("loc")) {
                    if (that.byId("prodInput").getValue()) {
                        that._valueHelpDialogLoc.open();
                    } else {
                        MessageToast.show("Select Configurable Product");
                    }
                }
                else if (sId.includes("Cust")) {
                    if (that.byId("prodInput").getValue() && that.byId("idloc").getValue()) {
                        that._valueHelpDialogCustomer.open();
                    } else {
                        MessageToast.show("Select Configurable Product/Demand Location");
                    }
                }
                else if (sId.includes("part")) {
                    that._valueHelpDialogPart.open();
                }
                else if (sId.includes("Char")) {
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
                this.getOwnerComponent().getModel("BModel").read("/getFactoryLoc", {
                    filters: [
                        new Filter(
                            "PRODUCT_ID",
                            FilterOperator.EQ,
                            selectedProdItem
                        ),
                    ],
                    success: function (oData) {
                        that.locModel.setData({ locDetails: oData.results });
                        sap.ui.getCore().byId("LocationList").setModel(that.locModel);
                        sap.ui.getCore().byId("prodSlctListJS").getBinding("items").filter([]);
                        if (that.oGModel.getProperty("/resetFlag") !== "X") {
                            that.byId("idloc").setValue();
                            that.byId("idDateRange").setValue();
                            that.byId("idCustGrp").setValue();
                            that.byId("idCharSearch").setVisible(false);
                            that.emptyModel.setData([]);
                            that.byId("idCharTable").setModel(that.emptyModel);
                            that.byId("idCharTable").setVisible(false);
                            that.emptyModel1.setData({ setPanel: [] });
                            that.byId("idVBox").setModel(that.emptyModel1);
                            that.byId("idVBox").removeAllItems();
                            that.emptyModel1.setData({ setCharacteristics: [] });
                            sap.ui.getCore().byId("idCharSelect").setModel(that.emptyModel1);
                            that.byId("idpartInput").removeAllTokens();
                            that.byId("idCharName").removeAllTokens();
                            that.byId("CreateProductWizard").setVisible(false);
                            that.byId("idGenSeedOrder").setEnabled(false);
                            that.emptyModel2.setData({ res: [] })
                            that.byId("LogList").setModel(that.emptyModel2)
                            that.byId("idIconTabBar").setVisible(false)
                        }
                        sap.ui.core.BusyIndicator.hide()
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get Demand Locations");
                    },
                });
            },
            /**
             * On Press of confirm in Demand Location Fragment 
             * @param {} oEvent 
             */
            handleLocSelection: function (oEvent) {
                that.selectedChars = [];
                sap.ui.core.BusyIndicator.show()
                var selectedLocItem = oEvent.getParameters().selectedItem.getTitle();
                that.byId("idloc").setValue(selectedLocItem);
                this.getOwnerComponent().getModel("BModel").read("/getCustgroup", {
                    success: function (oData) {
                        that.custModel.setData({ custDetails: oData.results });
                        sap.ui.getCore().byId("custGrpList").setModel(that.custModel);
                        sap.ui.getCore().byId("LocationList").getBinding("items").filter([]);

                        sap.ui.core.BusyIndicator.hide()
                    },
                    error: function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Failed to get Customer Group");
                    }
                });
            },
            /**
             * On Press of reset button on header filters
             */
            onResetDate: function () {
                var vBoxItems = that.byId("idVBox").getItems();
                for (var i = 0; i < vBoxItems.length; i++) {
                    var childItems = vBoxItems[i].getContent()[0].getItems();
                    for (var k = 0; k < childItems.length - 1; k++) {
                        if (childItems[k].getCells()[1])
                            (childItems[k].getCells()[1].setValue() === "")
                    }
                }
                that.oGModel.setProperty("/resetFlag", "X");
                that.byId("prodInput").setValue();
                that.byId("idloc").setValue();
                that.byId("idCustGrp").setValue();
                that.byId("idDateRange").setValue();
                that.byId("idCharSearch").setVisible(false);
                that.emptyModel.setData([]);
                that.byId("idCharTable").setModel(that.emptyModel);
                that.byId("idCharTable").setVisible(false);
                that.emptyModel1.setData({ setPanel: [] });
                that.byId("idVBox").setModel(that.emptyModel1);
                that.byId("idVBox").removeAllItems();
                that.emptyModel1.setData({ setCharacteristics: [] });
                sap.ui.getCore().byId("idCharSelect").setModel(that.emptyModel1);
                that.byId("idpartInput").removeAllTokens();
                that.byId("idCharName").removeAllTokens();
                that.byId("CreateProductWizard").setVisible(false);
                // that.byId("CreateProductWizard").destroySteps();
                that.byId("idGenSeedOrder").setEnabled(false);
                that.emptyModel2.setData({ res: [] })
                that.byId("LogList").setModel(that.emptyModel2)
                that.byId("idIconTabBar").setVisible(false)
                // that.byId("idHBox100").setVisible(false);
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
                                    new Filter("LOCATION_ID", FilterOperator.Contains, sQuery),
                                    new Filter("LOCATION_DESC", FilterOperator.Contains, sQuery),
                                    new Filter("CHAR_VALUE", FilterOperator.Contains, sQuery),
                                new Filter("CHARVAL_DESC", FilterOperator.Contains, sQuery)
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
                    sap.ui.getCore().byId("prodSlctListJS").getBinding("items").filter(oFilters);
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
            },
            /**
             * On Press of Go on header fitler
             */
            onGetData: function () {
                sap.ui.core.BusyIndicator.show()
                that.partProdItems = [];
                that.initialSelectedChars = [];
                var prodItem = that.byId("prodInput").getValue();
                var locItem = that.byId("idloc").getValue();
                var dateRange = that.byId("idDateRange").getValue();
                var customerGroup = that.byId("idCustGrp").getValue();
                var tableData = that.byId("idCharTable");
                if (prodItem && locItem && dateRange && customerGroup) {
                    that.byId("CreateProductWizard").setVisible(true);
                    this.getOwnerComponent().getModel("BModel").read("/genPartialProd", {
                        filters: [
                            new Filter("REF_PRODID", FilterOperator.EQ, prodItem),
                            new Filter("LOCATION_ID", FilterOperator.EQ, locItem)
                        ],
                        success: function (oData) {
                            if (oData.results.length > 0) {
                                for (var i = 0; i < oData.results.length; i++) {
                                    if (prodItem !== oData.results[i].PRODUCT_ID) {
                                        that.partProdItems.push(oData.results[i])
                                    }
                                }
                                if (that.partProdItems.length > 0) {
                                    that.partModel.setData({ partDetails: that.partProdItems });
                                    sap.ui.getCore().byId("partProdSlct").setModel(that.partModel);
                                }
                                else {
                                    MessageToast.show("No Partial products available for selected Config Product/Location")
                                }
                            }
                            else {
                                MessageToast.show("No Partial products available for selected Config Product/Location")
                            }
                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get Partial Products");
                        }
                    });

                    var filteredProdData = that.loadArray.filter(a => a.PRODUCT_ID === prodItem);
                    // filteredProdData = that.removeDuplicate(filteredProdData, 'CHAR_VALUE');
                    that.charsProd = filteredProdData;
                    that.newClassModel.setData({ items1: filteredProdData });
                    tableData.setModel(that.newClassModel);
                    var filteredSelectedChars = that.totalChars.filter(a => a.PRODUCT_ID === prodItem && a.LOCATION_ID === locItem);
                    for (var k = 0; k < tableData.getItems().length; k++) {
                        for (var s = 0; s < filteredSelectedChars.length; s++) {
                            if (filteredSelectedChars[s].CHAR_NUM === tableData.getItems()[k].getCells()[0].getText()
                                && filteredSelectedChars[s].CHAR_VALUE === tableData.getItems()[k].getCells()[1].getTitle()
                                && filteredSelectedChars[s].CHARVAL_DESC === tableData.getItems()[k].getCells()[1].getText()
                                && filteredSelectedChars[s].LOCATION_ID === locItem
                                && filteredSelectedChars[s].PRODUCT_ID === prodItem) {
                                tableData.getItems()[k].setSelected(true);
                                that.selectedChars.push(filteredSelectedChars[s]);
                                that.initialSelectedChars.push(filteredSelectedChars[s]);
                            }
                        }
                    }
                    tableData.setVisible(true);
                    that.byId("idHBox").setVisible(true);
                    that.byId("_IDGenToolbar1").setVisible(true);

                    this.getOwnerComponent().getModel("BModel").read("/getProdClsChar", {
                        filters: [
                            new Filter("PRODUCT_ID", FilterOperator.EQ, prodItem)
                        ],
                        success: function (oData) {
                            // that.loadArray = oData.results;
                            that.loadArray1 = that.removeDuplicates(oData.results, "CHAR_NAME");
                            that.oNewModel.setData({ setCharacteristics: that.loadArray1 });
                            sap.ui.getCore().byId("idCharSelect").setModel(that.oNewModel);
                            sap.ui.core.BusyIndicator.hide()
                        },
                        error: function () {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("Failed to get Characteristics");
                        }
                    });
                    that.byId("idCharSearch").setVisible(true);
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
                that.byId("idpartInput").removeAllTokens();
                sap.ui.core.BusyIndicator.show();
                var oProdFilters = [];
                that.newpartprodChars = [];
                var selectedPartial = oEvent.getParameters().selectedItems;
                var locationId = that.byId("idloc").getValue();
                var tableItemsFull = that.byId("idCharTable").getItems();
                if (selectedPartial.length > 0) {
                    for (var i = 0; i < selectedPartial.length; i++) {
                        var oManLocTemplate = new sap.m.Token({
                            key: selectedPartial[i].getDescription(),
                            text: selectedPartial[i].getTitle(),
                            editable: false
                        });
                        that.byId("idpartInput").addToken(oManLocTemplate);
                        oProdFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, selectedPartial[i].getTitle()));
                    }
                    oProdFilters.push(new Filter("LOCATION_ID", FilterOperator.EQ, locationId));
                    this.getOwnerComponent().getModel("BModel").read("/getPartialChar", {
                        filters: [oProdFilters],
                        success: function (oData) {
                            if (oData.results.length > 0) {
                                var partProdDetails = oData.results;
                                sap.ui.getCore().byId("partProdSlct").getBinding("items").filter([]);
                                for (var k = 0; k < tableItemsFull.length; k++) {
                                    for (var s = 0; s < partProdDetails.length; s++) {
                                        if (partProdDetails[s].CHAR_NUM === tableItemsFull[k].getCells()[0].getText()
                                            && partProdDetails[s].CHAR_VALUE === tableItemsFull[k].getCells()[1].getTitle()
                                            && partProdDetails[s].CHARVAL_DESC === tableItemsFull[k].getCells()[1].getText()
                                        ) {
                                            tableItemsFull[k].setSelected(true);
                                            that.newpartprodChars.push(partProdDetails[s]);
                                        }
                                    }
                                }
                                that.newpartprodChars = that.removeCharDuplicate(that.newpartprodChars, ['CHAR_NUM', 'CHAR_VALUE', 'CHARVALUE_DESC']);
                                that.selectedChars = that.selectedChars.concat(that.newpartprodChars);
                                that.selectedChars = that.removeCharDuplicate(that.selectedChars, ['CHAR_NUM', 'CHAR_VALUE', 'CHARVALUE_DESC']);
                                sap.ui.core.BusyIndicator.hide()
                            }
                            else {
                                sap.ui.core.BusyIndicator.hide()
                                MessageToast.show("No data available for selected partial product");
                            }
                        },
                        error: function (oData, error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });
                } else {
                    that.byId("idpartInput").removeAllTokens();
                    that.byId("idCharTable").removeSelections();
                    for (var k = 0; k < tableItemsFull.length; k++) {
                        for (var s = 0; s < that.initialSelectedChars.length; s++) {
                            if (that.initialSelectedChars[s].CHAR_NUM === tableItemsFull[k].getCells()[0].getText()
                                && that.initialSelectedChars[s].CHAR_VALUE === tableItemsFull[k].getCells()[1].getTitle()
                                && that.initialSelectedChars[s].CHARVAL_DESC === tableItemsFull[k].getCells()[1].getText()
                            ) {
                                tableItemsFull[k].setSelected(true);
                            }
                        }
                    }
                    sap.ui.core.BusyIndicator.hide()
                    MessageToast.show("Please select product");
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
                // that.byId("idDownLd").setVisible(true);
                // that.byId("FileUploader").setVisible(true);
                that.byId("idIconTabBar").setVisible(false);
                that.byId("LogList").setVisible(false)
                that.byId("idHBox100").setVisible(true);

                that.sumArray = [];
                that.uniqueName = [];
                that.byId("idCharName").removeAllTokens();
                var selectedItem = oEvent.getParameters().selectedItems;
                that.charNum = that.byId("idCharName");
                selectedItem.forEach(function (oItem) {
                    that.charNum.addToken(
                        new sap.m.Token({
                            key: oItem.getTitle(),
                            text: oItem.getTitle(),
                            editable: false
                        })
                    );
                });
                that.byId("idHBox1").setVisible(true);
                for (var i = 0; i < selectedItem.length; i++) {
                    that.uniqueName.push({
                        PRODUCT_ID: that.byId("prodInput").getValue(),
                        CHAR_NAME: selectedItem[i].getTitle(),
                        child: that.removeDuplicates(that.loadArray.filter(a => a.CHAR_NUM === selectedItem[i].getBindingContext().getObject().CHAR_NUM), 'CHAR_VALUE')
                    });
                    that.uniqueName[i].child.push({
                        CHAR_VALUE: "Total Percentage",
                        FLAG: false,
                        CHARVAL_DESC: "(Sum value to be equal to 100)"
                    });
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
                    if (childItems[childItems.length - 1].getCells()[1].getValue() !== "100") {
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
                } else {
                    tableItems[tableItems.length - 1].getCells()[1].setValueState("Error");
                    tableItems[tableItems.length - 1].getCells()[1].setValueStateText("Sum not equal to 100")
                }
                var boxModel = that.byId("idVBox").getItems();
                for (var s = 0; s < boxModel.length; s++) {
                    var childItems = boxModel[s].getContent()[0].getItems();
                    if (childItems[childItems.length - 1].getCells()[1].getValue() !== "100") {
                        count++;
                        break;
                    }
                }
                if (count === 0) {
                    that.byId("idSaveBtn").setEnabled(true);
                }
                else {
                    that.byId("idSaveBtn").setEnabled(false);
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
                var selectedCustomer = oEvent.getParameters().selectedItem.getTitle();
                that.byId("idCustGrp").setValue(selectedCustomer);
                sap.ui.getCore().byId("custGrpList").getBinding("items").filter([]);
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
                var sId = oEvent.getSource().getParent().mAssociations.initialFocus.split("-")[0];
                if (sId.includes("Uniq")) {
                    sap.ui.getCore().byId("UniqSearch").setValue("");
                    if (sap.ui.getCore().byId("UniqSlctList").getBinding("items")) {
                        sap.ui.getCore().byId("UniqSlctList").getBinding("items").filter([]);
                    }
                    sap.ui.getCore().byId("UniqSlctList").removeSelections()
                    that._valueHelpDialogUniqueId.close();
                }
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
                var objectData = {}, objectArray = [];
                if (oEvent.getSource().sId.includes("BulKSave")) {
                    var aTreeBoxItems = that.byId("LogList").getModel().getData().res
                    for (let i = 0; i < aTreeBoxItems.length; i++) {
                        var aChild = aTreeBoxItems[i].children
                        for (let j = 0; j < aChild.length; j++) {
                            objectData = {
                                PRODUCT_ID: that.byId("prodInput").getValue(),
                                CHAR_NUM: aChild[j].CHAR_NUM,
                                CHARVAL_NUM: aChild[j].CHARVAL_NUM,
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
                                CHARVAL_NUM: childItems[k].getBindingContext().getObject().CHARVAL_NUM,
                                OPT_PERCENT: opt_percent
                            }
                            objectArray.push(objectData);
                            objectData = {}
                        }
                    }
                }
                this.getOwnerComponent().getModel("BModel").callFunction("/postCharOptionPercent", {
                    method: "GET",
                    urlParameters: {
                        CHAROPTPERCENT: JSON.stringify(objectArray)
                    },
                    success: function (oData) {
                        // that.byId("charList").removeSelections();
                        sap.m.MessageToast.show("Created Successfully");
                        that.byId("idGenSeedOrder").setEnabled(true);
                        sap.ui.core.BusyIndicator.hide()
                        // that.onCharCanel();
                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("error");
                    },
                });
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
                        // var opt_percent = "0";
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
                // that.byId("idHBox100").setVisible(false);
                // that.onAfterRendering();
            },
            /**
            * On press of cancel in Step 1 on wizard 
            * */
            onListCancel: function () {
                that.byId("idpartInput").removeAllTokens();
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
                        charItems.CHARVAL_NUM = that.selectedChars[i].CHARVAL_NUM;
                        charArray.push(charItems);
                        charItems = {};
                    }
                    var flag = "X";
                    var stringData = JSON.stringify(charArray);

                    this.getOwnerComponent().getModel("BModel").callFunction("/getLOCPRODCHAR", {
                        method: "GET",
                        urlParameters: {
                            FLAG: flag,
                            LOCPRODCHAR: stringData
                        },
                        success: function (oData) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show(oData.getLOCPRODCHAR);
                            that.selectedChars = [];
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageToast.show("error");
                        },
                    });

                }
                else {
                    sap.ui.core.BusyIndicator.hide()
                    MessageToast.show("No characteristics selected. Please select atleast one characteristic");
                }
            },
            /**
             * 
             * @param {On selection/deselection of characteristics in Partial Prod Step 1} oEvent 
             */
            onTableItemsSelect: function (oEvent) {
                that.oGModel.setProperty("/selectedChars", "X")
                var oEntry = {};
                that.allCharacterstics1 = that.charsProd
                sap.ui.core.BusyIndicator.show();
                if (oEvent.getParameter("selectAll")) {

                    that.selectedChars = [];
                    for (var i = 0; i < that.allCharacterstics1.length; i++) {
                        oEntry = {
                            LOCATION_ID: that.byId("idloc").getValue(),
                            PRODUCT_ID: that.byId("prodInput").getValue(),
                            CHAR_NUM: that.allCharacterstics1[i].CHAR_NUM,
                            CHAR_DESC: that.allCharacterstics1[i].CHAR_DESC,
                            CHARVAL_DESC: that.allCharacterstics1[i].CHARVAL_DESC,
                            CHAR_VALUE: that.allCharacterstics1[i].CHAR_VALUE,
                            CHARVAL_NUM: that.allCharacterstics1[i].CHARVAL_NUM
                        }
                        that.selectedChars.push(oEntry);
                    }
                    sap.ui.core.BusyIndicator.hide();
                }
                else {
                    var selected = oEvent.getParameters().selected;
                    if (selected) {
                        oEntry = {
                            LOCATION_ID: that.byId("idloc").getValue(),
                            PRODUCT_ID: that.byId("prodInput").getValue(),
                            CHAR_NUM: oEvent.getParameters().listItem.getCells()[0].getText(),
                            CHAR_DESC: oEvent.getParameters().listItem.getCells()[0].getTitle(),
                            CHARVAL_DESC: oEvent.getParameters().listItem.getCells()[1].getText(),
                            CHAR_VALUE: oEvent.getParameters().listItem.getCells()[1].getTitle(),
                            CHARVAL_NUM: oEvent.getParameters().listItem.getCells()[2].getText()
                        }
                        that.selectedChars.push(oEntry);
                        sap.ui.core.BusyIndicator.hide();
                    }
                    else {
                        var unSelectAll = oEvent.getParameters().listItems;
                        if (unSelectAll.length === that.allCharacterstics1.length) {
                            that.selectedChars = [];
                        }
                        else {
                            var selectedId = oEvent.getParameters().listItem.getCells()[1].getTitle();
                            var selectedCharDesc = oEvent.getParameters().listItem.getCells()[1].getText();
                            that.selectedChars = removeElementById(that.selectedChars, selectedId, selectedCharDesc);
                            function removeElementById(array, idToRemove, charToRemove) {
                                return array.filter(function (obj) {
                                    return obj.CHAR_VALUE !== idToRemove
                                        || obj.CHARVAL_DESC !== charToRemove;
                                });
                            }
                        }
                        sap.ui.core.BusyIndicator.hide();
                    }
                }
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
                                new Filter("CHAR_DESC", FilterOperator.Contains, sQuery)
                            ],
                            and: false,
                        })
                    );
                }
                that.byId("idCharTable").getBinding("items").filter(oFilters);
            },
            generateSeedOrder: function () {
                sap.ui.core.BusyIndicator.show()
                var productConfig = that.byId("prodInput").getValue();
                var demandLocation = that.byId("idloc").getValue();
                var customerGroup = that.byId("idCustGrp").getValue();
                var fromDate = that.byId("idDateRange").getFrom();
                var toDate = that.byId("idDateRange").getTo();
                fromDate = fromDate.toLocaleDateString();
                fromDate = that.convertDateFormat(fromDate);
                toDate = toDate.toLocaleDateString();
                toDate = that.convertDateFormat(toDate);
                // Define the URL and request body
                const data = {
                    LOCATION_ID: demandLocation,
                    PRODUCT_ID: productConfig,
                    CUSTOMER_GROUP: customerGroup,
                    FROMDATE: fromDate,
                    TODATE: toDate
                };
                var aScheduleSEDT = {};
                // Get Job Schedule Start/End Date/Time
                aScheduleSEDT = that.getScheduleSEDT();
                var dCurrDateTime = new Date().getTime();
                var actionText = "/v2/catalog/generateSeedOrders";
                var JobName = "Seed Order Generation" + dCurrDateTime;
                sap.ui.core.BusyIndicator.show();
                var finalList = {
                    name: JobName,
                    description: "Seed Order Generation",
                    action: encodeURIComponent(actionText),
                    active: true,
                    httpMethod: "POST",
                    startTime: aScheduleSEDT.djSdate,
                    endTime: aScheduleSEDT.djEdate,
                    createdAt: aScheduleSEDT.djSdate,
                    schedules: [{
                        data: data,
                        cron: "",
                        time: aScheduleSEDT.oneTime,
                        active: true,
                        startTime: aScheduleSEDT.dsSDate,
                        endTime: aScheduleSEDT.dsEDate,
                    }]
                };
                this.getOwnerComponent().getModel("JModel").callFunction("/addMLJob", {
                    method: "GET",
                    urlParameters: {
                        jobDetails: JSON.stringify(finalList),
                    },
                    success: function (oData) {
                        that.byId("idGenSeedOrder").setEnabled(false);
                        that.onResetDate();
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(oData.addMLJob + ": Job Created");

                    },
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Service Connectivity Issue!");
                    },
                });
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
            getVariantsData: function () {
                var aData = [];
                var dData = [];
                var details = {};
                var defaultDetails = [];
                var uniqueName = [];
                that.variantLength = 0;
                var variantUser = this.getUser();
                that.oGModel.setProperty("/UserId", variantUser);
                //Calling variant header data
                this.getOwnerComponent().getModel("BModel").read("/getVariantHeader", {
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            that.variantLength = oData.results.length - 1;
                            for (var i = 0; i < oData.results.length; i++) {
                                if (oData.results[i].DEFAULT === "Y"
                                    && oData.results[i].APPLICATION_NAME === "Seed Order Creation") {
                                    dData.push(oData.results[i]);
                                }
                            }
                            if (dData.length > 0) {
                                that.oGModel.setProperty("/defaultVariant", dData);
                            }
                            else {
                                that.oGModel.setProperty("/defaultVariant", "");
                            }
                        }
                    },
                    error: function (oData, error) {
                        MessageToast.show("error while loading variant details");
                    },
                });

                //calling variant main data
                this.getOwnerComponent().getModel("BModel").read("/getVariant", {
                    filters: [new Filter("USER", FilterOperator.EQ, variantUser)],
                    success: function (oData) {
                        var IDlength = oData.results.length;
                        if (IDlength === 0) {
                            that.oGModel.setProperty("/Id", that.variantLength);
                            that.oGModel.setProperty("/variantDetails", "");
                            that.oGModel.setProperty("/fromFunction", "X");
                            uniqueName.unshift({
                                "VARIANTNAME": "Standard",
                                "VARIANTID": "0",
                                "DEFAULT": "Y"
                            })
                            that.oGModel.setProperty("/viewNames", uniqueName);
                            that.oGModel.setProperty("/defaultDetails", "");
                            that.viewDetails.setData({
                                items1: uniqueName
                            });
                            that.varianNames = uniqueName;
                            sap.ui.getCore().byId("idMatList").setModel(that.viewDetails);
                            sap.ui.getCore().byId("idMatList").removeSelections(true);
                            sap.ui.getCore().byId("varNameList").setModel(that.viewDetails);

                            Default = "Standard";
                            if (that.oGModel.getProperty("/newVaraintFlag") === "X") {
                                var newVariant = that.oGModel.getProperty("/newVariant");
                                that.handleSelectPress(newVariant[0].VARIANTNAME);
                                that.oGModel.setProperty("/newVaraintFlag", "");
                            }
                            else {
                                that.handleSelectPress(Default);
                            }
                        }
                        else {
                            that.oGModel.setProperty("/Id", that.variantLength);
                            that.oGModel.setProperty("/variantDetails", oData.results);
                            var filteredData = oData.results.filter(a => a.APPLICATION_NAME === "Seed Order Creation");
                            aData = filteredData;
                            if (aData.length > 0) {
                                uniqueName = aData.filter((obj, pos, arr) => {
                                    return (
                                        arr.map((mapObj) => mapObj.VARIANTNAME).indexOf(obj.VARIANTNAME) == pos
                                    );
                                });
                                that.oGModel.setProperty("/saveBtn", "");
                                for (var k = 0; k < uniqueName.length; k++) {
                                    if (uniqueName[k].DEFAULT === "Y") {
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
                        }

                    },
                    error: function (oData, error) {
                        MessageToast.show("error while loading variant details");
                    },
                });
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
                var sFileName = "Seed Order Creation - " + new Date().getTime();
                if (that.byId("idCharName").getTokens().length <= 0) {
                    var oTableBind = []
                    for (var i = 0; i < that.loadArray1.length; i++) {
                        oTableBind.push({
                            PRODUCT_ID: that.byId("prodInput").getValue(),
                            CHAR_NAME: that.loadArray1[i].CHAR_NAME,
                            child: that.removeDuplicates(that.loadArray.filter(a => a.CHAR_NUM === that.loadArray1[i].CHAR_NUM), 'CHAR_VALUE')
                        });
                        oTableBind[i].child.push({
                            CHAR_VALUE: "Total Percentage",
                            CHARVAL_DESC: "(Sum value to be equal to 100)"
                        });

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
                                    aDown.push({
                                        Characteristic_Name: oTableBind[i].CHAR_NAME,
                                        Characteristic_Value: oTableBind[i].child[j].CHAR_VALUE,
                                        Characteristic_Value_Desc: oTableBind[i].child[j].CHARVAL_DESC,
                                        Option_Percentage: parseInt(0)
                                    })
                                }
                            }
                        }
                    }
                }
                var aCols = []
                for (var j = 0; j < Object.keys(aDown[0]).length; j++) {
                    aCols.push({
                        property: Object.keys(aDown[0])[j]
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
            onUpload: function () {
                // that.byId("idIconTabBar").setVisible(true)
                var fileupload = that.getView().byId("FileUploader");
                var file = fileupload.oFileUpload.files[0];
                var oExcelData = {}
                that.filename = file.name;
                that.filetype = file.type;
                var reader = new FileReader();
                reader.onload = function (event) {
                    var data = event.target.result;
                    var workbook = XLSX.read(data, {
                        type: "binary"
                    });
                    workbook.SheetNames.forEach(function (sheetName) {

                        oExcelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var oData = oExcelData;
                        that.Emport(oExcelData);
                    });

                };
                reader.readAsBinaryString(file);
            },
            Emport: function (array) {
                that.byId("idVBox").setVisible(false)
                var oModel = that.getOwnerComponent().getModel("oGModel");
                oModel.setProperty("/", array)
                var otreemodel = that.getOwnerComponent().getModel("oGModel");
                // debugger;
                // var aValidArray= []
                for (let i = 0; i < that.loadArray.length; i++) {
                    for (let k = 0; k < array.length; k++) {
                        if (that.loadArray[i].CHAR_NAME == array[k].Characteristic_Name && that.loadArray[i].CHAR_VALUE == array[k].Characteristic_Value && that.loadArray[i].CHARVAL_DESC == array[k].Characteristic_Value_Desc) {
                            array[k].CHARVAL_NUM = that.loadArray[i].CHARVAL_NUM
                            array[k].CHAR_NUM = that.loadArray[i].CHAR_NUM
                        }
                    }
                }
                console.log(array)
                var SubResults = array;
                var Array1 = [];
                var dArray = [];
                // var Total = 100;
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
                                CHARVAL_NUM: SubResults[i].CHARVAL_NUM,
                                CHAR_NUM: SubResults[i].CHAR_NUM,
                                OPT_PERCENT: parseInt(SubResults[i].Option_Percentage),
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
                            CHARVAL_NUM: SubResults[i].CHARVAL_NUM,
                            CHAR_NUM: SubResults[i].CHAR_NUM,
                            OPT_PERCENT: parseInt(SubResults[i].Option_Percentage),
                            child: true,
                            parent: false,
                        }
                        Array1[index].children.push(oChd)
                    }
                }
                that.aSucces = [];
                that.aErrorLog = [];
                for (let i = 0; i < Array1.length; i++) {
                    if (Array1[i].children) {
                        var iTotal = 0;
                        for (let j = 0; j < Array1[i].children.length; j++) {
                            if (Array1[i].children[j]) {
                                iTotal += Array1[i].children[j].OPT_PERCENT
                            }
                        }
                        if (iTotal == parseInt(100)) {
                            Array1[i].TotalPercentage = 100;
                            that.aSucces.push(Array1[i])
                        } else {
                            Array1[i].TotalPercentage = parseInt(iTotal)
                            that.aErrorLog.push(Array1[i])
                        }
                    }
                }
                if(that.byId("idCharName").getTokens().length > 0){
                let iMatch = 0;
                if (that.uniqueName.length == Array1.length) {
                    let op = that.uniqueName.map((e, i) => {
                        let temp = Array1.find(element => element.CHAR_NAME === e.CHAR_NAME)
                        if (temp == undefined) {
                            that.byId("idIconTabBar").setVisible(false)
                            MessageToast.show("Please Upload as per Characteristic Name Selections")
                            return false
                        }
                        else {
                            e.CHAR_NAME = temp.CHAR_NAME;
                            iMatch++
                        }
                        return e;
                    })
                    if (iMatch == Array1.length) {
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
                        that.byId("idHBox1").setVisible(false)
                        that.byId("idHBox2").setVisible(true)

                    } else {
                        that.byId("idIconTabBar").setVisible(false)
                        MessageToast.show("Please Upload as per Characteristic Name Selections")
                        return false
                    }

                } else {
                    that.byId("idIconTabBar").setVisible(false)
                    MessageToast.show("Please Upload as per Characteristic Name Selections")
                    return false
                }
            }else{
                    that.byId("LogList").setVisible(true)
                    that.byId("idIconTabBar").setVisible(true)
                    that.byId("idHBox2").setVisible(true)
                    that.byId("idIconTabBar").setSelectedKey("Success")
                    otreemodel.setData({
                        res: that.aSucces
                    });
                    that.byId("LogList").setModel(otreemodel).expandToLevel(1)
                    that.byId("BulKSave").setVisible(true);
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
                    that.byId("idHBox1").setVisible(false)
                    that.byId("idHBox2").setVisible(true)
                } else {
                    that.byId("LogList").setVisible(true)
                    that.byId("idIconTabBar").setVisible(true)
                    var otreemodel = that.getOwnerComponent().getModel("oGModel");
                    otreemodel.setData({
                        res: that.aErrorLog
                    });
                    that.byId("LogList").setModel(otreemodel).expandToLevel(1)
                    that.byId("BulKSave").setVisible(false);
                    that.byId("idHBox1").setVisible(false)
                    that.byId("idHBox2").setVisible(false)

                }
            }
        });
    });
