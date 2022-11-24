// const chai = require('chai');
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// chai.should();

// const app = require('../server');
// var agent = chai.request.agent(app);

// describe('Internal Orders', () => {

//     const managerRole = "manager"
//     const customerRole = "customer"
//     const supplierRole = "supplier"
//     const clerkRole = "clerk"
//     const qualityEmployeeRole = "qualityEmployee"
//     const deliveryEmployeeRole = "deliveryEmployee"

//     before(async ()=>{        
//         let sku1 = { description: "sku description1", weight: 10, volume: 5, notes: "first sku", price: 10.99, availableQuantity: 10};
//         let sku2 = { description: "sku description2", weight: 100, volume: 50, notes: "second sku",  price: 15.59, availableQuantity: 50}; 
//         let skuItem1 = { RFID: "12345678901234567890123456789015", SKUId: 1, DateOfStock :"2021/11/29 12:30" }
//         let skuItem2 = { RFID: "12345678901234567890123456789016", SKUId: 1, DateOfStock: "2021/11/29 12:31" } 
//         let skuItem3 = { RFID: "12345678901234567890123456789017", SKUId: 2, DateOfStock: "2021/11/29 12:32" } 
//         let skuItem4 = { RFID: "12345678901234567890123456789018", SKUId: 2, DateOfStock: "2021/11/29 12:33" } 
        
//         await agent.post('/api/sku/')
//             .set("Cookie", "type=manager")   
//             .send(sku1);

//         await agent.post('/api/sku/')
//             .set("Cookie", "type=manager")   
//             .send(sku2);  
            
//         await agent.post('/api/skuitem/')
//             .set("Cookie", "type=manager")   
//             .send(skuItem1);

//         await agent.post('/api/skuitem/')
//             .set("Cookie", "type=manager")   
//             .send(skuItem2);
//         await agent.post('/api/skuitem/')
//             .set("Cookie", "type=manager")   
//             .send(skuItem3);

//         await agent.post('/api/skuitem/')
//             .set("Cookie", "type=manager")   
//             .send(skuItem4);
//     })
    
//     //Creating new internal order
//     //todo: should fix the details
    
//     const correctInternlOrder1 = {
//         issueDate:"2022/05/20 09:33",
//         products: [
//             {SKUId : 1, description : "sku description1", price : 10.99, qty : 3},
//             {SKUId : 2, description : "sku description2", price : 15.59, qty : 3}
//         ],
//         customerId : 1
//     }
//     const correctInternlOrder2 = {
//         issueDate:"2022/05/21 19:00",
//         products: [
//             {SKUId : 1, description : "sku description1", price : 10.99, qty : 4},
//             {SKUId : 2, description : "sku description2", price : 15.59, qty : 5}
//         ],
//         customerId : 1
//     }
//     const correctInternlOrder3 = {
//         issueDate:"2022/05/20 10:33",
//         products: [
//             {SKUId : 1, description : "sku description1", price : 10.99, qty : 4}
//         ],
//         customerId : 1
//     }
//     const wrongOrderDetails = {
//         issueDate:"2022/05/20 09:33",
//         products: [
//             {SKUId : 1, description : "sku description1", price : 10.99, qty : 4},
//             {SKUId : 2, description : "sku description2", price : 15.59, qty : 5}
//         ]
//     }

//     createInternalOrder(401, "create new internal order (unauthorized)", supplierRole, correctInternlOrder1);
//     createInternalOrder(422, "create new internal order (Unprocessable Entity)", managerRole, wrongOrderDetails);
//     createInternalOrder(201, "create new internal order (authorized)", managerRole, correctInternlOrder1);
//     createInternalOrder(201, "create new internal order (authorized)", managerRole, correctInternlOrder2);
//     createInternalOrder(201, "create new internal order (authorized)", managerRole, correctInternlOrder3);
    
