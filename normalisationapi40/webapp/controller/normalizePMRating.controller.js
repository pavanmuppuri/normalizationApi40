sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"normalizePMRatingFormAPI40/normalisationapi40/utils/CoreLoader"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,BusyIndicator,CoreLoader) {
        "use strict";

        return Controller.extend("normalizePMRatingFormAPI40.normalisationapi40.controller.normalizePMRating", {
            onInit: function () {
                // this._router.getRoute("RoutenormalizePMRating").attachPatternMatched(this._routePatternMatched, this);
    
                /*var oGlobalBusyDialogInit = new sap.m.BusyDialog();
                oGlobalBusyDialogInit.open();*/
    
                this.getView().byId("mainPage").setBusy(false);
            },
    
            totalCalCalls: function (totalCalRatUrl) {
                var url = "./normalizeService_API40";
                var oModel = new sap.ui.model.odata.ODataModel(url);
                var that = this;
    
            },
    
            routePatternMatched: function () {
    
            },
    
            openPMForm: function () {
    
                var getSelRow = this.getView().byId("employeeTable").getSelectedContexts();
    
                if (getSelRow.length > 0) {
    
                    var empArrayCount = this.selRowData.competencyRatingNav.results.length - 1;
                    // var getFormContentId = this.selRowData.competencyRatingNav.results[empArrayCount].formContentId;
                    var fragmentModel = new sap.ui.model.json.JSONModel();
                    var formContentId = this.selRowData.competencyRatingNav.results.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formContentId'];
                    //https://hcm40sales.sapsf.com/ 
                    var getFormContentId = "https://hcm40sales.sapsf.com/sf/openMyForm?fcid=" + formContentId;
                    fragmentModel.setProperty("/getFormContentId", getFormContentId);
                    this.getView().setModel(fragmentModel, "fragmentModel");
                    if (!this._oDialog) {
                        this._oDialog = sap.ui.xmlfragment("normalizePMRatingFormAPI40/normalisationapi40/view/PMForm", this);
                        this.getView().addDependent(this._oDialog);
                    }
                    this._oDialog.open();
    
                    var oFrame = sap.ui.getCore().byId("map_iframe");
                    var oFrameContent = oFrame.$()[0];
                    oFrameContent.setAttribute("src", getFormContentId);
                } else {
                    MessageBox.error("직원을 선택하십시오");
                }
    
                /*var getFormContentId = this.selRowData.competencyRatingNav.results[0].formContentId;
                
                                                        window.open("https://salesdemo.successfactors.eu/sf/openMyForm?fcid="+getFormContentId+"", '_blank').focus();*/
    
                // window.location.replace("https://salesdemo.successfactors.eu/sf/openMyForm?fcid="+getFormContentId+"",'_blank');
            },
    
            onCancelDialog: function () {
                this._oDialog.close();
            },
    
            showAll: function () {
                this.getView().byId("managerTable").removeSelections();
                var allResults = sap.ui.getCore().salesOneResults.concat(sap.ui.getCore().salesTwoResults).concat(sap.ui.getCore().financialResults)
                    .concat(sap.ui.getCore().hrResults);
                var employeesModel = new sap.ui.model.json.JSONModel(allResults);
                this.getView().setModel(employeesModel, "employeesModel");
            },
    
            selectEmployeeTable: function (oEvt) {
                var selRow = parseInt(oEvt.getParameter("listItem").getBindingContextPath().split("/")[1]);
                this.selRowData = oEvt.getSource().getModel("employeesModel").getData()[selRow];
                // this.clonedObj = Object.assign({}, this.selRowData);
            },
    
            hideBusyIndicator: function () {
                sap.ui.core.BusyIndicator.hide();
            },
    
            showBusyIndicator: function (iDuration, iDelay) {
                sap.ui.core.BusyIndicator.show(iDelay);
    
                if (iDuration && iDuration > 0) {
                    if (this._sTimeoutId) {
                        jQuery.sap.clearDelayedCall(this._sTimeoutId);
                        this._sTimeoutId = null;
                    }
    
                    this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
                        this.hideBusyIndicator();
                    });
                }
            },
            calculateAdjust: function () {
    
                var getSelRow = this.getView().byId("employeeTable").getSelectedContexts();
                if (getSelRow.length > 0) {
                    var getSelRowPath = parseInt(getSelRow[0].sPath.split("/")[1]);
                    var getSelEmpRowData = getSelRow[0].getModel().getData()[getSelRowPath];
                    if (this.getView().byId("managerTable").getSelectedContextPaths()[0] === undefined) {
                        var managerTableSelRow = null;
    
                        // var getTeamName = getSelEmpRowData.department.split(" ")[1];
                        var getTeamName = getSelEmpRowData.department.split(" ")[getSelEmpRowData.department.split(" ").length-1];
                    } else {
                        var managerTableSelRow = parseInt(this.getView().byId("managerTable").getSelectedContextPaths()[0].split("/")[2]);
                    }
    
                    var managerModelRatingData = this.getView().getModel("managerModel").getData();
    
                    if (managerTableSelRow === 0) {
                        getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                            (Math.round(sap.ui.getCore().salesOneResults[getSelRowPath].CalRatResult) -
                                managerModelRatingData.managers[0].teamMean) / managerModelRatingData.managers[0].teamSD));
                    } else if (managerTableSelRow === 1) {
                        getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                            (Math.round(sap.ui.getCore().salesTwoResults[getSelRowPath].CalRatResult) -
                                managerModelRatingData.managers[1].teamMean) / managerModelRatingData.managers[1].teamSD));
                    } else if (managerTableSelRow === 2) {
                        getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                            (Math.round(sap.ui.getCore().financialResults[getSelRowPath].CalRatResult) -
                                managerModelRatingData.managers[2].teamMean) / managerModelRatingData.managers[2].teamSD));
                    } else if (managerTableSelRow === 3) {
                        getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                            (Math.round(sap.ui.getCore().hrResults[getSelRowPath].CalRatResult) -
                                managerModelRatingData.managers[3].teamMean) / managerModelRatingData.managers[3].teamSD));
                    } else {
                        if (getTeamName == "(41030011)") {
                            getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(sap.ui.getCore().completeResults[getSelRowPath].CalRatResult) -
                                    managerModelRatingData.managers[0].teamMean) / managerModelRatingData.managers[0].teamSD));
                        } else if (getTeamName == "(41030012)") {
                            getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(sap.ui.getCore().completeResults[getSelRowPath].CalRatResult) -
                                    managerModelRatingData.managers[1].teamMean) / managerModelRatingData.managers[1].teamSD));
                        } else if (getTeamName == "(41030021)") {
                            getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(sap.ui.getCore().completeResults[getSelRowPath].CalRatResult) -
                                    managerModelRatingData.managers[2].teamMean) / managerModelRatingData.managers[2].teamSD));
                        } else if (getTeamName == "(41030022)") {
                            getSelEmpRowData.adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(sap.ui.getCore().completeResults[getSelRowPath].CalRatResult) -
                                    managerModelRatingData.managers[3].teamMean) / managerModelRatingData.managers[3].teamSD));
                        }
                    }
    
                    this.selRowData.adjustedRating = getSelEmpRowData.adjustedRating + ".0";
                    // this.showBusyIndicator(2000, 0);
                    var url = "./normalizeService_API40";
                    var oModel = new sap.ui.model.odata.ODataModel(url);
    
                    var postService = "/upsert?purgeType=record";
                    var compResLength = this.selRowData.competencyRatingNav.results.length - 1;
                    var formContentId = this.selRowData.competencyRatingNav.results.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formContentId'];
                    var formDataId = this.selRowData.competencyRatingNav.results.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formDataId'];
                    var payload = {
                        "__metadata": {
                            "uri": "https://api40sales.sapsf.com/odata/v2/FormSummarySection(formContentId=" + formContentId + ",formDataId=" +
                                formDataId + ")",
                            "type": "SFOData.FormSummarySection"
                        },
                        "formContentId": formContentId,
                        "formDataId": formDataId,
                        "overallFormRating": {
                            "__metadata": {
                                "uri": "https://api40sales.sapsf.com/odata/v2/FormUserRatingComment(formContentId=" + formContentId +
                                    ",formDataId=" + formDataId + ",itemId=0L,ratingType='',sectionIndex=3,userId='')",
                                "type": "SFOData.FormUserRatingComment"
                            },
                            "sectionIndex": 3,
                            "formContentId": formContentId,
                            "ratingType": "overall",
                            "formDataId": formDataId,
                            "userId": "",
                            "rating": this.selRowData.adjustedRating.toString(),
                            "comment": "null",
                            "ratingKey": "wf_sect_3_rating"
    
                        }
                    };
                    // var oGlobalBusyDialogInit = new sap.m.BusyDialog();
    
                    sap.ui.core.BusyIndicator.show(0);
                    var that = this;
    
                    oModel.create(postService, payload, {
                        success: function (oData, oResponse) {
                            sap.ui.core.BusyIndicator.hide();
    
                            if (oData.results[0].status === "OK") {
                                that.getView().getModel("employeesModel").refresh(true);
                                MessageBox.success(
                                    "평가점수가 전체 평균과 표준편차로 조정되었습니다.");
                            } else {
                                MessageBox.error("Error : " + oData.results[0].message);
                            }
                        },
                        error: function (e) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageBox.error("Error : " + e);
                        }
                    });
    
                } else {
                    var empModelData = this.getView().getModel("employeesModel").getData();
                    var empModelDataLength = empModelData.length;
                    var managerModelRatingData = this.getView().getModel("managerModel").getData();
    
                    var aPromises = [];
                    var url = "./normalizeService_API40";
                    var oModel = new sap.ui.model.odata.ODataModel(url);
                    // oModel.setUseBatch(true);
                    var batchChanges = [];
                    for (var i = 0; i < empModelDataLength; i++) {
                        var depLength = empModelData[i].department.split(" ").length;
    
                        if (empModelData[i].department.split(" ")[depLength-1] === "(41030011)") { // || empModelData[i].department === "영업1팀 (41030011)"
    
                            empModelData[i].adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(empModelData[i].CalRatResult) -
                                    managerModelRatingData.managers[0].teamMean) / managerModelRatingData.managers[0].teamSD)).toString() + ".0";
    
                        } else if (empModelData[i].department.split(" ")[depLength-1] === "(41030012)") { //  || empModelData[i].department === "인천원당지점 (41030012)"
    
                            empModelData[i].adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(empModelData[i].CalRatResult) -
                                    managerModelRatingData.managers[1].teamMean) / managerModelRatingData.managers[1].teamSD)).toString() + ".0";
    
                        } else if (empModelData[i].department.split(" ")[depLength-1] === "(41030021)") {
                            empModelData[i].adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(empModelData[i].CalRatResult) -
                                    managerModelRatingData.managers[2].teamMean) / managerModelRatingData.managers[2].teamSD)).toString() + ".0";
                        } else if (empModelData[i].department.split(" ")[depLength-1] === "(41030022)") {
    
                            empModelData[i].adjustedRating = Math.round(managerModelRatingData.totalMean + (managerModelRatingData.totalSD *
                                (Math.round(empModelData[i].CalRatResult) -
                                    managerModelRatingData.managers[3].teamMean) / managerModelRatingData.managers[3].teamSD)).toString() + ".0";
    
                        }
    
                        var postService = "/upsert?purgeType=record";
    
                        var compResLength = empModelData[i].competencyRatingNav.results.length - 1;
    
                        /*var formContentId = empModelData[i].competencyRatingNav.results[compResLength].formContentId;
                        var formDataId = empModelData[i].competencyRatingNav.results[compResLength].formDataId;*/
                        var formContentId = empModelData[i].competencyRatingNav.results.sort(
                            function (a, b) {
                                return parseInt(b['rating']) - parseInt(a['rating']);
                            }
                        )[0]['formContentId'];
                        var formDataId = empModelData[i].competencyRatingNav.results.sort(
                            function (a, b) {
                                return parseInt(b['rating']) - parseInt(a['rating']);
                            }
                        )[0]['formDataId'];
    
                        var payload = {
                            "__metadata": {
                                "uri": "https://api40sales.sapsf.com/odata/v2/FormSummarySection(formContentId=" + formContentId + ",formDataId=" +
                                    formDataId + ")",
                                "type": "SFOData.FormSummarySection"
                            },
                            "formContentId": formContentId,
                            "formDataId": formDataId,
                            "overallFormRating": {
                                "__metadata": {
                                    "uri": "https://api40sales.sapsf.com/odata/v2/FormUserRatingComment(formContentId=" + formContentId +
                                        ",formDataId=" + formDataId + ",itemId=0L,ratingType='',sectionIndex=3,userId='')",
                                    "type": "SFOData.FormUserRatingComment"
                                },
                                "sectionIndex": 3,
                                "formContentId": formContentId,
                                "ratingType": "overall",
                                "formDataId": formDataId,
                                "userId": "",
                                "rating": empModelData[i].adjustedRating,
                                "comment": "null",
                                "ratingKey": "wf_sect_3_rating"
    
                            }
                        };
    
                        batchChanges.push(oModel.createBatchOperation("/upsert?purgeType=record", "POST", payload));
    
                    }
    
                    oModel.addBatchChangeOperations(batchChanges);
                    var that = this;
                    sap.ui.core.BusyIndicator.show(0);
                    oModel.submitBatch(function (data) {
                        oModel.refresh();
    
                        if (data.__batchResponses[0].__changeResponses) {
                            that.getView().getModel("employeesModel").refresh(true);
                            MessageBox.success(
                                "평가점수가 전체 평균과 표준편차로 조정되었습니다.");
                            sap.ui.core.BusyIndicator.hide();
                            /*if (data.__batchResponses[0].__changeResponses[0].statusText === "OK") {
                                    that.getView().getModel("employeesModel").refresh(true);
                                } else {
                                    MessageBox.error("Error : " + oData.results[0].message);
                                }*/
                        } else {
                            MessageBox.error("Error");
                            sap.ui.core.BusyIndicator.hide();
                        }
    
                    }, function (err) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Error : " + err);
                    });
    
                }
            },
    
            calculateRestore: function () {
                var getSelRow = this.getView().byId("employeeTable").getSelectedContexts();
                if (getSelRow.length > 0) {
                    var getSelRowPath = parseInt(getSelRow[0].sPath.split("/")[1]);
                    var getSelEmpRowData = getSelRow[0].getModel().getData()[getSelRowPath];
                    if (this.getView().byId("managerTable").getSelectedContextPaths()[0] === undefined) {
                        var managerTableSelRow = null;
                    } else {
                        var managerTableSelRow = parseInt(this.getView().byId("managerTable").getSelectedContextPaths()[0].split("/")[2]);
                    }
                    
                    getSelEmpRowData.adjustedRating = getSelEmpRowData.CalRatResult;
    
                    /*if (managerTableSelRow === 0) {
                        getSelEmpRowData.adjustedRating = sap.ui.getCore().clonedSalesOneResults[getSelRowPath].CalRatResult;
                    } else if (managerTableSelRow === 1) {
                        getSelEmpRowData.adjustedRating = sap.ui.getCore().clonedSalesTwoResults[getSelRowPath].CalRatResult;
                    } else if (managerTableSelRow === 2) {
                        getSelEmpRowData.adjustedRating = sap.ui.getCore().clonedFinancialResults[getSelRowPath].CalRatResult;
                    } else if (managerTableSelRow === 3) {
                        getSelEmpRowData.adjustedRating = sap.ui.getCore().clonedHrResults[getSelRowPath].CalRatResult;
                    } else {
                        getSelEmpRowData.adjustedRating = sap.ui.getCore().clonedCompleteResults[getSelRowPath].CalRatResult;
                    }*/
    
                    var url = "./normalizeService_API40";
                    var oModel = new sap.ui.model.odata.ODataModel(url);
    
                    var postService = "/upsert?purgeType=record";
    
                    var compResLength = this.selRowData.competencyRatingNav.results.length - 1;
                    /*var formContentId = this.selRowData.competencyRatingNav.results[compResLength].formContentId;
                    var formDataId = this.selRowData.competencyRatingNav.results[compResLength].formDataId;*/
                    var formContentId = this.selRowData.competencyRatingNav.results.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formContentId'];
                    var formDataId = this.selRowData.competencyRatingNav.results.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formDataId'];
                    var payload = {
                        "__metadata": {
                            "uri": "https://api40sales.sapsf.com/odata/v2/FormSummarySection(formContentId=" + formContentId + ",formDataId=" +
                                formDataId + ")",
                            "type": "SFOData.FormSummarySection"
                        },
                        "formContentId": formContentId,
                        "formDataId": formDataId,
                        "overallFormRating": {
                            "__metadata": {
                                "uri": "https://api40sales.sapsf.com/odata/v2/FormUserRatingComment(formContentId=" + formContentId +
                                    ",formDataId=" + formDataId + ",itemId=0L,ratingType='',sectionIndex=3,userId='')",
                                "type": "SFOData.FormUserRatingComment"
                            },
                            "sectionIndex": 3,
                            "formContentId": formContentId,
                            "ratingType": "overall",
                            "formDataId": formDataId,
                            "userId": "",
                            "rating": this.selRowData.adjustedRating.toString(),
                            "comment": "null",
                            "ratingKey": "wf_sect_3_rating"
    
                        }
                    };
                    sap.ui.core.BusyIndicator.show(0);
                    var that = this;
                    oModel.create(postService, payload, {
                        success: function (oData, oResponse) {
                            sap.ui.core.BusyIndicator.hide();
                            if (oData.results[0].status === "OK") {
                                that.getView().getModel("employeesModel").refresh(true);
                                MessageBox.success("평가점수가 전체 평균과 표준편차로 조정되었습니다.");
                            } else {
                                MessageBox.error("Error : " + oData.results[0].message);
                            }
                        },
                        error: function (e) {
                            sap.ui.core.BusyIndicator.hide();
                            MessageBox.error("Error : " + e);
                        }
                    });
    
                    this.selRowData.adjustedRating = getSelEmpRowData.adjustedRating;
                    this.getView().getModel("employeesModel").refresh(true);
                    // MessageBox.success("평가점수가 기존 점수로 복구되었습니다.");
    
                } else {
    
                    var empModelData = this.getView().getModel("employeesModel").getData();
                    var empModelDataLength = empModelData.length;
                    var managerModelRatingData = this.getView().getModel("managerModel").getData();
    
                    var url = "./normalizeService_API40";
                    var oModel = new sap.ui.model.odata.ODataModel(url);
                    var batchChanges = [];
                    for (var i = 0; i < empModelDataLength; i++) {
    
                        // empModelData[i].adjustedRating = sap.ui.getCore().clonedCompleteResults[i].CalRatResult;
                        empModelData[i].adjustedRating = empModelData[i].CalRatResult;
        
                        var postService = "/upsert?purgeType=record";
    
                        var compResLength = empModelData[i].competencyRatingNav.results.length - 1;
                        /*var formContentId = empModelData[i].competencyRatingNav.results[compResLength].formContentId;
                        var formDataId = empModelData[i].competencyRatingNav.results[compResLength].formDataId;*/
                        var formContentId = empModelData[i].competencyRatingNav.results.sort(
                            function (a, b) {
                                return parseInt(b['rating']) - parseInt(a['rating']);
                            }
                        )[0]['formContentId'];
                        var formDataId = empModelData[i].competencyRatingNav.results.sort(
                            function (a, b) {
                                return parseInt(b['rating']) - parseInt(a['rating']);
                            }
                        )[0]['formDataId'];
                        var payload = {
                            "__metadata": {
                                "uri": "https://api40sales.sapsf.com/odata/v2/FormSummarySection(formContentId=" + formContentId + ",formDataId=" +
                                    formDataId + ")",
                                "type": "SFOData.FormSummarySection"
                            },
                            "formContentId": formContentId,
                            "formDataId": formDataId,
                            "overallFormRating": {
                                "__metadata": {
                                    "uri": "https://api40sales.sapsf.com/odata/v2/FormUserRatingComment(formContentId=" + formContentId +
                                        ",formDataId=" + formDataId + ",itemId=0L,ratingType='',sectionIndex=3,userId='')",
                                    "type": "SFOData.FormUserRatingComment"
                                },
                                "sectionIndex": 3,
                                "formContentId": formContentId,
                                "ratingType": "overall",
                                "formDataId": formDataId,
                                "userId": "",
                                "rating": empModelData[i].CalRatResult.toString(),
                                "comment": "null",
                                "ratingKey": "wf_sect_3_rating"
    
                            }
                        };
    
                        batchChanges.push(oModel.createBatchOperation("/upsert?purgeType=record", "POST", payload));
    
                    }
    
                    oModel.addBatchChangeOperations(batchChanges);
                    var that = this;
                    sap.ui.core.BusyIndicator.show(0);
                    oModel.submitBatch(function (data) {
                        oModel.refresh();
    
                        if (data.__batchResponses[0].__changeResponses) {
                            that.getView().getModel("employeesModel").refresh(true);
                            MessageBox.success("평가점수가 기존 점수로 복구되었습니다.");
                            sap.ui.core.BusyIndicator.hide();
                        } else {
                            MessageBox.error("Error");
                            sap.ui.core.BusyIndicator.hide();
                        }
    
                    }, function (err) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Error : " + err);
                    });
                    // this.getView().getModel("employeesModel").refresh(true);
    
                }
            },
    
            selectNormalizeTable: function (oEvt) {
    
                /*var normalSelRow = parseInt(oEvt.getParameter("listItem").getBindingContextPath().split("/")[2]);
                this.normalSelRowData = oEvt.getSource().getModel("managerModel").getData().managers[normalSelRow];*/
    
                var userId = oEvt.getParameter("listItem").getCells()[1].getProperty("text").split(" ")[0];
                // var userId = oEvt.getSource().getCells()[1].getProperty("text").split(" ")[0];
    
                if (userId === "41000011") {
                    var employeesModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().salesOneResults.sort(function (a, b) {
                        return a.userId - b.userId;
                    }));
                    this.getView().setModel(employeesModel, "employeesModel");
                } else if (userId === "41000012") {
                    var employeesModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().salesTwoResults.sort(function (a, b) {
                        return a.userId - b.userId;
                    }));
                    this.getView().setModel(employeesModel, "employeesModel");
                } else if (userId === "41000021") {
                    var employeesModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().financialResults.sort(function (a, b) {
                        return a.userId - b.userId;
                    }));
                    this.getView().setModel(employeesModel, "employeesModel");
                } else if (userId === "41000022") {
                    var employeesModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().hrResults.sort(function (a, b) {
                        return a.userId - b.userId;
                    }));
                    this.getView().setModel(employeesModel, "employeesModel");
                }
    
                var goalRatingUrl = "/FormTemplate(1107L)/associatedForms?$select=formDataId,formSubjectId,rating,formTitle";
    
            }
    
        });
    });
