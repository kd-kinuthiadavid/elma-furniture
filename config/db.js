const mongoose = require("mongoose");

const mongoURI = process.env.MONGOURI;

// db connection
const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDb Connected, host: ${connection.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
    // @todo - I know there's a better way to exit, so I'll check it out
    process.exit(1);
  }
};

module.exports = dbConnection;