//     /*
//     //Modify internal order
//     //todo: should fix the details
//     const correctInternalOrderId1ForEditing = 1;
//     const correctInternalOrderId2ForEditing = 2;
//     const wrongInternalOrderIdForEditing = 999;
//     const correctInternalOrder1ReqForEditing = {
//         newState : "ACCEPTED"
//     };
//     const correctInternalOrder2ReqForEditing = {
//         newState : "COMPLETED",
//         products : [
//             {SkuID:1,RFID:"12345678901234567890123456789015"},
//             {SkuID:1,RFID:"12345678901234567890123456789016"}
//         ]
        
//     };
//     const wrongInternalOrderReqForEditing = {
//         newState : "COMPLETED"
//     };

//     modifyInternalOrder(401, "modify internal order (unauthorized)", supplierRole, correctInternalOrderId1ForEditing, correctInternalOrder1ReqForEditing);
//     modifyInternalOrder(404, "modify internal order (Not Found)", managerRole, wrongInternalOrderIdForEditing, correctInternalOrder1ReqForEditing);
//     modifyInternalOrder(422, "modify internal order (Unprocessable Entity)", managerRole, correctInternalOrderId1ForEditing, wrongInternalOrderReqForEditing);
//     modifyInternalOrder(200, "modify internal order (authorized)", managerRole, correctInternalOrderId1ForEditing, correctInternalOrder1ReqForEditing);
//     modifyInternalOrder(200, "modify internal order (authorized)", managerRole, correctInternalOrderId2ForEditing, correctInternalOrder2ReqForEditing);


//     //TODO: add id in the end of function
//     //Getting interal order by id
//     const correctInternalOrderId1 = 1;
//     const correctInternalOrderId2 = 2;
//     const wrongInternalOrderId1 = "X";
//     const wrongInternalOrderId2 = 999;
//     getInternalOrderById(401, "getting internal order by id (unauthorized)", customerRole, correctInternalOrderId1);
//     getInternalOrderById(404, "getting internal order by id (Not Found)", managerRole, wrongInternalOrderId2);
//     getInternalOrderById(422, "getting internal order by id (Unprocessable Entity)", managerRole, wrongInternalOrderId1);
//     getInternalOrderById(200, "getting internal order by id (authorized)", managerRole, correctInternalOrderId1);
//     getInternalOrderById(200, "getting internal order by id (authorized)", managerRole, correctInternalOrderId2);

    
//     //Getting all internal orders
//     getInternalOrders(401, "getting internal orders (unauthorized)", customerRole);       
//     getInternalOrders(200, "getting internal orders (authorized)", managerRole);

    
//     //Getting issued interanl orders
//     getIssuedInternalOrders(401, "getting issued internal orders (unauthorized)", supplierRole);
//     getIssuedInternalOrders(200, "getting issued internal orders (authorized)", managerRole);

//     //Getting accepted interal orders
//     getAcceptedInternalOrders(401, "getting accepted internal orders (unauthorized)", customerRole);
//     getAcceptedInternalOrders(200, "getting accepted internal orders (authorized)", managerRole);

    
//     //Delete internal order
//     //todo: should fix the details
//     const correctInternalOrder1IdForDeleting = 1;
//     const correctInternalOrder2IdForDeleting = 1;
//     const correctInternalOrder3IdForDeleting = 1;
//     const wrongInternalOrderIdForDeleting = 2;
//     deleteInternalOrder(401, "deleting internal order (unauthorized)", customerRole, correctInternalOrder1IdForDeleting);
//     deleteInternalOrder(422, "deleting internal order (Unprocessable Entity)", managerRole, wrongInternalOrderIdForDeleting);
//     deleteInternalOrder(204, "deleting internal order (authorized)", managerRole, correctInternalOrder1IdForDeleting);
//     deleteInternalOrder(204, "deleting internal order (authorized)", managerRole, correctInternalOrder2IdForDeleting);
//     deleteInternalOrder(204, "deleting internal order (authorized)", managerRole, correctInternalOrder3IdForDeleting);
//     */

//     after(async () => {
//         await agent.delete('/api/skus/' + 1)
//             .set("Cookie", "type=manager");

//         await agent.delete('/api/skus/' + 2)
//             .set("Cookie", "type=manager");   
            
