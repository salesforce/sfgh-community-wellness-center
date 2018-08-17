/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

({
    doLogin: function(component) {
        var firstName = component.find("firstNameInput");
    	var firstNameValue = firstName.get("v.value");
        var lastName = component.find("lastNameInput");
        var lastNameValue = lastName.get("v.value");
        var phoneNumber = component.find("phoneNumberInput");
        var phoneNumberValue = phoneNumber.get("v.value");
        var email = component.find("emailInput");
        var emailValue = email.get("v.value");
        var clazzValue = component.get("v.selectedClass");
        this.toggleSpinner(component);
        this.loginAttendee(component, firstNameValue.trim(), lastNameValue.trim(), phoneNumberValue.trim(),
            emailValue.trim(), clazzValue.trim());
    },

	loginAttendee : function(component, firstName, lastName, phoneNumber, email, clazz) {
        var self = this;
		var action = component.get("c.login");
        if (firstName == null && lastName == null && phoneNumber == null && email == null){
             self.toggleSpinner(component);
             self.showModalError("Cannot sign in without any information.");
        }else{
        action.setParams({
        	"firstName": firstName,
            "lastName": lastName,
            "phoneNumber": phoneNumber,
            "email":email,
            "clazz": clazz
    	});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var queueId = response.getReturnValue();
                self.pollResults(component, queueId);
            } else if (state === "ERROR") {
                self.toggleSpinner(component);
                console.log(response.getError()[0].pageErrors[0].message);
                self.showModalError("Please try again");
            }
        });
    	$A.enqueueAction(action);
        }
	},

    pollResults: function(component, queueId) {
        var self = this;
        var timedOut = false;
        var timeout = setTimeout(function() {
            timedOut = true;
        }, 20000);
        
        function sendAction() {
            if (timedOut) {
                self.toggleSpinner(component);
                self.showModalError("Timed out waiting for response from the server. Please try again");
            	return;
            }
            var action = component.get("c.getMessage");
            action.setParams({ 
                "id": queueId
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    var status = result[0];
                    console.log("Result: " + result[0]);
                    console.log("Message: " + result[1]);
                    if (status === undefined) {
                        // server still processing, re-poll 
                        setTimeout($A.getCallback(function() {
                            sendAction();
                        }), 1000);
                    } else if (status == 'success') {
                        clearTimeout(timeout);
                        self.toggleSpinner(component);
                        self.showModalSuccess("Thank you for signing in");
                        self.clearInput(component);
                    } else {
                        clearTimeout(timeout);
                        self.toggleSpinner(component);
                        self.showModalError("There was a problem. "+result[1]);
                        self.clearInput(component);
                    }
                } else if (state === "ERROR") {
                    self.toggleSpinner(component);
                    console.log(response.getError()[0].pageErrors[0].message);
                    self.showModalError("Please try again");
                }
            });
            $A.enqueueAction(action);
        }

        // start polling server
        sendAction();
    },

    getClasses : function(component){
        var self = this;
        var action = component.get("c.getClasses");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var ret = response.getReturnValue();
                component.set("v.classes", ret);
                if (ret[0] && ret[0].Id) {
                    component.set("v.selectedClass", response.getReturnValue()[0].Id);
                } else {
                    self.showModalError("There was an issue retrieving the list of classes. Please reload the app");
                }
            } else {
                // TODO: better error handling
                console.log(response.getError()[0].pageErrors[0].message);
                self.showModalError("There was an issue retrieving the list of classes. Please reload the app");
            }
        });
        $A.enqueueAction(action);
    },

    toggleSpinner: function(component) {
        var spinner = component.find("spinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    
    showModalSuccess: function(contentText) {
        this.showModal("Success!", contentText, 5);
    },
    
    showModalError: function(contentText) {
        this.showModal("Error", contentText);
    },
    
    showModal: function(headerText, contentText, dismissTimer) {
        var modal = document.getElementById('myModal');
        var header = document.getElementById("modalHeader");
        var content = document.getElementById("modalContent");
        content.textContent = contentText;
        header.textContent = headerText;
        modal.style.display = "block";
        if (dismissTimer) {
            setTimeout($A.getCallback(function() {
                modal.style.display = "none";
            }), dismissTimer*1000);
        }
    },
    
    clearInput: function(component) {
        component.set("v.firstName", "");
        component.set("v.lastName", "");
        component.set("v.email", "");
        component.set("v.phoneNumber", "");
    }
})