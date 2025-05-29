const connectDB = require('./db/connect');
const data = require('./mock-data.json');
const Job = require('./models/Job');
require('dotenv').config();

//disable required for jobLocation in jobs model and enable it again after populating
const populate = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Job.create(data);
        console.log('DONE! added all data to the DB');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

//careful as it will remove all jobs in DB
const depopulate = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Job.deleteMany();
        console.log('DONE! deleted all data in the DB');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

populate();
// depopulate();
