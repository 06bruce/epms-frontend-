import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Report = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Force rebuild - v2

  const [filters, setFilters] = useState({
    employeeNumber: "",
    month: "",
    departmentCode: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salRes, empRes, deptRes] = await Promise.all([
        api.get("/salary"),
        api.get("/employee"),
        api.get("/department")
      ]);

      setSalaries(salRes.data.salary || []);
      setEmployees(empRes.data.employee || []);
      setDepartments(deptRes.data.departments || []);
      toast.success("Report data loaded successfully!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load report data. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSalaries = () => {
    let filtered = salaries;

    if (filters.employeeNumber) {
      filtered = filtered.filter(
        (s: any) => s.employeeNumber === parseInt(filters.employeeNumber)
      );
    }

    if (filters.month) {
      filtered = filtered.filter((s: any) => s.month === filters.month);
    }

    if (filters.departmentCode) {
      const deptEmployees = employees
        .filter((e: any) => e.departmentCode === filters.departmentCode)
        .map((e: any) => e.employeeNumber);

      filtered = filtered.filter((s: any) =>
        deptEmployees.includes(s.employeeNumber)
      );
    }

    return filtered;
  };

  const calculateTotals = (data: any[]) => {
    return {
      totalGross: data.reduce((sum, s) => sum + parseFloat(s.grossSalary || 0), 0),
      totalDeductions: data.reduce((sum, s) => sum + parseFloat(s.deductions || 0), 0),
      totalNet: data.reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0),
      count: data.length
    };
  };

  const filteredData = getFilteredSalaries();
  const totals = calculateTotals(filteredData);

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const names = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    return { value: month, name: names[i] };
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Financial Reports</h1>
            <p className="text-slate-500">Analyze payroll distribution and organizational costs.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilters({ employeeNumber: "", month: "", departmentCode: "" })}
              className="btn-secondary text-sm"
            >
              Reset Filters
            </button>
            <button
              onClick={fetchData}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Refresh Data
            </button>
          </div>
        </div>

        {/* Filters Form */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Filter by Employee</label>
              <select
                value={filters.employeeNumber}
                onChange={(e) => setFilters({ ...filters, employeeNumber: e.target.value })}
                className="input-field"
              >
                <option value="">All Employees</option>
                {employees.map((emp: any) => (
                  <option key={emp.employeeNumber} value={emp.employeeNumber}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Filter by Month</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="input-field"
              >
                <option value="">All Months</option>
                {months.map((m) => {
                  const currentYear = new Date().getFullYear();
                  const value = `${currentYear}-${m.value}`;
                  return (
                    <option key={value} value={value}>
                      {m.name} {currentYear}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="label">Filter by Department</label>
              <select
                value={filters.departmentCode}
                onChange={(e) => setFilters({ ...filters, departmentCode: e.target.value })}
                className="input-field"
              >
                <option value="">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept.departmentCode} value={dept.departmentCode}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card !p-5 border-l-4 border-l-slate-900">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Records</div>
              <div className="text-2xl font-bold text-slate-900">{totals.count}</div>
            </div>
            <div className="card !p-5 border-l-4 border-l-emerald-500">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Gross</div>
              <div className="text-2xl font-bold text-slate-900">
                ${totals.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="card !p-5 border-l-4 border-l-rose-500">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Deductions</div>
              <div className="text-2xl font-bold text-slate-900">
                ${totals.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="card !p-5 border-l-4 border-l-indigo-500">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Net Pay</div>
              <div className="text-2xl font-bold text-slate-900">
                ${totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div>
          {loading ? (
            <div className="card flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="card text-center py-20">
              <p className="text-slate-500 text-lg">No financial records match your filters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="table-header">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Month</th>
                    <th className="p-4 text-right">Gross Pay</th>
                    <th className="p-4 text-right">Deductions</th>
                    <th className="p-4 text-right">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((sal: any, idx: number) => {
                    const employee: any = employees.find(
                      (e: any) => e.employeeNumber === sal.employeeNumber
                    );
                    const dept: any = departments.find(
                      (d: any) => d.departmentCode === employee?.departmentCode
                    );

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
                        <td className="table-cell">
                          <span className="text-sm font-medium text-slate-600">{dept?.departmentName || "N/A"}</span>
                        </td>
                        <td className="table-cell font-medium text-slate-600">{sal.month}</td>
                        <td className="table-cell text-right font-medium">
                          ${parseFloat(sal.grossSalary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell text-right text-rose-600 font-medium">
                          -${parseFloat(sal.deductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="table-cell text-right">
                          <span className="font-bold text-slate-900">
                            ${parseFloat(sal.netSalary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="p-4 text-slate-500 text-sm uppercase tracking-wider">
                      Consolidated Totals
                    </td>
                    <td className="p-4 text-right text-slate-900">
                      ${totals.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right text-rose-600">
                      -${totals.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      <span className="bg-slate-900 text-white px-3 py-1.5 rounded-lg">
                        ${totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Report;
