define(function (require, exports, module) {	
	var laydate = require('laydate');
	var pagiNation = require('pagination');
    var Common = require('common');

    var $approveType = $('#approveType'), 
        $purchaseList = $('#purchaseList'),
        $purchasePagingControl = $('#purchasePagingControl');
    var pTHandlbar = require('./templates/purchasetable.handlebars');

	var mypurchase = {
        init: function() {
            var self = this;

        	$.divselect("#approveTypeDiv", "#approveType", self.changeApproveType);
            $.divselect("#purchaseDepartmentDiv", "#purchaseDepartment");

            window.document.onkeydown = function(event) {
                Common.enterKeyDownFn(event, $('#searchPurchase'));
            }
            self.initPurchaseTable();
            //日历====================
            var start = {
                elem: '#start',
                format: 'YYYY/MM/DD',
                min: '2015-10-01',
                max: '2099-06-16',
                choose: function(datas){
                     end.min = datas; //开始日选好后，重置结束日的最小日期
                     //end.start = datas //将结束日的初始值设定为开始日
                }
            };
            var end = {
                elem: '#end',
                format: 'YYYY/MM/DD',
                max: '2099-06-16',
                choose: function(datas){
                    start.max = datas; //结束日选好后，重置开始日的最大日期
                }
            };
            laydate(start);
            laydate(end);
            $('#searchPurchase').on('click', function() {
                self.initPurchaseTable();    
            });	    
        },
        changeApproveType: function(val) {
            //$('#orderId, #materielNameOrNo, #purchaseDepartment, #start, #end').val('');
            //$('#purchaseDepartment').next().html('');
            mypurchase.initPurchaseTable();
        },
        initPurchaseTable: function() {
            var self = this;
            var requestData = self.getSearchData();

            Common.cpxAjax({
                url: '/web/expense/ajaxGetPurchaseList',
                parms: requestData,
                successfn: function(data) {
                    $purchasePagingControl.html('');
                    if(data.totalPages == 0) {
                        $purchaseList.html('<tr><td colspan="8" class="no-datas">暂无数据</td></tr>');
                        return false;
                    }
                    $purchaseList.html(pTHandlbar(data));
                    if(data.totalPages > 1) {
                        self.pagination(data);
                    }               
                }               
            });
        },
        pagination: function(parms) {
            var self = this;
            var options = {
                totalPages: parms.totalPages,   
                onPageClicked: function(event, originalEvent, type, page) {
                    var requestData = self.getSearchData();

                    requestData.currentPage = page;
                    Common.cpxAjax({
                        url: '/purchase/ajaxGetPurchaseList',
                        parms: requestData,
                        successfn: function(data) {
                            $purchaseList.html(pTHandlbar(data));
                        }               
                    });                                    
                } 
            };
            $purchasePagingControl.bootstrapPaginator(options);
        },
        getSearchData: function() {
            return {
                approveType: $approveType.val(),
                orderId: $('#orderId').val(),
                materielNameOrNo: $('#materielNameOrNo').val(),
                purchaseDepartment: $('#purchaseDepartment').val(),
                start: $('#start').val(),
                end: $('#end').val()    
            };
        }
    };

	exports.init = function() {
		mypurchase.init();		
	};
});