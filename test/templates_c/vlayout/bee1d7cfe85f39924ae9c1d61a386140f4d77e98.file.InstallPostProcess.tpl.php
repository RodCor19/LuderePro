<?php /* Smarty version Smarty-3.1.7, created on 2018-10-16 20:57:45
         compiled from "D:\xampp2\htdocs\LuderePro\includes\runtime/../../layouts/vlayout\modules\Install\InstallPostProcess.tpl" */ ?>
<?php /*%%SmartyHeaderCode:284365bc642b9940152-47068810%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'bee1d7cfe85f39924ae9c1d61a386140f4d77e98' => 
    array (
      0 => 'D:\\xampp2\\htdocs\\LuderePro\\includes\\runtime/../../layouts/vlayout\\modules\\Install\\InstallPostProcess.tpl',
      1 => 1467720221,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '284365bc642b9940152-47068810',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'VTIGER_VERSION' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_5bc642b9e7b90',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5bc642b9e7b90')) {function content_5bc642b9e7b90($_smarty_tpl) {?>
<br>
<center>
	<footer class="noprint">
		<div class="vtFooter">
			<p>
				<?php echo vtranslate('POWEREDBY');?>
 <?php echo $_smarty_tpl->tpl_vars['VTIGER_VERSION']->value;?>
 &nbsp;
				&copy; 2004 - <?php echo date('Y');?>
&nbsp&nbsp;
				<a href="//www.vtiger.com" target="_blank">vtiger.com</a>
				&nbsp;|&nbsp;
				<a href="#" onclick="window.open('copyright.html','copyright', 'height=115,width=575').moveTo(210,620)"><?php echo vtranslate('LBL_READ_LICENSE');?>
</a>
				&nbsp;|&nbsp;
				<a href="https://www.vtiger.com/privacy-policy" target="_blank"><?php echo vtranslate('LBL_PRIVACY_POLICY');?>
</a>
			</p>
		</div>
	</footer>
</center>
<?php echo $_smarty_tpl->getSubTemplate (vtemplate_path('JSResources.tpl'), $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</div>
<?php }} ?>