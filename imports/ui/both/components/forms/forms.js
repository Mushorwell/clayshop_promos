import './settings-form.html';
import './shop-settings-form.html';
import { Meteor } from 'meteor/meteor';
import { FreepaidUsers } from "../../../../startup/both/collections";

const moment = require('moment');

Template.settingsForm.events({
    'click .btnUpdatePass':function(event){
        event.preventDefault();

        var currUserId = Meteor.userId(),
            inOldPassword = $("#passOldPassword").val(),
            inNewPassword = $("#passNewPassword").val(),
            inConfirmPassword = $("#passConfirmPassword").val();

        if(inOldPassword && inNewPassword && inConfirmPassword){
            if(inNewPassword === inConfirmPassword){
                Accounts.changePassword(inOldPassword, inNewPassword, function(error){
                    if(error)
                        console.log(error);
                });
            } else {
                console.log("Passwords Dont match");
            }
        } else {
            console.log("Fill All Fields");
        }
        
    }
});

Template.shopSettingsForm.helpers({
    isAdmin:function(){
        return Roles.userIsInRole(Meteor.userId(), 'admin-user');
    }
});

Template.shopSettingsForm.events({
    'click .btn-freepaid-acc': function(e){
        e.preventDefault();

        let fpPhone = $("#telFPPhoneNumber").val(),
            fpEmail = $("#emFPEmailAddress").val(),
            fpPass = $("#passFPPassword").val();

        if(fpPhone && fpEmail && fpPass) {
            Meteor.call("createFreepaidAccount",{cell: fpPhone, email:fpEmail, password:fpPass}, function(error, results){
                if(error)
                    return;
    
                if(results.status.$value === "1") {
                    FreepaidUsers.insert({
                        shop:FlowRouter.getParam("shopId"),
                        user:results.user.$value,
                        pass:fpPass,
                        email:fpEmail,
                        cell:fpPhone,
                        date:moment().format('YYYY-MM-DD, h:mm:ss')
                    });
                } else if(results.status.$value === "0"){
                    console.log(results.message.$value)
                }
            });
        } else {
            console.log("Fill all field");
        }
        
    }
});