import './pageactions.html';
import "./pagenav.html";

import { ProductCategories } from '../../../../startup/both/collections';


Template.shopkeeperNewTransactionPageActions.helpers({
    getProductCategories:function(){
        return ProductCategories.find({}).fetch();
    }
});

Template.shopkeeperNewTransactionPageActions.events({
    'click .btn-drawer':function(e){
        let selectedItem =  $("input.product-find")[1].value;
        $(".cm-table-wrapper tbody>tr").each(( index,thisProd) => {
            let thisProductName = $(thisProd).find("td:first-child")[0];
            if($(thisProductName).text() === selectedItem ){
                $(thisProd).click();
                return;
            }

        });
    },
    'change #selProductCategory':function(e){
        Session.set('currentProductCategory', $(e.currentTarget).val());
    }
});