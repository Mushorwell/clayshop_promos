import './products.html';
import { Products, Brands, Shops, ShopProducts, ShopProductsCustom } from '../../../../startup/both/collections';

var _ = require('lodash');

Template.shopkeeperProductsLayout.helpers({
    getProducts:function(){
        var currUserId = Meteor.userId();

        var productsData = Products.find({}),
            fullProductsData = [];

        productsData.forEach(function(data,index){
            var fullProductData = {},
                brandData = Brands.findOne({_id:data.Brand}),
                shopData = Shops.findOne({shopKeeper:currUserId});

            var shopProductData = ShopProducts.findOne({productId:data._id,shopId:shopData._id,isShopProduct:"checked"});
            if(shopProductData){
                fullProductData.productId = data._id;
                fullProductData.productName = brandData.brandName+" "+data.itemName+" "+data.itemSize;
                fullProductData.stockPrice = data.stockPrice;
                fullProductData.inStock = shopProductData.inStock;

                var shopProductCustom = ShopProductsCustom.findOne({productId:data._id, shopId:shopData._id});
                if(shopProductCustom){
                    fullProductData.sellingPrice = shopProductCustom.sellingPrice;
                } else {
                    fullProductData.sellingPrice = data.sellingPrice;
                }

                fullProductsData.push(fullProductData);
            }
        });
        return _.orderBy(fullProductsData, ['productName'],['asc']);
    }
});