define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/add/jkda.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	jkdaList:[],//数据库居旅
                	noDays:0,//未填写天数
                	jkdays:0,
                	yqzpdataReady:false,
                	yqimglist:[],
                	yqzptoken:'',
                	model : this.getmodel(),
                	readonly : false,
                	formValue : {}
                };
            },
            watch : {
				$route : function(to, from) {
					var self = this;
					if (to.name == "jkda"){
						self.noDays = 0;
						self.jkdays = 0;
						self.refreshPage();
					}
				}
			},
            created: function() {
            	var self = this;
                SDK.setTitleText("健康档案单");
                self.initPage();
            },
            methods: {
            	getmodel:function(){
            		var model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjkdabdxx", "form");
            		if(sftoon){
						for(var index in model){
	            			if(model[index].name == "JKZM_EK"){
	            				model[index]["xtype"] = "text";
	            			}
	            		}
					}
            		return model;
            	},
            	initPage:function(){
            		var self = this;
            		//查询申请信息
            		MOB_UTIL.doPost({ url: api.queryJkdaInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.formValue = result.data.SQXX || {};
            				if(sftoon && self.formValue.JKZM_EK){
            					self.yqzptoken = self.formValue.JKZM_EK;
            					self.yqgetsqImageSrc(self.yqzptoken);
            				}
            				self.yqzpdataReady = true;
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
            	
            	refreshPage:function(){
            		var self = this;
            		//查询申请信息
            		MOB_UTIL.doPost({ url: api.queryJkdaInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
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
            	
            	//编辑每日情况
            	editDayJkda:function(rq){
            		var self = this;
            		if(self.formValue.JQJZBA || self.formValue.SFXXLFD){
            			MOB_UTIL.doPost({ url: api.saveHealthRecord, params: self.formValue }).done(function(result) {
                			if(result.code == '0'){
                				
    						}else{
    							mintUI.Toast({message: result.message});
    						}
    					});
            		}
            		self.formValue.JKZM_EK = self.formValue.JKZM_EK || "";
            		self.$router.push({ name: 'editMrqk', query: {RQ:rq,jkzm:self.formValue.JKZM_EK}});
            	},
            	
            	//获取图片列表
            	yqgetsqImageSrc : function(token) {
            		this.yqimglist = api.getXcjcImageArraySrc(token);
            	},
				
				//延期附件上传照片
            	yqonUploadImg:function(e){
            		var self = this;
					api.UploadImg(self.yqzptoken,"2",function(result){
						self.yqzptoken = result.data.tokenId;
						self.yqgetsqImageSrc(self.yqzptoken);
						Vue.set(self.formValue, 'JKZM_EK',self.yqzptoken);
					});
				},
				
				//延期附件删除照片
				yqdelUploadImg:function(tokenwid){
					var self = this;
					api.delUploadImg(tokenwid,function(){
						self.yqgetsqImageSrc(self.yqzptoken);
						if(self.yqimglist.length == 0){
	    					Vue.set(self.formValue, 'JKZM_EK',"");
						}
					});
				},
            	
            	/**
            	 * 保存
            	 */
            	sureJkda:function(){
            		var self = this;
            		if (!self.$refs.form.validate()) {
                        return false;
                    }
            		MOB_UTIL.doPost({ url: api.saveHealthRecord, params: self.formValue }).done(function(result) {
            			if(result.code == '0'){
            				self.$router.go(-1);
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