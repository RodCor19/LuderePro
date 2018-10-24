/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/

jQuery.Class("Settings_Vtiger_Announcements_Js",{},{
	
	//Contains Announcement container
	container : false,
	
	//return the container of Announcements
	getContainer : function() {
		if(this.container == false){
			this.container = jQuery('#AnnouncementContainer').find('.contents');
		}
		return this.container;
	},
	
	/*
	 * Function to save the Announcement content
	 */
	saveAnnouncement : function(textAreaElement) {
		var aDeferred = jQuery.Deferred();
		
		var content = textAreaElement.val();
		var params = {
			'module' : app.getModuleName(),
			'parent' : app.getParentModuleName(),
			'action' : 'AnnouncementSaveAjax',
			'announcement' : content
		}
		
		AppConnector.request(params).then(
			function(data) {
				aDeferred.resolve();
			},
			function(error,err){
				aDeferred.reject();
			}
		);
		return aDeferred.promise();
	},
	/* 
	 * Function to connect and show data from a external bd
	 */

	connectDB : function() {
		var aDeferred = jQuery.Deferred();
		
		var host = $('input[name="dbserver"]').val();
		if ($('input[name="dbportEnable"]').is(':checked'))
			host = host + ":" + $('input[name="dbport"]').val();
		var user = $('input[name="dbuser"]').val();
		var pass = $('input[name="dbpassword"]').val();
		var database = $('input[name="dbname"]').val(); 
		if (host  !== "" && user != "" && database !== "") {
			var params = {
				'module' : 'Vtiger',
				'parent' : 'Settings',
				'action' : 'ConnectionExternalDB',
				'dbhost' : host,
				'dbuser' : user,
				'dbpassword' : pass,
				'dbdatabase' : database  
			}
			AppConnector.request(params).then(
				function(data) {
					console.log(data);
					/*if(data !== null && data['success'] === false){
						aDeferred.resolve(data['result']);
					}else{
						if (data === null) {
							aDeferred.reject('Ocurrió un error interno');
						} else {
							aDeferred.reject(data['result']['mensaje']);
						}
					}*/
				},
				function(error,err){
					console.log(error);
					aDeferred.reject();
				}
			);
		} else {
			aDeferred.reject('Complete los campos');
		}
		
		return aDeferred.promise();
	},
	/*
	 * Function to register keyUp event for text area to show save button
	 */
	registerKeyUpEvent : function() {
		var container = this.getContainer();
		container.one('keyup', '.announcementContent', function(e) {
			jQuery('.saveAnnouncement', container).removeClass('hide');
		});
	},
	
	registerEvents: function() {
		var thisInstance = this;
		var container = thisInstance.getContainer();
		var textAreaElement = jQuery('.announcementContent', container);
		var saveButton = jQuery('.saveAnnouncement', container);
		
		//register text area fields to autosize
		app.registerEventForTextAreaFields(textAreaElement);
		thisInstance.registerKeyUpEvent();
		
		//Register click event for save button
		saveButton.click(function(e) {
			saveButton.addClass('hide');
			var progressIndicatorElement = jQuery.progressIndicator({
				'position' : 'html',
				'blockInfo' : {
					'enabled' : true
				}
			});
			
			//save the new Announcement
			thisInstance.saveAnnouncement(textAreaElement).then(
				function(data) {

					progressIndicatorElement.progressIndicator({'mode' : 'hide'});
					thisInstance.registerKeyUpEvent();
					var params = {
						text: app.vtranslate('JS_ANNOUNCEMENT_SAVED')
					};
					Settings_Vtiger_Index_Js.showMessage(params);
				},
				function(error){
					//TODO: Handle Error
				}
			);
		})
	},

	registerEventsDB: function() {
		var thisInstance = this;
		var divContent = $('#fields');
		var editButton = $('#AnnouncementContainer').children().children().next().children().children();
		var conectButton = $('#fields').children().next().children().first();
		var cancelButton = conectButton.next();
		//Register click event for save button
		conectButton.attr('disabled', true);
		cancelButton.attr('disabled', true);

		cancelButton.click(function(e) {
			var trs = divContent.children().children().next().children();
			trs.each(function(index) {
				var td = $( this ).children().next().children();
 				td.each(function(i) {
 					$(this).empty();
 				});
			});
			editButton.attr('disabled', false);
			conectButton.attr('disabled', true);
			cancelButton.attr('disabled', true);
		})

		conectButton.click(function(e) {
			thisInstance.connectDB().then(
				function(data) {
					if (data['success'] === true) {
						var params = {
							text: 'Se conectó a la base de datos'
						};
						Settings_Vtiger_Index_Js.showMessage(params);
					} else {
						Vtiger_Helper_Js.showPnotify(data['mensaje']);
					}
					
				},
				function(error){
					Vtiger_Helper_Js.showPnotify(error);
				}
			);
		})

		

		editButton.click(function(e) {
			var array = [
				'<input type="text" name="dbserver" value="" />',
				'<input type="text" name="dbport" value="" /><input style="margin-left: 30px;" type="checkbox" name="dbportEnable" title="'+app.vtranslate('JS_LBL_CHECKPORTENABLED')+'">',
				'<input type="text" name="dbuser" value="" />',
				'<input type="password" name="dbpassword" value="" />',
				'<input type="text" name="dbname" value="" />',
			];

			var trs = divContent.children().children().next().children();

			trs.each(function(index) {
				var td = $( this ).children().next().children();
 				td.append(array[index]);
 				if (index === 1) {
 					$( this ).children().next().children().children().first().attr('disabled', true);
 					$( this ).children().next().children().children().first().next().click(function(e) {
 						if ($(this).is(':checked')) {
 							$(this).prev().attr('disabled', false);
 						} else {
 							$(this).prev().attr('disabled', true);
 						}
 					});
 				}
			});
			editButton.attr('disabled', true);
			conectButton.attr('disabled', false);
			cancelButton.attr('disabled', false);
		})
	}

});

jQuery(document).ready(function(e){
	var instance = new Settings_Vtiger_Announcements_Js();
	//instance.registerEvents();
	instance.registerEventsDB();
})