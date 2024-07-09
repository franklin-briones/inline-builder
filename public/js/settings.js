import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    productId: { type: String },
    priceId: { type: String },
    priceDescription: { type: String },
    basePrice: { type: String },
    basePriceName: { type: String },
    interval: { type: String },
    frequency: { type: String },
    logo: { type: String },
    primaryColour: { type: String },
    secondaryColour: { type: String },
    preCheckoutUrl: { type: String }
})

const Settings = new mongoose.model('Settings', settingsSchema)
export default settings