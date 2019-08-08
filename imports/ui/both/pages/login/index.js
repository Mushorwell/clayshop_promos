import './accounts';
import './Login.html';

Template.Login.onCreated(function(){
    this.autorun(()=>{
        this.subscribe("allUsers");

        if(Meteor.userId()){
            if(Roles.userIsInRole(Meteor.userId(), 'admin-user')){
                FlowRouter.go('admin-home');
            } else if(Roles.userIsInRole(Meteor.userId(), 'shopOwner')){
                FlowRouter.go('shop-owner-home');
            } else if(Roles.userIsInRole(Meteor.userId(), 'shopKeeper')){
                FlowRouter.go('shop-keeper-home');
            }
            return;
        }
    });
});