import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Salary = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [salary, setSalary] = useState({
    employeeNumber: "",
    month: `${currentYear}-${currentMonth}`,
    deductions: ""
  });

  useEffect(() => {
    fetchEmployees();
    fetchSalaries();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee");
      setEmployees(res.data.employee);
    } catch (error: any) {
      console.error("Failed to fetch employees", error);
      const message = error.response?.data?.message || "Failed to fetch employees. Please try again.";
      toast.error(message);
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/salary");
      setSalaries(res.data.salary || []);
    } catch (error: any) {
      console.error("Failed to fetch salaries", error);
      const message = error.response?.data?.message || "Failed to fetch salary records. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!salary.employeeNumber) {
      toast.error("Please select an employee to create a salary record.");
      return;
    }

    try {
      const payload = {
        employeeNumber: parseInt(salary.employeeNumber),
        month: salary.month,
        deductions: salary.deductions ? parseFloat(salary.deductions) : 0
      };

      await api.post("/salary", payload);
      toast.success("Salary record created successfully!");

      setSalary({
        employeeNumber: "",
        month: `${currentYear}-${currentMonth}`,
        deductions: ""
      });

      fetchSalaries();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create salary record. Please try again.";
      toast.error(message);
    }
  };

  const handleDelete = async (salaryId: string) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    try {
      await api.delete(`/salary/${salaryId}`);
      toast.success("Salary record deleted successfully!");
      fetchSalaries();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to delete salary record";
      toast.error(errMsg);
    }
  };

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payroll Management</h1>
          <p className="text-slate-500">Generate and manage salary records for your employees.</p>
        </div>

        <div className="card max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Create Salary Record</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Select Employee</label>
                <select
                  value={salary.employeeNumber}
                  onChange={(e) => setSalary({ ...salary, employeeNumber: e.target.value })}
                  className="input-field"
                >
                  <option value="">Choose an employee</option>
                  {employees.map((emp: any) => (
                    <option key={emp.employeeNumber} value={emp.employeeNumber}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Pay Period (Month)</label>
                <select
                  value={salary.month}
                  onChange={(e) => setSalary({ ...salary, month: e.target.value })}
                  className="input-field"
                >
                  {months.map((name, index) => {
                    const monthNumber = String(index + 1).padStart(2, "0");
                    const value = `${currentYear}-${monthNumber}`;
                    return (
                      <option key={value} value={value}>
                        {name} {currentYear}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Additional Deductions ($)</label>
              <input
                type="number"
                step="0.01"
                value={salary.deductions}
                onChange={(e) => setSalary({ ...salary, deductions: e.target.value })}
                placeholder="0.00"
                className="input-field"
              />
              <p className="mt-2 text-xs text-slate-400">Specify any manual deductions (taxes, insurance, etc. are handled automatically based on gross).</p>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Generate Pay Stub
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Salary Records</h2>
            <span className="text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              {salaries.length} records
            </span>
          </div>

          {loading ? (
            <div className="card flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : salaries.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-slate-500">No salary records found for the current period.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="table-header">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Period</th>
                    <th className="p-4 text-right">Gross Salary</th>
                    <th className="p-4 text-right">Deductions</th>
                    <th className="p-4 text-right">Net Salary</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salaries.map((sal: any, idx: number) => {
                    const deductionsVal = parseFloat(sal.deductions || 0);
                    const grossVal = parseFloat(sal.grossSalary || 0);
                    const netVal = parseFloat(sal.netSalary || 0);

                    return (
                      <tr key={idx} className="table-row">
                        <td className="table-cell">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">
                              {sal.firstName && sal.lastName
                                ? `${sal.firstName} ${sal.lastName}`
                                : `Employee ${sal.employeeNumber}`}
                            </span>
                            <span className="text-xs text-slate-500">{sal.position || "Staff"}</span>
                          </div>
                        </td>
                        <td className="table-cell text-slate-600 font-medium">{sal.month}</td>
                        <td className="table-cell text-right font-medium text-slate-900">
                          ${grossVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell text-right font-medium text-red-600">
                          -${deductionsVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell text-right">
                          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                            ${netVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="table-cell text-right">
                          <button
                            onClick={() => handleDelete(sal.salaryId)}
                            className="text-red-600 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Salary;
