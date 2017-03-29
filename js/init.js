
var datasetAAll;
var datasetBAll;
var datasetA = [], datasetB = [];
var dataInStep = [];
var nodeSet = {};
var edgeSet = {};

var foldGroupData = {};

var filterFactor = {};
filterFactor["node"] = 75;
filterFactor["link"] = 75;
filterFactor["step1"] = 1;
filterFactor["step2"] = 6;
var matrixWave;
var rectInMatrixWave = 15;

var nodeDomain = {};
    nodeDomain["min"] =1000;
    nodeDomain["max"] = 0;
var edgeDomain = {};
    edgeDomain["min"] = 1000;
    edgeDomain["max"] = 0;

var stepDomain = {};
    stepDomain["step1"] = 1;
    stepDomain["step2"] = 6;

//icon control panel
var iconPanel = new iconpanel();

var searchElements;
function searchEvent ()
{
	var value = $("#searching").attr("value");
	var lenStep = dataInStep.length;
	console.log("searching: " + value)
	if(value == null || value == "")
	{
		alert("Please search something before submit!");
	}
	else
	{
		if(nodeSet[value] != undefined)
		{
           matrixWave.searchElement(value);
           if(searchElements == value)
           {
           	 searchElements = "";
           }
           else
           {
           	 searchElements = value;
           }
		}
		else
		{
			alert("There is no any node named " + value + ".");
		}
	}
}

$("#searchForm").submit(function(event){
	event.preventDefault();
	searchEvent();
});

function searchKeyDown(keynum)
{
	var keynum = (event.keyCode ? event.keyCode : event.which); 
	if(keynum == 8)
	{
		var value = $("#searching").attr("value");
		if(searchElements == value && value != "" && searchElements != undefined)
		{
        	matrixWave.searchElement(searchElements);
            searchElements = "";
		}
	}
}


var datasetName = ["dataSetA", "dataSetB"];
    drawDatasetSelection();
var datasetNameSelection = {};

    //initialize the dataset
    datasetNameSelection["datasetA"] = "dataSetA";
    datasetNameSelection["datasetB"] = "dataSetB";
    getDatasetFromSelection();

//draw the dataset name in the dataset selection.
function drawDatasetSelection ()
{
	var len = datasetName.length;
	var selection;
	for(var i =0; i<len; i++)
	{
       if(i == 0)
       {
       	 selection = "<option selected = 'true' id = " + "'" + datasetName[i] + "inA'"+ ">" + datasetName[i] + "</option>";
       	 $("#datasetSelect1").append(selection);
       	 selection = "<option disabled = 'true' id = " + "'" + datasetName[i] + "inB'"+ ">" + datasetName[i] + "</option>";
       	 $("#datasetSelect2").append(selection);
       }
       else 
       {
       		if(i == 1)
	       {
	       	 selection = "<option selected = 'true' id = " + "'" + datasetName[i] + "inB'"+ ">" + datasetName[i] + "</option>";
	       	 $("#datasetSelect2").append(selection);
	       	 selection = "<option disabled = 'true' id = " + "'" + datasetName[i] + "inA'"+ ">" + datasetName[i] + "</option>";
	       	 $("#datasetSelect1").append(selection);
	       }
	       else
	       {
	       	  selection = "<option id = " + "'" + datasetName[i] + "inA'"+ ">" + datasetName[i] + "</option>";
	       	  $("#datasetSelect1").append(selection);
	       	  selection = "<option id = " + "'" + datasetName[i] + "inB'"+ ">" + datasetName[i] + "</option>";
	       	  $("#datasetSelect2").append(selection);
	       }
       }
       
	}
}

