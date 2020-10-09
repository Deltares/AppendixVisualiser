import * as d3 from 'd3'
import * as math from 'mathjs'

function surro(manning, discharge, waterlevel) {
  let manning_powers = [0, 1, 0, 0, 2, 1, 1, 0, 0, 0, 3, 2, 2, 1, 1, 1, 0, 0, 0, 0, 4, 3,
        3, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 5, 4, 4, 3, 3, 3, 2, 2, 2,
        2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 6, 5, 5, 4, 4, 4, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 7, 6, 6, 5,
        5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1,
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
  let discharge_powers = [0, 0, 1, 0, 0, 1, 0, 2, 1, 0, 0, 1, 0, 2, 1, 0, 3, 2, 1, 0, 0, 1,
        0, 2, 1, 0, 3, 2, 1, 0, 4, 3, 2, 1, 0, 0, 1, 0, 2, 1, 0, 3, 2, 1,
        0, 4, 3, 2, 1, 0, 5, 4, 3, 2, 1, 0, 0, 1, 0, 2, 1, 0, 3, 2, 1, 0,
        4, 3, 2, 1, 0, 5, 4, 3, 2, 1, 0, 6, 5, 4, 3, 2, 1, 0, 0, 1, 0, 2,
        1, 0, 3, 2, 1, 0, 4, 3, 2, 1, 0, 5, 4, 3, 2, 1, 0, 6, 5, 4, 3, 2,
        1, 0, 7, 6, 5, 4, 3, 2, 1, 0]
  let waterlevel_powers = [0, 0, 0, 1, 0, 0, 1, 0, 1, 2, 0, 0, 1, 0, 1, 2, 0, 1, 2, 3, 0, 0,
        1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 2, 3, 4, 0, 0, 1, 0, 1, 2, 0, 1, 2,
        3, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 5, 0, 0, 1, 0, 1, 2, 0, 1, 2, 3,
        0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6, 0, 0, 1, 0,
        1, 2, 0, 1, 2, 3, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4,
        5, 6, 0, 1, 2, 3, 4, 5, 6, 7]
  let coefficients = [3113.5382223279926,
 -8884.628813180461,
 -22107.878175991715,
 6517.174708222277,
 -1053.4714779278481,
 31884.711266274877,
 -10104.649514396799,
 774.4293064369908,
 14460.403276188548,
 -5115.131180428985,
 -557.4755405345455,
 8429.52374369679,
 -1009.002624703378,
 622.8091665477408,
 -19864.978439603987,
 8042.028481203986,
 -16.351296261901748,
 -450.91031483834644,
 -3900.8129717966253,
 1474.0542177507245,
 47755.81047300367,
 -6800.812472554587,
 -4104.214335979891,
 103.56500955305425,
 -3608.593487762789,
 760.7354262343102,
 -14.364298940035047,
 -279.99139389158097,
 4923.300139861098,
 -2097.165707782488,
 -1.6727151409851047,
 10.421439961169298,
 103.43203595475023,
 554.6323315050098,
 -218.78794343358345,
 303478.13456260826,
 -1094.2074793426705,
 -51459.21929959912,
 -282.9481265796518,
 2711.3858216952035,
 2946.715404338826,
 -22.438259923170328,
 10.409959670799227,
 546.5113943877063,
 -194.4416023618038,
 -1.5502716575436875,
 8.49304688368752,
 44.20636611510775,
 -606.1267683472533,
 262.59590872140905,
 0.18287267289491638,
 0.2530323125993732,
 -2.094608519289011,
 -11.735099738041413,
 -43.73728143029052,
 17.89931973238572,
 -95923.11318693956,
 4714.190126494529,
 -60505.62694941335,
 53.15913976225528,
 -387.09787781166295,
 9680.918295242162,
 -2.186173472583794,
 61.62115055479276,
 -320.58062709279517,
 -511.98611644333886,
 0.08000903600571085,
 5.169229853550406,
 -6.309995845415445,
 -34.694974705848914,
 21.721689913544743,
 0.0868951679307699,
 0.17576374545721762,
 -1.241766181099763,
 -2.9057799490190064,
 37.06482521038964,
 -16.208635270315796,
 -0.002805617790272663,
 -0.038184554630788625,
 0.00748248159970899,
 0.16656960320324288,
 0.6619593523400908,
 1.807347492261215,
 -0.7674311740684061,
 7126.338687010091,
 131.6703140501039,
 10322.104084996434,
 51.41423715164197,
 -606.0049073132298,
 2964.898117716295,
 2.4881976697837374,
 -15.365722776934124,
 66.26327748572932,
 -505.32173151960257,
 0.15101270013537693,
 -0.2219044131978043,
 -2.645441069358828,
 10.981679331644417,
 26.2362152218515,
 0.008566201788980266,
 -0.03776131902278479,
 -0.258797085048343,
 0.4007159681691803,
 0.7861025897989009,
 -0.8856820676546704,
 0.00016755664279344273,
 -0.010947661654427066,
 0.001972386721490693,
 0.050926435370001855,
 0.0670641492733921,
 -0.9011651731011625,
 0.3979241013457795,
 -1.3326363841770217e-05,
 0.00036758756687049754,
 0.0019161793879902689,
 -0.0016289863069687271,
 -0.004453881393601478,
 -0.014946840101401904,
 -0.030404729659494478,
 0.013455237120069796]

      if (!manning || !discharge || !waterlevel) {
        return null
      }{
      let a1 = math.dotPow(manning, manning_powers)
      let a2 = math.dotPow(discharge, discharge_powers)
      let a3 = math.dotPow(waterlevel, waterlevel_powers)
      let a4 = math.dotMultiply(a1, a2)
      let a5 = math.dotMultiply(a4, a3)
      let a6 = math.dotMultiply(coefficients, a5)
      let a7 = math.sum(a6)

      return a7
      }
}

function parseData(rawData){
    // parses the json file for use in chart plotting
    // 
    // Arguments:
    //    rawData -> json object read by d3.json

    // Dateparser
    var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");    
    
    // null parser
    var parseNull = function(value) {if (!value){return undefined}{return value}}
    let time = rawData.time

    // Prepare data structure for D3
    let parsedData = {'meta': 'empty', 
                      'wl_up':[],
                      'wl_down':[],
                      'wl_diff':[],
                      'discharge': [],
                      'friction': [],
                      'synth_wl': [],
                      'synth_friction': [],
                      'day_max_growth': [],
                      'growth_rate': []}
    
    // Populate the datastructure
    for (let i = 0; i < time.length; i++){
        // upstream waterlevel
        parsedData.wl_up.push({"x": parseDate(time[i]),
                               "y":parseNull(rawData.up[i]),
                         });
        parsedData.wl_up.extent = d3.extent(rawData.up)

        // downstream waterlevel
        parsedData.wl_down.push({"x": parseDate(time[i]),
                               "y":parseNull(rawData.down[i]),
                         });
        parsedData.wl_down.extent = d3.extent(rawData.down)

        // discharge
        parsedData.discharge.push({"x": parseDate(time[i]),
                         "y":rawData.discharge[i],
                         });
        parsedData.discharge.extent = d3.extent(rawData.discharge)

        // friction
        parsedData.friction.push({"x": parseDate(time[i]),
                               "y":parseNull(rawData.computed_friction[i]),
                         });
        parsedData.friction.extent = d3.extent(rawData.computed_friction)


        // synthetic friction
        parsedData.synth_friction.push({"x": parseDate(time[i]),
                               "y":parseNull(rawData.synth_friction[i]),
                         });
        parsedData.synth_friction.extent = d3.extent(rawData.synth_friction)

        // synthetic water level
        parsedData.synth_wl.push({"x": parseDate(time[i]),
                               "y":parseNull(rawData.synth_wl[i]),
                         });
        parsedData.synth_wl.extent = d3.extent(rawData.synth_wl)
    }

    

    //parsedData.extent = rawData.time.extent
    
    return parsedData
}

export function protoTimeSeriesChart() {
    /* This chart will depict a time series chart
     *
     * To embed, first apply it to your context (e.g.):
     * >> var LocalChart = {};
     * >> protoTimeSeriesChart.apply(LocalChart);
     * Next, set the canvas (this must be an SVG element in your html)
     * >> LocalChart.setCanvas('#canvas')
     * Initialize the figure
     * >> LocalChart.init()
     * All done. Now call specific functions to show elements
     */

    const version = 0.2;
    var canvas = 'body';
    var margin = { top: 40, left: 60, bottom: 40, right: 40 };
    var xScale = {};
    var yScale = {};
    var yLabel = "";
    var valueline = {};
    var data = {};
    var xAxisConstructor = d3.axisBottom;
    var width = null;
    var height = null;
    var g = null;
    var s = null;
    var active_variable = 'discharge'
    var colormap = ["#440154", "#440558", "#450a5c", "#450e60", "#451465", "#461969",
                    "#461d6d", "#462372", "#472775", "#472c7a", "#46307c", "#45337d",
                    "#433880", "#423c81", "#404184", "#3f4686", "#3d4a88", "#3c4f8a",
                    "#3b518b", "#39558b", "#37598c", "#365c8c", "#34608c", "#33638d",
                    "#31678d", "#2f6b8d", "#2d6e8e", "#2c718e", "#2b748e", "#29788e",
                    "#287c8e", "#277f8e", "#25848d", "#24878d", "#238b8d", "#218f8d",
                    "#21918d", "#22958b", "#23988a", "#239b89", "#249f87", "#25a186",
                    "#25a584", "#26a883", "#27ab82", "#29ae80", "#2eb17d", "#35b479",
                    "#3cb875", "#42bb72", "#49be6e", "#4ec16b", "#55c467", "#5cc863",
                    "#61c960", "#6bcc5a", "#72ce55", "#7cd04f", "#85d349", "#8dd544",
                    "#97d73e", "#9ed93a", "#a8db34", "#b0dd31", "#b8de30", "#c3df2e",
                    "#cbe02d", "#d6e22b", "#e1e329", "#eae428", "#f5e626", "#fde725"];
    
    var line = d3.line()
              .defined(d => !isNaN(d.y))
              .x(function(d) { return xScale(d.x); })
              .y(function(d) { return yScale(d.y); });

    
    /* /////////////////////////////////////////////////////////////
    //// Initialisation & general methods
    *///////////////////////////////////////////////////////////////
    this.getVersion = function() {
        return (version)
    };

    this.setCanvas = function(name){
        canvas = name
    };

    this.removeAll = function(){
        s = d3.select(canvas).select('g')
        s = s.remove();     
    };

    this.resize = function(){
        //this.removeAll()
        this.updateScales()
        this.updatePaths()
        this.updateAxis()
        //this.init()
        //this.drawBands()
        //this.drawValueLineNoAnimation()
        //this.showBands()
    };
    
    this.start = function() {
        console.log(data)
        this.updateScales()
        d3.select(canvas).append('g');
        g = d3.select(canvas).select('g')
         .style('pointer-events', 'inherit')
         .attr('transform', 'translate(' + 10 + ',' + 10 + ')');
        this.drawAxis()
    };

    this.init = function(){
    
        this.updateScales()
        d3.select(canvas).append('g');

        // other elements.
        g = d3.select(canvas).select('g')
         .style('pointer-events', 'inherit')
         .attr('transform', 'translate(' + 10 + ',' + 10 + ')');

        
        // Scale the range of the data
        this.updateScales()
        //xScale.domain(d3.extent(data[active_variable], function(d) { return d.x; }));
        //yScale.domain(d3.extent(data[active_variable], function(d) { return d.y; }));
        this.drawAxis()
        
        //this.generateSyntheticSeries()
        //this.drawBands()
        //this.drawZeroLine()     
    };

    this.updateScales = function(){
      // update the extent of the axis
        console.log("updating scales")

        width = parseFloat(d3.select(canvas).style('width'))
        height = parseFloat(d3.select(canvas).style('height'))
        
        xScale = d3.scaleTime().range([margin.left, width - margin.right]);
        yScale = d3.scaleLinear().range([height-margin.bottom, margin.top]);
        
        xScale.domain(d3.extent(data[active_variable], function(d) { return d.x; }));
        //let parser = d3.timeParse("%Y")
        //xScale.domain([parser('2015'), parser('2016')])
        if (data[active_variable].extent){
            yScale.domain(data[active_variable].extent);
        } else {
            yScale.domain(d3.extent(data[active_variable], function(d) { return d.y; }));
        }

    };

    /* /////////////////////////////////////////////////////////////
    //// Data methods
    *///////////////////////////////////////////////////////////////

    /* Call this before initialisation */
    this.setData = function(rawData){       
        data = parseData(rawData);
    };

    this.generateSyntheticSeries = function(){
      // empty existing data
      data.synth_wl = []

      for (let i = 0; i < data.friction.length; i ++){
        data.synth_wl.push({'x': data.friction[i].x, 
                            'y': surro(data.friction[i].y, 
                                  data.discharge[i].y,
                                  data.wl_down[i].y)})
      }
      console.log(data.synth_wl)
      console.log(data.wl_up)

    }
    /* Call this to dynamically change data after figure creation */
    this.updateData = function(rawData, callback=this.dummy){       
        // parse raw data from json
        data = parseData(rawData)
        
        // update scales
        this.updateScales()
        this.updateAxis()
        this.updatePaths()

        // Update confidence limits
        let DB = this.drawBands
        let SB = this.showBands
        
        // remove current bands, then change line
        g.selectAll(".area")
         .remove()
         .on("end", function () { 
                d3.select(canvas).selectAll('.valueline')
                .datum(data[active_variable])
                .transition()
                .duration(500)
                .attr("d", valueline)
            });
         DB();
         SB();
         callback();
    };

    /* /////////////////////////////////////////////////////////////
    //// Axis methods
    *///////////////////////////////////////////////////////////////

    this.drawAxis = function(){
        //let xticks = Math.round(width / 60)
        let yticks = Math.round(height / 40)

        console.log(data[active_variable][0].x)
        // text labels
        yLabel = g.append("text")
          .attr("id", "YLabel")
          .attr("class", "Figurelabels")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 )
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Afvoer [m3/s]"); 
        /*
        g.append("text")
          .attr("id", "XLabel")
          .attr("class", "Figurelabels")
          .attr("y", yScale(0.2))
          .attr("x", xScale(905))
          .style("text-anchor", "middle")
          .text("Rhine kilometer [km]"); 
               */
          // Add the X Axis
          g.append("g")
              .attr('id', 'XAxis')
              .attr("transform", "translate(0," + yScale(data[active_variable].extent[0]) + ")")
              .attr("class", "FigureAxes")
              .call(d3.axisBottom(xScale).ticks(6));

          // Add the Y Axis
          let parser = d3.timeParse('%Y')
          g.append("g")
             .attr("id", "YAxis")
             .attr("class", "FigureAxes")
             .attr("transform", "translate(" + xScale(parser('2015'))+ ",0)")
             .call(d3.axisLeft(yScale).ticks(yticks));

          // transparent back-rectangle to capture mousemove events
          g.append("rect")
              .style("opacity", 0)
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", width)
              .attr("height", height);

        
    };

    this.moveAxis = function(ax, loc) {
        let xticks = Math.round(width / 60)
        
        if (ax=='x'){
            if (loc=='zero'){
                d3.select('#XAxis')
                   .transition()
                   .duration(400)
                   .attr("transform", "translate(0," + yScale(0) + ")")
                   .call(d3.axisTop(xScale).ticks(xticks));
                xAxisConstructor = d3.axisTop;
            } else if (loc=='bottom') {
                d3.select('#XAxis')
                   .transition()
                   .duration(400)
                   .attr("transform", "translate(0," + yScale(yScale.domain()[0]) + ")")
                   .call(d3.axisBottom(xScale).ticks(xticks).tickPadding(10));
                xAxisConstructor = d3.axisBottom;
            }
        }
    };

    this.updateAxis = function (){
        // number of ticks
        //let xticks = Math.round(width / 60)
        let yticks = Math.round(height / 40)

        d3.select(canvas).select('#YAxis')
           .transition()
           .duration(400)
           .call(d3.axisLeft(yScale).ticks(yticks))
        
        d3.select(canvas).select('#XAxis')
           .transition()
           .duration(400)
           .call(xAxisConstructor(xScale).ticks(6))
    };

    this.updateCrosshairX = function(mouseX){
        if (mouseX >= xScale.domain()[0] & mouseX <= xScale.domain()[1]) {
         g.selectAll('.chx')
            .transition()
            .duration(10)
            .attr('x1', xScale(mouseX))
            .attr('x2', xScale(mouseX))
            }
    };

    this.updateCrosshairY = function(mouseY){
        if (mouseY >= yScale.domain()[0] & mouseY <= yScale.domain()[1]) {
         g.selectAll('.chy')
            .transition()
            .duration(10)
            .attr('y1', yScale(mouseY))
            .attr('y2', yScale(mouseY))
            }
    };

    this.setYLabel = function(label){
        d3.select('#YLabel').text(label)
    };

    this.setXLabel = function(label){
        d3.select('#XLabel').text(label)
    };

    this.setXaxisCallback  = function(fnc) {
        let self = this;
        g.on("mousemove", function(){
         // first move mouse
         self.updateCrosshairX(Math.round(xScale.invert(d3.mouse(this)[0])));
         self.updateCrosshairY(yScale.invert(d3.mouse(this)[1]));

         // then add user function
         fnc(Math.round(xScale.invert(d3.mouse(this)[0])));
     });
    };

    /* /////////////////////////////////////////////////////////////
    //// Path (line) methods
    *///////////////////////////////////////////////////////////////


    this.drawZeroLine = function () {

        var zeroline = d3.line()
              .x(function(d) { return xScale(d.x); })
              .y(function(d) { return yScale(0*d); });

        d3.select(canvas).selectAll('.valueline')
        .transition()
        .duration(500)
        .attr("d", zeroline)
    };
    
    this.drawPrimaryLine = function (){
        if (d3.select(canvas).select('#IDPrimaryLine').empty()) {
        g.append("path")
            .data([data[active_variable]])
            .attr('id', 'IDPrimaryLine')
            .attr('class', 'PrimaryLine')
            .style('stroke-width', "1")
            .style("fill", 'none')
            .transition()
            .duration(500)
            .attr("d", line)
        } else {
            // Median already plotted, update instead
            console.log('primary already exists')
        } 
        
    };

    this.drawSecondaryLine = function (){
        if (d3.select(canvas).select('#IDSecondaryLine').empty()) {
        g.append("path")
            .data([data[active_variable]])
            .attr('id', 'IDSecondaryLine')
            .attr('class', 'SecondaryLine')
            .style('stroke-width', "2")
            .style("fill", 'none')
            .transition()
            .duration(500)
            .attr("d", line)
        } else {
            // Median already plotted, update instead
            console.log('secondary already exists')
        } 
        
    };

    this.drawDischarge = function (){
      active_variable = 'discharge'
      this.updateScales()
      d3.select(canvas).select('.PrimaryLine')
          .data([data[active_variable]])
          .transition()
          .duration(500)
          .attr('d', line)

      yLabel
          .transition()
          .duration(1000)
          .text("Afvoer [m3/s]"); 
        
      this.updateAxis()
    };

    this.drawModelWaterLevel = function (){
      active_variable = 'synth_wl'
      //this.updateScales()
      d3.select(canvas).select('.SecondaryLine')
          .data([data[active_variable]])
          .transition()
          .duration(500)
          .attr('d', line)

      
      //this.updateAxis()
    };

    this.drawFriction = function (){
      active_variable = 'friction'
      this.updateScales()
      d3.select(canvas).select('.PrimaryLine')
          .data([data[active_variable]])
          .transition()
          .duration(500)
          .attr('d', line)

      yLabel
          .transition()
          .duration(1000)
          .text("Weerstand"); 
        
      this.updateAxis()
    };

    this.drawModelFriction = function (){
      active_variable = 'synth_friction'
      //this.updateScales()
      d3.select(canvas).select('.SecondaryLine')
          .data([data[active_variable]])
          .transition()
          .duration(500)
          .attr('d', line)

      yLabel
          .transition()
          .duration(1000)
          .text("Weerstand"); 
        
      //this.updateAxis()
    };

    this.drawWaterLevelUp = function (){
      active_variable = 'wl_up'
      this.updateScales()
      d3.select(canvas).select('.PrimaryLine')
        .data([data[active_variable]])
        .transition()
        .duration(500)
        .attr('d', line)

      yLabel
          .transition()
          .duration(1000)
          .text("Peil [m]"); 
      this.updateAxis()

    };

    this.drawPercentile = function (pct){
        var pline = d3.line()
              .x(function(d) { return xScale(d.x); })
              .y(function(d) { return yScale(d.pcts[pct]); });

        if (d3.select('#sf_percentile').empty()) {
        g.append("path")
            .data([data[active_variable]])
            .attr('id', 'sf_percentile')
            .attr('class', 'PrimaryLine')
            .style('stroke', 'red')
            .style('stroke-width', "1")
            .style("fill", 'none')
            .transition()
            .duration(500)
            .attr("d", pline)
        } else {
            // Median already plotted, update instead
            console.log('pct already exists')
        } 
    };

    this.updatePercentile = function(pct) {
        console.log(pct)
        var pline = d3.line()
              .x(function(d) { return xScale(d.x); })
              .y(function(d) { return yScale(d.pcts[pct]); });
        d3.selectAll("#sf_percentile")
           .attr("d", pline)
         console.log (d3.select('#sf_percentile'))
    }
    

    this.updatePaths = function() {
       d3.selectAll('.PrimaryLine')
          .data([data.discharge])
          .transition()
          .duration(500)
          .attr('d', line)
    };

    /* /////////////////////////////////////////////////////////////
    //// Areas and confidence bands
    *///////////////////////////////////////////////////////////////

    this.drawWater = function (){
        var area = d3.area()
            .x(function(d) { return xScale(d.x); })
            .y0(function() { return yScale(yScale.domain()[0]); })
            .y1(function(d) { return yScale(d.y); });

        g.append("path")
         .datum(data[active_variable])
         .style('fill', 'steelblue')
         .attr('d', area)
    };

    this.drawBands = function(){
        let areas = []
        let i = 0;
        for (i = 0; i < 4; i ++){
          var area = d3.area()
             .x(function(d) {return xScale(d.x)})
             .y0(function(d) {return yScale(d.p[i][1])})
             .y1(function(d) {return yScale(d.p[i][0])})
          areas.push(area)
        }

        var div = d3.select('body').append("div") 
              .attr("class", "floatingToolTip")       
              .style("opacity", 0)    


        for (i = 0; i < 4; i ++){
          g.append("path")
           .datum(data[active_variable])
           .attr("tooltip", data.meta.tooltips[i])
           .attr("class", "area")
           .attr('index', i / 4 * colormap.length)
           .attr("fill", colormap[i / 4 * colormap.length])
           .attr("d", areas[i])
           .attr("opacity", 0)
           .on("mouseover", function() {
            if (d3.select(this).attr("opacity") != 0){
                d3.select(this).attr("class", "highlightedArea")
                // On hover, make other lines less visible
                var curId = d3.select(this).attr("index")
                d3.select(canvas).selectAll("path").each(function(){
                    if (curId != d3.select(this).attr("index")){
                      d3.select(this).attr('opacity', 0.2)
                      }
                    }
                )
                // On hover, display tooltip
                div.html(d3.select(this).attr("tooltip"))
                   .style("left", (d3.event.pageX) + "px")    
                   .style("top", (d3.event.pageY - 28) + "px")
                   .style('opacity', 1)
                   //.transition().duration(400).style("opacity", 1);  
             }
          }
            )
           .on("mouseout", function() {
            if (d3.select(this).attr("opacity") != 0){
            d3.select(this).attr("class", "area")
            d3.select(this).attr("fill", colormap[d3.select(this).attr("index")])
                           .attr("opacity", 1)
            d3.select(canvas).selectAll("path").each(function(){
              d3.select(this).attr('opacity', 1)
            })
            div.style("opacity", 0)
          }});
        }
    };

    this.showBands = function() {
        g.selectAll('.area')
          .transition()
          .delay(function (d, i) { return 100 * (4-i);})
          .duration(750)
          .attr('opacity', 1);
    };

    this.hideBands = function() {
        g.selectAll('.area')
         .transition()
         .delay(function (d, i) { return 100 * (4-i);})
         .duration(750)
         .attr('opacity', 0);
    };

    this.removeBands = function() {
        g.selectAll(".area")
         .transition()
         .duration(750)
         .attr("opacity", 0)
         .remove();
    };
    
} // protoSchematicRiverChart
 