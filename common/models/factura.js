'use strict';

module.exports = function(Factura) {
	Factura.VendidoporMes = function(cb){
		Factura.getDataSource().connector.connect((err, db) => {
			let facturaCollection = db.collection('Factura');
			facturaCollection.aggregate([
				{ $project: { 
		  		total: 1,
		  		fecha: 1,
	        month: { $month: "$fecha" },
	        year: { $year: "$fecha" }
	    	}},
	    	{ $group: {
		      _id: { year: "$year", month: "$month" },
		    	vendido: { $sum: "$total" },
		    	fecha: { $first: "$fecha"}
		    }}
			], (err, data)=>{
				if (err) cb(err);
				let meses = [];
		    let cantidad = [];
		    data.sort(function(a, b){
			    var keyA = new Date(a.fecha),
			        keyB = new Date(b.fecha);
			    // Compare the 2 dates
			    if(keyA < keyB) return -1;
			    if(keyA > keyB) return 1;
			    return 0;
				});
		    data.forEach(venta => {
					if(venta._id.month == 1) meses.push('Enero')
					else if(venta._id.month == 2) meses.push('Febrero')
					else if(venta._id.month == 3) meses.push('Marzo')
					else if(venta._id.month == 4) meses.push('Abril')
					else if(venta._id.month == 5) meses.push('Mayo')
					else if(venta._id.month == 6) meses.push('Junio')
					else if(venta._id.month == 7) meses.push('Julio')
					else if(venta._id.month == 8) meses.push('Agosto')
					else if(venta._id.month == 9) meses.push('Septiembre')
					else if(venta._id.month == 10) meses.push('Octubre')
					else if(venta._id.month == 11) meses.push('Noviembre')
					else if(venta._id.month == 12) meses.push('Diciembre')
					cantidad.push(venta.vendido)	
				})
				let newData = {};
				newData.meses = meses;
				newData.cantidad = cantidad;
		    cb(null, newData);
			})
		})
	}
	Factura.remoteMethod('VendidoporMes', {
    //accepts: {arg: 'filter', type: 'object', description: '{"where:{...}, "groupBy": "field"}'},
    returns: {arg:'data', type:['object'], root:true}
  });

  Factura.VendidoporLocal = function(local,cb){
		Factura.getDataSource().connector.connect((err, db) => {
			let facturaCollection = db.collection('Factura');
			facturaCollection.aggregate([
				{ $project: {
					usuarioId: 1, 
		  		total: 1,
		  		fecha: 1,
	        month: { $month: "$fecha" },
	        year: { $year: "$fecha" }
	    	}},
	    	{ $group: {
		      _id: { year: "$year", month: "$month", local: "$usuarioId" },
		    	vendido: { $sum: "$total" },
		    	fecha: { $first: "$fecha"}
		    }}
			], (err, data)=>{
				if (err) cb(err);
				data = data.filter(o => o._id.local == local)
				let meses = [];
		    let cantidad = [];
		    data.sort(function(a, b){
			    var keyA = new Date(a.fecha),
			        keyB = new Date(b.fecha);
			    // Compare the 2 dates
			    if(keyA < keyB) return -1;
			    if(keyA > keyB) return 1;
			    return 0;
				});
		    data.forEach(venta => {
					if(venta._id.month == 1) meses.push('Enero')
					else if(venta._id.month == 2) meses.push('Febrero')
					else if(venta._id.month == 3) meses.push('Marzo')
					else if(venta._id.month == 4) meses.push('Abril')
					else if(venta._id.month == 5) meses.push('Mayo')
					else if(venta._id.month == 6) meses.push('Junio')
					else if(venta._id.month == 7) meses.push('Julio')
					else if(venta._id.month == 8) meses.push('Agosto')
					else if(venta._id.month == 9) meses.push('Septiembre')
					else if(venta._id.month == 10) meses.push('Octubre')
					else if(venta._id.month == 11) meses.push('Noviembre')
					else if(venta._id.month == 12) meses.push('Diciembre')
					cantidad.push(venta.vendido)	
				})
				let newData = {};
				newData.meses = meses;
				newData.cantidad = cantidad;
		    cb(null, newData);
			})
		})
	}
	Factura.remoteMethod('VendidoporLocal', {
    accepts: {arg: 'local', type: 'string'},
    returns: {arg:'data', type:['object'], root:true}
  });
};
