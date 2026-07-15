const STORAGE_KEYS = {
  users: "mp_users",
  activeUser: "mp_active_user",
  monthlyIncome: "mp_monthly_income",
  liabilities: "mp_liabilities",
  accounts: "mp_accounts",
  investments: "mp_investments",
  expenses: "mp_expenses"
};

const INVESTMENT_AUTO_CATEGORIES = new Set(["Mutual Fund SIP", "PPF", "NPS", "ETF SIP"]);
const EXPENSE_AUTO_CATEGORIES = new Set([
  "Electricity Bill",
  "Internet Bill",
  "Gas Bill",
  "Subscription"
]);

let dashboardMetricsChart = null;
let assetAllocationChart = null;

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function byId(id) {
  return document.getElementById(id);
}

function parseMoney(value) {
  return Number(value || 0);
}

function money(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });
}

function initSeedData() {
  if (!localStorage.getItem(STORAGE_KEYS.accounts)) {
    writeList(STORAGE_KEYS.accounts, [
      {
        id: crypto.randomUUID(),
        holderName: "Alex Sharma",
        accountNumber: "3344556677",
        balance: 42000
      },
      {
        id: crypto.randomUUID(),
        holderName: "Alex Sharma",
        accountNumber: "8899001122",
        balance: 16500
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.investments)) {
    writeList(STORAGE_KEYS.investments, [
      {
        id: crypto.randomUUID(),
        mode: "auto",
        category: "Mutual Fund SIP",
        bankAccountId: "",
        autoDebitDate: 10,
        amount: 5000,
        details: "Index fund SIP"
      },
      {
        id: crypto.randomUUID(),
        mode: "manual",
        category: "",
        bankAccountId: "",
        autoDebitDate: "",
        amount: 3000,
        details: "Stocks picked manually"
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.expenses)) {
    writeList(STORAGE_KEYS.expenses, [
      {
        id: crypto.randomUUID(),
        mode: "auto",
        category: "Internet Bill",
        bankAccountId: "",
        autoDebitDate: 4,
        amount: 1200,
        details: "Home broadband"
      },
      {
        id: crypto.randomUUID(),
        mode: "manual",
        category: "",
        bankAccountId: "",
        autoDebitDate: "",
        amount: 2800,
        details: "Weekend groceries"
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.monthlyIncome)) {
    localStorage.setItem(STORAGE_KEYS.monthlyIncome, "85000");
  }

  if (!localStorage.getItem(STORAGE_KEYS.liabilities)) {
    localStorage.setItem(STORAGE_KEYS.liabilities, "12000");
  }
}

function activeUser() {
  return localStorage.getItem(STORAGE_KEYS.activeUser);
}

function ensureAuth(page) {
  const publicPages = ["login", "register"];
  if (publicPages.includes(page)) {
    return;
  }

  if (!activeUser()) {
    window.location.href = "login.html";
  }
}

function setNavActive(page) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });

  const email = byId("active-user");
  if (email) {
    email.textContent = activeUser() || "Guest";
  }
}

function setupLogout() {
  const logout = byId("logout-btn");
  if (!logout) {
    return;
  }

  logout.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.activeUser);
    window.location.href = "login.html";
  });
}

function registerUser() {
  const form = byId("register-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = byId("register-email").value.trim();
    const password = byId("register-password").value;

    const users = readList(STORAGE_KEYS.users);
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      alert("Email already exists. Please log in.");
      return;
    }

    users.push({ id: crypto.randomUUID(), email, password });
    writeList(STORAGE_KEYS.users, users);
    localStorage.setItem(STORAGE_KEYS.activeUser, email);
    window.location.href = "dashboard";
  });
}

function loginUser() {
  const form = byId("login-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = byId("login-email").value.trim();
    const password = byId("login-password").value;

    const users = readList(STORAGE_KEYS.users);
    const matched = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!matched) {
      alert("Invalid credentials. Try again.");
      return;
    }

    localStorage.setItem(STORAGE_KEYS.activeUser, matched.email);
    window.location.href = "dashboard";
  });
}