//         await agent.delete('/api/skuitems/' + "12345678901234567890123456789015")
//             .set("Cookie", "type=manager");
//         await agent.delete('/api/skuitems/' + "12345678901234567890123456789016")
//             .set("Cookie", "type=manager");
//         await agent.delete('/api/skuitems/' + "12345678901234567890123456789017")
//             .set("Cookie", "type=manager");
//         await agent.delete('/api/skuitems/' + "12345678901234567890123456789018")
//             .set("Cookie", "type=manager");
//     })
// });

// function getInternalOrders(expectedHTTPStatus, testName, userType) {
//     it(testName, function (done) {
//         agent.get('/api/internalOrders')
//             .set("Cookie", "type=".concat(userType))   
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 if(expectedHTTPStatus == 200){
//                     res.body.should.be.an('array');
//                     res.body.forEach(item => {                    
//                         // item.should.have.all.keys("id", "issueDate", "state", "products", "customerId");
//                         // if (item.state === "COMPLETED") {
//                         //     item.products.should.have.all.keys("SKUId", "description", "price", "RFID")
//                         // } else {
//                         //     item.products.should.have.all.keys("SKUId", "description", "price", "qty")
//                         // }
//                     });                
//                 }
//                 done();
//             });
//     });
// };

// function getIssuedInternalOrders(expectedHTTPStatus, testName, userType) {
//     it(testName, function (done) {
//         agent.get('/api/internalOrdersIssued')
//             .set("Cookie", "type=".concat(userType))   
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 if(expectedHTTPStatus == 200){
//                     // res.body.forEach(item => { 
//                     //     item.should.have.all.keys("id", "issueDate", "state", "products", "customerId");
//                     //     item.products.should.have.all.keys("SKUId", "description", "price", "qty")
//                     //     item.state === "ISSUED"
//                     // })          
//                 }
//                 done();
//             });
//     });
// };

// function getAcceptedInternalOrders(expectedHTTPStatus, testName, userType) {
//     it(testName, function (done) {
//         agent.get('/api/internalOrdersAccepted')
//             .set("Cookie", "type=".concat(userType))   
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 if(expectedHTTPStatus == 200){
//                     // res.body.forEach(item => { 
//                     //     item.should.have.all.keys("id", "issueDate", "state", "products", "customerId");
//                     //     item.products.should.have.all.keys("SKUId", "description", "price", "qty")
//                     //     item.state === "ACCEPTED"  
//                     // })              
//                 }
//                 done();
//             });
//     });
// };

// function getInternalOrderById(expectedHTTPStatus, testName, userType, orderId) {
//     it(testName, function (done) {
//         agent.get('/api/internalOrders/' + orderId)
//             .set("Cookie", "type=".concat(userType))   
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 if(expectedHTTPStatus == 200){
//                     console.log("internal order objects is:")
//                     console.log(res.body)
//                     res.body.should.be.an('object');
//                     res.body.should.have.all.keys("id", "issueDate", "state", "products", "customerId");
//                     if (res.body.state === "COMPLETED") {
//                         res.body.products.should.have.all.keys("SKUId", "description", "price", "RFID")
//                     } else {
//                         res.body.products.should.have.all.keys("SKUId", "description", "price", "qty")
//                     }                  
//                 }
//                 done();
//             });
//     });
// };

// function createInternalOrder(expectedHTTPStatus, testName, userType, orderObject) {
//     it(testName, function (done) {
//         agent.post('/api/internalOrders')
//             .set("Cookie", "type=".concat(userType))  
//             .send(orderObject) 
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 done();
//             });
//     });
// };

// function modifyInternalOrder(expectedHTTPStatus, testName, userType, orderId, requestBody) {
//     it(testName, function (done) {
//         agent.put('/api/internalOrders/' + orderId)
//             .set("Cookie", "type=".concat(userType))  
//             .send(requestBody) 
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 done();
//             });
//     });
// };

// function deleteInternalOrder(expectedHTTPStatus, testName, userType, orderId) {
//     it(testName, function (done) {
//         agent.delete('/api/internalOrders/' + orderId)
//             .set("Cookie", "type=".concat(userType))  
//             .send(orderObject) 
//             .then(function (res) {      
//                 res.should.have.status(expectedHTTPStatus);                        
//                 done();
//             });
//     });
// };j