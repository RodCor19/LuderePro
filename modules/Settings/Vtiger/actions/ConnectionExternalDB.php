<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalDB_Action extends Settings_Vtiger_Basic_Action {
	public function process(Vtiger_Request $request) {
        $host = $request->get('dbhost');
        $database = $request->get('dbdatabase');
        $user = $request->get('dbuser');
        $password = $request->get('dbpassword');

        static $conexion = null;
        if (null === $conexion) {
             $conexion = new mysqli($host, $user, $password, $database) or die ("No se puede conectar con el servidor");
        }

        
		$responce = new Vtiger_Response();
        if(null !== $conexion){
        	$responce->setResult(array('success'=>true, 'data'=> ''));
        }else{
        	$responce->setResult(array('success'=>false, 'message'=> "No se puede conectar con el servidor"));
        }
        $responce->emit();
    }

    public function validateRequest(Vtiger_Request $request) { 
        $request->validateWriteAccess(); 
    } 
}
?>