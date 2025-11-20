const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN;

console.log('🔍 Environment Check - MONGO_CONN exists:', !!mongo_url);
console.log('🔍 Environment Check - JWT_SECRET exists:', !!process.env.JWT_SECRET);

if (!mongo_url) {
    console.error('🚨 CRITICAL ERROR: MONGO_CONN environment variable is not set');
}

mongoose.connect(mongo_url)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
    }).catch((err) => {
        console.error('❌ MongoDB Connection Failed:', err.message);
    })

//anirudhjindal09_db_user
// qV9S8D4AItdzpgp0