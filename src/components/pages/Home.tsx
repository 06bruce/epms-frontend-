import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-4xl w-full text-center">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 mb-8 border border-slate-200">
          <span className="flex h-2 w-2 rounded-full bg-slate-900 mr-2"></span>
          Trusted by over 500+ companies
        </div>

        <h1 className="text-5xl md:text-6xl tracking-tighter text-slate-900 mb-6 lg:leading-[1.1]">
          Payroll Management <br />
          <span className="text-slate-500">Simplified for Excellence.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform to manage employees, departments, and payroll with precision. Built for modern businesses that value clarity and efficiency.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/department" className="btn-primary w-full sm:w-auto px-8 py-3 text-lg">
            Manage Department
          </Link>
          <Link to="/employee" className="btn-secondary w-full sm:w-auto px-8 py-3 text-lg">
            Manage Employee
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-100 pt-16">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Effortless Salary Management</h3>
            <p className="text-slate-500 text-sm">Automate payroll calculations and ensure timely payments with zero errors.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Centralized Employee Data</h3>
            <p className="text-slate-500 text-sm">Keep all employee information organized and easily accessible in one place.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Insightful Reporting</h3>
            <p className="text-slate-500 text-sm">Generate comprehensive reports on salary distribution and departmental costs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
