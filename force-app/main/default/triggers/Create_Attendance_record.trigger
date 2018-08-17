/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
trigger Create_Attendance_record on Attendance_Queue_Item__c (after insert) {
	List<Attendance_Queue_Item__c> attendance_items = Trigger.new;
    System.debug(attendance_items.size());
    
    for (Attendance_Queue_Item__c attendance_item : attendance_items) {
        String phoneNumber = attendance_item.phone__c;
        String name = attendance_item.Name__c+'%';
        String email = attendance_item.Participant_Email__c;
        
        Attendance_Queue_Item__c attendance_item_rw = 
                [SELECT Id FROM Attendance_Queue_Item__c WHERE Id = :attendance_item.Id];

        List<Participant__c> participants;
        if(name != null && phoneNumber != null && email != null){ //No null fields
        	participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Phone__c = :phoneNumber AND Email__c = :email AND Name LIKE :name  ];
        } else if (name != null && phoneNumber != null && email == null){ //Email null
        	participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Phone__c = :phoneNumber AND Name LIKE :name  ];
        } else if (name != null && phoneNumber == null && email != null){ //Phone Number null
        	participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Email__c = :email AND Name LIKE :name  ];          
        } else if (name != null && phoneNumber == null && email == null){ //Phone Number and Email null
        	participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Name LIKE :name  ];
        } else if (name == null && phoneNumber != null && email == null){ // Name null
            participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Phone__c = :phoneNumber  ];
        } else if (name == null && phoneNumber != null && email == null){ //Name and Email null
            participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Phone__c = :phoneNumber  ];
        } else if (name == null && phoneNumber == null && email != null){ //Name and Phone null
            participants = [SELECT OwnerId, Phone__c, Name FROM Participant__c WHERE Email__c = :email ];
        } else {
            System.debug('can never be null null null cause of validation');
        }
        System.debug(participants.size());
        if(participants.size() == 1){
            Attendance__c attendance = new Attendance__c();
	            attendance.Class__c = attendance_item.Class__c;
            attendance.Participant__c = participants.get(0).Id;
            System.debug('Adding particiant attendance record: ' + participants.get(0).Id);
            insert attendance;
            
            attendance_item_rw.message__c = 'Successfully signed into class';
            attendance_item_rw.message_type__c = 'success';
        } else if (participants.size() < 1) {
            attendance_item_rw.message_type__c = 'error';
            attendance_item_rw.message__c = 'Unable to find a record of you, please talk to Community Wellness Center Administrator.';
        } else {
            attendance_item_rw.message_type__c = 'error';
            attendance_item_rw.message__c = 'We found more than one entry, please talk to Community Wellness Center Administrator.';
        }
        upsert attendance_item_rw;
    }
}