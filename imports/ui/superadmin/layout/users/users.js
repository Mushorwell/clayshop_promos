import { ShopOwners, Addresses, ShopKeepers } from '../../../../startup/both/collections';

import './users.html';

Template.superadminUsersLayout.onCreated(function(){
    this.autorun(()=>{
        this.subscribe("allUsers");
    });
});

Template.superadminUsersLayout.helpers({
    getUsers(){
        if(Meteor.isClient){
            var usersData = Roles.getUsersInRole ('normal-user').fetch(),
                fullUsersData = [];

            usersData.forEach((data, index) => {
                var fullUserData = {},
                    shopOwnerData,
                    shopOwnerAddressData,
                    shopKeeperData,
                    shopKeeperAddressData;

                fullUserData.userId = data._id;
                fullUserData.fullName = data.profile.firstName;
                
                if(data.profile.userType === "shopOwner"){
                    fullUserData.userType = "Shop Owner";
                    shopOwnerData = ShopOwners.findOne({shopOwner:data._id});
                    if(shopOwnerData){
                        fullUserData.Email = shopOwnerData.shopOwnerEmail;
                        fullUserData.Phone = shopOwnerData.shopOwnerPhone;
                        shopOwnerAddressData = Addresses.findOne({_id:shopOwnerData.shopOwnerAddress});
                        fullUserData.Address = shopOwnerAddressData.streetAddress+" "+shopOwnerAddressData.Township;
                    }
                    fullUsersData.push(fullUserData);
                } else if(data.profile.userType === "shopKeeper"){
                    fullUserData.userType = "Shop Keeper";
                    shopKeeperData = ShopKeepers.findOne({shopKeeper:data._id});
                    if(shopKeeperData){
                        
                        fullUserData.Email = shopKeeperData.shopKeeperEmail;
                        fullUserData.Phone = shopKeeperData.shopKeeperPhone;
                        shopKeeperAddressData = Addresses.findOne({_id:shopKeeperData.shopKeeperAddress});
                        fullUserData.Address = shopKeeperAddressData.streetAddress+" "+shopKeeperAddressData.Township;
                    }
                    fullUsersData.push(fullUserData);
                }

            });
            return fullUsersData;
        }
        return;
    }
});