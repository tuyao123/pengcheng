define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/add/addFxsq.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	model: {},
                	fxsqValue:{},
                	customVm: {},
                	readonly:false,
                	settingInfo:{},
                	openFlag:false,
                	zpdataReady:false,
                	imglist:[],
                	zptoken:'',
                	yqzpdataReady:false,
                	yqimglist:[],
                	yqzptoken:'',
                	type:1,//1 按期返校申请  2逾期返校
					noDays:0,//未填写天数
					jkdays:0,//健康天数
					bryzm:'',
					lxrzm:'',
					JKZM_FLAG:false,
					
					sendyzmFlag:false,
                    yzmTime:180,
                    sendyzmInter:0,
                    sendjjyzmFlag:false,
                    jjyzmTime:180,
                    sendjjyzmInter:0
                };
            },
            watch : {
				$route : function(to, from) {
					var self = this;
					if (to.name == "addFxsq"){
						self.noDays = 0;
						self.jkdays = 0;
						self.type = self.$route.query.type;
						if(self.type == 2){
		                	self.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsyqfxsqbd", "form");
		                	if(sftoon){
								for(var index in self.model){
			            			if(self.model[index].name == "GQFXZM_EK"){
			            				self.model[index]["xtype"] = "text";
			            			}
			            		}
							}
		                }else{
		                	self.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsfxsqbdx", "form");
		                	if(sftoon){
		                		for(var index in self.model){
		                			if(self.model[index].name == "ZP"){
		                				self.model[index]["xtype"] = "text";
		                			}
		                		}
		                	}
		                }
						if(from.name == "fxsq"){
							self.initPage();
						}else{
							self.refeshPage();
						}
					}
				}
			},
            created: function() {
            	var self = this;
                SDK.setTitleText("返校疫情管理");
                self.type = self.$route.query.type;
                if(self.type == 1){
                	self.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsfxsqbdx", "form");
                	if(sftoon){
                		for(var index in self.model){
                			if(self.model[index].name == "ZP"){
                				self.model[index]["xtype"] = "text";
                			}
                		}
                	}
                }else if(self.type == 2){
                	self.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsyqfxsqbd", "form");
                	if(sftoon){
						for(var index in self.model){
	            			if(self.model[index].name == "GQFXZM_EK"){
	            				self.model[index]["xtype"] = "text";
	            			}
	            		}
					}
                }
                self.initPage();
            },
            methods: {
            	initPage:function(){
            		var self = this;
            		//查询申请信息
            		MOB_UTIL.doPost({ url: api.queryFxsqInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.settingInfo = result.data.SET || {};
            				self.fxsqValue = result.data.SQXX || {};
            				if(sftoon && self.fxsqValue.ZP){
            					self.zptoken = self.fxsqValue.ZP;
            					self.getsqImageSrc(self.zptoken);
            				}
            				self.zpdataReady = true;
            				if(sftoon && self.fxsqValue.GQFXZM_EK){
            					self.yqzptoken = self.fxsqValue.GQFXZM_EK;
            					self.yqgetsqImageSrc(self.yqzptoken);
            				}
            				self.yqzpdataReady = true;
            				var jkdaList = result.data.JKDA || [];
            				self.noDays = 0;
            				$.each(jkdaList,function(index,item){
            					if(!item.TBSJ){
            						self.noDays++;
            					}
            					//05.02健康档案单去除中间3个异常判断
            					if(item.SFFRHKS == '1' ||/* item.SFQGJCHB == '1' || item.SFQZHYS == '1' 
            						|| item.SFJCQZ == '1' ||*/ item.SFBGL == '1' || Number(item.TW) >= 37.3){
            						
            					}else{
            						self.jkdays++;
            					}
            					if(item.JKZM && item.JKZM != ""){
            						self.JKZM_FLAG = true;
            					}
            				});
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	refeshPage:function(){
            		var self = this;
            		//查询申请信息
            		MOB_UTIL.doPost({ url: api.queryFxsqInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.settingInfo = result.data.SET || {};
            				self.fxsqValue.JKZM_EK = result.data.SQXX.JKZM_EK || "";
            				self.fxsqValue.JQJZBA = result.data.SQXX.JQJZBA || "";
            				self.fxsqValue.MQSZD = result.data.SQXX.MQSZD || "";
            				self.fxsqValue.SFLKSJSQ = result.data.SQXX.SFLKSJSQ || "";
            				self.fxsqValue.SFCN = result.data.SQXX.SFCN || "";
            				self.fxsqValue.SHZT = result.data.SQXX.SHZT || "";
                            self.fxsqValue.JLZM_EK = result.data.SQXX.JLZM_EK || "";
            				if(sftoon && self.fxsqValue.ZP){
            					self.zptoken = self.fxsqValue.ZP;
            					self.getsqImageSrc(self.zptoken);
            				}
            				self.zpdataReady = true;
            				if(sftoon && self.fxsqValue.GQFXZM_EK){
            					self.yqzptoken = self.fxsqValue.GQFXZM_EK;
            					self.yqgetsqImageSrc(self.yqzptoken);
            				}
            				self.yqzpdataReady = true;
            				var jkdaList = result.data.JKDA || [];
            				self.noDays = 0;
            				$.each(jkdaList,function(index,item){
            					if(!item.TBSJ){
            						self.noDays++;
            					}
            					//05.02健康档案单去除中间3个异常判断
            					if(item.SFFRHKS == '1' || /*item.SFQGJCHB == '1' || item.SFQZHYS == '1' 
            						|| item.SFJCQZ == '1' || */item.SFBGL == '1' || Number(item.TW) >= 37.3){
            						
            					}else{
            						self.jkdays++;
            					}
            					if(item.JKZM && item.JKZM != ""){
            						self.JKZM_FLAG = true;
            					}
            				});
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	//展开收起
            	openHeader:function(){
            		this.openFlag = !this.openFlag;
            	},
            	
            	//修改头像
            	toChooseZp:function(){
            		// 展示子组件
					this.$router.push({
						name : 'addFxsq',
						query : {
							isChooseZp : '1'
						}
					});
            	},
            	
            	//获取图片列表
            	getsqImageSrc : function(token) {
            		this.imglist = api.getXcjcImageArraySrc(token);
            	},
            	
            	//上传照片
            	onUploadImg:function(e){
            		var self = this;
					api.UploadImg(self.zptoken,"1",function(result){
						self.zptoken = result.data.tokenId;
						self.getsqImageSrc(self.zptoken);
						Vue.set(self.fxsqValue, 'ZP',self.zptoken);
					});
				},
				
				//删除照片
				delUploadImg:function(tokenwid){
					var self = this;
					api.delUploadImg(tokenwid,function(){
						self.getsqImageSrc(self.zptoken);
						Vue.set(self.fxsqValue, 'ZP',"");
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
						Vue.set(self.fxsqValue, 'GQFXZM_EK',self.yqzptoken);
					});
				},
				
				//延期附件删除照片
				yqdelUploadImg:function(tokenwid){
					var self = this;
					api.delUploadImg(tokenwid,function(){
						self.yqgetsqImageSrc(self.yqzptoken);
						if(self.yqimglist.length == 0){
	    					Vue.set(self.fxsqValue, 'GQFXZM_EK',"");
						}
					});
				},
            	
            	gotoParent:function(param){
            		var self = this;
					Vue.set(self.fxsqValue, 'ZP',param.ZP);
					Vue.set(self.fxsqValue, 'XSZP',api.getXcjcImageSrc(param.ZP,"1"));
            	},
            	
            	chooseFdy:function(){
            		var self = this;
                    //展示子组件
					self.$router.push({ name: 'addFxsq', query: { isChooseFdy: '1'} });
            	},
                
                gotoFdyParent:function(rtnParam){
					var self = this;
//					Vue.set(self.fxsqValue, "DWDM", rtnParam.STU_DATA.DWDM);
//					Vue.set(self.fxsqValue, "DWDM_DISPLAY", rtnParam.STU_DATA.DWDM_DISPLAY);
					Vue.set(self.fxsqValue, "BJDM", rtnParam.STU_DATA.BJDM);
					Vue.set(self.fxsqValue, "BJDM_DISPLAY", rtnParam.STU_DATA.BJDM_DISPLAY);
					Vue.set(self.fxsqValue, "FDY", rtnParam.STU_DATA.XM);
				},
            	
            	//保存 
            	saveApply:function(){
            		var self = this;
            		if(self.type == 1){
            			if(self.bryzm == ""){
            				mintUI.Toast({message: "本人手机验证码不能为空!"});
            				return false;
            			}
                        if(self.lxrzm == ""){
                            mintUI.Toast({message: "紧急联系人验证码不能为空!"});
                            return false;
                        }
            			if (!self.$refs.form.validate()) {
                            return false;
                        }
            			//校验辅导员
            			if(!self.fxsqValue.FDY || self.fxsqValue.FDY == ""){
            				mintUI.Toast({message: "系统无法获知你的辅导员信息，请选择辅导员!"});
            				return false;
            			}
            			if(self.fxsqValue.LXDH == self.fxsqValue.JJLXRDH){
            				mintUI.Toast({message: "本人手机号和紧急联系人手机号相同!"});
            				return false;
            			}
            			//校验三单一书
            			if(self.noDays > 0 || !self.fxsqValue.JQJZBA){
            				mintUI.Toast({message: "请完成健康档案单!"});
            				return false;
            			}
            			if(!self.fxsqValue.MQSZD || self.fxsqValue.MQSZD == ""){
            				mintUI.Toast({message: "请完成返校行程报告单!"});
            				return false;
            			}
            			if(self.fxsqValue.SFCN != "1"){
            				mintUI.Toast({message: "请阅读承诺书!"});
            				return false;
            			}
            			//校验健康证明
                		var arr = api.getXcjcImageArraySrc(self.fxsqValue.JKZM_EK) || [];
                		if(arr.length == 0 && self.JKZM_FLAG){
                			mintUI.Toast({message: "请先上传健康证明!"});
            				return false;
                		}
                        if(!self.fxsqValue.JLZM_EK || self.fxsqValue.JLZM_EK == ""){
                            mintUI.Toast({message: "请完成假期居旅轨迹单!"});
                            return false;
                        }
                		delete self.fxsqValue["SFZH"];
                		delete self.fxsqValue["YQFXYY"];
            			delete self.fxsqValue["YQFXBZ"];
            		}
            		if(self.type == 2){
            			if(!self.fxsqValue.NDDSJ || self.fxsqValue.NDDSJ == ""){
            				mintUI.Toast({message: "预计到校时间不能为空!"});
            				return false;
            			}
            			if(!self.fxsqValue.YQFXYY || self.fxsqValue.YQFXYY == ""){
            				mintUI.Toast({message: "改期返校原因不能为空!"});
            				return false;
            			}
            			if(sftoon){
            				if(this.yqimglist.length == 0){
            					mintUI.Toast('改期返校证明不能为空！');
                                return false;
        					}
            			}else{
            				if(!self.fxsqValue.GQFXZM_EK || self.fxsqValue.GQFXZM_EK == ""){
            					mintUI.Toast('改期返校证明不能为空！');
                                return false;
        					}else{
        						var arr = api.getXcjcImageArraySrc(self.fxsqValue.GQFXZM_EK) || [];
        						if(arr.length == 0){
                					mintUI.Toast('改期返校证明不能为空！');
                                    return false;
            					}
        					}
            			}
            			if(self.fxsqValue.NDDSJ < self.settingInfo.FXKSRQ){
            				mintUI.Toast({message: "预计到校时间不能小于" + self.settingInfo.FXKSRQ});
            				return false;
            			}
            		}
            		self.fxsqValue.type = self.type;
            		self.fxsqValue.BRYZM = self.bryzm || "";
            		self.fxsqValue.LXRYZM = self.lxrzm || "";
            		//05.02逾期申请保存时加提示确认告知学生如果申请逾期会重置数据
            		if(self.type == 2){
            			mintUI.MessageBox.confirm('逾期返校将会重置按期返校填写的信息，请确认是否需要逾期返校？','逾期确认').then(function(){
            				MOB_UTIL.doPost({ url: api.saveRetunSchoolApply, params: self.fxsqValue }).done(function(result) {
                    			if(result.code == '0'){
                    				self.$router.replace({ name: 'fxsq', query: {} });
                                    mintUI.MessageBox({
                                      title: '改期返校成功',
                                      message: '请联系辅导员把你移至相应批次！',
                                      showCancelButton: true,
                                      showCancelButton:false,
                                      confirmButtonText:'我已知晓'
                                    });
        						}else{
        							mintUI.Toast({message: result.message});
        						}
        					});
            			},null);
            			return ;
            		}
            		MOB_UTIL.doPost({ url: api.saveRetunSchoolApply, params: self.fxsqValue }).done(function(result) {
            			if(result.code == '0'){
            				self.$router.replace({ name: 'fxsq', query: {} });
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	/**
            	 * 健康档案
            	 */
            	toJkda:function(){
            		var self = this;
            		self.$router.push({ name: 'jkda', query: {} });
            	},
            	
            	/**
            	 * 返校行程
            	 */
            	toFxxc:function(){
            		var self = this;
            		self.$router.push({ name: 'fxxc', query: {} });
            	},
            	
            	/**
            	 * 居旅轨迹
            	 */
            	toJlgj:function(){
            		var self = this;
            		self.$router.push({ name: 'jlgj', query: {} });
            	},
            	
            	/**
            	 * 查看承诺书
            	 */
            	lookCns:function(){
            		var self = this;
            		self.$router.push({ name: 'cns', query: {} });
            	},
            	
            	/**
            	 * 获取本人验证码
            	 */
            	getBryzm:function(){
            		//1.校验本人手机号
            		//2.生成验证码，添加到消息表
            		//3.添加到手机验证码表
            		var self = this;
            		var param = {};
            		var phone = self.fxsqValue.LXDH || "";
            		var regex = /^(1[0-9]{10})$/;
            		if (!phone.match(regex)) {
            			mintUI.Toast({message: "请录入正确的手机号码！"});
            		    return false;
            		}
            		param.SJH = phone;
            		if(!self.sendyzmInter){ //防止被多次打开 生成多个定时器
            			self.yzmTime = 180;
        				self.sendyzmFlag = true;
    		    		self.sendyzmInter = setInterval(function() {
    		    			self.yzmTime--;
    		    			if(self.yzmTime == 0){
    		    				self.sendyzmFlag = false;
    		    				clearInterval(self.sendyzmInter);
    		    				self.sendyzmInter = 0;
    		    			}
    		    		}, 1000);
		    		}
            		MOB_UTIL.doPost({ url: api.sendVerificationCode, params: param }).done(function(result) {
            			if(result.code == '0'){
            				mintUI.Toast({message: "发送成功"});
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	/**
            	 * 获取联系人验证码
            	 */
            	getLxryzm:function(){
            		var self = this;
            		var param = {};
            		var phone = self.fxsqValue.JJLXRDH || "";
            		var regex = /^(1[0-9]{10})$/;
            		if (!phone.match(regex)) {
            			mintUI.Toast({message: "请录入正确的手机号码！"});
            		    return false;
            		}
            		param.SJH = phone;
            		if(!self.sendjjyzmInter){ //防止被多次打开 生成多个定时器
            			self.jjyzmTime = 180;
        				self.sendjjyzmFlag = true;
    		    		self.sendjjyzmInter = setInterval(function() {
    		    			self.jjyzmTime--;
    		    			if(self.jjyzmTime == 0){
    		    				self.sendjjyzmFlag = false;
    		    				clearInterval(self.sendjjyzmInter);
    		    				self.sendjjyzmInter = 0;
    		    			}
    		    		}, 1000);
		    		}
            		MOB_UTIL.doPost({ url: api.sendVerificationCode, params: param }).done(function(result) {
            			if(result.code == '0'){
            				mintUI.Toast({message: "发送成功"});
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	previewImage:function(){
            		var self = this;
            		var imgUrl = [{url:contextPath + '/sys/swmfxyqglapp/public/images/model.png',desc:''}];
            		SDK.preViewImages(imgUrl,0);
            	},
            }
        };
        return page;
    };

});