/**
 * Configuration & Utils
 */
const CONFIG = {
    STORAGE_KEY: 'expense_tracker_data_v2',
    STORAGE_VERSION: '1.1',
    MAX_AMOUNT: 999999.99,
    MAX_NAME_LENGTH: 100,
    DEFAULT_CATEGORIES: [
        { id: 'Food', name: 'Food', icon: '🍔', color: '#FF6384' },
        { id: 'Transport', name: 'Transport', icon: '🚗', color: '#36A2EB' },
        { id: 'Fun', name: 'Fun', icon: '🎉', color: '#FFCE56' }
    ],
    COLORS: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8AC926', '#1982C4', '#F15BB5']
};

function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Generate random color for new categories
function getRandomColor(index) {
    return CONFIG.COLORS[index % CONFIG.COLORS.length];
}

/**
 * ValidationService
 */
class ValidationService {
    validateName(name) {
        if (!name || name.trim().length === 0) return { valid: false, message: 'Required.' };
        if (name.length > CONFIG.MAX_NAME_LENGTH) return { valid: false, message: 'Too long.' };
        return { valid: true };
    }
    validateAmount(amount) {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return { valid: false, message: 'Must be > 0.' };
        if (val > CONFIG.MAX_AMOUNT) return { valid: false, message: 'Amount too high.' };
        return { valid: true };
    }
    validateCategory(category, activeCategories) {
        if (!category) return { valid: false, message: 'Required.' };
        if (!activeCategories.some(c => c.name === category)) return { valid: false, message: 'Invalid.' };
        return { valid: true };
    }
}

/**
 * StorageService
 */
class StorageService {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.version = CONFIG.STORAGE_VERSION;
    }
    _getDefaultData() {
        return {
            version: this.version,
            transactions: [],
            settings: { 
                nextId: 1, 
                theme: 'light',
                budgetLimit: 0,
                categories: [...CONFIG.DEFAULT_CATEGORIES]
            }
        };
    }
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (e) { return false; }
    }
    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : this._getDefaultData();
        } catch (e) { return this._getDefaultData(); }
    }
}

/**
 * ChartService
 */
class ChartService {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.chart = null;
        this.emptyMessage = document.getElementById('chart-empty-message');
    }
    updateData(categoryTotals, categories) {
        if (!this.chart) {
            const ctx = this.canvas.getContext('2d');
            this.chart = new Chart(ctx, { type: 'pie', data: {}, options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1.5, plugins: { legend: { position: 'right' } } } });
        }

        const labels = [];
        const data = [];
        const bgColors = [];
        let hasData = false;

        categoryTotals.forEach((amount, catName) => {
            if (amount > 0) {
                hasData = true;
                labels.push(catName);
                data.push(amount);
                const catObj = categories.find(c => c.name === catName);
                bgColors.push(catObj ? catObj.color : '#cccccc');
            }
        });

        if (!hasData) {
            this.canvas.classList.add('hidden');
            this.emptyMessage.classList.remove('hidden');
        } else {
            this.canvas.classList.remove('hidden');
            this.emptyMessage.classList.add('hidden');
            this.chart.data = { labels, datasets: [{ data, backgroundColor: bgColors, borderWidth: 1 }] };
            this.chart.update();
        }
    }
}

/**
 * TransactionModel
 */
class TransactionModel {
    constructor(storageService) {
        this.storage = storageService;
        this.data = this.storage.load();
    }
    _save() { this.storage.save(this.data); }
    
    // Theme
    getTheme() { return this.data.settings.theme || 'light'; }
    setTheme(theme) { this.data.settings.theme = theme; this._save(); }
    
    // Budget
    getBudgetLimit() { return this.data.settings.budgetLimit || 0; }
    setBudgetLimit(limit) { this.data.settings.budgetLimit = parseFloat(limit) || 0; this._save(); }
    
