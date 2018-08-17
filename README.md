# San Francisco General Hospital Community Wellness Center Sign-in and Registration App

This is a pro-bono volunteer project that aims to make it easier for the [Community Wellness Center](https://zuckerbergsanfranciscogeneral.org/patient-visitor-resources/community-wellness-center/) to manage their participants. There is a sign in and registration page that 
particpants use from a couple of tablets that have been donated to the center. Together, the set of customizations 
that this project provides, allows the administrators to spend less time generating reports and manually tracking 
participants.

## Registration

Participants are registered either via the registration form on the tablet or by an administrator after filling out a
paper form. 

(Note: the registration form on the tablet currently doesn't have all of the newly required fields. Futhermore, the
registration form requires a signature from a participant. Volunteers to help out with this are welcome!)


## Sign in

Attendance of participants is important for the Community Wellness Center because it allow them to generate reports
automatically. The reports are used to request funding from the hospital and otherwise better serve the community. 

The sign in form is available on a tablet with the Salesforce mobile app installed. The sign in form is a lightning page
that looks up participants by first name, lastname, email, or phone number. For each sign in, the lighting page adds a 
a record to a queue custom object that is not visible to participants. A trigger behind the scenes acts on queue items 
and updates an attendance record custom object. Another trigger handles error handling. This trigger system is necessary 
to allow the sign in and registration forms to run as an unpriviledged user that does not have access to view existing 
participants. Data security is important to the CWC. 

## Dev, Build and Test

Currently, we are mid-migration to SFDX. This project was developed as a standard Salesforce package. Volunteers are 
welcome to help out with the transition!

Follow standard SFDX instructions: https://developer.salesforce.com/tools/sfdxcli

## Acknowledgements

Special thanks to those who volunteered to build and maintain this project: 
Ryan Lamore
Nari Mulakala
Trevor Bliss
Kirk Spector
Justin Harringa
Jessica Cox
Chris Tammariello
Anny He
Amool Gupta
