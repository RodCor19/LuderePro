/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

 jQuery.Class("Settings_Vtiger_DBExternal_Js",{},{


	//Contains DBExternal container
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
	 				if(data !== null && data['success'] === true){
	 					aDeferred.resolve(data['result']);
	 				}else{
	 					if (data === null) {
	 						aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos'});
	 					} else {
	 						aDeferred.reject(data['result']);
	 					}
	 				}
	 			},
	 			function(error,err){
	 				aDeferred.reject();
	 			}
	 			);
	 	} else {
	 		aDeferred.reject({'message' : 'Los campos están vacios','error':'Complete los campos'});
	 	}

	 	return aDeferred.promise();
	 },
	 enviarCampos: function(fila){
	 	var aDeferred = jQuery.Deferred();
	 	var params = {
	 		'module' : 'Vtiger',
	 		'parent' : 'Settings',
	 		'action' : 'ConnectionExternalImport',
	 		'tupla' : fila  
	 	}
	 	AppConnector.request(params).then(
	 		function(data) {
	 			if(data !== null && data['success'] === true){
	 				aDeferred.resolve(data['result']);
	 			}else{
	 				console.log(data);
	 				if (data === null) {
	 					aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	 				} else {
	 					aDeferred.reject(data['result']);
	 				}
	 			}
	 		},
	 		function(error,err){
	 			aDeferred.reject();
	 		}
	 	);

	 	return aDeferred.promise();
	 },

	 importFields: function() {
	 	var thisInstance = this;
	 	var campos =$('#table input:checked');
	 	if (campos != null && campos.length > 0) {
	 		$.each(campos, function(index, fila) {
	 			thisInstance.enviarCampos(fila.value).then(
	 				function(data) {
	 					console.log(data);
	 				},
	 				function(error, err) {
	 					Vtiger_Helper_Js.showPnotify({
							title: error['message'],
							text: error['error']
						});
	 				}
	 			);
			});
	 	}else{
	 		Vtiger_Helper_Js.showPnotify({
				title: 'Ningún campo ha sido seleccionado',
				text: 'Seleccione los campos a importar'
			});
	 	}
	 },
	 registerEvents: function() {
	 	var loadfields = function() {
		 	var aDeferred = jQuery.Deferred();
		 	var idModulo = $('#selectModulesName').val();
		 	if (idModulo  !== "none") {
		 		var params = {
		 			'module' : 'Vtiger',
	 				'parent' : 'Settings',
	 				'action' : 'ConnectionExternalFields',
		 			'dbmoduloid' : idModulo 
		 		}
		 		AppConnector.request(params).then(
		 			function(data) {
		 				if(data !== null && data['success'] === true){
		 					aDeferred.resolve(data['result']);
		 				}else{
		 					if (data === null) {
		 						aDeferred.reject({'message' : 'UPS!','error':'Ocurrió un error interno'});
		 					} else {
		 						var mensaje = {
		 							'message' : data['result']['message'],
		 							'error': data['result']['error']
		 						};
		 						aDeferred.reject();
		 					}
		 				}
		 			},
		 			function(error,err){
		 				aDeferred.reject({'message' : 'UPS!','error':'Ocurrió un error interno'});
		 			}
		 		);
		 	} else {
		 		aDeferred.reject({'message' : 'No ha seleccionado un modulo','error':'Seleccione un modulo'});
		 	}

		 	return aDeferred.promise();
		};
	 	var thisInstance = this;
	 	var divContent = $('#fields');
	 	var editButton = $('#DBExternalContainer').children().children().next().children().children();
	 	var conectButton = $('#fields').children().next().children().first();
	 	var cancelButton = conectButton.next();
	 	var importButton = $('#buttons').children().first();
	 	var cancelButton2 = importButton.next();
		//Register click event for save button
		conectButton.attr('disabled', true);
		cancelButton.attr('disabled', true);
		cancelButton2.attr('disabled', true);
		importButton.attr('disabled', true);

		cancelButton.click(function(e) {
			$('#table').attr('style', '');
			$('#table').empty();
			$('#selectModulesName').empty().append('<option value="none">Seleccionar</option>');
			editButton.attr('disabled', false);
			conectButton.attr('disabled', true);
			cancelButton.attr('disabled', true);
			cancelButton2.attr('disabled', true);
			importButton.attr('disabled', true);
			$('#selectModulesName').off('change');
			$('#dataDB').addClass('hide');
		});

		importButton.click(function(e) {
			thisInstance.importFields();
		});

		cancelButton2.click(function(e) {
			$('#table').attr('style', '');
			$('#table').empty();
			$('#selectModulesName').empty().append('<option value="none">Seleccionar</option>');
			editButton.attr('disabled', false);
			conectButton.attr('disabled', true);
			cancelButton.attr('disabled', true);
			cancelButton2.attr('disabled', true);
			importButton.attr('disabled', true);
			$('#selectModulesName').off('change');
			$('#dataDB').addClass('hide');
		});


		conectButton.click(function(e) {
			thisInstance.connectDB().then(
				function(data) {
					if (data['success'] === true) {
						var params = {
							text: 'Se conectó a la base de datos'
						};
						Settings_Vtiger_Index_Js.showMessage(params);
						/**/
						$('#table').empty();
						var select = $('#selectModulesName');
						select.empty().append('<option value="none">Seleccionar</option>');
						var options = data['data'];
						options.forEach(function(campos, index) {
							select.append('<option value="'+campos.tabid+'">'+campos.name+'</option>');
						});
						select.change(function(e) {
							loadfields().then(
								function(data) {
									if (data['success'] === true) {
										var table = '<table class="table"  style="width:100%">';
										var tuplas = data['data'];
										table = table + '<thead><tr><th></th><th>Campo</th><th>UIType</th></tr></thead><tbody>';
										if(tuplas != null)
											tuplas.forEach(function(fila, index) {
						 						table = table + '<tr>';
						 						table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(fila) +' /></td>';
						 						table = table + '<td style="content-aling: center">'+fila['columnname']+'</td>';
						 						table = table + '<td style="content-aling: center">'+fila['uitype']+'</td>';
						 						table = table + '</tr>';
											});
										table = table + '</tbody></table>';
										$('#table').empty();
										$('#table').attr('style', 'overflow:scroll; height:300px; width:100%;');
										$('#table').append(table);
										cancelButton2.attr('disabled', false);
										importButton.attr('disabled', false);
									} else {
										Vtiger_Helper_Js.showPnotify({
											title: data['message'],
											text: data['error']
										});
									}
								},
								function(error, err){
									Vtiger_Helper_Js.showPnotify({'message' : 'UPS!','error':'Ocurrió un error interno'});
								}
							);
						});
						$('#dataDB').removeClass('hide');
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