<?php /* Smarty version Smarty-3.1.7, created on 2018-10-17 17:54:10
         compiled from "D:\xampp2\htdocs\LuderePro\includes\runtime/../../layouts/vlayout\modules\Calendar\CalendarView.tpl" */ ?>
<?php /*%%SmartyHeaderCode:272875bbc1485dfd5f2-94839764%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '17ec5d3518411b31b8ec6bac1b7584af42832312' => 
    array (
      0 => 'D:\\xampp2\\htdocs\\LuderePro\\includes\\runtime/../../layouts/vlayout\\modules\\Calendar\\CalendarView.tpl',
      1 => 1539791881,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '272875bbc1485dfd5f2-94839764',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_5bbc1485e9dae',
  'variables' => 
  array (
    'CURRENT_USER' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5bbc1485e9dae')) {function content_5bbc1485e9dae($_smarty_tpl) {?>
<input type="hidden" id="currentView" value="<?php echo getPurifiedSmartyParameters('view');?>
" /><input type="hidden" id="activity_view" value="<?php echo $_smarty_tpl->tpl_vars['CURRENT_USER']->value->get('activity_view');?>
" /><input type="hidden" id="time_format" value="<?php echo $_smarty_tpl->tpl_vars['CURRENT_USER']->value->get('hour_format');?>
" /><input type="hidden" id="start_hour" value="<?php echo $_smarty_tpl->tpl_vars['CURRENT_USER']->value->get('start_hour');?>
" /><input type="hidden" id="date_format" value="<?php echo $_smarty_tpl->tpl_vars['CURRENT_USER']->value->get('date_format');?>
" /><div class="container-fluid"><div class="row-fluid"><div class="span12"><p><!-- Divider --></p><div id="calendarview"></div></div></div></div><?php }} ?>