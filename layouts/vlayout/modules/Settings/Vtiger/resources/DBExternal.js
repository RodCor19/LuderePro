/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

 jQuery.Class("Settings_Vtiger_DBExternal_Js",{},{

	
	//Contains Announcement container
	container : false,

 	getContainer : function() {
 		if(this.container == false){
 			this.container = jQuery('#DBExternalContainer').find('.contents');
 		}
 		return this.container;
 	},

	/*
	 * Function to connect and show data from a external bd
	 */

	 connectDB : function() {
	 	var aDeferred = jQuery.Deferred();

	 	var host = $('input[name="dbserver"]').val();
	 	if ($('input[name="dbportEnable"]').is(':checked'))
	 		host = host + ":" + $('input[name="dbport"]').val();
	 	var user = $('input[name="dbuser"]').val();
	 	var pass = $('input[name="dbpassword"]').val();
	 	var database = $('input[name="dbname"]').val(); 
	 	if (host  !== "" && user != "" && database !== "") {
	 		var params = {
	 			'module' : 'Vtiger',
	 			'parent' : 'Settings',
	 			'action' : 'ConnectionExternalDB',
	 			'dbhost' : host,
	 			'dbuser' : user,
	 			'dbpassword' : pass,
	 			'dbdatabase' : database  
	 		}
	 		AppConnector.request(params).then(
	 			function(data) {
	 				console.log(data);
	 				if(data !== null && data['success'] === true){
	 					aDeferred.resolve(data['result']);
	 				}else{
	 					if (data === null) {
	 						aDeferred.reject('Ocurrió un error interno');
	 					} else {
	 						aDeferred.reject(data['result']);
	 					}
	 				}
	 			},
	 			function(error,err){
	 				console.log(error);
	 				aDeferred.reject();
	 			}
	 			);
	 	} else {
	 		aDeferred.reject({'message' : 'Los campos están vacios','error':'Complete los campos'});
	 	}

	 	return aDeferred.promise();
	 },

	 registerEvents: function() {
	 	var thisInstance = this;
	 	var divContent = $('#fields');
	 	var editButton = $('#DBExternalContainer').children().children().next().children().children();
	 	var conectButton = $('#fields').children().next().children().first();
	 	var cancelButton = conectButton.next();
		//Register click event for save button
		conectButton.attr('disabled', true);
		cancelButton.attr('disabled', true);
		cancelButton.click(function(e) {
			var trs = divContent.children().children().next().children();
			trs.each(function(index) {
				var td = $( this ).children().next().children();
				td.each(function(i) {
					$(this).empty();
				});
			});
			editButton.attr('disabled', false);
			conectButton.attr('disabled', true);
			cancelButton.attr('disabled', true);
		});

		conectButton.click(function(e) {
			thisInstance.connectDB().then(
				function(data) {
					if (data['success'] === true) {
						var params = {
							text: 'Se conectó a la base de datos'
						};
						Settings_Vtiger_Index_Js.showMessage(params);
						var table = '<table style="width:100%">';
						var tuplas = data['data'];
						tuplas.forEach(function(fila, index) {
							if(index === 0){
								table = table + '<thead><tr>';
								$.each(fila, function (key, valor) {
										table = table + '<th >'+ app.vtranslate(key) +'</th>';
								});
								table = table + '</tr></thead><tbody>';

							}
							table = table + '<tr>';
							$.each(fila, function (key, valor) {
								table = table + '<td style = "width : 200px">'+ valor +'</td>';
							});
							table = table + '</tr>';
							if (index === tuplas.length-1) {
								table = table + '</tbody>';
							}
						});
						table = table + '</table>';
						$('#table').empty();
						$('#table').attr('style', 'overflow:scroll; height:500px; width:100%;')
						$('#table').append(table);
					} else {
						Vtiger_Helper_Js.showPnotify({
							title: data['message'],
							text: data['error']
						});
					}

				},
				function(error){
					Vtiger_Helper_Js.showPnotify({
						title: error['message'],
						text: error['error']
					});
				}
				);
		});



		editButton.click(function(e) {
			var trs = divContent.children().children().next().children();
			var array = [
			'<input type="text" name="dbserver" value="" />',
			'<input type="text" name="dbport" value="" /><input style="margin-left: 30px;" type="checkbox" name="dbportEnable" title="'+app.vtranslate('JS_LBL_CHECKPORTENABLED')+'">',
			'<input type="text" name="dbuser" value="" />',
			'<input type="password" name="dbpassword" value="" />',
			'<input type="text" name="dbname" value="" />',
			];
			trs.each(function(index) {
				var td = $( this ).children().next().children();
				td.append(array[index]);
				if (index === 1) {
					$( this ).children().next().children().children().first().attr('disabled', true);
					$( this ).children().next().children().children().first().next().click(function(e) {
						if ($(this).is(':checked')) {
							$(this).prev().attr('disabled', false);
						} else {
							$(this).prev().attr('disabled', true);
						}
					});
				}
			});
			editButton.attr('disabled', true);
			conectButton.attr('disabled', false);
			cancelButton.attr('disabled', false);
		});
	}
});

 jQuery(document).ready(function(e){
 	var instance = new Settings_Vtiger_DBExternal_Js();
 	//instance.registerEvents();
 })