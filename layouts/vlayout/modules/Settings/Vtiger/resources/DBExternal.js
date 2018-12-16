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
	 	var progressInstance = jQuery.progressIndicator({
	 		'position':'html',
	 		'blockInfo' : {
	 			'enabled' : true,
	 		}
	 	});
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
	 				progressInstance.progressIndicator({'mode' : 'hide'});
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
	 				progressInstance.progressIndicator({'mode' : 'hide'});
	 				aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos'});
	 			}
	 			);
	 	} else {
	 		aDeferred.reject({'message' : 'Los campos están vacios','error':'Complete los campos'});
	 	}

	 	return aDeferred.promise();
	 },
	  	//funcion de cargar los campos del select con los nombres de los modulos
	 	/* 	obtiene el id del modulo seleccionado que se encuentra en el value del
	 	 *	option lo envia al action ConnectionExternalFields que devuelve un 
	 	 *	array de los campos con sus datos como nombre de modulo, nombre de 
	 	 *	bloque, nombre de la columna, nombre del campo, tipo de data, tipo de 
	 	 *	dato en la base de datos, etc. 
	 	 */
	 	 loadfields : function() {
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
	 	 }
	 	 ,

	 	 selectOnChange: function() {
	 	 	var thisInstance = this;
	 	 	thisInstance.loadfields().then(
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
	 						var valores = { 0 : fila.fieldid, 1 : fila.fieldlabel.replace(' ', '*')};
	 						if (fila.existe === false) {
	 							table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(valores) +' /></td>';
	 							table = table + '<td style="content-aling: center"></td>';
	 						} else {
	 							table = table + '<td style="content-aling: center"></td>';
	 							table = table + '<td style="content-aling: center"><input type="checkbox" value ='+ JSON.stringify(valores) +' /></td>';
	 						}
	 						table = table + '</tr>';
	 					});
	 					table = table + '</tbody></table>';
	 					var tableWF = '<table class="table"  style="width:100%">';
	 					var tuplas = data['workflows'];
	 					tableWF = tableWF + '<thead><tr><th>WorkFlow</th><th>Importar</th></tr></thead><tbody>';
	 					if(tuplas != null)
	 						tuplas.forEach(function(fila, index) {
	 							tableWF = tableWF + '<tr>';
	 							tableWF = tableWF + '<td style="content-aling: center">'+fila['description']+'</td>';
	 							tableWF = tableWF + '<td style="content-aling: center"><input type="checkbox" value ='+ fila['id'] +' /></td>';
	 							tableWF = tableWF + '</tr>';
	 						});
	 					tableWF = tableWF + '</tbody></table>';
	 					$('#table').empty();
	 					$('#table').attr('style', 'overflow:scroll; height:300px; width:100%;');
	 					$('#table').append(table);
	 					$('#workflow').empty();
	 					$('#workflow').attr('style', 'overflow:scroll; height:300px; width:100%;');
	 					$('#workflow').append(tableWF);
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
	 	 },
	 	/* esta funcion envia los datos obtenidos de cada input en la funcion siguiente
	  	 * creando los campos si no existen, y si existen, sobreescribe los valores del
	  	 * picklist
	  	 */
	  	 enviarCampos: function(fila){
	  	 	var aDeferred = jQuery.Deferred();
	  	 	var progressInstance = jQuery.progressIndicator({
	  	 		'position':'html',
	  	 		'blockInfo' : {
	  	 			'enabled' : true,
	  	 		}
	  	 	});
	  	 	var params = {
	  	 		'module' : 'Vtiger',
	  	 		'parent' : 'Settings',
	  	 		'action' : 'ConnectionExternalImport',
	  	 		'campos' : fila  
	  	 	}
	  	 	AppConnector.request(params).then(
	  	 		function(data) {
	  	 			progressInstance.progressIndicator({'mode' : 'hide'});
	  	 			if(data !== null && data['success'] === true){
	  	 				data = data['result'];
	  	 				if(data['success'] === true){
	  	 					aDeferred.resolve(data);
	  	 				}else{
	  	 					aDeferred.reject(data);
	  	 				}
	  	 			}else{
	  	 				if (data === null) {
	  	 					aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  	 				}
	  	 			}
	  	 		},
	  	 		function(error,err){
	  	 			progressInstance.progressIndicator({'mode' : 'hide'});
	  	 			aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  	 		});
	  	 	return aDeferred.promise();
	  	 },

	  	 enviarWF: function(array){
	  	 	var aDeferred = jQuery.Deferred();
	  	 	var progressInstance = jQuery.progressIndicator({
	  	 		'position':'html',
	  	 		'blockInfo' : {
	  	 			'enabled' : true,
	  	 		}
	  	 	});
	  	 	var params = {
	  	 		'module' : 'Vtiger',
	  	 		'parent' : 'Settings',
	  	 		'action' : 'ConnectionExternalWorkFlows',
	  	 		'dbwfs' : array  
	  	 	}
	  	 	AppConnector.request(params).then(
	  	 		function(data) {
	  	 			progressInstance.progressIndicator({'mode' : 'hide'});
	  	 			if(data !== null && data['success'] === true){
	  	 				data = data['result'];
	  	 				if(data['success'] === true){
	  	 					aDeferred.resolve(data);
	  	 				}else{
	  	 					aDeferred.reject(data);
	  	 				}
	  	 			}else{
	  	 				if (data === null) {
	  	 					aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  	 				} else {
	  	 					aDeferred.reject(data['result']);
	  	 				}
	  	 			}
	  	 		},
	  	 		function(error,err){
	  	 			progressInstance.progressIndicator({'mode' : 'hide'});
	  	 			aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  	 		});
	  	 	return aDeferred.promise();
	  	 },

	  	 enviarTablas: function(tablas){
	  	 	var aDeferred = jQuery.Deferred();
	  	 	var progressInstance = jQuery.progressIndicator({
	  	 		'position':'html',
	  	 		'blockInfo' : {
	  	 			'enabled' : true,
	  	 		}
	  	 	});
	  	 	tablas = JSON.stringify(tablas);
	  	 	var params = {
	  	 		'module': 'Vtiger',
	  	 		'parent': 'Settings',
	  	 		'action': 'ConnectionExternalTables',
	  	 		'tablas': tablas
	  	 	};
	  	 	AppConnector.request(params).then(
	  	 		function(data){
	  	 			progressInstance.progressIndicator({'mode' : 'hide'});
	  	 			if(data !== null && data['success'] === true){
	  	 				data = data['result'];
	  	 				if(data['success'] === true){
	  	 					aDeferred.resolve(data);
	  	 				}else{
	  	 					aDeferred.reject(data);
	  	 				}
	  	 			}else{
	  	 				if (data === null) {
	  	 					aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  	 				} else {
	  	 					aDeferred.reject(data['result']);
	  	 				}
	  	 			}
	  	 		},
	  	 		function(error,err){
	  	 			progressInstance.progressIndicator({'mode' : 'hide'});
	  	 			aDeferred.reject({'message' : 'UPS! sucedió un error interno','error':'Verifique los campos seleccionados'});
	  	 		});

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
	 		var array = new Array();
	 		var arrayCampos = new Array();
	 		$.each(campos, function(index, fila) {	 			
	 			var datosJson = JSON.parse(fila.value);
	 			array[index] = datosJson[0];
	 			arrayCampos[datosJson[0]] = datosJson[1];
	 			fila.checked = false;
	 		});
	 		thisInstance.enviarCampos(array).then(
	 			function(data) {
	 				var params = null;
	 				data = data['data'];
	 				$.each(data,function(index, fila) {
	 					switch(fila.mensaje) {
	 						case 'creacion':
	 						params = {
	 							text: 'Se creó el campo ' + arrayCampos[index].replace('*', ' ')
	 						};
	 						Settings_Vtiger_Index_Js.showMessage(params);
	 						break;
	 						case 'reemplazo':
	 						params = {
	 							text: 'Se sobreescribieron los valores del campo ' + arrayCampos[index].replace('*', ' ')
	 						};
	 						Settings_Vtiger_Index_Js.showMessage(params);
	 						break;
	 						case 'error_cargar_valores':
	 						params = {
	 							title: 'Error:',
	 							text: 'No se obtuvieron los valores del campo ' + arrayCampos[index].replace('*', ' ')
	 						};
	 						Vtiger_Helper_Js.showPnotify(params);
	 						break;
	 						case 'error_consulta':
	 						params = {
	 							title: 'Error:',
	 							text: 'No se obtuvieron los datos del campo ' + arrayCampos[index].replace('*', ' ')
	 						};
	 						Vtiger_Helper_Js.showPnotify(params);
	 						break;
	 					}
	 				});
	 			},
	 			function(error, err) {
	 				Vtiger_Helper_Js.showPnotify({
	 					title: error['message'],
	 					text: error['error']
	 				});
	 			}
	 			);
	 	}else{
	 		Vtiger_Helper_Js.showPnotify({
	 			title: 'No hay campos seleccionados',
	 			text: 'Debe seleccionar campos'
	 		});
	 	}

	 },

	 importWorkFlows: function() {
	 	var thisInstance = this;
	 	var workflows =$('#workflow input:checked');
	 	if (workflows != null && workflows.length > 0) {
	 		var array = new Array();
	 		$.each(workflows, function(index, fila) {
	 			array[index] = fila.value;
	 			fila.checked = false;
	 		});
	 		thisInstance.enviarWF(array).then(
	 			function(data) {
	 				params = {
	 					text: 'Se importaron los workflows'
	 				};
	 				Settings_Vtiger_Index_Js.showMessage(params);	 				
	 			},
	 			function(error, err) {
	 				Vtiger_Helper_Js.showPnotify({
	 					title: error['message'],
	 					text: error['error']
	 				});
	 			}
	 			);

	 	}else{
	 		Vtiger_Helper_Js.showPnotify({
	 			title: 'No hay workflows seleccionados',
	 			text: 'Debe seleccionar workflows'
	 		});
	 	}
	 },

	 importTables: function() {
	 	var thisInstance = this;
	 	var tablas = $('#dbtablas input:checked');
	 	if (tablas != null && tablas.length > 0) {
	 		var array = new Array();
	 		$.each(tablas, function(index, fila) {
	 			var tabla = {};
	 			tabla['nombre'] = fila.value;
	 			if($(fila).hasClass('import')){
	 				tabla['accion'] = 2;
	 			}
	 			else{
	 				if ($(fila).hasClass('creaConDatos')) {
	 					tabla['accion'] = 1;
	 				}else{
	 					tabla['accion'] = 0;
	 				}
	 			}
	 			array[index] = tabla;
	 			fila.checked = false;
	 		});
	 		thisInstance.enviarTablas(array).then(
	 			function(data) {
	 				data = data['data'];
	 				$.each(data, function(index, tabla) {
	 					if(tabla.creacion !=  null)
	 						switch(tabla.creacion){
	 							case 'error_consulta':
	 							params = {
	 								title: 'Error:',
	 								text: 'No se obtuvieron los datos de la tabla ' + index
	 							};
	 							Vtiger_Helper_Js.showPnotify(params);
	 							break;
	 							case 'error_crear':
	 							params = {
	 								title: 'Error:',
	 								text: 'No se creó la tabla ' + index
	 							};
	 							Vtiger_Helper_Js.showPnotify(params);
	 							break;
	 							case 'creada':
	 							params = {
	 								text: 'Se creó la tabla ' + index
	 							};
	 							Settings_Vtiger_Index_Js.showMessage(params);
	 							break;
	 						}
	 						switch(tabla.insercion){
	 							case 'error_consulta':
	 							params = {
	 								title: 'Error:',
	 								text: 'No se obtuvieron los datos de la tabla ' + index
	 							};
	 							Vtiger_Helper_Js.showPnotify(params);
	 							break;
	 							case 'error_insertar':
	 							params = {
	 								title: 'Error:',
	 								text: 'No se insertaron los datos de la tabla ' + index
	 							};
	 							Vtiger_Helper_Js.showPnotify(params);
	 							break;
	 							case 'error_vacio':
	 							params = {
	 								title: 'Error:',
	 								text: 'La tabla ' + index + ' no contiene datos'
	 							};
	 							Vtiger_Helper_Js.showPnotify(params);
	 							break;
	 							case 'insercion':
	 							params = {
	 								text: 'Se importaron los datos de la tabla ' + index
	 							};
	 							Settings_Vtiger_Index_Js.showMessage(params);
	 							break;
	 						}

	 					});
	 			},
	 			function(error, err) {
	 				Vtiger_Helper_Js.showPnotify({
	 					title: error['message'],
	 					text: error['error']
	 				});
	 			}
	 			);
	 	}else{
	 		Vtiger_Helper_Js.showPnotify({
	 			title: 'No hay tablas seleccionadas',
	 			text: 'Debe seleccionar tablas'
	 		});
	 	}

	 },
	 registerEvents: function() {
	 	var thisInstance = this;
	 	$('#prueba').click(thisInstance.prueba);
	 	//selecciona div qe contiene los datos de conexión
	 	var divContent = $('#fields');
	 	//selecciona botones
	 	var editButton = $('#buttonEditBD');
	 	var conectButton = $('#fields').children().next().children().first();
	 	var cancelButton = conectButton.next();
	 	var importButton = $('#buttons').children().first();
	 	var cancelButton2 = importButton.next();
		//deshabilita botones
		conectButton.attr('disabled', true);
		cancelButton.attr('disabled', true);


		// onchange en select si trae cargados los modulos en la vista
	 	/* llama a funcion loadfields
	 	*/
	 	if($('#selectModulesName').children().length > 1){
	 		$('#selectModulesName').change(function(e){
	 			thisInstance.selectOnChange();
	 		});
	 		var check = $('#dbtablas').children();
	 		$.each(check, function(index, fila) {
	 			var opcion1 = $(fila).children().first().next().children().first();
	 			var opcion2 = $(fila).children().first().next().next().children().first();
	 			opcion1.change(function(e) {
	 				if(opcion1.is(':checked') && opcion2.is(':checked'))
	 					opcion2.prop('checked', false); 
	 			});
	 			opcion2.change(function(e) {
	 				if(opcion1.is(':checked') && opcion2.is(':checked'))
	 					opcion1.prop('checked', false); 
	 			});
	 		});

	 	}

		// on click del botón cancelar en la parte superior
		cancelButton.click(function(e) {
			//restaura el style al div table
			$('#table').attr('style', '');
			//vacía el div table
			$('#table').empty();
			//restaura el style al div workflow
			$('#workflow').attr('style', '');
			//vacía el div workflow
			$('#workflow').empty();
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
			var trs = divContent.children().children().first().next().children();
			trs.each(function(index) {
				var td = $( this ).children().first().next().children();
				td.empty();
			});
			//quita el estilo al div tabla
			$('#table').attr('style', '');

		});

		//botón import, realiza la tarea importFields
		importButton.click(function(e) {
			if($("#tablas").hasClass("active")){
				thisInstance.importTables();
			}else{
				if($('#selectModulesName').val() === 'none')
					Vtiger_Helper_Js.showPnotify({
						title: 'Error',
						text: 'Seleccione un módulo'
					});
				else
					if ($("#campos").hasClass("active")) {
						thisInstance.importFields();
					}else{
						thisInstance.importWorkFlows();
					}
				}
			});

		//botón cancelar en la parte inferior, funciona exactamente igual al superior
		cancelButton2.click(function(e) {
			$('#table').attr('style', '');
			$('#workflow').attr('style', '');
			$('#workflow').empty();
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
			//realiza la funcion connectDB
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
						//crea el evento on change
						select.change(function(e) {
							thisInstance.selectOnChange();
						});
						var tablas = data['tablas'];
						$('#dbtablas').empty();
						tablas.forEach(function(tabla, index) {
							if(tabla.existe)
								$('#dbtablas').append('<tr><td>'+tabla.name+'</td><td></td><td></td><td><input class="import" type="checkbox" value="'+tabla.name+'"/></td></tr>');
							else
								$('#dbtablas').append('<tr><td>'+tabla.name+'</td><td><input type="checkbox" value="'+tabla.name+'"/></td><td><input class="creaConDatos" type="checkbox" value="'+tabla.name+'"/></td><td></td></tr>');
						});
						var check = $('#dbtablas').children();
						$.each(check, function(index, fila) {
							var opcion1 = $(fila).children().first().next().children().first();
							var opcion2 = $(fila).children().first().next().next().children().first();
							opcion1.change(function(e) {
								if(opcion1.is(':checked') && opcion2.is(':checked'))
									opcion2.prop('checked', false); 
							});
							opcion2.change(function(e) {
								if(opcion1.is(':checked') && opcion2.is(':checked'))
									opcion1.prop('checked', false); 
							});
						});
						//saca la clase hide del div
						$('#dataDB').removeClass('hide');
						//habilita los botones inferiores
						cancelButton2.attr('disabled', false);
						importButton.attr('disabled', false);
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
			$('#table').attr('style', '');
			$('#workflow').attr('style', '');
			$('#workflow').empty();
			$('#table').empty();
			$('#selectModulesName').empty().append('<option value="none">Seleccionar</option>');
			$('#selectModulesName').off('change');
			$('#dataDB').addClass('hide');
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
				td.empty();
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