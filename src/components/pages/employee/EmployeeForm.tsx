import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Employee = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    address: "",
    position: "",
    departmentCode: ""
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department");
      setDepartments(res.data.departments);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employee");
      setEmployees(res.data.employee);
    } catch (error: any) {
      console.error("Failed to fetch employees", error);
      const message = error.response?.data?.message || "Failed to fetch employees. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeNumber: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await api.delete(`/employee/${employeeNumber}`);
      toast.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete employee. Please try again.";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!employee.firstName || !employee.lastName || !employee.departmentCode || !employee.position) {
      toast.error("Please fill in all required fields: First Name, Last Name, Position, and Department.");
      return;
    }

    try {
      await api.post("/employee", employee);
      toast.success("Employee created successfully!");
      setEmployee({
        firstName: "",
        lastName: "",
        gender: "male",
        address: "",
        position: "",
        departmentCode: ""
      });
      fetchEmployees();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create employee. Please try again.";
      toast.error(message);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Employees</h1>
          <p className="text-slate-500">Manage your workforce from a single dashboard.</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Employee</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={employee.firstName}
                onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })}
                placeholder="John"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={employee.lastName}
                onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })}
                placeholder="Doe"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Gender</label>
              <select
                value={employee.gender}
                onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Department</label>
              <select
                value={employee.departmentCode}
                onChange={(e) => setEmployee({ ...employee, departmentCode: e.target.value })}
                className="input-field"
              >
                <option value="">Select Department</option>
                {departments.map((dept: any) => (
                  <option key={dept.departmentCode} value={dept.departmentCode}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Position</label>
              <input
                type="text"
                value={employee.position}
                onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
                placeholder="Software Engineer"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Address (Optional)</label>
              <input
                type="text"
                value={employee.address}
                onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
                placeholder="123 Street, City"
                className="input-field"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Employee
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Employee List</h2>
            <span className="text-sm font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              {employees.length} total
            </span>
          </div>

          {loading ? (
            <div className="card flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading employees...</p>
              </div>
            </div>
          ) : employees.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-slate-500 mb-4">No employees found.</p>
              <button onClick={fetchEmployees} className="btn-secondary">Refresh Data</button>
            </div>
          ) : (
            <div className="table-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="table-header">
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Gender</th>
                    <th className="p-4">Position</th>
                    <th className="p-4">Department</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp: any) => (
                    <tr key={emp.employeeNumber} className="table-row">
                      <td className="table-cell font-medium text-slate-900">#{emp.employeeNumber}</td>
                      <td className="table-cell">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</span>
                          <span className="text-xs text-slate-500">{emp.address || "No address"}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="capitalize px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {emp.gender}
                        </span>
                      </td>
                      <td className="table-cell">{emp.position}</td>
                      <td className="table-cell">
                        <span className="font-semibold">{emp.departmentCode}</span>
                      </td>
                      <td className="table-cell text-right">
                        <button
                          onClick={() => handleDelete(emp.employeeNumber)}
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

export default Employee;
