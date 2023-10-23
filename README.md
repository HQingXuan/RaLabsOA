# RaLabsOA

In order to run and test the project, please make sure that you have Node.js and MongoDB installed.

In this project, we are using two dependencies of Node.js. So please use `npm i express mongoose` and `npm i -D mocha chai chai-http` to download necessary packages for the program. 

To run the program, please run `npm run start`, in order to test the program, please run `npm run test`. 

The program includes APIs that can handle the following operations:
1. Create an event
2. Retrieve an event/user by its id
3. Delete an event/user by its id
4. Update an event/user by its id
5. Merge all events under a user that has overlapping time span, Overlapping example: E1: 2pm-3pm, E2: 2:45pm-4pm => E_merged: 2pm-4pm. And also merge the invitees for these events. Then update the number of events that a user has. 
