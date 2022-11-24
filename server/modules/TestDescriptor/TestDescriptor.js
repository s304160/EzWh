class TestDescriptor {
    #id
    #name
    #procedureDescription
    #skuID
    //#SkuIdList 
    //#testResultList 
    constructor(id, name, procedureDescription, skuID) {
        this.#id = id;
        this.#name = name;
        this.#procedureDescription = procedureDescription;
        this.#skuID = skuID
        //this.#SkuIdList = [];
        //this.#testResultList = [];
    }
    //JSON
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            procedureDescription: this.#procedureDescription,
            idSKU: this.#skuID
        }
    }
    // Getter
    getID() {
        return this.#id;
    }
    getName() {
        return this.#name;
    }
    getProcedureDescription() {
        return this.#procedureDescription;
    }
    getSku() {
        return this.#skuID;
    }

    // Setter
    setID(id) {
        this.#id = id;
    }
    setName(name) {
        this.#name = name;
    }
    setProcedureDescription(procedureDescription) {
        this.#procedureDescription = procedureDescription;
    }
    setSku(skuID) {
        this.#skuID = skuID
    }

    addTestResult(date, result) {
        //todo
    }

    deleteTestResultById(testResutId) {
        //todo
    }

    deleteSkuById(skuId) {
        //todo
    }

}

module.exports = TestDescriptor