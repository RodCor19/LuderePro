<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalImport_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		//obtiene los datos del campo
		$ids = $request->get('campos');
		//carga los datos de la conexión a partir del archivo
		$datos = parse_ini_file('dataBaseExports.ini');
		//obtiene los parametros
		$host = $datos['host'];
		$database = $datos['database'];
		$user = $datos['user'];
		$password = $datos['password'];
		//variables inicializadas
		$error = '';
		$message = '';
		$resultados = null;
		//conexión
		$conexion = PearDatabase::getInstance();
		$conexion->resetSettings('mysqli', $host, $database, $user, $password);
		$conexion->connect();
		//verificar si hay error
		if ($conexion->database->_errorMsg){
			//enviar error
			$error = 'Error : '.$conexion->database->_errorMsg;
			$conexion = null;
			die();
		} else {
			foreach ($ids as $field) {
				$conexion->resetSettings('mysqli', $host, $database, $user, $password);
				$conexion->connect();
				/*
					realiza consulta que trae nombre de 
					name => nombre de modulo,
					columnname => nombre de la columna en la tabla del modulo,
					uitype => uitype del campo
					fieldname => nombre del campo
					fieldlabel => label del campo
					typeofdata => tipo de dato, ej. 'V~O'
					displaytype => displaytype del campo
					blocklabel => label del bloque
					tipo => tipo de dato en la bd, ej VARCHAR
					tamanio => es el tamaño del dato en bd, lo que está dentro de los parentesis, ej VARCHAR(10), 10

					hace un join entre las tablas vtiger_field y vtiger_blocks por medio 
					de blockid
					hace un join entre las tablas vtiger_field y vtiger_tab por medio de 
					tabid
					solo selecciona los campos con uitype 15, 16, 33
				*/
				$consulta = 'SELECT name, columnname, uitype, fieldname, fieldlabel, typeofdata, displaytype, blocklabel, (SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME = vtiger_field.columnname and table_name = vtiger_field.tablename and table_schema = ?) as tipo, (SELECT CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME = vtiger_field.columnname and table_name = vtiger_field.tablename and table_schema = ?) as tamanio FROM vtiger_field, vtiger_blocks, vtiger_tab where vtiger_field.block = vtiger_blocks.blockid and vtiger_field.tabid = vtiger_tab.tabid and vtiger_field.fieldid = ?';
				$result	= $conexion->pquery($consulta, array($database, $database, $field));
				if(!$result || $conexion->num_rows($result) == 0){
					$resultados[$field] = array('mensaje' => 'error_consulta');
				}else{
					$tupla = $result->fields;
					//realizar consulta por los valores del picklist
					$consulta = "SELECT distinct ".$tupla['fieldname']." FROM vtiger_".$tupla['fieldname'];
					//realiza consulta
					$result = $conexion->pquery($consulta);
					
					//if error en la consulta
					if(!$result){
						$resultados[$field] = array('mensaje' => 'error_cargar_valores');
					}else{
						$tuplas = null;
						// hay mas de 0 resultados
						if ($conexion->num_rows($result) > 0) {
							//por cada fila guarda el valor
							foreach ($result as $dato) {
								$tuplas[] = $dato[0];
							}
							$conexion->resetSettings();
							$conexion->connect();
							//busca el modulo
							$module = Vtiger_Module::getInstance($tupla['name']);
							//si existe
							if($module){
								//busca el bloque
								$nombreBloque = $tupla['blocklabel'];
								$blockInstance = Vtiger_Block::getInstance($nombreBloque, $module);
								//si no está lo crea
								if(!$blockInstance){
									$blockInstance = new Vtiger_Block();
									$blockInstance->label = $tupla['blocklabel'];
									$module->addBlock($blockInstance);
								}
										//se verifica si existe el campo
								$campo = Vtiger_Field::getInstance($tupla['fieldname'], $module);
								if (!$campo) {
											//no existe y lo crea
									$campo = new Vtiger_Field();
									$campo->name = $tupla['fieldname'];
									$campo->label = $tupla['fieldlabel'];
									$campo->table = $module->basetable;
									$campo->column = $tupla['columnname'];
									$campo->columntype = strtoupper($tupla['tipo']).'('.$tupla['tamanio'].')';
									$campo->uitype = $tupla['uitype'];
									$campo->typeofdata = $tupla['typeofdata'];
									$campo->displaytype = $tupla['displaytype'];
									// incluyo el campo en el bloque
									$blockInstance->addField($campo);
									$campo->setPicklistValues($tuplas);
									$resultados[$field] = array('mensaje' => 'creacion');
								}else{
									$conexion->resetSettings();
									$conexion->connect();
									global $adb;
									$consulta = "DELETE FROM vtiger_".$campo->name;
									//borra los valores de antes
									$conexion->pquery($consulta);
									//agrega los campos nuevos
									$campo->setPicklistValues($tuplas);
									$resultados[$field] = array('mensaje' => 'reemplazo');
								}
							}
						}else{
							$resultados[$campo] = array('mensaje' => 'error_cargar_valores');
						}
					}
				}
			}
		}
		if($conexion != null){
			$responce->setResult(array('success'=>true, 'data'=> $resultados));
		}else{
			if($message == '')
				$responce->setResult(array('success'=>false, 'message'=> "No se puede conectar con el servidor", 'error' => $error));
			else
				$responce->setResult(array('success'=>false, 'message'=> $message, 'error' => $error));
			$conexion = PearDatabase::getInstance();
		}
		$conexion->resetSettings();
		$conexion->connect();
		
		$responce->emit();
	}

	public function validateRequest(Vtiger_Request $request) { 
		$request->validateWriteAccess(); 
	}
}
?>