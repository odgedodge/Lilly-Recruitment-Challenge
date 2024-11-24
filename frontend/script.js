// Fetch medicine data from API
async function fetchMedicines() {
    try {
        const response = await fetch('/medicines');
        const data = await response.json();
        
        const list = document.getElementById('medicine-list');
        data.medicines.forEach(med => {
            const item = document.createElement('li');
            item.innerHTML = `<strong>${med.name}</strong> - $${med.price}`;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
    }
}

// Fetch medicines on page load
window.onload = fetchMedicines;