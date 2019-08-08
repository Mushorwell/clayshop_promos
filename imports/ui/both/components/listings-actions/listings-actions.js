import './listings-actions.html';
import { Products, Brands, Shops, ShopProducts, ShopProductsCustom, ShopKeepersLogs } from '../../../../startup/both/collections';

// Functions
function elementAlreadyOnCart(product_id,inStock,sellingPrice){
    var ret = false;
    $("#drawer-cart .cart-products .cart-item").each(function(index,el){
        if ($(el).attr("id") === product_id) {
            var inItemCount = $(el).find(".item-count input").val(),
                subTotal = parseFloat(Session.get("TransSubTotal"));

            if(parseInt(inStock)>=parseInt(inItemCount)+1){
                $(el).find(".item-count input").val(parseInt(inItemCount)+1);
                subTotal += parseFloat(sellingPrice);
            }
            Session.set("TransSubTotal", subTotal.toFixed(2));
            ret = true;
            
            return;
        }
    });
    
    return ret;
}

// SuperAdminListings
Template.superadminUsersListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            user_id = $(btn_drawer).parents(".userlisting").attr("id");
            Session.clear();
            Session.set('currentUserId', user_id);

        if($(btn_drawer).is("#btn-drawer-useredit")){
            console.log("Edit");
        } else if($(btn_drawer).is("#btn-drawer-userview")){
            console.log("View");
        }
    }
});

Template.superadminShopProductListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            product_id = $(btn_drawer).parents(".shopproductlisting").attr("id");
            Session.clear();
            Session.set('currentProductId', product_id);

        if($(btn_drawer).is("#btn-drawer-productview")){
            console.log("View");
        }
    }
});

Template.shopLogListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            log_id = $(btn_drawer).parents(".shoploglisting").attr("id");
            Session.clear();
            Session.set('currentLogId', log_id);

        if($(btn_drawer).is("#btn-drawer-shoplogview")){
            
        }
    }
});

// ShopOwnerListings
Template.shopownerShopListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            shop_id = $(btn_drawer).parents(".shoplisting").attr("id");
            Session.clear();
            Session.set('currentShopId', shop_id);

        if($(btn_drawer).is("#btn-drawer-shopedit")){
            console.log("Edit");
        } else if($(btn_drawer).is("#btn-drawer-shopview")){
            console.log("View");
        }
    },
    'click .btn-modal':function(event){
        event.preventDefault();

        $(".modal .spanShopName").text(Shops.findOne({_id:shop_id}).shopName);
    },
    'click #btn-delete-shop':function(event){
        event.preventDefault();

        var btn_drawer = event.currentTarget,
            shop_id = $(btn_drawer).parents(".shoplisting").attr("id");
            Session.clear();
            Session.set('currentShopId', shop_id);


        swal({
            title: "Are you sure you want to delete this shop ("+Shops.findOne({_id:shop_id}).shopName+")?",
            text: "Note that deleting the shop will delete all its content including the Shopkeeper's info.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                Meteor.call("removeUser",shop_id,function(err,data){
                    if(err)
                        console.log(error);

                    swal("Poof! You have successfully deleted your shop", {
                        icon: "success",
                    });
                });
                
            } else {
                swal("Your shop is still safe!");
            }
        });
    }
});

Template.shopownerProductListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            product_id = $(btn_drawer).parents(".productlisting").attr("id");
            Session.clear();
            Session.set('currentProductId', product_id);

        if($(btn_drawer).is("#btn-drawer-productedit")){
        } else if($(btn_drawer).is("#btn-drawer-productview")){
        }
    }
});

Template.shopownerShopProductListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            product_id = $(btn_drawer).parents(".shopproductlisting").attr("id");
            Session.clear();
            Session.set('currentProductId', product_id);

        if($(btn_drawer).is("#btn-drawer-shopproductedit")){
        }
    }
});

Template.shopownerPastTransactionListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            trans_id = $(btn_drawer).parents(".pasttransactionlisting").attr("id");
            Session.clear();
            Session.set('currentTransId', trans_id);

        if($(btn_drawer).is("#btn-drawer-pasttransactionview")){
        }
    }
});

// ShopKeeper Listing
Template.shopkeeperProductListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            product_id = $(btn_drawer).parents(".productlisting").attr("id");
            Session.clear();
            Session.set('currentProductId', product_id);

        if($(btn_drawer).is("#btn-drawer-productview")){
            console.log("View");
        }
    }
});
Template.shopkeeperNewTransactionProductListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        /*var btn_drawer = event.currentTarget,
            product_id = $(btn_drawer).parents(".productlisting").attr("id"),
            subTotal = parseFloat(Session.get("TransSubTotal"));

        Session.set('currentProductId', product_id);
        
        if($(btn_drawer).is("#btn-drawer-cart")){
            var productData = Products.findOne({_id:product_id});
            if(productData){
                var fullProductData = {},
                    brandData = Brands.findOne({_id:productData.Brand}),
                    shopData = Shops.findOne({shopKeeper:Meteor.userId()});

                var shopProductData = ShopProducts.findOne({productId:productData._id,shopId:shopData._id,isShopProduct:"checked"});

                fullProductData.productId = productData._id;
                fullProductData.productName = brandData.brandName+" "+productData.itemName+" "+productData.itemSize;
                fullProductData.sellingPrice = productData.sellingPrice;

                var shopProductCustom = ShopProductsCustom.findOne({productId:productData._id, shopId:shopData._id});
                if(shopProductCustom){
                    fullProductData.sellingPrice = shopProductCustom.sellingPrice;
                } else {
                    fullProductData.sellingPrice = productData.sellingPrice;
                }

                subTotal += parseFloat(fullProductData.sellingPrice);
                
                if(!elementAlreadyOnCart(fullProductData.productId,shopProductData.inStock,fullProductData.sellingPrice) && parseInt(shopProductData.inStock)>=1){
                    Session.set("TransSubTotal", subTotal.toFixed(2));
                    var cartItem = `<div class="cart-item" id="${fullProductData.productId}">
                        <div class="item-info">
                            <div class="item-name">${fullProductData.productName}</div>
                            <div class="item-price">R ${fullProductData.sellingPrice}</div>
                        </div>
                        <div class="item-count">
                            <div class="form-field">    
                                <span class="count minus">-</span><input type="number" value=1 disabled/><span class="count plus">+</span>
                            </div>
                        </div>
                    </div>`;

                    $("#drawer-cart .cart-products").append(cartItem);
                }
                
            }
        }*/
    }
});
Template.shopkeeperPastTransactionListingActions.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        var btn_drawer = event.currentTarget,
            trans_id = $(btn_drawer).parents(".pasttransactionlisting").attr("id");
            Session.clear();
            Session.set('currentTransId', trans_id);

        if($(btn_drawer).is("#btn-drawer-pasttransactionview")){
        }
    }
});