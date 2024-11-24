// Function to fetch medicines on the main page
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

fetchMedicineDetails();


document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.getElementById('delete-button');
    console.log(deleteButton);  // Verify button is found

    if (deleteButton) {
        deleteButton.addEventListener('click', deleteMedicine);
    } else {
        console.error('Delete button not found');
    }
});

async function deleteMedicine() {
    console.log('Delete button clicked');  // Debugging log

    const medicineName = decodeURIComponent(window.location.pathname.split('/medicine/')[1]);
    console.log('Medicine to delete:', medicineName);

    const confirmation = confirm("Are you sure you want to delete this medicine?");
    if (!confirmation) return;

    try {
        const response = await fetch(`/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // Ensure proper encoding
            },
            body: new URLSearchParams({
                'name': medicineName  // Sending name as form data
            }),
        });

        const data = await response.json();
        console.log(data);  // Check the response

        if (data.message) {
            alert(data.message);
            window.location.href = "/"; // Redirect to the main page after deleting
        } else {
            alert('Failed to delete medicine.');
        }
    } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('An error occurred while deleting the medicine.');
    }
}


// Add event listener for form submission
document.getElementById('create-form').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Get form data
    const name = document.getElementById('medicine-name').value;
    const price = parseFloat(document.getElementById('medicine-price').value);

    // Validate inputs
    if (!name || isNaN(price)) {
        alert('Please provide valid medicine name and price.');
        return;
    }

    // Send data to the backend via POST request
    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // Ensure proper encoding
            },
            body: new URLSearchParams({
                'name': name,
                'price': price
            }),
        });

        const data = await response.json();

        if (data.message) {
            alert('Medicine added successfully!');
            // Redirect back to the index page or refresh the page
            window.location.href = "/";  // This redirects the user back to the main page
        } else {
            alert('Failed to add medicine.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the medicine.');
    }
});
