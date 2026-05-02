const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
	{
		subscriptionId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		subscriptionDate: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: String,
			enum: ['active', 'cancelled'],
			default: 'active',
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
