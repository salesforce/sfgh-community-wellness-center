/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
trigger Create_Participant_record on Registration_Queue_Item__c (after insert) {
	List<Registration_Queue_Item__c> items = Trigger.new;
    System.debug(items.size());
    
    for (Registration_Queue_Item__c item : items) {
        String name = item.Name;
        
        Registration_Queue_Item__c item_rw = 
                [SELECT Id FROM Registration_Queue_Item__c WHERE Id = :item.Id];

        List<Participant__c> participants = [SELECT Name FROM Participant__c WHERE Name = :name ];
        
        System.debug(participants.size());
        if(participants.size() == 0){
            Participant__c participant = new Participant__c();
            participant.Name = name;
            participant.Phone__c = item.Phone__c;
            participant.Email__c = item.Email__c;
            participant.Date_Of_Birth__c = item.Date_of_birth__c;
            participant.StreetAddress__c = item.Street_Address__c;
            participant.City__c = item.City__c;
            participant.State__c = item.State__c;
            participant.Zipcode__c = item.Zipcode__c;
            participant.Emergency_Contact_Name__c = item.Emergency_contact_name__c;
            participant.Emergency_Contact_Phone__c = item.Emergency_contact_phone__c;
            participant.Gender__c = item.Gender__c;
            participant.Race__c = item.Race__c;
            participant.Existing_Health_Conditions__c = item.ExistingHealthCondition__c;
            participant.Any_Health_Condition__c = item.AnyHealthCondition__c;
            participant.Referral_Source__c = item.ReferralSource__c;
            participant.Exercise_Level__c = item.ExerciseLevel__c;
            participant.Participant_Position__c = item.ParticipantPosition__c;
            participant.Preferred_Language__c = item.PreferredLanguage__c;
            participant.Enjoyable_Activities__c = item.EnjoyableActivity__c;
            participant.Health_Condition_Improve__c	= item.Health_Condition_Improve__c;
	        
            System.debug('Adding particiant record: ' + name);
            try {
            	insert participant;
            } catch (System.DmlException e) {
                System.debug('Adding particiant record: ' + name);
                item_rw.message_type__c = 'error';
                // TODO: Error might be greek to users
                item_rw.message__c = e.getMessage();
				upsert item_rw;
                return;
            }
            
            item_rw.message__c = 'Successfully registered user!';
            item_rw.message_type__c = 'success';
        } else {
            // TODO: Perhaps update fields, instead of error?
            item_rw.message_type__c = 'error';
            item_rw.message__c = 'Found already registered name: "' + name + '". Please ask Community Wellness Center Administrator for help.';
        }
        upsert item_rw;
    }
}