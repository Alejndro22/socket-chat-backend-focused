import mongoose from 'mongoose';

const dbConnection = () => {
  try {
    mongoose.set('strictQuery', false);

    mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB is online!');
  } catch (error) {
    console.log(error);
    throw new Error('Error found when initializing DB');
  }
};

export { dbConnection };
