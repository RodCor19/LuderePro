<?php /* Smarty version Smarty-3.1.7, created on 2018-10-17 16:58:41
         compiled from "D:\xampp2\htdocs\LuderePro\includes\runtime/../../layouts/vlayout\modules\Vtiger\uitypes\Url.tpl" */ ?>
<?php /*%%SmartyHeaderCode:277975bb857d2a11ed5-43107080%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c12aac5ba4c0c12bb02ef61a81903f3613d0fe70' => 
    array (
      0 => 'D:\\xampp2\\htdocs\\LuderePro\\includes\\runtime/../../layouts/vlayout\\modules\\Vtiger\\uitypes\\Url.tpl',
      1 => 1539791882,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '277975bb857d2a11ed5-43107080',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_5bb857d2a6e7d',
  'variables' => 
  array (
    'FIELD_MODEL' => 0,
    'MODULE' => 0,
    'FIELD_INFO' => 0,
    'SPECIAL_VALIDATOR' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5bb857d2a6e7d')) {function content_5bb857d2a6e7d($_smarty_tpl) {?>
<?php $_smarty_tpl->tpl_vars["FIELD_INFO"] = new Smarty_variable(Vtiger_Util_Helper::toSafeHTML(Zend_Json::encode($_smarty_tpl->tpl_vars['FIELD_MODEL']->value->getFieldInfo())), null, 0);?><?php $_smarty_tpl->tpl_vars["SPECIAL_VALIDATOR"] = new Smarty_variable($_smarty_tpl->tpl_vars['FIELD_MODEL']->value->getValidator(), null, 0);?><input id="<?php echo $_smarty_tpl->tpl_vars['MODULE']->value;?>
_editView_fieldName_<?php echo $_smarty_tpl->tpl_vars['FIELD_MODEL']->value->get('name');?>
" type="text" class="input-large validate[custom[url]]" name="<?php echo $_smarty_tpl->tpl_vars['FIELD_MODEL']->value->getFieldName();?>
" data-validation-engine="validate[<?php if ($_smarty_tpl->tpl_vars['FIELD_MODEL']->value->isMandatory()==true){?> required,<?php }?>funcCall[Vtiger_Base_Validator_Js.invokeValidation]]"value="<?php echo $_smarty_tpl->tpl_vars['FIELD_MODEL']->value->get('fieldvalue');?>
" data-fieldinfo='<?php echo $_smarty_tpl->tpl_vars['FIELD_INFO']->value;?>
' <?php if (!empty($_smarty_tpl->tpl_vars['SPECIAL_VALIDATOR']->value)){?>data-validator=<?php echo Zend_Json::encode($_smarty_tpl->tpl_vars['SPECIAL_VALIDATOR']->value);?>
<?php }?>/><?php }} ?>