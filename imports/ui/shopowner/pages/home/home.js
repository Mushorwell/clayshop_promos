import './home.html';
import { Shops, Promos, Products } from '../../../../startup/both/collections';

Template.shopownerHome.helpers({
    getShopsNo:function(){
        var currUserId = Meteor.userId();

        return Shops.find({shopOwner: currUserId}).fetch().length;
    },
    getProductsNo:function(){
        var currUserId = Meteor.userId();
        return Products.find({shopOwner: currUserId}).fetch().length;
    },
    getPromosNo:function(){
        return Promos.find({}).fetch().length;
    }
});