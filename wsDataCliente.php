<?php

  require_once('include/database/PearDatabase.php');
  require_once('libraries/nusoap/nusoap.php'); 

  $server = new soap_server(); 
  $server->soap_defencoding = 'UTF-8'; 
  $server->decode_utf8 = false;

  /* busca la cuenta que corresponda al rut o la última ingresada */
  function dataCuenta($rut = ''){
    $result = null;
    $conexion = PearDatabase::getInstance();
    if (rut != '') {
      $sql = "SELECT * FROM `vtiger_account` WHERE `siccode` = ?";
      $result = $conexion->pquery($sql, array($rut));    
    }else{
      $sql = "SELECT * FROM `vtiger_account` ORDER BY `accountid` DESC LIMIT 1";
      $result = $conexion->pquery($sql);
    }
    if($conexion->num_rows($result) == 1){
      $data = $result->fields;
      //return json_encode($data);
      return $data['accountname'];
    }else{
      return '';
    }
  }

  $server->configureWSDL('cuenta', 'urn:cuenta');
  /*
  $server->wsdl->addComplexType(
        'cuenta',
        'complexType',
        'struct',
        'all',
        '',
        array("accountid" => array("name" => "accountid", "type" => "xsd:int"),
              "account_no" => array("name" => "account_no", "type" => "xsd:string"),
              "accountname" => array("name" => "accountname", "type" => "xsd:string"),
              "parentid" => array("name" => "parentid", "type" => "xsd:int"),              
              "account_type" => array("name" => "account_type", "type" => "xsd:string"),
              "industry" => array("name" => "industry", "type" => "xsd:string"),             
              "annualrevenue" => array('name' => 'annualrevenue', 'type' => 'xsd:float'),              
              "rating" => array("name" => "rating", "type" => "xsd:string"),
              "ownership" => array("name" => "ownership", "type" => "xsd:string"),
              "ssicode" => array("name" => "ssicode", "type" => "xsd:string"),
              "tickersymbol" => array("name" => "tickersymbol", "type" => "xsd:string"),
              "phone" => array("name" => "phone", "type" => "xsd:string"),
              "otherphone" => array("name" => "otherphone", "type" => "xsd:string"),
              "email1" => array("name" => "email1", "type" => "xsd:string"),
              "email2" => array("name" => "email2", "type" => "xsd:string"),
              "website" => array("name" => "website", "type" => "xsd:string"),
              "fax" => array("name" => "fax", "type" => "xsd:string"),
              "employees" => array("name" => "employees", "type" => "xsd:int"),
              "emailoptout" => array("name" => "emailoptout", "type" => "xsd:string"),
              "notify_owner" => array("name" => "notify_owner", "type" => "xsd:string"),
              "isconvertedfromlead" => array("name" => "isconvertedfromlead", "type" => "xsd:int")
        )
  );*/



  $server->register('dataCuenta',
    array("rut" => "xsd:string"),
    array("nombre" => "xsd:string"),
    "urn:cuenta",
    "urn:cuenta#dataCuenta",
    "rpc",
    "encoded",
    "Solicitar nombre de ultima cuenta o la correspondiente a un rut");

  $server->service($HTTP_RAW_POST_DATA);
  ?>