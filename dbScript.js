let db;
let openRequest = indexedDB.open("camera", 1);
openRequest.onsuccess = function () {
    // if exist then will get db from here 
    db = openRequest.result;
}
openRequest.onerror = function (err) {
    console.log(err)
}
openRequest.onupgradeneeded = function () {
    // 1st create
    db = openRequest.result;
    db.createObjectStore("img", { keyPath: "mid" });
    db.createObjectStore("video", { keyPath: "mid" });
}
function addMediaToDB(table, data) {
    if (db) {
        // to get transaction
        let tx = db.transaction(table, "readwrite");
        // to get objectStore
        let objStore = tx.objectStore(table);
        // handle add operation
        objStore.add({ mid: Date.now(), media: data });
    } else {
        alert("DB is loading");
    }
}