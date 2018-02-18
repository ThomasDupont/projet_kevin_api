/**
 *
 *
 * @package
 * @licence MIT
 * @author Thomas Dupont
 */

const mongoose = require('mongoose');

const schema = mongoose.Schema({
	uuid4: String,
	stripeCuId: String,
	status: { type: String, enum: ['pending_payment', 'active', 'terminated', 'unactive'] }, // TODO: Be careful, you also use 'pending-payment'.
	createdAt: Date,
	firstName: String,
	lastName: String,
	birthDate: Number,
	email: String,
	password: String,
	alias: String,
	phone: String,
	market: String,
	billingAddress: {
		streetAddress: String,
		addressComplement: String,
		firstName: String,
		lastName: String,
		city: String,
		zipCode: Number,
		country: String,
	},
	role: [String],
	badges: [String],
	subscriptions: [
		{
			$ref: String,
			$db: String,
			oid: mongoose.Schema.Types.ObjectId,
		},
	],
});

module.exports = mongoose.model('User', schema, 'user');
