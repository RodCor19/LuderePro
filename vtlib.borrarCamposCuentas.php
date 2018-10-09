<?php
include_once './vtlib/Vtiger/Menu.php';
include_once './vtlib/Vtiger/Module.php';

$moduleAcc = Vtiger_Module::getInstance('Accounts');
$Vtiger_Utils_Log = true;
if($moduleAcc != null){
	$campo = Vtiger_Field::getInstance('accrsocial', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accrut', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('acctcompra', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('acctatencion', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accisproveedor', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accmcontacto', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accmcotro', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accredsocialtwitter', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accredsocialfacebook', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accredsocialinstagram', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accredsociallinkedin', $moduleAcc);
	$campo->delete();
	$campo = Vtiger_Field::getInstance('accmcreferido', $moduleAcc);
	$campo->delete();	
	$campo = Vtiger_Field::getInstance('accmccombo', $moduleAcc);
	$campo->delete();
}


?>