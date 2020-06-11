define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/fxsq.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	settingInfo:{XSZPURL:{}},//设置信息，包括申请信息等
                	nIntervId:'',//定时器
                	checkDisable:true,//选择框
                	checkValue:false,//选择框值
                	showPage:'',//0:不在返校名单 1：未申请  2 已申请  3申请通过 4申请不通过 5逾期 6草稿 01不在申请时间范围内
                	zhrxmodel:WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxzhrxbd", "form"),
                	zhrxValue:{},
                	customVm: {},
                	readonly:false,
                	popupZhrx:false,
                	sjrq:"",//手机日期
                	sjsj:"",//手机时间
                	timeIntervId: "",
                	ewmIntervId: "",
                	 //申请详情数据当前状态
                    applyDetailShzt: "",
                    //申请详情流程arr
                    applyProcessDatas: [],
                    //申请详情数据申请时间
                    applyDetailSqsj: "",
                    applyDetailSqsj2: "",
                    //申请详情数据退回状态
                    applyDetailThzt: "",
                    //是否可撤回
                    applyDetailSfkch: false,
                    showcode:false,
                    redmsgFlag : false,
                    sfyjxdet:true,//是否已进校（当天不算）
                    sfhmszbwz:false,//是否黄码，并且异常原因为“数据不完整”

                    sfth:false,//是否退回审核申请
                    thyy:"",//退回审核意见
                };
            },
            beforeDestroy:function(){
            	var self = this;
            	if(self.timeIntervId){
            		clearInterval(self.timeIntervId);
            	}
            	if(self.ewmIntervId){
            		clearInterval(self.ewmIntervId);
            	}
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("返校申请");
                self.initPage();
            },
            filters: {
            	autoPhoto: function(settingInfo) {
            		var url = settingInfo.XSZPURL.fileUrl;
            		if(url) {
            			return url;
            		}
//            		self.settingInfo
            		var defImage = contextPath + "/sys/swpubapp/userinfo/getUserPhoto.do?USERID=" + settingInfo.RYBH;
                	return defImage;
                }
            },
            methods: {
            	initPage:function(){
            		var self = this;
            		//查询提示信息
            		MOB_UTIL.doPost({ url: api.queryIsRetunSchoolPeople, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.settingInfo = result.data || {};
            				self.settingInfo.SFFXRY = self.settingInfo.SFFXRY || false;
            				self.settingInfo.XSZPURL = self.settingInfo.XSZPURL || {};
            				if(self.settingInfo.SFYJXDRT && self.settingInfo.SFYJXDRT== '1'){//判断是否已进校第二天
            					self.sfyjxdet = false;
            				}
            				if(!self.settingInfo.SFFXRY || (self.settingInfo.SFFXRY && self.settingInfo.JKZT == '1' && self.settingInfo.SHZT != '99')){
            					//1.是否在返校名单
    							if(self.settingInfo.SFFXRY && self.settingInfo.JKZT == '1' && self.settingInfo.SHZT != '99'){
    								self.showPage = "02";
    								var color = "#FF7949";
    								self.settingInfo.redMsg = "红码原因：" + self.settingInfo.YCYY;
    								new QRCode('no_school_code',{
        								text: "               " + self.settingInfo.QRCODE?self.settingInfo.QRCODE:'' + "               ",
        								width: 150,
    								    height: 150,
    								    colorDark : color,
    								    correctLevel : QRCode.CorrectLevel.H
        							});
    							}else{
    								self.showPage = "0";	
    							}
            				}else if((!self.settingInfo.SFSQ || self.settingInfo.SFSQ && self.settingInfo.SHZT == "0"&&self.settingInfo.SFZH != "1") && self.settingInfo.SFKSQ == '0'){
            					//是否在申请时间范围内
            					self.showPage = "01";	
            					var color = "";
    							if(self.settingInfo.JKZT == '1'){
    								color = "#FF7949";
    							}else if(self.settingInfo.JKZT == '2'){
    								color = "#E6A400";
    							}else if(self.settingInfo.JKZT == '3' && self.settingInfo.isOutSchool){
                                    color = "#f97afb";
                                }else if(self.settingInfo.JKZT == '3'){
    								color = "#2baa66";
    							}
    							if(color != ""){
    								new QRCode('nosqsj_school_code',{
        								text: "               " + self.settingInfo.QRCODE + "               ",
        								width: 150,
    								    height: 150,
    								    colorDark : color,
    								    correctLevel : QRCode.CorrectLevel.H
        							});
    							}
            				}else{
            					//2.是否已申请
            					if(self.settingInfo.SFSQ){
            						self.applyDetailSqsj2 = self.settingInfo.SQFXRQ;
            						if(self.settingInfo.SHZT > 0 && self.settingInfo.SHZT < 99){
            							if(self.settingInfo.XSLBDM == "2" && self.settingInfo.DSQR != "1") {
            								mintUI.Toast({message: "请主动联系导师到系统中进行确认！"});
            							}
            							self.showPage = "2";
            							self.applyDetailShzt = self.settingInfo.SHZT;
                						self.applyDetailThzt = self.settingInfo.SHZT;
                						self.applyDetailSqsj = self.settingInfo.SQSJ;
                						MOB_UTIL.doPost({ url: api.queryShlcInfo, params: {"YWZJ": self.settingInfo.WID,"XSLBDM": self.settingInfo.XSLBDM} }).done(function(result) {
                							if(result.code == '0'){
                								self.applyProcessDatas = result.data || [];
                							}else{
                								mintUI.Toast({message: result.message});
                							}
                							
                						});
            						}else if(self.settingInfo.SHZT == 99){
            							if(self.settingInfo.XSLBDM == "2" && self.settingInfo.DSQR != "1") {
            								mintUI.Toast({message: "请主动联系导师到系统中进行确认！"});
            							}		
            							if(self.settingInfo.SFHMSJBWZ=="1"){
            								self.sfhmszbwz = true;
            							}
            							self.showPage = "3";
            							var color = "";
            							if(self.settingInfo.JKZT == "1"){
            								color = "#FF7949";
            								self.settingInfo.redMsg = "红码原因：" + self.settingInfo.YCYY;
            								self.redmsgFlag = true;
            							}else if(self.settingInfo.JKZT == "2"){
            								color = "#E6A400";
            								self.settingInfo.redMsg = "黄码原因：" + self.settingInfo.YCYY;
            								self.redmsgFlag = true;
            							}else if(self.settingInfo.JKZT == "3" && self.settingInfo.isOutSchool){
                                            color = "#f97afb";
                                        }else if(self.settingInfo.JKZT == "3"){
            								color = "#2baa66";
            							}
            							if(color != ""){
//            								new QRCode('in_school_code',{
//                								text: "               " + self.settingInfo.QRCODE + "               ",
//                								width: 150,
//            								    height: 150,
//            								    colorDark : color,
//            								    correctLevel : QRCode.CorrectLevel.H
//                							});
            							}
            							
            							//时间倒计时
            							var dqrq = self.settingInfo.DQRQ;
                    					dqrq = dqrq.replace(/-/g,"/");
                    					var now = new Date(dqrq);
            							self.initTime(now);
            							if(self.timeIntervId){ //防止被多次打开 生成多个定时器
                                            return;
                                        }
                                        self.timeIntervId = setInterval(function() {
                                        	now = new Date(now.getTime()+1000);
                                        	self.initTime(now);
                                        }, 1000);
                                        if(self.ewmIntervId){ //防止被多次打开 生成多个定时器
                			    			return;
                			    		}
                                        var zdjssj = self.settingInfo.ZDJSSJ?self.settingInfo.ZDJSSJ: 60;
                                        self.ewmIntervId = setInterval(function() {
                			    			self.refreshCode();
                			    		}, zdjssj*1000);
            						}else if(self.settingInfo.SHZT < 0){
            							self.showPage = "4";
            							self.applyDetailShzt = self.settingInfo.SHZT;
                						self.applyDetailThzt = self.settingInfo.SHZT;
                						self.applyDetailSqsj = self.settingInfo.SQSJ;
                						MOB_UTIL.doPost({ url: api.queryShlcInfo, params: {"YWZJ": self.settingInfo.WID,"XSLBDM": self.settingInfo.XSLBDM} }).done(function(result) {
                							if(result.code == '0'){
                								self.applyProcessDatas = result.data || [];
                							}else{
                								mintUI.Toast({message: result.message});
                							}
                							
                						});
            						}else if(!self.settingInfo.SHZT || self.settingInfo.SHZT == 0 || self.settingInfo.SHZT == ""){
            							if(self.settingInfo.SFZH == "1"){
            								self.showPage = "5";
            							}else{
                                            //判断是否退回的申请，展示退回原因提示
                                            if(self.settingInfo.SFTH&&(self.settingInfo.SFTH == '1'||self.settingInfo.SFTH == 1)){
                                                self.sfth = true;
                                                self.thyy = self.settingInfo.THYY?self.settingInfo.THYY:"暂无";
                                            }
            								self.showPage = "6";
            								self.applyDetailShzt = self.settingInfo.SHZT;
                    						self.applyDetailThzt = self.settingInfo.SHZT;
                    						self.applyDetailSqsj = self.settingInfo.SQSJ;
                    						MOB_UTIL.doPost({ url: api.queryShlcInfo, params: {"YWZJ": self.settingInfo.WID,"XSLBDM": self.settingInfo.XSLBDM} }).done(function(result) {
                    							if(result.code == '0'){
                    								self.applyProcessDatas = result.data || [];
                    							}else{
                    								mintUI.Toast({message: result.message});
                    							}
                    							
                    						});
            							}
            						}
            					}else{
            						self.showPage = "1";
            						if(self.nIntervId){ //防止被多次打开 生成多个定时器
            			    			return;
            			    		}
            			    		self.nIntervId = setInterval(function() {
            			    			self.settingInfo.FXTZYDSJ--;
            			    			if(self.settingInfo.FXTZYDSJ == 0){
            			    				self.checkDisable = false;
            			    				clearInterval(self.nIntervId);
            			    			}
            			    		}, 1000);
            			    		if(self.settingInfo.JKZT == '2'){
                    					self.showcode = "1";
//                    					new QRCode('yellow_school_code',{
//            								text: "               " + self.settingInfo.QRCODE + "               ",
//            								width: 150,
//        								    height: 150,
//        								    colorDark : "#E6A400",
//        								    correctLevel : QRCode.CorrectLevel.H
//            							});
                    					$(".fxts").css("min-height","unset");
                    				}else if(self.settingInfo.JKZT == '3'){
                    					self.showcode = "1";
                                        var color = "#2baa66"
                                        if(self.settingInfo.JKZT == '3' && self.settingInfo.isOutSchool){
                                            color = "#f97afb";
                                        }
//                    					new QRCode('yellow_school_code',{
//            								text: self.settingInfo.QRCODE,
//            								width: 150,
//        								    height: 150,
//        								    colorDark : color,
//        								    correctLevel : QRCode.CorrectLevel.H
//            							});
                    					$(".fxts").css("min-height","unset");
                    					$("#yellow_school_sm").hide();
                    				}
            					}
            				}
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            		
            	},
            	//初始化时间
            	initTime: function(time) {
            		var self = this;
            		self.getFormatDate(time);
            	},
            	//获取格式化日期
            	getFormatDate:function(time) {
            		var month = time.getMonth() + 1 ;
            		var day = time.getDate();
            		var hour = time.getHours();
            		var min = time.getMinutes();
            		var s = time.getSeconds();
            		month = month<10 ?"0"+month:month+"";
            		day = day<10 ?"0"+day:day+"";
            		hour = hour<10 ?"0"+hour:hour+"";
            		min = min<10 ?"0"+min:min+"";
            		s = s<10 ?"0"+s:s+"";
            		this.sjrq = month+"月" + day + "日";
            		this.sjsj = hour + ":" + min + ":" + s;
            	},
            	//按期申请
            	toOnTimeApply:function(){
            		var self = this;
            		//入通知已读表
            		MOB_UTIL.doPost({ url: api.saveReadNotice, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.$router.replace({ name: 'addFxsq', query: {type:1} });
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	//逾期申请
            	toOutTimeApply:function(){
            		var self = this;
            		//入通知已读表
            		MOB_UTIL.doPost({ url: api.saveReadNotice, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.$router.replace({ name: 'addFxsq', query: {type:2} });
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	//查看申请信息  type:1按期  2 逾期
            	toSqxx:function(){
            		var self = this;
            		var type = 1;
            		if(self.showPage == "5"){
            			type = 2;
            		}
            		self.$router.push({ name: 'viewFxsq', query: {type:type,sfyjxdet:self.sfyjxdet}});
                },
                
                //暂缓入校
                toZhrx:function(){
                	var self = this;
                	self.$router.replace({ name: 'addFxsq', query: {type:2} });
                	//this.popupZhrx = true;
                },
                
                //取消暂缓
                cancelDelay:function(){
                	this.popupZhrx = false;
                },
                
                //暂缓入校
                delayEnterSchool:function(){
                	var self = this;
            		if (!self.$refs.form.validate()) {
                        return false;
                    }
            		//暂缓入校
            		MOB_UTIL.doPost({ url: api.delayEnterSchool, params: self.zhrxValue }).done(function(result) {
            			if(result.code == '0'){
            				self.popupZhrx = false;
            				self.showPage = '';
            				self.initPage();
						}else{
							mintUI.Toast({message: result.message});
						}
					});
                },
                
                //重新申请
                toReapply:function(){
                	var self = this;
                	if(self.settingInfo.SFKSQ == '0'){
                		mintUI.Toast({message: "不在申请时间范围内!"});
            			return;
                	}
                	if(self.settingInfo.JKZT == '1'){
    					self.showPage = "0";
    					new QRCode('red_school_code',{
							text: "               " + self.settingInfo.QRCODE + "               ",
							width: 150,
						    height: 150,
						    colorDark : "#FF7949",
						    correctLevel : QRCode.CorrectLevel.H
						});
    				}else{
    					self.showPage = "1";
    					if(self.nIntervId){ //防止被多次打开 生成多个定时器
    		    			return;
    		    		}
    		    		self.nIntervId = setInterval(function() {
    		    			self.settingInfo.FXTZYDSJ--;
    		    			if(self.settingInfo.FXTZYDSJ == 0){
    		    				self.checkDisable = false;
    		    				clearInterval(self.nIntervId);
    		    			}
    		    		}, 1000);
    		    		if(self.settingInfo.JKZT == '2'){
        					self.showcode = "1";
//        					new QRCode('yellow_school_code',{
//    							text: "               " + self.settingInfo.QRCODE + "               ",
//    							width: 150,
//    						    height: 150,
//    						    colorDark : "#E6A400",
//    						    correctLevel : QRCode.CorrectLevel.H
//    						});
        					$(".fxts").css("min-height","unset");
        				}
    		    		else if(self.settingInfo.JKZT == '3'){
        					self.showcode = "1";
                            var color = "#2baa66";
                            if(self.settingInfo.JKZT == '3' && self.settingInfo.isOutSchool){
                                color = "#f97afb";
                            }
//        					new QRCode('yellow_school_code',{
//								text: self.settingInfo.QRCODE,
//								width: 150,
//							    height: 150,
//							    colorDark : color,
//							    correctLevel : QRCode.CorrectLevel.H
//							});
        					$(".fxts").css("min-height","unset");
        					$("#yellow_school_sm").hide();
        				}
    				}
                },
                
                refreshCode:function(){
                	var self = this;
            		MOB_UTIL.doPost({ url: api.refreshCode, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				result.data = result.data || {};
            				self.settingInfo.DQRQ = result.data.DQRQ || "";
            				self.settingInfo.JKZT = result.data.JKZT || "";
            				//此时： self.showPage = "3"
							var color = "#2baa66";
							if(self.settingInfo.JKZT == '2'){
								color = "#E6A400";
							}
							if(self.settingInfo.JKZT == '1'){
								color = "#FF7949";
							}
                            if(self.settingInfo.JKZT == "3" && self.settingInfo.isOutSchool){
                                color = "#f97afb";
                            }
//							$("#in_school_code").html("");
//							new QRCode('in_school_code',{
//								text: "               " + self.settingInfo.QRCODE + "               ",
//								width: 150,
//							    height: 150,
//							    colorDark : color,
//							    correctLevel : QRCode.CorrectLevel.H
//							});
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
