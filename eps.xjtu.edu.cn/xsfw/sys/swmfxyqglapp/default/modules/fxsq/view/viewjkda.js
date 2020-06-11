define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/view/viewjkda.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	jkdaList:[],//数据库居旅
                	noDays:0,//未填写天数
                	jkdays:0,
                	model : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjkdabdxx", "form"),
                	readonly : true,
                	formValue : {}
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("健康档案单");
                self.initPage();
            },
            methods: {
            	initPage:function(){
            		var self = this;
            		//查询申请信息
            		MOB_UTIL.doPost({ url: api.queryJkdaInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.formValue = result.data.SQXX || {};
            				self.jkdaList = result.data.JKDA || [];
            				self.noDays = 0;
            				$.each(self.jkdaList,function(index,item){
            					if(!item.TBSJ){
            						self.noDays++;
            					}
            					//05.02健康档案单去除中间3个异常判断
            					if(item.SFFRHKS == '1' || /*item.SFQGJCHB == '1' || item.SFQZHYS == '1'
            						|| item.SFJCQZ == '1'||*/ item.SFBGL == '1' || Number(item.TW) >= 37.3){
            						item.SFJK = '0';
            					}else{
            						item.SFJK = '1';
            						self.jkdays++;
            					}
            				});
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	//每日情况
            	editDayJkda:function(rq){
            		var self = this;
            		self.$router.push({ name: 'vieweditMrqk', query: {RQ:rq}});
            	},
            	
            	/**
            	 * 保存居旅其他信息
            	 */
            	sureJkda:function(){
            		var self = this;
            		self.$router.go(-1);
            		//self.$router.replace({ name: 'viewFxsq', query: {}});
            	}
            	
            }
        };
        return page;
    };

});