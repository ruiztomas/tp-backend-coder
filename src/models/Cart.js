const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    products:[
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantify: {type: Number, required: true, default: 1}
        }
    ]
});

module.exports=mongoose.model('Cart', cartSchema);