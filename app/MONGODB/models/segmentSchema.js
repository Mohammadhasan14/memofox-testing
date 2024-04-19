import mongoose from "mongoose";

const segmentSchema = mongoose.Schema({
    id: String,
    name: String,
    query: String,
    storeURL: String,
    createdAt: Date

})

const segmentModel = mongoose.models.segmentModel || mongoose.model("segmentModel", segmentSchema);

export default segmentModel;




