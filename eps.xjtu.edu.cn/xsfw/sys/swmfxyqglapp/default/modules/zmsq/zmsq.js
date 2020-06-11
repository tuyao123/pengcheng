define(function(require, exports, module) {
    var tpl = require('text!modules/zmsq/zmsq.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	settingInfo:{XSZPURL:{}},//设置信息，包括申请信息等
                	showPage:'',//0:不可申请 1：可申请填写 
                	model:this.getmodel(),
                	formValue:{},
                	customVm: {},
                	readonly:true,
					// 分页页数
					pageNumber : 1,
					// 每页数据条数
					pageSize : 5,
					yqzpdataReady:false,
					yqimglist:[],
					yqzptoken:'',
					JKZT:false,
					checkValue:false,
					clicktag:0,
					sendyzmInter:0,
				    yzmTime:60,
				    isXyyyj:false //是否存在校医院意见
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("转码申请");
                self.initZmsqPage();
            },
            activated: function() {

			},
			filters: {
            	autoPhoto: function(settingInfo) {
            		/*var url = settingInfo.XSZPURL.fileUrl;
            		if(url) {
            			return url;
            		}*/
//            		self.settingInfo
            		var defImage = contextPath + "/sys/swpubapp/userinfo/getUserPhoto.do?USERID=" + settingInfo.XSBH;
                	return defImage;
                }
            },
            methods: {
            	getmodel:function(){
            		var model = WIS_EMAP_SERV.getModel("/modules/zmsq.do", "cxjkdaxsjkzmbd", "form");
            		if(sftoon){
						for(var index in model){
	            			if(model[index].name == "XSJKZM"){
	            				model[index]["xtype"] = "text";
	            			}
	            		}
					}
            		return model;
            	},
            	initZmsqPage:function(){
            		var self = this;
            		//查询提示信息
            		MOB_UTIL.doPost({ url: api.queryZmsqPageInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.settingInfo = {};
            				self.settingInfo = result.data;
            				self.formValue = result.data.JKDA || {};
            				if(!self.settingInfo.SFKZM && self.formValue.JKZT!='3'){
            					self.showPage = "0";
            				}else{
            					self.showPage = "1";
            					if(self.formValue.JKZT == '1' || self.formValue.JKZT == '2'){//如果为黄码或者红码则可提交申请
            						self.JKZT = true;
            						self.readonly=false;
            					}
            					if(result.data.JKDA.XYYYJ){
            						self.isXyyyj = true;
            					}
            					if(self.formValue.XSJKZM){
            						$("#fxyq_zmsq_btn").text("重新提交");
            					}
            					if(sftoon && self.formValue.XSJKZM){
                					self.yqzptoken = self.formValue.XSJKZM;
                					self.yqgetsqImageSrc(self.yqzptoken);
                				}
                				self.yqzpdataReady = true;
            				}
            			}else{
							mintUI.Toast({message: result.message});
						}
            		});
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
						Vue.set(self.formValue, 'XSJKZM',self.yqzptoken);
					});
				},
				
				//延期附件删除照片
				yqdelUploadImg:function(tokenwid){
					var self = this;
					api.delUploadImg(tokenwid,function(){
						self.yqgetsqImageSrc(self.yqzptoken);
						if(self.yqimglist.length == 0){
	    					Vue.set(self.formValue, 'XSJKZM',"");
						}
					});
				},
            	//保存申请
				applyZmsq:function(){
            		var self = this;
            		if (!self.$refs.form.validate()) {
                        return false;
                    }
            		/*if(!self.sendyzmInter){ //防止被多次打开 生成多个定时器
            			self.yzmTime = 60;
        				self.checkValue = true;
    		    		self.sendyzmInter = setInterval(function() {
    		    			self.yzmTime--;
    		    			if(self.yzmTime == 0){
    		    				self.checkValue = false;
    		    				clearInterval(self.sendyzmInter);
    		    				self.sendyzmInter = 0;
    		    			}
    		    		}, 1000);
		    		}*/
//            		MOB_UTIL.doPost({ url: api.saveZmsqApply, params: self.formValue }).done(function(result) {
//            			if(result.code == '0'){
//            				 mintUI.Toast({
//                                 message: '提交成功！',
//                                 iconClass: 'iconfont mint-icon-i icon-chenggong'
//                             });
//            				//刷新页面
//            				self.reloadPage();
//						}else{
//							mintUI.Toast({message: result.message});
//						}
//					});
            		mintUI.MessageBox.confirm('是否确认提交？如有更改，可重新提交！','提交确认').then(function(result){
            			MOB_UTIL.doPost({ url: api.saveZmsqApply, params: self.formValue }).done(function(result) {
                			if(result.code == '0'){
                				 mintUI.Toast({
                                     message: '提交成功！',
                                     iconClass: 'iconfont mint-icon-i icon-chenggong'
                                 });
                				//刷新页面
                				self.reloadPage();
    						}else{
    							mintUI.Toast({message: result.message});
    						}
    					});
                    },null);
            		
            	},
				// 重新加载页面
				reloadPage : function() {
					var self = this;
					self.JKZT = false;
					self.readonly=true;
					self.yqzpdataReady = false;
					self.initZmsqPage();
				}
				
            }
        };
        return page;
    };

});