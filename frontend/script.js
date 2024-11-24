
// Function to fetch medicines on main page
async function fetchMedicines() {
    try {
        const response = await fetch('/medicines');
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.medicines || !Array.isArray(data.medicines)) {
            throw new Error("Invalid data format received.");
        }

        const list = document.getElementById('medicine-list');
        list.innerHTML = ""; // Clear the list in case of re-fetch
        data.medicines.forEach(med => {
            const item = document.createElement('li');
            const name = med.name || "Unknown Medicine";
            const price = med.price !== null ? `£${med.price}` : "Price not available";

            item.innerHTML = `<strong>${name}</strong> - ${price} <a href="/medicine/${encodeURIComponent(name)}" class="view-button">View Details</a>`;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        document.getElementById('medicine-list').innerHTML = "<li>Unable to load medicines. Please try again later.</li>";
    }
}

// Fetch medicine for specific medicine information page
window.onload = fetchMedicines;

const medicineName = decodeURIComponent(window.location.pathname.split('/medicine/')[1]);

async function fetchMedicineDetails() {
    try {
        const response = await fetch(`/medicines/${medicineName}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById('medicine-details').innerHTML = `<p>${data.error}</p>`;
        } else {
            const name = data.name || "Unknown Medicine";
            const price = data.price !== null ? `£${data.price}` : "Price not available";
            document.getElementById('medicine-details').innerHTML = `

                <h2>${name}</h2>
                <p>${price}</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching medicine details:', error);
    }
}

// Fetch details on page load
fetchMedicineDetails();
