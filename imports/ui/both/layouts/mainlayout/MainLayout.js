
import './MainLayout.html';
import { Products, ShopKeepers } from '../../../../startup/both/collections';

import 'bootstrap';

var currBodyClass;

Template.MainLayout.onCreated(function(){
    if(Meteor.isClient){
        Tracker.autorun(function(){
            if(Meteor.user()){
                var userRole = Meteor.user().profile.userType,
                    routeGroup = FlowRouter.current().route.group.name;

                if(userRole === "superAdmin" && routeGroup != 'admin-route'){
                    FlowRouter.go('admin-home');
                } else if(userRole === "shopOwner" && routeGroup != 'shop-owner-route'){
                    FlowRouter.go('shop-owner-home');
                } else if(userRole === "shopKeeper" && routeGroup != 'shop-keeper-route'){
                    FlowRouter.go('shop-keeper-home');
                }
            }
        });
    } else {
        FlowRouter.go("main-route");
    }
});

Template.MainLayout.events({
    'click .btn-drawer'(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            drawer_id = $(btn_drawer).attr("id").replace("btn-","");

        currBodyClass = $("body").attr("class");
        var isDrawerOpen = $("body").hasClass("drawer-open");

        if(isDrawerOpen){
            $("body").removeClass("drawer-open drawer-open-right");
        } else {
            $("body").addClass(`drawer-open drawer-open-right ${drawer_id}-open`);
        }
    },
    'click .drawer-overlay'(event){
        var isDrawerOpen = $("body,html").hasClass("drawer-open");
        if(isDrawerOpen){
            $("body").attr("class",currBodyClass);
        }
    }
});