const mongoose  = require("mongoose");

const connectDb = async()=>{
    try {
         const conection = await mongoose.connect(process.env.MONGO_URI)

    
    console.log(`mongodb successfully connected :`)
    }
    catch(error) {
        console.error("mongoDB connection failed :",error.message);
        process.exit(1);
        
    }
 
  
   
}
 
 module.exports = connectDb;