# San Francisco General Hospital Community Wellness Center Sign-in and Registration App

This is a pro-bono volunteer project that aims to make it easier for the [Community Wellness Center](https://zuckerbergsanfranciscogeneral.org/patient-visitor-resources/community-wellness-center/) to manage their participants. There is a sign in and registration page that 
particpants use from a couple of tablets that have been donated to the center. Together, the set of customizations 
that this project provides, allows the administrators to spend less time generating reports and manually tracking 
participants.

## Registration

Participants are registered either via the registration form on the tablet or by an administrator after filling out a
paper form. 

(Note: the registration form on the tablet currently doesn't have all of the newly required fields. Futhermore, the
registration form requires a signature from a participant. Solutions from volunteers to this is welcome!)


## Sign in

Attendance is participants is important for the Community Wellness Center because it allow them to generate reports
automatically and use those to request funding from the hospital and otherwise better serve the community by keeping
track of which classes are more popular and not. 

The sign in form is available on a tablet with the Salesforce mobile app installed. The sign in form is a lightning page
that looks up participants by first name, lastname, email, or phone number. The lighting page add a sign in to a queue 
custom object that is not visible to participants. A trigger behind the scenes acts on queue items and updates an
attendance record custom object. The attendance records serve reports and dashboards. 

## Dev, Build and Test

Follow standard SFDX instructions: https://developer.salesforce.com/tools/sfdxcli

