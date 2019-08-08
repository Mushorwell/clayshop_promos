import { ShopOwners, Addresses } from '../../../../startup/both/collections';

import './newuser-form.html';
import './newpromo-form.html';

function randomPassword(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

Template.superadminNewUserForm.events({
    'click .form-btn'(event){
        if(Meteor.isClient){
            var strFullname = $("#txtFullName").val(),
                strEmail = $("#emEmail").val(),
                telPhonenumber = $("#telPhoneNumber").val(),
                strStreetaddress = $("#txtStreetaddress").val(),
                strTownship = $("#txtTownship").val(),
                strProvince = $("#txtProvince").val(),
                strCity = $("#txtCity").val(),
                strCountry = $("#txtCountry").val(),
                intPostalcode = $("#numPostalCode").val();
                newPassword = randomPassword(8);

            if(strFullname && strEmail && telPhonenumber && strTownship){
                var newUserData={
                    email: strEmail,
                    password: newPassword,
                    profile: {
                        firstName: strFullname,
                        userType: "shopOwner"
                    }
                }, addressData = {
                    streetAddress : strStreetaddress,
                    Township : strTownship,
                    City : strCity,
                    Province : strProvince,
                    Country : strCountry,
                    postalCode : intPostalcode
                };

                Meteor.call('insertUser',
                newUserData,
                function( error, result ){
                    if( error ) {
                       console.error("ERROR -> ", error );
                    } else {
                        var newUserId = result;
                        
                        var newAddressId = Addresses.insert(addressData);

                        if(newAddressId && newUserId){
                            ShopOwners.insert({
                                shopOwner:newUserId,
                                shopOwnerAddress:newAddressId,
                                shopOwnerEmail:strEmail,
                                shopOwnerPhone: telPhonenumber
                            });

                            swal({
                                title:"A new shop has successfully been created",
                                text:`Email: ${strEmail}\nPassword: ${newPassword}`,
                                icon:"success", 
                                button: "Done",
                            })
                            .then((complete) => {
                                if(complete){
                                    FlowRouter.go("admin-users");
                                }
                            });

                            // $("#passwordModal .modal-body").prepend(`<div class="newuserInfo"><p>Email: <strong>${strEmail}</strong></p><p>Password: <strong>${newPassword}</strong></p></div>`);
                            // $(".btn-modal").click();
                        }
                    }
                 });
            }
        }
    }
});

Template.superadminNewPromoForm.events({
    'click .form-btn'(event){
        if(Meteor.isClient){
            console.log("New Promo");
        }
    }
});