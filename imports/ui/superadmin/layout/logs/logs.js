import { UserLogs } from "../../../../startup/both/collections";

import './logs.html';

Template.superadminUserLogsLayout.helpers({
    getUserLogs:function(){
        if(Meteor.isClient){
            var currUser = FlowRouter.getParam("userID");
            var userLogsData = UserLogs.find({userId: currUser}),
                fullUserLogsData = [];

            userLogsData.forEach((data, index) => {
                fullUserLogsData.push(data);
            });
            
            return fullUserLogsData;
        }
    }
});