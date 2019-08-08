import './NavBar.html';
import { Shops, ShopKeepersLogs } from '../../../../startup/both/collections';

import Swal from 'sweetalert2';
import moment from "moment";

if(Meteor.isClient){
Template.navBar.helpers({
    getUser : function(){
        if(Meteor.user()){
            return Meteor.user().profile.firstName;
        } else {
            return;
        }
    },
    getEmail : function(){
        if(Meteor.user()){
            return Meteor.user().emails[0].address;
        } else {
            return;
        }
    },
    getRouterGroupPrefix:function(){
        return FlowRouter.current().route.group.prefix;
    }
});

Template.navBar.events({
    'click .btn-logout':function(event){
        event.preventDefault();

        if(Meteor.user()) {
            var userType = Meteor.user().profile.userType;

            if(userType == "shopKeeper"){
                var saveCashAtHand = 0;
                var saveMessage = "",
                userId = Meteor.userId(),
                shopId = Shops.findOne({"shopKeeper":userId})._id;

                Swal.fire({
                    title: 'Cash At Hand',
                    input: 'number',
                    showCancelButton: true,
                    inputValidator: (value) => {
                      return !value && 'You need to put in the Cash at Hand!';
                    }
                }).then(value => {
                    if(value.value){
                        saveCashAtHand = `R ${value.value}`;
                        Swal.fire({
                            input: 'textarea',
                            inputPlaceholder: 'Type your feedback and suggestions for the day here...',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return !value && 'If you have no feedback, put N/A!';
                            }
                        }).then(value => {
                            if(value.value) {
                                saveMessage = value.value;
                                ShopKeepersLogs.insert(
                                    {
                                        userId,
                                        shopId,
                                        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
                                        cashAtHand: saveCashAtHand,
                                        suggestions: saveMessage
                                    }
                                );
                                Meteor.logout(function(error) {
                                    if(error) {
                                        console.log("ERROR: " + error.reason);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                Meteor.logout(function(error) {
                    if(error) {
                        console.log("ERROR: " + error.reason);
                    }
                });
            }
        }
        
    }
});
}