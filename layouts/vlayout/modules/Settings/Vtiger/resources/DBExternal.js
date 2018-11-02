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
	 * Realiza la conexión con la otr base de datos
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
	 /* esta funcion envia los datos obtenidos de cada input en la funcion siguiente
	  * creando los campos si no existen, y si existen, sobreescribe los valores del
	  *	picklist
	  */
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
	  				if (data === null) {
	  					aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  				} else {
	  					aDeferred.reject(data['result']);
	  				}
	  			}
	  		},
	  		function(error,err){
	  			aDeferred.reject(data['result']);
	  		}
	  		);

	  	return aDeferred.promise();
	  },
	/*	esta funcion se llama desde el evento onclick del boton importar
	 * 	consulta que checkbox del div table están seleccionados y hace un
	 *	ajax por cada uno
	 */
	 importFields: function() {
	 	var thisInstance = this;
	 	var campos =$('#table input:checked');
	 	if (campos != null && campos.length > 0) {
	 		$.each(campos, function(index, fila) {
	 			thisInstance.enviarCampos(fila.value).then(
	 				function(data) {
	 					var params = null;
	 					var datosJson = JSON.parse(fila.value);
	 					if(data.creacion)
	 						params = {
	 							text: 'Se creó el campo '+datosJson['fieldlabel']
	 						};
	 						if(data.reescritura)
	 							params = {
	 								text: 'Se sobreescribieron los valores del campo '+datosJson['fieldlabel']
	 							};
							//envía un mensaje en pantalla
							Settings_Vtiger_Index_Js.showMessage(params);
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
	 	//funcion de cargar los campos del select con los nombres de los modulos
	 	/* 	obtiene el id del modulo seleccionado que se encuentra en el value del
	 	 *	option lo envia al action ConnectionExternalFields que devuelve un 
	 	 *	array de los campos con sus datos como nombre de modulo, nombre de 
	 	 *	bloque, nombre de la columna, nombre del campo, tipo de data, tipo de 
	 	 *	dato en la base de datos, etc. 
	 	 */
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
	 	//selecciona div qe contiene los datos de conexión
	 	var divContent = $('#fields');
	 	//selecciona botones
	 	var editButton = $('#DBExternalContainer').children().children().next().children().children();
	 	var conectButton = $('#fields').children().next().children().first();
	 	var cancelButton = conectButton.next();
	 	var importButton = $('#buttons').children().first();
	 	var cancelButton2 = importButton.next();
		//deshabilita botones
		conectButton.attr('disabled', true);
		cancelButton.attr('disabled', true);
		cancelButton2.attr('disabled', true);
		importButton.attr('disabled', true);


		// onchange en select si trae cargados los modulos en la vista
	 	/* llama a funcion loadfields
	 	*/
	 	if($('#selectModulesName').children().length > 1){
	 		$('#selectModulesName').change(function(e){
	 			loadfields().then(
	 			//callback 200 OK
	 			function(data) {
	 				//action todo bien
	 				if (data['success'] === true) {
	 					//crea tabla
	 					var table = '<table class="table"  style="width:100%">';
	 					//toma array
	 					var tuplas = data['data'];
	 					table = table + '<thead><tr><th>Campo</th><th>UIType</th><th>Crear</th><th>Sobreescribir</th></tr></thead><tbody>';
	 					if(tuplas != null)
	 						//crea fila a fila
	 					tuplas.forEach(function(fila, index) {
	 						table = table + '<tr>';
	 						table = table + '<td style="content-aling: center">'+fila['fieldlabel']+'</td>';
	 						table = table + '<td style="content-aling: center">'+fila['uitype']+'</td>';
	 						if (fila.existe === false) {
	 							table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(fila) +' /></td>';
	 							table = table + '<td style="content-aling: center"></td>';
	 						} else {
	 							table = table + '<td style="content-aling: center"></td>';
	 							table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(fila) +' /></td>';
	 						}
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
	 			//callback no 200 OK
	 			function(error, err){
	 				Vtiger_Helper_Js.showPnotify({'message' : 'UPS!','error':'Ocurrió un error interno'});
	 			}
	 			);
	 		});
	 	}

		// on click del botón cancelar en la parte superior
		cancelButton.click(function(e) {
			//restaura el style al div table
			$('#table').attr('style', '');
			//vacía el div table
			$('#table').empty();
			//vacia el select con los nombres de modulos
			$('#selectModulesName').empty().append('<option value="none">Seleccionar</option>');
			//habilita el botón para configurar los campos de edición de la conexión
			editButton.attr('disabled', false);
			//deshabilita los botones
			conectButton.attr('disabled', true);
			cancelButton.attr('disabled', true);
			cancelButton2.attr('disabled', true);
			importButton.attr('disabled', true);
			//quita el onchange al select, no sé si realmente funciona
			$('#selectModulesName').off('change');
			//agrega la clase hide y oculta al div padre del div select y el div tabla
			$('#dataDB').addClass('hide');
			//oculta los input de la tabla conexión
			var trs = divContent.children().children().next().children();
			trs.each(function(index) {
				var td = $( this ).children().next().children();
				td.empty();
			});
			//quita el estilo al div tabla
			$('#table').attr('style', '');

		});

		//botón import, realiza la tarea importFields
		importButton.click(function(e) {
			thisInstance.importFields();
		});

		//botón cancelar en la parte inferior, funciona exactamente igual al superior
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

			var trs = divContent.children().children().next().children();
			trs.each(function(index) {
				var td = $( this ).children().next().children();
				td.empty();
			});
			$('#table').attr('style', '');
		});

		//botón conectar, si se le hace click
		conectButton.click(function(e) {
			//realiza la duncion connectDB
			thisInstance.connectDB().then(
				//callback si código 200 OK
				function(data) {
					//pregunta si en el action salió todo bien
					if (data['success'] === true) {
						//apaga el onSelect anterior si es que existía
						$('#selectModulesName').off('change');
						//crea un array para enviar un mensaje en pantalla
						var params = {
							text: 'Se conectó a la base de datos'
						};
						//envía un mensaje en pantalla
						Settings_Vtiger_Index_Js.showMessage(params);
						//vacía la tabla de campos a importar
						$('#table').empty();
						//quita el estilo al div tabla
						$('#table').attr('style', '');
						//guarda el select en una variable
						var select = $('#selectModulesName');
						//borra el contenido y coloca un option por defecto
						select.empty().append('<option value="none">Seleccionar</option>');
						//obtiene los modulos del data
						var options = data['data'];
						//por cada modulo agrega un option con el id del modulo en value 
						//y el nombre en el label  
						options.forEach(function(campos, index) {
							select.append('<option value="'+campos.tabid+'">'+campos.name+'</option>');
						});
						//crea el evento on change, ya esplicado arriba
						select.change(function(e) {
							loadfields().then(
								function(data) {
									if (data['success'] === true) {
										var table = '<table class="table"  style="width:100%">';
										var tuplas = data['data'];
										table = table + '<thead><tr><th>Campo</th><th>UIType</th><th>Crear</th><th>Sobreescribir</th></tr></thead><tbody>';
										if(tuplas != null)
											tuplas.forEach(function(fila, index) {
												table = table + '<tr>';
												table = table + '<td style="content-aling: center">'+fila['fieldlabel']+'</td>';
												table = table + '<td style="content-aling: center">'+fila['uitype']+'</td>';
												if (fila.existe === false) {
													table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(fila) +' /></td>';
													table = table + '<td style="content-aling: center"></td>';
												} else {
													table = table + '<td style="content-aling: center"></td>';
													table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(fila) +' /></td>';
												}
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
						//saca la clase hide del div abuelo del select y muestra select y botones
						$('#dataDB').removeClass('hide');
					} else {
						// mensaje de error en el action
						Vtiger_Helper_Js.showPnotify({
							title: data['message'],
							text: data['error']
						});
					}

				},
				function(error){
					// mensaje de error por no 200 OK
					Vtiger_Helper_Js.showPnotify({
						title: error['message'],
						text: error['error']
					});
				}
				);
		});


		//boton editar, su onclick
		editButton.click(function(e) {
			//selecciona las filas de la tabla con los datos de conexión
			var trs = divContent.children().children().next().children();
			//se define un array con los inputs
			var array = [
			'<input type="text" name="dbserver" value="" />',
			'<input type="text" name="dbport" value="" /><input style="margin-left: 30px;" type="checkbox" name="dbportEnable" title="'+app.vtranslate('JS_LBL_CHECKPORTENABLED')+'">',
			'<input type="text" name="dbuser" value="" />',
			'<input type="password" name="dbpassword" value="" />',
			'<input type="text" name="dbname" value="" />',
			];
			//por cada fila se agrega el input en la segunda columna
			trs.each(function(index) {
				var td = $( this ).children().next().children();
				//se inserta el input con su correspondiente en array
				td.append(array[index]);
				//al segundo input correspondiente al index 1
				if (index === 1) {
					//se deshabilita input text, no siempre necesario
					$( this ).children().next().children().children().first().attr('disabled', true);
					//se coloca un onclick al checkbox para habilitar el campo
					$( this ).children().next().children().children().first().next().click(function(e) {
						if ($(this).is(':checked')) {
							$(this).prev().attr('disabled', false);
						} else {
							$(this).prev().attr('disabled', true);
						}
					});
				}
			});
			//deshabilita botón editar
			editButton.attr('disabled', true);
			//habilita botones
			conectButton.attr('disabled', false);
			cancelButton.attr('disabled', false);
		});
	}
});

jQuery(document).ready(function(e){
	var instance = new Settings_Vtiger_DBExternal_Js();
	/*	se carga automaticamente, no descomentar
		produce que los eventos en componentes se carguen dos veces
		*/
 	//instance.registerEvents();
 })