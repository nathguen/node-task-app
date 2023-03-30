"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                if (!value.includes("@")) {
                    throw new Error("Email must contain @");
                }
                if (!(0, isEmail_1.default)(value)) {
                    throw new Error("Email is invalid");
                }
            },
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate: {
            validator: (value) => {
                if (value.toLowerCase().includes("password")) {
                    throw new Error("Password cannot contain 'password'");
                }
            },
        },
    },
    age: {
        type: Number,
        default: 0,
        validate: {
            validator: (value) => {
                if (value < 0) {
                    throw new Error("Age must be a positive number");
                }
            },
        },
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
