/*** Object Page actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/actions/Press"],

	function (PropertyStrictEquals, AggregationFilled, Press) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* CLICK ON BACK BUTTON */
				iClickTheBackButton: function() {
					return this.iClickTheButtonWithId(prefix + "back", "Back");
				},
				
				iClickTheButton: function (buttonText) {
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
						errorMessage: "The button "+ buttonText +" cannot be clicked"
					});
				},

				iLookAtTheScreen : function () {
					return this;
				},

				iClickTheButtonWithId: function(sId, sButtonText) {
					return this.waitFor({
						id: sId,
						success: function (oButton) {
							oButton.firePress();
						},
						errorMessage: "The " + sButtonText + " button could not be found"
					});
				}
			};
		};
});