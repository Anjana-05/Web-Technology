const mongoose = require('mongoose');
const dbUrl = "mongodb://localhost:27017";
const data = new mongoose.Schema({
    username: String,
    password: String
});
const user = mongoose.model('User', data);

async function connectDB() {
    try {
        await mongoose.connect(dbUrl, 
            { family: 4 }
        );
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("DB Connection Error:", err);
        process.exit(1); 
    }
}
connectDB();