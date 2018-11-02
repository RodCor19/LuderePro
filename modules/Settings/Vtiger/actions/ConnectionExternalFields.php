<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalFields_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		//toma los datos para la conexión desde el archivo
		$datos = parse_ini_file('dataBaseExports.ini');
		//toma los datos del array datos
		$host = $datos['host'];
		$database = $datos['database'];
		$user = $datos['user'];
		$password = $datos['password'];
		//toma el id del modulo desde el request
		$idModulo = $request->get('dbmoduloid');
		//variables inicializadas
		$error = '';
		$message = '';
		$tuplas = null;
		//realiza conexión
		$conexion = PearDatabase::getInstance();
		$conexion->resetSettings('mysqli', $host, $database, $user, $password);
		$conexion->connect();
		if ($conexion->database->_errorMsg){
			$error = 'Error : '.$conexion->database->_errorMsg;
			$conexion = null;
		} else {
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
			$consulta = 'SELECT name, columnname, uitype, fieldname, fieldlabel, typeofdata, displaytype, blocklabel, (SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME = vtiger_field.columnname and table_name = vtiger_field.tablename and table_schema = ?) as tipo, (SELECT CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME = vtiger_field.columnname and table_name = vtiger_field.tablename and table_schema = ?) as tamanio FROM vtiger_field, vtiger_blocks, vtiger_tab where vtiger_field.block = vtiger_blocks.blockid and vtiger_field.uitype in ("15", "16", "33") and vtiger_field.tabid = ? and vtiger_field.tabid = vtiger_tab.tabid;';
			$result	= $conexion->pquery($consulta, array($database, $database, $idModulo));
			if(!$result){
				$error = 'Error : Fallo la consulta';
				$conexion = null;
			}else{
				foreach ($result as $dato) {
					$tuplas[] = $dato;
				}
			}
		}
		if($conexion != null){
			$responce->setResult(array('success'=>true, 'data'=> $tuplas));
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