<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalFields_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		//toma los datos para la conexión desde el archivo
		$datos = parse_ini_file('dataBaseExports.ini');
		$workflows = null;
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
			//obtener el nombre del modulo
			$consulta = 'SELECT name FROM vtiger_tab WHERE vtiger_tab.tabid = ?';
			$result	= $conexion->pquery($consulta, array($idModulo));
			$modulo = $result->fields[0];
			vimport('~~modules/com_vtiger_workflow/VTWorkflowManager.inc');
			$wfm = new VTWorkflowManager($conexion);
			$workflows = $wfm->getWorkflowsForModule($modulo);

			/*

				realiza consulta que trae nombre de
				fieldid => id del campo
				uitype => uitype del campo
				fieldname => nombre del campo
				fieldlabel => label del campo

				solo selecciona los campos con uitype 15, 16, 33
			*/
			$consulta = 'SELECT fieldid, uitype, fieldname, fieldlabel FROM vtiger_field where vtiger_field.uitype in ("15", "16", "33") and vtiger_field.tabid = ?';
			$result	= $conexion->pquery($consulta, array($idModulo));
			if(!$result){
				$error = 'Error : Fallo la consulta';
				$conexion = null;
			}else{
				$conexion->resetSettings();
				$conexion->connect();
				foreach ($result as $dato) {
					$module = Vtiger_Module::getInstance($modulo);
					if (!$module) {
						$dato['existe'] = false;
					}else{
						$campo = Vtiger_Field::getInstance($dato['fieldname'], $module);
						if(!$campo){
							$dato['existe'] = false;
						}else{
							$dato['existe'] = true;
						}
					}
					$tuplas[] = $dato;
				}
			}
		}
		if($conexion != null){
			$responce->setResult(array('success'=>true, 'data'=> $tuplas, 'workflows' => $workflows));
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