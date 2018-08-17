/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

({
    doInit: function(component, event, helper) {
        console.log("Starting init");
        helper.getGenderOptions(component);
        helper.getRaceOptions(component);
        helper.getExistingHealthConditions(component);
        helper.getAnyHealthConditions(component);
        helper.getReferralSources(component);
        helper.getExerciseLevels(component);
        helper.getParticipantPosition(component);
        helper.getPreferredLanguages(component);
        helper.getEnjoyableActivities(component);
    },
    
    doCreate: function(component, event, helper) {
        helper.doCreate(component);
    },

    onGenderSelectChange: function(component, event, helper) {
        var selectedGender = component.find("genderSelection").get("v.value");
        component.set("v.selectedGender", selectedGender);
    },
    
    onRaceSelectChange: function(component, event, helper) {
        var selectedRace = component.find("raceSelection").get("v.value");
        component.set("v.selectedRace", selectedRace);
    },
    
    onExistingHealthConditionSelectChange: function(component, event, helper) {
        var selectedExistingHealthCondition = component.find("existingHealthConditionSelection").get("v.value");
        component.set("v.selectedExistingHealthCondition", selectedExistingHealthCondition);
    },
    
    onAnyHealthConditionSelectChange: function(component, event, helper) {
            var selectedAnyHealthCondition = component.find("anyHealthConditionSelection").get("v.value");
            component.set("v.selectedAnyHealthCondition", selectedAnyHealthCondition);
    },
    
    onReferralSourcesSelectChange: function(component, event, helper) {
            var selectedReferralSource = component.find("referralSourcesSelection").get("v.value");
            component.set("v.selectedReferralSource", selectedReferralSource);
    },
    
    onExerciseLevelSelectChange: function(component, event, helper) {
            var selectedExerciseLevel = component.find("exerciseLevelSelection").get("v.value");
            component.set("v.selectedExerciseLevel", selectedExerciseLevel);
    },
	
    onParticipantPositionSelectChange: function(component, event, helper) {
            var selectedParticipantPosition = component.find("participantPositionSelection").get("v.value");
            component.set("v.selectedParticipantPosition", selectedParticipantPosition);
    },
	
    onPreferredLanguageSelectChange: function(component, event, helper) {
            var selectedPreferredLanguage = component.find("preferredLanguageSelection").get("v.value");
            component.set("v.selectedPreferredLanguage", selectedPreferredLanguage);
    },
	
    onEnjoyableActivitiesSelectChange: function(component, event, helper) {
            var selectedEnjoyableActivity = component.find("enjoyableActivitiesSelection").get("v.value");
            component.set("v.selectedEnjoyableActivity", selectedEnjoyableActivity);
    },    
    
    onKeyup: function(component, event, helper) {
        if (event.getParams().keyCode === 13) {
            helper.doCreate(component);
        }
    }
})