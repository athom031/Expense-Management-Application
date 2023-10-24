import './ExpenseSummary.css'
import { openDB } from '../../utils/indexedDBUtils';
function ExpenseSummary() {
    openDB();
    return (
        <div>
            Expenses Summary
        </div>
    )
}

export default ExpenseSummary;
