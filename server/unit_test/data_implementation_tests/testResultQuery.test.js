const DAO = require("../../modules/DataImplementation/DAO");

const TestResult = require("../../modules/TestResult/TestResult");
const testResultDB = new DAO("./unit_test/data_implementation_tests/test_databases/testDB_testResult.sqlite");
const test_testResult = require("./test_modules/test_testResult");

describe('testResult tests',()=>{
    beforeAll(async ()=>{
        await testResultDB.destroyDB()
            .then(testResultDB.startDB());
    })
    const tr1 = new TestResult(1,"1999/04/15",0,1);
    const tr2 = new TestResult(2,"2001/01/04",1,1);
    const tr3 = new TestResult(3,"2002/01/26",0,3);

    test_testResult.test_getTestResults(testResultDB,0);

    test_testResult.test_storeTestResult(testResultDB,
        tr1.getID(),"987654321123456789",tr1.getTestDescriptor(),tr1.getDate(),tr1.getResult());
    
    test_testResult.test_storeTestResult(testResultDB,
        tr2.getID(),"123456789987654321",tr2.getTestDescriptor(),tr2.getDate(),tr2.getResult());

    test_testResult.test_storeTestResult(testResultDB,
        tr3.getID(),"123456789987654321",tr3.getTestDescriptor(),tr3.getDate(),tr3.getResult());
    
    test_testResult.test_getTestResults(testResultDB,3);

    test_testResult.test_getTestResultsByRfid(testResultDB,"123456789987654321",2);

    test_testResult.test_modifyTestResult(testResultDB,
        tr3.getID(),"123456789987654321",1,"2022/05/25",1);
    
    test_testResult.test_deleteTestResult(testResultDB,tr3.getID(),"123456789987654321");

    test_testResult.test_getTestResults(testResultDB,2);
})