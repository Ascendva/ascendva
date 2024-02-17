const express = require('express');
// const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Define CORS options
const corsOptions = {
    origin: 'http://localhost:YOUR_FRONTEND_PORT', // Replace with your frontend's actual port
    methods: 'POST',
    optionsSuccessStatus: 204,
    credentials: true,
};

// Use CORS middleware with the defined options
// app.use(cors(corsOptions));

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '/uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Email Configuration
const emailConfig = {
    email: 'petegambo@gmail.com',
    receiverEmail: 'cruzdee1704@gmail.com',
    password: 'cbclrtyuoqymplmd', // 
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587, 
    service: 'gmail',
    secure: false
  };

  // Nodemailer configuration
  const transporter = nodemailer.createTransport({
    service: emailConfig.service,
    secure: emailConfig.secure,
    host: emailConfig.smtpServer,
    port: emailConfig.smtpPort,
    auth: {
      user: emailConfig.email,
      pass: emailConfig.password,
    },
  });


app.use(express.static('public'));

app.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, position, experience, citizen, resident, location } = req.body;

        console.log(req.file);

        const mailOptions = {
            from: emailConfig.email,
            to: emailConfig.receiverEmail,
            subject: 'New Job Application Form Submission',
            html: `Received a new job application from ${name}. Details are: 
                <br> Name: ${name}
                <br> Email: ${email}
                <br> Phone: ${phone}
                <br> Position: ${position}
                <br> Experience: ${experience}
                <br> Citizen: ${citizen}
                <br> Resident: ${resident}
                <br> Location: ${location}`,
            attachments: [
                {
                    filename: req.file.originalname,
                    path: req.file.path
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        res.send('Application submitted successfully');
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
