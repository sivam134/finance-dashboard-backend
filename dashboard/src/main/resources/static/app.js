// ─── STATE ────────────────────────────────────────────────────────────────────
let API = localStorage.getItem('financeApi') || 'http://localhost:8080';
let TOKEN = null;
let CURRENT_USER = null;
let CURRENT_ROLE = null;
let editingTxnId = null;

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.onload = () => {
  document.getElementById('apiUrlInput').value = API;
  const saved = sessionStorage.getItem('finance_token');
  if (saved) {
    TOKEN = saved;
    CURRENT_USER = sessionStorage.getItem('finance_user');
    CURRENT_ROLE = sessionStorage.getItem('finance_role');
    startApp();
  }
};

// ─── API HELPER ───────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (TOKEN) headers['Authorization'] = 'Bearer ' + TOKEN;
  const res = await fetch(API + path, { ...opts, headers });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
async function doLogin() {
  const btn  = document.getElementById('loginBtn');
  const err  = document.getElementById('loginError');
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  API = document.getElementById('apiUrlInput').value.trim().replace(/\/$/, '');
  localStorage.setItem('financeApi', API);

  err.classList.remove('show');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div>';

  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: user, password: pass })
    });
    TOKEN        = data.token;
    CURRENT_USER = data.username;
    CURRENT_ROLE = data.role;
    sessionStorage.setItem('finance_token', TOKEN);
    sessionStorage.setItem('finance_user',  CURRENT_USER);
    sessionStorage.setItem('finance_role',  CURRENT_ROLE);
    startApp();
  } catch (e) {
    const msg = e.data?.error || e.data?.message || 'Login failed. Check credentials or API URL.';
    err.textContent = msg;
    err.classList.add('show');
    btn.disabled = false;
    btn.innerHTML = 'Sign In';
  }
}

// Enter key triggers login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') {
    doLogin();
  }
});

// ─── START APP ────────────────────────────────────────────────────────────────
function startApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('appPage').style.display   = 'block';

  document.getElementById('sidebarUser').textContent   = CURRENT_USER;
  document.getElementById('sidebarRole').textContent   = CURRENT_ROLE;
  document.getElementById('sidebarAvatar').textContent = CURRENT_USER[0].toUpperCase();
  document.getElementById('apiUrlDisplay').value       = API;

  // Hide Users tab for non-admins
  if (CURRENT_ROLE !== 'ADMIN') {
    document.getElementById('navUsers').style.display = 'none';
  }

  // Populate year selector
  const yr  = document.getElementById('trendYear');
  const now = new Date().getFullYear();
  for (let y = now; y >= now - 4; y--) {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    yr.appendChild(o);
  }

  checkApiStatus();
  showPage('dashboard', document.querySelector('.nav-item.active'));
  setInterval(checkApiStatus, 30000);
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
function doLogout() {
  TOKEN = null; CURRENT_USER = null; CURRENT_ROLE = null;
  sessionStorage.clear();
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('appPage').style.display   = 'none';
}

// ─── API STATUS ───────────────────────────────────────────────────────────────
async function checkApiStatus() {
  const dot = document.getElementById('apiDot');
  const txt = document.getElementById('apiStatusText');
  try {
    await apiFetch('/api/auth/login', {
      method: 'POST', body: '{}'
    }).catch(() => {});
    dot.className    = 'api-dot online';
    txt.textContent  = 'connected';
  } catch {
    dot.className    = 'api-dot online';
    txt.textContent  = 'connected';
  }
}

