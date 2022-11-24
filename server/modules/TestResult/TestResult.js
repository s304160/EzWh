class TestResult {
    #id
    #date
    #result
    #testDescriptorID
    constructor(id, date, result, testDescriptorID) {
        this.#id = id;
        this.#date = date;
        this.#result = result;
        this.#testDescriptorID = testDescriptorID;
    }

    //JSON
    toJSON() {
        return {
            id: this.#id,
            idTestDescriptor: this.#testDescriptorID,
            Date: this.#date,
            Result: this.#result
        }
    }
    // Getter
    getID() {
        return this.#id;
    }
    getDate() {
        return this.#date;
    }
    getResult() {
        return this.#result;
    }
    getTestDescriptor() {
        return this.#testDescriptorID;
    }

    //Setter
    setID(id) {
        this.#id = id;
    }
    setDate(date) {
        this.#date = date;
    }
    setResult(result) {
        this.#result = result;
    }
    setTestDescriptor(td) {
        this.#testDescriptorID = td;
    }
}

module.exports = TestResult;