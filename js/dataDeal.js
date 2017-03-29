
function getDatasetFromSelection ()
{
    d3.csv("data/" + datasetNameSelection["datasetA"]+ ".csv", function(error, dataA){
        if(error)
        {
            console.log("something wrong: " + error);
        }
        else
        {
            datasetAAll = dataA;
            d3.csv("data/" + datasetNameSelection["datasetB"] + ".csv", function(error, dataB){
                if(error)
                {
                    console.log("something wrong: " + error);
                }
                else
                {
                    datasetBAll = dataB;
                    //调用数据处理函数
                    getShowData('new');
                    setBar(1); 
                    nodeGroup = new nodegroup("nodeGroupSvgDiv");               
                    /*matrixWave = new matrix ("matrixWave");*/
                }
            });
        }
    });
}

function orderSelectionChange (value)
{
   matrixWave.orderSelectionChange(value);
}


//获取到需要展示的数据
function getShowData (layoutType)
{
	$("#stepFilterBar").slider({ disabled: true});
	$("#nodeFilterBar").slider({ disabled: true});
	$("#linkFilterBar").slider({ disabled : true});

     datasetA = [], datasetB = [];
     dataInStep = [];
     nodeSet = {};
     edgeSet = {};

	var str = "page";
	
	filterFactor["step1"] = (+filterFactor["step1"]);
	filterFactor["step2"] = (+filterFactor["step2"]);
	datasetA = [];
	datasetB = [];
    datasetAAll.forEach(function(data, i_data){
    	  var arr = {};
    	  var step;
    	  arr["sequence"] = [];
          for(var i = filterFactor["step1"]; i <= filterFactor["step2"]; i++)
          {
              if(unshowDataStep[i] == false)
              {
                step = str + i;
                if(data[step] != undefined)
                {
                    if(foldGroupData[data[step]] == undefined)
                    {
                        arr["sequence"].push(data[step]);
                    }
                    else
                    {
                        arr["sequence"].push(foldGroupData[data[step]]);
                    }
                }
              }
              else
              {
                break;
              }
          }
          data["volume"] = (+data["volume"]);
          arr["volume"] = data["volume"];
          datasetA.push(arr);
          // if(data["volume"] >= filterFactor["link"])
          // {
          //     datasetA.push(arr);
          // }
    });

    datasetBAll.forEach(function(data, i_data){
    	var arr = {};
    	var step;
        var isExist = false;
    	arr["sequence"] = [];
    	for(var i = filterFactor["step1"]; i<= filterFactor["step2"]; i++)
    	{
              if(unshowDataStep[i] == false)
              {
                step = str + i;
                if(data[step] != undefined)
                {
                   if(foldGroupData[data[step]] == undefined)
                    {
                        arr["sequence"].push(data[step]);
                    }
                    else
                    {
                        arr["sequence"].push(foldGroupData[data[step]]);
                    }
                }
                else
                {
                    break;
                }
              }
    	}
        data["volume"] = (+data["volume"]);
    	arr["volume"] = data["volume"];
        datasetB.push(arr);
    	/*if(data["volume"] >= filterFactor["link"])
    	{
    		datasetB.push(arr);
    	}*/
    });
    
    getNodeSet();
    getEdgeSet();
    getDataInStep_Node();
    getDataInStep_Link();
    filterNodeSet();
    filterEdgeSet();
    setStepIndexToDataInStep();
    
    $("#stepFilterBar").slider({ disabled: false});
    $("#nodeFilterBar").slider({ disabled: false});
    $("#linkFilterBar").slider({ disabled: false});
    if (matrixWave != undefined && layoutType == 'update')
    {
        matrixWave.updateLayout();
    }
    else
    {
        matrixWave = new matrix ("matrixWave");
    }
}

