<?php
/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

class Accounts_CheckDuplicateRut_Action extends Vtiger_Action_Controller {

	function checkPermission(Vtiger_Request $request) {
		return;
	}

	public function process(Vtiger_Request $request) {
		$moduleName = $request->getModule();
		$accountRut = $request->get('accountrut');
		$record = $request->get('record');
		global $adb;

		$consulta = "SELECT siccode FROM vtiger_account INNER JOIN vtiger_crmentity ON crmid=accountid WHERE siccode ='".$accountRut."' AND deleted=0  AND accountid<>'".$record."' ";
		$query = $adb->query($consulta);

		if ($adb->num_rows($query) == 0){
			$result = array('success'=>false);
		} else {
			$result = array('success'=>true, 'message'=>vtranslate('LBL_DUPLICATESRUT_EXIST',$moduleName));
		}

		$response = new Vtiger_Response();
		$response->setResult($result);
		$response->emit();
	}
}
