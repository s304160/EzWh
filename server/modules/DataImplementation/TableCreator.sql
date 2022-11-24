CREATE TABLE IF NOT EXISTS USER(
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR,
    name VARCHAR,
    surname VARCHAR,
    password VARCHAR,
    salt VARCHAR,
    type VARCHAR
);
CREATE TABLE IF NOT EXISTS TEST_DESCRIPTOR(
    testDescriptorID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    procedureDescription VARCHAR
);
CREATE TABLE IF NOT EXISTS INTERNAL_ORDER(
    orderID INTEGER PRIMARY KEY AUTOINCREMENT,
    issueDate VARCHAR,
    state VARCHAR,
    customerID INTEGER,
    FOREIGN KEY(customerID) REFERENCES USER(userID)
);
CREATE TABLE IF NOT EXISTS RETURN_ORDER(
    orderID INTEGER PRIMARY KEY AUTOINCREMENT,
    restockOrderID INTEGER UNIQUE,
    returnDate VARCHAR,
    FOREIGN KEY(restockOrderID) REFERENCES RESTOCK_ORDER(orderID)
);
CREATE TABLE IF NOT EXISTS RESTOCK_ORDER(
    orderID INTEGER PRIMARY KEY AUTOINCREMENT,
    issueDate VARCHAR,
    state VARCHAR,
    supplierID INTEGER,
    FOREIGN KEY(supplierID) REFERENCES USER(userID)
);
CREATE TABLE IF NOT EXISTS SKU(
    skuID INTEGER PRIMARY KEY AUTOINCREMENT,
    description VARCHAR,
    weight INTEGER,
    volume INTEGER,
    price FLOAT,
    notes VARCHAR
);
CREATE TABLE IF NOT EXISTS SKUITEM(
    rfid VARCHAR PRIMARY KEY,
    available INTEGER,
    skuID INTEGER,
    dateOfStock VARCHAR,
    internalOrderID INTEGER,
    restockOrderID INTEGER,
    returnOrderID INTEGER,
    FOREIGN KEY(skuID) REFERENCES SKU(skuID),
    FOREIGN KEY(internalOrderID) REFERENCES INTERNAL_ORDER(internalOrderID),
    FOREIGN KEY(restockOrderID) REFERENCES RESTOCK_ORDER(restockOrderID),
    FOREIGN KEY(returnOrderID) REFERENCES RETURN_ORDER(returnOrderID)
);
CREATE TABLE IF NOT EXISTS TEST_RESULT(
    resultID INTEGER PRIMARY KEY AUTOINCREMENT,
    date VARCHAR,
    result INTEGER,
    skuItemRfid VARCHAR,
    testDescriptorID INTEGER,
    FOREIGN KEY(testDescriptorID) REFERENCES TEST_DESCRIPTOR(testDescriptorID),
    FOREIGN KEY(skuItemRfid) REFERENCES SKUITEM(rfid)
);
CREATE TABLE IF NOT EXISTS SKU_TESTDESCR(
    skuID INTEGER NOT NULL,
    testDescriptorID INTEGER NOT NULL,
    PRIMARY KEY(testDescriptorID, skuID)
);
CREATE TABLE IF NOT EXISTS POSITION(
    positionID VARCHAR(12) NOT NULL,
    aisleID VARCHAR(4) NOT NULL,
    aisleRow VARCHAR(4) NOT NULL,
    aisleCol VARCHAR(4) NOT NULL,
    maxWeight INTEGER,
    maxVolume INTEGER,
    occupiedWeight INTEGER,
    occupiedVolume INTEGER,
    skuID INTEGER UNIQUE,
    PRIMARY KEY(positionID),
    FOREIGN KEY(skuID) REFERENCES SKU(skuID)
);
CREATE TABLE IF NOT EXISTS ITEM(
    itemID INTEGER NOT NULL,
    supplierID INTEGER NOT NULL,
    description VARCHAR,
    price FLOAT,
    skuID INTEGER,
    PRIMARY KEY(itemID, supplierID),
    FOREIGN KEY(skuID) REFERENCES SKU(skuID)
);
CREATE TABLE IF NOT EXISTS RESTOCK_ORDER_ITEM(
    restockOrderID INTEGER NOT NULL,
    itemID INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    PRIMARY KEY(itemID),
    FOREIGN KEY(restockOrderID) REFERENCES RESTOCK_ORDER(orderID)
);
CREATE TABLE IF NOT EXISTS INTERNAL_ORDER_SKUITEM(
    internalOrderID INTEGER NOT NULL,
    skuID INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    PRIMARY KEY(skuID),
    FOREIGN KEY(internalOrderID) REFERENCES INTERNAL_ORDER(orderID)
);
CREATE TABLE IF NOT EXISTS TRANSPORT_NOTE(
    restockOrderID INTEGER PRIMARY KEY,
    deliveryDate VARCHAR
);
CREATE TABLE IF NOT EXISTS INVENTORY(
    skuID INTEGER NOT NULL,
    availableQuantity INTEGER,
    PRIMARY KEY(skuID),
    FOREIGN KEY (skuID) REFERENCES SKU(skuID)
);