//Sketch Variables
let enabled_zoom = false;
let roads_id = 0;
let last_placed_id = 1000;
//Map vars
let bg;
let c_ratio = 6/10;
let expansions = 14;
let tiles_per_expansion = 8;
let total_tiles = expansions * tiles_per_expansion;
let d;
let t;
let q;
let sin;
let cos;
let tileHeight;
let tileWidth;
//Coordinates vars
let x_coord = 0;
let y_coord = 0;
//Selected Tile
let selectedX = -1;
let selectedMapX = -1;
let selectedY = -1;
let selectedMapY = -1;
//Mouse-on-top Tile
let onX = -1;
let onMapX = -1;
let onY = -1;
let onMapY = -1;
//Selected object to place
let selectedObjName = "null"
let ObjSelect;
let oldSel;
let oldCustom;
let custom = false;
//html objects
let input_loadFile = null;
let input_loadFile2 = null;
//Zoom vars
let zoom = 1.00;
let zMin = 0.9;
let zMax = 9.00;
let sensativity = 0.005;
let Cx = 0;
let Cy = 0;

class Obj {
	constructor(x, y, id, itemName) {
		this.id = id;
		this.itemName = itemName;
		//Isometric coordinates
		this.tileX = x;
		this.tileY = y;
		//console.log(x + ", isom " + y);
		//Actual screen position (may cahnge)
		//this.recalcCoords();
		this.coordY = (y*((canvas_size*c_ratio)/total_tiles)-(height/2)+c_ratio*(x*(canvas_size/total_tiles)+(width/2)))/2;
		this.coordX = x*(canvas_size/total_tiles)+(width/2)-(this.coordY/c_ratio);
	}

	recalcCoords(){
		this.coordY = (this.tileY*((canvas_size*c_ratio)/total_tiles)-(height/2)+c_ratio*(this.tileX*(canvas_size/total_tiles)+(width/2)))/2;
		this.coordX = this.tileX*(canvas_size/total_tiles)+(width/2)-(this.coordY/c_ratio);
	}

	draw(){
		//Actual position (Changes on window resizings)
		//let cY = (this.tileY*((canvas_size*c_ratio)/total_tiles)-(height/2)+c_ratio*(this.tileX*(canvas_size/total_tiles)+(width/2)))/2;
		//let cX = this.tileX*(canvas_size/total_tiles)+(width/2)-(cY/c_ratio);
		//console.log(cX + " sketch " + cY);
		let cY = this.coordY;
		let cX = this.coordX;
		//banana
		if 		(this.itemName == "tree22") fill(255,238,153);
		else if (this.itemName == "tree21") fill(255,230,102);
		else if (this.itemName == "tree23") fill(255,221,51);
		//coconut
		else if (this.itemName == "tree24") fill(230,115,0);
		else if (this.itemName == "tree25") fill(179,89,0);
		else if (this.itemName == "tree26") fill(128,64,0);
		//palm
		else if (this.itemName == "tree27") fill(0,179,0);
		else if (this.itemName == "tree28") fill(0,130,0);
		else if (this.itemName == "tree29") fill(0,80,0);
		//other
		else if (this.itemName.includes("road")) fill(39, 55, 70);
		else if (this.itemName.includes("rock")) fill(240, 178, 122);
		else if (this.itemName.includes("bricks")) fill(202, 207, 210);
		else if (this.itemName.includes("Blue")) fill(93, 173, 226);
		else if (this.itemName.includes("Daisy")) fill(136, 78, 160);
		//else if (this.itemName.includes("")) fill();
		else 	fill(134, 37, 91);

		strokeWeight(0.5);
		beginShape();
			vertex(cX, cY);
			vertex(cX + tileWidth/2, cY + tileHeight/2);
			vertex(cX, cY + tileHeight);
			vertex(cX - tileWidth/2, cY + tileHeight/2);
		endShape(CLOSE);
	}
}

