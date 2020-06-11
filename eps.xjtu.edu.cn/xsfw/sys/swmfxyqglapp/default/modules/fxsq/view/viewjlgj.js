define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/view/viewjlgj.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	travelList:[],//数据库居旅
                	jlTemList:[],//页面展示
                	model : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjlxxbd", "form"),
                	jlValue: {},
                	customVm:{},
                	readonly:true
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("假期居旅轨迹单");
                self.initPage();
            },
            methods: {
            	initPage:function(){
            		var self = this;
            		//查询居旅信息
            		MOB_UTIL.doPost({ url: api.queryTravel, params: {TYPE:"view"} }).done(function(result) {
            			if(result.code == '0'){
            				self.travelList = result.data.JLXX || [];
            				if(self.travelList.length >= 3){
            					self.jlTemList = [self.travelList[0],self.travelList[1],self.travelList[2]];
            				}
            				
            				self.jlValue = result.data.SQXX || {};
            				
            				self.setingInfo = result.data.SET || {};
            				
            				self.$refs.form.showItem(['JLZM_EK']);
            				
            				Vue.set(self.jlValue,"SFLKSJSQ",result.data.DD);
            				Vue.set(self.jlValue,"SFWCFY",result.data.QTXHD);
            				Vue.set(self.jlValue,"JQJL",result.data.QGYQ);
            				Vue.set(self.jlValue,"JLZM_EK",result.data.SQXX.JLZM_EK);
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	openJljl:function(){
            		var self = this;
            		self.jlTemList = self.travelList;
            	},
            	
            	closeJljl:function(){
            		var self = this;
            		self.jlTemList = [self.travelList[0],self.travelList[1],self.travelList[2]];
            	},
            	
            	/**
            	 * 保存居旅其他信息
            	 */
            	sureJlinfo:function(){
            		var self = this;
            		self.$router.go(-1);
            	}
            	
            }
        };
        return page;
    };

});