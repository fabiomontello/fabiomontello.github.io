var font = {
            normal: 16,
            big: 20,
            label: 14,
           }
function ageamountscale(paddingToggle, id){
    
let margin = {left: 0, right: 0, top:0, bottom: 170};

let height = 600;
let width = 600;

let viewBox = "0 0 "+width+" "+height;
let svg = d3.select(id).append("div")
   .classed("svg-container", true)
   .append("svg")
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", viewBox)
   .classed("svg-content-responsive", true);
    
if(paddingToggle){$(id).children().eq(2).css("padding-bottom",((height/width)*100)+"%");}
let chartGroup = svg.append("g");

let palette =["#e09f3e","#45a094", "#3d73a2"];

    
let numOfHex = 8;
    
d3.json('data/ageamountscale.json').get(function(error,data){
    if(error) throw error;
    //console.log("HERE!!")
    //console.log(data);
    //console.log(data.reverse());
    let rangeData =[];
    for(let i = 0; i< data.length; i++){
        rangeData.push(data[i].type);
    }
    
    let relHeight = height-margin.top-margin.bottom;
    //console.log(rangeData);
    numOfHex  = d3.max(data, function(d,i){return d3.max(d.data, function(t,j){return t.total;});});
    let r = d3.scaleLinear().domain([0, numOfHex]).range([ 0, relHeight/2]);
    //let y = d3.scaleLinear().domain([10,d3.max(data, function(d,i){return d.rate;})+5]).range([height-margin.bottom-margin.top, margin.top]);
    chartGroup.attr("transform", "translate(0,-25)")
    chartGroup.append("g").attr("class", "axis axis--r").call(d3.axisTop(r)).attr("transform","translate("+width/2+","+((height/2)-margin.top)+") rotate(30)");
    chartGroup.select(".axis--r .domain").remove();
    chartGroup.selectAll(".axis--r .tick line").remove();
    chartGroup.selectAll(".axis--r .tick text")
                .attr("y", -10)
                .attr("dy", "0em")
                .attr("font-size", font.label)
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("transform", "rotate(-30)");
    
    //chartGroup.selectAll(".axis--r .tick:not(:first-of-type) text").attr("y", -10);
    
    let hexbin = d3.hexbin();
    
    let hexGroup = chartGroup.append("g").attr("transform", "translate(" + (width/2) + "," +  (height/2-margin.top) + ")");
    let hexSpace = (relHeight)/(2*(numOfHex));
    let hexRad = hexSpace*(numOfHex);
    
    let textGroup = hexGroup.append("g");
    
    for(let i = 0; i< data[0].data.length; i++){
        textGroup.append("text")
            .attr("transform", "translate("+((hexRad+15)*Math.cos(-Math.PI/2+(i*Math.PI/3)))+","+((hexRad+15)*Math.sin(-Math.PI/2+(i*Math.PI/3)))+")")
                .text(data[0].data[i].range)
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle");
    }
    
    for(let i = 0; i< numOfHex; i++){
        hexGroup.append("path")
            .attr("d", hexbin.hexagon([hexSpace*(i+1)]))
            .attr("fill", "none")
            .attr("stroke", "white").style("stroke-dasharray", ("2,5"))
            .attr("opacity", 0.5); 
    }
    
    for(let i = 0; i< 6; i++){
      hexGroup.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", hexRad*Math.cos(Math.PI/6+(i*Math.PI/3)))
        .attr("y2", hexRad*Math.sin(Math.PI/6+(i*Math.PI/3)))
        .attr("stroke", "white").style("stroke-dasharray", ("4, 5"))
        .attr("opacity", 0.5);        

    }
    
    let areaRad = d3.areaRadial().curve(d3.curveLinearClosed)
            .angle(function(d,i){ 
                //let radious = r(d.total);
                let angle = i*(2*Math.PI)/6;
                return angle;
            })
            .innerRadius(function(){ return 0;})
            .outerRadius(function(d,i){ 
                let radious = r(d.total);
                //let angle = radious*Math.sin(i*(2*Math.PI)/6);
                return radious;
            });

    data.forEach(function(d,i){        
        chartGroup.append("g")
            .attr("class", function(){ return "area--"+i;})
            .attr("transform", "translate("+width/2+","+(height/2-margin.top)+")")
        .append("path")
          .attr("fill", palette[i])
          .attr("fill-opacity", 0.1)
          .attr("stroke", palette[i])
          .attr("stroke-width", 4)
          .attr("d", areaRad(d.data)+"Z")
            .on("mouseover", function(){
                d3.select(id).select(".number--"+i).transition().duration(250).attr("opacity",1);
            })
            .on("mouseout", function(){
                d3.select(id).select(".number--"+i).transition().duration(250).attr("opacity",0);
            });
        
        let numberGroup = chartGroup.append("g")
            .attr("class", function(){ return "number--"+i;}).attr("opacity",0)
            .attr("transform", "translate("+width/2+","+(height/2-margin.top)+")");
        
        numberGroup.selectAll("rect")
            .data(d.data).enter()
                .append("rect")
                        .attr("x",function(d,i){ return r(d.total)*Math.cos(-Math.PI/2+(i*Math.PI/3))-9;})
                        .attr("y",function(d,i){ return r(d.total)*Math.sin(-Math.PI/2+(i*Math.PI/3))-9;})
                        .attr("rx",10)
                        .attr("ry",10)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", palette[i]);
        
        numberGroup.selectAll("text")
            .data(d.data).enter()
                .append("text")
                    .text(function(d,i){ return d.total;})
                        .attr("x", function(d,i){ return r(d.total)*Math.cos(-Math.PI/2+(i*Math.PI/3));})
                        .attr("y", function(d,i){ return r(d.total)*Math.sin(-Math.PI/2+(i*Math.PI/3));})
                        .attr("fill", "white")
                        .attr("font-size", font.big)
                        .attr("text-anchor","middle")
                        .attr("alignment-baseline", "central");

    });

    let spaceLabel = width/(data.length+1);
    data.forEach(function(d,i){
        let labelGroup = chartGroup
                        .append("g")
                            .attr("class", "label--"+i)
                            .attr("transform", "translate("+(i+1)*spaceLabel+","+(height)+")");
        
        labelGroup.append("text")
                    .text(d.type)
                        .attr("fill","white")
                        .attr("text-anchor","middle")
                        .attr("alignment-baseline", "ideographic");
        
        labelGroup.append("rect")
                        .attr("x",-13)
                        .attr("y",-40)
                        .attr("rx",10)
                        .attr("ry",10)
                        .attr("stroke-width", 4)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("fill", palette[i])
                        .attr("stroke", palette[i])
                        .on("click", function(){
                           if(d3.select(id).select(".label--"+i).select("rect").attr("fill") == "transparent"){
                               d3.select(id).select(".label--"+i).select("rect").attr("fill", palette[i]);
                               d3.select(id).select(".area--"+i).select("path").attr("stroke", palette[i]).attr("fill", palette[i]);
                           } else{
                               d3.select(id).select(".label--"+i).select("rect").attr("fill", "transparent"); 
                               d3.select(id).select(".area--"+i).select("path").attr("stroke", "none").attr("fill","none");
                            }
        });
        
        
    });
    /*   
    chartGroup.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y).ticks(4).tickFormat(d => d + "%")).attr("transform","translate("+(margin.left)+","+(margin.top)+")");
    
    chartGroup.append("g").attr("class", "axis axis--x").call(d3.axisBottom(x)).attr("transform","translate("+(-6)+","+(height-margin.bottom)+")");

    chartGroup.selectAll(".tick line").remove();
    chartGroup.selectAll(".tick text").attr("font-size", font.normal);
    chartGroup.selectAll(".domain").remove();
    
    chartGroup.select(".axis--x").selectAll(".tick text").attr("text-anchor", "middle").attr("font-size", font.label);
    
    //chartGroup.select(".axis--y").select(".tick:first-of-type").remove(); 
    //chartGroup.select(".axis--y").select(".tick:last-of-type").remove(); */
    
    /*   
    chartGroup.append("g").attr("class", "axis axis--x").call(d3.axisBottom(x).ticks(4).tickFormat(d => d + "%"));

    chartGroup.select(".axis--x").selectAll(".tick line").remove();//.attr("stroke", "#777");
    chartGroup.selectAll(".domain").remove();
    chartGroup.select(".axis--x").select(".tick:first-of-type").remove(); 
    chartGroup.select(".axis--x").select(".tick:last-of-type").remove(); 
    chartGroup.select(".axis--x").selectAll(".tick text").attr("font-size", font.label)*/

    //let barGroup = chartGroup.append("g").attr("class","quality--bars");
    
   /* barGroup.selectAll("line")
            .data(data).enter()
            .append("line")
                .attr("x1", function(d,i){ return x(1);})
                .attr("y1", function(d,i){ return (y.bandwidth()-20)/2+10+margin.top+y(d.type);})
                .attr("x2", function(d,i){ return x(100);})
                .attr("y2", function(d,i){ return (y.bandwidth()-20)/2+10+margin.top+y(d.type);})
                .attr("stroke","grey");*/
    /*
    barGroup.append("g").selectAll("rect")
            .data(data).enter()
            .append("rect")
                .attr("x", function(d,i){ return x(0);})
                .attr("y", function(d,i){ return 5+margin.top+y(d.type);})
                .attr("width", width-margin.left-margin.right)
                .attr("height", y.bandwidth()-10)
                .attr("fill",palette[2]);*/
    
   /* barGroup.append("g").selectAll("rect")
            .data(data).enter()
            .append("rect")
                .attr("x", function(d,i){ return x(d.type);})
                .attr("y", function(d,i){ return y(d.rate);})
                .attr("width",  x.bandwidth()-10)
                .attr("height", function(d,i){ return (height-margin.bottom)-y(d.rate);})
                .attr("fill",palette[1]);
    barGroup.append("g").selectAll("text")
            .data(data).enter()
            .append("text")
                .attr("class", function(d,i){ return "age-label-"+i;})
                .attr("x", function(d,i){ return x(d.type) +(x.bandwidth()/2)-5;})
                .attr("y", function(d,i){ return y(d.rate);})
                .attr("pointer-events", "none")
                .text(function(d,i){ return d.rate+"%";})
                .attr("text-anchor", "middle")
                .attr("alignment-baseline","ideographic")
                .attr("fill", "white")
                .attr("font-size", font.normal)
                .attr("font-weight", "bolder")
                .attr("opacity",1);
*/

});

}