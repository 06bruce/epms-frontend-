// Mock API using localStorage — fully self-contained, no backend needed
const STORAGE_KEYS = {
  USERS: 'epms_users',
  DEPARTMENTS: 'epms_departments',
  EMPLOYEES: 'epms_employees',
  SALARIES: 'epms_salaries',
  COUNTERS: 'epms_counters'
};

const getData = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setData = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

const getNextId = (model: string) => {
  const counters = JSON.parse(localStorage.getItem(STORAGE_KEYS.COUNTERS) || '{}');
  const nextId = (counters[model] || 0) + 1;
  counters[model] = nextId;
  localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
  return nextId;
};

const api = {
  post: async (url: string, data: any) => {
    await new Promise(r => setTimeout(r, 400));
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || 'guest';

    if (url === '/signup') {
      const users = getData(STORAGE_KEYS.USERS);
      // Check for duplicate username or email
      const existing = users.find((u: any) => u.username === data.username || u.email === data.email);
      if (existing) {
        throw { response: { data: { message: "This username or email is already registered." } } };
      }
      const newUser = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName || null,
        role: 'admin'
      };
      users.push(newUser);
      setData(STORAGE_KEYS.USERS, users);
      return { data: { message: "Account created successfully" } };
    }

    if (url === '/login') {
      const users = getData(STORAGE_KEYS.USERS);
      const user = users.find((u: any) => u.username === data.username && u.password === data.password);
      if (!user) {
        throw { response: { data: { message: "Invalid username or password." } } };
      }
      return {
        data: {
          token: 'mock-jwt-token-' + user.id,
          user: {
            id: user.id,
            userId: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
          }
        }
      };
    }

    if (url === '/department') {
      const depts = getData(STORAGE_KEYS.DEPARTMENTS);
      // Check duplicate department code
      const existingDept = depts.find((d: any) => d.departmentCode === data.departmentCode);
      if (existingDept) {
        throw { response: { data: { message: "A department with this code already exists." } } };
      }
      const grossSalary = Number(data.grossSalary);
      if (isNaN(grossSalary) || grossSalary < 0) {
        throw { response: { data: { message: "Base Gross Salary must be a valid positive number." } } };
      }
      const newDept = { ...data, grossSalary, userId };
      depts.push(newDept);
      setData(STORAGE_KEYS.DEPARTMENTS, depts);
      return { data: newDept };
    }

    if (url === '/employee') {
      const employees = getData(STORAGE_KEYS.EMPLOYEES);
      if (!data.firstName || !data.lastName || !data.position || !data.departmentCode) {
        throw { response: { data: { message: "Please fill in all required fields." } } };
      }
      const employeeNumber = getNextId('employee');
      const newEmployee = { ...data, employeeNumber, userId };
      employees.push(newEmployee);
      setData(STORAGE_KEYS.EMPLOYEES, employees);
      return { data: newEmployee };
    }

    if (url === '/salary') {
      const salaries = getData(STORAGE_KEYS.SALARIES);
      const employees = getData(STORAGE_KEYS.EMPLOYEES);
      const depts = getData(STORAGE_KEYS.DEPARTMENTS);

      const empNum = Number(data.employeeNumber);
      if (!empNum || !data.month) {
        throw { response: { data: { message: "Please select an employee and a month." } } };
      }

      const employee = employees.find((e: any) => e.employeeNumber === empNum && (!e.userId || e.userId === userId));
      if (!employee) {
        throw { response: { data: { message: "Employee not found." } } };
      }

      // Check duplicate salary for same employee+month
      const existingSalary = salaries.find((s: any) => s.employeeNumber === empNum && s.month === data.month);
      if (existingSalary) {
        throw { response: { data: { message: "A salary record for this employee and month already exists." } } };
      }

      const dept = depts.find((d: any) => d.departmentCode === employee.departmentCode);
      const grossSalary = dept ? Number(dept.grossSalary) : 0;
      const deductions = data.deductions ? Number(data.deductions) : 0;
      const netSalary = grossSalary - deductions;

      const newSalary = {
        salaryId: Date.now().toString(),
        employeeNumber: empNum,
        month: data.month,
        grossSalary,
        deductions,
        netSalary,
        userId
      };
      salaries.push(newSalary);
      setData(STORAGE_KEYS.SALARIES, salaries);
      return { data: newSalary };
    }

    return { data: {} };
  },

  get: async (url: string) => {
    await new Promise(r => setTimeout(r, 200));
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || 'guest';

    if (url === '/department') {
      const depts = getData(STORAGE_KEYS.DEPARTMENTS).filter((d: any) => !d.userId || d.userId === userId);
      return { data: { departments: depts } };
    }

    if (url === '/employee') {
      const employees = getData(STORAGE_KEYS.EMPLOYEES).filter((e: any) => !e.userId || e.userId === userId);
      return { data: { employee: employees } };
    }

    if (url === '/salary') {
      const salaries = getData(STORAGE_KEYS.SALARIES).filter((s: any) => !s.userId || s.userId === userId);
      const employees = getData(STORAGE_KEYS.EMPLOYEES);

      const enrichedSalaries = salaries.map((sal: any) => {
        const emp = employees.find((e: any) => e.employeeNumber === sal.employeeNumber);
        return {
          ...sal,
          firstName: emp?.firstName || 'Unknown',
          lastName: emp?.lastName || '',
          position: emp?.position || 'N/A'
        };
      });

      return { data: { salary: enrichedSalaries } };
    }

    return { data: {} };
  },

  delete: async (url: string) => {
    await new Promise(r => setTimeout(r, 300));
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || 'guest';

    if (url.startsWith('/department/')) {
      const code = url.split('/').pop();
      let depts = getData(STORAGE_KEYS.DEPARTMENTS);
      const before = depts.length;
      depts = depts.filter((d: any) => !(d.departmentCode === code && (!d.userId || d.userId === userId)));
      if (depts.length === before) {
        throw { response: { data: { message: "Department not found or no permission." } } };
      }
      setData(STORAGE_KEYS.DEPARTMENTS, depts);
      return { data: { message: "Deleted" } };
    }

    if (url.startsWith('/employee/')) {
      const num = parseInt(url.split('/').pop() || '0');
      let employees = getData(STORAGE_KEYS.EMPLOYEES);
      const before = employees.length;
      employees = employees.filter((e: any) => !(e.employeeNumber === num && (!e.userId || e.userId === userId)));
      if (employees.length === before) {
        throw { response: { data: { message: "Employee not found or no permission." } } };
      }
      setData(STORAGE_KEYS.EMPLOYEES, employees);
      return { data: { message: "Deleted" } };
    }

    if (url.startsWith('/salary/')) {
      const id = url.split('/').pop();
      let salaries = getData(STORAGE_KEYS.SALARIES);
      const before = salaries.length;
      salaries = salaries.filter((s: any) => !(s.salaryId === id && (!s.userId || s.userId === userId)));
      if (salaries.length === before) {
        throw { response: { data: { message: "Salary record not found or no permission." } } };
      }
      setData(STORAGE_KEYS.SALARIES, salaries);
      return { data: { message: "Deleted" } };
    }

    return { data: {} };
  }
};

export default api;