function renderDashboardChart({ totalBalance, monthlyExpenses, monthlyInvestments }) {
  const canvas = byId("dashboard-metrics-chart");
  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  const remaining = Math.max(totalBalance - monthlyExpenses - monthlyInvestments, 0);

  if (dashboardMetricsChart) {
    dashboardMetricsChart.destroy();
  }

  dashboardMetricsChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Expenses", "Investments", "Remaining"],
      datasets: [
        {
          data: [monthlyExpenses, monthlyInvestments, remaining],
          backgroundColor: ["#ef5350", "#42a5f5", "#66bb6a"],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "64%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            padding: 18
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${money(context.raw)}`
          }
        }
      }
    }
  });
}

function renderAssetAllocationChart({ cash, investments, liabilities }) {
  const canvas = byId("asset-allocation-chart");
  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  if (assetAllocationChart) {
    assetAllocationChart.destroy();
  }

  assetAllocationChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Cash", "Investments", "Liabilities"],
      datasets: [
        {
          label: "Amount",
          data: [cash, investments, liabilities],
          backgroundColor: ["#42a5f5", "#66bb6a", "#ef5350"],
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Amount: ${money(context.raw)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => money(value)
          }
        }
      }
    }
  });
}

function renderBudgetByCategory(expenses, totalExpenses) {
  const container = byId("budget-category-list");
  if (!container) {
    return;
  }

  const grouped = expenses.reduce((acc, item) => {
    const key = item.category || "Uncategorized";
    acc[key] = (acc[key] || 0) + parseMoney(item.amount);
    return acc;
  }, {});

  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    container.innerHTML = '<div class="helper">No expenses yet for category budgeting.</div>';
    return;
  }

  container.innerHTML = entries
    .map(([category, amount]) => {
      const ratio = totalExpenses ? Math.min((amount / totalExpenses) * 100, 100) : 0;
      return `
        <div class="budget-item">
          <div class="label"><span>${category}</span><span>${money(amount)}</span></div>
          <div class="bar"><span style="width:${ratio.toFixed(2)}%"></span></div>
        </div>
      `;
    })
    .join("");
}

function setDashboardStat(id, value) {
  const el = byId(id);
  if (el) {
    el.textContent = value;
  }
}

function renderDashboard() {
  const page = byId("dashboard-root");
  if (!page) {
    return;
  }

  const accounts = readList(STORAGE_KEYS.accounts);
  const investments = readList(STORAGE_KEYS.investments);
  const expenses = readList(STORAGE_KEYS.expenses);
  const liabilities = parseMoney(localStorage.getItem(STORAGE_KEYS.liabilities));

  const totalBalance = accounts.reduce((sum, item) => sum + parseMoney(item.balance), 0);
  const monthlyInvestments = investments.reduce((sum, item) => sum + parseMoney(item.amount), 0);
  const monthlyExpenses = expenses.reduce((sum, item) => sum + parseMoney(item.amount), 0);
  const totalAssets = totalBalance + monthlyInvestments;
  const netWorth = totalAssets - liabilities;
  const profitLoss = totalBalance - (monthlyExpenses + monthlyInvestments);

  setDashboardStat("stat-income", money(totalBalance));
  setDashboardStat("stat-expenses", money(monthlyExpenses));
  setDashboardStat("stat-investments", money(monthlyInvestments));
  setDashboardStat("dashboard-balance", money(totalBalance));
  setDashboardStat("stat-net-worth", money(netWorth));
  setDashboardStat("stat-total-assets", money(totalAssets));
  setDashboardStat("stat-profit-loss", money(profitLoss));

  const assetBase = totalAssets || 1;
  const liabilityBase = totalAssets + liabilities || 1;
  setDashboardStat("portfolio-cash-share", `${((totalBalance / assetBase) * 100).toFixed(1)}%`);
  setDashboardStat(
    "portfolio-investment-share",
    `${((monthlyInvestments / assetBase) * 100).toFixed(1)}%`
  );
  setDashboardStat(
    "portfolio-liability-share",
    `${((liabilities / liabilityBase) * 100).toFixed(1)}%`
  );

  renderDashboardChart({ totalBalance, monthlyExpenses, monthlyInvestments });
  renderAssetAllocationChart({
    cash: totalBalance,
    investments: monthlyInvestments,
    liabilities
  });
  renderBudgetByCategory(expenses, monthlyExpenses);

  const usedBudget = totalBalance
    ? ((monthlyExpenses + monthlyInvestments) / totalBalance) * 100
    : 0;
  const cleanBudget = Math.max(0, Math.min(usedBudget, 100));
  setDashboardStat("budget-percent", `${cleanBudget.toFixed(1)}% of balance is allocated`);
  const budgetFill = byId("budget-fill");
  if (budgetFill) {
    budgetFill.style.width = `${cleanBudget}%`;
  }

  const insight = byId("insight-text");
  if (insight) {
    insight.textContent =
      cleanBudget > 90
        ? "Your fixed outflow is high. Ask backend AI insights API for a reduction strategy by category."
        : "You still have room in your monthly plan. Use AI insights API to optimize investment split.";
  }

  const liabilitiesInput = byId("monthly-liabilities");
  if (liabilitiesInput) {
    liabilitiesInput.value = liabilities || "";
  }

  const incomeForm = byId("income-form");
  if (incomeForm && liabilitiesInput) {
    incomeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      localStorage.setItem(STORAGE_KEYS.liabilities, liabilitiesInput.value);
      window.location.reload();
    });
  }
}

function accountNameById(id) {
  const account = readList(STORAGE_KEYS.accounts).find((item) => item.id === id);
  return account ? `${account.holderName} (${account.accountNumber})` : "-";
}

function renderAccountsList() {
  const body = byId("accounts-body");
  if (!body) {
    return;
  }

  const data = readList(STORAGE_KEYS.accounts);
  body.innerHTML = "";

  if (!data.length) {
    body.innerHTML = "<tr><td colspan='5'>No accounts linked yet.</td></tr>";
    return;
  }

  data.forEach((account) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${account.holderName}</td>
      <td>${account.accountNumber}</td>
      <td>${money(account.balance)}</td>
      <td>
        <div class="actions">
          <a class="btn btn-ghost" href="account-edit.html?id=${account.id}">Edit</a>
          <button class="btn btn-accent" data-delete-account="${account.id}">Delete</button>
        </div>
      </td>
    `;
    body.appendChild(row);
  });
}

