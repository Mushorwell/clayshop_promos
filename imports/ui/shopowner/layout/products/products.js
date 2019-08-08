import './products.html';
import { Products, Brands } from '../../../../startup/both/collections';

var _ = require('lodash');

Template.shopownerProductsLayout.helpers({
    getProducts:function(){
        var currUserId = Meteor.userId();

        var productsData = Products.find({shopOwner:currUserId}),
            fullProductsData = [];

        productsData.forEach(function(data,index){
            var fullProductData = {},
                brandData = Brands.findOne({_id:data.Brand});

            fullProductData.productId = data._id;
            fullProductData.productName = brandData.brandName+" "+data.itemName+" "+data.itemSize;
            fullProductData.sellingPrice = data.sellingPrice;
            fullProductData.stockPrice = data.stockPrice;

            fullProductsData.push(fullProductData);
        });
        return _.orderBy(fullProductsData, ['productName'],['asc']);
    },
    getPreLoadedProducts:function(){
        HTTP.get(Meteor.absoluteUrl("/spaza_products.json"), function(err,result) {
            console.log(result.data);
        });
    }
});