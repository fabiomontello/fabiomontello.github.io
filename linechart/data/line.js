            var margin = {left: 30, right: 50, top: 30, bottom: 30};
             var height = window.innerHeight - margin.top;
             var width = window.innerWidth - margin.left;
             if(width > 1024){
                 width = 1024;
             }
             if(height > 468){
                 height = 468;
             }
             var svg = d3.select("body").append("svg").attr("height", (height)).attr("width", (width));
             var chartGroup = svg.append("g");
             //console.log(document.getElementsByTagName("svg").innerWidth);
             var parseDate = d3.timeParse("%Y");
            var n = 0;
             d3.csv("data/birthrate.csv")
           /* Data from database: World Development Indicators,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
              Last Updated: 06/01/2017,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,*/
               .row(function(d){ 
                    var tmax = 0;
                    var tmaxyear = 0;
                    var array = [];
                    var valarray = [];
                    for(var i in d){ 
                      if(!isNaN(d[i])){
                            if(tmax<  parseFloat(d[i])){
                                tmax =  parseFloat(d[i]); 
                                tmaxyear = parseDate(i);
                            }
                            array.push({year: parseDate(i), value: parseFloat(d[i])});
                            valarray.push(d[i]);
                          }
                     }
                    console.log(array.length);
                    if(array.length <= 10){
                        return ;
                    }else{
                       /*console.log(n+" "+d.CN+" "+d3.max(array, function(d){ return d.value})+" | "+d3.min(array, function(d){ return d.value})+"  "+Math.max.apply(null, valarray)+"%/"+tmax);
                        n++;*/
                        return {statename: d.CN, statecode: d.CC, co2: array, max: tmax, maxyear: tmaxyear };
                    }
                })
            
               .get(function(e,data){
                if (e) throw e;
                 console.log(data);
                var x = d3.scaleTime().domain([parseDate(1959), parseDate(2015)]).range([margin.left + 100, (width-margin.right-100)]);
                var y = d3.scaleLinear().domain([5,60]).range([(height-margin.bottom),margin.top]);
                
                 
                var line = d3.line()
                    .curve(d3.curveNatural)
                    .x(function(d,i){ return x(d.year);})
                    .y(function(d,i){ return y(d.value);});

                chartGroup.append("g")
                        .attr("class", "axis axis--x")
                        .attr("transform", "translate(0, "+(height-margin.top)+")")
                        .call(d3.axisBottom(x));
                 
                chartGroup.append("g")
                        .attr("class", "axis axis--y")
                        .attr("transform", "translate("+(parseInt(margin.left)+100)+", 0)")
                        .call(d3.axisLeft(y));
                 
                chartGroup
                    .append("g")
                    .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 70)
                      .attr("x", 0-(height / 2))
                      .attr("dy", "1em")
                      .style("text-anchor", "middle")
                      .text("Number of births every 1000 people");    
                 
                 data.forEach(function(d,i){
                    var color;
                    if(d.statename=="NaN"){color = "black";}else{ color ="grey";};
                    var weight;
                    if(d.statename=="NaN"){weight = 4;}else{ weight = 1;};
                    var pathGroup = chartGroup.append("g").attr("class","group"+i);
                     
                    pathGroup
                        .append("path")
                            .attr("fill","none")
                            .attr("stroke", color)
                            .attr("stroke-width", weight)
                            .attr("d", line(d.co2));
                     
                     pathGroup
                         .append("text")
                            .attr("x", function(){return x(parseDate(2015));})
                            .attr("y", function(){ return y(d.co2[d.co2.length-1].value);})
                            .attr("id",function(){ return "lab"+d.statecode;})
                            .attr("display", "none")
                            .attr("fill","#ffd400")
                            .attr("dy", "5px")
                            .attr("dx", "5px")
                            .text(function(){ return d.statename;});
                     
                     pathGroup
                           .on("mouseover", function(){
                                str ="#lab"+d.statecode;
                                d3.select(str)
                                    .attr("display","block");
                            })
                            .on("mouseout", function(){
                                str ="#lab"+d.statecode;
                                d3.select(str)
                                    .attr("display","none");
                            })
                });
                    
                chartGroup.append("g")
                            .attr("class","circles")
                    .selectAll("circle")
                    .data(data)
                        .enter().append("g")
                                .attr("class",function(d,i){ return "group"+i;})
                            .append("circle")
                                .attr("cx", function(d,i){return x(d.maxyear);})
                                .attr("cy", function(d,i){ return y(d.max);})
                                .attr("r", 3)
                                .attr("fill", "none")
                                .attr("stroke", "#ffd400")
                                .attr("stroke-width", 2)
                        .on("mouseover", function(d,i){
                               var str ="#info"+d.statecode;
                                d3.select(str)
                                  .attr("display","block");
                                str ="#infobox"+d.statecode;
                                d3.select(str)
                                  .attr("display","block");
                                str ="#lab"+d.statecode;
                                d3.select(str)
                                    .attr("display","block");
                                str =".group"+i+" path";
                                d3.select(str)
                                    .attr("stroke","#ffd400")
                                    .attr("stroke-width",2);
                            })
                        .on("mouseout", function(d,i){
                                var str ="#info"+d.statecode;
                                d3.select(str)
                                    .attr("display","none");
                                str ="#infobox"+d.statecode;
                                d3.select(str)
                                    .attr("display","none");
                                str ="#lab"+d.statecode;
                                d3.select(str)
                                    .attr("display","none");
                                str =".group"+i+" path";
                                d3.select(str)
                                    .attr("stroke","grey")
                                    .attr("stroke-width",1);
                            });
                 
                 
                     
                    var infogroup = chartGroup.append("g")
                            .attr("class","infos")
                    .selectAll("text")
                    .data(data)
                        .enter().append("g")
                                .attr("class",function(d,i){ return "group"+i;});
                 
                     infogroup.append("rect")
                            .attr("x", function(d,i){return x(d.maxyear);})
                            .attr("y", function(d,i){ return y(d.max)-75;})
                            .attr("width", 250)
                            .attr("height", 75)
                            .attr("id",function(d,i){ return "infobox"+d.statecode;})
                            .attr("stroke","#ffd400")
                            .attr("fill","white")
                            .attr("display","none");
                 
                    var infoText = infogroup.append("text")
                                                .attr("id",function(d,i){ return "info"+d.statecode;})
                                                .attr("fill","black")
                                                .attr("display","none");
                                                //.attr("dy", "1em");
                        infoText.append("tspan")
                                .attr("x", function(d,i){return x(d.maxyear)+15;})
                                .attr("y", function(d,i){ return y(d.max)-45;})
                                .text(function(d,i){ return  "State: "+d.statename;})
                        infoText.append("tspan")
                                .attr("x", function(d,i){return x(d.maxyear)+15;})
                                .attr("y", function(d,i){ return y(d.max)-30;})
                                .text(function(d,i){ return  "Year: "+d.maxyear.getFullYear();})
                        infoText.append("tspan")
                                .attr("x", function(d,i){return x(d.maxyear)+15;})
                                .attr("y", function(d,i){ return y(d.max)-15;})
                                .text(function(d,i){ return  "Births per 1000 people: "+(d.max.toFixed(3)).toString();});
                 
                    
                   
               
            });
            
         