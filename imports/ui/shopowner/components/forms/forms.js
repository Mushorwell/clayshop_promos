import './newproduct-form.html';
import './editproduct-form.html';
import './newshop-form.html';
import './editshop-form.html';

import { Addresses, Shops, Brands, Products, ShopKeepers, ProductCategories } from '../../../../startup/both/collections';
import { preLoadedProducts } from '../../../../startup/both/preloaded-products';

function randomPassword(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

function capitalizeString(string){ return string.replace(/\b\w/g, l => l.toUpperCase());}

Template.shopownerNewShopForm.events({
    'click .form-btn':function(event){
        if(Meteor.isClient){
            var strShopname = $("#txtShopname").val(),
                selShopCat = $("#selShopCat").val(),
                strStreetaddress = $("#txtStreetaddress").val(),
                strTownship = $("#txtTownship").val(),
                strCity = $("#txtCity").val(),
                strProvince = $("#txtProvince").val(),
                strCountry = $("#txtCountry").val(),
                intPostalcode = $("#numPostalcode").val(),
                strShopkeeper = $("#txtShopkeeper").val(),
                emEmailAddress = $("#emEmailAddress").val(),
                telPhonenumber = $("#telPhoneNumber").val(),
                strUserRole = $("#txtUserRole").val(),
                strPassword = randomPassword(8);

            console.log(strPassword);

            if(strShopname && strShopkeeper && emEmailAddress && telPhoneNumber && strTownship && strProvince){
                var shopkeeperData = {
                    email: emEmailAddress,
                    password: strPassword,
                    profile: {
                        firstName: strShopkeeper,
                        userType: "shopKeeper"
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
                shopkeeperData,
                function( error, result ){
                    if( error ){
                       console.error("ERROR -> ", error );
                    }else{
                        var newShopKeeperId = result;
                        
                        var newAddressId = Addresses.insert(addressData);

                        if(newAddressId && newShopKeeperId){
                            Shops.insert({
                                shopName: strShopname,
                                shopCategory: selShopCat,
                                shopOwner: Meteor.userId(),
                                shopKeeper : newShopKeeperId,
                                shopAddress: newAddressId
                            });
                            ShopKeepers.insert({
                                shopKeeper: newShopKeeperId,
                                shopKeeperAddress: newAddressId,
                                shopKeeperEmail: emEmailAddress,
                                shopKeeperPhone: telPhonenumber
                            });

                            swal({
                                title:"A new shop has successfully been created",
                                text:`Email: ${emEmailAddress}\nPassword: ${strPassword}`,
                                icon:"success", 
                                button: "Done",
                            })
                            .then((complete) => {
                                if(complete){
                                    FlowRouter.go("shop-owner-shops");
                                }
                            });

                        }
                    }
                 });
            }
        }
    }
});

Template.shopownerEditShopForm.helpers({
    getShopName:function(){
        var currShop = Session.get("currentShopId");
        
        if(currShop){
            return Shops.findOne({_id:currShop}).shopName;
        }
        
        return null;
    }
});

Template.shopownerNewProductForm.helpers({
    getProductCategories:function(){
        return ProductCategories.find({}).fetch();
    },
    getPreLoadedProducts:function(){
        let preLoadedProductsData = [];

        preLoadedProducts.forEach((data, i) => {
            let preLoadedProductData = {};
            let { NAME, BRAND, SIZE } = data;

            preLoadedProductData = {
                NAME,
                BRAND,
                SIZE,
                INDEX : i
            };

            preLoadedProductsData.push(preLoadedProductData);
        });

        return preLoadedProductsData;
    }
});

Template.shopownerNewProductForm.events({
    'click .form-btn':function(event){
        if(Meteor.isClient){
            var strBrandname = $("#txtBrandname").val(),
                strItemname = $("#txtItemname").val(),
                strItemsize = $("#txtItemsize").val(),
                floatStockprice = $("#numStockprice").val(),
                strProductCategory = $("#selProductCategory").val(),
                floatSellingprice = $("#numSellingprice").val();

            if(strBrandname && strItemname && floatStockprice && floatSellingprice){
                var brandID = Brands.findOne({brandName:strBrandname});

                if(!brandID){
                    brandID = Brands.insert({brandName:strBrandname}); 
                } else {
                    brandID = brandID._id;
                }

                var productCategoryID = ProductCategories.findOne({categoryValue:strProductCategory});

                Products.insert({
                    Brand:brandID,
                    shopOwner: Meteor.userId(),
                    itemName:strItemname,
                    itemSize:strItemsize,
                    stockPrice:floatStockprice,
                    sellingPrice:floatSellingprice
                });

                FlowRouter.go("shop-owner-products");
            }
        }
    },
    'change #selPreLoaded':function(event){
        let selPreLoaded = $(event.currentTarget),
            selPreLoadedVal = selPreLoaded.val();

        let preLoadedProduct = preLoadedProducts[selPreLoadedVal];

        if(preLoadedProduct){
            $("#txtBrandname").val(capitalizeString(preLoadedProduct.BRAND));
            $("#txtItemname").val(capitalizeString(preLoadedProduct.NAME));
            $("#txtItemsize").val(capitalizeString(preLoadedProduct.SIZE));
        } else {
            $("#txtBrandname").val("");
            $("#txtItemname").val("");
            $("#txtItemsize").val("");
        }
    }
});

Template.shopownerEditProductForm.helpers({
    getCurrentProduct:function(){
        return Session.get("currentProductId");
    },
    getProductBrand:function(){
        var currProduct = Session.get("currentProductId");

        return Brands.findOne({_id:Products.findOne({_id:currProduct}).Brand}).brandName;
    },
    getProductName:function(){
        var currProduct = Session.get("currentProductId");

        return Products.findOne({_id:currProduct}).itemName;
    },
    getProductSize:function(){
        var currProduct = Session.get("currentProductId");

        return Products.findOne({_id:currProduct}).itemSize;
    },
    getProductStockPrice:function(){
        var currProduct = Session.get("currentProductId");

        return Products.findOne({_id:currProduct}).stockPrice;
    },
    getProductPrice:function(){
        var currProduct = Session.get("currentProductId");

        return Products.findOne({_id:currProduct}).sellingPrice;
    },
    getProductCategories:function(){
        return ProductCategories.find({}).fetch();
    },
    getProductCategory:function(){
        var currProduct = Session.get("currentProductId");
            currProductCategory = Products.findOne({_id:currProduct}).category;

        return ProductCategories.findOne({_id:currProductCategory}).categoryValue;
    }
});