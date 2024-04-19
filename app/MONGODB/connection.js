
import mongoose from "mongoose"
const mongoConnect = () => {

    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin-hasan:JQaRPzWZonnvbeI7@cluster0.xx0xp4y.mongodb.net";
    console.log('MONGODB_URI.......................',MONGODB_URI);
    mongoose.connect(`${MONGODB_URI}/memofox-app`)
        .then(() => { console.log("mongoDB connection successful...") })
        .catch((error) => { console.log(error) })
}

export default mongoConnect
