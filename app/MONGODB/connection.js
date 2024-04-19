
import mongoose from "mongoose"
const mongoConnect = () => {

    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://info:RRhxjoutw1gzehLt@cluster0.jopyw9d.mongodb.net";
    console.log('MONGODB_URI.......................',MONGODB_URI);
    mongoose.connect(`${MONGODB_URI}/memofox-app`)
        .then(() => { console.log("mongoDB connection successful...") })
        .catch((error) => { console.log(error) })
}

export default mongoConnect
