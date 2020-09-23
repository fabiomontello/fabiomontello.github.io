var h = 600;//window.innerHeight;
var w = h;
var zoom = 1;
var mapJson;
var data;
var slider;
var sliderValue;

function mercX(lon) {
  lon = radians(lon);
  var a = (128 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (128 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function preload() {
    var url = 'data/countriesgeo.json';
    mapJson = loadJSON(url);
    url = 'data/birthrate.json';
    data = loadJSON(url);
}

function setup(){
    createCanvas(w, h);
    console.log(h);
    zoom = h/480;
    var sliderW = parseFloat((w*0.7)-20);
    //noLoop();
    //imageMode(CENTER);
    slider = createSlider(1960, 2015, 1);
    slider.position(((window.innerWidth-w)/2)+30, document.body.offsetHeight  +110);
    console.log(document.body.offsetHeight);
    slider.style('width', sliderW+"px");
    
}

function draw(){
    if(sliderValue != slider.value()){
        background(252);
        strokeWeight(0.2);
        stroke(0,0,0);
        sliderValue = slider.value()
        drawWorld(sliderValue);
        stroke(0,0,0);
        textSize(12);
        textStyle(NORMAL);
        for(var i = 0; i< 7; i++){
            strokeWeight(1);
            fill(255, 212, 0,map(i,0,6,245,18));
            rect (20,(h-250)+i*20, 15, 15);
            fill(0,0,0);
            strokeWeight(0);
            var str = parseInt(map(i,0,7,60,0))+" > "+parseInt(map(i+1,0,7,60,0));
            text(str,45,12.5+((h-250)+i*20));
        }
    }
}

function drawWorld(year){
    year = parseInt(year).toString();
    fill(255);
    stroke(126);
    strokeWeight(0.2);
    for(var j in mapJson['features']){
        var datum = 0;
        for (var s in data){
            if(data[s].CC == mapJson['features'][j].id){
                datum = data[s][year];
                break;
            }
        }
        if( datum == ".."){
             fill(245,245,245);
        }else{
            var color = map (datum, 5, 60, 18, 245);
            fill(255, 212, 0,color);
        }
        
        
        if(mapJson['features'][j]['geometry']['type'] == 'Polygon') {
            beginShape();
            for (var i in mapJson['features'][j]['geometry']['coordinates'][0]){
                    vertex((mercX(mapJson['features'][j]['geometry']['coordinates'][0][i][0])), (mercY(mapJson['features'][j]['geometry']['coordinates'][0][i][1])));
            }
            endShape();
        } else {
            for(var p in mapJson['features'][j]['geometry']['coordinates']) {
                //console.log(mapJson['features'][j]['geometry']['coordinates'][p][0]);
                beginShape();
                for (var i in mapJson['features'][j]['geometry']['coordinates'][p][0]){
                        vertex((mercX(mapJson['features'][j]['geometry']['coordinates'][p][0][i][0])), (mercY(mapJson['features'][j]['geometry']['coordinates'][p][0][i][1])));
                }
                endShape();
            }
        }
    }
    fill(128,128,128);
    strokeWeight(0);
    textSize(62);
    textStyle(BOLD);
    text(year, (w - 150), (h-20));
}