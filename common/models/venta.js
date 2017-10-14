'use strict';

module.exports = function(Venta) {
	Venta.VendidoporMes = function(cb){
		Venta.getDataSource().connector.connect((err, db) => {
			let ventaCollection = db.collection('Venta');
			ventaCollection.aggregate([
				{ $project: { 
		  		fecha_venta: 1,
	        month: { $month: "$fecha_venta" },
	        year: { $year: "$fecha_venta" }
	    	}},
	    	{ $group: {
		      _id: { year: "$year", month: "$month" },
		    	vendido: { $sum: 1 },
		    	fecha: { $first: "$fecha_venta"}
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
	Venta.remoteMethod('VendidoporMes', {
    //accepts: {arg: 'filter', type: 'object', description: '{"where:{...}, "groupBy": "field"}'},
    returns: {arg:'data', type:['object'], root:true}
  });

  Venta.VentaxAsesor = function(datos, cb){
		Venta.getDataSource().connector.connect((err, db) => {
			let ventaCollection = db.collection('Venta');
			let d
			if( datos.fecha ) {
		  	d = new Date(datos.fecha+'-15');
		  } else {
		  	d = new Date();
		  }
		  let mes = d.getMonth() +1
			let y = d.getFullYear()
			ventaCollection.aggregate([
			{ $project: { 
	  		dni: 1,
	  		sim_chip: 1,
	  		sim_equipo: 1,
	  		plan: 1,
	  		equipo: 1,
	  		ref: 1,
	  		operador: 1,
	  		tipo_plan: 1,
	  		num_porta: 1,
	  		usuarioId: 1,
        month: { $month: "$fecha_venta" },
        year: { $year: "$fecha_venta" }
    	}},
    	{ $match : { year : y, month: mes} }
			], (err, data)=>{
				if (err) cb(err);
		    cb(null, data);
			})
		})
	}
	Venta.remoteMethod('VentaxAsesor', {
    accepts: {arg: 'datos', type: 'object'},
    returns: {arg:'data', type:['object'], root:true}
  });
};
