// RESTOCK ORDER
exports.getRestockOrders = jest.fn();
exports.getTransportNote = jest.fn();
exports.getItemsByRestockOrder = jest.fn();
exports.getSKUItemsByRestockOrder = jest.fn();
exports.getReturnItemsOfRestockOrder = jest.fn();
exports.getMaxRestockOrderID = jest.fn();
exports.storeRestockOrder = jest.fn();
exports.modifyRestockOrderState = jest.fn();
exports.modifyRestockOrderSKUItems = jest.fn();
exports.addRestockOrderTransportNote = jest.fn();
exports.deleteRestockOrder = jest.fn();

// ITEM
exports.getItems = jest.fn();
exports.storeItem = jest.fn();
exports.modifyItem = jest.fn();
exports.deleteItem = jest.fn();

// RETURN ORDER
exports.getReturnOrders = jest.fn();
exports.getProductsByReturnOrder = jest.fn();
exports.storeReturnOrder = jest.fn();
exports.getMaxReturnOrderID = jest.fn();
exports.getSkuItems = jest.fn();
exports.deleteReturnOrder = jest.fn();

// INTERNAL ORDER
exports.getInternalOrders = jest.fn();
exports.getProductsOfInternalOrder = jest.fn();
exports.storeInternalOrder = jest.fn();
exports.modifyInternalOrder = jest.fn();
exports.deleteInternalOrder = jest.fn();
exports.getMaxInternalOrderID = jest.fn();