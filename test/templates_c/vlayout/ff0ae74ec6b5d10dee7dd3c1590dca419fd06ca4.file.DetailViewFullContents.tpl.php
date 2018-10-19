<?php /* Smarty version Smarty-3.1.7, created on 2018-10-19 05:35:59
         compiled from "D:\xampp2\htdocs\LuderePro\includes\runtime/../../layouts/vlayout\modules\Vtiger\DetailViewFullContents.tpl" */ ?>
<?php /*%%SmartyHeaderCode:136205bc96d3f552db7-08349504%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ff0ae74ec6b5d10dee7dd3c1590dca419fd06ca4' => 
    array (
      0 => 'D:\\xampp2\\htdocs\\LuderePro\\includes\\runtime/../../layouts/vlayout\\modules\\Vtiger\\DetailViewFullContents.tpl',
      1 => 1539791882,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '136205bc96d3f552db7-08349504',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'MODULE_NAME' => 0,
    'RECORD_STRUCTURE' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_5bc96d3f5eca7',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5bc96d3f5eca7')) {function content_5bc96d3f5eca7($_smarty_tpl) {?>
<?php echo $_smarty_tpl->getSubTemplate (vtemplate_path('DetailViewBlockView.tpl',$_smarty_tpl->tpl_vars['MODULE_NAME']->value), $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('RECORD_STRUCTURE'=>$_smarty_tpl->tpl_vars['RECORD_STRUCTURE']->value,'MODULE_NAME'=>$_smarty_tpl->tpl_vars['MODULE_NAME']->value), 0);?>
<?php }} ?>