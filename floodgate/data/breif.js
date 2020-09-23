function breif(togglePadding, id, dataset, linecolor, underLabel, numbersAfterComma){
    let margin = {left: 0, right: 0, top: 180, bottom: 40};

    let height = 300;
    let width = 500;

    let viewBox = "0 0 "+width+" "+height;
    let svg = d3.select(id).append("div")
       .classed("svg-container", true)
       .append("svg")
       .attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", viewBox)
       .classed("svg-content-responsive", true);

    //$(id).children().eq(2).css("padding-bottom",((height/width)*100)+"%");

    let chartGroup = svg.append("g");
    
    d3.json(dataset).get(function(error,data){
        if(error) throw error;
        console.log(data);
        let rangeData =[];
        for(let i = 0; i< data.length; i++){
            rangeData.push(data[i].date);
        }
        let x = d3.scalePoint().domain(rangeData).range([margin.left,width-margin.right]);
        let y = d3.scaleLinear().domain([d3.min(data,function(d,i){ return d.value;}), d3.max(data,function(d,i){ return d.value;})]).range([margin.top,height-margin.bottom]);
        
        let line = d3.line()
            .x(function(d, i) { return x(d.date); }) 
            .y(function(d, i) { return y(d.value); }) 
            .curve(d3.curveLinear);
        
        chartGroup.append("path")
                .attr("d",line(data))
                .attr("fill","none")
                .attr("stroke",linecolor).attr("stroke-width",10);
        
        chartGroup.append("text")
                .text(data[data.length-1].value.toFixed(numbersAfterComma))
                .attr("x", width/2)
                .attr("y", height*0.33)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "ideographic")
                .attr("font-size", 102)
                .attr("text-weight","bolder" )
                .attr("fill","white");
        
        chartGroup.append("text")
                .text(underLabel)
                .attr("x", (width/2)+10)
                .attr("y", height*0.33)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "hanging")
                .attr("font-size", 34)
                .attr("fill","#95989A");
    });
}


