define(function(require, exports, module) {
    var tpl = require('text!modules/fxsq/view/viewFxsq.html');
    var api = require('api');

    return function() {
        var page = {
            template: tpl,
            data: function() {
                return {
                	model: WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsfxsqbdx", "form"),
                	fxsqValue:{},
                	customVm: {},
                	readonly:true,
                	settingInfo:{},
                	openFlag:false,
                	type:"",
                	 //申请详情数据当前状态
                    applyDetailShzt: "",
                    //申请详情流程arr
                    applyProcessDatas: [],
                    //申请详情数据申请时间
                    applyDetailSqsj: "",
                    //申请详情数据退回状态
                    applyDetailThzt: "",
                    //是否可撤回
                    applyDetailSfkch: false,
                    noDays:0,
                    jkdays:0,
                    JKZM_FLAG:false,
                    sfyjxdet:true
                };
            },
            created: function() {
            	var self = this;
                SDK.setTitleText("返校疫情管理");
                self.type = self.$route.query.type || "";
                if(self.type == 2){
                	self.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsyqfxsqbd", "form2");
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
            				self.$refs.form.hideItem('BRYZM');
            				self.$refs.form.hideItem('LXRYZM');
            				if(self.fxsqValue.SFYJXDRT && self.fxsqValue.SFYJXDRT== '1'){//判断是否已进校第二天
            					self.sfyjxdet = false;
            				}
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
            	
            	//展开收起
            	openHeader:function(){
            		this.openFlag = !this.openFlag;
            	},
            	
            	/**
            	 * 健康档案
            	 */
            	toJkda:function(){
            		var self = this;
            		self.$router.push({ name: 'viewjkda', query: {} });
            	},
            	
            	/**
            	 * 返校行程
            	 */
            	toFxxc:function(){
            		var self = this;
            		self.$router.push({ name: 'viewfxxc', query: {} });
            	},
            	
            	/**
            	 * 居旅轨迹
            	 */
            	toJlgj:function(){
            		var self = this;
            		self.$router.push({ name: 'viewjlgj', query: {} });
            	},
            	
            	/**
            	 * 查看承诺书
            	 */
            	lookCns:function(){
            		var self = this;
            		self.$router.push({ name: 'viewcns', query: {} });
            	}
            	
            }
        };
        return page;
    };

});