/**
 *
 *
 * @package
 * @licence MIT
 * @author Thomas Dupont
 */

/*
• Titre • Description • Image • PP créateur • @ créateur • Tags
• Colors x4 • Post Link
*/
const mongoose = require('mongoose');

const schema = mongoose.Schema({
	title: String,
	description: String,
	screenPath: [String],
	profilPictureCreator: String,
	creatorName: String,
	tags: [String],
	colors: [String],
	postLink: String,
	createdAt: Date,
});

module.exports = mongoose.model('UiDesign', schema, 'ui_design');
