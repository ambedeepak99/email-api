/**
 * This file is used to generate custom directive to perform some oprtaion with dom element with class ,attribute and element.
 * @author Prathamesh Parab
 */
app.directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}:{point.y} <b>({point.percentage:.1f}%)</b>'
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [
                    {
                        name: scope.title,
                        colorByPoint: true,
                        data: scope.data
                    }
                ]
            });
        }
    };
});

app.directive('clientAutoComplete', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            attrs.autocomplete({
                source: function (request, response) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.dataSource;
                    if (data) {
                        var result = $filter('filter')(data, {name: params});
                        angular.forEach(result, function (item) {
                            item['value'] = item['name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui) {
                    //force a digest cycle to update the views
                    scope.$apply(function () {
                        scope.setClientData(ui.item);
                    });
                }

            });
        }

    };
});


app.directive('hcColumnChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            axistitle: '=',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'column'
                },

                title: {
                    text: scope.title
                },
                subtitle: {
                    text: ''
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical'
                },

                xAxis: {
                    categories: scope.axistitle.xTitle,
                    labels: {
                        x: -10
                    }
                },

                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: scope.axistitle.yTitle
                    }
                },

                series: scope.data,

                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }
                    ]
                }
            });
        }
    };
});

