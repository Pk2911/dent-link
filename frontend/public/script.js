const API_URL = 'https://dent-link.onrender.com'; // Make sure this is YOUR Render URL

// State variables to track if we are editing
let isEditing = false;
let editingId = null;

// 1. Fetch and Display Patients
async function fetchPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const patients = await response.json();
        
        const list = document.getElementById('patient-list');
        list.innerHTML = ''; // Clear current list

        if (patients.length === 0) {
            list.innerHTML = '<tr><td colspan="5" style="text-align:center;">No appointments found.</td></tr>';
            return;
        }

        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.phone}</td>
                <td>${patient.appointment_date}</td>
                <td><span class="status-confirmed">Confirmed</span></td>
                <td>
                    <button class="edit-btn" onclick="startEdit(${patient.id}, '${patient.name}', '${patient.email}', '${patient.phone}', '${patient.appointment_date}')">
                        ✏️ Edit
                    </button>
                    <button class="delete-btn" onclick="deletePatient(${patient.id})">
                        🗑️ Delete
                    </button>
                </td>
            `;
            list.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching patients:', err);
    }
}

// 2. Handle Form Submit (Create OR Update)
document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get values from input fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;

    try {
        if (isEditing) {
            // --- UPDATE MODE ---
            const response = await fetch(`${API_URL}/patients/${editingId}`, {
                method: 'PUT', // We use PUT for updates
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, appointment_date: date })
            });
            
            if (response.ok) {
                alert('Appointment Updated!');
                resetForm(); // Switch back to "Add Mode"
            }
        } else {
            // --- CREATE MODE (Original) ---
            const response = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, appointment_date: date })
            });

            if (response.ok) {
                alert('Appointment Booked!');
                document.getElementById('appointment-form').reset();
            }
        }

        fetchPatients(); // Refresh the list
    } catch (err) {
        console.error('Error saving patient:', err);
        alert('Failed to save appointment.');
    }
});

// 3. Delete Patient
async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        try {
            await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
            fetchPatients();
        } catch (err) {
            console.error('Error deleting patient:', err);
        }
    }
}

// 4. Start Edit Mode (Called when "Edit" button is clicked)
function startEdit(id, name, email, phone, date) {
    isEditing = true;
    editingId = id;

    // Fill the form with existing data
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
    document.getElementById('date').value = date;

    // Change Button Text to show we are updating
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.innerText = "Update Appointment";
    submitBtn.style.backgroundColor = "#ffa500"; // Optional: Change color to Orange
}

// 5. Reset Form (Switch back to Normal Mode)
function resetForm() {
    isEditing = false;
    editingId = null;
    document.getElementById('appointment-form').reset();

    // Reset Button Text
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.innerText = "Book Appointment";
    submitBtn.style.backgroundColor = ""; // Reset color
}

// Initial load
fetchPatients();