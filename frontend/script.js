document.addEventListener('DOMContentLoaded', () => {
  const apiURL = 'http://localhost:3000/api/groceries';
  const form = document.getElementById('groceryForm');
  const tableBody = document.getElementById('groceryTableBody');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const themeToggle = document.getElementById('themeToggle');
  let groceries = [];
  let isDark = false;

  const fetchGroceries = async () => {
    try {
      const res = await fetch(apiURL);
      groceries = await res.json();
      localStorage.setItem('groceries', JSON.stringify(groceries));
    } catch {
      groceries = JSON.parse(localStorage.getItem('groceries')) || [];
    }
    renderTable(groceries);
  };

  const renderTable = (items) => {
    tableBody.innerHTML = '';
    items.forEach(item => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      const nameInput = document.createElement('input');
      nameInput.value = item.name;
      nameCell.appendChild(nameInput);

      const qtyCell = document.createElement('td');
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.value = item.quantity;
      qtyCell.appendChild(qtyInput);

      const catCell = document.createElement('td');
      const catInput = document.createElement('input');
      catInput.value = item.category;
      catCell.appendChild(catInput);

      const actionsCell = document.createElement('td');
      actionsCell.className = 'actions';

      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.onclick = async () => {
        await updateItem(item.id, nameInput.value, parseInt(qtyInput.value), catInput.value);
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = async () => {
        if (confirm('Delete this item?')) {
          await deleteItem(item.id);
        }
      };

      actionsCell.appendChild(saveBtn);
      actionsCell.appendChild(delBtn);

      row.appendChild(nameCell);
      row.appendChild(qtyCell);
      row.appendChild(catCell);
      row.appendChild(actionsCell);

      tableBody.appendChild(row);
    });
  };

  const addItem = async (name, quantity, category) => {
    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, category })
      });

      if (!res.ok) throw new Error('Failed to add item');
      const newItem = await res.json();

      groceries.push(newItem);
      renderTable(groceries);
    } catch {
      groceries.push({ id: Date.now(), name, quantity, category });
      localStorage.setItem('groceries', JSON.stringify(groceries));
      renderTable(groceries);
    }
  };

  const updateItem = async (id, name, quantity, category) => {
    try {
      await fetch(`${apiURL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, category })
      });
    } catch {
      groceries = groceries.map(item => item.id === id ? { ...item, name, quantity, category } : item);
      localStorage.setItem('groceries', JSON.stringify(groceries));
    }
    fetchGroceries();
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
    } catch {
      groceries = groceries.filter(item => item.id !== id);
      localStorage.setItem('groceries', JSON.stringify(groceries));
    }
    fetchGroceries();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const category = document.getElementById('category').value;
    if (name && quantity && category) {
      addItem(name, quantity, category);
      form.reset();
    }
  });

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase();
    const filtered = groceries.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
  });

  fetchGroceries();
});
