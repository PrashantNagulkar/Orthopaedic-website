document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const modal = document.getElementById('appointmentModal');
    const successModal = document.getElementById('successModal');
    const bookBtn = document.querySelector('.appointment-btn');
    const closeBtns = document.querySelectorAll('.close');
    const form = document.getElementById('appointmentForm');
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Open appointment modal
    bookBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            successModal.style.display = 'none';
            navLinks.classList.remove('active');
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Form validation and submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            reason: document.getElementById('reason').value,
            previousHistory: document.getElementById('previousHistory').value
        };

        try {
            const response = await fetch('/api/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                modal.style.display = 'none';
                successModal.style.display = 'block';
                form.reset();
            } else {
                throw new Error('Failed to book appointment');
            }
        } catch (error) {
            alert('There was an error booking your appointment. Please try again.');
            console.error('Error:', error);
        }
    });

    // Set minimum date for appointment
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Time input validation
    const timeInput = document.getElementById('appointmentTime');
    timeInput.addEventListener('change', (e) => {
        const time = e.target.value;
        const hour = parseInt(time.split(':')[0]);
        
        if (hour < 9 || hour >= 17) {
            alert('Please select a time between 9:00 AM and 5:00 PM');
            e.target.value = '';
        }
    });

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
}); 