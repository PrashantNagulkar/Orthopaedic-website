const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'prashantnagulkar5@gmail.com',
        pass: 'kxxx xxxx xxxx xxxx' // Replace with your Gmail App Password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test email connection
transporter.verify(function (error, success) {
    if (error) {
        console.log('Server error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Appointment booking endpoint
app.post('/api/book-appointment', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            age,
            gender,
            appointmentDate,
            appointmentTime,
            reason,
            previousHistory
        } = req.body;

        console.log('Received appointment request:', { fullName, email, phone });

        // Format the date
        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format the time
        const formattedTime = new Date(`2000-01-01T${appointmentTime}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Email to clinic
        const mailOptions = {
            from: '"Appointment System" <prashantnagulkar5@gmail.com>',
            to: 'prashantnagulkar5@gmail.com',
            subject: 'New Patient Appointment Booking',
            html: `
                <h2>New Patient Appointment Request</h2>
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h3>Patient Information:</h3>
                    <p><strong>Full Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Age:</strong> ${age}</p>
                    <p><strong>Gender:</strong> ${gender}</p>
                    
                    <h3>Appointment Details:</h3>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <p><strong>Reason for Appointment:</strong> ${reason}</p>
                    
                    <h3>Medical History:</h3>
                    <p>${previousHistory || 'No previous medical history provided'}</p>
                </div>
            `
        };

        console.log('Attempting to send email to clinic...');
        
        // Send email to clinic
        await transporter.sendMail(mailOptions);
        
        console.log('Email sent to clinic successfully');

        // Send confirmation to patient
        const patientConfirmation = {
            from: '"Orthopaedic Clinic" <prashantnagulkar5@gmail.com>',
            to: email,
            subject: 'Appointment Confirmation - Orthopaedic Clinic',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2>Appointment Confirmation</h2>
                    <p>Dear ${fullName},</p>
                    <p>Thank you for booking an appointment with our Orthopaedic Clinic.</p>
                    <p>Your appointment details:</p>
                    <ul>
                        <li>Date: ${formattedDate}</li>
                        <li>Time: ${formattedTime}</li>
                    </ul>
                    <p>We will contact you shortly to confirm your appointment.</p>
                    <p>If you need to reschedule or cancel your appointment, please contact us.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Orthopaedic Clinic Team</p>
                </div>
            `
        };

        await transporter.sendMail(patientConfirmation);
        
        console.log('Confirmation email sent to patient');
        
        res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
            message: 'Failed to book appointment',
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 