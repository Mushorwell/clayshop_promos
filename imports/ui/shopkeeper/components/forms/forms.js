import './pp-airtime-form.html';
import './pp-electricity-form.html';
import { Meteor } from 'meteor/meteor';
import { PrepaidLogs, Shops } from "../../../../startup/both/collections";
import { FREEPAID_ERRORCODES } from "../../../../startup/both/constants";
import Swal from 'sweetalert2';

const moment = require('moment');

Template.ppAirtimeForm.events({
    'click .btnSellAirtime':function(event){
        event.preventDefault();

        let networkName = $("#selNetwork").val(),
            voucherAmnt = $("#numVoucherAmnt").val(),
            mobileNum = $("#telMobileNumber").val(),
            pinnedVoucher = $("#cbPinnedVoucher").prop("checked"),
            sellAirtimeMethod = "sellPinlessAirtime";

        if(pinnedVoucher) {
            sellAirtimeMethod = "sellPinnedAirtime";
            networkName = networkName.split("-").pop();
        }
        
        if(networkName && voucherAmnt && mobileNum) {
            if(mobileNum.match(/\d/g).length!==10){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Please validate the Phone Number! Here is an example: 0812345678'
                });
                return;
            }

            let refno = moment().format('YYYYMMDDhmmss')+"airtime"+networkName+voucherAmnt;
            Meteor.call(sellAirtimeMethod,{refno, network:networkName, sellvalue:voucherAmnt, extra:mobileNum}, function(error, result){
                if(error)
                    return;
    
                let {errorcode,orderno,status,message} = result.reply;

                if(status.$value === "1") {
                    switch(errorcode.$value) {
                        case FREEPAID_ERRORCODES.airtimeOKAY:
                            if(pinnedVoucher) {
                                Meteor.call("getPinnedOrder",{orderno:orderno.$value}, function(error, results){
                                    if(error)
                                        return;
                            
                                    let {errorcode,vouchers,status,orderno} = results.reply;
                                    
                                    if(status.$value === "1" && errorcode.$value === FREEPAID_ERRORCODES.airtimeOKAY) {
                                        debugger
                                        let voucherItem = vouchers.item;
                                        let networkName = voucherItem.network.$value === "heita" ? "Telkom Mobile" : voucherItem.network.$value.toUpperCase();

                                        let message = `Network:${networkName}\nVoucher Amount: R ${voucherItem.sellvalue.$value}\nVoucher Pin : ${voucherItem.pin.$value}\nSerial: ${voucherItem.serial.$value}`;

                                        Meteor.call("sendSMS",{mobile:mobileNum,message},function(error, result){

                                            if(error)
                                                console.log(error);

                                            debugger
                                            console.log(result);
                                        });
                                    }
                                });
                            }
                            break;
                        case FREEPAID_ERRORCODES.airtimePENDING:
                            if(!pinnedVoucher){
                                Meteor.call("getOrderStatus", {orderno}, function(error, result){
                                    if(error)
                                        return;

                                    debugger
                                    console.log(result);
                                });
                            }
                            break;
                        default:
                            break;
                    }
                    debugger
                    PrepaidLogs.insert({
                        shop:Shops.findOne({"shopKeeper":Meteor.userId()})._id,
                        network:networkName,
                        sellvalue:voucherAmnt,
                        refno,
                        orderno:orderno.$value,
                        errorcode:errorcode.$value,
                        pinnedVoucher,
                        date:moment().format('YYYY-MM-DD, h:mm:ss')
                    });
                    // if(errorcode.$value === "001") {
                    //     Meteor.call("getOrderStatus", {orderno}, function(error, result){
                    //         if(error)
                    //             return;

                    //         console.log(result);
                    //     });
                    // }
                }

            });
        } else {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: "Please make sure you've completed all the fields!"
            });
        }
    },
});

Template.ppElectricityForm.events({
    'click .btnSellElectricity':function(event){
        event.preventDefault();

        let voucherAmnt = $("#numElecVoucherAmnt").val(),
            mobileNum = $("#telElecMobileNumber").val();
        
        if(mobileNum && voucherAmnt ) {
            let refno = moment().format('YYYYMMDDhmmss')+"electricityEskom"+voucherAmnt;

            Meteor.call("sellElectricity",{sellvalue:voucherAmnt,refno}, function(error, result){
                if(error)
                    return;
    
                    let {errorcode,orderno,status,message} = result.reply;
                    
                    if(status.$value === "1") {
                        switch(errorcode.$value) {
                            case FREEPAID_ERRORCODES.airtimeOKAY:
                                Meteor.call("getPinnedOrder",{orderno:orderno.$value}, function(error, results){
                                    
                                    if(error)
                                        return;
                            
                                    let {errorcode,vouchers,status,orderno} = results.reply;
                                    
                                    if(status.$value === "1" && errorcode.$value === FREEPAID_ERRORCODES.airtimeOKAY) {
                                        let voucherItem = vouchers.item;
                                        let message = `Electricity Voucher\n\nVoucher Amount: R ${voucherItem.sellvalue.$value}\nVoucher Pin : ${voucherItem.pin.$value}\nSerial: ${voucherItem.serial.$value}\n\nTo get your Token, dial *130*1111*${voucherItem.pin.$value}# (Free)`;

                                        Meteor.call("sendSMS",{mobile:mobileNum,message},function(error, result){

                                            debugger
                                            if(error)
                                                console.log(error);

                                            
                                            console.log(result);
                                        });
                                    }
                                });
                                
                                break;
                            case FREEPAID_ERRORCODES.airtimePENDING:
                                Meteor.call("getOrderStatus", {orderno}, function(error, result){
                                    if(error)
                                        return;
    
                                    console.log(result);
                                });
                                break;
                            default:
                                break;
                        }
                        PrepaidLogs.insert({
                            shop:Shops.findOne({"shopKeeper":userId})._id,
                            network:"Eskom",
                            sellvalue:voucherAmnt,
                            refno,
                            orderno:orderno.$value,
                            errorcode:errorcode.$value,
                            pinnedVoucher:true,
                            date:moment().format('YYYY-MM-DD, h:mm:ss')
                        });
                        // if(errorcode.$value === "001") {
                        //     Meteor.call("getOrderStatus", {orderno}, function(error, result){
                        //         if(error)
                        //             return;
    
                        //         console.log(result);
                        //     });
                        // }
                    }
            });
        }
        
    }
});