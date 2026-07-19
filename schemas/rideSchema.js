const { z } = require("zod");
const mongoose = require("mongoose");



const createRideSchema = z.object({
    from: z.string().trim().min(2, "Starting point must be at least 2 characters").max(150, "Starting point cannot exceed 150 characters"),

    to: z.string().trim().min(2, "Destination must be at least 2 characters").max(150, "Destination cannot exceed 150 characters"),

    datetime: z.string()
        .refine((val) => {
            const date = new Date(val);
            if (isNaN(date)) return false;
            const now = new Date();
            const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            return date > now && date <= thirtyDaysFromNow;
        }, { message: "The selected time must be in the future, but no more than 30 days ahead" }),

    fare: z.number()
        .int("Fare must be an integer")
        .min(0, "Fare cannot be less than 0")
        .max(2000, "Fare cannot exceed 2000"),

    seats: z.number()
        .int("Seats must be an integer")
        .min(1, "Seats cannot be less than 1")
        .max(4, "Seats cannot exceed 4"),
        
    vehicleDetails: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Please provide valid vehicle Details",
    }),
}).refine((data) => data.from.toLowerCase() !== data.to.toLowerCase(), {
    message: "Pickup and destination cannot be the same",
    path: ["to"]
});

const rideIdSchema = z.object({
    rideId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Please provide valid rideId",
    }),
});

const removePassengerSchema = z.object({
    rideId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Please provide valid rideId",
    }),
    passengerId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Please provide valid passengerId",
    }),
});

module.exports = { createRideSchema, rideIdSchema, removePassengerSchema };