//获取到所有满足时间要求的数据的node
 function getNodeSet ()
 {
 	var datasetALen = datasetA.length;
 	var datasetBLen = datasetB.length;
 	var name;
    var index;
 	var len;
 	//处理集合A中的数据
 	for(var i =0; i< datasetALen; i++)
 	{
 	    len = datasetA[i]["sequence"].length;
 		for(var j =0; j< len; j++)
 		{
            name = datasetA[i]["sequence"][j];
            index = j;
            if(nodeSet[name] == undefined)
            {
            	nodeSet[name] = {};
            	nodeSet[name]["event"] = {};
            	nodeSet[name]["event"]["setA"] = [];
            	nodeSet[name]["event"]["setB"] = [];
            	nodeSet[name]["volume"] = {};
            	nodeSet[name]["volume"]["setA"] = [];
            	nodeSet[name]["volume"]["setB"] = [];
            	nodeSet[name]["volume"]["sum"] = [];
            	nodeSet[name]["id"] = name;
            }
            if(nodeSet[name]["volume"]["setA"][j] == undefined )
            {
            	nodeSet[name]["volume"]["setA"][j] = 0;
            }
            if(nodeSet[name]["volume"]["sum"][j] == undefined)
            {
            	nodeSet[name]["volume"]["sum"][j] = 0;
            }
            nodeSet[name]["volume"]["setA"][j] += datasetA[i]["volume"];
            nodeSet[name]["volume"]["sum"][j] += datasetA[i]["volume"];
            if(nodeSet[name]["event"]["setA"].length == 0)
            {
                nodeSet[name]["event"]["setA"].push(i);
            }
            if(nodeSet[name]["event"]["setA"][nodeSet[name]["event"]["setA"].length - 1] != i)
            {
                nodeSet[name]["event"]["setA"].push(i);
            }
 		}
 	}

   for(var i =0; i< datasetBLen; i++)
 	{
 	    len = datasetB[i]["sequence"].length;
 		for(var j =0; j< len; j++)
 		{
            name = datasetB[i]["sequence"][j];
            if(nodeSet[name] == undefined)
            {
            	nodeSet[name] = {};
            	nodeSet[name]["event"] = {};
            	nodeSet[name]["event"]["setA"] = [];
            	nodeSet[name]["event"]["setB"] = [];
            	nodeSet[name]["volume"] = {};
            	nodeSet[name]["volume"]["setA"] = [];
            	nodeSet[name]["volume"]["setB"] = [];
            	nodeSet[name]["volume"]["sum"] = [];
            	nodeSet[name]["id"] = name;
            }
            if(nodeSet[name]["volume"]["setB"][j] == undefined )
            {
            	nodeSet[name]["volume"]["setB"][j] = 0;
            }
            if(nodeSet[name]["volume"]["sum"][j] == undefined)
            {
            	nodeSet[name]["volume"]["sum"][j] = 0;
            }
            nodeSet[name]["volume"]["setB"][j] += datasetB[i]["volume"];
            nodeSet[name]["volume"]["sum"][j] += datasetB[i]["volume"];
            /*nodeSet[name]["event"]["setB"].push(i);*/
            if(nodeSet[name]["event"]["setB"].length == 0)
            {
                nodeSet[name]["event"]["setB"].push(i);
            }
            if(nodeSet[name]["event"]["setB"][nodeSet[name]["event"]["setB"].length - 1] != i)
            {
                nodeSet[name]["event"]["setB"].push(i);
            }
 		}
 	}
 } 

