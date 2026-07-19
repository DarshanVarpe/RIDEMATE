const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const rideModel = require('../models/ride.models');
const userModel = require('../models/user.models');
const rideController = require('../controllers/ride.controller');
const socket = require('../socket');

jest.mock('../socket', () => ({
    getIoInstance: jest.fn(() => ({
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
    }))
}));

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

describe('Ride Concurrency Tests', () => {
    it('should prevent multiple users from joining the same seat concurrently', async () => {
        // Create mock users
        const driver = await userModel.create({
            firstName: 'Driver',
            lastName: 'One',
            email: 'driver@ridemate.com',
            password: 'password123',
            cnic: '12345-1234567-1'
        });

        const passenger1 = await userModel.create({
            firstName: 'Passenger',
            lastName: 'One',
            email: 'p1@ridemate.com',
            password: 'password123',
            cnic: '12345-1234567-2'
        });

        const passenger2 = await userModel.create({
            firstName: 'Passenger',
            lastName: 'Two',
            email: 'p2@ridemate.com',
            password: 'password123',
            cnic: '12345-1234567-3'
        });

        // Create a ride with 1 available seat
        const ride = await rideModel.create({
            driver: driver._id,
            from: 'Location A',
            to: 'Location B',
            datetime: new Date(),
            seats: 4,
            availableSeats: 1,
            vehicleDetails: new mongoose.Types.ObjectId(),
            fare: 100
        });

        // Mock req and res for passenger 1
        const req1 = {
            body: { rideId: ride._id },
            user: { id: passenger1._id }
        };
        const res1 = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock req and res for passenger 2
        const req2 = {
            body: { rideId: ride._id },
            user: { id: passenger2._id }
        };
        const res2 = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Concurrently attempt to join the ride
        await Promise.all([
            rideController.joinRide(req1, res1, jest.fn()),
            rideController.joinRide(req2, res2, jest.fn())
        ]);

        // Check the final state of the ride
        const updatedRide = await rideModel.findById(ride._id);
        
        // Assertions
        expect(updatedRide.availableSeats).toBe(0);
        expect(updatedRide.passengers.length).toBe(1);

        // One request should succeed, the other should fail with 400 'Failed to join ride. Please try again.'
        // or 'No seats available' depending on execution order
        const successCount = (res1.status.mock.calls.some(call => call[0] === 200) ? 1 : 0) + 
                             (res2.status.mock.calls.some(call => call[0] === 200) ? 1 : 0);
        
        expect(successCount).toBe(1);
    });
});
