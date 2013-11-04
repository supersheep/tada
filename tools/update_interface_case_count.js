var InterfaceModel = require("../model/interface");


InterfaceModel.getAll(function(err,rows){
	rows.forEach(function(row){
		InterfaceModel.getCases(row.id,function(err,cases){
			InterfaceModel.update({
				id:row.id,
				case_count:cases.length
			})
		});
	})
});