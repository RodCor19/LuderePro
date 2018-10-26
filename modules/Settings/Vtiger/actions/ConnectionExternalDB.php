<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalDB_Action extends Settings_Vtiger_Basic_Action {
	public function process(Vtiger_Request $request) {
        $host = $request->get('dbhost');
        $database = $request->get('dbdatabase');
        $user = $request->get('dbuser');
        $password = $request->get('dbpassword');
        $error = '';
        $message = '';
        $tuplas = null;

        static $conexion = null;
        if (null == $conexion) {
            
            if (!$conexion = new mysqli($host, $user, $password, $database)) {
            	$error = $conexion->connect_error;
            	$conexion = null;
            } else {
        		$data = null;
				if($result = $conexion->query('SELECT * FROM vtiger_account')){
        			while ($fila = $result->fetch_object()) {
        				$data[] = $fila;
        			}
        			$tuplas = $data;
				}else{
					$error = $conexion->error;
					$conexion = null;
				}
            }
            	          
        }
        

        
		$responce = new Vtiger_Response();
        if($conexion !== null){
        	$responce->setResult(array('success'=>true, 'data'=> $tuplas));
        	mysqli_close($conexion);
        }else{
        	$responce->setResult(array('success'=>false, 'message'=> "No se puede conectar con el servidor", 'error' => $error));
        }
        $responce->emit();
    }

    public function validateRequest(Vtiger_Request $request) { 
        $request->validateWriteAccess(); 
    }
}
?>