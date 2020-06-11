define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/add/jlgj.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	travelList:[],//数据库居旅
                	jlTemList:[],//页面展示
                	model : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjlxxbd", "form"),
                    jlzmmodel : this.getmodel(),
                	jlValue: {},
                    jlzmValue: {},
                    yqzpdataReady:false,
                	yqimglist:[],
                	yqzptoken:'',
                	customVm:{},
                	readonly:true,
                	setingInfo:{}
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("假期居旅轨迹单");
                self.initPage();
            },
            methods: {
            	getmodel:function(){
            		var model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjlzmbddz", "form");
            		if(sftoon){
						for(var index in model){
	            			if(model[index].name == "JLZM_EK"){
	            				model[index]["xtype"] = "text";
	            			}
	            		}
					}
            		return model;
            	},
            	initPage:function(){
            		var self = this;
            		//查询居旅信息
            		MOB_UTIL.doPost({ url: api.queryTravel, params: {TYPE:"add"} }).done(function(result) {
            			if(result.code == '0'){
            				self.travelList = result.data.JLXX || [];
            				if(self.travelList.length >= 3){
            					self.jlTemList = [self.travelList[0],self.travelList[1],self.travelList[2]];
            				}
            				
            				self.jlValue = result.data.SQXX || {};
                            self.jlzmValue = result.data.SQXX || {};
                            if(sftoon && self.jlzmValue.JLZM_EK){
            					self.yqzptoken = self.jlzmValue.JLZM_EK;
            					self.yqgetsqImageSrc(self.yqzptoken);
            				}
            				self.yqzpdataReady = true;
            				
            				self.setingInfo = result.data.SET || {};


            				Vue.set(self.jlValue,"SFLKSJSQ",result.data.DD);
            				Vue.set(self.jlValue,"SFWCFY",result.data.QTXHD);
            				Vue.set(self.jlValue,"JQJL",result.data.QGYQ);
                            
                            if(result.data.SQXX && result.data.SQXX.JLZM_EK){
                                Vue.set(self.jlzmValue,"JLZM_EK",result.data.SQXX.JLZM_EK);
                            }
                            
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
						Vue.set(self.jlzmValue, 'JLZM_EK',self.yqzptoken);
					});
				},
				
				//延期附件删除照片
				yqdelUploadImg:function(tokenwid){
					var self = this;
					api.delUploadImg(tokenwid,function(){
						self.yqgetsqImageSrc(self.yqzptoken);
						if(self.yqimglist.length == 0){
	    					Vue.set(self.jlzmValue, 'JLZM_EK',"");
	    					//删除图片，直接情况token
	                        MOB_UTIL.doPost({ url: api.saveTravelOtherInfo, params: {JLZM_EK: ""} }).done(function(result) {
	                            if(result.code == '0'){
	                            }else{
	                                mintUI.Toast({message: result.message});
	                            }
	                        });
						}
					});
				},
            	
            	/**
            	 * 保存居旅其他信息
            	 */
            	sureJlinfo:function(){
                    var self = this;
                    if (!self.$refs.jlzmform.validate()) {
                        return false;
                    }
                    if(sftoon){
        				if(this.yqimglist.length == 0){
        					mintUI.Toast('居旅证明不能为空！');
                            return;
    					}
        			}
                    var param = {JLZM_EK: self.jlzmValue.JLZM_EK};              
                    MOB_UTIL.doPost({ url: api.saveTravelOtherInfo, params: param }).done(function(result) {
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