class Objects{
	constructor() {
		this.objects = [];
	}
	add(x, y, itemName){
		let occupied = false;
		let id;
		for (let i = 0; i < this.objects.length; i++){
			if(this.objects[i].tileX === x && this.objects[i].tileY === y){
				occupied = true;
			}
		}
		if(occupied === false){
			if(itemName === "road") id = roads_id;
			else { 
				last_placed_id = IDCustom.value();
				id = last_placed_id;
				last_placed_id++;
				//console.log(last_placed_id);
				IDCustom.value(last_placed_id);
			}

		this.o = new Obj(x, y, id, itemName);
		this.objects.push(this.o);
		console.log(this.objects);
		}
		else{
			console.log("Occupied tile");
			//TODO
			//Substitute element
		}
	}

	delete(posX, posY){
		for (let i = 0; i < this.objects.length; i++){
			if(this.objects[i].tileX === posX && this.objects[i].tileY === posY){
				this.objects.splice(i,1);
				return true;
				//i = this.objects.length;
			}
		}
		return false;
		//console.log(this.objects);
	}

	draw(){
		for (let i = 0; i < this.objects.length; i++){
			//console.log(i+": "+this.objects[i].id)
			this.objects[i].draw();
		}
	}

	len(){

		return this.objects.length;
	}

	toJSON(){
		let topObjects = '{\n "objects": [\n';
		let endObjectsTopRoads = '\n ],\n "roads": [\n';
		let endRoads =  '\n ]\n}';
		
		let Objs = "";
		let obj_count = 0;
		let Roads = "";
		let roads_count = 0;
		
		for (let i = 0; i < this.objects.length; i++){
			if(this.objects[i].itemName === 'road'){
				//Roads
				if(roads_count!=0){Roads = Roads + ',\n'}
				Roads = Roads + '    "' + this.objects[i].tileX + ',' + this.objects[i].tileY + '|' + this.objects[i].tileX + ',' + this.objects[i].tileY + '"';
				roads_count++;
			}else{
				//Objects
				if(obj_count!=0){Objs = Objs + ',\n'}
				Objs = Objs + '  {\n    "id":' + this.objects[i].id + ',\n    "itemName":"' + this.objects[i].itemName + '",\n    "position":"' + this.objects[i].tileX + ',' + this.objects[i].tileY + ',0",' + '\n    "referenceItem": null' + '\n  }';
				obj_count++;
			}
			
			let block = '';
		}
		let txt = topObjects + Objs + endObjectsTopRoads + Roads + endRoads;
		return txt;
	}

	recalcCoords(){
		for (let i = 0; i < this.objects.length; i++){
			this.objects[i].recalcCoords();
		}
	}

	saveLocal(){

		save(this.objects, 'empire-project.json');
		console.log("JSON project downloaded");

		localStorage.setItem("localSave", JSON.stringify(this.objects));
		console.log("Saved (localStorage)");

		alert("Saved in the browser local Storage.\nSaved in the downloaded file.");
	}

	loadLocal(){
		let obj_arr = JSON.parse( localStorage.getItem("localSave"));
		this.saveLoadedObj(obj_arr);
	}

	loadFile(){
		if(input_loadFile !== null) input_loadFile.hide();
		input_loadFile = createFileInput(handleFile);
		input_loadFile.parent('file-holder');
	}

	saveLoadedObj(obj_arr){
		
		console.log(obj_arr);

		let maxID = -1;
		console.log("Loaded (from file or localStorage):");
		console.log(obj_arr);
		this.objects = [];
		for (let i = 0; i < obj_arr.length; i++) {
			let o = new Obj(obj_arr[i].tileX, obj_arr[i].tileY, obj_arr[i].id, obj_arr[i].itemName);
			this.objects.push(o);
			if(maxID < obj_arr[i].id) maxID = obj_arr[i].id;
		}
		console.log("Converted to objects:");
		console.log(this.objects);
		if(maxID !== -1){
			last_placed_id = parseInt(maxID) + 1;
			IDCustom.value(last_placed_id);
		}

		updateJSON();
	}

