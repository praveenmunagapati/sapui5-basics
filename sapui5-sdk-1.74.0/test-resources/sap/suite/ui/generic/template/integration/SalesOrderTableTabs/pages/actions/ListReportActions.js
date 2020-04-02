/*** List Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", 
	 "sap/ui/test/matchers/AggregationFilled", 
	 "sap/ui/test/actions/Press", 
	 "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaDataStore"],

	function (PropertyStrictEquals, AggregationFilled, Press, OpaDataStore) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* BUTTON PRESS ON PAGE */
				iClickTheButton: function (buttonText) {
					console.log ( "OPA5::ListReportActions::iClickTheButton" + " viewName: " + viewName + "viewNamespace: " + viewNamespace);
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: buttonText
							})
						],
						actions: new Press(),
						errorMessage: "The button cannot be clicked"
					});
				},
				/* CLICK ON ITEM ON TABLE */
				iClickTheItemInTheTable: function(iIndex) {
					console.log ( "OPA5::ListReportActions::iClickTheItemInTheTable" + " iIndex: " + iIndex + " prefix: " + prefix + " viewName: " + viewName + " viewNamespace: " + viewNamespace);
					return this.iClickTheItemInAnyTable(iIndex, prefix, viewName, viewNamespace); // Common.js
				},
				/* CLICK ON A TAB */
				iClickOnTheTab: function (tabItemText) {
					console.log ( "OPA5::ListReportActions::iClickOnTheTab" + " viewName: " + viewName + "viewNamespace: " + viewNamespace);
					return this.waitFor({
						controlType: "sap.ui.core.Item",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: tabItemText
							})
						],
						actions: new Press(),
						errorMessage: "The tab item cannot be clicked"
					});
				}
			};
		};
});