function getEdgeSet ()
{
	var datasetALen = datasetA.length ;
	var datasetBLen = datasetB.length ;
	var name;
	var len;

	//处理数据集A
	for(var i =0; i< datasetALen; i++)
	{
		len = datasetA[i]["sequence"].length -1;
		for(var j =0; j< len; j++)
		{
			name = datasetA[i]["sequence"][j] + datasetA[i]["sequence"][j+1];
			if(edgeSet[name] == undefined)
			{
				edgeSet[name] = {};
				edgeSet[name]["source"] = datasetA[i]["sequence"][j];
				edgeSet[name]["target"] = datasetA[i]["sequence"][j + 1];
				edgeSet[name]["id"] = name;
				edgeSet[name]["event"] = {};
				edgeSet[name]["event"]["setA"] = [];
				edgeSet[name]["event"]["setB"] = [];
				edgeSet[name]["volume"] = {};
				edgeSet[name]["volume"]["setA"] = [];
				edgeSet[name]["volume"]["setB"] = [];
				edgeSet[name]["volume"]["sum"] = [];
			}
			if(edgeSet[name]["volume"]["setA"][j] == undefined)
			{
				edgeSet[name]["volume"]["setA"][j] = 0;
			}
            if(edgeSet[name]["volume"]["sum"][j] == undefined)
            {
            	edgeSet[name]["volume"]["sum"][j]= 0;
            }
            edgeSet[name]["volume"]["setA"][j] += datasetA[i]["volume"];
            edgeSet[name]["volume"]["sum"][j] += datasetA[i]["volume"];
            edgeSet[name]["event"]["setA"].push(i);
		}
	}

	for(var i =0; i< datasetBLen; i++)
	{
		len = datasetB[i]["sequence"].length -1;
		for(var j =0; j< len; j++)
		{
			name = datasetB[i]["sequence"][j] + datasetB[i]["sequence"][j+1];
			if(edgeSet[name] == undefined)
			{
				edgeSet[name] = {};
				edgeSet[name]["source"] = datasetB[i]["sequence"][j];
				edgeSet[name]["target"] = datasetB[i]["sequence"][j + 1];
				edgeSet[name]["id"] = name;
				edgeSet[name]["event"] = {};
				edgeSet[name]["event"]["setA"] = [];
				edgeSet[name]["event"]["setB"] = [];
				edgeSet[name]["volume"] = {};
				edgeSet[name]["volume"]["setA"] = [];
				edgeSet[name]["volume"]["setB"] = [];
				edgeSet[name]["volume"]["sum"] = [];
			}
			if(edgeSet[name]["volume"]["setB"][j] == undefined)
			{
				edgeSet[name]["volume"]["setB"][j] = 0;
			}
            if(edgeSet[name]["volume"]["sum"][j] == undefined)
            {
            	edgeSet[name]["volume"]["sum"][j] = 0;
            }
            edgeSet[name]["volume"]["setB"][j] += datasetB[i]["volume"];
            edgeSet[name]["volume"]["sum"][j] += datasetB[i]["volume"];
            edgeSet[name]["event"]["setB"].push(i);
		}
	}
}

function filterNodeSet ()
{
    var nodeKeys = Object.keys(nodeSet);
    var lenNodeKeys = nodeKeys.length;
    var node;
    var setA;
    var lenSetA;
    var setB;
    var lenSetB;
    var len;
    filterFactor["node"] = (+filterFactor["node"]);
    for(var i =0; i< lenNodeKeys; i++)
    {
        node = nodeKeys[i];
        if(nodeSet[node]["volume"]["totalSum"] < filterFactor["node"])
        {
            // console.log("delete node = " + node);
            delete nodeSet[node];
        }
    }
}

function filterEdgeSet ()
{
    var edgeKeys;
    var lenEdgeKeys;
    var edge;
    filterFactor["link"] = (+filterFactor["link"]);
    edgeKeys = Object.keys(edgeSet);
    lenEdgeKeys = edgeKeys.length;
    for(var i =0; i< lenEdgeKeys; i++)
    {
        edge = edgeKeys[i];
        if(edgeSet[edge]["volume"]["totalSum"] < filterFactor["link"])
        {
            // console.log("delete edge = " + edge)
            delete edgeSet[edge];
        }
    }
}

