exports.formatMoney = (value) => {
    if (value) {
        value = Number(value);
        return '￥ ' + value.toFixed(2);
    }
};

// 优先级过滤器
exports.getPriority = (value) => {
    let priority = '';
    switch (value) {
        case 1: {
            priority = '最低';
            break;
        }
        case 2: {
            priority = '默认';
            break;
        }
        case 3: {
            priority = '稍高';
            break;
        }
        case 4: {
            priority = '高';
            break;
        }
        case 5: {
            priority = '最高';
            break;
        }
    }
    return priority;
};

exports.statusName = (val) => {
    let statusName = '';
    switch (val) {
        case 0: {
            statusName = '已取消';
            break;
        }
        case 10: {
            statusName = '未付款';
            break;
        }
        case 20: {
            statusName = '已付款';
            break;
        }
    }
    return statusName;
};
