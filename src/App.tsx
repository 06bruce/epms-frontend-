import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Employee from "./components/pages/employee/EmployeeForm";
import Deparment from "./components/pages/department/Department";
import Salary from "./components/pages/salary/Salary";
import Report from "./components/pages/report/report";
import SignUp from "./components/pages/auth/signup";
import Login from "./components/pages/auth/login";
import Home from "./components/pages/Home";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/department" element={<Deparment />} />
            <Route path="/salaryform" element={<Salary />} />
            <Route path="/report" element={<Report />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;