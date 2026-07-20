import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const linkSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true, trim: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    title: { type: String, trim: true, maxlength: 140, default: '' },
    password: { type: String, default: null, select: false },
    utm: {
      source: { type: String, default: '' },
      medium: { type: String, default: '' },
      campaign: { type: String, default: '' },
    },
    clicks: { type: Number, default: 0 },
    lastClickedAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
    favorite: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    qrImage: { type: String, default: null }, // cached base64 data URI
  },
  { timestamps: true }
);

// TTL index: MongoDB automatically deletes expired links — zero cron jobs needed,
// which keeps this fully compatible with Render's free web-service tier.
linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
linkSchema.index({ owner: 1, createdAt: -1 });
linkSchema.index({ originalUrl: 'text', title: 'text' });

linkSchema.pre('save', async function hashLinkPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

linkSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(true);
  return bcrypt.compare(candidate, this.password);
};

linkSchema.methods.toPublicObject = function toPublicObject() {
  return {
    id: this._id,
    originalUrl: this.originalUrl,
    shortCode: this.shortCode,
    title: this.title,
    clicks: this.clicks,
    active: this.active,
    favorite: this.favorite,
    archived: this.archived,
    hasPassword: Boolean(this.password),
    expiresAt: this.expiresAt,
    lastClickedAt: this.lastClickedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model('Link', linkSchema);
