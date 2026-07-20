import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true, index: true },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' },
    referer: { type: String, default: 'Direct' },
    ipHash: { type: String, default: null },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

analyticsSchema.index({ linkId: 1, timestamp: -1 });

export default mongoose.model('Analytics', analyticsSchema);
