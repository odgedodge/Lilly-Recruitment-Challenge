// Fetch medicine data from API
async function fetchMedicines() {
    try {
        const response = await fetch('/medicines');
        const data = await response.json();
        
        const list = document.getElementById('medicine-list');
        data.medicines.forEach(med => {
            const item = document.createElement('li');
            item.innerHTML = `<strong>${med.name}</strong> - $${med.price} <a href="/medicine/${med.name}" class="view-button">View Details</a>`;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
    }
}

// Fetch medicines on page load
window.onload = fetchMedicines;

const medicineName = decodeURIComponent(window.location.pathname.split('/medicine/')[1]);

async function fetchMedicineDetails() {
    try {
        const response = await fetch(`/medicines/${medicineName}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById('medicine-details').innerHTML = `<p>${data.error}</p>`;
        } else {
            document.getElementById('medicine-details').innerHTML = `
                <h2>${data.name}</h2>
                <p>Price: $${data.price}</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching medicine details:', error);
    }
}

// Fetch details on page load
fetchMedicineDetails();