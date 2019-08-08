import './shoplogs.html';
import { ShopKeepersLogs, Shops } from '../../../../startup/both/collections';

Template.shopLogsLayout.helpers({
    getShopLogs:function(){
        var currShopId = FlowRouter.getParam("shopId");

        var shopLogsData = ShopKeepersLogs.find({shopId:currShopId}),
            fullLogsData = [];

        shopLogsData.forEach(function(data){
            let { userId, shopId, date, _id } = data,
                fullLogData = {};
            
            let { shopName } = Shops.findOne({ _id: shopId });
            let { firstName } = Meteor.users.findOne({ _id: userId }).profile;

            fullLogData.shopName = shopName;
            fullLogData.shopkeeperName = firstName;
            fullLogData.logId = _id;
            fullLogData.date = date;

            fullLogsData.push(fullLogData);
        });

        return fullLogsData;
    }
});