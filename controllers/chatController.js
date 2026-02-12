const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat history for logged in user
// @route   GET /api/chat
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.user._id }).sort({ time: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all conversations (unique users who messaged)
// @route   GET /api/admin/chat/conversations
// @access  Private/Admin
const getAdminConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            {
                $group: {
                    _id: '$userId',
                    lastMessage: { $last: '$text' },
                    lastTime: { $last: '$time' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    lastTime: 1,
                    'user.name': 1,
                    'user.email': 1
                }
            },
            { $sort: { lastTime: -1 } }
        ]);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get chat history for a specific user (for admin)
// @route   GET /api/admin/chat/:userId
// @access  Private/Admin
const getAdminUserChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.params.userId }).sort({ time: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new message (for users)
// @route   POST /api/chat
// @access  Private
const createMessage = async (req, res) => {
    const { text } = req.body;
    try {
        const message = await Message.create({
            userId: req.user._id,
            text,
            sender: 'user'
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatHistory,
    getAdminConversations,
    getAdminUserChatHistory,
    createMessage
};
