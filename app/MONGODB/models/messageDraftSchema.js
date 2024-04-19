import mongoose from "mongoose";

const messageDraftSchema = mongoose.Schema({
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

const messageDraftModel = mongoose.models.messageDraftModel || mongoose.model("messageDraftModel", messageDraftSchema);

export default messageDraftModel;




