var ModelBase = require("./modelbase");

module.exports = new ModelBase({
	table:"Page",
	getAllUnion:function(cb){
		this.db.query(" select Page.*,Biz.id as biz,App.name as app_name,Biz.name as biz_name from Page,App,Biz where Page.app = App.id and App.bizid = Biz.id ",cb);
	}
});