function bindDeleteModal({ triggerAttr, modalId, confirmId, onDelete }) {
  const modal = byId(modalId);
  const closeBtn = modal ? modal.querySelector("[data-close-modal]") : null;
  const confirmBtn = byId(confirmId);
  if (!modal || !confirmBtn) {
    return;
  }

  let selectedId = null;

  document.addEventListener("click", (event) => {
    const button = event.target.closest(`[${triggerAttr}]`);
    if (!button) {
      return;
    }

    selectedId = button.getAttribute(triggerAttr);
    modal.classList.add("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
      selectedId = null;
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
      selectedId = null;
    }
  });

  confirmBtn.addEventListener("click", () => {
    if (selectedId) {
      onDelete(selectedId);
    }
    modal.classList.remove("open");
    selectedId = null;
  });
}

function setupAccountForms() {
  const addForm = byId("account-add-form");
  const editForm = byId("account-edit-form");

  if (addForm) {
    addForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const list = readList(STORAGE_KEYS.accounts);
      list.push({
        id: crypto.randomUUID(),
        holderName: byId("holderName").value.trim(),
        accountNumber: byId("accountNumber").value.trim(),
        balance: parseMoney(byId("balance").value)
      });
      writeList(STORAGE_KEYS.accounts, list);
      window.location.href = "accounts.html";
    });
  }

  if (editForm) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const list = readList(STORAGE_KEYS.accounts);
    const account = list.find((item) => item.id === id);

    if (!account) {
      window.location.href = "accounts.html";
      return;
    }

    byId("holderName").value = account.holderName;
    byId("accountNumber").value = account.accountNumber;
    byId("balance").value = account.balance;

    editForm.addEventListener("submit", (event) => {
      event.preventDefault();
      account.holderName = byId("holderName").value.trim();
      account.accountNumber = byId("accountNumber").value.trim();
      account.balance = parseMoney(byId("balance").value);
      writeList(STORAGE_KEYS.accounts, list);
      window.location.href = "accounts.html";
    });
  }
}

function populateBankAccounts(selectId) {
  const select = byId(selectId);
  if (!select) {
    return;
  }

  const list = readList(STORAGE_KEYS.accounts);
  select.innerHTML = '<option value="">Select linked account</option>';
  list.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = `${account.holderName} (${account.accountNumber})`;
    select.appendChild(option);
  });
}

function bindModeVisibility(modeName, wrapperId) {
  const autoInput = document.querySelector(`input[name='${modeName}'][value='auto']`);
  const manualInput = document.querySelector(`input[name='${modeName}'][value='manual']`);
  const wrapper = byId(wrapperId);
  if (!autoInput || !manualInput || !wrapper) {
    return;
  }

  function applyMode() {
    wrapper.classList.toggle("hidden", !autoInput.checked);
  }

  autoInput.addEventListener("change", applyMode);
  manualInput.addEventListener("change", applyMode);
  applyMode();
}