    // Categories
    getCategories() { return this.data.settings.categories; }
    addCategory(name, icon) {
        const categories = this.data.settings.categories;
        if(categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return false;
        categories.push({ id: name, name, icon, color: getRandomColor(categories.length) });
        this._save(); return true;
    }
    deleteCategory(name) {
        // Prevent deleting if used
        if(this.data.transactions.some(t => t.category === name)) return false;
        this.data.settings.categories = this.data.settings.categories.filter(c => c.name !== name);
        this._save(); return true;
    }

    // Transactions
    addTransaction(txData) {
        const tx = {
            id: this.data.settings.nextId++,
            name: txData.name,
            amount: parseFloat(txData.amount),
            category: txData.category,
            createdAt: new Date().toISOString()
        };
        this.data.transactions.push(tx);
        this._save();
    }
    getTransactions() {
        return [...this.data.transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    deleteTransaction(id) {
        this.data.transactions = this.data.transactions.filter(t => t.id !== id);
        this._save();
    }
    
    // Calculations
    getTotalBalance() {
        return this.data.transactions.reduce((sum, t) => sum + t.amount, 0);
    }
    getCategoryTotals() {
        const totals = new Map();
        this.data.settings.categories.forEach(cat => totals.set(cat.name, 0));
        this.data.transactions.forEach(t => {
            totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
        });
        return totals;
    }
    getMonthlySummary() {
        const summary = {};
        this.data.transactions.forEach(t => {
            const date = new Date(t.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
            if(!summary[monthKey]) summary[monthKey] = { label: monthLabel, total: 0 };
            summary[monthKey].total += t.amount;
        });
        return Object.keys(summary).sort().reverse().map(key => summary[key]);
    }
}

/**
 * TransactionView
 */
class TransactionView {
    constructor(chartService) {
        this.chartService = chartService;
        
        this.form = document.getElementById('transaction-form');
        this.catSelect = document.getElementById('category');
        this.txList = document.getElementById('transaction-list');
        this.totalDisplay = document.getElementById('total-balance');
        this.budgetWarning = document.getElementById('budget-warning');
        this.budgetInput = document.getElementById('budget-limit');
        this.monthlyList = document.getElementById('monthly-summary-list');
        
        this.themeBtn = document.getElementById('theme-toggle');
        this.catForm = document.getElementById('category-form');
        this.catList = document.getElementById('category-list');
    }

    // Theme Update
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Category Update
    renderCategories(categories) {
        // Update Select Dropdown
        this.catSelect.innerHTML = '<option value="" disabled selected>Select a category</option>' + 
            categories.map(c => `<option value="${escapeHTML(c.name)}">${c.icon} ${escapeHTML(c.name)}</option>`).join('');
        
        // Update Management List
        this.catList.innerHTML = categories.map(c => `
            <div class="cat-tag" style="border-color: ${c.color}">
                ${c.icon} ${escapeHTML(c.name)} 
                <button type="button" class="btn-del-cat" data-name="${escapeHTML(c.name)}">&times;</button>
            </div>
        `).join('');
    }

    // Update Dashboard & Lists
    renderDashboard(total, limit, monthlyData) {
        this.totalDisplay.textContent = formatCurrency(total);
        this.budgetInput.value = limit || '';
        
        // Budget Warning Highlight
        if (limit > 0 && total > limit) {
            this.totalDisplay.classList.add('limit-exceeded');
            this.budgetWarning.classList.remove('hidden');
        } else {
            this.totalDisplay.classList.remove('limit-exceeded');
            this.budgetWarning.classList.add('hidden');
        }

        // Monthly Summary
        if (monthlyData.length === 0) {
            this.monthlyList.innerHTML = '<div class="empty-state">No data yet.</div>';
        } else {
            this.monthlyList.innerHTML = monthlyData.map(m => `
                <div class="monthly-item">
                    <span>${m.label}</span>
                    <strong>${formatCurrency(m.total)}</strong>
                </div>
            `).join('');
        }
    }

    renderTransactions(transactions, categories) {
        if (transactions.length === 0) {
            this.txList.innerHTML = '<div class="empty-state">No transactions yet. Add one above!</div>';
            return;
        }
        this.txList.innerHTML = transactions.map(tx => {
            const cat = categories.find(c => c.name === tx.category) || { icon: '🏷️', color: '#999' };
            return `
                <div class="transaction-item">
                    <div>
                        <div class="transaction-name">${escapeHTML(tx.name)}</div>
                        <div class="transaction-meta">
                            <span class="badge" style="background-color: ${cat.color}">${cat.icon} ${escapeHTML(tx.category)}</span>
                            <span>${formatDate(tx.createdAt)}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap: 10px;">
                        <span class="transaction-amount">${formatCurrency(tx.amount)}</span>
                        <button class="btn-delete" data-id="${tx.id}">&times;</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateChart(categoryTotals, categories) {
        this.chartService.updateData(categoryTotals, categories);
    }
    
    // Binding Events
    bindEvents(handlers) {
        // Add Transaction
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            handlers.onAddTransaction({
                name: document.getElementById('name').value,
                amount: document.getElementById('amount').value,
                category: this.catSelect.value
            });
        });
        // Delete Transaction
        this.txList.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-delete')) handlers.onDeleteTransaction(parseInt(e.target.dataset.id));
        });
        // Theme Toggle
        this.themeBtn.addEventListener('click', () => handlers.onToggleTheme());
        // Set Budget limit
        this.budgetInput.addEventListener('change', (e) => handlers.onSetBudget(e.target.value));
        
        // Add Category
        this.catForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('new-category-name').value;
            const icon = document.getElementById('new-category-icon').value;
            if(name && icon) handlers.onAddCategory(name, icon);
            this.catForm.reset();
        });
        // Delete Category
        this.catList.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-del-cat')) handlers.onDeleteCategory(e.target.dataset.name);
        });
    }
}

/**
 * Controller
 */
class TransactionController {
    constructor(model, view, validator) {
        this.model = model; this.view = view; this.validator = validator;
    }

    init() {
        this.view.applyTheme(this.model.getTheme());
        this._refresh();
        this.view.bindEvents({
            onAddTransaction: this.addTransaction.bind(this),
            onDeleteTransaction: id => { if(confirm('Delete?')) { this.model.deleteTransaction(id); this._refresh(); } },
            onToggleTheme: () => {
                const newTheme = this.model.getTheme() === 'light' ? 'dark' : 'light';
                this.model.setTheme(newTheme);
                this.view.applyTheme(newTheme);
            },
            onSetBudget: limit => { this.model.setBudgetLimit(limit); this._refresh(); },
            onAddCategory: (name, icon) => { 
                if(!this.model.addCategory(name, icon)) alert('Category already exists!');
                this._refresh(); 
            },
            onDeleteCategory: name => { 
                if(!this.model.deleteCategory(name)) alert('Cannot delete category in use by transactions!');
                this._refresh(); 
            }
        });
    }

    _refresh() {
        const categories = this.model.getCategories();
        this.view.renderCategories(categories);
        this.view.renderDashboard(this.model.getTotalBalance(), this.model.getBudgetLimit(), this.model.getMonthlySummary());
        this.view.renderTransactions(this.model.getTransactions(), categories);
        this.view.updateChart(this.model.getCategoryTotals(), categories);
    }

    addTransaction(data) {
        document.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
        let isValid = true;
        const nameVal = this.validator.validateName(data.name);
        const amtVal = this.validator.validateAmount(data.amount);
        const catVal = this.validator.validateCategory(data.category, this.model.getCategories());
        
        if(!nameVal.valid) { document.getElementById('name-error').textContent = nameVal.message; document.getElementById('name-error').classList.add('visible'); isValid = false; }
        if(!amtVal.valid) { document.getElementById('amount-error').textContent = amtVal.message; document.getElementById('amount-error').classList.add('visible'); isValid = false; }
        if(!catVal.valid) { document.getElementById('category-error').textContent = catVal.message; document.getElementById('category-error').classList.add('visible'); isValid = false; }

        if(isValid) {
            this.model.addTransaction(data);
            document.getElementById('transaction-form').reset();
            this._refresh();
        }
    }
}

/**
 * Bootstrapper
 */
document.addEventListener('DOMContentLoaded', () => {
    const storage = new StorageService(CONFIG.STORAGE_KEY);
    const canvas = document.getElementById('expense-chart');
    const controller = new TransactionController(
        new TransactionModel(storage),
        new TransactionView(new ChartService(canvas)),
        new ValidationService()
    );
    controller.init();
});