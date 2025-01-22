const BASE_URL = `http://127.0.0.1:8000`;

export const apiEndpoints = {
    production: false,
    apiUrlListIncomes: `${BASE_URL}/incomes/`,
    apiUrlListIncomeSources: `${BASE_URL}/income-sources/`,
    apiUrlListExpenses: `${BASE_URL}/expenses/`,
    apiUrlListExpenseCategories: `${BASE_URL}/expense-categories/`,
    apiUrlListSavings: `${BASE_URL}/savings/`,
    apiUrlListSavingCategories: `${BASE_URL}/saving-categories/`,
    apiUrlExportingPdf: `${BASE_URL}/exporting-pdf/`,
    apiUrlBalance: `${BASE_URL}/balance/`,
};