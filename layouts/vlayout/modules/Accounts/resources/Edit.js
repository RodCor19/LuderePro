/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

 Vtiger_Edit_Js("Accounts_Edit_Js",{

 },{

    //Stored history of account name and duplicate check result
    duplicateCheckCache : {},

	//This will store the editview form
	editViewForm : false,

	//Address field mapping within module
	addressFieldsMappingInModule : {
		'bill_street':'ship_street',
		'bill_pobox':'ship_pobox',
		'bill_city'	:'ship_city',
		'bill_state':'ship_state',
		'bill_code'	:'ship_code',
		'bill_country':'ship_country'
	},

   // mapping address fields of MemberOf field in the module              
   memberOfAddressFieldsMapping : {
   	'bill_street':'bill_street',
   	'bill_pobox':'bill_pobox',
   	'bill_city'	:'bill_city',
   	'bill_state':'bill_state',
   	'bill_code'	:'bill_code',
   	'bill_country':'bill_country',
   	'ship_street' : 'ship_street',        
   	'ship_pobox' : 'ship_pobox',
   	'ship_city':'ship_city',
   	'ship_state':'ship_state',
   	'ship_code':'ship_code',
   	'ship_country':'ship_country'
   },                          

	/**
	 * This function will return the current form
	 */
	 getForm : function(){
	 	if(this.editViewForm == false) {
	 		this.editViewForm = jQuery('#EditView');
	 	}
	 	return this.editViewForm;
	 },

	/**
	 * This function will return the account name
	 */
	 getAccountName : function(container){
	 	return jQuery('input[name="accountname"]',container).val();
	 },

	/**
	 * This function will return the current RecordId
	 */
	 getRecordId : function(container){
	 	return jQuery('input[name="record"]',container).val();
	 },

	/**
	 * This function will register before saving any record
	 */
	 registerRecordPreSaveEvent : function(form) {
	 	var thisInstance = this;
	 	if(typeof form == 'undefined') {
	 		form = this.getForm();
	 	}

	 	form.on(Vtiger_Edit_Js.recordPreSave, function(e, data) {
	 		var accountName = thisInstance.getAccountName(form);
	 		var recordId = thisInstance.getRecordId(form);
	 		var params = {};
	 		if(!(accountName in thisInstance.duplicateCheckCache)) {
	 			Vtiger_Helper_Js.checkDuplicateName({
	 				'accountName' : accountName, 
	 				'recordId' : recordId,
	 				'moduleName' : 'Accounts'
	 			}).then(
	 			function(data){
	 				thisInstance.duplicateCheckCache[accountName] = data['success'];
	 				form.submit();
	 			},
	 			function(data, err){
	 				thisInstance.duplicateCheckCache[accountName] = data['success'];
	 				thisInstance.duplicateCheckCache['message'] = data['message'];
	 				var message = app.vtranslate('JS_DUPLICTAE_CREATION_CONFIRMATION');
	 				Vtiger_Helper_Js.showConfirmationBox({'message' : message}).then(
	 					function(e) {
	 						thisInstance.duplicateCheckCache[accountName] = false;
	 						form.submit();
	 					},
	 					function(error, err) {

	 					}
	 					);
	 			}
	 			);
	 		}

	 		else {
	 			if(thisInstance.duplicateCheckCache[accountName] == true){
	 				var message = app.vtranslate('JS_DUPLICTAE_CREATION_CONFIRMATION');
	 				Vtiger_Helper_Js.showConfirmationBox({'message' : message}).then(
	 					function(e) {
	 						thisInstance.duplicateCheckCache[accountName] = false;
	 						form.submit();
	 					},
	 					function(error, err) {

	 					}
	 					);
	 			} else {
	 				delete thisInstance.duplicateCheckCache[accountName];
	 				return true;
	 			}
	 		}
	 		e.preventDefault();
	 	})
	 },

	/**
	 * Function to swap array
	 * @param Array that need to be swapped
	 */ 
	 swapObject : function(objectToSwap){
	 	var swappedArray = {};
	 	var newKey,newValue;
	 	for(var key in objectToSwap){
	 		newKey = objectToSwap[key];
	 		newValue = key;
	 		swappedArray[newKey] = newValue;
	 	}
	 	return swappedArray;
	 },

	/**
	 * Function to copy address between fields
	 * @param strings which accepts value as either odd or even
	 */
	 copyAddress : function(swapMode, container){
	 	var thisInstance = this;
	 	var addressMapping = this.addressFieldsMappingInModule;
	 	if(swapMode == "false"){
	 		for(var key in addressMapping) {
	 			var fromElement = container.find('[name="'+key+'"]');
	 			var toElement = container.find('[name="'+addressMapping[key]+'"]');
	 			toElement.val(fromElement.val());
	 		}
	 	} else if(swapMode){
	 		var swappedArray = thisInstance.swapObject(addressMapping);
	 		for(var key in swappedArray) {
	 			var fromElement = container.find('[name="'+key+'"]');
	 			var toElement = container.find('[name="'+swappedArray[key]+'"]');
	 			toElement.val(fromElement.val());
	 		}
	 	}
	 },

	/**
	 * Function to register event for copying address between two fileds
	 */
	 registerEventForCopyingAddress : function(container){
	 	var thisInstance = this;
	 	var swapMode;
	 	jQuery('[name="copyAddress"]').on('click',function(e){
	 		var element = jQuery(e.currentTarget);
	 		var target = element.data('target');
	 		if(target == "billing"){
	 			swapMode = "false";
	 		}else if(target == "shipping"){
	 			swapMode = "true";
	 		}
	 		thisInstance.copyAddress(swapMode, container);
	 	})
	 },

	/**
	 * Function which will register event for Reference Fields Selection
	 */
	 registerReferenceSelectionEvent : function(container) {
	 	var thisInstance = this;

	 	jQuery('input[name="account_id"]', container).on(Vtiger_Edit_Js.referenceSelectionEvent, function(e, data){
	 		thisInstance.referenceSelectionEventHandler(data, container);
	 	});
	 },

	/**
	 * Reference Fields Selection Event Handler
	 * On Confirmation It will copy the address details
	 */
	 referenceSelectionEventHandler :  function(data, container) {
	 	var thisInstance = this;
	 	var message = app.vtranslate('OVERWRITE_EXISTING_MSG1')+app.vtranslate('SINGLE_'+data['source_module'])+' ('+data['selectedName']+') '+app.vtranslate('OVERWRITE_EXISTING_MSG2');
	 	Vtiger_Helper_Js.showConfirmationBox({'message' : message}).then(
	 		function(e) {
	 			thisInstance.copyAddressDetails(data, container);
	 		},
	 		function(error, err){
	 		});
	 },

	/**
	 * Function which will copy the address details - without Confirmation
	 */
	 copyAddressDetails : function(data, container) {
	 	var thisInstance = this;
	 	thisInstance.getRecordDetails(data).then(
	 		function(data){
	 			var response = data['result'];
	 			thisInstance.mapAddressDetails(thisInstance.memberOfAddressFieldsMapping, response['data'], container);
	 		},
	 		function(error, err){

	 		});
	 },

	/**
	 * Function which will map the address details of the selected record
	 */
	 mapAddressDetails : function(addressDetails, result, container) {
	 	for(var key in addressDetails) {
			// While Quick Creat we don't have address fields, we should  add
			if(container.find('[name="'+key+'"]').length == 0) { 
				container.append("<input type='hidden' name='"+key+"'>"); 
			} 
			container.find('[name="'+key+'"]').val(result[addressDetails[key]]);
			container.find('[name="'+key+'"]').trigger('change');
			container.find('[name="'+addressDetails[key]+'"]').val(result[addressDetails[key]]);
			container.find('[name="'+addressDetails[key]+'"]').trigger('change');
		}
	},
	
	onchangeAccMContacto : function(container){
		$('input[name="accmcotro"]').attr('disabled', true);
		var td = $('input[name="accmcreferido"]').parent().parent().parent();
		var tdLabel = td.prev().children();
		$('input[name="accmcreferido"]').attr('style', 'display:none');
		tdLabel.attr('style', 'display:none');
		var td = $('select[name="accmccombo"]').parent().parent().parent();
		var tdLabel = td.prev().children();
		$('select[name="accmccombo"]').parent().attr('style', 'display:none');
		tdLabel.text(' ');
		var select = $('select[name="accmccombo"]');
		var onclick = function(o){
			console.log(o);
		};

		$('select[name="accmcontacto"]').on('change',function() {
			var seleccionado = $('select[name="accmcontacto"] option:selected').text();
			if (seleccionado === "Otro") {
				$('input[name="accmcotro"]').attr('disabled', false);
			} else {
				$('input[name="accmcotro"]').attr('disabled', true);
			}
			var td = $('input[name="accmcreferido"]').parent().parent().parent();
			var tdLabel = td.prev().children();
			if (seleccionado === "Referido") {
				$('input[name="accmcreferido"]').attr('style', 'display:block');
				tdLabel.attr('style', 'display:block');
			} else {
				$('input[name="accmcreferido"]').attr('style', 'display:none');
				tdLabel.attr('style', 'display:none');				
			}
			var td = $('select[name="accmccombo"]').parent().parent().parent();
			var tdLabel = td.prev().children();
			if(seleccionado === "Intermediario" || seleccionado === "Gestión proactiva"){
				var select = $('select[name="accmccombo"]');
				var div = select.next();
				var idOpcion = div.attr('id');
				var ul = div.children().next().children().next();
				for (var i = ul.children().length - 1; i >= 1; i--) {
					ul.children()[i].remove();
				}
				if (seleccionado === "Intermediario") {
					tdLabel.text('Primer contacto');
					var Opciones = {
						'Nuestra Empresa' : 'Nuestra Empresa',
						'Otra Empresa' : 'Otra Empresa'
					};
					$.each(Opciones, function(key, value) {
						select.append($("<option></option>").attr("value",key-1).text(value));
					});
					var ul = div.children().next().children().next();
					var index = 1;
					$.each(Opciones, function(key, value) {
						var o = $("<li id="+idOpcion+"_o_"+index+" class='active-result' style></li>").attr('value',value).text(value);
						o.on('click', () => onclick(o));
						ul.append(o);
						index++;
					});

				}else{
					tdLabel.text('Area');
					var Opciones = {
						'Marketing' : 'Marketing',
						'Administración' : 'Administración',
						'Ventas' : 'Ventas',
						'RRHH' : 'RRHH'
					};
					$.each(Opciones, function(key, value) {
						select.append($("<option></option>").attr("value",key-1).text(value));
					});
					var ul = div.children().next().children().next();
					var index = 1;
					$.each(Opciones, function(key, value) {
						var o = $("<li id="+idOpcion+"_o_"+index+" class='active-result' style></li>").attr('value',value).text(value);
						o.on('click', () => onclick(o));
						ul.append(o);
						index++;
					});
				}
				$('select[name="accmccombo"]').parent().attr('style', 'display:block');
			}else{
				$('select[name="accmccombo"]').parent().attr('style', 'display:none');
				tdLabel.text(' ');
			}
		})
	},
	/**
	 * Function which will register basic events which will be used in quick create as well
	 *
	 */
	 registerBasicEvents : function(container) {
	 	this._super(container);
	 	this.registerRecordPreSaveEvent(container);
	 	this.registerEventForCopyingAddress(container);
	 	this.registerReferenceSelectionEvent(container);
	 	this.onchangeAccMContacto(container);
			//container.trigger(Vtiger_Edit_Js.recordPreSave, {'value': 'edit'});
		}
	});