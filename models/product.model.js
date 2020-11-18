const mongoose = require('mongoose');
 
//Attributes of the Product object
var productSchema = new mongoose.Schema({
userId: {
type: String,
required: 'This field is required!'
},
viewDate: {
type: Date
},
productId: {
type: String
}
});
 
mongoose.model('Product', productSchema);