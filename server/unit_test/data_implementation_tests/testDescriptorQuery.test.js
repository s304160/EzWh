const DAO = require("../../modules/DataImplementation/DAO");
const TestDescriptor = require("../../modules/TestDescriptor/TestDescriptor");
const testDescriptorDB = new DAO("./unit_test/data_implementation_tests/test_databases/testDB_testDescriptor.sqlite");
const test_testDescriptor = require("./test_modules/test_testDescriptor");

describe('TestDescriptor test',()=>{
    beforeAll(async ()=>{
        await testDescriptorDB.destroyDB()
            .then(testDescriptorDB.startDB());
    })
    const td1 = new TestDescriptor(1,"td1","test procedure",1);
    const td2 = new TestDescriptor(2,"td2","test procedure",1);
    const td3 = new TestDescriptor(3,"td3","test procedure",2);
    
    test_testDescriptor.test_getTestDescriptors(testDescriptorDB,0);

    test_testDescriptor.test_storeTestDescriptor(testDescriptorDB,td1.getName(),
        td1.getProcedureDescription(),td1.getSku(),1);
    
        test_testDescriptor.test_storeTestDescriptor(testDescriptorDB,td2.getName(),
        td2.getProcedureDescription(),td2.getSku(),2);
        
    test_testDescriptor.test_storeTestDescriptor(testDescriptorDB,td3.getName(),
        td3.getProcedureDescription(),td3.getSku(),3);

    test_testDescriptor.test_getTestDescriptors(testDescriptorDB,3);

    test_testDescriptor.test_getSKUTestDescriptors(testDescriptorDB,1,2);

    test_testDescriptor.test_modifyTestDescriptorByID(testDescriptorDB,td2.getID(),"td2.1","modified",3);

    test_testDescriptor.test_getTestDescriptors(testDescriptorDB,3);

    test_testDescriptor.test_getSKUTestDescriptors(testDescriptorDB,1,1);

    test_testDescriptor.test_getSKUTestDescriptors(testDescriptorDB,3,1);

    test_testDescriptor.test_deleteTestDescriptor(testDescriptorDB,td1.getID());

    test_testDescriptor.test_getTestDescriptors(testDescriptorDB,2);
})