const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let currentDayIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadTables();
});

function createTable(day, dayIndex) {
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('day-table');
    tableContainer.setAttribute('data-day-index', dayIndex);

    const heading = document.createElement('h2');
    heading.textContent = `Tasks for ${day}`;
    tableContainer.appendChild(heading);

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Utensils Cleaning</th>
                <th>Sweeping</th>
                <th>Water</th>
                <th>Water Tin</th>
            </tr>
        </thead>
        <tbody>
            ${createRow('Pavan', dayIndex)}
            ${createRow('Vineesh', dayIndex)}
            ${createRow('Vicky', dayIndex)}
            ${createRow('Sravan', dayIndex)}
            ${createRow('Nithesh', dayIndex)}
        </tbody>
    `;
    tableContainer.appendChild(table);

    document.getElementById('tables-container').appendChild(tableContainer);

    restoreCheckboxStates(dayIndex);
}

function createRow(name, dayIndex) {
    return `
        <tr>
            <td>${name}</td>
            <td><input type="checkbox" onclick="markCompleted(this, ${dayIndex})"></td>
            <td><input type="checkbox" onclick="markCompleted(this, ${dayIndex})"></td>
            <td><input type="checkbox" onclick="markCompleted(this, ${dayIndex})"></td>
            <td><input type="checkbox" onclick="markCompleted(this, ${dayIndex})"></td>
        </tr>
    `;
}

function markCompleted(checkbox, dayIndex) {
    const table = checkbox.closest('table');
    const allCheckboxes = table.querySelectorAll('input[type="checkbox"]');
    const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked);

    saveCheckboxStates(dayIndex);

    if (anyChecked && currentDayIndex < daysOfWeek.length - 1) {
        const allRows = table.querySelectorAll('tbody tr');
        let allRowsCompleted = true;

        allRows.forEach(row => {
            const rowCheckboxes = row.querySelectorAll('input[type="checkbox"]');
            if (!Array.from(rowCheckboxes).some(cb => cb.checked)) {
                allRowsCompleted = false;
            }
        });

        if (allRowsCompleted) {
            currentDayIndex++;
            createTable(daysOfWeek[currentDayIndex], currentDayIndex);
        }
    }
}

function saveCheckboxStates(dayIndex) {
    const table = document.querySelector(`div[data-day-index="${dayIndex}"] table`);
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');
    const checkboxStates = Array.from(checkboxes).map(checkbox => checkbox.checked);
    localStorage.setItem(`day-${dayIndex}-checkboxes`, JSON.stringify(checkboxStates));
}

function restoreCheckboxStates(dayIndex) {
    const table = document.querySelector(`div[data-day-index="${dayIndex}"] table`);
    const savedStates = JSON.parse(localStorage.getItem(`day-${dayIndex}-checkboxes`)) || [];
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = savedStates[index] || false;
    });
}

function loadTables() {
    for (let i = 0; i < daysOfWeek.length; i++) {
        if (localStorage.getItem(`day-${i}-checkboxes`)) {
            currentDayIndex = i;
            createTable(daysOfWeek[i], i);
        }
    }

    if (currentDayIndex === 0) {
        createTable(daysOfWeek[currentDayIndex], currentDayIndex);
    }
}
