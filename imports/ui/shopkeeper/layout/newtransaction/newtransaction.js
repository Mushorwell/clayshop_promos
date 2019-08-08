import './newtransaction.html';
import { Products, Brands, Shops, ShopProducts,ShopProductsCustom, ProductCategories } from '../../../../startup/both/collections';

var _ = require('lodash');
var $  = require( 'jquery' );
var dt = require( 'datatables.net' )();

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

Template.shopkeeperNewTransactionLayout.onCreated(function(){
    Session.set("TransSubTotal",0);
});
Template.shopkeeperNewTransactionLayout.onRendered(function(){

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
        
            // an array that will be populated with substring matches
            matches = [];
        
            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
        
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
            });
        
            cb(matches);
        };
    };
    this.autorun(()=>{
        let currProductCategory = Session.get('currentProductCategory');
        $("#selProductCategory").val(currProductCategory);
        let prodParams = {};

        if(currProductCategory != "all" && currProductCategory){
            let productCat = ProductCategories.findOne({categoryValue:currProductCategory});

            if(productCat) {
                prodParams = {
                    productCategory:productCat._id
                };
            }
        }
        
        this.subscribe("Products",function(){
            var currUserId = Meteor.userId(),
                productsData = Products.find(prodParams),
                fullProductsData = [];

            productsData.forEach(function(data,index){
                var fullProductData = {},
                    tmpProdData=[],
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
                        fullProductData.sellingPrice = `R ${shopProductCustom.sellingPrice}`;
                    } else {
                        fullProductData.sellingPrice = `R ${data.sellingPrice}`;
                    }

                    tmpProdData.push(fullProductData.productName,fullProductData.sellingPrice,fullProductData.inStock,fullProductData.productId);

                    fullProductsData.push(tmpProdData);
                }
            });

            products = fullProductsData;
            
            $('#table_id').on('init.dt', function(e, settings, json){
                $("#table_id_filter").appendTo(".page-actions ul li.action:eq(1)");
            });

            $('#table_id').DataTable( {
                searching: true,
                paging: false,
                info:false,
                destroy:true,
                language: {
                    search: "",
                    searchPlaceholder: "Search for product"
                },
                data:products,
                columns:[
                    {title:"Product Name"},
                    {title:"Selling Price"},
                    {title:"In Stock"},
                    {title:"Actions"}
                ],
                createdRow: function( row, data, dataIndex ) {
                    $( row )
                        .attr('id', data[data.length-1])
                        .addClass("productlisting");
                },
                columnDefs: [{
                    "targets": -1,
                    "searchable": false,
                    "orderable": false,
                    "className": "text-right",
                    "render": function (data, type, row) {
                        var checkbox = `<ul class="listing-actions-wrapper">
                        <li><a href="#" class="btn-drawer" id="btn-drawer-cart"><i class="material-icons">add_shopping_cart</i></a></li>
                    </ul>`;
                        return checkbox;
                    }
                }]
            });
        });
    });
});

Template.shopkeeperNewTransactionLayout.helpers({
    getProducts:function(){
        var currUserId = Meteor.userId(),
            currProductCategory = Session.get('currentProductCategory');

        let prodParams = {};

        if(currProductCategory != "all" && currProductCategory){
            let productCat = ProductCategories.findOne({categoryValue:currProductCategory});

            if(productCat) {
                prodParams = {
                    productCategory:productCat._id
                };
            }
        }

        var productsData = Products.find(prodParams),
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

        console.log(_.orderBy(fullProductsData, ['productName'],['asc']));

        // return _.orderBy(fullProductsData, ['productName'],['asc']);
    }
});


Template.shopkeeperNewTransactionLayout.events({
    'click .btn-drawer':function(event){
        event.preventDefault();
        
        var btn_drawer = event.currentTarget,
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
        }
    }
});