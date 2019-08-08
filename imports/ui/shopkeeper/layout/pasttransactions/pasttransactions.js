import './pasttransactions.html';
import { Transactions, Shops } from '../../../../startup/both/collections';

Template.shopkeeperPastTransactionsLayout.helpers({
    getTransactions:function(){
        let userId = Meteor.userId(),
            shopId = Shops.findOne({"shopKeeper":userId})._id,
            transData = Transactions.find({"shopId":shopId}).fetch(),
            fullTransData = [];
        transData.forEach(function(data,index){
            let fullTranData = {},
                item_count = 0;

            fullTranData.transId = data._id;
            fullTranData.transTotal = data.transTotal;
            fullTranData.transCash = data.transCash || 0;
            fullTranData.transDate = data.transDate+", "+data.transTime;
            
            data.transProducts.forEach(function(prods,i){
                item_count += parseInt(prods.item_count);
            });
            fullTranData.itemCount = item_count;

            fullTransData.push(fullTranData);
        });

        return fullTransData;
    }
});