<?php
include_once './vtlib/Vtiger/Menu.php';
include_once './vtlib/Vtiger/Module.php';

$moduleAcc = Vtiger_Module::getInstance('Accounts');
$Vtiger_Utils_Log = true;
//verifica que exista el módulo cuentas
if($moduleAcc){
	$block = new Vtiger_Block();
    $block->label = 'LBL_ACC_EJERCICIO_PASANTIA';
    $moduleAcc->addBlock($block);
	//se verifica si existe el campo razón social en el módulo cuentas
	$campoRazonSocial = Vtiger_Field::getInstance('accrsocial', $moduleAcc);
	if (!$campoRazonSocial) {
		$campoRazonSocial = new Vtiger_Field();
		$campoRazonSocial->name = 'accrsocial';
		$campoRazonSocial->label = 'accrsocial';
		$campoRazonSocial->table = $moduleAcc->basetable;
		$campoRazonSocial->column = 'accrsocial';
		$campoRazonSocial->columntype = 'VARCHAR(20)';
		$campoRazonSocial->uitype = 1;
		$campoRazonSocial->typeofdata = 'V~M';
		$campoRazonSocial->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoRazonSocial);
	}
	//se verifica si existe el campo rut en el módulo cuentas
	$campoRut = Vtiger_Field::getInstance('accrut', $moduleAcc);
	if (!$campoRut) {
		$campoRut = new Vtiger_Field();
		$campoRut->name = 'accrut';
		$campoRut->label = 'accrut';
		$campoRut->table = $moduleAcc->basetable;
		$campoRut->column = 'accrut';
		$campoRut->columntype = 'VARCHAR(12)';
		$campoRut->uitype = 1;
		$campoRut->typeofdata = 'N~M';
		$campoRut->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoRut);
	}
	//se verifica si existe el campo tipo de compra en el módulo cuentas
	$campoTipoCompra = Vtiger_Field::getInstance('acctcompra', $moduleAcc);
	if (!$campoTipoCompra) {
		$campoTipoCompra = new Vtiger_Field();
		$campoTipoCompra->name = 'acctcompra';
		$campoTipoCompra->label = 'acctcompra';
		$campoTipoCompra->table = $moduleAcc->basetable;
		$campoTipoCompra->column = 'acctcompra';
		$campoTipoCompra->uitype = 33;
		$campoTipoCompra->columntype = 'VARCHAR(100)';
		$campoTipoCompra->typeofdata = 'V~M';
		$campoTipoCompra->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoTipoCompra);
		// agrega los valores al combo
		$campoTipoCompra->setPicklistValues(array('Compra Anual', 'Compra Semestral', 'Compra de CP') );
	}
	//se verifica si existe el campo tipo de atención en el módulo cuentas
	$campoTipoAtencion = Vtiger_Field::getInstance('acctatencion', $moduleAcc);
	if (!$campoTipoAtencion) {
		$campoTipoAtencion = new Vtiger_Field();
		$campoTipoAtencion->name = 'acctatencion';
		$campoTipoAtencion->label = 'acctatencion';
		$campoTipoAtencion->table = $moduleAcc->basetable;
		$campoTipoAtencion->column = 'acctatencion';
		$campoTipoAtencion->uitype = 33;
		$campoTipoAtencion->columntype = 'VARCHAR(100)';
		$campoTipoAtencion->typeofdata = 'V~M';
		$campoTipoAtencion->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoTipoAtencion);
		// agrega los valores al combo
		$campoTipoAtencion->setPicklistValues(array('Atención directa', 'A través de agencia'));
	}
	$campoIsProveedor = Vtiger_Field::getInstance('accisproveedor', $moduleAcc);
	//se verifica si existe el campo 'es proveedor' en el módulo cuentas
	if (!$campoIsProveedor) {
		$campoIsProveedor = new Vtiger_Field();
		$campoIsProveedor->name = 'accisproveedor';
		$campoIsProveedor->label = 'accisproveedor';
		$campoIsProveedor->table = $moduleAcc->basetable;
		$campoIsProveedor->column = 'accisproveedor';
		$campoIsProveedor->columntype = 'BIT(1)';
		$campoIsProveedor->uitype = 56;
		$campoIsProveedor->typeofdata = 'C~O';
		$campoIsProveedor->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoIsProveedor);
	}
	$campoTipoContacto = Vtiger_Field::getInstance('accmcontacto', $moduleAcc);
	//se verifica si existe el campo modo de contacto en el módulo cuentas
	if (!$campoTipoContacto) {
		$campoTipoContacto = new Vtiger_Field();
		$campoTipoContacto->name = 'accmcontacto';
		$campoTipoContacto->label = 'accmcontacto';
		$campoTipoContacto->table = $moduleAcc->basetable;
		$campoTipoContacto->column = 'accmcontacto';
		$campoTipoContacto->uitype = 15;
		$campoTipoContacto->columntype = 'VARCHAR(100)';
		$campoTipoContacto->typeofdata = 'V~M';
		$campoTipoContacto->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoTipoContacto);
		// agrega los valores al combo
		$campoTipoContacto->setPicklistValues(array('Gestión proactiva', 'Referido', 'Intermediario', 'Espontáneo Cliente', 'Otro'));
	}
	$campoMCOtro = Vtiger_Field::getInstance('accmcotro', $moduleAcc);
	if (!$campoMCOtro) {
		$campoMCOtro = new Vtiger_Field();
		$campoMCOtro->name = 'accmcotro';
		$campoMCOtro->label = 'accmcotro';
		$campoMCOtro->table = $moduleAcc->basetable;
		$campoMCOtro->column = 'accmcotro';
		$campoMCOtro->columntype = 'TEXT';
		$campoMCOtro->uitype = 1;
		$campoMCOtro->typeofdata = 'V~O';
		$campoMCOtro->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoMCOtro);
	}
	$campoMCReferido = Vtiger_Field::getInstance('accmcreferido', $moduleAcc);
	if (!$campoMCReferido) {
		$campoMCReferido = new Vtiger_Field();
		$campoMCReferido->name = 'accmcreferido';
		$campoMCReferido->label = 'accmcreferido';
		$campoMCReferido->table = $moduleAcc->basetable;
		$campoMCReferido->column = 'accmcreferido';
		$campoMCReferido->columntype = 'VARCHAR(75)';
		$campoMCReferido->uitype = 1;
		$campoMCReferido->typeofdata = 'V~O';
		$campoMCReferido->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoMCReferido);
	}
	$campoMCReferido = Vtiger_Field::getInstance('accmccombo', $moduleAcc);
	if (!$campoMCCombo) {
		$campoMCCombo = new Vtiger_Field();
		$campoMCCombo->name = 'accmccombo';
		$campoMCCombo->label = 'accmccombo';
		$campoMCCombo->table = $moduleAcc->basetable;
		$campoMCCombo->column = 'accmccombo';
		$campoMCCombo->uitype = 15;
		$campoMCCombo->columntype = 'VARCHAR(100)';
		$campoMCCombo->typeofdata = 'V~O';
		$campoMCCombo->displaytype = 1;
		// incluyo el campo en el bloque
		$block->addField($campoMCCombo);
		$campoMCCombo->setPicklistValues(array('Nuestra Empresa', 'Otra Empresa', 'Marketing', 'Administración', 'Ventas', 'RRHH') );
	}






	$block1 = new Vtiger_Block();
    $block1->label = 'LBL_ACC_EJERCICIO_PASANTIA_REDESSOCIALES';
    $moduleAcc->addBlock($block1);
    $campoRSocialTwitter = Vtiger_Field::getInstance('accredsocialtwitter', $moduleAcc);
	if (!$campoRSocialTwitter) {
		$campoRSocialTwitter = new Vtiger_Field();
		$campoRSocialTwitter->name = 'accredsocialtwitter';
		$campoRSocialTwitter->label = 'accredsocialtwitter';
		$campoRSocialTwitter->table = $moduleAcc->basetable;
		$campoRSocialTwitter->column = 'accredsocialtwitter';
		$campoRSocialTwitter->columntype = 'VARCHAR(50)';
		$campoRSocialTwitter->uitype = 1;
		$campoRSocialTwitter->typeofdata = 'V~O';
		$campoRSocialTwitter->displaytype = 1;
		// incluyo el campo en el bloque
		$block1->addField($campoRSocialTwitter);
	}
	$campoRSocialFacebook = Vtiger_Field::getInstance('accredsocialfacebook', $moduleAcc);
	if (!$campoRSocialFacebook) {
		$campoRSocialFacebook = new Vtiger_Field();
		$campoRSocialFacebook->name = 'accredsocialfacebook';
		$campoRSocialFacebook->label = 'accredsocialfacebook';
		$campoRSocialFacebook->table = $moduleAcc->basetable;
		$campoRSocialFacebook->column = 'accredsocialfacebook';
		$campoRSocialFacebook->columntype = 'VARCHAR(100)';
		$campoRSocialFacebook->uitype = 1;
		$campoRSocialFacebook->typeofdata = 'V~O';
		$campoRSocialFacebook->displaytype = 1;
		// incluyo el campo en el bloque
		$block1->addField($campoRSocialFacebook);
	}
	$campoRSocialInstagram = Vtiger_Field::getInstance('accredsocialinstagram', $moduleAcc);
	if (!$campoRSocialInstagram) {
		$campoRSocialInstagram = new Vtiger_Field();
		$campoRSocialInstagram->name = 'accredsocialinstagram';
		$campoRSocialInstagram->label = 'accredsocialinstagram';
		$campoRSocialInstagram->table = $moduleAcc->basetable;
		$campoRSocialInstagram->column = 'accredsocialinstagram';
		$campoRSocialInstagram->columntype = 'VARCHAR(50)';
		$campoRSocialInstagram->uitype = 1;
		$campoRSocialInstagram->typeofdata = 'V~O';
		$campoRSocialInstagram->displaytype = 1;
		// incluyo el campo en el bloque
		$block1->addField($campoRSocialInstagram);
	}
	$campoRSocialLinkedin = Vtiger_Field::getInstance('accredsociallinkedin', $moduleAcc);
	if (!$campoRSocialLinkedin) {
		$campoRSocialLinkedin = new Vtiger_Field();
		$campoRSocialLinkedin->name = 'accredsociallinkedin';
		$campoRSocialLinkedin->label = 'accredsociallinkedin';
		$campoRSocialLinkedin->table = $moduleAcc->basetable;
		$campoRSocialLinkedin->column = 'accredsociallinkedin';
		$campoRSocialLinkedin->columntype = 'VARCHAR(50)';
		$campoRSocialLinkedin->uitype = 1;
		$campoRSocialLinkedin->typeofdata = 'V~O';
		$campoRSocialLinkedin->displaytype = 1;
		// incluyo el campo en el bloque
		$block1->addField($campoRSocialLinkedin);
	}


	echo "Listo";

}


?>