const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

var connection = "mongodb+srv://SE4200:SAdM2Dx5wRbXaf3f@cluster0.kelhcq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(connection);


// Define the schema for the data
const dreamSchema = new mongoose.Schema({
   userID: {
      type: String,
      required: true
   },
   destination: {
      type: String,
      required: true
   },
   completed: {
      type: Boolean,
      required: true
   },
   notes: {
      type: String,
      required: true
   },
   budget: {
      type: Number,
      required: true
   }
})

const tripSchema = new mongoose.Schema({
   userID: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   details: {
      type: String,
      required: true
   },
   startDate: {
      type: Date,
      required: true
   },
   endDate: {
      type: Date,
      required: true
   },
})

const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   encryptedPassword: {
      type: String,
      required: true
   }
})

userSchema.methods.setEncryptedPassword = function (password) {
   var promise = new Promise((resolve, reject) => {
      bcrypt.hash(password, 12).then((hash) => {
         this.encryptedPassword = hash;
         resolve();
      });
   });
   return promise;
}

userSchema.methods.verifyEncryptedPassword = function (password) {

   var promise = new Promise((resolve, reject) => {
      bcrypt.compare(password, this.encryptedPassword).then((result) => {
         resolve(result);
      });
   });
   return promise;
}


// Create the model for the data
const Dream = mongoose.model('Dream', dreamSchema)

const Trip = mongoose.model('Trip', tripSchema)

const User = mongoose.model('User', userSchema)

module.exports = {
   Dream: Dream,
   Trip: Trip,
   User: User
}