import './shoptransactions.html';
import { Transactions, Shops } from '../../../../startup/both/collections';

Template.shopTransactionsLayout.helpers({
    getTransactions:function(){
        let transData = Transactions.find({"shopId":FlowRouter.getParam("shopId")}).fetch(),
            fullTransData = [];
        transData.forEach(function(data,index){
            let fullTranData = {},
                item_count = 0;

            fullTranData.transID = data._id;
            fullTranData.transTotal = data.transTotal;
            fullTranData.transDate = data.transDate;
            fullTranData.transTime = data.transTime;
            
            data.transProducts.forEach(function(prods,i){
                item_count += parseInt(prods.item_count);
            });
            fullTranData.itemCount = item_count;

            fullTransData.push(fullTranData);
        });

        return fullTransData;
    },
    getShopName:function(){
        return Shops.findOne({_id:FlowRouter.getParam("shopId")}).shopName + ", Transactions";
    }
});

Template.shopTransactionsLayout.events({
    'click .delete-data'(event){
        event.preventDefault();
        var shop_id = FlowRouter.getParam("shopId");

        swal({
            title: "Are you sure you want to delete past transactions for this shop?",
            text: "Note that you can't retrieve this data after deleting it.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                Meteor.call("clearTransactionData",shop_id,function(err,data){
                    if(err)
                        throw null;

                    swal("Poof! You have successfully deleted your shop's transaction history", {
                        icon: "success",
                    });
                });
                
            }
        });
    }
});