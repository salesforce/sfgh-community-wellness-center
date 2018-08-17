/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

({
    doCreate: function(component) {
        var firstName = component.find("firstNameInput");
        var firstNameValue = firstName.get("v.value");
        var lastName = component.find("lastNameInput");
        var lastNameValue = lastName.get("v.value");
        var fullNameValue = firstNameValue + " " + lastNameValue;
        var phoneNumber = component.find("phoneNumberInput");
        var phoneNumberValue = phoneNumber.get("v.value");
        var email = component.find("emailInput");
        var emailValue = email.get("v.value");
        var dateOfBirth = component.find("dateOfBirthInput");
        var dateOfBirthValue = dateOfBirth.get("v.value");
        var streetAddr = component.find("streetAddrInput");
        var streetAddrValue = streetAddr.get("v.value");
        var city = component.find("cityInput");
        var cityValue = city.get("v.value");
        var state = component.find("stateInput");
        var stateValue = state.get("v.value");
        var zipcode = component.find("zipcodeInput");
        var zipcodeValue = zipcode.get("v.value");
        var emergencyContactFullName = component.find("emergencyContactFullNameInput");
        var emergencyContactFullNameValue = emergencyContactFullName.get("v.value");
        var emergencyContactPhoneNumber = component.find("emergencyContactPhoneNumberInput");
        var emergencyContactPhoneNumberValue = emergencyContactPhoneNumber.get("v.value");

        var genderValue = component.get("v.selectedGender");
        var raceValue = component.get("v.selectedRace");
        var existingHealthConditionValue = component.get("v.selectedExistingHealthCondition");
        var anyHealthConditionValue = component.get("v.selectedAnyHealthCondition");
        var referralSourceValue = component.get("v.selectedReferralSource");
        var exerciseLevelsValue = component.get("v.selectedExerciseLevel");
        var participantPositionsValue = component.get("v.selectedParticipantPosition");
        var preferredLanguagesValue = component.get("v.selectedPreferredLanguage");
        var enjoyableActivitiesValue = component.get("v.selectedEnjoyableActivity");
        
        var healthImprove = component.find("healthConditionImproveInput");
        var healthImproveValue = healthImprove.get("v.value");
        
        this.toggleSpinner(component);
        this.createParticipant(component, fullNameValue.trim(), phoneNumberValue.trim(),
                               emailValue.trim(), dateOfBirthValue.trim(), streetAddrValue.trim(),
                               cityValue.trim(), stateValue.trim(), zipcodeValue.trim(),
                               emergencyContactFullNameValue.trim(), emergencyContactPhoneNumberValue.trim(),
                               genderValue.trim(), raceValue.trim(), existingHealthConditionValue.trim(),
                               anyHealthConditionValue.trim(), referralSourceValue.trim(),
                               exerciseLevelsValue.trim(), participantPositionsValue.trim(),
                               preferredLanguagesValue, enjoyableActivitiesValue.trim(),
                               healthImproveValue.trim());
    },
    
    createParticipant: function(component, fullName, phoneNumber, email, 
                                dateOfBirth, streetAddr, city, state, zipcode,
                                emergencyContactFullName, emergencyContactPhoneNumber,
                                gender, race, existingHealthCondition,
                                anyHealthCondition, referralSource,
                                exerciseLevels, participantPositions,
                                preferredLanguages, enjoyableActivities, 
                                healthImprove) {
        var self = this;
        var action = component.get("c.create");
        if (fullName == null && phoneNumber == null && email == null && 
            dateOfBirth == null && streetAddr == null && city == null &&
            state == null && zipcode == null && emergencyContactFullName == null && 
            emergencyContactPhoneNumber == null){
             self.toggleSpinner(component);
             self.showModalError("Cannot register without any information.");
        } else {
            action.setParams({
                "fullName": fullName,
                "phoneNumber": phoneNumber,
                "email": email,
                "dateOfBirth": dateOfBirth,
                "streetAddr": streetAddr,
                "city": city,
                "state": state,
                "zipcode": zipcode,
                "emergencyContactFullName": emergencyContactFullName,
                "emergencyContactPhoneNumber": emergencyContactPhoneNumber,
                "gender": gender,
                "race": race,
                "existingHealthCondition": existingHealthCondition,
                "anyHealthCondition": anyHealthCondition, 
                "referralSource": referralSource,
                "exerciseLevels": exerciseLevels, 
                "participantPositions": participantPositions,
                "preferredLanguages": preferredLanguages, 
                "enjoyableActivities": enjoyableActivities, 
                "healthImprove": healthImprove
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var queueId = response.getReturnValue();
                    self.pollResults(component, queueId);
                } else if (state === "ERROR") {
                    var errorMsg = "Unknown";
                    if (undefined === response.getError()[0].pageErrors) {
                        console.log(response.getError()[0].message);
                        errorMsg = response.getError()[0].message;
                    } else {
                        console.log(response.getError()[0].pageErrors[0].message);
                        errorMsg = response.getError()[0].pageErrors[0].message;
                    }
                    self.showModalError("Please try again. Error message was: " + errorMsg);
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
                        self.showModalSuccess("Thank you for registering");
                        self.clearInput(component);
                    } else {
                        clearTimeout(timeout);
                        self.toggleSpinner(component);
                        self.showModalError("There was a problem. "+result[1]);
                        self.clearInput(component);
                    }
                } else if (state === "ERROR") {
                    self.toggleSpinner(component);
                    var errorMsg = "Unknown";
                    if (undefined === response.getError()[0].pageErrors) {
                        console.log(response.getError()[0].message);
                        errorMsg = response.getError()[0].message;
                    } else {
                        console.log(response.getError()[0].pageErrors[0].message);
                        errorMsg = response.getError()[0].pageErrors[0].message;
                    }
                    self.showModalError("Please try again. Error message was: " + errorMsg);
                }
            });
            $A.enqueueAction(action);
        }

        // start polling server
        sendAction();
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
    
    getGenderOptions: function(component) {
        var self = this;
        var action = component.get("c.getGenderOptions");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var ret = response.getReturnValue();
                component.set("v.genders", ret);
                // Always reset to default gender
                if (ret[0]) {
                    component.set("v.selectedGender", ret[0]);
                } else {
                    self.showModalError("There was an issue retrieving the list of genders. Please reload the app");
                }
            } else {
                // TODO: better error handling
                if (undefined === response.getError()[0].pageErrors) {
                    console.log(response.getError()[0].message);
                } else {
                    console.log(response.getError()[0].pageErrors[0].message);
                }
                self.showModalError("There was an issue retrieving the list of genders. Please reload the app");
            }
        });
        $A.enqueueAction(action);
    },
    
    // TODO: Lots of commonality with above function; reuse code
          getRaceOptions: function(component) {
              var self = this;
              var action = component.get("c.getRaceOptions");
              action.setCallback(this, function(response) {
                  var state = response.getState();
                  if (state === "SUCCESS") {
                      var ret = response.getReturnValue();
                      component.set("v.races", ret);
                      // Always reset to default race
                      if (ret[0]) {
                          component.set("v.selectedRace", ret[0]);
                      } else {
                          self.showModalError("There was an issue retrieving the list of races. Please reload the app");
                      }
                  } else {
                      // TODO: better error handling
                      if (undefined === response.getError()[0].pageErrors) {
                          console.log(response.getError()[0].message);
                      } else {
                          console.log(response.getError()[0].pageErrors[0].message);
                      }
                      self.showModalError("There was an issue retrieving the list of races. Please reload the app");
                  }
              });
              $A.enqueueAction(action);
          },
    // TODO: Lots of commonality with above function; reuse code
        getExistingHealthConditions: function(component) {
            var self = this;
            var action = component.get("c.getExistingHealthConditions");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var ret = response.getReturnValue();
                    component.set("v.existingHealthConditions", ret);
                } else {
                    // TODO: better error handling
                    if (undefined === response.getError()[0].pageErrors) {
                        console.log(response.getError()[0].message);
                    } else {
                        console.log(response.getError()[0].pageErrors[0].message);
                    }
                    self.showModalError("There was an issue retrieving the list of existing health conditions. Please reload the app");
                }
            });
            $A.enqueueAction(action);
        },

    // TODO: Lots of commonality with above function; reuse code
        getAnyHealthConditions: function(component) {
            var self = this;
            var action = component.get("c.getAnyHealthCondition");
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var ret = response.getReturnValue();
                        component.set("v.anyHealthConditions", ret);
                        // Always reset to default to No
                        if (ret[0]) {
                            component.set("v.selectedAnyHealthCondition", ret[0]);
                        } else {
                             self.showModalError("There was an issue retrieving the list of any health conditions. Please reload the app");
                        }
                    } else {
                            // TODO: better error handling
                            if (undefined === response.getError()[0].pageErrors) {
                                console.log(response.getError()[0].message);
                            } else {
                                console.log(response.getError()[0].pageErrors[0].message);
                            }
                            self.showModalError("There was an issue retrieving the list of any health conditions. Please reload the app");
                    }
                });
            $A.enqueueAction(action);
        },
    // TODO: Lots of commonality with above function; reuse code
        getReferralSources: function(component) {
            var self = this;
            var action = component.get("c.getReferralSources");
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var ret = response.getReturnValue();
                        component.set("v.referralSources", ret);
                    } else {
                            // TODO: better error handling
                            if (undefined === response.getError()[0].pageErrors) {
                                console.log(response.getError()[0].message);
                            } else {
                                console.log(response.getError()[0].pageErrors[0].message);
                            }
                            self.showModalError("There was an issue retrieving the list of Referral Sources. Please reload the app");
                    }
                });
            $A.enqueueAction(action);
        },
    // TODO: Lots of commonality with above function; reuse code
                   getExerciseLevels: function(component) {
                       var self = this;
                       var action = component.get("c.getExerciseLevels");
                       action.setCallback(this, function(response) {
                           var state = response.getState();
                           if (state === "SUCCESS") {
                               var ret = response.getReturnValue();
                               component.set("v.exerciseLevels", ret);
                           } else {
                               // TODO: better error handling
                               if (undefined === response.getError()[0].pageErrors) {
                                    console.log(response.getError()[0].message);
                                } else {
                                    console.log(response.getError()[0].pageErrors[0].message);
                                }
                               self.showModalError("There was an issue retrieving the list of exercise levels. Please reload the app");
                           }
                       });
                       $A.enqueueAction(action);
                    },
    // TODO: Lots of commonality with above function; reuse code
        getParticipantPosition: function(component) {
            var self = this;
            var action = component.get("c.getParticipantPositions");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var ret = response.getReturnValue();
                    component.set("v.participantPositions", ret);
                } else {
                    // TODO: better error handling
                    if (undefined === response.getError()[0].pageErrors) {
                        console.log(response.getError()[0].message);
                    } else {
                        console.log(response.getError()[0].pageErrors[0].message);
                    }
                    self.showModalError("There was an issue retrieving the participant positions. Please reload the app");
                }
            });
            $A.enqueueAction(action);
         },
    // TODO: Lots of commonality with above function; reuse code
            getPreferredLanguages: function(component) {
                var self = this;
                var action = component.get("c.getPreferredLanguages");
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            var ret = response.getReturnValue();
                            component.set("v.preferredLanguages", ret);
                            // Always reset to default to English
                            if (ret[0]) {
                                component.set("v.selectedPreferredLanguage", ret[0]);
                            } else {
                                 self.showModalError("There was an issue retrieving the list of preferred languages. Please reload the app");
                            }
                        } else {
                                // TODO: better error handling
                                if (undefined === response.getError()[0].pageErrors) {
                                    console.log(response.getError()[0].message);
                                } else {
                                    console.log(response.getError()[0].pageErrors[0].message);
                                }
                                self.showModalError("There was an issue retrieving the list of preferred languages. Please reload the app");
                        }
                    });
                $A.enqueueAction(action);
            },
    // TODO: Lots of commonality with above function; reuse code
            getEnjoyableActivities: function(component) {
                var self = this;
                var action = component.get("c.getEnjoyableActivities");
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var ret = response.getReturnValue();
                        component.set("v.enjoyableActivities", ret);
                    } else {
                        // TODO: better error handling
                        if (undefined === response.getError()[0].pageErrors) {
                            console.log(response.getError()[0].message);
                        } else {
                        	console.log(response.getError()[0].pageErrors[0].message);
                        }
                        self.showModalError("There was an issue retrieving enjoyable activities. Please reload the app");
                    }
                });
                $A.enqueueAction(action);
             },

    
    clearInput: function(component) {
        component.set("v.fullName", "");
        component.set("v.email", "");
        component.set("v.phoneNumber", "");
        component.set("v.dateOfBirth", "");
        component.set("v.streetAddr", "");
        component.set("v.city", "San Francisco");
        component.set("v.state", "California");
        component.set("v.zipcode", "");
        component.set("v.emergencyContactFullName", "");
        component.set("v.emergencyContactPhoneNumber", "");
        // TODO: Don't hardcode default value
        component.set("v.selectedGender", "Prefer not to say");
        component.set("v.selectedRace", "Prefer not to say");
        component.set("v.selectedExistingHealthCondition", " ");
        component.set("v.selectedAnyHealthCondition", "No");
        component.set("v.selectedReferralSource", " ");
        component.set("v.selectedExerciseLevel", "I do not exercise");
        component.set("v.selectedParticipantPosition", " ");
        component.set("v.selectedPreferredLanguage", "English");
        component.set("v.selectedEnjoyableActivity", " ");
        component.set("v.healthImprove", " ");
    }
})