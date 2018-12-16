{*<!--
/*********************************************************************************
** The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ********************************************************************************/
-->*}
{strip}
<div class="container-fluid" id="DBExternalContainer">
    <div class="widget_header row-fluid">
        <div class="span8">
            <h3>{vtranslate('LBL_DBCONNECTION', $QUALIFIED_MODULE)}</h3>
        </div>
        <div class="span4">
            <div class="pull-right">
                <button id="buttonEditBD" class="btn editButton" type="button" title="{vtranslate('LBL_SETTINGS', $QUALIFIED_MODULE)}">
                    <strong>{vtranslate('LBL_SETTINGS', $QUALIFIED_MODULE)}</strong>
                </button>
            </div>
        </div>
    </div>
    <hr>
    <div  id='fields' class="contents row-fluid">
        <table class="table table-bordered table-condensed themeTableColor">
            <thead>
                <tr class="blockHeader">
                    <th colspan="2" class="">
                        <span class="alignMiddle">{vtranslate('LBL_DBCONNECTIONINFO', $QUALIFIED_MODULE)}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td width="25%" class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_HOST', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span>
                            {if isset($dbdatos)}
                            <label>{$dbdatos['host']}</label>
                            {/if}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_PORT', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_USER', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span>
                            {if isset($dbdatos)}
                            <label>{$dbdatos['user']}</label>
                            {/if}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_PASSWORD', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span class="password">
                            {if isset($dbdatos)}
                            <label>{str_repeat('*', strlen($dbdatos['password']))}</label>
                            {/if}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_DBNAME', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span>
                            {if isset($dbdatos)}
                            <label>{$dbdatos['database']}</label>
                            {/if}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="widget_header pull-right">
            <button style="margin-top: 5px;" class="alignRight btn btn-success">
                {vtranslate('LBL_CONECT', $QUALIFIED_MODULE)}
            </button>
            <button class="alignRight btn btn-danger">
                {vtranslate('LBL_CANCEL', $QUALIFIED_MODULE)}
            </button>
        </div>
    </div>
    <hr>
    <div id='dataDB' class="contents row-fluid {if !isset($datos)}hide{/if}">
        <div>
            <ul class="nav nav-tabs">
                <li class="active"><a data-toggle="tab" href="#CYW">Campos y Workflows</a></li>
                <li><a data-toggle="tab" href="#tablas">Tablas</a></li>
            </ul>
        </div>

        <div class="tab-content">
            <div id="CYW" class="tab-pane fade in active row-fluid">
                <div>
                    <div class="span6">
                        <h4 class="pull-right" style="margin-top: 5px;">{vtranslate('LBL_SELECTMODULESNAME', $QUALIFIED_MODULE)}</h4>
                    </div>
                    <div class="span6">
                        <select id="selectModulesName">
                            <option value="none">Seleccionar</option>
                            {if isset($datos)}
                            {foreach $datos as $dato}
                            <option value="{$dato['tabid']}">{$dato['name']}</option>
                            {/foreach}
                            {/if}
                        </select>
                    </div>
                </div>
                <br>
                <div class="span12" style="margin-left: auto;">
                    <div>
                        <ul class="nav nav-tabs">
                            <li class="active"><a data-toggle="tab" href="#campos">Campos</a></li>
                            <li><a data-toggle="tab" href="#workflows">Workflows</a></li>
                        </ul>
                    </div>
                    <div class="tab-content">
                        <div id="campos" class="tab-pane fade in active">
                            <div id="table">

                            </div>
                        </div>
                        <div id="workflows" class="tab-pane fade">                 
                            <div id="workflow">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tablas" class="tab-pane fade">
                <table class="table">
                    <thead>
                        <tr>
                            <th>
                                Nombre de tabla
                            </th>
                            <th>
                                Solo crear
                            </th>
                            <th>
                                Crear e importar datos
                            </th>
                            <th>
                                Importar datos
                            </th>
                        </tr>
                    </thead>
                    <tbody id="dbtablas">
                        {if isset($tablas)}
                            {foreach $tablas as $dato}
                            <tr>
                                <td>{$dato['name']}</td>
                                {if $dato['existe'] == 1}
                                    <td></td>
                                    <td></td>
                                    <td><input class="import" type="checkbox" value="{$dato['name']}"></td>
                                {else}
                                    <td><input type="checkbox" value="{$dato['name']}"></td>
                                    <td><input class="creaConDatos" type="checkbox" value="{$dato['name']}"></td>
                                    <td></td>
                                {/if}
                            </tr>
                            {/foreach}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
        <hr>
        <div id="buttons" class="pull-right">
            <button class="alignRight btn btn-success">
                {vtranslate('LBL_IMPORT', $QUALIFIED_MODULE)}
            </button>
            <button class="alignRight btn btn-danger">
                {vtranslate('LBL_CANCEL', $QUALIFIED_MODULE)}
            </button>
        </div>
    </div>
</div>
{/strip}