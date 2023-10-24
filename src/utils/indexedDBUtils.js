// indexedDBUtils.js

import { LEAN_DATA_DB, USER_TABLE, USER_FIRST_NAME, USER_LAST_NAME, USER_ID, READWRITE, READONLY, CATEGORY_TABLE, CATEGORY_ID, EXPENSE_ID, CATEGORY_NAME, CATEGORIES, EXPENSE_TABLE, EXPENSE_DESCRIPTION, EXPENSE_COST } from '../constants/indexedDBConstants';

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

const getROObjectStore  = (event, table) => {
    const db = event.target.result;
    const transaction = db.transaction([table], READONLY);
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
        const objectStore = getROObjectStore(event, table);
        const rows = {};
        objectStore.openCursor().onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            rows[cursor.key] = cursor.value;
            cursor.continue();
          } else {
            resolve(rows);
          }
        };
      };

      request.onerror = function (event) {
        reject('Error opening database');
      };
    });
};

export const getNameFromUserId = (userID) => {
    return new Promise((resolve, reject) => {
      const request = openDB();

      request.onsuccess = function (event) {
        const objectStore = getROObjectStore(event, USER_TABLE);
        const getRowRequest = objectStore.get(userID);

        getRowRequest.onsuccess = function (event) {
          resolve(`${event.target.result.user_first_name} ${event.target.result.user_last_name}`);
        };

        getRowRequest.onerror = function (event) {
          console.log(`Error getting ${userID} in ${USER_TABLE}`);
          reject('');
        };
      };

      request.onerror = function (event) {
        console.log('Error opening database');
        reject('');
      };
    });
  };

  export const getTotalExpenditureByUserId = (userID) => {
    return new Promise((resolve, reject) => {
        const request = openDB();

        request.onsuccess = function (event) {
            const objectStore = getROObjectStore(event, EXPENSE_TABLE);
            const expenses = [];
            const expenseCursor = objectStore.index(USER_ID).openCursor(IDBKeyRange.only(userID));

            expenseCursor.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    expenses.push(cursor.value.expense_cost);
                    cursor.continue();
                } else {
                    if (expenses.length === 0) {
                        resolve(0); // Return 0 if no expenses found for the user
                    } else {
                        const totalExpenditure = expenses.reduce((total, cost) => total + parseFloat(cost), 0);
                        resolve(totalExpenditure);
                    }
                }
            };

            expenseCursor.onerror = function (event) {
                console.log(`Error getting expenses for ${userID} in ${EXPENSE_TABLE}`);
                reject('');
            };
        };

        request.onerror = function (event) {
            console.log('Error opening database');
            reject('');
        };
    });
};

export const deleteAllExpensesByUserId = (userID) => {
    return new Promise((resolve, reject) => {
      const request = openDB();

      request.onsuccess = function (event) {
        const objectStore = getRWObjectStore(event, EXPENSE_TABLE);
        const expenses = [];

        const expenseCursor = objectStore.index(USER_ID).openCursor(IDBKeyRange.only(userID));

        expenseCursor.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            const deleteRequest = cursor.delete();
            deleteRequest.onsuccess = function () {
              expenses.push(cursor.value);
              cursor.continue();
            };
          } else {
            resolve(expenses);
          }
        };

        expenseCursor.onerror = function (event) {
          console.log(`Error deleting expenses for ${userID} in ${EXPENSE_TABLE}`);
          reject('');
        };
      };

      request.onerror = function (event) {
        console.log('Error opening database');
        reject('');
      };
    });
  };

  export const getTotalExpensesByCategory = () => {
    return new Promise((resolve, reject) => {
        const request = openDB();
        let categoryExpenses = {};

        request.onsuccess = function (event) {
            const objectStore = getROObjectStore(event, EXPENSE_TABLE);

            Object.keys(CATEGORIES).forEach(categoryId => {
                categoryExpenses[CATEGORIES[categoryId]] = 0;
            });

            const cursorRequest = objectStore.openCursor();
            cursorRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const { category_id, expense_cost } = cursor.value;
                    const categoryName = CATEGORIES[category_id];
                    if (categoryName !== undefined) {
                        categoryExpenses[categoryName] += parseFloat(expense_cost);
                    }
                    cursor.continue();
                } else {
                    resolve(categoryExpenses);
                }
            };

            cursorRequest.onerror = function (event) {
                console.log('Error opening expense cursor:', event.target.error);
                reject('');
            };
        };

        request.onerror = function (event) {
            console.log('Error opening database');
            reject('');
        };
    });
};
