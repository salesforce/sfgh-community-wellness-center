/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

({
	doInit : function(component, event, helper){
   		helper.getClasses(component);
   	},

	doLogin : function(component, event, helper) {
    	helper.doLogin(component);
	},

    onSelectChange : function(component, event, helper) {
        var selectedClass = component.find("classSelection").get("v.value");
        component.set("v.selectedClass", selectedClass);
    },
    
    onKeyup: function(component, event, helper) {
        if (event.getParams().keyCode === 13) {
            helper.doLogin(component);
        }
    }
})