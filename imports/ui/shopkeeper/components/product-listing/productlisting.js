import './productlisting.html';
import './newtransactionproductlisting.html';

Template.shopkeeperNewTransactionListing.events({
    'click .productlisting':function(event){
        event.preventDefault();
        console.log("test")

        $(event.currentTarget).find("#btn-drawer-cart")[0].click();
    }
});