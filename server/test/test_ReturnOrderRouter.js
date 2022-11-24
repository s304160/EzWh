











function getReturnOrders(expectedHTTPStatus, testName, userType) {
    it(testName, function (done) {
        agent.get('/api/returnOrders')
            .set("Cookie", "type=".concat(userType))   
            .then(function (res) {      
                res.should.have.status(expectedHTTPStatus);                        
                if(expectedHTTPStatus == 200){
                    res.body.should.be.an('array');
                    res.body.forEach(item => {                    
                        item.should.have.all.keys("id", "returnDate", "products", "restockOrderId");
                        item.products.should.have.all.keys("SKUId", "description", "price", "RFID")
                    });                
                }
                done();
            });
    });
};

function getReturnOrderById(expectedHTTPStatus, testName, userType, orderId) {
    it(testName, function (done) {
        agent.get('/api/returnOrders/' + orderId)
            .set("Cookie", "type=".concat(userType))   
            .then(function (res) {      
                res.should.have.status(expectedHTTPStatus);                        
                if(expectedHTTPStatus == 200){
                    res.body.should.be.an('object');
                    res.body.should.have.all.keys("returnDate", "products", "restockOrderId");
                    res.body.products.should.have.all.keys("SKUId", "description", "price", "RFID")           
                }
                done();
            });
    });
};

function createReturnOrder(expectedHTTPStatus, testName, userType, orderObject) {
    it(testName, function (done) {
        agent.post('/api/returnOrder')
            .set("Cookie", "type=".concat(userType))  
            .send(orderObject) 
            .then(function (res) {      
                res.should.have.status(expectedHTTPStatus);                        
                done();
            });
    });
};

function deleteReturnOrder(expectedHTTPStatus, testName, userType, orderId) {
    it(testName, function (done) {
        agent.delete('/api/returnOrder/' + orderId)
            .set("Cookie", "type=".concat(userType))  
            .send(orderObject) 
            .then(function (res) {      
                res.should.have.status(expectedHTTPStatus);                        
                done();
            });
    });
};