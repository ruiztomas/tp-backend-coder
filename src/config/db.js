const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB Atlas");
    }catch(error){
        console.error("Error al conectar a MongoDB Atlas:", error);
    }
};

module.exports=connectDB;