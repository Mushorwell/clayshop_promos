import './home.html';

import { Shops, Promos } from '../../../../startup/both/collections';

Template.superadminHome.onCreated(function(){
    this.autorun(()=>{
        this.subscribe("allUsers");
    });
});

Template.superadminHome.helpers({
    getShopsNo:function(){
        return Shops.find({}).fetch().length;
    },
    getUsersNo:function(){
        return Roles.getUsersInRole('normal-user').fetch().length;
    },
    getPromosNo:function(){
        return Promos.find({}).fetch().length;
    }
});