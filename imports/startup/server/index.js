import { Meteor } from 'meteor/meteor';
import { Shops, Products, ShopKeepers } from '../both/collections';

const fs = require('fs'),
    stringify = require('csv-stringify'),
    strongSoap = require('strong-soap').soap,
    convertXMLJS = require('xml-js'),
    Future = Npm.require("fibers/future");

const freepaidApiUrl = 'http://ws.dev.freepaid.co.za/airtimeplus/?wsdl',
    freepaidPOSApiUrl = 'https://ws.freepaid.co.za/register/?wsdl';

Meteor.startup(() => {
    // code to run on server at startup
});

Meteor.methods({
    insertUser:function(newUserData){
        var userId = Accounts.createUser(newUserData);
        Accounts.setPassword(userId, newUserData.password);
        Roles.addUsersToRoles(userId, ["normal-user",newUserData.profile.userType]);
        return userId;
    },
    removeUser:function(currShopId){
        var shopData = Shops.findOne({_id:currShopId});

        Shops.remove(currShopId);
        ShopKeepers.remove(shopData.shopKeeper);
        
        return Meteor.users.remove(shopData.shopKeeper);
    },
    getBalance:function(){
        let future = new Future(),
            options = {};

        let request = {
            "request":
                {
                    user:5045854,
                    pass:'1010310mM'
                }
            };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                future.throw(err);

            let method = client.fetchBalance;
            
            method(request, function(err, result, envelope, soapHeader) {
                if (err)
                    future.throw(err);
                    
                future.return(result);
            });
        });

        return future.wait();
    },
    getProducts:function(){
        let future = new Future(),
            options = {};

        let request = {
            request: 
                {
                    user:5045854,
                    pass:'1010310mM'
                }
            };
            
        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                future.throw(err);

            var method = client.fetchProducts;
            
            method(request, function(err, result, envelope, soapHeader) {
                if (err)
                    future.throw(err);

                future.return(result);
            });
        });

        return future.wait();
    },
    sellPinlessAirtime:function(inputData){
        let future = new Future(),
            options = {};

        let {refno, network, sellvalue, extra} = inputData;

        var request = {
            "request":
                {
                    user: 5045854,
                    pass: '1010310mM',
                    refno,
                    network,
                    sellvalue,
                    count:"1",
                    extra
                }
            };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                throw err;

            var method = client.placeOrder;
            
            method(request, function(err, result, envelope, soapHeader) {
                if(err)
                    future.throw(err);
                    
                future.return(result);
            });
        });

        return future.wait();
    },
    sellPinnedAirtime:function(inputData){
        let future = new Future(),
            options = {};

        let {refno, network, sellvalue, extra} = inputData;
        debugger
        var request = {
            "request":
                {
                    user: 5045854,
                    pass: '1010310mM',
                    refno,
                    network,
                    sellvalue,
                    count:"1",
                    extra:""
                }
            };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                throw error;

            var method = client.placeOrder;
            
            method(request, function(err, result, envelope, soapHeader) {
                if (err)
                    future.throw(err);
                    
                future.return(result);
            });
        });

        return future.wait();
    },
    sellElectricity:function(inputData){
        let future = new Future(),
            options = {};

        let {refno, sellvalue} = inputData;
        
        var request = {
            "request":
                {
                    user: 5045854,
                    pass: '1010310mM',
                    refno,
                    network:"eskom",
                    sellvalue,
                    count:"1",
                    extra:""
                }
            };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                throw error;

            var method = client.placeOrder;
            
            method(request, function(err, result, envelope, soapHeader) {
                if (err)
                    future.throw(err);
                    
                future.return(result);
            });
        });

        return future.wait();
    },
    getPinnedOrder:function(inputData) { // Fetch Pinned Order
        let future = new Future(),
            options = {};

        let { orderno } = inputData;

        let request = {
            request : 
                {
                    user: 5045854,
                    pass: '1010310mM',
                    orderno
                }
        };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                future.throw(err);

            var method = client.fetchOrder;
            
            method(request, function(err, result, envelope, soapHeader) {
                if (err)
                    future.throw(err);
                    
                future.return(result);
            });
        });

        return future.wait();
    },
    getOrderStatus: function(inputData){ // Query Pinless Order

        let future = new Future(),
            options = {};

        let { orderno } = inputData;

        let request = {
            request : 
                {
                    user: 5045854,
                    pass: '1010310mM',
                    orderno
                }
        };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                future.throw(err);

            var method = client.queryOrder;
            
            method(request, function(err, result, envelope, soapHeader) {
                if(err)
                    future.throw(err);
                
                future.return(result);
            });
        });

        return future.wait();
    },
    getAllOrders: function(){
        let future = new Future(),
            options = {};

        let request = {
            request : 
                {
                    user: 5045854,
                    pass: '1010310mM',
                    last:"2019040605263702"
                }
        };

        strongSoap.createClient(freepaidApiUrl, options, function(err, client) {
            if (err)
                future.throw(err);

            var method = client.fetchOrderLatest;
            
            method(request, function(err, result, envelope, soapHeader) {
                if(err)
                    future.throw(err);
                
                future.return(result);
            });
        });

        return future.wait();
    },
    createFreepaidAccount:function(inputData){
        let future = new Future(),
            options = {};

        let {cell, email, password} = inputData;

        let request = {
                'agentuser': Meteor.settings.public.tefoFPA.user,
                "agentpassword": Meteor.settings.public.tefoFPA.pass,
                cell,
                email,
                password
            };

        strongSoap.createClient(freepaidPOSApiUrl, options, function(err, client) {
            if(err)
                future.throw(err);

            let method = client.register.registerPort.register;

            method(request, function(err, result, envelope, soapHeader) {
                if(err)
                    future.throw(err);
                
                future.return(result);
            });
        });
        
        return future.wait();
    },
    createFile:function(dataToWrite){
        fs.writeFile(process.env.PWD + '/public/'+'reports/shop-data.csv',dataToWrite, 'utf8', function(err){
            if(err)
                throw err;

            return true;
        });
    },
    sendSMS:function(inputData) {

        let { mobile, message} = inputData;

        try {
            const result = HTTP.call('POST', 'https://www.logicsms.co.za/postmsg2.aspx', {
                params: {
                    username: 'Admin@Pavilion',
                    password: 'qw742F58F',
                    message,
                    mobile,
                    Originator: "LogicSMS"
                }
            });

            return result;
      
        } catch (e) {
            return e;
        }
    },
    generatePasswords:function() {
        let randomNumber = Math.floor(Math.random() * 901)+100;
        let possibleLetters = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK";
        let passwords = [];
        let randomLetters = "",
            songID="";

        for(let j = 0;j < 100; j++){
            randomLetters = "";

            for(let i=0;i<9;i++) {
                randomLetters += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
            }

            passwords.push(randomLetters);

            fs.writeFile(process.env.PWD + '/public/'+'reports/passwords.csv',passwords, 'utf8', function(err){
                if(err)
                    throw err;
    
                return true;
            });
        }

        console.log(passwords);
        // return randomLetters+"mb"+randomNumber;
    }
});

// Publisher
Meteor.publish('allUsers',function(){
    if(Roles.userIsInRole(this.userId, 'admin-user')){
        return Meteor.users.find({});
    } 
});

Meteor.publish('userShops',function(){
    return Shops.find({});
});

Meteor.publish('Products',function(){
    return Products.find({});
});

AccountsTemplates.configure({
    postSignUpHook: function(userId, info){
        var user_type = info.profile.userType;
        var main_role = "normal-user";

        if(user_type === "superAdmin"){
            main_role = "admin-user";
        }

        Roles.addUsersToRoles(userId, [main_role,user_type]);
    }
});

// const soapRequest = require('easy-soap-request');
// const fs = require('fs');

// // example data
// const url = 'https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php';
// const headers = {
//   'user-agent': 'sampleTest',
//   'Content-Type': 'text/xml;charset=UTF-8',
//   'soapAction': 'https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode',
// };
// const xml = fs.readFileSync('test/zipCodeEnvelope.xml', 'utf-8');

// // usage of module
// // (async () => {
// //   const { response } = await soapRequest(url, headers, xml);
// //   const { body, statusCode } = response;
// //   console.log(body);
// //   console.log(statusCode);
// // })();