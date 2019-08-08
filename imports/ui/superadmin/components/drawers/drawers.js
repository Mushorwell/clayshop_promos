import './productview-drawer.html';
import './userview-drawer.html';
import './useredit-drawer.html';

import { Products, Brands, ShopProducts,ShopProductsCustom, Transactions } from '../../../../startup/both/collections';

// User View Drawer
Template.superadminUserViewDrawer.helpers({

});

// User Edit Drawer
Template.superadminUserEditDrawer.helpers({

});

Template.superadminUserEditDrawer.events({

});

// Shop Product View Drawer
Template.superadminShopProductViewDrawer.helpers({
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
        var currProduct = Session.get("currentProductId"),
            currShopId = FlowRouter.getParam("shopId"),
            shopProductCustom = ShopProductsCustom.findOne({productId:currProduct, shopId:currShopId});

        if(shopProductCustom){
            return shopProductCustom.sellingPrice;
        } else {
            return Products.findOne({_id:currProduct}).sellingPrice;
        }
        
    }
});