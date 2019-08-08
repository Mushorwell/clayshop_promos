import { UserLogs } from "../../../../startup/both/collections";

import moment from "moment";

AccountsTemplates.addFields([
    {
        _id: 'firstName',
        type: 'text',
        displayName: 'First Name',
        required: true
    },
    {
        _id: 'userType',
        type: 'select',
        displayName: 'User Type',
        select: [
            {
                text:'Super Admin',
                value: 'superAdmin'
            },
            {
                text:'Shop Owner',
                value: 'shopOwner'
            },
            {
                text:'Shop Keeper',
                value: 'shopKeeper'
            }
        ]
    }
]);

Accounts.onLogin(function(){
    if(Meteor.userId()){
        var user = Meteor.user();
        if(user && FlowRouter.getRouteName() === 'main-route'){
            var userType = user.profile.userType;
            $.getJSON("https://ipapi.co/json/", function(data) {

                if(data) {
                    UserLogs.insert(
                        {
                            userId:Meteor.userId(),
                            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
                            ipaddress: data.ip,
                            city: data.city,
                            latitude : data.latitude,
                            longitude: data.longitude,
                            region: data.region,
                            country:data.country_name
                        }
                    );
                }

		    });

            if(Roles.userIsInRole(Meteor.userId(), 'admin-user')){
                FlowRouter.go('admin-home');
            } else if(Roles.userIsInRole(Meteor.userId(), 'shopOwner')){
                FlowRouter.go('shop-owner-home');
            } else if(Roles.userIsInRole(Meteor.userId(), 'shopKeeper')){
                FlowRouter.go('shop-keeper-home');
            }
        }
    } else {
        FlowRouter.go('main-route');
    }
});

Accounts.onLogout(function(){
    FlowRouter.go('main-route');
});