	saveLoadedJson(obj_arr){
		console.log(obj_arr);
		let obj = obj_arr.objects;
		let roads = obj_arr.roads;
		console.log(obj);
		console.log(roads);

		let maxID = -1;

		// OBJECTS
		this.objects = [];
		for (let i = 0; i < obj.length; i++) {
			let aux = obj[i];
			let id_aux = aux.id;
			let itemName_aux = aux.itemName;
			let aux_pos = aux.position.split(",");
			let tileX_aux = aux_pos[0];
			let tileY_aux = aux_pos[1];

			let o = new Obj(tileX_aux, tileY_aux, id_aux, itemName_aux);
			this.objects.push(o);
			if(maxID < id_aux) maxID = id_aux;
			
		}
		// ROADS
		for (let i = 0; i < roads.length; i++) {
			let aux = roads[i].split("|")[0].split(",");
			let tileX_aux = aux[0];
			let tileY_aux = aux[1];
			let o = new Obj(tileX_aux, tileY_aux, roads_id, "road");
			this.objects.push(o);
		}

		// CHECK
		console.log("Converted to objects:");
		console.log(this.objects);
		if(maxID !== -1){
			last_placed_id = parseInt(maxID) + 1;
			IDCustom.value(last_placed_id);
		}

		updateJSON();
	}
}

function handleFile(file){	
	// Split file.data and get the base64 string
	let base64Str = file.data.split(",")[1];
	// Parse the base64 string into a JSON string
	let jsonStr = atob(base64Str);
	// Parse the JSON object into a Javascript object
	let obj_arr = JSON.parse(jsonStr);

	Objects.saveLoadedObj(obj_arr);
	input_loadFile.hide();
	input_loadFile = null;
}

function draw_map_area(){
	fill(12, 187, 55);
	noFill();
	strokeWeight(1);
	beginShape();
		vertex(width/2, 0);
		vertex(width, height/2);
		vertex(width/2, height);
		vertex(0, height/2);
	endShape(CLOSE);
}

function draw_tiles(){
	strokeWeight(0.5);
	for(let i = 0; i < expansions-1; i++){
		//EXPANSIONS baixEsquerra -> daltDreta
		beginShape();
		vertex((width/2)+cos*t*(i+1), sin*t*(i+1));
		vertex(cos*t*(i+1), (height/2)+sin*t*(i+1));
		endShape();
		//EXPANSIONS daltEsquerra -> baixDreta
		beginShape();
		vertex((width/2)-cos*t*(i+1), sin*t*(i+1));
		vertex(width-cos*t*(i+1), (height/2)+sin*t*(i+1));
		endShape();
	}
	strokeWeight(0.2);
	for(let i = 0; i < total_tiles-1; i++){
		//TOTS ELS TILES baixEsquerra -> daltDreta
		beginShape();
		vertex((width/2)+cos*q*(i+1), sin*q*(i+1));
		vertex(cos*q*(i+1), (height/2)+sin*q*(i+1));
		endShape();
		//TOTS ELS TILES daltEsquerra -> baixDreta
		beginShape();
		vertex((width/2)-cos*q*(i+1), sin*q*(i+1));
		vertex(width-cos*q*(i+1), (height/2)+sin*q*(i+1));
		endShape();
	}
}

function draw_mouse_on_top(){
	onMapX = floor(x_coord);
	onMapY = floor(y_coord);

	if( onMapX >= 0 && onMapX < total_tiles && onMapY >= 0 && onMapY < total_tiles){
		onY = (onMapY*((canvas_size*c_ratio)/total_tiles)-(height/2)+c_ratio*(onMapX*(canvas_size/total_tiles)+(width/2)))/2;
		onX = onMapX*(canvas_size/total_tiles)+(width/2)-(onY/c_ratio);
		fill(36, 143, 36);
		strokeWeight(0.2);
		beginShape();
			vertex(onX, onY);
			vertex(onX + tileWidth/2, onY + tileHeight/2);
			vertex(onX, onY + tileHeight);
			vertex(onX - tileWidth/2, onY + tileHeight/2);
		endShape(CLOSE);
	}
	else{
		onY = -1;
		onX = -1;
	}
}

function draw_selected(){
	if(selectedMapX >= 0 && selectedMapX < total_tiles && selectedMapY >= 0 && selectedMapY < total_tiles){
		fill(34, 97, 35);
		strokeWeight(0.7);
		beginShape();
			vertex(selectedX, selectedY);
			vertex(selectedX + tileWidth/2, selectedY + tileHeight/2);
			vertex(selectedX, selectedY + tileHeight);
			vertex(selectedX - tileWidth/2, selectedY + tileHeight/2);
		endShape(CLOSE);
	}else{
		selectedX = -1;
		selectedY = -1;
	}
}

