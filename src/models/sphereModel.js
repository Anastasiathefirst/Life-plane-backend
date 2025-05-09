import mongoose from 'mongoose';

const sphereSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  value: { type: Number, default: 5 },
  frequency: { type: String, default: 'раз в неделю' },
  criticality: { type: Number, default: 5 },
  lastUpdated: { type: Date, default: Date.now }
});

const Sphere = mongoose.model('Sphere', sphereSchema);

export default Sphere;
