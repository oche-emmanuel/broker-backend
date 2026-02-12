const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Auth Routes
const { registerUser, loginUser } = require('../controllers/authController');
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// User Routes
const { getUserProfile, getReferrals, setWithdrawalPin } = require('../controllers/userController');
router.get('/user/profile', protect, getUserProfile);
router.get('/referrals', protect, getReferrals);
router.post('/user/set-pin', protect, setWithdrawalPin);

// Account & Transactions
const { createDeposit, createWithdrawal, getTransactions } = require('../controllers/accountController');
router.post('/deposit', protect, createDeposit);
router.post('/withdraw', protect, createWithdrawal);
router.get('/transactions', protect, getTransactions);

// Chat Routes
const { getChatHistory, getAdminConversations, getAdminUserChatHistory, createMessage } = require('../controllers/chatController');
router.get('/chat', protect, getChatHistory);
router.post('/chat', protect, createMessage);
router.get('/admin/chat/conversations', protect, admin, getAdminConversations);
router.get('/admin/chat/:userId', protect, admin, getAdminUserChatHistory);

// Admin Routes
const { getUsers, updateAccount, updateTransactionStatus, getUserTransactions } = require('../controllers/adminController');
router.get('/admin/users', protect, admin, getUsers);
router.put('/admin/update-account', protect, admin, updateAccount);
router.put('/admin/update-transaction', protect, admin, updateTransactionStatus);
router.get('/admin/transactions/:userId', protect, admin, getUserTransactions);

module.exports = router;
