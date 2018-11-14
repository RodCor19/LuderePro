<?php
class Settings_Vtiger_ConnectionExternalWorkFlows_Action extends Settings_Vtiger_Basic_Action {
	
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		$datos = parse_ini_file('dataBaseExports.ini');
		$host = $datos['host'];
		$database = $datos['database'];
		$user = $datos['user'];
		$password = $datos['password'];
		//toma los ids modulo desde el request
		$ids = $request->get('dbwfs');
		system('echo '.implode(",", $ids).' > hola.txt');
		//variables inicializadas
		$error = '';
		$message = '';
		$tuplas = null;
		$wfs = array();
		//realiza conexión
		$conexion = PearDatabase::getInstance();
		$conexion->resetSettings('mysqli', $host, $database, $user, $password);
		$conexion->connect();
		if ($conexion->database->_errorMsg) {
			$error = 'Error : '.$conexion->database->_errorMsg;
			$conexion = null;
		} else {
			global $adb;
			vimport('~~modules/com_vtiger_workflow/VTWorkflowManager.inc');
			vimport('~~modules/com_vtiger_workflow/VTTaskManager.inc');
			$wfm = new VTWorkflowManager($adb);
			$tm = new VTTaskManager($adb);
			foreach ($ids as $key => $value) {
				$wf = $wfm->retrieve($value);
				$wf->tasks = $tm->getTasksForWorkflow($value);
				$wfs[$key] = $wf;
			}
			$conexion->resetSettings();
			$conexion->connect();
			foreach ($wfs as $wf) {
				$wf->id = null;
				$wfm->save($wf);
				foreach ($wf->tasks as $task) {
					$task->id = null;
					$task->workflowId = $wf->id;
					$tm->saveTask($task);
				}
			}			
		}

		if($conexion != null){
			$responce->setResult(array('success'=>true, 'wfs' => $wfs));
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