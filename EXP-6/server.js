const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Define Student Schema and Model
const studentSchema = new mongoose.Schema({
    roll_no: String,
    name: String,
    email: String,
    personal_mail: String,
    temporary_address: String,
    permanent_address: String,
    mobile_number: String,
    whatsapp_number: String,
    parent_name: String,
    parent_mobile: String,
    sslc_marks: Number,
    sslc_board: String,
    hsc_marks: Number,
    hsc_board: String,
    diploma_marks: Number,
    sem1_gpa: Number,
    sem1_cgpa: Number,
    sem2_gpa: Number,
    sem2_cgpa: Number,
    sem3_gpa: Number,
    sem3_cgpa: Number,
    standing_arrears: Number,
    history_arrears: Number,
    projects_done: Number,
    github_link: String,
    leetcode_id: String,
    leetcode_dashboard: String,
    leetcode_problems: Number,
    other_problems: Number,
    certificates_done: Number,
    internships_done: Number,
    languages_known: String
});

const Student = mongoose.model('Student', studentSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/insert', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/submit', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json({ message: 'Student information saved successfully!' });
    } catch (err) {
        console.log('Error saving student:', err);
        res.status(500).json({ message: 'Error saving student information' });
    }
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ roll_no: 1 });
        res.json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

app.get('/api/students/:roll_no', async (req, res) => {
    try {
        const student = await Student.findOne({ roll_no: req.params.roll_no });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

app.put('/api/students/:roll_no', async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { roll_no: req.params.roll_no },
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ error: 'Failed to update student' });
    }
});

// Delete student
app.delete('/api/students/:roll_no', async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ roll_no: req.params.roll_no });
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// Add this route for the update page
app.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update.html'));
});

// Start server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});