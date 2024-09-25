document.addEventListener('DOMContentLoaded', async function () {
    const loginSection = document.getElementById('loginSection');
    const requestSection = document.getElementById('requestSection');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const requestForm = document.getElementById('requestForm');
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemButton = document.getElementById('addItemButton');
    const userRequestsDiv = document.getElementById('userRequests');
    const logoutButton = document.getElementById('logoutButton');
    const submitButton = document.getElementById('submitButton');
    let csrfToken = '';

    // Function to dynamically add an item input field
    function addItemField(isDeletable = false) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        // Create item input fields
        itemDiv.innerHTML = `
            <div class="item-fields">
                <label>Item Name:</label>
                <input type="text" name="item_name" placeholder="Enter item name" required>
                
                <label>Item Quantity:</label>
                <input type="number" name="item_quantity" min="1" value="1" required>
                
                <label>Item Type:</label>
                <select name="item_type" required>
                    <option value="Material">Material</option>
                    <option value="Equipment">Equipment</option>
                </select>
            </div>
        `;

        // If deletable, add the delete button
        if (isDeletable) {
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.classList.add('delete-item-btn');
            deleteButton.textContent = 'Delete';
            itemDiv.appendChild(deleteButton);

            // Add event listener for delete button
            deleteButton.addEventListener('click', () => {
                itemsContainer.removeChild(itemDiv);
            });
        }

        itemsContainer.appendChild(itemDiv);
    }

    // Function to fetch CSRF token
    async function getCsrfToken() {
        try {
            const response = await fetch('/csrf-token', {
                method: 'GET',
                credentials: 'include', // To include cookies
            });
            if (response.ok) {
                const data = await response.json();
                csrfToken = data.csrfToken;
            } else {
                console.error('Failed to fetch CSRF token');
            }
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }

    // Initial fetch of CSRF token
    await getCsrfToken();

    // Check if the user is already logged in (check if the session is active)
    async function checkSession() {
        try {
            const response = await fetch('/check-session', {
                method: 'GET',
                credentials: 'include', // To include cookies
            });
            if (response.ok) {
                loginSection.style.display = 'none';
                requestSection.style.display = 'block';
                loadUserRequests(); // Load requests after confirming the session is active
                addItemField(); // Add the first (non-deletable) item field
            } else {
                loginSection.style.display = 'block';
                requestSection.style.display = 'none';
            }
        } catch (error) {
            console.error('Error checking session:', error);
            loginSection.style.display = 'block'; // Default to showing login form if there's an error
            requestSection.style.display = 'none';
        }
    }

    // Call the session check function on page load
    checkSession();

    // Handle login form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken // Include CSRF token in headers
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // If the response is ok (status 200), process the JSON as expected
                loginSection.style.display = 'none';
                requestSection.style.display = 'block';
                loadUserRequests(); // Load requests after successful login
                addItemField(); // Add the first (non-deletable) item field
                await getCsrfToken(); // Refresh CSRF token after login
            } else {
                // Handle different response types (e.g., JSON or text)
                const contentType = response.headers.get('content-type');
                let errorMessage;

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || 'Login failed';
                } else {
                    const errorText = await response.text(); // Handle plain text responses
                    errorMessage = errorText;
                }

                loginMessage.textContent = `Error: ${errorMessage}`;
                // Re-fetch CSRF token in case it changed
                await getCsrfToken();
            }
        } catch (error) {
            console.error('Error logging in:', error);
            loginMessage.textContent = 'An error occurred while logging in.';
        }
    });

    // Function to dynamically add new item fields when "Add Item" is clicked
    addItemButton.addEventListener('click', function () {
        addItemField(true); // New item fields are deletable
    });

    // Handle request form submission (for submitting a request)
    requestForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const comments = document.getElementById('comments').value;
        const items = [...document.querySelectorAll('.item')].map(item => ({
            item_name: item.querySelector('input[name="item_name"]').value,
            item_quantity: item.querySelector('input[name="item_quantity"]').value,
            item_type: item.querySelector('select[name="item_type"]').value
        }));

        try {
            const response = await fetch('/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken // Include CSRF token in headers
                },
                credentials: 'include', // Include cookies
                body: JSON.stringify({ comments, items })
            });

            if (response.ok) {
                alert('Request submitted successfully!');
                requestForm.reset();
                itemsContainer.innerHTML = ''; // Clear existing items
                addItemField(); // Add the first (non-deletable) item field
                loadUserRequests(); // Reload requests to show the new one
                await getCsrfToken(); // Refresh CSRF token after request
            } else {
                const contentType = response.headers.get('content-type');
                let errorMessage;

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || 'Request failed';
                } else {
                    const errorText = await response.text(); // Handle plain text responses
                    errorMessage = errorText;
                }

                alert('Error: ' + errorMessage);
                // Re-fetch CSRF token in case it changed
                await getCsrfToken();
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('An error occurred while submitting the request.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Request';
        }
    });

    // Function to load user requests
    async function loadUserRequests() {
        try {
            const response = await fetch('/requests', {
                method: 'GET',
                credentials: 'include', // Include cookies
            });
            if (response.ok) {
                const requests = await response.json();
                userRequestsDiv.innerHTML = requests.map(req => `
                    <div class="request">
                        <h3>Request ID: ${req.request_id}</h3>
                        <p><strong>Date:</strong> ${new Date(req.request_date).toLocaleDateString()}</p>
                        <p><strong>Comments:</strong> ${req.comments}</p>
                        <p><strong>Status:</strong> ${req.status_name}</p>
                        <h4>Items:</h4>
                        <ul>
                            ${req.items.map(item => `
                                <li>
                                    <strong>${item.item_name}</strong> - Quantity: ${item.item_quantity}, Type: ${item.item_type}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('');
            } else {
                userRequestsDiv.innerHTML = '<p>Error loading requests.</p>';
            }
        } catch (error) {
            console.error('Error loading user requests:', error);
            userRequestsDiv.innerHTML = '<p>Error loading requests.</p>';
        }
    }

    // Handle logout button click
    logoutButton.addEventListener('click', async function () {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'CSRF-Token': csrfToken // Include CSRF token in headers
                },
                credentials: 'include', // Include cookies
            });
            if (response.ok) {
                alert('Logout successful!');
                location.reload();
            } else {
                alert('Error logging out.');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('An error occurred while logging out.');
        }
    });
});
