// Search / filter on the recipe listing page
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll('.recipe-row');
    const groups = document.querySelectorAll('.protein-group');

    rows.forEach(row => {
      const name = row.dataset.name || '';
      row.classList.toggle('hidden', query !== '' && !name.includes(query));
    });

    // Hide entire group if all rows are hidden
    groups.forEach(group => {
      const visibleRows = group.querySelectorAll('.recipe-row:not(.hidden)');
      group.style.display = visibleRows.length === 0 ? 'none' : '';
    });
  });
}

// Collapsible protein groups
function toggleGroup(heading) {
  const group = heading.closest('.protein-group');
  group.classList.toggle('collapsed');
}

// Add recipe form validation
const addForm = document.getElementById('addForm');
if (addForm) {
  addForm.addEventListener('submit', function (e) {
    let valid = true;

    const name = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (name.value.trim().length < 3) {
      nameError.textContent = 'Recipe name must be at least 3 characters.';
      name.style.borderColor = 'var(--accent)';
      valid = false;
      e.preventDefault();
    } else {
      nameError.textContent = '';
      name.style.borderColor = '';
    }

    const protein = document.getElementById('protein');
    if (!protein.value) {
      alert('Please select a protein type.');
      valid = false;
      e.preventDefault();
    }

    const instructions = document.getElementById('instructions');
    if (instructions.value.trim().length < 10) {
      alert('Please enter some instructions for the recipe.');
      valid = false;
      e.preventDefault();
    }

    return valid;
  });
}