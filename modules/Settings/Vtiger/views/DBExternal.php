<?php

/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.1
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/

class Settings_Vtiger_DBExternal_View extends Settings_Vtiger_Index_View {

	public function process(Vtiger_Request $request) {        
		$qualifiedModuleName = $request->getModule(false);
		$datos = null;
		$tablas = null;
		$dbdatos = null;
		if(file_exists('dataBaseExports.ini')){
			$dbdatos = parse_ini_file('dataBaseExports.ini');
			$host = $dbdatos['host'];
			$database = $dbdatos['database'];
			$user = $dbdatos['user'];
			$password = $dbdatos['password'];
			$conexion = PearDatabase::getInstance();
			$conexion->resetSettings('mysqli', $host, $database, $user, $password);
			$conexion->connect();
			if ($conexion->database->_errorMsg){
				$conexion->resetSettings();
				$conexion->connect();
			} else {
				$result	= $conexion->pquery('SELECT tabid, name FROM vtiger_tab WHERE presence in (0, 2);');
				if(!$result){
					$conexion = null;
				}else{
					foreach ($result as $dato) {
						$dato['name'] = vtranslate($dato['name']);
						$datos[] = $dato;
					}
				}
				$consulta = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND NOT TABLE_NAME LIKE 'com_vtiger%' AND NOT TABLE_NAME LIKE 'vtiger%'";
				$result	= $conexion->pquery($consulta, array($database));
				if(!$result){
					$error = 'Error: falló la consulta';
					$conexion = null;
				}else{
					foreach ($result as $dato) {
						$tabla = null;
						$tabla['name'] = $dato['TABLE_NAME'];
						$tablas[] = $tabla;
					}
				}
				$conexion->resetSettings();
				$conexion->connect();
			}
		}
		$viewer = $this->getViewer($request);
		$viewer->assign('datos', $datos);
		$viewer->assign('tablas', $tablas);
		$viewer->assign('dbdatos', $dbdatos);
		$viewer->view('DBExternal.tpl',$qualifiedModuleName);
	}
	
	function getPageTitle(Vtiger_Request $request) {
		$qualifiedModuleName = $request->getModule(false);
		return vtranslate('LBL_DBExternal',$qualifiedModuleName);
	}
	
	/**
	 * Function to get the list of Script models to be included
	 * @param Vtiger_Request $request
	 * @return <Array> - List of Vtiger_JsScript_Model instances
	 */
	function getHeaderScripts(Vtiger_Request $request) {
		$headerScriptInstances = parent::getHeaderScripts($request);
		$moduleName = $request->getModule();

		$jsFileNames = array(
			"modules.Settings.$moduleName.resources.DBExternal"
		);

		$jsScriptInstances = $this->checkAndConvertJsScripts($jsFileNames);
		$headerScriptInstances = array_merge($headerScriptInstances, $jsScriptInstances);
		return $headerScriptInstances;
	}
	/*
	public function getHeaderCss(Vtiger_Request $request) {
 		$headerCssInstances = array();
  		$cssFileNames = array(
 			'~/layouts/vlayout/modules/Settings/Vtiger/DBExternal.css',
  		);
  		$cssInstances = $this->checkAndConvertCssStyles($cssFileNames);
 		$headerCssInstances = array_merge($headerCssInstances, $cssInstances);
 		return $headerCssInstances;
 	}*/
 }