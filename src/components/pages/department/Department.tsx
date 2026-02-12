import { useState, useEffect } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({
    departmentCode: "",
    departmentName: "",
    grossSalary: ""
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/department");
      setDepartments(res.data.departments);
    } catch (error: any) {
      console.error("Failed to fetch departments", error);
      const message = error.response?.data?.message || "Failed to fetch departments. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (departmentCode: string) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      await api.delete(`/department/${departmentCode}`);
      toast.success("Department deleted successfully!");
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete department. Please try again.";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!department.departmentCode || !department.departmentName || !department.grossSalary) {
      toast.error("Please fill in all required fields: Code, Name, and Base Gross Salary.");
      return;
    }

    try {
      const payload = {
        ...department,
        grossSalary: parseFloat(department.grossSalary)
      };

      await api.post("/department", payload);
      toast.success("Department created successfully!");
      setDepartment({
        departmentCode: "",
        departmentName: "",
        grossSalary: ""
      });
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create department. Please try again.";
      toast.error(message);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Departments</h1>
          <p className="text-slate-500">Organize your company structure and base payroll parameters.</p>
        </div>

        <div className="card max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Department</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Department Code</label>
                <input
                  type="text"
                  value={department.departmentCode}
                  onChange={(e) => setDepartment({ ...department, departmentCode: e.target.value })}
                  placeholder="e.g., IT, HR, FIN"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Department Name</label>
                <input
                  type="text"
                  value={department.departmentName}
                  onChange={(e) => setDepartment({ ...department, departmentName: e.target.value })}
                  placeholder="e.g., Information Technology"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label">Base Gross Salary ($)</label>
              <input
                type="number"
                step="0.01"
                value={department.grossSalary}
                onChange={(e) => setDepartment({ ...department, grossSalary: e.target.value })}
                placeholder="5000.00"
                className="input-field"
              />
              <p className="mt-2 text-xs text-slate-400 italic">This is the default gross salary for all employees in this department.</p>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Save Department
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Active Departments</h2>
            <span className="text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              {departments.length} departments
            </span>
          </div>

          {loading ? (
            <div className="card flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : departments.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-slate-500">No departments configured yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="table-header">
                    <th className="p-4">Code</th>
                    <th className="p-4">Department Name</th>
                    <th className="p-4 text-right">Base Gross Salary</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((dept: any, idx: number) => (
                    <tr key={idx} className="table-row">
                      <td className="table-cell font-bold text-slate-900">{dept.departmentCode}</td>
                      <td className="table-cell">{dept.departmentName}</td>
                      <td className="table-cell text-right font-semibold text-slate-900">
                        ${parseFloat(dept.grossSalary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="table-cell text-right">
                        <button
                          onClick={() => handleDelete(dept.departmentCode)}
                          className="text-red-600 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Department;
