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
        $data = null;

        static $conexion = null;
        if (null === $conexion) {
            
            if (!$conexion = new mysqli($host, $user, $password, $database)) {
            	$error = $conexion->connect_error;
            	$conexion = null;
            } else {
				$result = $conexion->query('SELECT * FROM vtiger_account');
				for ($i=0; $i < $result->num_rows; $i++) { 
					$data[]= json_encode($result->fetch_object());
				}
				 
            }
            	          
        }
        

        
		$responce = new Vtiger_Response();
        if($conexion !== null){
        	$responce->setResult(array('success'=>true, 'data'=> $data));

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