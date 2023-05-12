import { connect } from 'mongoose'

try {
    connect(process.env.MONGODB_URL);
    console.log('Connected to the database');
} catch (error) {
    console.log('Something went wrong when conecting to the database');
}
