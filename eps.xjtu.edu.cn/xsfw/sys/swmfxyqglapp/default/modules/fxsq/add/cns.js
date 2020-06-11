define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/add/cns.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	settingInfo:{},
                	checkDisable:true,//选择框
                	checkValue:false//选择框值
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
            		//查询提示信息
            		MOB_UTIL.doPost({ url: api.hasReadCommit, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.$router.go(-1);
            				//self.$router.push({ name: 'addFxsq', query: {type:1}});
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	}
            	
            }
        };
        return page;
    };

});