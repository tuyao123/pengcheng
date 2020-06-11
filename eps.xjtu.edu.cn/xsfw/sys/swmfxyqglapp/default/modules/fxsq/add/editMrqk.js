define(function(require, exports, module) {
	var tpl = require('text!modules/fxsq/add/editMrqk.html');
	var api = require('api');

	return function() {
		var page = {
			template: tpl,
			data: function() {
				return {
					RQ: '',					
					model : this.getModel(),
					model2 : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjkdamrqkbd", "form2"),
					model3 : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjkdamrqktwycbd", "form3"),
					zpdataReady:false,
                	imglist:[],
                	zptoken:'',
					readonly:false,
					formValue:{},
					sffrhks:0,
					sfqcjchb:0,
					sfjcqz:0,
					sfqzhys:0,
					sfbgl:0,
					showPage:false,
					modelFlag:"2",//1.只读  2.补填  3.误报体温
					jkzm:""
				};

			},
			
			created: function() {
				SDK.setTitleText("健康档案单");
				var self = this;
				self.RQ = self.$route.query.RQ;
				self.jkzm = self.$route.query.jkzm;
				self.queryMrqkInfo();	
			},			

			methods: {			
				getModel:function(){
					var model = WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjkdamrqkbd", "form");
					if(sftoon){
						for(var index in model){
	            			if(model[index].name == "JKZM"){
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
					api.UploadImg(self.zptoken,"3",function(result){
						self.zptoken = result.data.tokenId;
						self.getsqImageSrc(self.zptoken);
						Vue.set(self.formValue, 'JKZM',self.zptoken);
					});
				},
				
				//删除照片
				delUploadImg:function(tokenwid){
					var self = this;
					if(this.imglist.length == 1){
						mintUI.Toast('健康证明不能为空！');
                        return;
					}
					api.delUploadImg(tokenwid,function(){
						self.getsqImageSrc(self.zptoken);
						if(self.imglist.length == 0){
	    					Vue.set(self.formValue, 'JKZM',"");
						}
					});
				},
				//申请信息
				queryMrqkInfo: function(){
					var self = this;
					MOB_UTIL.doPost({
						url: api.queryMrqkInfo,
						params: {TBSJ:self.RQ}
					}).done(function(result) {
						self.formValue = result.data || {};
						if(!$.isEmptyObject(self.formValue)){
							var regex = /^3[3-9](\.\d+)?$|^40(\.\d+)?$|^41(\.0+)?$/;
							var tw = self.formValue.TW + "";
		            		if (!tw.match(regex)) {
								self.modelFlag = "3";
								if(self.formValue.SFFRHKS == "1"){
		        					self.$refs.form3.showItem('SFFRHKSQKSM');
		        				}
								if(self.formValue.SFQZHYS == "1"){
		        					self.$refs.form3.showItem('SFQZHYSQKSM');
		        				}
								if(self.formValue.SFQGJCHB == "1"){
		        					self.$refs.form3.showItem('SFQGJCHBSQKSM');
		        				}
								if(self.formValue.SFJCQZ == "1"){
		        					self.$refs.form3.showItem('SFJCQZQKSM');
		        				}
								if(self.formValue.SFBGL == "1"){
		        					self.$refs.form3.showItem('SFBGLQKSM');
		        				}
							}else{
								var jkzm = self.formValue.JKZM;
								if(!jkzm) {
									
									self.readonly = true;
									self.modelFlag = "1";
									if(self.formValue.SFFRHKS == "1"){
										self.model2[3].hidden = false;
									}
									if(self.formValue.SFQZHYS == "1"){
										self.model2[9].hidden = false;
									}
									if(self.formValue.SFQGJCHB == "1"){
										self.model2[5].hidden = false;
									}
									if(self.formValue.SFJCQZ == "1"){
										self.model2[7].hidden = false;
									}
									if(self.formValue.SFBGL == "1"){
										self.model2[11].hidden = false;
									}
								}
							}
						}
						if(sftoon && self.formValue.JKZM){
        					self.zptoken = self.formValue.JKZM;
        					self.getsqImageSrc(self.zptoken);
        				}
        				self.zpdataReady = true;
						if(!self.formValue.TBSJ || self.formValue.TBSJ == ""){
							self.formValue.TBSJ = self.RQ;
						}
						self.formValue.SFFRHKS = self.formValue.SFFRHKS || "0";
						self.formValue.SFQZHYS = self.formValue.SFQZHYS || "0";
						self.formValue.SFQGJCHB = self.formValue.SFQGJCHB || "0";
						self.formValue.SFJCQZ = self.formValue.SFJCQZ || "0";
						self.formValue.SFBGL = self.formValue.SFBGL || "0";
						self.sffrhks = Number(self.formValue.SFFRHKS);
						self.sfqcjchb =Number( self.formValue.SFQGJCHB);
						self.sfjcqz = Number(self.formValue.SFJCQZ);
						self.sfqzhys = Number(self.formValue.SFQZHYS);
						self.sfbgl = Number(self.formValue.SFBGL);
						
						self.showPage=true;
					});
				},
				
				handleChange1:function(){
					var self = this;
					if (self.sffrhks == 1) {
						self.$refs.form.showItem('SFFRHKSQKSM');
					} else {
						self.$refs.form.hideItem('SFFRHKSQKSM');
					}
				},
				handleChange2:function(){
					var self = this;
					if (self.sfqcjchb == 1) {
						self.$refs.form.showItem('SFQGJCHBSQKSM');
					} else {
						self.$refs.form.hideItem('SFQGJCHBSQKSM');
					}
				},
				handleChange3:function(){
					var self = this;
					if (self.sfjcqz == 1) {
						self.$refs.form.showItem('SFJCQZQKSM');
					} else {
						self.$refs.form.hideItem('SFJCQZQKSM');
					}
				},
				handleChange4:function(){
					var self = this;
					if (self.sfqzhys == 1) {
						self.$refs.form.showItem('SFQZHYSQKSM');
					} else {
						self.$refs.form.hideItem('SFQZHYSQKSM');
					}
				},
				handleChange5:function(){
					var self = this;
					if (self.sfbgl == 1) {
						self.$refs.form.showItem('SFBGLQKSM');
					} else {
						self.$refs.form.hideItem('SFBGLQKSM');
					}
				},
				
				/**
				 * 提交
				 */
				sureMrqk:function(){
					var self = this;
					if(self.modelFlag == "1" || self.modelFlag == "2"){
						if (!self.$refs.form.validate()) {
	                        return false;
	                    }
					}else if(self.modelFlag == "3"){
						var tw =self.formValue.TW;
	            		var regex = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
	            		if (!tw.match(regex)) {
	            			mintUI.Toast({message: "请录入正确的体温！"});
	            		    return false;
	            		}
					}
					if(self.formValue.TW < 33 || self.formValue.TW > 41){
						mintUI.Toast({message: "请填写体温在33度到41度之间！"});
						return false;
					}
					if(self.modelFlag == "3" || self.modelFlag == "2"){
						if(self.jkzm == ""){
							mintUI.MessageBox.alert('请先提交健康证明！').then(function(){
								self.$router.go(-1);
							});
							return false;
						}else{
							//校验健康证明
		            		var arr = api.getXcjcImageArraySrc(self.jkzm) || [];
		            		if(arr.length == 0){
		            			mintUI.MessageBox.alert('请先提交健康证明！').then(function(){
									self.$router.go(-1);
								});
		        				return false;
		            		}
						}
					}
					if(self.modelFlag == "3" || self.modelFlag == "2"){
						self.formValue.JKZM = '1';
					}
					self.formValue.SFQGJCHB = self.sfqcjchb;
					self.formValue.SFJCQZ = self.sfjcqz;
					self.formValue.SFFRHKS = self.sffrhks;
					self.formValue.SFQZHYS = self.sfqzhys;
					self.formValue.SFBGL = self.sfbgl;
					MOB_UTIL.doPost({ url: api.saveMrqkInfo, params: self.formValue }).done(function(result) {
            			if(result.code == '0'){
            				self.$router.go(-1);
            				//self.$router.replace({ name: 'jkda', query: {}});
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