function draw_menu(){
	fill(255);
	//Top left text
	text('JS Empire Editor v0.1 ~ Raise the Empires 2019-21', 10, 20);
	text('Mouse Pos: (' + floor(mouseX) + ', ' + floor(mouseY) + ')', 10, 40);
	if(x_coord >= 0 && x_coord <= total_tiles && y_coord >= 0 && y_coord <= total_tiles){
		text('Isometric coords: (' + floor(x_coord) + ', ' + floor(y_coord) + ')', 10, 60);
	}
	else{text('Isometric coords: ( - , - )', 10, 60);}
	text('Selected Tile Map-coordinates: (' + selectedMapX +','+ selectedMapY +')', 10, 80);
	text('Selected Tile Coordinates: (' + selectedX +','+ selectedY +')', 10, 100);
	//Bottom left text
	text('Selected object:' + selectedObjName, 10, height - 40);
	text('Last placed ID:' + last_placed_id, 10, height - 20);
}

function draw_saved(){
	//console.log("drawing saved")
	Objects.draw();
	//console.log("drawed saved")
}

function updateJSON(){

	JSONmap.html(Objects.toJSON());
}

function downloadJSON(){
	console.log("Download JSON");
	let txt = Objects.toJSON();
	console.log(txt);

	//save(txt, 'createdMap.txt');
	/*if (typeof txt === 'string') {
    	console.log("String!!!");
  	}*/
	save(txt.split("\n"), 'created-island.json.txt');
	//saveStrings(txt, 'createdMap');
}

function handleFile2(file){	
	let jsonStr = file.data;
	console.log(file);
	let type = file.subtype;
	// Parse the JSON object into a Javascript object
	let obj_arr;

	if      (type === "plain") {
		obj_arr = JSON.parse(jsonStr);
	}

	else if (type === "json" ) {
		let base64Str = file.data.split(",")[1];
		let jsonStr = atob(base64Str); // Parse the base64 string into a JSON string
		obj_arr = JSON.parse(jsonStr); // Parse the JSON object into a Javascript object
		//obj_arr = jsonStr;
	}

	else 	alert("Unsupported File Type. Should be a .txt or a .json");
	Objects.saveLoadedJson(obj_arr);
	input_loadFile2.hide();
	input_loadFile2 = null;
}

function loadFileJSON(){
	if(input_loadFile2 !== null) input_loadFile2.hide();
	input_loadFile2 = createFileInput(handleFile2);
	input_loadFile2.parent('file-holder-2');
}

function windowResized(){
	//Canvas
	canvas_size = windowWidth-35;
	resizeCanvas(canvas_size, canvas_size*c_ratio);
	//Dependent variables
	d = dist(0, height/2, width/2, 0);
	q = d/total_tiles;
	t = d/expansions;
	sin = (height/2)/d;
	cos = (width/2)/d;
	tileHeight = 2*sin*q;
	tileWidth = 2*cos*q;
	//Incorrect old values
	selectedX = -1;
	selectedMapX = -1;
	selectedY = -1;
	selectedMapY = -1;
	//recalculate all Objects Position
	Objects.recalcCoords();
}

function setup(){
	frameRate(60);
	canvas_size = windowWidth-35;
	var canvas = createCanvas(canvas_size, canvas_size*c_ratio);
	canvas.parent('sketch-holder');
	//createCanvas(windowWidth-35, (windowWidth-35)*c_ratio);
	Objects = new Objects();
	d = dist(0, height/2, width/2, 0);
	t = d/expansions;
	q = d/total_tiles;
	sin = (height/2)/d;
	cos = (width/2)/d;
	tileHeight = 2*sin*q;
	tileWidth  = 2*cos*q;
	//HTML select
	ObjSelect = select("#ObjSel");
	ObjCustom = select("#customName");
	IDCustom = select("#customID");
	JSONmap = select("#jsonMap");
	IDCustom.value(last_placed_id);
	//console.log(ObjSelect.value());
	//bg = loadImage("https://serving.photos.photobox.com/498457652e5862ae82ea4f1226d7a0a04e1d5bc20590fd7a2f2b20030c30f2bd1c36c9b9.jpg");
	bg = loadImage("https://i.imgur.com/6oW7vfR.jpg");
}

