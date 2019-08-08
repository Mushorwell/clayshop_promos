import './shops.html';
import { Shops, ShopKeepers, Addresses,ShopProducts } from '../../../../startup/both/collections';

Template.shopsLayout.helpers({
    getShops:function(){
        var currUserId = Meteor.userId(),
            options = {};
        if(!Roles.userIsInRole(Meteor.userId(), 'admin-user'))
            options = {shopOwner: currUserId};
        
        var shopsData = Shops.find(options).fetch(),
            fullShopsData = [];

        shopsData.forEach(function(data,index){
            var fullShopData = {},
                shopAddressId = data.shopAddress,
                shopAddressData = Addresses.findOne({_id:shopAddressId}),
                shopKeeperId = data.shopKeeper,
                shopKeeper= Meteor.users.findOne({_id:shopKeeperId}).profile.firstName;

            fullShopData.shopId = data._id;
            fullShopData.shopName= data.shopName;
            fullShopData.shopKeeper = shopKeeper;
            fullShopData.shopAddress=shopAddressData.streetAddress+", "+shopAddressData.Township;
            fullShopData.shopProducts = ShopProducts.find({"shopId":data._id,"isShopProduct":"checked"}).fetch().length;

            fullShopsData.push(fullShopData);
        });

        return fullShopsData;
    },
    isAdmin:function(){
        return Roles.userIsInRole(Meteor.userId(), 'admin-user');
    }
});