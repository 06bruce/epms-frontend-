// Mock API using localStorage to handle data without a backend
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
    await new Promise(r => setTimeout(r, 500)); // Simulate network delay
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || 'guest';

    if (url === '/signup') {
      const users = getData(STORAGE_KEYS.USERS);
      const newUser = { ...data, id: Date.now().toString() };
      users.push(newUser);
      setData(STORAGE_KEYS.USERS, users);
      return { data: { message: "Account created successfully" } };
    }

    if (url === '/login') {
      const users = getData(STORAGE_KEYS.USERS);
      const user = users.find((u: any) => u.username === data.username && u.password === data.password);
      if (!user) throw { response: { data: { message: "Invalid credentials" } } };
      return { data: { token: 'mock-jwt-token', user } };
    }

    if (url === '/department') {
      const depts = getData(STORAGE_KEYS.DEPARTMENTS);
      const newDept = { ...data, userId };
      depts.push(newDept);
      setData(STORAGE_KEYS.DEPARTMENTS, depts);
      return { data: newDept };
    }

    if (url === '/employee') {
      const employees = getData(STORAGE_KEYS.EMPLOYEES);
      const employeeNumber = getNextId('employee');
      const newEmployee = { ...data, employeeNumber, userId };
      employees.push(newEmployee);
      setData(STORAGE_KEYS.EMPLOYEES, employees);
      return { data: newEmployee };
    }

    if (url === '/salary') {
      const salaries = getData(STORAGE_KEYS.SALARIES);
      const depts = getData(STORAGE_KEYS.DEPARTMENTS);
      const employees = getData(STORAGE_KEYS.EMPLOYEES);

      const employee = employees.find((e: any) => e.employeeNumber === data.employeeNumber);
      const dept = depts.find((d: any) => d.departmentCode === employee?.departmentCode);

      const grossSalary = dept?.grossSalary || 0;
      const netSalary = grossSalary - (data.deductions || 0);

      const newSalary = {
        ...data,
        salaryId: Date.now().toString(),
        grossSalary,
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
    await new Promise(r => setTimeout(r, 300));
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || 'guest';

    if (url === '/department') {
      const depts = getData(STORAGE_KEYS.DEPARTMENTS).filter((d: any) => d.userId === userId);
      return { data: { departments: depts } };
    }

    if (url === '/employee') {
      const employees = getData(STORAGE_KEYS.EMPLOYEES).filter((e: any) => e.userId === userId);
      return { data: { employee: employees } };
    }

    if (url === '/salary') {
      const salaries = getData(STORAGE_KEYS.SALARIES).filter((s: any) => s.userId === userId);
      const employees = getData(STORAGE_KEYS.EMPLOYEES);

      // Join employee names
      const enrichedSalaries = salaries.map((sal: any) => {
        const emp = employees.find((e: any) => e.employeeNumber === sal.employeeNumber);
        return {
          ...sal,
          firstName: emp?.firstName,
          lastName: emp?.lastName,
          position: emp?.position
        };
      });

      return { data: { salary: enrichedSalaries } };
    }

    return { data: {} };
  },

  delete: async (url: string) => {
    await new Promise(r => setTimeout(r, 400));
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || 'guest';

    if (url.startsWith('/department/')) {
      const code = url.split('/').pop();
      let depts = getData(STORAGE_KEYS.DEPARTMENTS);
      depts = depts.filter((d: any) => d.departmentCode !== code || d.userId !== userId);
      setData(STORAGE_KEYS.DEPARTMENTS, depts);
      return { data: { message: "Deleted" } };
    }

    if (url.startsWith('/employee/')) {
      const num = parseInt(url.split('/').pop() || '0');
      let employees = getData(STORAGE_KEYS.EMPLOYEES);
      employees = employees.filter((e: any) => e.employeeNumber !== num || e.userId !== userId);
      setData(STORAGE_KEYS.EMPLOYEES, employees);
      return { data: { message: "Deleted" } };
    }

    if (url.startsWith('/salary/')) {
      const id = url.split('/').pop();
      let salaries = getData(STORAGE_KEYS.SALARIES);
      salaries = salaries.filter((s: any) => s.salaryId !== id || s.userId !== userId);
      setData(STORAGE_KEYS.SALARIES, salaries);
      return { data: { message: "Deleted" } };
    }

    return { data: {} };
  }
};

export default api;
