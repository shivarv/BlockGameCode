({
	initLoadHelper : function(component) {
		console.log("in initLoadHelper BlockGameBoard function ");
		var helper=this;
        // create action with the method instance
        var action = component.get("c.fetchAllIndividualBlockWrapper");
        action.setParams({ 
                          blockBoardId : component.get("v.blockBoardId"),
                          
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //change component state after 60seconds
                console.log("From server: " + JSON.stringify(response.getReturnValue()) );
                helper.initLoadResponseHandlerHelper(component,response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                console.log("action incomplete ");
            }
            else if (state === "ERROR") {
               console.log("action results in error ");
               var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                }
                else {
                    console.log("Unknown error");
                }
            }
        });

        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
	},
    initLoadResponseHandlerHelper: function(component,response)
    {
        console.log("in initLoadResponseHandlerHelper BlockGameBoard function ");

        //player1Id,player2Id,player1Name,player2Name
        component.set("v.boardDataWrapper",response);
        component.set("v.player1Id",response.blockBoardDetail.shivaBlockGame__Player1__c);
        component.set("v.player2Id",response.blockBoardDetail.shivaBlockGame__Player2__c);
		component.set("v.player1Name",response.blockBoardDetail.shivaBlockGame__Player1__r.Name);
 		component.set("v.player2Name",response.blockBoardDetail.shivaBlockGame__Player2__r.Name);
		
        //indiBlocksList
        var imageBlockIdMap=[];
        
        var individualBlocks=response.individualBlocks;
       	var indiBlocksList=[];
        var indiRowsList=[];
        var recordsCount=0;
        var recordKeyValue=0;
        for(var indRecord in individualBlocks)
        {
            imageBlockIdMap.push({"key": individualBlocks[indRecord].Id,
                                  "value": individualBlocks[indRecord]
                                 });
           // console.log(indRecord);
            indiRowsList.push(individualBlocks[indRecord]);
            recordsCount++;
            if(recordsCount==8)
            {
                indiBlocksList.push({"key":recordKeyValue,"value":indiRowsList});
                recordKeyValue++;
                recordsCount=0;
                indiRowsList=[];
            }
        }
        component.set("v.indiBlocksList",indiBlocksList);
        component.set("v.imageBlockIdMap",imageBlockIdMap);
        console.log('image block Map is set ');
    },
    
    imageChosenHelper :function(component,individualRecordId,requireEventPublish)
    {
        console.log("in imageChosenHelper  function ");
		var helper=this;
        // create action with the method instance
        var action = component.get("c.updateIndividualBlockByPlayer");
        action.setParams({ 
                          recordToUpdateId : individualRecordId,
            			  playerTypeClicked : component.get("v.playerType"),
            			  requireEventPublish : requireEventPublish
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //change component state after 60seconds
                console.log("From imageChosenHelper callout return : " + JSON.stringify(response.getReturnValue()) );
        		var blockStatus=helper.imageBlockStatusHelper(component);
                console.log("in blockStatus result "+blockStatus);
                if(blockStatus=="NORMAL"){
        		                
        		}
        		//if FOUND , means the block has to be always open
        		//at backend and front end , the isOpen and isFound must be set to true
                else if(blockStatus=="FOUND"){
        			helper.specialEventUpdateHelper(component,blockStatus);	

        		}
       			 //if FOUND , means the block has to be always open
        		//at backend and front end , the isOpen and isFound must be set to false
        		else{
					helper.specialEventUpdateHelper(component,blockStatus);	
        		}
                
            }
            else if (state === "INCOMPLETE") {
                console.log("action incomplete ");
            }
            else if (state === "ERROR") {
               console.log("action results in error ");
               var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                }
                else {
                    console.log("Unknown error");
                }
            }
        });

        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },
    
    // It returns FOUND,NOT FOUND, NORMAL
    imageBlockStatusHelper : function(component)
    {
        console.log(" in imageBlockStatusHelper BlockGameBoardCmp ");
        var imageBlockIdMap=component.get("v.imageBlockIdMap");
        var countOfNonFoundOpenImages=0;
        var recordData=[];
        var individualBlockIdsList=[];
        for(var i in imageBlockIdMap)
        {
            if((imageBlockIdMap[i].value.shivaBlockGame__isFound__c==false)
              && (imageBlockIdMap[i].value.shivaBlockGame__isOpen__c==true)
              )
            {
                countOfNonFoundOpenImages++;
                recordData.push(imageBlockIdMap[i].value);
                if(countOfNonFoundOpenImages==2){
                    break;
                }
            }
        }
        console.log(" countOfNonFoundOpenImages "+countOfNonFoundOpenImages);

        if(countOfNonFoundOpenImages==2){
            individualBlockIdsList.push(recordData[0].Id);
            individualBlockIdsList.push(recordData[1].Id);
			component.set("v.individualBlockIdsList",individualBlockIdsList);
            if(recordData[0].shivaBlockGame__image_Name__c==recordData[1].shivaBlockGame__image_Name__c){
                return "FOUND";
            }
            else{
                return "NOT FOUND";
            }
                
        }
        else{
            return "NORMAL";
        }
    },
    
    setOpenOrCloseForImageHelper : function(component,recId,newIsOpenValue)
    {
        console.log(" in setOpenOrCloseForImageHelper - BlockGameBoard Func");
        var imageBlockIdMap =component.get("v.imageBlockIdMap");

         for(var i in imageBlockIdMap)
        {
            if(imageBlockIdMap[i].key==recId)
            {
              
               imageBlockIdMap[i].value.shivaBlockGame__isOpen__c=newIsOpenValue;
                console.log(
                  "Rec Id :"+recId +
                  "id Key : "+imageBlockIdMap[i].key+
                  " id record isOpen value "+imageBlockIdMap[i].value.shivaBlockGame__isOpen__c);
				component.set("v.imageBlockIdMap",imageBlockIdMap);
                return;
            }
        }
    },
    
     setImageAsFoundHelper : function(component,recId)
    {
        console.log("In setImageFoundHelper BlockGameBoardCmpHelper :");
        var imageBlockIdMap =component.get("v.imageBlockIdMap");
         for(var i in imageBlockIdMap)
         {
            if(imageBlockIdMap[i].key==recId)
            {
              console.log(
                  "Rec Id :"+recId +
                  "id Key : "+imageBlockIdMap[i].key+
                  " id record value "+imageBlockIdMap[i].value);
                 imageBlockIdMap[i].value.shivaBlockGame__isFound__c=true;
				break;
            }
         }
         component.set("v.imageBlockIdMap",imageBlockIdMap);
    },
    
    findImageFromMapHelper :function(component,recId)
    {
       var imageBlockIdMap =component.get("v.imageBlockIdMap");

         for(var i in imageBlockIdMap)
        {
            if(imageBlockIdMap[i].key==recId)
            {
              console.log(
                  "Rec Id :"+recId +
                  "id Key : "+imageBlockIdMap[i].key+
                  " id record value "+imageBlockIdMap[i].value);
                return imageBlockIdMap[i].value;

            }
        }
        return null;
    },
	
	/*specialEventUpdateHelper
	 * 
	*/     
    specialEventUpdateHelper:function(component,eventType)
    {
        console.log("in specialEventUpdateHelper BlockGameBoard function ");
        var toTestDisplay=component.get("v.individualBlockIdsList");
        console.log(" specialEventUpdateHelper indiBlocksIdsList "+toTestDisplay);
		
        var helper=this;
        console.log(helper.findImageFromMapHelper(component,toTestDisplay[0]).shivaBlockGame__isOpen__c);
        console.log(helper.findImageFromMapHelper(component,toTestDisplay[1]).shivaBlockGame__isOpen__c);

        // create action with the method instance
        var action = component.get("c.closeOrOpenImageUpdate");
        action.setParams({ 
                          playerTypeClicked : component.get("v.playerType"),
            			  individualBlockIds :component.get("v.individualBlockIdsList") ,
            			  eventType : eventType
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //change component state after 60seconds
                console.log("From server : " + JSON.stringify(response.getReturnValue()) );
            }
            else if (state === "INCOMPLETE") {
                console.log("action incomplete ");
            }
            else if (state === "ERROR") {
               console.log("action results in error ");
               var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                }
                else {
                    console.log("Unknown error");
                }
            }
        });

        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
        
    },
    
    // it must be made as setImageSrcHelper
    setImageSrcHelper :function(component,tdElementId,newImageName)
    {
        console.log("in setImageSrcHelper BlockGameBoardCmp function ")
        var tdElementId=("td-"+tdElementId);
        var selectedTd=document.getElementById(tdElementId);
        var oldImageElement=selectedTd.getElementsByTagName("img")[0];
        if(newImageName==""){
            newImageName=selectedTd.dataset.record;
        }
        console.log("old image src "+oldImageElement.src);
        var oldImageSrc=oldImageElement.src;
        var fullImageSrc= oldImageSrc.slice(0,oldImageSrc.lastIndexOf("/"));
        fullImageSrc+=("/"+newImageName+".jpg");      
        oldImageElement.src=fullImageSrc;
    },
    
    closeImageHelper :function(component)
    {
    	console.log("in closeImageHelper BlockGameBoardCmp function ");
        console.log(component.get("v.defaultCloseImageName"));
        var helper=this;
		var specialEventList=component.get("v.specialEventList");
        helper.setOpenOrCloseForImageHelper(component,specialEventList[0].Id,false);
        helper.setOpenOrCloseForImageHelper(component,specialEventList[1].Id,false);
		helper.setImageSrcHelper(component,specialEventList[0].Id
                               ,component.get("v.defaultCloseImageName"));
        helper.setImageSrcHelper(component,specialEventList[1].Id
                               ,component.get("v.defaultCloseImageName"));

        component.set("v.specialEventList",[]);
    },
    
     makeImageFoundHelper :function(component)
    {
    	console.log("in makeImageFoundHelper BlockGameBoardCmp function ");
        var helper=this;
		var specialEventList=component.get("v.specialEventList");
        helper.setImageAsFoundHelper(component,specialEventList[0].Id);
        helper.setImageAsFoundHelper(component,specialEventList[1].Id);
        component.set("v.specialEventList",[]);
    },
    
    addAPointHelper : function(component,whosePoint)
    {
        console.log("in addAPointHelper BlockGameBoardCmp function ");
        var point=component.get("v."+whosePoint);;
        point=parseInt(point);
        point++;
        console.log("in addAPointHelper BlockGameBoardCmp function "+point);
        component.set("v."+whosePoint,point);
    },
    
    generateGameOverEventHelper : function(component,player,WonOrDraw)
    {
    	console.log("in generateGameOverEventHelper-BlockGameBoradCmp function ");
		//generateGameOverEvent Apex Method 
		var helper=this;
        // create action with the method instance
        var action = component.get("c.generateGameOverEvent");
        action.setParams({ 
                          blockBoardId : component.get("v.blockBoardId"),
            			  playerType : player ,
            			  gameEndEventType : WonOrDraw
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //change component state after 60seconds
                console.log("Game Over Return " );
            }
            else if (state === "INCOMPLETE") {
                console.log("action incomplete ");
            }
            else if (state === "ERROR") {
               console.log("action results in error ");
               var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                }
                else {
                    console.log("Unknown error");
                }
            }
        });

        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },
    //currently not optimised code..need to modify this
    isGameOverCheckHelper : function(component)
    {	
         console.log("in isGameOverCheckHelper-BlockGameBoradCmp function ");
         var imageBlockIdMap =component.get("v.imageBlockIdMap");
         var count=0;
         for(var i in imageBlockIdMap)
         {
            if(imageBlockIdMap[i].value.shivaBlockGame__isFound__c==true)
            {
              console.log(
                  "Rec Id :"+imageBlockIdMap[i].value.Id +
                  " id shivaBlockGame__isFound__c value "+
                  imageBlockIdMap[i].value.shivaBlockGame__isFound__c);
				count++;
            }
         }
        console.log("isGameOverCheckHelper-BlockGameBoradCmp count is :"
                    +count);
        if(count==48)
        {
            return true;
        }
        return false;
	},
    
    setGameEndTextHelper : function(component,gameResult)
    {
        console.log("in setGameEndTextHelper-BlockGameBoardCmp function "+gameResult);

        if(gameResult=="DRAW")
        {
            component.set("v.gameOverText","Game has been draw by both the players ");
        }
        //game is either WON or LOST by Player 1
        else if(gameResult=="WON")
        {
            if(component.get("v.playerType")=='Player 1')
            {
                component.set("v.gameOverText","Congrats you have Won the Block Game ");
            }
            else
            {
               component.set("v.gameOverText","Hard Luck ,Opponent Has Won The Block Game ");

            }
        }
        
        else if(gameResult=="LOST")
        {
            if(component.get("v.playerType")=='Player 1')
            {
                component.set("v.gameOverText","Hard Luck ,Opponent Has Won The Block Game ");
            }
            else
            {
               component.set("v.gameOverText","Congrats you have Won the Block Game ");
            }
        }
    },
    
    setUserMoveStatusHelper : function(component,isYourTurn)
    {
    	console.log("in setUserMoveStatusHelper-BlockGameBoardCmp function "+isYourTurn);
        component.set("v.isYourTurn",isYourTurn);
        component.set("v.whoseTurnText",isYourTurn==true?"Your Turn":"Opponent Turn");
    },
    
    canUserMakeHisMoveHelper : function(component)
    {
        console.log("in setUserMoveStatusHelper-BlockGameBoardCmp function "+component.get("v.isYourTurn"));
        return component.get("v.isYourTurn");
    }
})