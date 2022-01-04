sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "normalizePMRatingFormAPI40/normalisationapi40/model/models",
    "sap/m/MessageBox"
],
    function (UIComponent, Device, models,MessageBox) {
        "use strict";

        return UIComponent.extend("normalizePMRatingFormAPI40.normalisationapi40.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            getMean: function (data) {
                return data.reduce(function (a, b) {
                    return Number(a) + Number(b);
                }) / data.length;
            },

            checkTeamSD: function (data) {
                var m = this.getMean(data);
                return Math.sqrt(data.reduce(function (sq, n) {
                    return sq + Math.pow(n - m, 2);
                }, 0) / (data.length - 1));
            },

            findRating: function (arr) {
                return arr.sort(
                    function (a, b) {
                        return parseInt(b['rating']) - parseInt(a['rating']);
                    }
                )[0]['rating'];
            },
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                var url = "./normalizeService_API40";
                var oModel = new sap.ui.model.odata.ODataModel(url);

                var salesOneData =
                    "User('41000010')/directReports?$select=department,division,jobCode,userId,firstName,lastName,competencyRatingNav/rating,competencyRatingNav/formContentId,competencyRatingNav/formDataId&$expand=competencyRatingNav";

                var that = this;
                oModel.read(salesOneData, {
                    async: false,
                    success: function (oData, oResponse) {

                        var resultsSet = [];

                        for (var i = 0; i < oData.results.length; i++) {
                            if ((oData.results[i].competencyRatingNav) && (oData.results[i].division === "직접 판매 (DIR_SALES)")) {
                                resultsSet.push(oData.results[i]);
                            }
                        }

                        sap.ui.getCore().salesOneResults = resultsSet;

                        var cloneSalesOne = resultsSet;
                        sap.ui.getCore().clonedSalesOneResults = JSON.parse(JSON.stringify(cloneSalesOne));
                        sap.ui.getCore().clonedSalesOneResults = sap.ui.getCore().clonedSalesOneResults.sort(function (a, b) {
                            return a.userId - b.userId;
                        });
                    },
                    error: function (e) {
                        MessageBox.error("Error : " + e);
                    }
                });

                var salesTwoData =
                    "User('41000020')/directReports?$select=department,division,jobCode,userId,firstName,lastName,competencyRatingNav/rating,competencyRatingNav/formContentId,competencyRatingNav/formDataId&$expand=competencyRatingNav";

                oModel.read(salesTwoData, {
                    async: false,
                    success: function (oData, oResponse) {
                        var resultsSet = [];

                        for (var i = 0; i < oData.results.length; i++) {
                            if (oData.results[i].competencyRatingNav) {
                                resultsSet.push(oData.results[i]);
                            }
                        }
                        sap.ui.getCore().salesTwoResults = resultsSet;

                        var cloneSalesTwo = resultsSet;
                        // that.clonedSalesTwoResults = Object.assign({}, cloneSalesTwo);
                        sap.ui.getCore().clonedSalesTwoResults = JSON.parse(JSON.stringify(cloneSalesTwo));
                        sap.ui.getCore().clonedSalesTwoResults = sap.ui.getCore().clonedSalesTwoResults.sort(function (a, b) {
                            return a.userId - b.userId;
                        });
                    },
                    error: function (e) {
                        MessageBox.error("Error : " + e);
                    }
                });

                var financialData =
                    "User('41000030')/directReports?$select=department,division,jobCode,userId,firstName,lastName,competencyRatingNav/rating,competencyRatingNav/formContentId,competencyRatingNav/formDataId&$expand=competencyRatingNav";

                oModel.read(financialData, {
                    async: false,
                    success: function (oData, oResponse) {
                        var resultsSet = [];

                        for (var i = 0; i < oData.results.length; i++) {
                            if (oData.results[i].competencyRatingNav) {
                                resultsSet.push(oData.results[i]);
                            }
                        }
                        sap.ui.getCore().financialResults = resultsSet;

                        var clonefinancial = resultsSet;
                        // that.clonedFinancialResults = Object.assign({}, clonefinancial);
                        sap.ui.getCore().clonedFinancialResults = JSON.parse(JSON.stringify(clonefinancial));
                        sap.ui.getCore().clonedFinancialResults = sap.ui.getCore().clonedFinancialResults.sort(function (a, b) {
                            return a.userId - b.userId;
                        });
                    },
                    error: function (e) {
                        MessageBox.error("Error : " + e);
                    }
                });

                var hrData =
                    "User('41000040')/directReports?$select=department,division,jobCode,userId,firstName,lastName,competencyRatingNav/rating,competencyRatingNav/formContentId,competencyRatingNav/formDataId&$expand=competencyRatingNav";

                oModel.read(hrData, {
                    async: false,
                    success: function (oData, oResponse) {

                        var resultsSet = [];

                        for (var i = 0; i < oData.results.length; i++) {
                            if (oData.results[i].competencyRatingNav) {
                                resultsSet.push(oData.results[i]);
                            }
                        }

                        sap.ui.getCore().hrResults = resultsSet;

                        var cloneHR = resultsSet;
                        // that.clonedHrResults = Object.assign({}, cloneHR);
                        sap.ui.getCore().clonedHrResults = JSON.parse(JSON.stringify(cloneHR));
                        sap.ui.getCore().clonedHrResults = sap.ui.getCore().clonedHrResults.sort(function (a, b) {
                            return a.userId - b.userId;
                        });
                    },
                    error: function (e) {
                        MessageBox.error("Error : " + e);
                    }
                });

                var allResults = sap.ui.getCore().salesOneResults.concat(sap.ui.getCore().salesTwoResults).concat(sap.ui.getCore().financialResults)
                    .concat(sap.ui.getCore().hrResults);

                var allResultsLength = allResults.length;
                for (sap.ui.getCore().i = 0; sap.ui.getCore().i < allResultsLength; sap.ui.getCore().i++) {

                    /*if ((allResults[sap.ui.getCore().i].userId !== "41000211") && (allResults[sap.ui.getCore().i].userId !== "41000121") && (
                            allResults[sap.ui.getCore().i].userId !== "41000122") && (allResults[sap.ui.getCore().i].userId !== "41000125") && (allResults[
                            sap.ui.getCore().i].userId !== "41000126") && (allResults[sap.ui.getCore().i].userId !== "41000125")) {*/
                    var totalRecords = allResults[sap.ui.getCore().i].competencyRatingNav.results;

                    var formContentId = totalRecords.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formContentId'];

                    var formDataId = totalRecords.sort(
                        function (a, b) {
                            return parseInt(b['rating']) - parseInt(a['rating']);
                        }
                    )[0]['formDataId'];

                    var empArrayCount = 1;
                    var totalCalRatUrl =
                        "/restricted/FormSummarySection(formContentId=" + formContentId + ",formDataId=" + formDataId +
                        ")?$expand=overallFormRating,overallAdjustedRating,summaryListing";

                    // var urlRestricted = "/destinations/normalizeService_Restricted_API40";
                    var urlRestricted = "./normalizeService_Restricted_API40";
                    // var url = "./normalizeService_API40";
                    var oModelRestricted = new sap.ui.model.odata.ODataModel(urlRestricted);
                    oModelRestricted.read(totalCalRatUrl, {
                        async: false,
                        success: function (oData, oResponse) {
                            sap.ui.getCore().completeResults = sap.ui.getCore().salesOneResults.concat(sap.ui.getCore().salesTwoResults).concat(sap.ui.getCore()
                                .financialResults).concat(sap.ui.getCore().hrResults);

                            sap.ui.getCore().clonedCompleteResults = sap.ui.getCore().clonedSalesOneResults.concat(sap.ui.getCore().clonedSalesTwoResults)
                                .concat(sap.ui.getCore().clonedFinancialResults)
                                .concat(sap.ui.getCore().clonedHrResults);
                            // that.totalCalRatResult = oData;

                            /*	var adjustedRating = {
                                        adjustedRating: 0
                                    };
                                    
                                    var CalRatResult = {
                                        CalRatResult: 0
                                    };*/

                            if (oData.overallFormRating) {
                                var adjustedRating = {
                                    adjustedRating: Math.round(oData.overallFormRating.rating).toString() + ".0"
                                };
                            } else {
                                var adjustedRating = {
                                    adjustedRating: 0
                                };
                            }

                            if (oData.overallAdjustedRating) {
                                var CalRatResult = {
                                    CalRatResult: Math.round(oData.overallAdjustedRating.rating.split("/")[0]).toString() + ".0"
                                };
                            } else {
                                var CalRatResult = {
                                    CalRatResult: 0
                                };
                            }

                            var summaryListingArray = [];
                            var roleSpecific, coreValues, goals;

                            for (var i = 0; i <= 2; i++) {
                                if (oData.summaryListing.results[i]) {
                                    if (oData.summaryListing.results[i].sectionIndex === 2) {
                                        roleSpecific = oData.summaryListing.results[i];
                                    } else if (oData.summaryListing.results[i].sectionIndex === 1) {
                                        coreValues = oData.summaryListing.results[i];
                                    } else if (oData.summaryListing.results[i].sectionIndex === 0) {
                                        goals = oData.summaryListing.results[i];
                                    }
                                }
                            }

                            summaryListingArray = [roleSpecific, coreValues, goals];

                            var summaryListing = {
                                summaryListing: summaryListingArray
                            };
                            Object.assign(sap.ui.getCore().completeResults[sap.ui.getCore().i], adjustedRating, CalRatResult, summaryListing); //, summaryListing
                            Object.assign(sap.ui.getCore().clonedCompleteResults[sap.ui.getCore().i], adjustedRating, CalRatResult, summaryListing); //, summaryListing
                        },
                        error: function (e) {
                            MessageBox.error("Error : " + e);
                        }
                    });

                }

                /**  Checking of Each Team Mean Start  **/

                var salesOneMean = 0;
                var salesOneTeamSD = [];
                for (var i = 0; i < sap.ui.getCore().salesOneResults.length; i++) {
                    // if ((sap.ui.getCore().salesOneResults[i].userId !== "41000211")) {
                    salesOneTeamSD.push(Math.round(this.findRating(sap.ui.getCore().salesOneResults[i].competencyRatingNav.results)));
                    salesOneMean += Math.round(this.findRating(sap.ui.getCore().salesOneResults[i].competencyRatingNav.results));
                    if (i === sap.ui.getCore().salesOneResults.length - 1) {
                        salesOneMean = Math.round(salesOneMean / sap.ui.getCore().salesOneResults.length);
                    }
                    // }

                }

                var salesTwoMean = 0;
                var salesTwoTeamSD = [];
                for (var i = 0; i < sap.ui.getCore().salesTwoResults.length; i++) {
                    /*if ((sap.ui.getCore().salesTwoResults[i].userId !== "41000121") && (sap.ui.getCore().salesTwoResults[i].userId !== "41000122") &&
                        (sap.ui.getCore().salesTwoResults[i].userId !== "41000124") && (sap.ui.getCore().salesTwoResults[i].userId !== "41000125") && (
                            sap.ui.getCore().salesTwoResults[i].userId !== "41000126")) {*/
                    salesTwoTeamSD.push(Math.round(this.findRating(sap.ui.getCore().salesTwoResults[i].competencyRatingNav.results)));
                    salesTwoMean += Math.round(this.findRating(sap.ui.getCore().salesTwoResults[i].competencyRatingNav.results));
                    if (i === sap.ui.getCore().salesTwoResults.length - 1) {
                        salesTwoMean = Math.round(salesTwoMean / sap.ui.getCore().salesTwoResults.length);
                    }
                    // }

                }

                var financialResults = 0;
                var financialResultsTeamSD = [];
                for (var i = 0; i < sap.ui.getCore().financialResults.length; i++) {
                    financialResultsTeamSD.push(Math.round(this.findRating(sap.ui.getCore().financialResults[i].competencyRatingNav.results)));
                    financialResults += Math.round(this.findRating(sap.ui.getCore().financialResults[i].competencyRatingNav.results));
                    if (i === sap.ui.getCore().financialResults.length - 1) {
                        financialResults = Math.round(financialResults / sap.ui.getCore().financialResults.length);
                    }

                }

                var hrResults = 0;
                var hrResultsTeamSD = [];
                for (var i = 0; i < sap.ui.getCore().hrResults.length; i++) {
                    hrResultsTeamSD.push(Math.round(this.findRating(sap.ui.getCore().hrResults[i].competencyRatingNav.results)));
                    hrResults += Math.round(this.findRating(sap.ui.getCore().hrResults[i].competencyRatingNav.results));
                    if (i === sap.ui.getCore().hrResults.length - 1) {
                        hrResults = Math.round(hrResults / sap.ui.getCore().hrResults.length);
                    }

                }

                /**  Checking of Each Team SD End  **/

                /**  Checking of Each Mean SD Start  **/
                salesOneTeamSD = Math.round(this.checkTeamSD(salesOneTeamSD));
                salesTwoTeamSD = Math.round(this.checkTeamSD(salesTwoTeamSD));
                financialResultsTeamSD = Math.round(this.checkTeamSD(financialResultsTeamSD));
                hrResultsTeamSD = Math.round(this.checkTeamSD(hrResultsTeamSD));

                /**  Checking of Each Mean SD End  **/

                /**  Checking of Total Mean Start  **/

                var totalMean = Math.round((salesOneMean + salesTwoMean + financialResults + hrResults) / 4);

                /**  Checking of Total Mean  End **/

                /**  Checking of Total SD  Start **/

                var totalSD = Math.round((salesOneTeamSD + salesTwoTeamSD + financialResultsTeamSD + hrResultsTeamSD) / 4);

                /**  Checking of Total SD  End **/

                /**  Checking of Each Team Mean Difference Start  **/

                var salesOneMeanDifference = Math.round(salesOneMean - totalMean);
                var salesTwoMeanDifference = Math.round(salesTwoMean - totalMean);
                var financialMeanDifference = Math.round(financialResults - totalMean);
                var hrMeanDifference = Math.round(hrResults - totalMean);

                /**  Checking of Each Team Mean Difference End  **/

                /**  Checking of Each Team SD Difference  Start**/

                var salesOneSDDifference = Math.round(salesOneTeamSD - totalSD);
                var salesTwoSDDifference = Math.round(salesTwoTeamSD - totalSD);
                var financialSDDifference = Math.round(financialResultsTeamSD - totalSD);
                var hrSDDifference = Math.round(hrResultsTeamSD - totalSD);

                /**  Checking of Each Team SD Difference  End**/

                var managerJSON = {
                    "managers": [{
                        "team": "영업1팀",
                        "firstManager": "41000011 신용식",
                        "secondManager": "41000002 김대훈",
                        "teamMean": salesOneMean,
                        "meanDifference": salesOneMeanDifference,
                        "teamSD": salesOneTeamSD,
                        "sdDifference": salesOneSDDifference
                    }, {
                        "team": "영업2팀",
                        "firstManager": "41000012 김대우",
                        "secondManager": "41000002 김대훈",
                        "teamMean": salesTwoMean,
                        "meanDifference": salesTwoMeanDifference,
                        "teamSD": salesTwoTeamSD,
                        "sdDifference": salesTwoSDDifference
                    }, {
                        "team": "재무회계팀",
                        "firstManager": "41000021 이계영",
                        "secondManager": "41000003 이정민",
                        "teamMean": financialResults,
                        "meanDifference": financialMeanDifference,
                        "teamSD": financialResultsTeamSD,
                        "sdDifference": financialSDDifference
                    }, {
                        "team": "인재전략팀",
                        "firstManager": "41000022 서영빈",
                        "secondManager": "41000003 이정민",
                        "teamMean": hrResults,
                        "meanDifference": hrMeanDifference,
                        "teamSD": hrResultsTeamSD,
                        "sdDifference": hrSDDifference
                    }]
                };

                var managerModel = new sap.ui.model.json.JSONModel(managerJSON);
                managerModel.setProperty("/totalMean", Math.round(totalMean));
                managerModel.setProperty("/totalSD", Math.round(totalSD));
                this.setModel(managerModel, "managerModel");

                var managerModelRatingData = this.getModel("managerModel").getData();
                sap.ui.getCore().clonedCompleteResults = JSON.parse(JSON.stringify(sap.ui.getCore().completeResults));

                var employeesModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().completeResults);
                that.setModel(employeesModel, "employeesModel");
            }

        });
    }
);