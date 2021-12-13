const mongoose =require('mongoose')
var Schema = mongoose.Schema;



const uri= 'mongodb+srv://user:dbUser@cluster0.um1b0.mongodb.net/cms?retryWrites=true&w=majority'
mongoose.connect(uri,
    {
      useNewUrlParser: true,
        useUnifiedTopology: true,
      
        
      }).then(()=> console.log('db is connected')).catch((err)=> console.error('Error'))
  

  
exports.mongoose = mongoose;
exports.Schema = Schema;

