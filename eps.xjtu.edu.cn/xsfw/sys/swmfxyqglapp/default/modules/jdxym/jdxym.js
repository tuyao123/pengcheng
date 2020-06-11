define(function(require, exports, module) {
    var tpl = require('text!modules/jdxym/jdxym.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	settingInfo:{XSZPURL:{}},//设置信息，包括申请信息等
                	showPage:'',//0:不在返校名单 1：未申请  2 已申请  3申请通过 4申请不通过 5逾期 6草稿 01不在申请时间范围内
                	sjrq:"",//手机日期
                	sjsj:"",//手机时间
                	timeIntervId: "",//页面时间定时器
                	changeToPurple:true,//自动变紫码
                	outtimeIntervId:"",//绿码变紫码定时器
                	intimeIntervId:"",//紫码变回原码定时器
                };
            },
            beforeDestroy:function(){
            	var self = this;
            	if(self.timeIntervId){
            		clearInterval(self.timeIntervId);
            	}
            	if(self.outtimeIntervId){
            		clearInterval(self.outtimeIntervId);
            	}
            	if(self.intimeIntervId){
            		clearInterval(self.intimeIntervId);
            	}
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("交大校园码");
                self.initPage();
            },
            filters: {
            	autoPhoto: function(settingInfo) {
            		var url = settingInfo.XSZPURL?settingInfo.XSZPURL.fileUrl:"";
            		if(url) {
            			return url;
            		}
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
            				if(!self.settingInfo.SFFXRY || !self.settingInfo.SFSQ || (self.settingInfo.SFSQ && self.settingInfo.SHZT == "0")){
            					self.showPage = "1";//未安排或，未申请或，草稿页面
            					/*绿码且有下次外出记录，增加变紫码倒计时*/
    							if(self.outtimeIntervId){ //防止被多次打开 生成多个定时器
                                    return;
                                }
    							var hasNextOut = self.settingInfo.hasNextOut;
    							var nextOutRest = self.settingInfo.nextOutRest;
    							if(hasNextOut && self.settingInfo.JKZT == "3"){
    								self.outtimeIntervId = setInterval(function() {
    									nextOutRest--;
        								if(nextOutRest == 0){
        									//绿码变紫码
        									self.changeToPurple = true;
        									$('#apply_school_code').html("");
        									new QRCode('apply_school_code',{
                								text: "               " + self.settingInfo.QRCODE + "               ",
                								width: 150,
            								    height: 150,
            								    colorDark : "#f97afb",
            								    correctLevel : QRCode.CorrectLevel.H
                							});
        								}else if(nextOutRest < 0){
        									clearInterval(self.outtimeIntervId);
        								}
                                    }, 1000);
    							}
    							
    							/*增加返回时间到期后倒计时*/
    							if(self.intimeIntervId){ //防止被多次打开 生成多个定时器
                                    return;
                                }
    							var hasNextIn = self.settingInfo.hasNextIn;
    							var nextInRest = self.settingInfo.nextInRest;
    							if(hasNextIn){
    								self.intimeIntervId = setInterval(function() {
    									nextInRest--;
        								if(nextInRest == 0){
        									//紫码变原码
        									$('#apply_school_code').html("");
        									new QRCode('apply_school_code',{
                								text: "               " + self.settingInfo.QRCODE + "               ",
                								width: 150,
            								    height: 150,
            								    colorDark : self.settingInfo.JKZT == "1"?"#FF7949":(self.settingInfo.JKZT == "2"?"#E6A400":(self.settingInfo.JKZT == "3"?"#2baa66":"")),
            								    correctLevel : QRCode.CorrectLevel.H
                							});
        								}else if(nextOutRest < 0){
        									clearInterval(self.outtimeIntervId);
        								}
                                    }, 1000);
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
            					var color = "";
    							if(self.settingInfo.JKZT == "1"){
    								color = "#FF7949";
    								self.settingInfo.redMsg = "红码原因：" + (self.settingInfo.YCYY?self.settingInfo.YCYY:"");
    							}else if(self.settingInfo.JKZT == "2"){
    								color = "#E6A400";
    								self.settingInfo.yellowMsg = "黄码原因：" + (self.settingInfo.YCYY?self.settingInfo.YCYY:"");
    							}else if(self.settingInfo.JKZT == "3" && (self.settingInfo.SFJX =='1'||self.settingInfo.isBmd) && self.settingInfo.isOutSchool){
                                    color = "#f97afb";
                                }else if(self.settingInfo.JKZT == "3"){
    								color = "#2baa66";
    							}
    							if(color != ""){
    								new QRCode('apply_school_code',{
        								text: "               " + self.settingInfo.QRCODE + "               ",
        								width: 150,
    								    height: 150,
    								    colorDark : color,
    								    correctLevel : QRCode.CorrectLevel.H
        							});
    							}
            				}else{
            					self.showPage = "2";//申请后
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
    							
    							/*绿码且有下次外出记录，增加变紫码倒计时*/
    							if(self.outtimeIntervId){ //防止被多次打开 生成多个定时器
                                    return;
                                }
    							var hasNextOut = self.settingInfo.hasNextOut;
    							var nextOutRest = self.settingInfo.nextOutRest;
    							if(hasNextOut && self.settingInfo.JKZT == "3"){
    								self.outtimeIntervId = setInterval(function() {
    									nextOutRest--;
        								if(nextOutRest == 0){
        									//绿码变紫码
        									self.changeToPurple = true;
        									$('#applyed_school_code').html("");
        									new QRCode('applyed_school_code',{
                								text: "               " + self.settingInfo.QRCODE + "               ",
                								width: 150,
            								    height: 150,
            								    colorDark : "#f97afb",
            								    correctLevel : QRCode.CorrectLevel.H
                							});
        								}else if(nextOutRest < 0){
        									clearInterval(self.outtimeIntervId);
        								}
                                    }, 1000);
    							}
    							
    							/*增加返回时间到期后倒计时*/
    							if(self.intimeIntervId){ //防止被多次打开 生成多个定时器
                                    return;
                                }
    							var hasNextIn = self.settingInfo.hasNextIn;
    							var nextInRest = self.settingInfo.nextInRest;
    							if(hasNextIn){
    								self.intimeIntervId = setInterval(function() {
    									nextInRest--;
        								if(nextInRest == 0){
        									//紫码变原码
        									$('#applyed_school_code').html("");
        									new QRCode('applyed_school_code',{
                								text: "               " + self.settingInfo.QRCODE + "               ",
                								width: 150,
            								    height: 150,
            								    colorDark : self.settingInfo.JKZT == "1"?"#FF7949":(self.settingInfo.JKZT == "2"?"#E6A400":(self.settingInfo.JKZT == "3"?"#2baa66":"")),
            								    correctLevel : QRCode.CorrectLevel.H
                							});
        								}else if(nextOutRest < 0){
        									clearInterval(self.outtimeIntervId);
        								}
                                    }, 1000);
    							}
            					var color = "";
    							if(self.settingInfo.JKZT == "1"){
    								color = "#FF7949";
    								self.settingInfo.redMsg = "红码原因：" + (self.settingInfo.YCYY?self.settingInfo.YCYY:"");
    							}else if(self.settingInfo.JKZT == "2"){
    								color = "#E6A400";
    								self.settingInfo.yellowMsg = "黄码原因：" + (self.settingInfo.YCYY?self.settingInfo.YCYY:"");
    							}else if(self.settingInfo.JKZT == "3" && (self.settingInfo.SFJX =='1'||self.settingInfo.isBmd) && self.settingInfo.isOutSchool){
                                    color = "#f97afb";
                                }else if(self.settingInfo.JKZT == "3"){
    								color = "#2baa66";
    							}
    							if(color != ""){
    								new QRCode('applyed_school_code',{
        								text: "               " + self.settingInfo.QRCODE + "               ",
        								width: 150,
    								    height: 150,
    								    colorDark : color,
    								    correctLevel : QRCode.CorrectLevel.H
        							});
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
            	//查看异常原因详情
            	viewMsgDetail:function(){
            		var detail = "";
            		MOB_UTIL.doPost({url: api.getMsgDetail,params: {}}).done(function(result) {
            			if(result.data && result.data.YCXQ) {
        					var ycxq=result.data.YCXQ?result.data.YCXQ:[];//原始详情
        					var zjk_ycxq = result.data.ZJK_YCXQ?result.data.ZJK_YCXQ:[];//带有中间库的详情
        					if(zjk_ycxq.length>0){
        						ycxq = zjk_ycxq;
        					}
        					if(ycxq.length>0){
        						for(var index in ycxq){
        							detail += (ycxq[index].TBSJ?ycxq[index].TBSJ:"")+"  "
        								   +(ycxq[index].YCYY?ycxq[index].YCYY:"")+"  "+(ycxq[index].ZJK_YCYY?("("+ycxq[index].ZJK_YCYY+")<br><br>"):"<br>");
        						}
        					}
        				}
            			mintUI.MessageBox('原因详情', detail?detail:"暂无");
            			Vue.nextTick(function() {
            				$('.mint-msgbox-message').css("text-align","left");
            			});
                    });
            	}
            	
            }
        };
        return page;
    };

});
