<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalImport_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		//obtiene los datos del campo
		$tupla = $request->get('tupla');
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
		$lograda = false;
		$reemplazo = false;
		$tuplas = null;
		//conexión
		$conexion = new mysqli($host, $user, $password, $database);
		//verificar si hay error
		if (mysqli_connect_errno()){
			//enviar error
			$error = 'Error : '.mysqli_connect_error();
			$conexion = null;
			die();
		} else {
			//realizar consulta por los valores del picklist
			$consulta = "SELECT distinct ".$tupla['fieldname']." FROM vtiger_".$tupla['fieldname'];
			//realiza consulta
			$stmt = $conexion->prepare($consulta);
			//Ejecuta consulta
			if($stmt->execute()){
				//if error en la consulta
				if (mysqli_stmt_error($stmt)) {
					$error = 'Error : '.mysqli_stmt_error($stmt);
					$conexion = null;
				}else{
					if($result = $stmt->get_result()){
						// hay mas de 0 resultados
						if ($result->num_rows > 0) {
							//por cada fila guarda el valor
							while ($fila = $result->fetch_object()) {
								$tuplas[] = $fila->$tupla['fieldname'];
							}
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
									$lograda = true;
								}else{
									//existe
									global $adb;
									$consulta = "DELETE FROM vtiger_".$campo->name;
									//borra los valores de antes
									$query = $adb->query($consulta);
									//agrega los campos nuevos
									$campo->setPicklistValues($tuplas);
									$reemplazo = true;
								}
							}
						}else{
							//no hay resultados
							$conexion = null;
							$error = 'Intente con otro campo';
							$message = 'Hubo un error al cargar los valores del campo';
						}
					}
				}
			}

		}
		if($conexion != null){
			$responce->setResult(array('success'=>true, 'data'=> $tuplas, 'creacion' =>$lograda, 'reescritura' => $reemplazo));
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