import './shopproducts.html';
import { Products, Brands, ShopProducts,ShopProductsCustom, Shops } from '../../../../startup/both/collections';

var _ = require('lodash');
var dt = require( 'datatables.net' )();

Template.shopProductsLayout.onRendered(function () {
    $('#table_id').DataTable( {
        searching: false,
        paging: false,
        info:false
    });
});

Template.shopProductsLayout.helpers({
    getProducts:function(){
        var currUserId = Meteor.userId(),
            currShopId = FlowRouter.getParam("shopId");

        var productsData = Products.find({shopOwner:currUserId}),
            fullProductsData = [];

        productsData.forEach(function(data,index){
            var fullProductData = {},
                brandData = Brands.findOne({_id:data.Brand}),
                shopProductData = ShopProducts.findOne({productId:data._id, shopId:currShopId});
            if(!shopProductData){
                shopProductData = ShopProducts.insert({
                    productId:data._id,
                    shopId:currShopId,
                    inStock:0,
                    isShopProduct:""
                });
            }
            
            fullProductData.productId = data._id;
            fullProductData.productName = brandData.brandName+" "+data.itemName+" "+data.itemSize;
            fullProductData.inStock = shopProductData.inStock;
            fullProductData.isShopProduct = shopProductData.isShopProduct;

            var shopProductCustom = ShopProductsCustom.findOne({productId:data._id, shopId:currShopId});
            if(shopProductCustom){
                fullProductData.sellingPrice = shopProductCustom.sellingPrice;
            } else {
                fullProductData.sellingPrice = data.sellingPrice;
            }

            fullProductsData.push(fullProductData);
        });
        
        return _.orderBy(fullProductsData, ['productName'],['asc']);
    },
    getProductsAdmin: function(){
        var currShopId = FlowRouter.getParam("shopId"),
            shopProductsData = ShopProducts.find({shopId:currShopId,"isShopProduct":"checked"}).fetch(),
            fullProductsData = [];

        shopProductsData.forEach(function(data){
            var productId = data.productId,
                productData = Products.findOne({_id:productId}),
                brandData = Brands.findOne({_id:productData.Brand}),
                fullProductData = {};

            fullProductData.productId = productId;
            fullProductData.productName = brandData.brandName+" "+productData.itemName+" "+productData.itemSize;
            fullProductData.inStock = data.inStock;
            fullProductData.isShopProduct = data.isShopProduct;

            var shopProductCustom = ShopProductsCustom.findOne({productId:productId, shopId:currShopId});
            if(shopProductCustom){
                fullProductData.sellingPrice = shopProductCustom.sellingPrice;
            } else {
                fullProductData.sellingPrice = productData.sellingPrice;
            }

            fullProductsData.push(fullProductData);
        });
        
        return _.orderBy(fullProductsData, ['productName'],['asc']);
    },
    getShopName:function(){
        return Shops.findOne({_id:FlowRouter.getParam("shopId")}).shopName + ", Products";
    },
    isAdmin:function(){
        return Roles.userIsInRole(Meteor.userId(), 'admin-user');
    }
});

Template.shopProductsLayout.events({
    'change .cbShopProduct':function(event){
        var currCheckbox = $(event.currentTarget),
            productId = currCheckbox.parents(".shopproductlisting").attr("id"),
            shopId = FlowRouter.getParam("shopId"),
            isShopProduct = currCheckbox.is(':checked');

        var shopProduct = ShopProducts.findOne({productId:productId, shopId:shopId});

        if(shopProduct){
            ShopProducts.update(
                {
                    _id:shopProduct._id
                },
                {
                    productId:productId,
                    shopId:shopId,
                    inStock:shopProduct.inStock,
                    isShopProduct:(isShopProduct ? "checked" : "")
                }
            );
        } else {
            ShopProducts.insert({
                productId:productId,
                shopId:shopId,
                inStock:0,
                isShopProduct:(isShopProduct ? "checked" : "")
            });
        }
    },
    'click .cust-cb':function(event){
        var thisCustCB = $(event.currentTarget);

        thisCustCB.siblings(".cbShopProduct").click();
    }
});