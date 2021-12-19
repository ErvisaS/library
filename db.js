const mongoose =require('mongoose')




const uri= 'mongodb+srv://user:dbUser@cluster0.um1b0.mongodb.net/cms?retryWrites=true&w=majority'
mongoose.connect(uri,
    {
      useNewUrlParser: true,
        useUnifiedTopology: true,
      
        
      }).then(()=> console.log('db is connected')).catch()
  

  
exports.mongoose = mongoose;