function getDataInStep_Node ()
{
	var datasetALen = datasetA.length;
	var datasetBLen = datasetB.length;
	var name;
	var len;
	var obj;

	for(var i =0; i< datasetALen; i++)
	{
        len = datasetA[i]["sequence"].length;
        for(var j =0; j< len; j++)
        {
        	obj = {};
        	name = datasetA[i]["sequence"][j];
            if(getNodeSum(name) >= filterFactor["node"])
            {
            	if(dataInStep[j] == undefined)
        	   {
        		 dataInStep[j] = {};
        		 dataInStep[j]["nodes"] = [];
        		 dataInStep[j]["edges"] = [];
        	     /*dataInStep[j]["orderIndex"] =  j;
                 dataInStep[j]["firstIndex"] = j;*/
        	   }
        	   if(isNodeExit_dataInStep(j, name) == false)
        	   {
        	   	  obj["id"] = datasetA[i]["sequence"][j];
        	      obj["orderIndex"] = dataInStep[j]["nodes"].length;
                  obj["firstIndex"] = dataInStep[j]["nodes"].length;
        	      obj["volume"] = {};
        	     if(nodeSet[name]["volume"]["setA"][j] == undefined)
        	     {
        	   	    nodeSet[name]["volume"]["setA"][j] = 0;
        	    }
        	    if(nodeSet[name]["volume"]["setB"][j] == undefined)
        	    {
        	        nodeSet[name]["volume"]["setB"][j] = 0;
        	    }
        	    obj["volume"]["setA"] = nodeSet[name]["volume"]["setA"][j];
        	    obj["volume"]["setB"] = nodeSet[name]["volume"]["setB"][j];
            	dataInStep[j]["nodes"].push(obj);
        	  }
            }
        }
	}

	for(var i =0; i< datasetBLen; i++)
	{
		len = datasetB[i]["sequence"].length;
		for(var j =0; j< len; j++)
		{
			name = datasetB[i]["sequence"][j];
			obj = {};
			if(getNodeSum(name) >= filterFactor["node"])
			{
				if(dataInStep[j] == undefined)
				{
					dataInStep[j] = {};
					dataInStep[j]["nodes"] = [];
					dataInStep[j]["edges"] = [];
					dataInStep[j]["orderIndex"] = j;
                    dataInStep[j]["firstIndex"] = j;
				}
				if(isNodeExit_dataInStep(j, name) == false)
				{
					obj["id"] = name;
				    obj["orderIndex"] = dataInStep[j]["nodes"].length;
                    obj["firstIndex"] = dataInStep[j]["nodes"].length;
				    obj["volume"] = {};
				   if(nodeSet[name]["volume"]["setA"][j] == undefined)
				   {
					    nodeSet[name]["volume"]["setA"][j] =0;
				   }
				  if(nodeSet[name]["volume"]["setB"][j] == undefined)
				   {
					    nodeSet[name]["volume"]["setB"][j] = 0;
				   }
				   obj["volume"]["setA"] = nodeSet[name]["volume"]["setA"][j];
				   obj["volume"]["setB"] = nodeSet[name]["volume"]["setB"][j];
				   dataInStep[j]["nodes"].push(obj);
				} 

			}
		}
	}
}

