define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/view/viewcns.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	settingInfo:{},
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("承诺书");
                self.initPage();
            },
            methods: {
            	initPage:function(){
            		var self = this;
            		//查询提示信息
            		MOB_UTIL.doPost({ url: api.querySettingInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.settingInfo = result.data || {};
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	/**
            	 * 承诺书已读
            	 */
            	sureCns:function(){
            		var self = this;
            		self.$router.go(-1);
            		//self.$router.replace({ name: 'viewFxsq', query: {}});
            	}
            	
            }
        };
        return page;
    };

});