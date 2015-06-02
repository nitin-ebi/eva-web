/*
 * Copyright (c) 2014 Francisco Salavert (SGL-CIPF)
 * Copyright (c) 2014 Alejandro Alemán (SGL-CIPF)
 * Copyright (c) 2014 Ignacio Medina (EBI-EMBL)
 * Copyright (c) 2014 Jag Kandasamy (EBI-EMBL)
 *
 * This file is part of EVA.
 *
 * EVA is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * EVA is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EVA. If not, see <http://www.gnu.org/licenses/>.
 */
function EvaStatistics(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EVAStatistics");
    _.extend(this, args);
    this.rendered = false;
    this.render();


}

EvaStatistics.prototype = {
    render: function () {
        var _this = this;
        if(!this.rendered) {
           var el =  document.querySelector("#"+this.targetId);
           var evaStatDiv = '<div class="row"><div id="eva-statistics-chart-species" class="col-md-6"></div><div id="eva-statistics-chart-type" class="col-md-6"></div></div>'
           el.innerHTML = evaStatDiv;
            EvaManager.get({
                category: 'meta/studies',
                resource: 'stats',
//                        query:variantID,
                success: function (response) {
                    try {
                        var stats = response.response[0].result[0];
                    } catch (e) {
                        console.log(e);
                    }
                    _this._parseData(stats);
                }
            });


        }
    },
    _parseData: function (data) {
            var _this = this;
            var species_data  = data.species
            var type_data  = data.type
            var speciesArray=[];
            for (key in species_data) {
                speciesArray.push([key,  species_data[key]]);
            }
            var speciesChartData = {id:'eva-statistics-chart-species',title:'Species',chartData:speciesArray};
            _this._drawChart(speciesChartData)
            var typeArray=[];
            for (key in type_data) {
                // TODO We must take care of the types returned
                if(key.indexOf(',') == -1) {
                    typeArray.push([key,  type_data[key]]);
                }
            }
            var typeChartData = {id:'eva-statistics-chart-type',title:'Type',chartData:typeArray};
            _this._drawChart(typeChartData)


    },
    _drawChart: function (data) {
            var _this = this;
            var height = 250;
            var width = 200;
            if(data.id == 'eva-statistics-chart-type'){
                height = 285;
                width = 220;
            }else if(data.id == 'eva-statistics-chart-species'){
                data.chartData = data.chartData.slice(0, 5);
                height = 285;
                width = 230;
            }
            var id = '#'+data.id;
//                    var render_id = _this.shadowRoot.querySelector(id);
            var render_id = document.querySelector(id);
            var dataArray  = data.chartData;
            var title = data.title;
            $(function () {
                Highcharts.setOptions({
                    colors: ['#207A7A', '#2BA32B','#2E4988','#54BDBD', '#5DD15D','#6380C4', '#70BDBD', '#7CD17C','#7D92C4','#295C5C', '#377A37','#344366','#0A4F4F', '#0E6A0E','#0F2559' ],
                    chart: {
                        style: {
                            fontFamily: 'sans-serif;'
                        }
                    }
                });
                $(render_id).highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height: height,
                        width: width,
                        marginLeft:-50,
                        marginTop:50

                    },
                    legend: {
                        enabled: true,
                        width: 200,
                        margin: 0,
                        labelFormatter: function() {
                            return '<div>' + this.name + '('+ this.y + ')</div>';
                        },
                        layout:'vertical',
                        useHTML:true

                    },
                    title: {
                        text: 'Top 5 Studies <br> <span style="font-size:12px;">by '+title+'</span>',
                        style: {
//                                    display: 'none'
                        },
                        align: 'left'
                    },
//                            subtitle: {
//                                text: 'by ' + title,
//                                style: {
////                                    display: 'none'
//                                },
//                                align: 'left'
//                            },
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>'
//                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Top 5 Studies by '+title,
                        data: dataArray
                    }],
                    credits: {
                        enabled: false
                    }
                });

            });


    }

}