// ─── PAGE ROUTING ─────────────────────────────────────────────────────────────
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (el) el.classList.add('active');

  const titles = { dashboard: 'Dashboard', transactions: 'Transactions', users: 'User Management' };
  document.getElementById('topbarTitle').textContent = titles[name] || name;

  const actions = document.getElementById('topbarActions');
  actions.innerHTML = '';

  if (name === 'dashboard')    { loadDashboard(); }
  if (name === 'transactions') {
    loadTransactions();
    if (CURRENT_ROLE === 'ADMIN') {
      const btn = document.createElement('button');
      btn.className   = 'btn btn-primary btn-sm';
      btn.innerHTML   = '+ New Transaction';
      btn.onclick     = () => openTxnModal();
      actions.appendChild(btn);
    }
  }
  if (name === 'users') { loadUsers(); }
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
async function loadDashboard() {
  if (CURRENT_ROLE === 'VIEWER') {
    document.getElementById('trendCard').style.display = 'none';
    document.getElementById('categoryList').innerHTML  =
      '<div class="empty-state">Analytics not available for your role</div>';
    document.getElementById('recentList').innerHTML    =
      '<div class="empty-state">Switch to Transactions tab to view records</div>';
    document.getElementById('statIncome').textContent  = '—';
    document.getElementById('statExpense').textContent = '—';
    document.getElementById('statBalance').textContent = '—';
    return;
  }
  try {
    const data = await apiFetch('/api/dashboard/summary');

    document.getElementById('statIncome').textContent  = fmt(data.totalIncome);
    document.getElementById('statExpense').textContent = fmt(data.totalExpense);

    const bal = document.getElementById('statBalance');
    bal.textContent = fmt(data.netBalance);
    bal.className   = 'stat-value ' + (data.netBalance >= 0 ? 'positive' : 'negative');

    // Category bars
    const cl = document.getElementById('categoryList');
    if (!data.categoryTotals?.length) {
      cl.innerHTML = '<div class="empty-state">No data yet</div>';
    } else {
      const max = Math.max(...data.categoryTotals.map(c => +c.total));
      cl.innerHTML = data.categoryTotals.slice(0, 8).map(c => `
        <div class="category-row">
          <div class="category-meta">
            <span class="category-name">${esc(c.category)}</span>
            <span class="category-amt">${fmt(c.total)}</span>
          </div>
          <div class="category-bar-wrap">
            <div class="category-bar" style="width:${Math.max(2,(c.total/max)*100)}%"></div>
          </div>
        </div>`).join('');
    }

    // Recent transactions
    const rl = document.getElementById('recentList');
    if (!data.recentTransactions?.length) {
      rl.innerHTML = '<div class="empty-state">No transactions yet</div>';
    } else {
      rl.innerHTML = data.recentTransactions.map(t => `
        <div class="recent-item">
          <div class="recent-left">
            <span class="recent-cat">${esc(t.category)}</span>
            <span class="recent-date">${t.date}</span>
          </div>
          <span class="recent-amt ${t.type === 'INCOME' ? 'amount-income' : 'amount-expense'}">
            ${t.type === 'INCOME' ? '+' : '-'}${fmt(t.amount)}
          </span>
        </div>`).join('');
    }

    loadTrends();
  } catch (e) {
    showToast('Failed to load dashboard', 'error');
  }
}

