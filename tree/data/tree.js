
            var width = window.innerWidth;
            var height = window.innerHeight;
            console.log(width+" | "+    height);
            var margin = {left: 50,right:50,top:40,bottom:0};

            var tree = d3.tree().size([2 * Math.PI, 250-margin.right-margin.left]);
            //var tree = d3.tree().size([width,height]);

            var svg = d3.select('body').append('svg').attr('width',width-margin.left-margin.right).attr('height',height-margin.top-margin.bottom);
            var chartGroup = svg.append('g').attr('transform','translate('+margin.left+','+margin.top+')');
            var g = chartGroup.append("g").attr("transform", " translate("+width/2+","+height/2+")");
            var color = d3.scaleOrdinal()
                        .domain([0, 3])
                        .range(d3.schemeCategory10);
            d3.json("data/uniud.json").get(function(error,data){
                console.log(error);
                console.log(data[0]);
                var root = d3.hierarchy(data[0]);
                tree(root);
                for(var i = 0; i< root.height; i++){
                    chartGroup.append("circle")
                            .attr("cx",(width/2)  )
                            .attr("cy",(height/2))
                            .attr("r",((250-margin.right-margin.left)/4)*(i+1))
                            .attr("stroke-width","0.5")
                            .attr("stroke","lightgray")
                            .attr("fill", "none"); 
                }
              
              root.descendants().slice(1).forEach(function(d,i){d.color = "lightgray";});
              root.descendants().forEach(function(d,i){d.path = false;});
              for(var p = 0; p<4; p++){
                   root.children[p].descendants().slice(1).forEach(
                        function(d,i){
                            d.color = color(p);
                        }
                   );
               }
                console.log(root);
                chartGroup.selectAll("line")
                    .data(root.descendants().slice(1))
                    .enter().append("line")
                          .attr("id", function(d,i){return "l"+i;})
                            .attr("x1",function(d){return d.y*Math.cos(d.x);})
                            .attr("y1",function(d){return d.y*Math.sin(d.x);})
                            .attr("x2",function(d){return d.parent.y*Math.cos(d.parent.x)})        
                            .attr("y2",function(d){return d.parent.y*Math.sin(d.parent.x);})
                            .attr("stroke",function(d,i){ console.log(d.children);return d.color;})
                            .attr("stroke-width","1")
                          .attr('transform',' translate('+width/2+','+height/2+')');
                
                 var node = g.selectAll(".node")
                    .data(root.descendants())
                    .enter().append("g")
                      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
                      .attr("transform", function(d) { return "translate(" + d.y*Math.cos(d.x)+","+ d.y*Math.sin(d.x) + ")"; });
                
                node.append("circle")
                      .attr("r","2")
                
                node.append("text")
                        .text(function(d){ 
                            if(d.children){
                                return d.data.name;
                            }else{
                                return d.data.corso;
                            }
                        })
                        .attr("display", function(d,i){
                            if(d.children){
                                return "none";
                            }else{
                                return "block";
                            }
                        })
                        .attr("class",function(d,i){
                            if(d.children){
                                return "text--internal";
                            }else{
                                return "text--leaf";;
                            }
                        })
                        .attr("text-anchor", function(d){
                                if(d.children){
                                            return "middle";
                                  }else{
                                        if(d.x >= Math.PI/2 && d.x <= 3/2*Math.PI){ 
                                                return "end";
                                        }else{
                                                return "start";
                                        }
                                 }
                                
                            })
                        .attr("alignment-baseline", "middle")
                        .attr("transform", function(d) { 
                                if(d.x >= Math.PI/2 && d.x <= 3/2*Math.PI){ 
                                        return "rotate(" +(180+d.x * (180/Math.PI)) + ") translate("+ (-20)+",0)";
                                }else{
                                        return "rotate(" +(d.x * (180/Math.PI)) + ") translate("+ (20)+",0)";
                                }; 
                        })
                        .attr("font-size","10");
                node.on("mouseover", function(v,i){
                        do{ 
                            v.path = true;
                            if(v.data.name){
                                console.log(v.data.name + " | "+v.height);
                                switch(v.height){
                                    case 1:
                                        switch(v.data.name){
                                            case "L":
                                                document.getElementById("tipo").innerHTML =  "Laurea Triennale";
                                                break;
                                            case "LM":
                                                document.getElementById("tipo").innerHTML =  "Laurea Magistrale";
                                                break;
                                            case "LCU":
                                                document.getElementById("tipo").innerHTML =  "Laurea a ciclo unico";
                                                break;
                                            }
                                        break;
                                    case 2:
                                         document.getElementById("dipartimento").innerHTML =  v.data.name;
                                        break;
                                    case 3:
                                        switch(v.data.name){
                                            case "Scientifica":
                                               document.getElementById("infobox").style.borderColor = color(0);
                                                break;
                                            case "Umanistica e della formazione":
                                               document.getElementById("infobox").style.borderColor = color(1);
                                                break;
                                            case "Economico-giuridica":
                                               document.getElementById("infobox").style.borderColor = color(2);
                                                break;
                                            case "Medica":
                                               document.getElementById("infobox").style.borderColor = color(3);
                                                break;
                                         }
                                         document.getElementById("area").innerHTML =  v.data.name;
                                        break;
                                
                                }
                            }else{
                                //console.log(v.data.corso + " | "+v.height);
                                document.getElementById("facolta").innerHTML = v.data.corso;
                            }
                        }while (v = v.parent);
                        d3.select("body")
                             .data(root.descendants())
                             .enter().selectAll("line")
                                .attr("stroke",function(d,i){if(d.path){return "black"}else{return d.color;}})
                                .attr("stroke-width", function(d,i){if(d.path){return "2"}else{return "1";}});
                    })
                node.on("mouseout", function(){
                    root.descendants().forEach(function(d,i){d.path = false;});
                     d3.select("body")
                             .data(root.descendants())
                             .enter().selectAll("line")
                                .attr("stroke",function(d,i){return d.color;})
                                .attr("stroke-width","1");
                    document.getElementById("infobox").style.borderColor = "black";
                    document.getElementById("dipartimento").innerHTML = "";
                    document.getElementById("tipo").innerHTML = "";
                    document.getElementById("area").innerHTML = "";
                    document.getElementById("facolta").innerHTML = "";
                })
            });