import './prepaid.html';

const moment = require('moment');

Template.shopkeeperPrepaidLayout.onRendered(function(){
    /*Meteor.call("getBalance", function(error, results){
        if(error)
            return;

        console.log(results);
    });

    Meteor.call("getProducts", function(error, results){
        if(error)
            return;

        console.log(results);
    });

    Meteor.call("getAllOrders", function(error, results){
        if(error)
            return;

        console.log(results);
    });*/
    
    Meteor.call("getPinnedOrder",{orderno:"2019040605263702"}, function(error, results){
        if(error)
            return;

        console.log(results);
    });

    Meteor.call("getOrderStatus",{orderno:"2019040604474753"}, function(error, results){
        if(error)
            return;

        console.log(results);
    });
});

Template.shopkeeperPrepaidLayout.helpers({
    
});