function bindCategoryAutoFields({ categoryId, wrapperId, isAutoCategory }) {
  const categorySelect = byId(categoryId);
  const wrapper = byId(wrapperId);
  if (!categorySelect || !wrapper) {
    return () => false;
  }

  const applyVisibility = () => {
    const auto = isAutoCategory(categorySelect.value);
    wrapper.classList.toggle("hidden", !auto);
    return auto;
  };

  categorySelect.addEventListener("change", applyVisibility);
  applyVisibility();
  return applyVisibility;
}

function renderInvestmentsList() {
  const body = byId("investments-body");
  if (!body) {
    return;
  }

  const list = readList(STORAGE_KEYS.investments);
  body.innerHTML = "";

  if (!list.length) {
    body.innerHTML = "<tr><td colspan='7'>No investments added yet.</td></tr>";
    return;
  }

  list.forEach((item) => {
    const isAuto = item.category ? INVESTMENT_AUTO_CATEGORIES.has(item.category) : item.mode === "auto";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${isAuto ? "Auto Debit" : "Manual"}</td>
      <td>${item.category || "-"}</td>
      <td>${item.bankAccountId ? accountNameById(item.bankAccountId) : "-"}</td>
      <td>${item.autoDebitDate || "-"}</td>
      <td>${money(item.amount)}</td>
      <td>${item.details || "-"}</td>
      <td>
        <div class="actions">
          <a class="btn btn-ghost" href="investment-edit.html?id=${item.id}">Edit</a>
          <button class="btn btn-accent" data-delete-investment="${item.id}">Delete</button>
        </div>
      </td>
    `;
    body.appendChild(row);
  });
}

function setupInvestmentForms() {
  const addForm = byId("investment-add-form");
  const editForm = byId("investment-edit-form");
  populateBankAccounts("investment-bankAccountId");
  const getAutoState = bindCategoryAutoFields({
    categoryId: "investment-category",
    wrapperId: "investment-auto-fields",
    isAutoCategory: (value) => INVESTMENT_AUTO_CATEGORIES.has(value)
  });

  if (addForm) {
    addForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isAuto = getAutoState();
      const list = readList(STORAGE_KEYS.investments);
      list.push({
        id: crypto.randomUUID(),
        mode: isAuto ? "auto" : "manual",
        category: byId("investment-category").value,
        bankAccountId: isAuto ? byId("investment-bankAccountId").value : "",
        autoDebitDate: isAuto ? byId("investment-autoDebitDate").value : "",
        amount: parseMoney(byId("investment-amount").value),
        details: byId("investment-details").value.trim()
      });
      writeList(STORAGE_KEYS.investments, list);
      window.location.href = "investments.html";
    });
  }

  if (editForm) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const list = readList(STORAGE_KEYS.investments);
    const item = list.find((entry) => entry.id === id);
    if (!item) {
      window.location.href = "investments.html";
      return;
    }

    const initialCategory = item.category || "One-Time Investment";
    byId("investment-category").value = initialCategory;
    byId("investment-bankAccountId").value = item.bankAccountId || "";
    byId("investment-autoDebitDate").value = item.autoDebitDate || "";
    byId("investment-amount").value = item.amount;
    byId("investment-details").value = item.details || "";
    getAutoState();

    editForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isAuto = getAutoState();
      item.mode = isAuto ? "auto" : "manual";
      item.category = byId("investment-category").value;
      item.bankAccountId = isAuto ? byId("investment-bankAccountId").value : "";
      item.autoDebitDate = isAuto ? byId("investment-autoDebitDate").value : "";
      item.amount = parseMoney(byId("investment-amount").value);
      item.details = byId("investment-details").value.trim();
      writeList(STORAGE_KEYS.investments, list);
      window.location.href = "investments.html";
    });
  }
}

function renderExpensesList() {
  const body = byId("expenses-body");
  if (!body) {
    return;
  }

  const list = readList(STORAGE_KEYS.expenses);
  body.innerHTML = "";

  if (!list.length) {
    body.innerHTML = "<tr><td colspan='7'>No expenses recorded yet.</td></tr>";
    return;
  }

  list.forEach((item) => {
    const isAuto = item.category ? EXPENSE_AUTO_CATEGORIES.has(item.category) : item.mode === "auto";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${isAuto ? "Auto Debit" : "Manual"}</td>
      <td>${item.category || "-"}</td>
      <td>${item.bankAccountId ? accountNameById(item.bankAccountId) : "-"}</td>
      <td>${item.autoDebitDate || "-"}</td>
      <td>${money(item.amount)}</td>
      <td>${item.details || "-"}</td>
      <td>
        <div class="actions">
          <a class="btn btn-ghost" href="expense-edit.html?id=${item.id}">Edit</a>
          <button class="btn btn-accent" data-delete-expense="${item.id}">Delete</button>
        </div>
      </td>
    `;
    body.appendChild(row);
  });
}

