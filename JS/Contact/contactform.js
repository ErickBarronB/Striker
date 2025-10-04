// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    
    // Initialize sounds for the submit button
    const hoverSound = new Audio("src/Audio/ButtonHover.mp3");
    const clickSound = new Audio("src/Audio/ButtonClick.mp3");
    
    // Add sound effects to submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log("Button hover sound error:", e));
        });
        
        submitButton.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log("Button click sound error:", e));
        });
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Validate form data
            if (!data.name || !data.email || !data.subject || !data.message) {
                throw new Error('Please fill in all fields');
            }
            
            // Send email
            await sendEmail(data);
            
            // Show success message
            showMessage('✅ Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Error sending email:', error);
            
            // Show specific error messages
            if (error.message === 'Please fill in all fields') {
                showMessage('❌ Please fill in all required fields.', 'error');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                showMessage('❌ Network error. Please check your connection and try again.', 'error');
            } else {
                showMessage('❌ Sorry, there was an error sending your message. Please try again.', 'error');
            }
        } finally {
            // Reset button state
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }
    });
    
    function showMessage(text, type) {
        messageDiv.innerHTML = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        messageDiv.style.opacity = '1';
        
        // Add animation effect
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
        
        // Hide message after 5 seconds with fade effect
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 300);
        }, 5000);
    }
    
    async function sendEmail(data) {
        // Using EmailJS to send emails to erikbarron41@gmail.com
        // You'll need to set up EmailJS account and get your service ID, template ID, and public key
        
        // For now, let's simulate the email sending process
        // In a real implementation, you would use EmailJS or another email service
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demonstration purposes, we'll always return success
        // In production, replace this with actual email service
        console.log('Email data:', {
            to: 'erikbarron41@gmail.com',
            from: data.email,
            name: data.name,
            subject: data.subject,
            message: data.message
        });
        
        // Simulate success response
        return { ok: true };
        
        /* 
        // Real EmailJS implementation would look like this:
        const serviceId = 'your_service_id';
        const templateId = 'your_template_id';
        const publicKey = 'your_public_key';
        
        const templateParams = {
            to_email: 'erikbarron41@gmail.com',
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message
        };
        
        return await emailjs.send(serviceId, templateId, templateParams, publicKey);
        */
    }
});
