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
                <button class="btn editButton" type="button" title="{vtranslate('LBL_SETTINGS', $QUALIFIED_MODULE)}">
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
                        <span></span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_PORT', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span></span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_USER', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span></span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_PASSWORD', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span class="password"></span>
                    </td>
                </tr>
                <tr>
                    <td class="">
                        <label class="muted pull-right marginRight10px">{vtranslate('LBL_DBNAME', $QUALIFIED_MODULE)} :</label>
                    </td>
                    <td class="" style="border-left: none;">
                        <span>
                            
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
    <div id='table' class="contents row-fluid divTable">

    </div>
</div>
{/strip}