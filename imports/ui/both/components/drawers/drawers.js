import './logview-drawer.html';

import { Shops, ShopKeepersLogs } from '../../../../startup/both/collections';

Template.shopLogViewDrawer.helpers({
    getLogInfo:function(){
        let log_id = Session.get("currentLogId");

        let { userId, shopId, date, cashAtHand, suggestions } = ShopKeepersLogs.findOne({_id: log_id});

        let { shopName } = Shops.findOne({ _id: shopId });
        let { firstName } = Meteor.users.findOne({ _id: userId }).profile;

        return {shopName, shopkeeperName:firstName, date, cashAtHand, suggestions };
    },
    hasLogSelected:function(){
        return Session.get("currentLogId") !== undefined;
    }
});