/**
 * This file is used to generate custome filter
 * @author Prathamesh Parab
 */

app.filter('filterMultipleForOrder', ['$filter', function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data: items,
            filteredData: [],
            applyCustomFilter: applyCustomFilter
        };

        function applyCustomFilter(keyObj, data) {
            var myFilterData = [];
            var customCondition = {
                searchText: true,
                orderStatus: true,
                multipleOrderStatus: true,
                outlet: true,
                subarea: true,
                clientPlatform: true,
                deliveryProvider: true,
                dineinStatus: true
            };
            if (data && data.length) {
                angular.forEach(data, function (order, index) {
                    if (keyObj.orderStatus && order.order_status && order.order_status.status)
                        customCondition.orderStatus = (order.order_status.status.toLowerCase() === keyObj.orderStatus.toLowerCase());

                    if (keyObj.multipleOrderStatus && order.order_status && order.order_status.status)
                        customCondition.multipleOrderStatus = (keyObj.multipleOrderStatus.toLowerCase().indexOf(order.order_status.status.toLowerCase()) > -1);

                    if (keyObj.clientPlatform && order.client_platform)
                        customCondition.clientPlatform = (order.client_platform.toLowerCase().indexOf(keyObj.clientPlatform.old_name.toLowerCase()) > -1);

                    if (keyObj.outlet && order.outlet && order.outlet.name)
                        customCondition.outlet = (order.outlet.name.toLowerCase().indexOf(keyObj.outlet.name.toLowerCase()) > -1);

                    if (keyObj.subarea && order.user && order.user.address) {
                        if (order.user.address.subarea_name)
                            customCondition.subarea = (order.user.address.subarea_name.toLowerCase().indexOf(keyObj.subarea.toLowerCase()) > -1);
                        else if (order.user.address.area_name)
                            customCondition.subarea = (order.user.address.area_name.toLowerCase().indexOf(keyObj.subarea.toLowerCase()) > -1);
                    }
                    if (keyObj.deliveryProvider && order.delivery_provider)
                        customCondition.deliveryProvider = (order.delivery_provider.toLowerCase().indexOf(keyObj.deliveryProvider.toLowerCase()) > -1);

                    if (keyObj.dineinStatus && order.reservation_status)
                        customCondition.dineinStatus = (order.reservation_status.toLowerCase() === keyObj.dineinStatus.toLowerCase());

                    if (keyObj.searchText)
                        customCondition.searchText = (JSON.stringify(order).toLowerCase().indexOf(keyObj.searchText.toLowerCase()) > -1);

                    if (customCondition.orderStatus &&
                        customCondition.outlet &&
                        customCondition.subarea &&
                        customCondition.clientPlatform &&
                        customCondition.searchText &&
                        customCondition.multipleOrderStatus &&
                        customCondition.deliveryProvider &&
                        customCondition.dineinStatus) {
                        myFilterData.push(order);
                    }
                });
            }
            return myFilterData;
        };

        if (keyObj)
            filterObj.filteredData = filterObj.applyCustomFilter(keyObj, filterObj.data);

        return filterObj.filteredData;
    }
}]);

app.filter('unique', function () {
    return function (items, filterOn) {
        if (filterOn === false) {
            return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

app.filter('zpad', function () {
    return function (input, n) {
        if (input === undefined)
            input = ""
        if (input.length >= n)
            return input
        var zeros = "0".repeat(n);
        return (zeros + input).slice(-1 * n)
    };
});

app.filter('getTotal', function () {
    return function (inputArray, additionValue, multiplyer) {
        var total = 0;
        if (inputArray !== undefined && inputArray.length >= 1)
            for (var i = 0; i < inputArray.length; i++)
                if (multiplyer !== undefined)
                    total = total + (inputArray[i][additionValue] * inputArray[i][multiplyer]);
                else
                    total = total + inputArray[i][additionValue];
        return total;
    };
});
app.filter('timeSpanStringToDate', function () {
    return function (timeSpan, customDateString) {
        if (timeSpan) {
            var current_time = new Date();
            if (customDateString) {
                current_time = Date.parse(customDateString);
            }
            var myDate = new Date(current_time.toLocaleDateString() + " " + timeSpan);
            return myDate;
        }
        else {
            return timeSpan;
        }
    };
});
