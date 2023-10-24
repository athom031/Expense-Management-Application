// indexedDBUtils.js

import { LEAN_DATA_DB, USER_TABLE, USER_FIRST_NAME, USER_LAST_NAME, USER_ID, READWRITE, CATEGORY_TABLE, CATEGORY_ID, EXPENSE_ID, CATEGORY_NAME, CATEGORIES, EXPENSE_TABLE, EXPENSE_DESCRIPTION, EXPENSE_COST } from '../constants/indexedDBConstants';

const addCategoryTableIfNeeded = (db) => {
    if(!db.objectStoreNames.contains(CATEGORY_TABLE)) {
        const categoryStore = db.createObjectStore(CATEGORY_TABLE, {keyPath: CATEGORY_ID});
        categoryStore.createIndex(CATEGORY_NAME, CATEGORY_NAME, {unique: false});

        Object.entries(CATEGORIES).forEach(([key, value]) => {
            addRow({ category_id: key, category_name: value }, CATEGORY_TABLE);
        });
    }
}

const addExpenseTableIfNeeded = (db) => {
    if(!db.objectStoreNames.contains(EXPENSE_TABLE)) {
        const expenseStore = db.createObjectStore(EXPENSE_TABLE, { keyPath: EXPENSE_ID});
        expenseStore.createIndex(EXPENSE_COST, EXPENSE_COST, { unique: false });
        expenseStore.createIndex(EXPENSE_DESCRIPTION, EXPENSE_DESCRIPTION, { unique: false });
        expenseStore.createIndex(USER_ID, USER_ID, { unique: false });
        expenseStore.createIndex(CATEGORY_ID, CATEGORY_ID, { unique: false});
    }
}

const addUserTableIfNeeded = (db) => {
    if(!db.objectStoreNames.contains(USER_TABLE)) {
        const userStore = db.createObjectStore(USER_TABLE, { keyPath: USER_ID });
        userStore.createIndex(USER_FIRST_NAME, USER_FIRST_NAME, { unique: false });
        userStore.createIndex(USER_LAST_NAME, USER_LAST_NAME, { unique: false });
    }
}

// TOBEADDED: addExpenseTableIfNeeded

export const openDB = () => {
    const request = window.indexedDB.open(LEAN_DATA_DB, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // check if category_table object store already exists and add if needed
        addCategoryTableIfNeeded(db);

        // check if expense_table object store already exists and add if needed
        addExpenseTableIfNeeded(db);

        // Check if user_table object store already exists and add if needed
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
            console.log(`Successfully added ${JSON.stringify(row)} in '${table}'`);
        }
        addRowRequest.onerror = function (event) {
            console.error(`Error adding ${JSON.stringify(row)} in '${table}'`);
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
            console.log(`Successfully updated ${JSON.stringify(row)} in '${table}'`)
        }
        updateRowRequest.onerror = function (event) {
            console.log(`Error updating ${JSON.stringify(row)} in ${table}`);
        }
    }

    request.onerror = function (event) {
        console.log('Error opening database');
    }

}

export const getAllRows = (table) => {
    return new Promise((resolve, reject) => {
        const request = openDB();

        request.onsuccess = function (event) {
            const objectStore = getRWObjectStore(event, table);
            const users = [];
            objectStore.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    users.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(users);
                }
            };
        };

        request.onerror = function (event) {
            reject('Error opening database');
        };
    });
};
