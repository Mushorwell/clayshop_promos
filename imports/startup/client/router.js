import { Meteor } from "meteor/meteor";

import "../../ui/";
import { Shops } from "../both/collections";

FlowRouter.route("/", {
    name:"main-route",
    action:function(){
        
        $("body").removeClass();
        BlazeLayout.render("Login");
        $("body").addClass("login-page");
    }
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
    action:function() {
        console.log("Page Not Found");
    }
};

// Super Admin Routes
let superAdminRoutes = FlowRouter.group({
    prefix:'/admin',
    name:'admin-route'
});

superAdminRoutes.route("/", {
    name:"admin-home",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'superadminHome'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/shops", {
    name:"admin-shops",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'Shops'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/shop/:shopId",{
    name:"admin-single-shop",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        
        // if(Shops.findOne({_id:params.shopId}))
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'singleShop'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/shop-products/:shopId",{
    name:"admin-shop-products",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'shopProducts'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/shop-transactions/:shopId",{
    name:"admin-shop-transactions",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'shopTransactions'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/shop-settings/:shopId",{
    name:"admin-shop-settings",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'shopSettings'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/shop-logs/:shopId",{
    name:"admin-shop-logs",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'shopLogss'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/users", {
    name:"admin-users",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'superadminUsers'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/logs/:userID", {
    name:"admin-users",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'superadminUserLogs'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/newuser", {
    name:"admin-newuser",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'superadminNewUser'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/promos", {
    name:"admin-promos",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'superadminPromos'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/newpromo", {
    name:"admin-newpromo",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'superadminNewPromo'});
        $("body").addClass(this.name);
    }
});

superAdminRoutes.route("/settings", {
    name:"admin-settings",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'superadminSideNav',pageContent:'Settings'});
        $("body").addClass(this.name);
    }
});

//Shop Owner Routes
let shopOwnerRoutes = FlowRouter.group({
    prefix:'/shop-owner',
    name:'shop-owner-route'
});

let shopOwnerShopRoutes = shopOwnerRoutes.group({
    prefix:'/shop',
    name:'shop-owner-shop-route'
});

shopOwnerRoutes.route("/",{
    name:"shop-owner-home",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopownerHome'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/shops",{
    name:"shop-owner-shops",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'Shops'});
        $("body").addClass(`${this.name}`);
    }
});

shopOwnerRoutes.route("/products",{
    name:"shop-owner-products",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopownerProducts'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/newshop",{
    name:"shop-owner-newshop",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopownerNewShop'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/new-product",{
    name:"shop-owner-new-product",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopownerNewProduct'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/shop/:shopId",{
    name:"shop-owner-single-shop",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'singleShop'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/shop-products/:shopId",{
    name:"shop-owner-shop-products",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopProducts'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/shop-transactions/:shopId",{
    name:"shop-owner-shop-transactions",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopTransactions'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/shop-settings/:shopId",{
    name:"shop-owner-shop-settings",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopSettings'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/shop-logs/:shopId",{
    name:"shop-owner-shop-logs",
    waitOn:function(){
        return Meteor.subscribe('userShops');
    },
    action:function(params, queryParams){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopLogs'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/promos",{
    name:"shop-owner-promos",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopownerPromos'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/settings", {
    name:"shop-owner-settings",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'Settings'});
        $("body").addClass(this.name);
    }
});

shopOwnerRoutes.route("/reports", {
    name:"shop-owner-reports",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopownerSideNav',pageContent:'shopownerReports'});
        $("body").addClass(this.name);
    }
});

//Shop Keeper Routes
let shopKeeperRoutes = FlowRouter.group({
    prefix:'/shop-keeper',
    name:'shop-keeper-route'
});

shopKeeperRoutes.route("/",{
    name:"shop-keeper-home",
    waitOn: function () {
        console.log("test");
        return Meteor.subscribe('userShops');
    },
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperHome'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/products",{
    name:"shop-keeper-products",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperProducts'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/new-transaction",{
    name:"shop-keeper-new-transaction",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperNewTransaction'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/past-transactions",{
    name:"shop-keeper-past-transactions",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperPastTransactions'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/tickets",{
    name:"shop-keeper-tickets",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperTickets'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/prepaid",{
    name:"shop-keeper-prepaid",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperPrepaid'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/promos",{
    name:"shop-keeper-promos",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'shopkeeperPromos'});
        $("body").addClass(this.name);
    }
});

shopKeeperRoutes.route("/settings", {
    name:"shop-keeper-settings",
    action:function(){
        if(!Meteor.userId()){
            FlowRouter.go("main-route");
            return;
        }
        $("body").removeClass();
        BlazeLayout.render("MainLayout",{sideNav:'shopkeeperSideNav',pageContent:'Settings'});
        $("body").addClass(this.name);
    }
});