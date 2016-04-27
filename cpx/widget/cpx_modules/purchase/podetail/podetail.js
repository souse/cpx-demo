define(function (require, exports, module) {
    var Common = require('common');
    var Dialog = require('dialog');

    var revocationUrl = '/web/expense/ajaxOperatorReimbursement';

    var podetail = {
        init: function () {
            $('#subApprove, #revocation').on('click', function () {
                var $this = $(this),
                        id = $this.data('id'), type = $this.data('type');

                if (type == '0') {
                    Common.showTips('是否确认撤销', function () {
                        Common.cpxAjax({
                            url: revocationUrl,
                            type: 'POST',
                            parms: {reimNumber: id, operatorType: 4},
                            successfn: function (data) {
                                window.location.reload();
                            }
                        });
                    });
                    return false;
                }
                window.location.href = '/web/expense/createpurchase?expenseSn=' + id;
            });
        }
    };

    exports.init = function () {
        podetail.init();
    };
});