"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
require("./db/mongoose");
const user_1 = __importDefault(require("./models/user"));
const task_1 = __importDefault(require("./models/task"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// parses incoming requests with JSON payloads
app.use(express_1.default.json());
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.default(req.body);
        const result = yield user.save();
        res.status(201).send(result);
    }
    catch (error) {
        // 400 is a bad request
        res.status(400).send(error);
    }
}));
app.get('/usersss', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        res.send(users);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const user = yield user_1.default.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.patch('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!', invalidFields });
        }
        const user = yield user_1.default.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const deletedUser = yield user_1.default.findByIdAndDelete(_id);
        if (!deletedUser) {
            return res.status(404).send();
        }
        res.send(deletedUser);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.post('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_1.default(req.body);
        const result = yield task.save();
        res.status(201).send(result);
    }
    catch (error) {
        // 400 is a bad request
        res.status(400).send(error);
    }
}));
app.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.default.find({});
        res.send(tasks);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.get('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const task = yield task_1.default.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.patch('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!', invalidFields });
        }
        const updatedTask = yield task_1.default.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!updatedTask) {
            return res.status(404).send();
        }
        res.send(updatedTask);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.delete('/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const deletedTask = yield task_1.default.findByIdAndDelete(_id);
        if (!deletedTask) {
            return res.status(404).send();
        }
        res.send(deletedTask);
    }
    catch (error) {
        res.status(500).send();
    }
}));
app.listen(port, () => console.log(`Server is up on port ${port}!`));