function getDataInStep_Link ()
{
	var datasetALen = datasetA.length;
	var datasetBLen = datasetB.length;
	var name;
	var name1;
	var name2;
	var obj;
	var len;

	for(var i =0; i< datasetALen; i++)
	{
        len = datasetA[i]["sequence"].length - 1;
        for(var j =0; j< len; j++)
        {
        	name1 = datasetA[i]["sequence"][j];
        	name2 = datasetA[i]["sequence"][j+1];
        	name = name1+name2;
        	obj = {};
            if(getEdgeSum(name) >= filterFactor["link"])
            {
            	if(isNodeExit_dataInStep(j, name1) == true && isNodeExit_dataInStep(j+1, name2) == true)
            	{
                    if(isEdgeExit_dataInStep(j, name) == false)
                    {
                    	obj["source"] = name1;
                        obj["target"] = name2;
                        obj["id"] = name;
                        obj["volume"] = {};
                        if(edgeSet[name]["volume"]["setA"][j] == undefined)
                        {
                    	      edgeSet[name]["volume"]["setA"][j] = 0;
                        } 
                        if(edgeSet[name]["volume"]["setB"][j] == undefined)
                        {
                    	   edgeSet[name]["volume"]["setB"][j] =0;
                        } 
                        obj["volume"]["setA"] = edgeSet[name]["volume"]["setA"][j];
                        obj["volume"]["setB"] = edgeSet[name]["volume"]["setB"][j];
                        dataInStep[j]["edges"].push(obj);
                    }
            	}
            }
        }
	}

	for(var i =0; i< datasetBLen; i++)
	{
        len = datasetB[i]["sequence"].length - 1;
        for(var j =0; j< len; j++)
        {
        	name1 = datasetB[i]["sequence"][j];
        	name2 = datasetB[i]["sequence"][j+1];
        	name = name1+name2;
        	obj = {};
            if(getEdgeSum(name) >= filterFactor["link"])
            {
            	if(isNodeExit_dataInStep(j, name1) == true && isNodeExit_dataInStep(j+1, name2) == true)
            	{
                    if(isEdgeExit_dataInStep(j, name) == false)
                    {
                    	obj["source"] = name1;
                        obj["target"] = name2;
                        obj["id"] = name;
                        obj["volume"] = {};
                        if(edgeSet[name]["volume"]["setA"][j] == undefined)
                        {
                    	      edgeSet[name]["volume"]["setA"][j] = 0;
                        } 
                        if(edgeSet[name]["volume"]["setB"][j] == undefined)
                        {
                    	   edgeSet[name]["volume"]["setB"][j] =0;
                        } 
                        obj["volume"]["setA"] = edgeSet[name]["volume"]["setA"][j];
                        obj["volume"]["setB"] = edgeSet[name]["volume"]["setB"][j];
                        dataInStep[j]["edges"].push(obj);
                    }
            	}
            }
        }
	}
}

function getNodeSum (name)
{
    var sum = 0;
    var len = nodeSet[name]["volume"]["sum"].length;
    for(var i = 0; i< len; i++)
    {
    	if(nodeSet[name]["volume"]["sum"][i] == undefined || nodeSet[name]["volume"]["sum"][i] == NaN)
    	{
    		nodeSet[name]["volume"]["sum"][i] = 0;
    	}
    	nodeSet[name]["volume"]["sum"][i] = (+nodeSet[name]["volume"]["sum"][i]);
    	sum += nodeSet[name]["volume"]["sum"][i];
    }
    if(nodeSet[name]["volume"]["totalSum"] == undefined)
    {
    	nodeSet[name]["volume"]["totalSum"] = sum;
    }
    return sum;
}

function getEdgeSum (name)
{
	var sum =0;
	var len = edgeSet[name]["volume"]["sum"].length;
	for(var i =0; i< len; i++)
	{
		if(edgeSet[name]["volume"]["sum"][i] == undefined || edgeSet[name]["volume"]["sum"][i] == NaN)
		{
			edgeSet[name]["volume"]["sum"][i] = 0;
		}
		edgeSet[name]["volume"]["sum"][i] = (+edgeSet[name]["volume"]["sum"][i]);
		sum += edgeSet[name]["volume"]["sum"][i];
	}
    if(edgeSet[name]["volume"]["totalSum"] == undefined)
    {
    	edgeSet[name]["volume"]["totalSum"] = sum;
    }
    return sum;
}

function isNodeExit_dataInStep (step, name)
{
	step = (+step);
    var len = 0;
    if(dataInStep[step] && dataInStep[step]["nodes"] != undefined)
    {
       len = dataInStep[step]["nodes"].length;
    }
   for(var i =0; i< len; i++)
   {
   	  if(dataInStep[step]["nodes"][i]["id"] == name)
   	  {
   	  	 return true;
   	  }
   }

   return false;
}

function isEdgeExit_dataInStep (step, name)
{
    step = (+step);
    var len = dataInStep[step]["edges"].length;
    for(var i =0; i< len; i++)
    {
    	if(dataInStep[step]["edges"][i]["id"] == name)
    	{
    		return true;
    	}
    }
    return false;
}

