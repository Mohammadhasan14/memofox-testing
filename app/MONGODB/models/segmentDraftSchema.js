import mongoose from "mongoose";

const segmentDraftSchema = mongoose.Schema({
    storeURL: String,
    segmentDraft: Object,
    createdAt: Date
})

const segmentDraftModel = mongoose.models.segmentDraftModel || mongoose.model("segmentDraftModel", segmentDraftSchema);

export default segmentDraftModel;




