document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('job-application-form');
    const feedbackElement = document.querySelector('.form-feedback');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        feedbackElement.innerHTML = '';

        // Perform client-side form validation here if needed

        try {
            const formData = new FormData(form);
            const response = await axios.post('http://localhost:3000/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                feedbackElement.textContent = 'Application submitted successfully!';
                form.reset();
            } else {
                throw new Error('Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            feedbackElement.textContent = `There was an error submitting the application. Please try again later. Error: ${error.message}`;
        }
    });
});
