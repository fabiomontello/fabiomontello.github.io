function totalRevenue(paddingToggle, id, labelsId){
   // console.log("yup");
let margin = {left: 0, right: 0, top: 40, bottom: 0};
//let id = "#contentAnalyticTotalRevenue";
let width = window.innerWidth*0.66;//900;
let height = window.innerHeight*0.66;
if(width<window.innerHeight){height = window.innerHeight*0.6;}
let grapWidth = 2500;
let xMove = 0;
let viewBox = "0 0 "+width+" "+height;
let dayMonth = d3.timeFormat("%d %b");
let Month = d3.timeFormat("%B");
let dayMonthYear = d3.timeFormat("%d %b");
let dayDate = d3.timeFormat("%d");
let dateDayMonthYear = d3.timeFormat("%A, %d %B %Y");
let svg = d3.select(id).append("div")
   .classed("svg-container", true)
   .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", viewBox)
   .classed("svg-content-responsive", true);
if(paddingToggle){
    $(id).children().eq(2).css("padding-left",((height/width)*100)+"%");  
}
let chartGroup = svg.append("g");
let transitionDuration = 100;
let totalAmount = 0;
let palette =["#c0544e","#3D73A2", "#fff"];

let start = {x:0,y:0};
let offset = {x: 0, y: 0};
let stack = d3.stack()
    .keys(["BARNARDOS", "SPCA", "CBM"])
    .order(d3.OrderInsideOut)
    .offset(d3.stackOffsetSilhouette);
    
let toggles = [];
d3.json('data/totalrevenue.json').get(function(error,data){
    //console.log(width+" - "+height)
    if(error) throw error;
    //console.log(data);
    data = sortJsonByDate(data);
    let series = stack(data);
    let rangeData = [];
    for(let i = 0; i< data.length; i++){
        rangeData.push(data[i]._Date);
    }
    //console.log(series);
    let  color = d3.scaleLinear().domain([0, series.length-1])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#3A539B"), d3.rgb('#2D8DD6')])
    for(let i = 0; i < series.length; i++){
        toggles[i] = true;
    }
    //console.log(toggles);
    let x = d3.scaleBand().domain(rangeData).range([0,grapWidth]);//(width-margin.right-margin.left)]);
    let y = d3.scaleLinear().domain([0,d3.max(data,
                                    function(d,i){
                                        let tot = 0;
                                        for(let tmpx in d){
                                            if(tmpx != "_Date"){
                                                tot = tot+ d[tmpx]; 
                                            }
                                        }
                                        if(width<768){ return 1.2*tot;}
                                         return 2*tot;}
                                    )])
                            .range([height-margin.bottom,margin.top]);
    
    let fstDayOfMonth = [];
    let month = 0;
    let parseMnt = d3.timeFormat("%m");
    let monthTotalAmount = [];
    let parTotAmount = 0;
    
    data.forEach(function(d,i){
        //console.log(d._Date);
        for(let j in d){
            if(j != "_Date"){
               parTotAmount = parTotAmount + d[j];
            }
        } 
        
        if(month < parseMnt(timeNoHour(d._Date))){
            month = parseMnt(timeNoHour(d._Date));
            fstDayOfMonth.push(d);
            //console.log(parTotAmount);
            monthTotalAmount.push(parTotAmount.toFixed(2));
            parTotAmount= 0;
        }
    })
        
    let bgMonthLabels = chartGroup.append("g").selectAll("text")
                    .data(fstDayOfMonth)
                    .enter()
                    .append("text")
                        .attr("x",function(d,i){ return x(d._Date)+(grapWidth/6);})
                        .attr("y",height*0.72)
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline","ideographic")
                        .attr("font-size", 32)
                        .attr("font-weight", "bolder")
                        .attr("fill", "white")
                        .attr("opacity", 0.35)
                        .text(function(d,i){ return Month(timeNoHour(d._Date));});
   /* let monthsAxis = [];
    let xAxis = d3.axisBottom(x).tickValues(x.domain().filter(
         function(d, i) { 
            if(i!= 0 ){ 
                if(i != (data.length - 1)){
                    if(month(timeNoHour(d)) == monthsAxis[monthsAxis.length-1]){
                        return false;
                    }else{
                        monthsAxis.push(month(timeNoHour(d)));
                        return true;
                    };
                    //return !(i % 5);
                }
            }

        })).tickFormat(function(d,i){
            return month(timeNoHour(d));
        });
    //console.log(monthsAxis);
    //let yAxis = d3.axisLeft(y);
    
    chartGroup.append("g") 
          .attr("class", "axis axis--x")
          .attr('transform','translate(0,'+ (height*0.68)+')')//'+margin.left+'
          .call(xAxis).selectAll("text")	
            .style("text-anchor", "middle")
            .attr("dy", ".75em")
            .attr("fill","white");
    chartGroup.selectAll(".axis path").remove();
    chartGroup.selectAll(".axis line").attr("y2", height/3).attr("transform", "translate(0,"+(-height/3)+")");*/
    /*chartGroup.append("g") 
          .attr("class", "axis axis--y")
          .attr('transform','translate('+margin.right+','+ margin.top+')')
          .call(yAxis);
    chartGroup.selectAll(".tick line").attr("stroke", "white");
    chartGroup.selectAll(".axis path").attr("stroke", "white");
    chartGroup.selectAll(".tick text").attr("fill", "white");*/
     chartGroup.append("rect")
        .attr("x",0)
        .attr("y",20)
        .attr("width",width)
        .attr("height",(height-margin.bottom))
        .attr("fill", "transparent")
        .attr("stroke", "none")
            .on("touchstart", function(){
                        d3.select(".tag").attr("opacity",0)
                        start.x = d3.touches(this)[0][0];
                        start.y = d3.touches(this)[0][1];
                        //console.log(start);
                })
            .on("touchmove", function(){
                        offset.x = start.x - d3.touches(this)[0][0];
                        offset.y = start.y - d3.touches(this)[0][1];
                        //console.log(offset);
                        start.x = d3.touches(this)[0][0];
                        start.y = d3.touches(this)[0][1];

                        xMove -= offset.x;
                        moveGraph();

                });
    
    var area = d3.area()
    .x(function(d, i) { return x(d.data._Date); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); }).curve(d3.curveBasis);
    
    let steamGraph = chartGroup.append("g").attr("class","steamgraph").attr("transform", "translate("+0+","+(-height/2)+")");
    let pathSteam = steamGraph.selectAll("path")
            .data(series)
            .enter()
            .append("path")
                .attr("class", function(d,i){return "steamgraph--area--"+(i);})
                .style("fill", function(d,i){ return color(i)})
                .attr("d", area)
                .on("click", function(d,i){
                    if(width>768){
                        if(toggles[i]){
                            d3.select(".steamgraph--area--"+(i)).classed("steamgraph--deselected", true);
                            d3.select(".steamgraph--area--"+(i)).classed("steamgraph--selected", false);
                        } else{
                            d3.select(".steamgraph--area--"+(i)).classed("steamgraph--deselected", false);
                            d3.select(".steamgraph--area--"+(i)).classed("steamgraph--selected", true);                        
                        }

                        toggles[i] = !toggles[i];
                    }
                });

    let labels = chartGroup.append("g").attr("class","steamgraph--labels").attr("transform","translate("+(-width*0.05)+","+(height*0.95)+")")
                    .selectAll("text")
                    .data(series).enter()
                    .append("g").attr("transform", function(d,i){
                            return "translate("+(+((width*0.8)/3)*(i+1))+",0)";
                    });

    /*labels.append("circle")
            .attr("cx",20)
            .attr("cy",0)
            .attr("r", 6)
            .attr("fill", function(d,i){return color(i)});

    labels.append("text")
        .text(function(d,i){; return d.key;})
                .attr("x",35)
                .attr("y",1.5)
                .attr("pointer-events","none")
                .attr("text-anchor", "start")
                .attr("alignment-baseline","middle")
                .attr("font-size", 10)
                .attr("fill", "white")
                .attr("stroke", "none")*/

    //steamGraph.call(d3.drag().on("drag", draggRate));

    
            steamGraph.on("mousemove", function(d,i){
                            d3.select(".tag").attr("opacity",1);
                            //console.log(xMove);
                            console.log();
                
                            if((d3.mouse(this)[0]) >= grapWidth-200){
                                //console.log("limit");
                                d3.select(".tag text").attr("transform","translate(-135,0)");
                                //d3.select(".tag text").select(".tag--date").attr("end");
                                //console.log(d3.select(".tag"));
                            }else{
                                d3.select(".tag text").attr("transform","translate(0,0)");
                            }
                            let invertScaleX = d3.scaleQuantize().domain(x.range()).range(x.domain());
                            //let invertScaleY = d3.scaleLinear().domain(y.range()).range(y.domain());
                            //console.log(-xMove);
                            let index = Math.round((x(invertScaleX((d3.mouse(this)[0]))))*data.length/grapWidth);
                            //console.log(index);
                            chartGroup.select(".tag--line")//.attr("transform", "translate("+0+","+(-height/2)+")")
                                        .attr("x1",x(invertScaleX((d3.mouse(this)[0])))+xMove)
                                        .attr("x2",x(invertScaleX((d3.mouse(this)[0])))+xMove)
                                        .transition()
                                        /*.attr("y2", function(){
                                                    console.log(pathSteam._groups[0][0].getPointAtLength(y(series[0][index][0])));
                                                    //pathSteam.getPointAtLength(1);
                                                    //return pathSteam._groups[0][0].getPointAtLength(y(series[0][index][0])).y;
                                                    return height*0.05;
                                                    return y(series[0][index][0]);
                                                })
                                        .attr("y1", function(d,i){ return y(series[2][index][1]);});*/
                                        .attr("y1", height*0.05) //y(series[0][index][0]).curve(d3.curveBasis)
                                        .attr("y2",height*0.5);//y(series[2][index][1]).curve(d3.curveBasis)
                            
                            //console.log(index);
                
                            chartGroup.select(".tag--amount")
                                        .attr("x",5+x(invertScaleX((d3.mouse(this)[0])))+xMove)
                                        .attr("y",height*0.05)
                                        .text(function(){
                                        let amount = 0;
                                        let i = 0;
                                        for(let tmpx in data[index]  ){
                                                if(tmpx != "_Date"){
                                                    if(toggles[i-1]){
                                                        amount = amount+ Math.abs(data[index][tmpx]);
                                                       // console.log(i + " | "+ Math.abs(data[index][tmpx]));
                                                    }
                                                }
                                                i++;
                                            }
                                            return "$"+amount.toFixed(2);
                                        });

                            //console.log(index);
                            chartGroup.select(".tag--date")
                                        .text(function(){
                                            return dateDayMonthYear(timeNoHour(data[index]._Date));
                                        })
                                        .attr("x",5+x(invertScaleX((d3.mouse(this)[0])))+xMove)
                                        .attr("y",25+height*0.05);

                            chartGroup.select(".tag--stock")
                                        .text(function(){
                                            if(index == 0) return 0;
                                            let amount = 0;
                                            let i = 0;
                                            for(let tmpx in data[index]  ){
                                                    if(tmpx != "_Date"){
                                                        if(toggles[i-1]){
                                                            amount = amount+ Math.abs(data[index][tmpx]);
                                                        }
                                                    }
                                                    i++;
                                                }
                                            let prevamount = 0;
                                            let j = 0;
                                            if(index != 0){
                                                for(let tmpx in data[index-1]  ){
                                                        if(tmpx != "_Date"){
                                                            if(toggles[j]){
                                                                prevamount = prevamount+ Math.abs(data[index-1][tmpx]); 
                                                            }
                                                        }
                                                        j++;
                                                    }
                                            }
                                            let rate = ((amount-prevamount)*100/prevamount).toFixed(2);
                                            if(rate > 0) return "+"+rate+"%";
                                            if(rate < 0) return rate+"%";
                                        })
                                        .attr("x",80+x(invertScaleX((d3.mouse(this)[0])))+xMove)
                                        .attr("y",3+height*0.05)
                                        .attr("fill",function(d){
                                            let amount = 0;
                                            let i = 0;
                                            for(let tmpx in data[index]  ){
                                                    if(tmpx != "_Date"){
                                                        if(toggles[i-1]){
                                                            amount = amount+ Math.abs(data[index][tmpx]);
                                                        }
                                                    }
                                                    i++;
                                                }
                                            let prevamount = 0;
                                            let j = 0;
                                            if(index != 0){
                                                for(let tmpx in data[index-1]  ){
                                                        if(tmpx != "_Date"){
                                                            if(toggles[j]){
                                                                prevamount = prevamount+ Math.abs(data[index-1][tmpx]); 
                                                            }
                                                        }
                                                        j++;
                                                    }
                                            }
                                            let rate = ((amount-prevamount)*100/prevamount).toFixed(2);
                                            if(rate < 0) return "#c0544e";
                                            if(rate > 0) return "#45a094";
                                        });
                        
                });

        steamGraph.on("wheel",function(){  
                    d3.select(".tag").attr("opacity",0)
                    xMove += d3.event.wheelDeltaX;
                    xMove += d3.event.wheelDeltaY;
                    moveGraph();
                });

   // console.log(svg.getPointAtLength(1));
    chartGroup.on("mouseover", function(){
                    d3.select("body").style("height", "100%").style("overflow", "hidden");
                })
    chartGroup.on("mouseout", function(){
                    d3.select("body").style("height", "100%").style("overflow", "scroll");
                })
    
    
    let monthLabel = chartGroup.append("g").attr("class","month--label");
    
    monthLabel.selectAll("line")
                    .data(fstDayOfMonth)
                    .enter()
                    .append("line")
                        .attr("x1", function(d,i){ return x(d._Date);})
                        .attr("x2", function(d,i){ return x(d._Date);})
                        .attr("y1", height*0.5) 
                        .attr("y2",height*0.8)
                        .attr("stroke", "white");
    
    monthLabel.selectAll("text .month--label--amount")
                    .data(fstDayOfMonth)
                    .enter()
                    .append("text")
                        .attr("x",function(d,i){ return x(d._Date)-4;})
                        .attr("y",height*0.8)
                        .attr("text-anchor", "end")
                        .attr("alignment-baseline","ideographic")
                        .attr("font-size", 20)
                        .attr("fill", "white")
                        .text(function(d,i){ return "$"+monthTotalAmount[i];});
    
    monthLabel.selectAll("text .month--label--amount")
                    .data(fstDayOfMonth)
                    .enter()
                    .append("text")
                        .attr("x",function(d,i){ return x(d._Date)-4;})
                        .attr("y",height*0.8)
                        .attr("text-anchor", "end")
                        .attr("alignment-baseline","hanging")
                        .attr("font-size", 12)
                        .attr("fill", "white")
                        .attr("fill", "grey")
                        .text(function(d,i){ if(i!= 0){return "Total amount of "+Month(timeNoHour(fstDayOfMonth[i-1]._Date));}; });
    
    let tag = chartGroup.append("g").attr("class","tag")
            .append("text");

    d3.select(".tag").append("line")
            .attr("class","tag--line").attr("transform","translate(0,0)")
                .attr("stroke", "white");

        
    tag.append("tspan").attr("class","tag--amount")
                .attr("pointer-events","none")
                .attr("text-anchor", "start")
                .attr("alignment-baseline","hanging")
                .attr("font-size", 18)
                .attr("fill", "white");

    tag.append("tspan").attr("class","tag--date")
                .attr("pointer-events","none")
                .attr("text-anchor", "start")
                .attr("alignment-baseline","hanging")
                .attr("font-size", 12)
                .attr("fill", "grey");

    tag.append("tspan").attr("class","tag--stock")
                .attr("pointer-events","none")
                .attr("text-anchor", "start")
                .attr("alignment-baseline","hanging")
                .attr("font-size", 12)
                .attr("fill", "grey");
    
    updateLabels();
    function draggRate(d) {
            xMove += d3.event.dx;
            moveGraph();
    }
    
    function moveGraph(){
            if(xMove>0){xMove =0}
            if(xMove<(-(grapWidth-width))){xMove = -(grapWidth-width-42)}
            chartGroup.select(".steamgraph").attr("transform", "translate("+xMove+","+(-height/2)+")")
            chartGroup.select(".axis--x").attr('transform','translate('+xMove+','+ (height*0.68)+')')
            monthLabel.attr('transform','translate('+xMove+',0)');
            bgMonthLabels.attr('transform','translate('+xMove+',0)');
    }
    function updateLabels(){
        series.forEach(function(d,i){
            //console.log(d.key);
            let liElem = d3.select(labelsId).append("li").attr("class", "list-inline-item");
            liElem.append("div").attr("class", "color-circle").style("background-color", color(i));
            liElem.append("span").text(d.key);
        })
    }
});

let time = d3.timeParse("%Y-%m-%d-%H");
let timeNoHour = d3.timeParse("%d/%m/%y");

function dateComp(a, b) {
    if(time(a.Date+"-"+a.Hour)>=time(b.Date+"-"+b.Hour)){
        return true;
    }else{
        return false;
    };
}

function dateCompNoHour(a, b) {
    if(timeNoHour(a._Date)>=timeNoHour(b._Date)){
        return true;
    }else{
        return false;
    };
}

function sortJsonByDate (d){
    if(d[0].hour){
        for(let i = 0; i<d.length -1; i++){
            for(let j = 0; j<d.length-i-1; j++){
                let x = dateComp(d[j], d[j+1]);
                if(x){
                    let tmp = d[j+1];
                    d[j+1] = d[j];
                    d[j] = tmp;
                }
            }
        }
        return d;
    } else {
        
        for(let i = 0; i<d.length -1; i++){
            for(let j = 0; j<d.length-i-1; j++){
                let x = dateCompNoHour(d[j], d[j+1]);
                if(x){
                    let tmp = d[j+1];
                    d[j+1] = d[j];
                    d[j] = tmp;
                }
            }
        }
        return d;
    }
}
}



