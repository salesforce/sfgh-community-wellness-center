/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
public with sharing class CreateParticipantController {
    
    @AuraEnabled
    public static String create(String fullName, String phoneNumber, String email, 
                                String dateOfBirth, String streetAddr, String city, 
                                String state, String zipcode, String emergencyContactFullName, 
                                String emergencyContactPhoneNumber, String gender, String race, 
                                String existingHealthCondition, String anyHealthCondition, 
                                String referralSource, String exerciseLevels,
                                String participantPositions, String preferredLanguages, 
                                String enjoyableActivities, String healthImprove) {
        // Create custom object containing Strings only. 
        Registration_Queue_Item__c participant = new Registration_Queue_Item__c();
                                    
        participant.Name = fullName;
        participant.Phone__c = phoneNumber;
        participant.Email__c = email;

        if (dateOfBirth == null) {
        	participant.Date_of_birth__c = null;                                
        } else {
        	System.debug('Parsing date: ' + dateOfBirth);
            String[] yearMonthDay = dateOfBirth.split('-');
            participant.Date_of_birth__c = date.newinstance(Integer.valueOf(yearMonthDay[0]), Integer.valueOf(yearMonthDay[1]), Integer.valueOf(yearMonthDay[2]));
        }                           
                                    
        participant.Street_Address__c = streetAddr;
        participant.City__c = city;
        participant.State__c = state;
        if (zipCode == null) {
        	participant.Zipcode__c = null;	                                
        } else {
            try {
            	participant.Zipcode__c = Integer.valueOf(zipcode);
            } catch (Exception e) {
                participant.Zipcode__c = null;
            }
        }
        participant.Emergency_contact_name__c = emergencyContactFullName;
        participant.Emergency_contact_phone__c = emergencyContactPhoneNumber;
                                    
        participant.Gender__c = gender;
        participant.Race__c = race;
        
        participant.ExistingHealthCondition__c = existingHealthCondition;
        participant.AnyHealthCondition__c = anyHealthCondition;
        participant.ReferralSource__c = referralSource;
        participant.ExerciseLevel__c = exerciseLevels;
        participant.ParticipantPosition__c = participantPositions;
        participant.PreferredLanguage__c = preferredLanguages;
        participant.EnjoyableActivity__c = enjoyableActivities;
        participant.Health_Condition_Improve__c = healthImprove;                            
                                    
        insert participant;                       
        
        // After UI displays message, it would trigger a delete of the attendance queue item
        // We'll probably want to have a clean up every now and then.
        return participant.Id;        
    }
    
    @AuraEnabled
    public static String[] getMessage(String id) {
        Registration_Queue_Item__c item =
                [SELECT message_type__c, message__c FROM Registration_Queue_Item__c WHERE Id = :id];
        return new String[] { item.message_type__c, item.message__c };
    }
    
    @AuraEnabled
    public static List<String> getGenderOptions() {
        Schema.DescribeFieldResult fieldResult = Participant__c.gender__c.getDescribe();
        System.debug('Retrieving genders: ' + fieldResult);
                List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> genderLabels = new List<String>();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding gender value: ' + value);
            genderLabels.add(value.getLabel());
        }
        return genderLabels;
    }
    
    @AuraEnabled
    public static List<String> getRaceOptions() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Race__c.getDescribe();
        System.debug('Retrieving races: ' + fieldResult);
                List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> raceLabels = new List<String>();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding race value: ' + value);
            raceLabels.add(value.getLabel());
        }
        return raceLabels;
    }

    @AuraEnabled
    public static List<String> getExistingHealthConditions() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Existing_Health_Conditions__c.getDescribe();
        System.debug('Retrieving existing health conditions: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> existingHealthConditionLabels = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding existing health condition value: ' + value);
            existingHealthConditionLabels.add(value.getLabel());
        }
        return existingHealthConditionLabels;

    }

    @AuraEnabled
    public static List<String> getAnyHealthCondition() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Any_Health_Condition__c.getDescribe();
        System.debug('Retrieving any health conditions: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> anyHealthConditionLabels = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding any health condition value: ' + value);
            anyHealthConditionLabels.add(value.getLabel());
        }
        return anyHealthConditionLabels;

    }

    @AuraEnabled
    public static List<String> getReferralSources() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Referral_Source__c.getDescribe();
        System.debug('Retrieving referral sources: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> referralSources = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding referral sources value: ' + value);
            referralSources.add(value.getLabel());
        }
        return referralSources;
    }

    @AuraEnabled
    public static List<String> getExerciseLevels() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Exercise_Level__c.getDescribe();
        System.debug('Retrieving exercise levels: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> exerciseLevels = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding exercise levels value: ' + value);
            exerciseLevels.add(value.getLabel());
        }
        return exerciseLevels;
    }

    @AuraEnabled
    public static List<String> getParticipantPositions() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Participant_Position__c.getDescribe();
        System.debug('Retrieving participant positions: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> participantPositions = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding participant position value: ' + value);
            participantPositions.add(value.getLabel());
        }
        return participantPositions;
    }

    @AuraEnabled
    public static List<String> getPreferredLanguages() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Preferred_Language__c.getDescribe();
        System.debug('Retrieving preferred languages: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> preferredLanguages = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding preferred language value: ' + value);
            preferredLanguages.add(value.getLabel());
        }
        return preferredLanguages;
    }

    @AuraEnabled
    public static List<String> getEnjoyableActivities() {
        Schema.DescribeFieldResult fieldResult = Participant__c.Enjoyable_Activities__c.getDescribe();
        System.debug('Retrieving enjoyable activities: ' + fieldResult);
        List<Schema.PicklistEntry> values = fieldResult.getPicklistValues();
        List<String> enjoyableActivities = new List<String> ();
        for (Schema.PicklistEntry value : values) {
            System.debug('Adding enjoyable activities value: ' + value);
            enjoyableActivities.add(value.getLabel());
        }
        return enjoyableActivities;
    }

}