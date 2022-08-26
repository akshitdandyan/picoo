const setupDb = async () => {
    const openReq = indexedDB.open("test", 1);
    openReq.onsuccess = () => {
        console.log("[setupDb] openReq successfull...");
        const db = openReq.result;
        console.log("[setupDb] db", db);
    };

    openReq.onerror = () => {
        console.log("[setupDb] openReq failed...");
    };
};

setupDb();
