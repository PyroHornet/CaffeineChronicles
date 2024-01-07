document.addEventListener('DOMContentLoaded', () => {
    // Code to run after the document is fully loaded

    const newsletterForm = document.querySelector('#sidebar .quote form');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the form from submitting in the traditional way

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Simple validation
        if (validateEmail(email)) {
            // Add logic to handle the newsletter subscription
            console.log('Subscribed with:', email);
            // You might want to send this data to your server
        } else {
            alert('Please enter a valid email address.');
        }
    });
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}