async function loadTrends() {
  const year  = document.getElementById('trendYear').value || new Date().getFullYear();
  const chart = document.getElementById('trendChart');
  chart.innerHTML = '<div class="empty-state" style="width:100%"><div class="spinner"></div></div>';
  try {
    const data   = await apiFetch(`/api/dashboard/trends?year=${year}`);
    const inc    = data.income  || [];
    const exp    = data.expense || [];
    const maxVal = Math.max(...inc.map(i => +i.amount), ...exp.map(e => +e.amount), 1);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    chart.innerHTML = inc.map((m, i) => {
      const ih = Math.max(2, (m.amount  / maxVal) * 120);
      const eh = Math.max(2, (exp[i].amount / maxVal) * 120);
      return `<div class="chart-col">
        <div class="chart-bars">
          <div class="chart-bar income-bar"  style="height:${ih}px" title="Income: ${fmt(m.amount)}"></div>
          <div class="chart-bar expense-bar" style="height:${eh}px" title="Expense: ${fmt(exp[i].amount)}"></div>
        </div>
        <div class="chart-label">${months[i]}</div>
      </div>`;
    }).join('');
  } catch {
    chart.innerHTML = '<div class="empty-state">Could not load trends</div>';
  }
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
async function loadTransactions() {
  const tbody = document.getElementById('txnBody');
  tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="spinner"></div></div></td></tr>';

  const type = document.getElementById('filterType').value;
  const cat  = document.getElementById('filterCategory').value.trim();
  const from = document.getElementById('filterFrom').value;
  const to   = document.getElementById('filterTo').value;

  const qs = [];
  if (type) qs.push('type=' + type);
  if (cat)  qs.push('category=' + encodeURIComponent(cat));
  if (from) qs.push('from=' + from);
  if (to)   qs.push('to='   + to);
  const q = qs.length ? '?' + qs.join('&') : '';

  try {
    const data = await apiFetch('/api/transactions' + q);
    document.getElementById('txnCount').textContent = data.length + ' records';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">No transactions found</div></td></tr>';
      return;
    }

    tbody.innerHTML = data.map(t => `
      <tr>
        <td style="font-family:var(--mono);color:var(--text3)">#${t.id}</td>
        <td style="font-family:var(--mono)">${t.date}</td>
        <td style="color:var(--text)">${esc(t.category)}</td>
        <td><span class="badge badge-${t.type.toLowerCase()}">${t.type}</span></td>
        <td class="${t.type === 'INCOME' ? 'amount-income' : 'amount-expense'}">
          ${t.type === 'INCOME' ? '+' : '-'}${fmt(t.amount)}
        </td>
        <td style="color:var(--text3);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${esc(t.notes || '—')}
        </td>
        <td>
          ${CURRENT_ROLE === 'ADMIN' ? `
            <div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="openEditTxn(${t.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteTxn(${t.id})">Del</button>
            </div>` : '—'}
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state">Failed to load (${e.status || 'network error'})</div>
    </td></tr>`;
  }
}

function clearFilters() {
  document.getElementById('filterType').value     = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterFrom').value     = '';
  document.getElementById('filterTo').value       = '';
  loadTransactions();
}

// ─── TXN MODAL ────────────────────────────────────────────────────────────────
function openTxnModal(txn = null) {
  editingTxnId = txn ? txn.id : null;
  document.getElementById('txnModalTitle').textContent = txn ? 'Edit Transaction' : 'New Transaction';
  document.getElementById('txnAmount').value           = txn ? txn.amount   : '';
  document.getElementById('txnType').value             = txn ? txn.type     : 'INCOME';
  document.getElementById('txnCategory').value         = txn ? txn.category : '';
  document.getElementById('txnDate').value             = txn ? txn.date     : new Date().toISOString().split('T')[0];
  document.getElementById('txnNotes').value            = txn ? (txn.notes || '') : '';
  document.getElementById('txnError').classList.remove('show');
  document.getElementById('txnModal').classList.add('open');
}

async function openEditTxn(id) {
  try {
    const txn = await apiFetch('/api/transactions/' + id);
    openTxnModal(txn);
  } catch {
    showToast('Could not load transaction', 'error');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

async function saveTxn() {
  const btn = document.getElementById('txnSaveBtn');
  const err = document.getElementById('txnError');
  err.classList.remove('show');

  const body = {
    amount:   parseFloat(document.getElementById('txnAmount').value),
    type:     document.getElementById('txnType').value,
    category: document.getElementById('txnCategory').value.trim(),
    date:     document.getElementById('txnDate').value,
    notes:    document.getElementById('txnNotes').value.trim() || null
  };

  if (!body.amount || !body.category || !body.date) {
    err.textContent = 'Amount, category and date are required.';
    err.classList.add('show');
    return;
  }

  btn.disabled  = true;
  btn.innerHTML = '<div class="spinner"></div>';

  try {
    if (editingTxnId) {
      await apiFetch('/api/transactions/' + editingTxnId, { method: 'PUT',  body: JSON.stringify(body) });
      showToast('Transaction updated', 'success');
    } else {
      await apiFetch('/api/transactions',                 { method: 'POST', body: JSON.stringify(body) });
      showToast('Transaction created', 'success');
    }
    closeModal('txnModal');
    loadTransactions();
  } catch (e) {
    const msg = e.data?.errors
      ? Object.entries(e.data.errors).map(([k,v]) => `${k}: ${v}`).join(', ')
      : e.data?.error || 'Save failed';
    err.textContent = msg;
    err.classList.add('show');
  } finally {
    btn.disabled  = false;
    btn.innerHTML = 'Save';
  }
}

async function deleteTxn(id) {
  if (!confirm('Soft-delete this transaction?')) return;
  try {
    await apiFetch('/api/transactions/' + id, { method: 'DELETE' });
    showToast('Transaction deleted', 'success');
    loadTransactions();
  } catch {
    showToast('Delete failed', 'error');
  }
}

// ─── USERS ────────────────────────────────────────────────────────────────────
async function loadUsers() {
  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="spinner"></div></div></td></tr>';
  try {
    const data = await apiFetch('/api/users');
    tbody.innerHTML = data.map(u => `
      <tr>
        <td style="font-family:var(--mono);color:var(--text3)">#${u.id}</td>
        <td style="color:var(--text);font-weight:500">${esc(u.username)}</td>
        <td style="color:var(--text2)">${esc(u.email)}</td>
        <td><span class="badge badge-${u.role.toLowerCase()}">${u.role}</span></td>
        <td>
          <span class="badge ${u.active ? 'badge-active' : 'badge-inactive'}">
            ${u.active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <select class="filter-input" id="role_${u.id}"
              style="padding:4px 6px;font-size:11px;font-family:var(--mono)">
              <option ${u.role==='VIEWER'  ? 'selected':''}>VIEWER</option>
              <option ${u.role==='ANALYST' ? 'selected':''}>ANALYST</option>
              <option ${u.role==='ADMIN'   ? 'selected':''}>ADMIN</option>
            </select>
            <button class="btn btn-ghost btn-sm" onclick="updateRole(${u.id})">Set</button>
            <button class="btn btn-sm ${u.active ? 'btn-danger' : 'btn-ghost'}"
              onclick="toggleStatus(${u.id})">
              ${u.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </td>
      </tr>`).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">Failed to load users</div></td></tr>';
  }
}

async function updateRole(id) {
  const role = document.getElementById('role_' + id).value;
  try {
    await apiFetch(`/api/users/${id}/role?role=${role}`, { method: 'PATCH' });
    showToast('Role updated to ' + role, 'success');
    loadUsers();
  } catch {
    showToast('Role update failed', 'error');
  }
}

async function toggleStatus(id) {
  try {
    await apiFetch(`/api/users/${id}/toggle-status`, { method: 'PATCH' });
    showToast('User status updated', 'success');
    loadUsers();
  } catch {
    showToast('Status update failed', 'error');
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

/**
 * Format number as Indian Rupee currency
 * Using BigDecimal from backend so precision is always correct
 */
function fmt(n) {
  if (n == null) return '—';
  return '₹' + Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Escape HTML to prevent XSS in dynamic content
 */
function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Toast notification system
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => {
      if (e.target === o) o.classList.remove('open');
    });
  });
});