const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workExperienceSchema = new Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, required: true }
});

const educationSchema = new Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true }
});

const certificationSchema = new Schema({
    name: { type: String, required: true },
    institution: { type: String, required: true },
    date: { type: Date, required: true }
});

const profileSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true // Un usuario solo puede tener un perfil
    },
    bio: { type: String, required: true },
    skills: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    workExperience: [workExperienceSchema],
    education: [educationSchema],
    certifications: [certificationSchema],
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
