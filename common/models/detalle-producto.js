'use strict';

module.exports = function(Detalleproducto) {

	Detalleproducto.stock = function(cb){
		Detalleproducto.getDataSource().connector.connect((err, db) => {
			let detalleProductoCollection = db.collection('DetalleProducto');
			detalleProductoCollection.aggregate([
				{
					$match: { vendido: {$eq: false}}
				},
	    	{ $group: {
		      _id: { producto:'$productoId', usuario: '$usuarioId'},
		    	cantidad: { $sum: 1 },
		    	productos: { $push: '$_id' }
		    }},
		    {
		    	$lookup: {
	          from: "usuario",
	          localField: "_id.usuario",
	          foreignField: "_id",
	          as: "local"
	        }
		    },
		    { $unwind: '$local'},
		    { $project: { local: {password: 0} } }
			], (err, data) => {
		    cb(null, data);
			})
		})
	}

	Detalleproducto.remoteMethod('stock', {
    //accepts: {arg: 'filter', type: 'object', description: '{"where:{...}, "groupBy": "field"}'},
    returns: {arg:'data', type:['object'], root:true}
  });
};
