import './pasttransactionview-drawer.html';
import './transactioncart-drawer.html';
import './productview-drawer.html';
import { Transactions, Shops, ShopProducts,Products,Brands,ShopProductsCustom } from '../../../../startup/both/collections';
import swal from 'sweetalert';

let moment = require('moment');
var _ = require('lodash');

Template.shopkeeperTransactionCartDrawer.helpers({
    getTotal:function(){
        return Session.get("TransSubTotal");
    }
});
Template.shopkeeperTransactionCartDrawer.events({
    'click .btn-checkout':function(event){
        event.preventDefault();
        if($("#drawer-cart .cart-products .cart-item").length){
            var userId = Meteor.userId(),
                shopId = Shops.findOne({"shopKeeper":userId})._id,
                total=Session.get("TransSubTotal"),
                products = [],
                totalCash = 0,
                paymentType = "cash";
            $("#drawer-cart .cart-products .cart-item").each(function(index,el){
                var inItemCount = $(el).find(".item-count input").val();
                products.push({"product":$(el).attr("id"),"item_count":inItemCount});
                var shopProduct = ShopProducts.findOne({productId:$(el).attr("id"),shopId:shopId});
                if(shopProduct){
                    swal({
                        title:"Cash at Hand",
                        text: 'Current Transaction Amount : R'+total,
                        content: "input",
                        button: {
                            text: "Calculate",
                            closeModal: false,
                        },
                    }).then(cash => {
                        if(!cash || parseFloat(cash)<parseFloat(total)) throw null;

                        return {change:_.round(parseFloat(cash)-parseFloat(total),2), cash, total};
                    }).then(transInfo => {
                        transCash = transInfo.cash;

                        var elem = document.createElement("div");
                        elem.innerHTML = `Total : R${transInfo.total}<br>Cash : R${transInfo.cash}<br>Change : R${transInfo.change}`;

                        swal({
                            title: "Transaction Info",
                            text: `Total : R${transInfo.total}\nCash : R${transInfo.cash}\nChange : R${transInfo.change}`,
                            button:"Complete",
                        }).then(complete => {
                            if(!complete) throw null;
                            ShopProducts.update(
                                {
                                    _id:shopProduct._id
                                },
                                {
                                    productId:$(el).attr("id"),
                                    shopId:shopId,
                                    inStock:parseInt(shopProduct.inStock) - parseInt(inItemCount),
                                    isShopProduct:shopProduct.isShopProduct
                                }
                            );

                            var Trans = Transactions.insert({
                                transTotal:total,
                                transProducts:products,
                                transDate:moment().format('LL'),
                                transTime:moment().format('LTS'),
                                shopId:shopId,
                                transCash:transCash,
                                transPaymentType:paymentType
                            });
                
                            if(Trans){
                                $("#drawer-cart .cart-products .cart-item").remove();
                                Session.set("TransSubTotal",0);
                                $("body").removeClass("drawer-open drawer-open-right drawer-cart-open");
                            }
                        });
                    });
                }
            });
        }
    },
    'click .count':function(event){
        event.preventDefault();
        let btnCount = $(event.currentTarget),
            thisItem = btnCount.parents(".cart-item").attr("id"),
            thisInput = btnCount.siblings("input"),
            currCount = parseInt($(thisInput).val()),
            subTotal = parseFloat(Session.get("TransSubTotal")),
            shopData = Shops.findOne({shopKeeper:Meteor.userId()}),
            sellingPrice = 0;

        var productData = Products.findOne({_id:thisItem});
        var shopProductCustom = ShopProductsCustom.findOne({productId:thisItem, shopId:shopData._id});
        if(shopProductCustom){
            sellingPrice = shopProductCustom.sellingPrice;
        } else {
            sellingPrice = productData.sellingPrice;
        }
        if(btnCount.hasClass("minus")){
            currCount--;
            subTotal -= parseFloat(sellingPrice);
        } else if(btnCount.hasClass("plus")){
            currCount++;
            subTotal += parseFloat(sellingPrice);
        }
        if(currCount>0){
            $(thisInput).val(currCount).change();
        } else if (currCount<=0){
            btnCount.parents(".cart-item").remove();
        }
        Session.set("TransSubTotal", subTotal.toFixed(2));
    }
});

// Past Transactions Drawer
Template.shopkeeperPastTransactionViewDrawer.helpers({
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
Template.shopkeeperProductViewDrawer.helpers({
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
    getProductInStock:function(){
        var currProduct = Session.get("currentProductId"),
            currUserId = Meteor.userId(),
            shopData = Shops.findOne({shopKeeper:currUserId});

        return ShopProducts.findOne({productId:currProduct,shopId:shopData._id}).inStock;
    }
});