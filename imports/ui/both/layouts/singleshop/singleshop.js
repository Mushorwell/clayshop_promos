import './singleshop.html';
import { Transactions, Promos, ShopProducts, Shops,Products, Brands, ShopProductsCustom } from '../../../../startup/both/collections';
import _ from 'lodash';

const moment = require('moment');

var ctx = null;

TransactionsInfo = function(){
    var transactionsData = Transactions.find({"shopId":FlowRouter.getParam("shopId")}).fetch(),
        transactionsProducts = [],
        fullTransProductInfo = [],
        newFullTransProductInfo = [];

    _.forEach(transactionsData,function(trans){
        transactionsProducts = _.concat(transactionsProducts,trans.transProducts);
    });

    transactionsProducts = _.groupBy(transactionsProducts,function(args){
        return args.product;
    });

    _.forEach(_.keys(transactionsProducts), function(key){
        var transProductInfo = {};
        transProductInfo.id = key;
        transProductInfo.totalCount = _.reduce(transactionsProducts[key],function(sum,value){
            return sum+parseInt(value.item_count);
        },0);

        fullTransProductInfo.push(transProductInfo);
    });

    _.forEach(fullTransProductInfo, function(data){
        var productData = Products.findOne({_id:data.id});

        data.brandName = Brands.findOne({_id:productData.Brand}).brandName;
        data.productName = productData.itemName +" "+ productData.itemSize;

        newFullTransProductInfo.push(data);
    });

    return _.orderBy(newFullTransProductInfo, 'totalCount', 'desc');
};

Template.singleShopLayout.onRendered(function(){
    let ctx = document.getElementById("myChart").getContext('2d');
    this.autorun(()=>{
        this.subscribe("userShops",function(){
            var result = [],
                data = [],
                userId = Meteor.userId();
            for (var i=6; i>=0; i--) {
                data.push(Transactions.find({"transDate":moment().subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch().length);
                result.push( moment().subtract(i, 'days').format('dddd') );
            }

            var myChart = new Chart(ctx, {
                type: 'line',
                data:{
                    labels:result,
                    datasets:[
                        {
                            label:"Transactions",
                            fill:false,
                            pointBorderWidth:5,
                            pointStyle:'circle',
                            lineTension:0.5,
                            borderColor:"rgb(70, 36, 113)",
                            data:data
                        }
                    ]
                },
                options:{
                    responsive:false,
                    scales:{
                        yAxes:[
                            {
                                ticks: {
                                    beginAtZero:true,
                                    stepSize: 1
                                }
                            }
                        ]
                    },
                    legend:{
                        display:false
                    }
                }
            });
        });

        
    });
});

Template.singleShopLayout.onCreated(function(){
    var self = this;
    self.freepaidBalance = new ReactiveVar();

    Meteor.call("getBalance", function(error, result){
        if(error)
            throw err;

        let {errorcode,status,balance} = result.reply;

        if(errorcode.$value === "000" && status.$value === "1")
            self.freepaidBalance.set(balance.$value);
        else
            self.freepaidBalance.set(0);
    });

});

Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});

