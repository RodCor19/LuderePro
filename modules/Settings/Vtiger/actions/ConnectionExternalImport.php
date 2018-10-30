<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalImport_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		$tupla = $request->get('tupla');
		$datos = parse_ini_file('dataBaseExports.ini');
		$host = $datos['host'];
		$database = $datos['database'];
		$user = $datos['user'];
		$password = $datos['password'];
		$error = '';
		$message = '';
		$lograda = false;
		$tuplas = null;
		$conexion = new mysqli($host, $user, $password, $database);
		if (mysqli_connect_errno()){
			$error = 'Error : '.mysqli_connect_error();
			$conexion = null;
			die();
		} else {
			$consulta = "SELECT distinct ".$tupla['fieldname']." FROM vtiger_".$tupla['fieldname'];
			$stmt = $conexion->prepare($consulta);
			if($stmt->execute()){
				if (mysqli_stmt_error($stmt)) {
					$error = 'Error : '.mysqli_stmt_error($stmt);
					$conexion = null;
				}else{
					if($result = $stmt->get_result()){
						if ($result->num_rows > 0) {
							while ($fila = $result->fetch_object()) {
								$tuplas[] = $fila->$tupla['fieldname'];
							}
							$module = Vtiger_Module::getInstance($tupla['name']);
							if($module){
								$nombreBloque = $tupla['blocklabel'];
								$blockInstance = Vtiger_Block::getInstance($nombreBloque, $module);

								if(!$blockInstance){
									$blockInstance = new Vtiger_Block();
									$blockInstance->label = $tupla['blocklabel'];
									$module->addBlock($blockInstance);
								}
														//se verifica si existe el campo
								$campo = Vtiger_Field::getInstance($tupla['fieldname'], $module);
								if (!$campo) {
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
									$lograda = true;
								}
							}
						}else{
							$conexion = null;
							$error = 'Intente con otro campo';
							$message = 'Hubo un error al cargar los valores del campo';
						}
					}
				}
			}

		}
		if($conexion != null){
			$responce->setResult(array('success'=>true, 'data'=> $tuplas, 'creacion' =>$lograda));
		}else{
			if($message == '')
				$responce->setResult(array('success'=>false, 'message'=> "No se puede conectar con el servidor", 'error' => $error));
			else
				$responce->setResult(array('success'=>false, 'message'=> $message, 'error' => $error));
		}
		$responce->emit();
	}

	public function validateRequest(Vtiger_Request $request) { 
		$request->validateWriteAccess(); 
	}
}
?>