function draw(){
	//background(51, 51, 153);
	background(bg, 30, 55);
	//background(bg);
	//background(loadImage('map.png'));
	//background(bgd);
	textAlign(LEFT);
	fill(255);
	//Isometric coordinates
	x_coord = (mouseX - (width/2)  + ( (1/c_ratio) * mouseY ) ) * ( total_tiles / canvas_size );
	y_coord = (mouseY + (height/2) - (   c_ratio   * mouseX ) ) * ( total_tiles / (canvas_size * c_ratio) );
	//draw_menu(); <------------------ MENU...

	//translate(width/2,height/2);
  	//fill(0);
  	if (enabled_zoom){
  		scale(zoom);
  		translate((-(mouseX)+(width/2)/zoom), (-(mouseY)+(height/2)/zoom));
  		//translate(Cx, Cy);
	  	//translate((-(mouseX)+(width/2)/zoom), (-(mouseY)+(height/2)/zoom));
	  	//translate((-(mouse_X)+(width/2)/zoom), (-(mouse_Y)+(height/2)/zoom));
	  	//translate((-(mouseX/1.3*zoom)+(width/2)/zoom), (-(mouseY/1.3*zoom)+(height/2)/zoom));
  	}

  	if(ObjCustom.value() != oldCustom && ObjCustom.value()!=""){
  		custom = true;
  		selectedObjName = ObjCustom.value();
  	}
  	else if(ObjCustom.value()===""){
  		custom = false;
  		selectedObjName = ObjSelect.value();
  		ObjCustom.html('selectedObjName');
  	}
  	if(ObjSelect.value() != oldSel){
  		custom = false;
  		selectedObjName = ObjSelect.value();
  		ObjCustom.html('selectedObjName');
  	}
	//Save values for next loop iteration
	oldCustom = ObjCustom.value();
	oldSel = ObjSelect.value();
  	//console.log(ObjSelect.value());

	draw_map_area();

	draw_tiles();

	//draw_mouse_on_top();

	draw_selected();

	draw_saved();

	/* Mouse on top
	strokeWeight(3);
	beginShape();

	mouse_X = mouseX;
	mouse_Y = mouseY;

	point(mouse_X, mouse_Y);
	if (enabled_zoom) {
		mouse_X = mouseX/zoom;		//EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE  <-----
		mouse_Y = mouseY/zoom;
	};
	endShape();*/
}

function mouseClicked(){

	console.log('mouse Clicked');
	let oldX = selectedX;
	let oldY = selectedY;
	selectedMapX = floor(x_coord); //Isometric coordinates
	selectedMapY = floor(y_coord);
	if( selectedMapX >= 0 && selectedMapX < total_tiles && selectedMapY >= 0 && selectedMapY < total_tiles){
		//Sketch coordinates (tile TOP corner)
		selectedY = (selectedMapY*((canvas_size*c_ratio)/total_tiles)-(height/2)+c_ratio*(selectedMapX*(canvas_size/total_tiles)+(width/2)))/2;
		selectedX = selectedMapX*(canvas_size/total_tiles)+(width/2)-(selectedY/c_ratio);
	}
	else{
		selectedMapX = -1;
		selectedMapY = -1;
		selectedY = -1;
		selectedX = -1;
	}
	// If clicked twice the same Tile
	if((oldX === selectedX && oldX != -1)&&(oldY === selectedY && oldY != -1)){
		//
		if(!Objects.delete(selectedMapX, selectedMapY)){
			console.log("Added object: " + selectedMapX + ", " + selectedMapY);
			Objects.add(selectedMapX, selectedMapY, selectedObjName);
			selectedMapX = -1;
			selectedMapY = -1;
			selectedY = -1;
			selectedX = -1;
		}
	}
	updateJSON();
}
/*
function mouseWheel(event) {
	if(enabled_zoom){
		zoom += sensativity * 0.1 * event.delta;
  		zoom = constrain(zoom, zMin, zMax);
	}
  	return false;
}*/

/*
function mouseDragged(){
	//Quan hi ha zoom, moure els eixos ... i moure't pel mapa
}*/
