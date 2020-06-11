define(function(require, exports, module) {
	var tpl = require('text!modules/fxsq/add/fxxc.html');
	var api = require('api');

	return function() {
		var page = {
			template: tpl,
			data: function() {
				return {
					RYBH: '',					
					fxxcModel : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxsxcxx", "fxxcform"),     
					//xcxxModel:WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxcxxbd", "xcxxform"),
					//sxryModel : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxsxrybdxx", "sxryform"),  
					jtpjModel : this.getModel(),
					zpdataReady:false,
                	imglist:[],
                	zptoken:'',
					fxhbcxxModel : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxfxhbcxx", "form"),
                    formValue: {}, //申请信息
                    //随行人员
                    sxryArr:[],
                    //行程信息
                    xcxxArr:[],
                    readonly:false,
                    options:[],
                    jtfsMap:{},
                    jtfs:'',
                    scroll : 0,
                    showPage:false
				};

			},
			
			created: function() {
				SDK.setTitleText("返校行程报告单");
				var self = this;
				self.queryFxxcInfo();	
				self.queryXgzd();
			},		
			
			methods: {
				getModel:function(){
					var model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjtpjxx", "form");
					if(sftoon){
						for(var index in model){
	            			if(model[index].name == "JTPJ"){
	            				model[index]["xtype"] = "text";
	            			}
	            		}
					}
					return model;
				},
				//获取图片列表
            	getsqImageSrc : function(token) {
            		this.imglist = api.getXcjcImageArraySrc(token);
            	},
            	
            	//上传照片
            	onUploadImg:function(e){
            		var self = this;
					api.UploadImg(self.zptoken,"2",function(result){
						self.zptoken = result.data.tokenId;
						self.getsqImageSrc(self.zptoken);
						Vue.set(self.formValue, 'JTPJ',self.zptoken);
					});
				},
				
				//删除照片
				delUploadImg:function(tokenwid){
					var self = this;
					api.delUploadImg(tokenwid,function(){
						self.getsqImageSrc(self.zptoken);
						if(self.imglist.length == 0){
	    					Vue.set(self.formValue, 'JTPJ',"");
						}
					});
				},
				//申请信息
				queryFxxcInfo: function(){
					var self = this;
					MOB_UTIL.doPost({
						url: api.queryFxxcInfo,
						params: {
						}
					}).done(function(result) {
						self.formValue = result.data.SQXX || {};
						self.formValue.SXRS = self.formValue.SXRS || '0';
						self.formValue.DJXLS = self.formValue.DJXLS || '1';
						if(sftoon && self.formValue.JTPJ){
        					self.zptoken = self.formValue.JTPJ;
        					self.getsqImageSrc(self.zptoken);
        				}
        				self.zpdataReady = true;
						self.formValue.SFTJZDFKYQ = self.formValue.SFTJZDFKYQ ||'0';
						self.formValue.FXJTJYSFZX = self.formValue.FXJTJYSFZX ||'0';
						self.sxryArr = result.data.SXRY || [];
						self.xcxxArr = result.data.XCXX || [];
						$.each(self.sxryArr,function(index,item){
							item.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxsxrybdxx", "sxryform"+item.WID);
							item.form = "sxryform"+item.WID;
						});
						$.each(self.xcxxArr,function(index,item){
							item.model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxcxxbd", "xcxxform"+item.WID);
							item.form = "xcxxform"+item.WID;
							if(item.JTFS == '1' || item.JTFS == '2' || item.JTFS == '3'){
							}else{
								item.model[5].hidden = true;
								item.model[6].hidden = true;
							}
						});
						$("#app").scrollTop(0);
						self.showPage = true;
					});
				},
				
            	queryXgzd : function() {
					var self = this;
					// 查询返校方式
					MOB_UTIL.doPost({
						url : api.queryDict,
						params : {
							TYPE : "FXYQ_JTFS"
						}
					}).done(function(result) {
						if (result.code == '0') {
							if (result.data && result.data.length > 0) {
								$.each(result.data, function(i, item) {
									self.options.push({
										id : item.VALUE,
										name : item.DISPLAYVALUE
									});
								});
							}
						} else {
							mintUI.Toast({
								message : result.message
							});
						}
					});
				},
				
				selectJtfs: function(wid) {
					var self = this;
					self.scroll = $("#app").scrollTop();
                    //展示子组件
					self.$router.push({ name: 'fxxc', query: { isSelect: '1',WID:wid,scroll:self.scroll} });
                },
                
                gotoParent:function(rtnParam){
					var self = this;
					$.each(self.xcxxArr,function(index,item){
						if(item.WID == rtnParam.wid){
							item.JTFS = rtnParam.id;
							item.JTFS_DISPLAY = rtnParam.name;
							if(item.JTFS == '1' || item.JTFS == '2' || item.JTFS == '3'){
								self.$refs[item.form][0].showItem('CCHBH');
								self.$refs[item.form][0].showItem('CXZWH');
							}else{
								self.$refs[item.form][0].hideItem('CCHBH');
								self.$refs[item.form][0].hideItem('CXZWH');
								item.CCHBH = "";
								item.CXZWH = "";
							}
						}
					});
					self.scroll = rtnParam.scroll;
					MOB_UTIL.doPost({
						url : api.queryDict,
						params : {
							TYPE : "FXYQ_JTFS"
						}
					}).done(function(result) {
						if (result.code == '0') {
							$("#app").scrollTop(self.scroll);
						} else {
							mintUI.Toast({
								message : result.message
							});
						}
					});
				},
				
				addSxry:function(){
					var self = this;
					var guid = (new Date).getTime();
					self.sxryArr.push({WID:guid,
									   model:WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxsxrybdxx", "sxryform"+guid),
									   form:"sxryform"+guid});
				},
				
				delSxry:function(wid){
					var self = this;
					$.each(self.sxryArr,function(index,item){
						if(item.WID == wid){
							self.sxryArr.splice(index, 1);
							return false;
						}
					});
				},
				
				addXcxx:function(){
					var self = this;
					var guid = (new Date).getTime();
					self.jtfsMap[guid] = '';
					self.xcxxArr.push({WID:guid,
						model:WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxxcxxbd", "xcxxform"+guid),
						form:"xcxxform"+guid});
				},
				
				delXcxx:function(wid){
					var self = this;
					$.each(self.xcxxArr,function(index,item){
						if(item.WID == wid){
							self.xcxxArr.splice(index, 1);
							return false;
						}
					});
				},
				
				/**
				 * 提交
				 */
				sureFxxc:function(){
					var self = this;
					if (!self.$refs.fxxcform.validate()) {
                        return false;
                    }
					var flag = false;
					$.each(self.sxryArr,function(index,item){
						if (!self.$refs[item.form][0].validate()) {
							flag = true;
	                        return false;
	                    }
					});
					$.each(self.xcxxArr,function(index,item){
						if (!self.$refs[item.form][0].validate()) {
							flag = true;
	                        return false;
	                    }
						if(item.CFDD.length < 2){
							flag = true;
							mintUI.Toast({message: "出发地点不少于两个字!"});
							return false;
						}
						if(item.DDDD.length < 2){
							flag = true;
							mintUI.Toast({message: "到达地点不少于两个字!"});
							return false;
						}
						
					});
					if(flag){
						return false;
					}
					
					//校验随行人数
					if(self.formValue.SXRS != self.sxryArr.length){
						mintUI.Toast({message: "添加的随行人员数目与随行人员不一致!"});
						return false;
					}
					
					if(self.xcxxArr.length == 0){
						mintUI.Toast({message: "请填写行程单!"});
						return false;
					}
					
					if(self.xcxxArr.length>0){
						if(self.xcxxArr[0].JTFS == '1' || self.xcxxArr[0].JTFS == '2' || 
								self.xcxxArr[self.xcxxArr.length-1].JTFS == '1' || self.xcxxArr[self.xcxxArr.length-1].JTFS == '2'){
							mintUI.Toast({message: "行程单的行程信息，第一行和最后一行，不允许选择火车飞机!"});
							return false;
						}
					}
					
					//校验行程补充信息时间
					if(self.formValue.JCHHCTLSD && self.formValue.JCHHCTLJSSJ && self.formValue.JCHHCTLSD > self.formValue.JCHHCTLJSSJ){
						mintUI.Toast({message: "机场或候车室停留开始时间不能大于结束时间!"});
						return false;
					}
					
					var param = {};
					param.SQXX = self.formValue;
					param.SXRY = self.sxryArr;
					param.XCXX = self.xcxxArr;
					MOB_UTIL.doPost({ url: api.saveReturnTrip, params: param }).done(function(result) {
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