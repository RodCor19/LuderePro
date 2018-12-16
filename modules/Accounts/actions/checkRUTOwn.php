<?php
class Accounts_CheckRUTOwn_Action extends Vtiger_Action_Controller {

	function checkPermission(Vtiger_Request $request) {
		return;
	}

	public function process(Vtiger_Request $request) {
		require_once 'libraries/nusoap/nusoap.php';
		$error = null;
		$result = array();
		$accountrut = $request->get('rut');
		$client = new soapclient2('http://localhost/LuderePro/wsDataCliente.php?wsdl', true);
		$err = $client->getError();
		if ($err){
			$error = $err;
		}
		else{
			$resultado = $client->call('dataCuenta', array('rut' => $accountrut));
			if ($client->fault) {
				$error = 'Fallo consulta ws';
			} else {
				$err = $client->getError();
				if ($err) {
					$error = 'Error' . $err ;
				} else {
					$result['success'] = true;
					$result['data'] = $resultado;
				}
			}
		}
		if($error != null){
			$result['success'] = false;
			$result['error'] = $error;
		}
		$response = new Vtiger_Response();
		$response->setResult($result);
		$response->emit();
	}
}
