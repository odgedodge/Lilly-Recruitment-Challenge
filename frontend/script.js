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

        // Iterate over the medicines and create list items
        data.medicines.forEach(med => {
            const item = document.createElement('li');
            const name = med.name || "Unknown Medicine";
            const price = med.price !== null ? `£${med.price}` : "Price not available";

            // Create the clickable link for the medicine name
            const link = document.createElement('a');
            link.href = `/medicine/${encodeURIComponent(name)}`;  // URL to the medicine details page
            link.textContent = name;
            link.classList.add('medicine-name');  // Add a styling class for the medicine name

            // Add the medicine name link and price to the list item
            item.appendChild(link);
            item.innerHTML += ` - ${price}`;  // Append the price after the medicine name link

            list.appendChild(item);  // Add the item to the medicine list
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

// Update and Delete Functionalities

document.addEventListener('DOMContentLoaded', function () {
    const deleteButton = document.getElementById('delete-button');
    const updateButton = document.getElementById('update-button');
    const updateFormContainer = document.getElementById('update-form-container');
    const updateForm = document.getElementById('update-form');
    console.log(deleteButton);  // Verify button is found

    if (deleteButton) {
        deleteButton.addEventListener('click', deleteMedicine);
    } else {
        console.error('Delete button not found');
    }

    if (updateButton) {
        updateButton.addEventListener('click', function () {
            updateFormContainer.style.display = 'block';  // Show the update form
        });
    } else {
        console.error('Update button not found');
    }

    if (updateForm) {
        updateForm.addEventListener('submit', async function (event) {
            event.preventDefault();  // Prevent the default form submission behavior

            const newPrice = parseFloat(document.getElementById('new-price').value);
            if (isNaN(newPrice)) {
                alert('Please provide a valid price.');
                return;
            }

            const medicineName = decodeURIComponent(window.location.pathname.split('/medicine/')[1]);

            // Send the updated price to the backend via POST request
            try {
                const response = await fetch('/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'name': medicineName,
                        'price': newPrice
                    }),
                });

                const data = await response.json();
                if (data.message) {
                    alert(data.message);
                    window.location.reload();  // Reload the page to update the details
                } else {
                    alert('Failed to update medicine.');
                }
            } catch (error) {
                console.error('Error updating medicine:', error);
                alert('An error occurred while updating the medicine.');
            }
        });
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