function getNodeVolumeDomain ()
{
    var nodeKeys = Object.keys(nodeSet);
    var lenNodeKeys = nodeKeys.length;
    var node;
    nodeDomain["min"] = 1000;
    nodeDomain["max"] = 0;
    for(var i =0; i< lenNodeKeys; i++)
    {
        node = nodeKeys[i];
        if(nodeSet[node]["volume"]["totalSum"] < nodeDomain["min"])
        {
            nodeDomain["min"] = nodeSet[node]["volume"]["totalSum"];
        }
        if(nodeSet[node]["volume"]["totalSum"] > nodeDomain["max"])
        {
            nodeDomain["max"] = nodeSet[node]["volume"]["totalSum"];
        }
    }
}

function getLinkVolumeDomain ()
{
    var edgeKeys = Object.keys(edgeSet);
    var lenEdgeKeys = edgeKeys.length;
    var edge;
    edgeDomain["min"] = 1000;
    edgeDomain["max"] = 0;
    for(var i =0; i< lenEdgeKeys; i++)
    {
        edge = edgeKeys[i];
        if(edgeSet[edge]["volume"]["totalSum"] < edgeDomain["min"])
        {
            edgeDomain["min"] = edgeSet[edge]["volume"]["totalSum"];
        }
        if(edgeSet[edge]["volume"]["totalSum"] > edgeDomain["max"])
        {
            edgeDomain["max"] = edgeSet[edge]["volume"]["totalSum"];
        }
    }
}

function setBar (time)
{
    getNodeVolumeDomain()
    getLinkVolumeDomain();
    if(time == 1)
    {
        filterFactor["node"] = nodeDomain["min"] - 10;
        filterFactor["link"] = edgeDomain["min"] - 10;
        filterFactor["step1"] = stepDomain["step1"];
        filterFactor["step2"] = stepDomain["step2"];
    }
    document.getElementById("nodeFilterValue").value = filterFactor["node"];
    document.getElementById("linkFilterValue").value = filterFactor["link"];
    document.getElementById("stepFilter1").value = filterFactor["step1"];
    document.getElementById("stepFilter2").value = filterFactor["step2"];
    $("#nodeFilterBar").slider({
        min:0,
        max:nodeDomain["max"] + 50,
        value:filterFactor["node"],
        slide:function(event, ui){
            $("#nodeFilterValue").val(ui.value);
            filterFactor["node"] = ui.value;
            getShowData('update');
        }
    });
    $("#linkFilterBar").slider({
        min:0,
        max:edgeDomain["max"] + 50,
        value:filterFactor["link"],
        slide:function(event, ui){
            $("#linkFilterValue").val(ui.value);
            filterFactor["link"] = ui.value;
            getShowData('update');
        }
    });
    $("#stepFilterBar").slider({
        range:true,
        min:stepDomain["step1"],
        max:stepDomain["step2"],
        values:[filterFactor["step1"], filterFactor["step2"]],
        slide: function(event, ui){
            $("#stepFilter1").val(ui.values[0]);
            $("#stepFilter2").val(ui.values[1]);
            filterFactor["step1"] = ui.values[0];
            filterFactor["step2"] = ui.values[1];
            for(var i =filterFactor["step1"]; i<= filterFactor["step2"]; i++)
            {
                unshowDataStep[i] = false;
            }
            getShowData('update');
            setBar(0);
        }
    });
}

function setStepIndexToDataInStep ()
{
    var len = dataInStep.length;
    var index = 1;
    for(var i =0; i< len; i++)
    {
        if(unshowDataStep[index] == undefined)
        {
            alert("Something wrong in setting step index!");
        }
        else
        {
            while(unshowDataStep[index] == true || unshowDataStep[index] == "true")
            {
                index ++;
            }
            if(unshowDataStep[index] == false || unshowDataStep[index] == "false")
            {
                dataInStep[i]["stepIndex"] = index;
                index ++;
            }
        }
    }
}