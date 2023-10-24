import './App.css';

import ExpenseManagement from './components/ExpenseManagement/ExpenseManagement';
import ExpenseSummary from './components/ExpenseSummary/ExpenseSummary';
import NavBar from './components/NavBar/NavBar';
import PageNotFound from './components/PageNotFound/PageNotFound';
import UserManagement from './components/UserManagement/UserManagement';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/expenses" element={<ExpenseManagement />} />
          <Route path="/user" element={<UserManagement />} />
          <Route path="/summary" element={<ExpenseSummary />} />
          <Route path="/" element={<ExpenseSummary />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