function setupExpenseForms() {
  const addForm = byId("expense-add-form");
  const editForm = byId("expense-edit-form");
  populateBankAccounts("expense-bankAccountId");
  const getAutoState = bindCategoryAutoFields({
    categoryId: "expense-category",
    wrapperId: "expense-auto-fields",
    isAutoCategory: (value) => EXPENSE_AUTO_CATEGORIES.has(value)
  });

  if (addForm) {
    addForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isAuto = getAutoState();
      const list = readList(STORAGE_KEYS.expenses);
      list.push({
        id: crypto.randomUUID(),
        mode: isAuto ? "auto" : "manual",
        category: byId("expense-category").value,
        bankAccountId: isAuto ? byId("expense-bankAccountId").value : "",
        autoDebitDate: isAuto ? byId("expense-autoDebitDate").value : "",
        amount: parseMoney(byId("expense-amount").value),
        details: byId("expense-details").value.trim()
      });
      writeList(STORAGE_KEYS.expenses, list);
      window.location.href = "expenses.html";
    });
  }

  if (editForm) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const list = readList(STORAGE_KEYS.expenses);
    const item = list.find((entry) => entry.id === id);
    if (!item) {
      window.location.href = "expenses.html";
      return;
    }

    const initialCategory = item.category || "Household";
    byId("expense-category").value = initialCategory;
    byId("expense-bankAccountId").value = item.bankAccountId || "";
    byId("expense-autoDebitDate").value = item.autoDebitDate || "";
    byId("expense-amount").value = item.amount;
    byId("expense-details").value = item.details || "";
    getAutoState();

    editForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isAuto = getAutoState();
      item.mode = isAuto ? "auto" : "manual";
      item.category = byId("expense-category").value;
      item.bankAccountId = isAuto ? byId("expense-bankAccountId").value : "";
      item.autoDebitDate = isAuto ? byId("expense-autoDebitDate").value : "";
      item.amount = parseMoney(byId("expense-amount").value);
      item.details = byId("expense-details").value.trim();
      writeList(STORAGE_KEYS.expenses, list);
      window.location.href = "expenses.html";
    });
  }
}

function bootstrap() {
  initSeedData();

  const page = document.body.dataset.page;
  // ensureAuth(page);
  setNavActive(page);
  setupLogout();

  registerUser();
  loginUser();

  renderDashboard();

  renderAccountsList();
  setupAccountForms();
  bindDeleteModal({
    triggerAttr: "data-delete-account",
    modalId: "account-delete-modal",
    confirmId: "confirm-account-delete",
    onDelete: (id) => {
      writeList(
        STORAGE_KEYS.accounts,
        readList(STORAGE_KEYS.accounts).filter((item) => item.id !== id)
      );
      renderAccountsList();
    }
  });

  renderInvestmentsList();
  setupInvestmentForms();
  bindDeleteModal({
    triggerAttr: "data-delete-investment",
    modalId: "investment-delete-modal",
    confirmId: "confirm-investment-delete",
    onDelete: (id) => {
      writeList(
        STORAGE_KEYS.investments,
        readList(STORAGE_KEYS.investments).filter((item) => item.id !== id)
      );
      renderInvestmentsList();
    }
  });

  renderExpensesList();
  setupExpenseForms();
  bindDeleteModal({
    triggerAttr: "data-delete-expense",
    modalId: "expense-delete-modal",
    confirmId: "confirm-expense-delete",
    onDelete: (id) => {
      writeList(
        STORAGE_KEYS.expenses,
        readList(STORAGE_KEYS.expenses).filter((item) => item.id !== id)
      );
      renderExpensesList();
    }
  });
}

document.addEventListener("DOMContentLoaded", bootstrap);
