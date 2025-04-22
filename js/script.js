let rawData = [];

async function fetchData() {
    try {
        const res = await fetch('data.json');  // Make sure this path is correct
        if (!res.ok) throw new Error('Network response was not ok');
        rawData = await res.json();
        populateFilters();
        renderTable(rawData);  // Initially render the full table
    } catch (error) {
        console.error("Failed to load data.json", error);
    }
}

function populateFilters() {
    const countries = new Set();

    rawData.forEach(row => {
        countries.add(row['Country']);
    });

    // Predefined options
    const fixedZones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'];
    const fixedTerms = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];

    populateSelect('zoneFilter', fixedZones);
    populateSelect('termFilter', fixedTerms);
    populateSelect('countryFilter', [...countries]);
}

function populateSelect(id, items) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Select All</option>';  // Clear existing options
    items.sort().forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        select.appendChild(opt);
    });

    // Attach event listener for filter changes
    select.addEventListener('change', applyFilters);
}

function applyFilters() {
    const zoneVal = document.getElementById('zoneFilter').value;
    const termVal = document.getElementById('termFilter').value;
    const countryVal = document.getElementById('countryFilter').value;

    // Filter the data based on selected values
    const filtered = rawData.filter(row =>
        (zoneVal === "" || row['Zone'] === zoneVal) &&
        (termVal === "" || row['Term'] === termVal) &&
        (countryVal === "" || row['Country'] === countryVal)
    );

    renderTable(filtered);
}

function renderTable(data) {
    const tbody = document.getElementById('dataTable');
    tbody.innerHTML = "";  // Clear existing rows

    data.forEach(row => {
        const state = row['State/Territory'];
        const displayState = (state === null || state === undefined || state.trim() === "") ? 'NA' : state;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row['Zone']}</td>
            <td>${row['Country']}</td>
            <td>${displayState}</td>
            <td>${row['Term']}</td>
            <td>${row['Term Date']}</td>
            <td>${row['Number of Weeks']}</td>
            <td>${row['School Holidays Date']}</td>
            <td>${row['Number of School Holidays (Days)']}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Start fetching the data as soon as the page loads
document.addEventListener("DOMContentLoaded", fetchData);
