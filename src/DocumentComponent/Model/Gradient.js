/**
 *
 *
 * @package
 * @licence MIT
 * @author Thomas Dupont
 */

/*
• Nom • #Hex x2
*/
const mongoose = require('mongoose');

const schema = mongoose.Schema({
	name: String,
	hexa: String,
	createdAt: Date,
});

module.exports = mongoose.model('Gradient', schema, 'gradient');
