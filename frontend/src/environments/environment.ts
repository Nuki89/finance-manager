const BASE_URL = `http://127.0.0.1:8000`;

export const apiEndpoints = {
    production: false,
    tokenUrl: `${BASE_URL}/api/token/`,
    incomeUrl: `${BASE_URL}/incomes/`,
    incomeSourcesUrl: `${BASE_URL}/income-sources/`,
    expenseUrl: `${BASE_URL}/expenses/`,
    expenseCategoriesUrl: `${BASE_URL}/expense-categories/`,
    savingsUrl: `${BASE_URL}/savings/`,
    savingCategoriesUrl: `${BASE_URL}/saving-categories/`,
    exportPdfUrl: `${BASE_URL}/exporting-pdf/`,
    balanceUrl: `${BASE_URL}/balance/`,
};