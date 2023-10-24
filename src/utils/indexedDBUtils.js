// indexedDBUtils.js

import { LEAN_DATA_DB, USER_TABLE, USER_FIRST_NAME, USER_LAST_NAME, USER_ID, READWRITE } from '../constants/indexedDBConstants';

const addUserTableIfNeeded = (db) => {
    if(!db.objectStoreNames.contains(USER_TABLE)) {
        const userStore = db.createObjectStore(USER_TABLE, { keyPath: USER_ID });
        userStore.createIndex(USER_FIRST_NAME, USER_FIRST_NAME, { unique: false });
        userStore.createIndex(USER_LAST_NAME, USER_LAST_NAME, { unique: false });
    }
}

// TOBEADDED: addExpenseTableIfNeeded
// TOBEADDED: addCategoryTableIfNeeded

export const openDB = () => {
    const request = window.indexedDB.open(LEAN_DATA_DB, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Check if user_table object store already exists
        addUserTableIfNeeded(db);
    };

    return request;
};

const getRWObjectStore = (event, table) => {
    const db = event.target.result;
    const transaction = db.transaction([table], READWRITE);
    const objectStore = transaction.objectStore(table);

    return objectStore;
}

export const addRow = (row, table) => {
    const request = openDB();

    request.onsuccess = function (event) {
        const objectStore = getRWObjectStore(event, table);
        const addRowRequest = objectStore.add(row);

        addRowRequest.onsuccess = function (event) {
            console.log(`Successfully added ${row.toString()} in '${table}'`);
        }
        addRowRequest.onerror = function (event) {
            console.error(`Error adding ${row.toString()} in '${table}'`);
        }
    }

    request.onerror = function (event) {
        console.log('Error opening database');
    }
}

export const deleteRow = (table, rowId) => {
    const request = openDB();

    request.onsuccess = function (event) {
        const objectStore = getRWObjectStore(event, table);
        const deleteRowRequest = objectStore.delete(rowId);

        deleteRowRequest.onsuccess = function (event) {
            console.log(`Successfully deleted ${rowId} from '${table}'`);
        };
        deleteRowRequest.onerror = function (event) {
            console.error(`Error deleting ${rowId} from '${table}'`);
        };
    }

    request.onerror = function (event) {
        console.log('Error opening database');
    }
}

export const updateRow = (table, row) => {
    const request = openDB();

    request.onsuccess = function (event) {
        const objectStore = getRWObjectStore(event, table);
        const updateRowRequest = objectStore.put(row);

        updateRowRequest.onsuccess = function (event) {
            console.log(`Successfully updated ${row.toString()} in '${table}'`)
        }
        updateRowRequest.onerror = function (event) {
            console.log(`Error updating ${row.toString()} in ${table}`);
        }
    }

    request.onerror = function (event) {
        console.log('Error opening database');
    }

}