Template.singleShopLayout.helpers({
    getRouterGroupPrefix:function(){
        return FlowRouter.current().route.group.prefix;
    },
    getShopName:function(){
        return Shops.findOne({_id:FlowRouter.getParam("shopId")}).shopName;
    },
    getShopId:function(){
        return FlowRouter.getParam("shopId");
    },
    getPastTransactionNo:function(){
        return Transactions.find({"shopId":FlowRouter.getParam("shopId")}).fetch().length;
    },
    getProductsNo:function(){
        return ShopProducts.find({"shopId":FlowRouter.getParam("shopId"),"isShopProduct":"checked"}).fetch().length;
    },
    getTopSellingItems:function(){
        return _.chunk(TransactionsInfo(),10)[0];
    },
    getTopSellingBrands:function(){
        var topSellingItems = TransactionsInfo(),
            topSellingBrands = [];

        var groupTopSellingBrands = _.groupBy(topSellingItems,function(arg){
            return arg.brandName;
        });

        _.forEach(groupTopSellingBrands,function(groupBrand,i){
            var count = 0,tmpBrand={};
            
            _.forEach(groupBrand,function(product){
                count+=parseInt(product.totalCount);
            });
            
            tmpBrand.brandName = i;
            tmpBrand.totalCount = count;
            topSellingBrands.push(tmpBrand);
        });

        return _.chunk(_.orderBy(topSellingBrands, 'totalCount', 'desc'),10)[0];
    },
    getTodayRevenue: function(){
        var todayDate = moment().format("LL"),
            transactionsData = Transactions.find({"shopId":FlowRouter.getParam("shopId"),transDate:todayDate}).fetch(),
            todayRevenue = 0;

        _.forEach(transactionsData,function(data){
            todayRevenue += parseFloat(data.transTotal);
        });
        
        return _.round(todayRevenue, 2);
    },
    getlast7Revenue: function(){
        var totalRevenue = 0,
        transactionsData = [];

        for (var i=6; i>=0; i--) {
            transactionsData = Transactions.find({"transDate":moment().subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch();
            _.forEach(transactionsData,function(data){
                totalRevenue += parseFloat(data.transTotal);
            });
        }

        return _.round(totalRevenue, 2);
    },
    getlast30Revenue: function(){
        var totalRevenue = 0,
        transactionsData = [];

        for (var i=29; i>=0; i--) {
            transactionsData = Transactions.find({"transDate":moment().subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch();
            _.forEach(transactionsData,function(data){
                totalRevenue += parseFloat(data.transTotal);
            });
        }

        return _.round(totalRevenue, 2);
    },
    getTodayProfit: function(){
        var todayDate = moment().format("LL"),
            transactionsData = Transactions.find({"shopId":FlowRouter.getParam("shopId"),transDate:todayDate}).fetch(),
            todayProfit = 0;

        _.forEach(transactionsData,function(data){
            _.forEach(data.transProducts,function(product){
                var productData = Products.findOne({_id:product.product}),
                    productCustData = ShopProductsCustom.findOne({productId:product.product,shopId:FlowRouter.getParam("shopId")});

                if(productCustData) {
                    todayProfit += (parseFloat(productCustData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                } else {

                    todayProfit += (parseFloat(productData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                }
            });
        });
        
        return _.round(todayProfit, 2);
    },
    getlast7Profit: function(){
        var totalProfit = 0,
        transactionsData = [];

        for (var i=6; i>=0; i--) {
            transactionsData = Transactions.find({"transDate":moment().subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch();
            _.forEach(transactionsData,function(data){
                _.forEach(data.transProducts,function(product){
                    var productData = Products.findOne({_id:product.product}),
                        productCustData = ShopProductsCustom.findOne({productId:product.product,shopId:FlowRouter.getParam("shopId")});
    
                    if(productCustData) {
                        totalProfit += (parseFloat(productCustData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                    } else {
                        totalProfit += (parseFloat(productData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                    }
                });
            });
        }

        return _.round(totalProfit, 2);
    },
    getlast30Profit: function(){
        var totalProfit = 0,
        transactionsData = [];

        for (var i=29; i>=0; i--) {
            transactionsData = Transactions.find({"transDate":moment().subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch();
            _.forEach(transactionsData,function(data){
                _.forEach(data.transProducts,function(product){
                    var productData = Products.findOne({_id:product.product}),
                        productCustData = ShopProductsCustom.findOne({productId:product.product,shopId:FlowRouter.getParam("shopId")});
    
                    if(productCustData) {
                        totalProfit += (parseFloat(productCustData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                    } else {
                        totalProfit += (parseFloat(productData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                    }
                });
            });
        }

        return _.round(totalProfit, 2);
    },
    getShopWeeklyData: function(){
        var totalRevenue = 0,
            transactionsData = [],
            totalProfit = 0,
            fullTransData = [],
            fullTransProductsData = [];

        for (var i=6; i>=0; i--) {
            transactionsData = Transactions.find({"transDate":moment("04-November-2018","DD-MMMM-YYYY").subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch();
            _.forEach(transactionsData,function(data){
                totalRevenue += parseFloat(data.transTotal);
                _.forEach(data.transProducts,function(product){
                    var productData = Products.findOne({_id:product.product}),
                        productCustData = ShopProductsCustom.findOne({productId:product.product,shopId:FlowRouter.getParam("shopId")}),
                        brandData = Brands.findOne({_id:productData.Brand});
                        tmpProduct = {};
    
                    tmpProduct.ProductId = product.product;
                    tmpProduct.BrandName = brandData.brandName;
                    tmpProduct.ProductName = productData.itemName +" "+ productData.itemSize;
                    tmpProduct.StockPrice = productData.stockPrice;
                    if(productCustData) {
                        tmpProduct.SellingPrice = productCustData.sellingPrice;
                        totalProfit += (parseFloat(productCustData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                    } else {
                        tmpProduct.SellingPrice = productData.sellingPrice;
                        totalProfit += (parseFloat(productData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                    }
                    tmpProduct.ProductCount = product.item_count;

                    fullTransData.push(tmpProduct);
                });
            });
        }

        var groupedFullTransData =_.groupBy(fullTransData,function(arg){
            return arg.ProductId;
        });

        _.forEach(_.keys(groupedFullTransData), function(key){
            var transProductInfo = {};

            var productData = Products.findOne({_id:key}),
                productCustData = ShopProductsCustom.findOne({productId:key,shopId:FlowRouter.getParam("shopId")}),
                brandData = Brands.findOne({_id:productData.Brand});
                tmpProduct = {};
    
            tmpProduct.ProductId = key;
            tmpProduct.BrandName = brandData.brandName;
            tmpProduct.ProductName = productData.itemName +" "+ productData.itemSize;
            tmpProduct.StockPrice = productData.stockPrice;

            if(productCustData) {
                tmpProduct.SellingPrice = productCustData.sellingPrice;
            } else {
                tmpProduct.SellingPrice = productData.sellingPrice;
            }

            tmpProduct.TotalCount = _.reduce(groupedFullTransData[key],function(sum,value){
                return sum+parseInt(value.ProductCount);
            },0);
    
            // fullTransProductInfo.push(transProductInfo);
            fullTransProductsData.push(tmpProduct);
        });

        var PRData = [{
            'Profits':"R "+_.round(totalProfit, 2),
            'Revenue':"R "+_.round(totalRevenue, 2)
        }];

        // console.log(_.orderBy(fullTransProductsData, 'TotalCount', 'desc'));

        const Json2csvParser = require('json2csv').Parser;
        const fields = ['ProductId','BrandName','ProductName','StockPrice','SellingPrice','TotalCount'];
        const shopWeeklyProducts = _.orderBy(fullTransProductsData, 'TotalCount', 'desc');
        
        const json2csvParser = new Json2csvParser({ fields });
        // const csv = json2csvParser.parse(shopWeeklyProducts);
        const csv = json2csvParser.parse(shopWeeklyProducts, { fields:fields });
    },
    getFreepaidBalance: function(){
        
        return Template.instance().freepaidBalance.get();
        
    }
});

Template.singleShopLayout.events({
    'click #down-report':function(e){
        e.preventDefault();

        swal({
            title:"Download Shop Report",
            text:``,
            icon:"success", 
            button: "Download",
        }).then((complete) => {
            if(complete){
                var totalRevenue = 0,
                    transactionsData = [],
                    totalProfit = 0,
                    fullTransData = [],
                    fullTransProductsData = [];

                for (var i=29; i>=0; i--) {
                    transactionsData = Transactions.find({"transDate":moment("04 November 2018").subtract(i, 'days').format('LL'),shopId:FlowRouter.getParam("shopId")}).fetch();
                    _.forEach(transactionsData,function(data){
                        totalRevenue += parseFloat(data.transTotal);
                        _.forEach(data.transProducts,function(product){
                            var productData = Products.findOne({_id:product.product}),
                                productCustData = ShopProductsCustom.findOne({productId:product.product,shopId:FlowRouter.getParam("shopId")}),
                                brandData = Brands.findOne({_id:productData.Brand});
                                tmpProduct = {};
            
                            tmpProduct.ProductId = product.product;
                            tmpProduct.BrandName = brandData.brandName;
                            tmpProduct.ProductName = productData.itemName +" "+ productData.itemSize;
                            tmpProduct.StockPrice = productData.stockPrice;
                            if(productCustData) {
                                tmpProduct.SellingPrice = productCustData.sellingPrice;
                                totalProfit += (parseFloat(productCustData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                            } else {
                                tmpProduct.SellingPrice = productData.sellingPrice;
                                totalProfit += (parseFloat(productData.sellingPrice) - parseFloat(productData.stockPrice))*product.item_count;
                            }
                            tmpProduct.ProductCount = product.item_count;

                            fullTransData.push(tmpProduct);
                        });
                    });
                }

                var groupedFullTransData =_.groupBy(fullTransData,function(arg){
                    return arg.ProductId;
                });

                _.forEach(_.keys(groupedFullTransData), function(key){
                    var transProductInfo = {};

                    var productData = Products.findOne({_id:key}),
                        productCustData = ShopProductsCustom.findOne({productId:key,shopId:FlowRouter.getParam("shopId")}),
                        brandData = Brands.findOne({_id:productData.Brand});
                        tmpProduct = {};
            
                    tmpProduct.ProductId = key;
                    tmpProduct.BrandName = brandData.brandName;
                    tmpProduct.ProductName = productData.itemName +" "+ productData.itemSize;
                    tmpProduct.StockPrice = productData.stockPrice;

                    if(productCustData) {
                        tmpProduct.SellingPrice = productCustData.sellingPrice;
                    } else {
                        tmpProduct.SellingPrice = productData.sellingPrice;
                    }

                    tmpProduct.TotalCount = _.reduce(groupedFullTransData[key],function(sum,value){
                        return sum+parseInt(value.ProductCount);
                    },0);
            
                    // fullTransProductInfo.push(transProductInfo);
                    fullTransProductsData.push(tmpProduct);
                });

                var PRData = [{
                    'Profits':"R "+_.round(totalProfit, 2),
                    'Revenue':"R "+_.round(totalRevenue, 2)
                }];

                console.log(PRData);

                const Json2csvParser = require('json2csv').Parser;
                const fields = ['ProductId','BrandName','ProductName','StockPrice','SellingPrice','TotalCount'];
                const shopWeeklyProducts = _.orderBy(fullTransProductsData, 'TotalCount', 'desc');
                
                const json2csvParser = new Json2csvParser({ fields });
                // const csv = json2csvParser.parse(shopWeeklyProducts);
                const csv = json2csvParser.parse(shopWeeklyProducts, { fields:fields });
                Meteor.call('createFile', csv, function(err, result){
                    if(err)
                        throw err;

                    window.open(`${Meteor.absoluteUrl()}/reports/shop-data.csv`, '_blank')
                });
            }
        });
    }
});