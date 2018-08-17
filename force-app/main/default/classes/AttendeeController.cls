/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
public with sharing class AttendeeController {
    
    @AuraEnabled
    public static String login(String firstName, String lastName, String phoneNumber, String email, String clazz){
        // Create custom object containing Strings only. 
        Attendance_Queue_Item__c attdc = new Attendance_Queue_Item__c();
        attdc.Class__c = clazz;
        if (lastName != null){
            attdc.Name__c = firstName+' '+lastName;
        } else {
            attdc.Name__c = firstName;
        }
        attdc.phone__c = phoneNumber;
        attdc.Participant_Email__c = email;
        //attdc.message_uuid__c = genUuid();
        //attdc.message_string__c = genUuid();
        
        //Message__c message = new Message__c();
        //message.UUID__c = uuid;
        //insert message;
        
        insert attdc;
        
        // After UI displays message, it would trigger a delete of the attendance queue item
        // We'll probably want to have a clean up every now and then.
        return attdc.Id;
        
        /*int max_wait_secs = 60 // Only wait 1 minute
        for (int t = 0; t < max_wait_secs; t++) {
            if (attdc.message_type__c == "error") 
                String error = attdc.message__c;
            else
            	String message = attdc.message__c;
            Thread.sleep(1000);
        }*/
 		// After insert, the Apex trigger will fire and look up the participant.         
		// TODO: At this point if anything go wrong, we need to wait a little and 
		// look up an error-custom-object created by the tigger and fire the error 
		// message back to the user. 
        
        // TODO: This needs to be moved to queue reader class once above works
        /*List<Participant__c> participants = 
            [SELECT OwnerId, Email__c FROM Participant__c WHERE Email__c = :email ];
        System.debug(participants.size());
        if(participants.size() == 1){
        	Attendance__c attendance = new Attendance__c();
            attendance.Class__c = clazz;
            attendance.Participant__c = participants.get(0).Id;
            insert attendance;
        } else {
            //do nothing
        }*/
        
    }
    
    @AuraEnabled
    public static String[] getMessage(String id) {
        Attendance_Queue_Item__c attendance_item =
                [SELECT message_type__c, message__c FROM Attendance_Queue_Item__c WHERE Id = :id];
        return new String[] { attendance_item.message_type__c, attendance_item.message__c };
    }
    
    @AuraEnabled
    public static List<Class__c> getClasses(){
        List<Class__c> classes = [SELECT Id, Name FROM Class__c ORDER BY Name];
        return classes;
    }
}