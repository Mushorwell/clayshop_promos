import './shopview-drawer.html';
import './shopedit-drawer.html';
import './productview-drawer.html';
import './productedit-drawer.html';
import './shopproductedit-drawer.html';
import './pasttransactionview-drawer.html';

import { Products, Brands, ShopProducts,ShopProductsCustom, Transactions } from '../../../../startup/both/collections';

// Shop Product Edit Drawer
Template.shopownerShopProductEditDrawer.helpers({
    getProductSellingPrice:function(){
        var productId = Session.get("currentProductId"),
            shopId = FlowRouter.getParam("shopId"),
            shopProductCustom = ShopProductsCustom.findOne({productId:productId, shopId:shopId});

        if(shopProductCustom){
            return shopProductCustom.sellingPrice;
        }

        return Products.findOne({_id:productId}).sellingPrice;
    },
    getProductStock:function(){
        var productId = Session.get("currentProductId"),
            shopId = FlowRouter.getParam("shopId");

        return ShopProducts.findOne({productId:productId, shopId:shopId}).inStock;
    }
});

Template.shopownerShopProductEditDrawer.events({
    'click .btn-update':function(event){
        event.preventDefault();
        if($("#numInStock").val()){
            var productId = Session.get("currentProductId"),
                shopId = FlowRouter.getParam("shopId");

            var shopProduct = ShopProducts.findOne({productId:productId, shopId:shopId});
            if(shopProduct){
                ShopProducts.update(
                    {
                        _id:shopProduct._id
                    },
                    {
                        productId:productId,
                        shopId:shopId,
                        inStock:$("#numInStock").val(),
                        isShopProduct:shopProduct.isShopProduct
                    }
                );
            }
            if($("#numSellingPrice").val()){
                var shopProductCustom = ShopProductsCustom.findOne({productId:productId, shopId:shopId});

                if(shopProductCustom){
                    ShopProductsCustom.update(
                        {
                            _id:shopProductCustom._id
                        },
                        {
                            productId:productId,
                            shopId:shopId,
                            sellingPrice:$("#numSellingPrice").val()
                        }
                    );
                } else {
                    ShopProductsCustom.insert(
                        {
                            productId:productId,
                            shopId:shopId,
                            sellingPrice:$("#numSellingPrice").val()
                        }
                    );
                }
            }
            $("body").removeClass("drawer-open drawer-open-right drawer-shopproductedit-open");
        }
    }
});

// Past Transactions Drawer
Template.shopownerPastTransactionViewDrawer.helpers({
    getCurrentTrans:function(){
        return Session.get("currentTransId");
    },
    getTransDate:function(){
        var currTrans = Session.get("currentTransId");
        return Transactions.findOne({_id:currTrans}).transDate;
    },
    getTransTime:function(){
        var currTrans = Session.get("currentTransId");
        return  Transactions.findOne({_id:currTrans}).transTime;
    },
    getTransProductsCount:function(){
        var currTrans = Session.get("currentTransId"),
            item_count = 0;

        Transactions.findOne({_id:currTrans}).transProducts.forEach(function(prods,i){
            item_count += parseInt(prods.item_count);
        });
        return item_count;
    },
    getTransTotal:function(){
        var currTrans = Session.get("currentTransId");
        return Transactions.findOne({_id:currTrans}).transTotal;
    },
    getTransProducts:function(){
        var currTrans = Session.get("currentTransId"),
            transProducts = Transactions.findOne({_id:currTrans}).transProducts,
            fullTransProductsData = [];

        transProducts.forEach(function(data,i){
            var fullTransProdData = {},
                productData = Products.findOne({_id:data.product}),
                brandData = Brands.findOne({_id:productData.Brand});

            fullTransProdData.productName = brandData.brandName+" "+ productData.itemName+" "+ productData.itemSize;
            fullTransProdData.sellingPrice = productData.sellingPrice;
            fullTransProdData.productCount = data.item_count;

            fullTransProductsData.push(fullTransProdData);
        });

        return fullTransProductsData;
    }
});

// Product View Drawer
Template.shopownerProductViewDrawer.helpers({
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
    }
});

// Product Edit Drawer
Template.shopownerProductEditDrawer.events({
    'click .btn-update':function(event){
        event.preventDefault();
        
        var currentProduct = Session.get("currentProductId"),
            productData = Products.findOne({_id:currentProduct}),
            strBrandname = $("#txtBrandname").val(),
            strItemname = $("#txtItemname").val(),
            strItemsize = $("#txtItemsize").val(),
            floatStockprice = $("#numStockprice").val(),
            floatSellingprice = $("#numSellingprice").val();;

        if(productData){
            if(strBrandname && strItemname && floatStockprice && floatSellingprice){
                var brandID = Brands.findOne({brandName:strBrandname});

                if(!brandID){
                    brandID = Brands.insert({brandName:strBrandname}); 
                } else {
                    brandID = brandID._id;
                }

                Products.update(
                    {
                        _id:productData._id
                    },
                    {
                        Brand:brandID,
                        shopOwner: Meteor.userId(),
                        itemName:strItemname,
                        itemSize:strItemsize,
                        stockPrice:floatStockprice,
                        sellingPrice:floatSellingprice
                    }
                );
                
                $("body").removeClass("drawer-open drawer-open-right drawer-productedit-open");
            }
        }
        
    }
});