//select the datasetA
function selectDatasetA (value)
{
   /*datasetNameSelection["datasetA"] = value;*/
   if(datasetNameSelection["datasetB"] != "" && datasetNameSelection["datasetB"] != undefined)
   {
   	   if(value == datasetNameSelection["datasetB"])
   	   {
   	   	 $("#" + datasetNameSelection["datasetA"] + "inA").attr("selected", "true");
   	   	  alert("The two selected datasets are the same!");
   	   }
   	   else
   	   {
   	   	  datasetNameSelection["datasetA"] = value;
   	   	  $("#" + datasetNameSelection["datasetA"] + "inB").attr("disabled", "true");
   	   	   // get the dataset as selection
   		   getDatasetFromSelection();
   	   }
   }
}
function selectDatasetB (value)
{
	/*datasetNameSelection["datasetB"] = value;*/
	if(datasetNameSelection["datasetA"] != "" && datasetNameSelection["datasetA"] != undefined)
	{
		if(value == datasetNameSelection["datasetA"])
		{
			$("#" + datasetNameSelection["datasetB"] + "inB").attr("selected", "true");
			alert("The two selected dataset are the same!");
		}
		else
		{
			datasetNameSelection["datasetB"] = value;
			$("#" + datasetNameSelection["datasetB"] + "inA").attr("disabled", "true");
			getDatasetFromSelection();
		}
	}
}

var colorToRGB = {};
colorToRGB["purple"] = [];
colorToRGB["purple"][0] = 130;
colorToRGB["purple"][1] = 0;
colorToRGB["purple"][2] = 130;

colorToRGB["orange"] = [];
colorToRGB["orange"][0] = 255;
colorToRGB["orange"][1] = 165;
colorToRGB["orange"][2] = 0;

var colorSelected;
makeColorSelection("purple", "orange");
function colorSelectionChange (value)
{
	console.log("color-selection: " + value);
	if(value == "0"|| value == 0)
	{
		makeColorSelection("purple", "orange");
	}
	else
	{
		if(value == "1" || value == 1)
		{
			makeColorSelection("orange", "purple");
		}
	}

	matrixWave.updateColor();
}

function makeColorSelection (color1, color2)
{
	var fromNum = -1.0;
	var colorName;
	var place;
	colorSelected = {};
	colorSelected["selection"] = {};
	for(var i =0; i< 6; i++)
	{
		colorName = "rgb(" + ((255 - colorToRGB[color1][0])/5 * i + colorToRGB[color1][0])
			        +"," + ((255 - colorToRGB[color1][1])/5 * i + colorToRGB[color1][1])
			        + "," + ((255 - colorToRGB[color1][2])/5 * i + colorToRGB[color1][2]) + ")";
        place = fromNum + 0.2 * i;
        place  = place * 10;
        place = Math.round(place);
        place = place * 0.1;
        place = place.toFixed(1);
        colorSelected["selection"][place] = colorName;
	}
	fromNum = 0;
	for(var i = 1; i < 6; i++)
	{
		colorName = "rgb(" + ((colorToRGB[color2][0] - 255)/5 * i + 255)
			        +"," + ((colorToRGB[color2][1] - 255)/5 * i + 255)
			        +"," + ((colorToRGB[color2][2] - 255)/5 * i + 255) + ")";
        place = fromNum + 0.2 * i;
        place = place * 10;
        place = Math.round(place);
        place = place * 0.1;
        place = place.toFixed(1);
        colorSelected["selection"][place] = colorName;
	}
}


//record which step is deleted
var unshowDataStep = [];
    initDataStep();
function initDataStep ()
{
	unshowDataStep[0] = true;
	for(var i=stepDomain["step1"]; i<=stepDomain["step2"]; i++)
	{
		unshowDataStep[i] = false;
	}
}

// specific volume control receptively node and link

var relatedElementsVis = {};
    relatedElementsVis["node"] = false;
    relatedElementsVis["link"] = false;

function nodeVisStyleChange(value)
{
    if(value == "true" || value == true)
    {
    	console.log("nodeVis: " + value)
    	relatedElementsVis["node"] = true;
    	matrixWave.drawRelatedNode();
    }
    else
    {
    	console.log("nodeVis: " + value);
    	relatedElementsVis["node"] = false;
    	matrixWave.removeRelatedNodeVis();
    }
}

function linkVisStyleChange (value)
{
   if(value == "true" || value == true)
   {
   	console.log("linkVis: " + value);
   	  relatedElementsVis["link"] = true;
      matrixWave.drawRelatedLink();
   }
   else
   {
   	console.log("linkVis: " + value)
   	  relatedElementsVis["link"] = false;
   	  matrixWave.removeRelatedLinkVis();
   }
}
