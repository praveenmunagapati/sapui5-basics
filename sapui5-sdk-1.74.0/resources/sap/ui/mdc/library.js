/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";sap.ui.getCore().initLibrary({version:"1.74.0",name:"sap.ui.mdc",dependencies:["sap.ui.core","sap.m"],designtime:"sap/ui/mdc/designtime/library.designtime",types:["sap.ui.mdc.TableType","sap.ui.mdc.TableP13Mode","sap.ui.mdc.GrowingMode","sap.ui.mdc.RowCountMode","sap.ui.mdc.SelectionMode","sap.ui.mdc.TableRowAction","sap.ui.mdc.FieldDisplay","sap.ui.mdc.EditMode","sap.ui.mdc.FilterExpression","sap.ui.mdc.OutParameterMode"],interfaces:["sap.ui.mdc.IFilter"],controls:["sap.ui.mdc.Chart","sap.ui.mdc.Table","sap.ui.mdc.FilterBar","sap.ui.mdc.field.FieldBase","sap.ui.mdc.Field","sap.ui.mdc.FilterField","sap.ui.mdc.field.ValueHelpPanel","sap.ui.mdc.field.DefineConditionPanel","sap.ui.mdc.link.Panel","sap.ui.mdc.link.ContactDetails"],elements:["sap.ui.mdc.table.Column","sap.ui.mdc.table.CreationRow","sap.ui.mdc.table.TableTypeBase","sap.ui.mdc.table.GridTableType","sap.ui.mdc.table.ResponsiveTableType","sap.ui.mdc.chart.DimensionItem","sap.ui.mdc.chart.MeasureItem","sap.ui.mdc.field.CustomFieldHelp","sap.ui.mdc.field.CustomFieldInfo","sap.ui.mdc.field.FieldHelpBase","sap.ui.mdc.field.FieldInfo","sap.ui.mdc.field.FieldInfoBase","sap.ui.mdc.field.FieldValueHelp","sap.ui.mdc.field.FieldValueHelpContentWrapperBase","sap.ui.mdc.field.FieldValueHelpMTableWrapper","sap.ui.mdc.field.ListFieldHelp","sap.ui.mdc.field.BoolFieldHelp","sap.ui.mdc.filterbar.FilterItemLayout","sap.ui.mdc.link.ContactDetailsAddressItem","sap.ui.mdc.link.ContactDetailsEmailItem","sap.ui.mdc.link.ContactDetailsItem","sap.ui.mdc.link.ContactDetailsPhoneItem","sap.ui.mdc.link.ContentHandler","sap.ui.mdc.link.LinkHandler","sap.ui.mdc.link.LinkItem","sap.ui.mdc.link.PanelItem","sap.ui.mdc.link.FlpLinkHandler","sap.ui.mdc.link.SemanticObjectUnavailableAction","sap.ui.mdc.link.SemanticObjectMapping","sap.ui.mdc.link.SemanticObjectMappingItem","sap.ui.mdc.field.InParameter","sap.ui.mdc.field.OutParameter"],extensions:{flChangeHandlers:{"sap.ui.mdc.Table":"sap/ui/mdc/flexibility/Table","sap.ui.mdc.Chart":"sap/ui/mdc/flexibility/Chart","sap.ui.mdc.FilterBar":"sap/ui/mdc/flexibility/FilterBar","sap.ui.mdc.link.PanelItem":"sap/ui/mdc/flexibility/PanelItem","sap.ui.mdc.link.Panel":"sap/ui/mdc/flexibility/Panel"}},noLibraryCSS:false});var t=sap.ui.mdc;t.FilterBarP13nMode={Item:"Item",Value:"Value"};t.TableType={Table:"Table",ResponsiveTable:"ResponsiveTable"};t.TableP13nMode={Column:"Column",Sort:"Sort"};t.GrowingMode={Basic:"Basic",Scroll:"Scroll"};t.RowCountMode={Auto:"Auto",Fixed:"Fixed"};t.ChartToolbarActionType={ZoomInOut:"ZoomInOut",DrillDownUp:"DrillDownUp",Legend:"Legend",FullScreen:"FullScreen",P13nOfVisibility:"Visibility",P13nOfSort:"Sort",P13nOfFilter:"Filter",P13nOfChartType:"ChartType"};t.SelectionMode={None:"None",Single:"Single",Multi:"Multi"};t.RowAction={Navigation:"Navigation"};t.FieldDisplay={Value:"Value",Description:"Description",ValueDescription:"ValueDescription",DescriptionValue:"DescriptionValue"};t.EditMode={Display:"Display",Editable:"Editable",ReadOnly:"ReadOnly",Disabled:"Disabled",EditableReadOnly:"EditableReadOnly",EditableDisplay:"EditableDisplay"};t.FilterExpression={Interval:"Interval",Single:"Single",Multi:"Multi"};t.OutParameterMode={Always:"Always",WhenEmpty:"WhenEmpty"};t.ChartItemType={Dimension:"Dimension",Measure:"Measure"};t.ChartItemRoleType={category:"category",series:"series",category2:"category2",axis1:"axis1",axis2:"axis2",axis3:"axis3"};t.ContactDetailsAddressType={work:"work",home:"home",preferred:"preferred"};t.ContactDetailsEmailType={work:"work",home:"home",preferred:"preferred"};t.ContactDetailsPhoneType={work:"work",home:"home",cell:"cell",fax:"fax",preferred:"preferred"};return t;});