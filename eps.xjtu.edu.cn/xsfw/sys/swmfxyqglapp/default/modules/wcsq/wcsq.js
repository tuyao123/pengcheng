define(function(require, exports, module) {
    var tpl = require('text!modules/wcsq/wcsq.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	dataReady:false,
                	settingInfo:{XSZPURL:{}},//设置信息，包括申请信息等
                	showPage:'',//0:不可申请 1：可申请填写  2 已申请 审核中  3申请通过 4申请不通过 
                	showTab:'wcsq',
                	wcsqModel:WIS_EMAP_SERV.getModel("/modules/wcsq.do", "xswcsqbd", "form"),
                	formValue:{},
                	jxewm:false,
                	DJSZT:"", //倒计时状态 1.
                	autotext:"",//自动天时分秒
                	nIntervId:'',//定时器
                	customVm: {},
                	readonly:false,
                	 //申请详情数据当前状态
                    applyDetailShzt: "",
                    //申请详情流程arr
                    applyProcessDatas: [],
                    //申请详情数据申请时间
                    applyDetailSqsj: "",
                    //申请详情数据退回状态
                    applyDetailThzt: "",
                    applyDetailSfkch:false,
                    
                    showList:false,
                    WCSQ_LIST:[],
					hasWcsqData:false,
					start:"",
					
					// 分页页数
					pageNumber : 1,
					// 每页数据条数
					pageSize : 5,
					// 加载更多数据
					loadMore : false,
					// 用于控制loading展示与否
					loading : false,
					THYY:'',//退回原因
					SFZW:false
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("外出申请");
                self.initWcsqPage();
                self.getWcsqList();
            },
            activated: function() {

			},
			filters: {
            	autoPhoto: function(settingInfo) {
            		var url = settingInfo.XSZPURL.fileUrl;
            		if(url) {
            			return url;
            		}
//            		self.settingInfo
            		var defImage = contextPath + "/sys/swpubapp/userinfo/getUserPhoto.do?USERID=" + settingInfo.XSBH;
                	return defImage;
                }
            },
            methods: {
            	initWcsqPage:function(){
            		var self = this;
            		//查询提示信息
            		MOB_UTIL.doPost({ url: api.queryWcsqPageInfo, params: {} }).done(function(result) {
            			if(result.code == '0'){
            				self.settingInfo = {};
            				self.settingInfo = result.data;
            				self.THYY = result.data.THYY || result.data.SHYJ; 
            			
            				if(!self.settingInfo.SFKWC){
            					self.showPage = "0";
            				}else{
            					//可申请或已申请
            					if(self.settingInfo.SFSQ){
            						if(!self.settingInfo.SHZT){
            							self.showPage = "1";
            						}else if(self.settingInfo.SHZT == 0){
            							self.showPage = "1";
            							Vue.set(self.formValue, 'SQBM',self.settingInfo.SQBM);
            							Vue.set(self.formValue, 'YJWCSJ',self.settingInfo.YJWCSJ);
            							Vue.set(self.formValue, 'YJFHSJ',self.settingInfo.YJFHSJ);
            							Vue.set(self.formValue, 'MDD',self.settingInfo.MDD);
            							Vue.set(self.formValue, 'WCYY',self.settingInfo.WCYY);
            							Vue.set(self.formValue, 'WCYYLB',self.settingInfo.WCYYLB);
            						}else if(self.settingInfo.SHZT > 0 && self.settingInfo.SHZT < 99){
            							self.showPage = "2";
            							self.applyDetailShzt = self.settingInfo.SHZT;
                						self.applyDetailThzt = self.settingInfo.SHZT;
                						self.applyDetailSqsj = self.settingInfo.SQSJ;
                						MOB_UTIL.doPost({ url: api.queryWcsqShlcInfo, params: {"YWZJ": self.settingInfo.SQBM,"XSLBDM": self.settingInfo.XSLBDM} }).done(function(result) {
                							if(result.code == '0'){
                								self.applyProcessDatas = result.data || [];
                							}else{
                								mintUI.Toast({message: result.message});
                							}
                						});
            						}else if(self.settingInfo.SHZT == 99){
            							self.showPage = "3";
            							var color = "";
            						}else if(self.settingInfo.SHZT < 0){
            							self.showPage = "4";
            							self.applyDetailShzt = self.settingInfo.SHZT;
                						self.applyDetailThzt = self.settingInfo.SHZT;
                						self.applyDetailSqsj = self.settingInfo.SQSJ;
                						MOB_UTIL.doPost({ url: api.queryWcsqShlcInfo, params: {"YWZJ": self.settingInfo.SQBM,"XSLBDM": self.settingInfo.XSLBDM} }).done(function(result) {
                							if(result.code == '0'){
                								self.applyProcessDatas = result.data || [];
                							}else{
                								mintUI.Toast({message: result.message});
                							}
                						});
            						}
            					}else{
            						self.SFZW = true;
            						//填写申请页面
            						self.showPage = "3";
            					}
            				}
            				self.dataReady = true;
            			}else{
							mintUI.Toast({message: result.message});
						}
            		});
            	},
            	
            	//保存申请
            	applyWcsq:function(){
            		var self = this;
            		if (!self.$refs.wcsqform.validate()) {
                        return false;
                    }
            		//学生自己申请的外出，只能最长填写一周时间
            		var starttime = (new Date(Date.parse(self.formValue.YJWCSJ))).getTime();
            		var endtime = (new Date(Date.parse(self.formValue.YJFHSJ))).getTime();
            		var weektime = 7*24*60*60*1000;
            		var datadiff = endtime-starttime;
//            		if(datadiff>weektime){
//            			mintUI.Toast({
//                            message: '外出申请时间不能超过一周！',
//                            iconClass: 'iconfont mint-icon-i icon-chenggong'
//                        });
//            			return false;
//            		}
            		self.formValue.SQBM = self.formValue.SQBM || self.settingInfo.UUID;
            		MOB_UTIL.doPost({ url: api.saveWcsqApply, params: self.formValue }).done(function(result) {
            			if(result.code == '0'){
            				 mintUI.Toast({
                                 message: '提交成功！',
                                 iconClass: 'iconfont mint-icon-i icon-chenggong'
                             });
            				//刷新页面
            				self.initWcsqPage();
            				self.reloadPage();
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	//撤回
            	recallWcsqApply:function(){
            		var self = this;
            		MOB_UTIL.doPost({ url: api.recallWcsqApply, params: {SQBM:self.settingInfo.SQBM} }).done(function(result) {
            			if(result.code == '0'){
            				//刷新页面
            				self.initWcsqPage();
            				self.reloadPage();
						}else{
							mintUI.Toast({message: result.message});
						}
					});
            	},
            	
            	//重新申请
            	toReapply:function(){
            		var self = this;
            		self.formValue = {};
            		self.showPage = "1";
            	},
            	
            	//格式化时间
                formatNum:function(n){
                    return n < 10 ?'0'+n :n;
                },
                
                //倒计时函数
                autoDjs:function(startTime,endTime){
                	var self = this;
                	if(self.nIntervId){ //防止被多次打开 生成多个定时器
		    			return;
		    		}
                	self.start = startTime; 
                	self.nIntervId = setInterval(function(){
                        //当前时间
                        var startTime = self.start;
                        //结束时间
//                        var endTime =  new Date('2017/12/24 24:00:00');
                        //算出中间差，以毫秒数返回.
                        var countDown = endTime-startTime;
                        if(countDown == 0){
                			clearInterval(self.nIntervId);
                			$("#wcsq_school_code").html("");
                			self.initWcsqPage();
                		}
                        //获取天数
                        var oDay = parseInt(countDown/1000/60/60/24);
                        //获取小时数
                        var oHour = parseInt(countDown/1000/60/60%24);
                        //获取分钟数
                        var oMinute = parseInt(countDown/1000/60%60);
                        //获取秒数
                        var oSecond = parseInt(countDown/1000%60);
                        //输出时间
                        self.autotext = oDay+ '天 '+self.formatNum(oHour)+':'+self.formatNum(oMinute)+':'+self.formatNum(oSecond);
                        
                        self.start = startTime +1000;
                    },1000) ;
                },
                
                //初始化学生外出申请列表
                getWcsqList:function(){
					var self = this;
					self.loading = true;
					var param = {
						pageNumber : self.pageNumber,
						pageSize : self.pageSize
					};
					MOB_UTIL.doPost({
						url : api.getWcsqList,
						params : param
					}).done(function(result) {
						self.loadMore = true;
						if (result.data.length < self.pageSize) {
							self.loadMore = false;
						}
						for (var i = 0; i < result.data.length; i++) {
							self.WCSQ_LIST.push(result.data[i]);
						}

						if (self.WCSQ_LIST.length == 0) {
							self.hasWcsqData = false;
						} else {
							self.hasWcsqData = true;
						}

						self.loading = false;
						self.showList = true;
					});
				},
				// 重新加载页面
				reloadPage : function() {
					var self = this;
					self.loadMore = false;
					self.hasWcsqData = false;
					self.pageNumber = 1;
					self.WCSQ_LIST = [];
					self.getWcsqList();
				},
				// 加载更多咨询信息
				loadMoreData : function() {
					var self = this;
					if (self.loadMore) {
						self.pageNumber += 1;
						self.getWcsqList();
					}
				}
            	
            }
        };
        return page;
    };

});