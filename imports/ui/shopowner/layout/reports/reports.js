import './reports.html';
import { Transactions, Promos, ShopProducts, Shops } from '../../../../startup/both/collections';

let moment = require('moment');
var ctx = null;

Template.shopownerReportsLayout.onRendered(function(){
    let ctx = document.getElementById("myChart").getContext('2d');
    this.autorun(()=>{
        this.subscribe("userShops",function(){
            var result = [],
                data = [],
                userId = Meteor.userId();
            for (var i=6; i>=0; i--) {
                console.log(moment().subtract(i, 'days').format('LL'),Transactions.find({}).fetch())
                data.push(Transactions.find({"transDate":moment().subtract(i, 'days').format('LL')}).fetch().length);
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