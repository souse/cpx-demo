define(function (require, exports, module) {	
    var numeral = require('numeral');
	var laydate = require('laydate'); 
	var Autocomplete = require('autocomplete');
	var Dialog = require('dialog');
	var Common = require('common');

	var $addMaterielList = $('#addMaterielList');

    var createpurchase = {
        init: function() {
        	var self = this;

            $('.mount, .otherSurplus').numeral({'scale': 2});

        	$.divselect("#approvePersonDiv", "#approvePerson");
        	$.divselect("#purchaseDepartmentDiv", "#purchaseDepartment");
        	var start = {
                elem: '#start',
                format: 'YYYY/MM/DD',
                min: laydate.prototype.now()
            };
            laydate(start);
            self.initAutocompleter();
            self.initPurchaseDes();
            Common.chooseOne();

            $('#subApprove').on('click', function() {
            	var $createPurchaseForm = $('#createPurchaseForm');

            	var $approvePerson = $('#approvePerson'),
            		$purchaseDepartment = $('#purchaseDepartment'),
            		$star = $('#start'),
            		$purMsg = $('#purMsg');

            	if($approvePerson.val() == '') {
            		self.showTips($approvePerson.data('msg'));
            		return false;
            	}
            	if($purchaseDepartment.val() == '') {
            		self.showTips($purchaseDepartment.data('msg'));
            		return false;
            	}
            	if($star.val() == '') {
            		self.showTips($star.data('msg'));
            		return false;
            	}
            	if($addMaterielList.children().length <= 0) {
            		self.showTips($addMaterielList.data('msg'));
            		return false;		
            	}
                if(!self.checkMaterialDes()) { return false; } // 校验购买物料的信息
                Common.showTips('是否确认提交', function() {
                    Common.cpxAjax({
                        url: '/web/expense/launchPurchaseRequisition',
                        type:'POST',
                        parms: $createPurchaseForm.serialize(),
                        successfn: function(data) {
                            window.location.href = '/web/expense/mypurchase';
                        }               
                    });    
                });
            });
        },
        initPurchaseDes: function() {
        	var self = this;
        	var pDHandlebar = require('./templates/pucchasedes.handlebars');

        	$('#addMaterielBtn').on('click', function() {
        		if(!self.checkMaterialDes()) { return false; }
        		$addMaterielList.append(pDHandlebar());
        		self.initAutocompleter();
            });
        	$('body').on('click', '.del', function() {
        		$(this).parents('tr').remove();
        	});
        },
        checkMaterialDes: function() {
        	var self = this;
        	var $trs = $addMaterielList.find('tr');
        	var desFlag = true;


        	$.each($trs, function(index, tr) {
        		var $tr = $(tr);
        		var $mQuery = $tr.find('.mQuery'), 
                    $fQuery = $tr.find('.fQuery'), 
                    $mount = $tr.find('.mount'), 
                    $total = $tr.find('.total'),
                    $otherSurplus = $tr.find('.otherSurplus');

        		if($fQuery.val() == '') {
        			self.showTips('请填写第'+(index+1)+'条物料信息');
        			desFlag = false;
        			return false;	
        		}
        		if($mQuery.length > 0) {
        			self.showTips('请正确填写第'+(index+1)+'条物料信息');
        			desFlag = false;
        			return false;	
        		}
        		if($mount.val() == '' && $otherSurplus.val() == '') {
        			self.showTips('请填写第'+(index+1)+'条需求数量或辅单位数量');
        			desFlag = false;
        			return false;
        		}
        		// if($mount.val() > $total.text()) {
        		// 	self.showTips('第'+(index+1)+'条中，需求数量不能大于库存总数量');
        		// 	desFlag = false;
        		// 	return false;
        		// }
        	});
        	
        	return desFlag;
        },
        showTips: function(txt) {
			new dialog({
				width: 300,
				title: '提示信息',
				content: txt,
				button: [ {value: '确定'} ]	
			}).show();
		},
        initAutocompleter: function() {
        	var self = this;

        	$('.fQuery').autocompleter({
		        highlightMatches: true,
		        source: window.serverRoot+'/web/material/getMaterialListByQuery',
		        hint: true,
		        empty: false,
		        limit: 10000,
		        template: '{{ name }} &nbsp;<span>{{ id }}</span>',
		        callback: function (value, index, selected) {
		        	var $this = $(this),
		        		$preTd = $this.parents('td'),
		        		$preTr = $this.parents('tr');

		        	$preTd.remove();
		        	$preTr.prepend('<td class="col-1">'+selected.id+'</td><td class="col-2">'+selected.name+'</td><td class="col-3">'+selected.specification+'</td>');
		        	$preTr.find('td.total').text(selected.total || 80);
		        	$preTr.find('input.id').val(selected.id);
		        	$preTr.find('td.unitName').text(selected.unitName);
                    $preTr.find('input.price').val(selected.price);
                    $preTr.find('input.firstCategory').val(selected.firstCategory);
                    $preTr.find('input.unitName').val(selected.unitName);
                    $preTr.find('input.label').val(selected.label);
                    //辅单位
                    if(selected.otherUnitId != '0') {
                        var ohtm =  '<div class="otherunit">' +
                                        '<input type="text" class="otherSurplus" name="otherSurplus[]">' +
                                        '<span></span>' +
                                    '</div>'+
                                    '<input type="hidden" class="otherUnitName" name="otherUnitName[]">';
                        
                        $preTr.find('.tdotherunit').append(ohtm);
                        $preTr.find('.otherSurplus').numeral({'scale': 2});
                        $preTr.find('input.otherUnitName').val(selected.otherUnitName);
                        $preTr.find('td.tdotherunit span').text(selected.otherUnitName);
                    }else{
                        $preTr.find('.tdotherunit').append('<input type="hidden" class="otherSurplus" name="otherSurplus[]"><input type="hidden" class="otherUnitName" name="otherUnitName[]">');
                    }
		        }
		    });
        }  
    };
	
	exports.init = function() {
		createpurchase.init();		
	};
});