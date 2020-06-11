define(function(require, exports, module) {
	var tpl = require('text!modules/fxsq/view/vieweditMrqk.html');
	var api = require('api');

	return function() {
		var page = {
			template: tpl,
			data: function() {
				return {
					RQ: '',					
					model : WIS_EMAP_SERV.getModel("/modules/fxsq.do", "cxjkdamrqkbd", "form"),
					readonly:true,
					formValue:{}
				};
			},
			
			created: function() {
				SDK.setTitleText("健康档案单");
				var self = this;
				self.RQ = self.$route.query.RQ;
				self.queryMrqkInfo();	
			},			

			methods: {			
				//申请信息
				queryMrqkInfo: function(){
					var self = this;
					MOB_UTIL.doPost({
						url: api.queryMrqkInfo,
						params: {TBSJ:self.RQ}
					}).done(function(result) {
						self.formValue = result.data || {};
						if(!self.formValue.TBSJ || self.formValue.TBSJ == ""){
							self.formValue.TBSJ = self.RQ;
						}
						
						self.formValue.SFFRHKS = self.formValue.SFFRHKS || "0";
						self.formValue.SFQZHYS = self.formValue.SFQZHYS || "0";
						self.formValue.SFQGJCHB = self.formValue.SFQGJCHB || "0";
						self.formValue.SFJCQZ = self.formValue.SFJCQZ || "0";
						self.formValue.SFBGL = self.formValue.SFBGL || "0";
						if(self.formValue.SFFRHKS == "1"){
        					self.$refs.form.showItem('SFFRHKSQKSM');
        				}
						if(self.formValue.SFQZHYS == "1"){
        					self.$refs.form.showItem('SFQZHYSQKSM');
        				}
						if(self.formValue.SFQGJCHB == "1"){
        					self.$refs.form.showItem('SFQGJCHBSQKSM');
        				}
						if(self.formValue.SFJCQZ == "1"){
        					self.$refs.form.showItem('SFJCQZQKSM');
        				}
						if(self.formValue.SFBGL == "1"){
        					self.$refs.form.showItem('SFBGLQKSM');
        				}
						if(self.formValue.JKZM && self.formValue.JKZM != ""){
        					$("#editmrqk_view").find(".em-select-value").css("text-decoration","underline");
        				}
					});
				},
				
				/**
				 * 提交
				 */
				sureMrqk:function(){
					var self = this;
					//self.$router.replace({ name: 'viewjkda', query: {}});
					self.$router.go(-1);
				}
			}

		};
		return page;
	};

});