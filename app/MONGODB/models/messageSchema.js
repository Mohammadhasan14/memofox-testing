import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    storeURL: String,
    selectedImage: String,
    campaignName: String,
    previewSubject: String,
    selectedTags: Array,
    previewText: String,
    ctaType: String,
    ctaLabel: String,
    externalURL: String,
    assignedSegments: Array,
    startDate: Date,
    startTime: String,
    startAMorPM: String,
    endDate: Date,
    endTime: String,
    endAMorPM: String,
    createdAt: Date
})

const messageModel = mongoose.models.messageModel || mongoose.model("messageModel", messageSchema);

export default messageModel;




