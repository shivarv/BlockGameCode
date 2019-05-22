({
    //onload init handler
    //This method is used to initialise the board with the images
	doInit : function(component, event, helper) {
		console.log("in init method on BlockGameBaordCmp");
        if(component.get("v.playerType")=="Player 1"){
            helper.setUserMoveStatusHelper(component,true);
        }
        else{
        	helper.setUserMoveStatusHelper(component,false);
        }
         component.set("v.specialEventList",[]);
         helper.initLoadHelper(component);
	},
    
    selectedImage :function(component, event, helper) {
        try{
        console.log("in selectedImage BlockGameBoardCmp function ");
       // alert("in selectedImage "+event.currentTarget);
        var selectedItem = event.currentTarget;
        console.log("td element id "+selectedItem.id);
        var recSrc = selectedItem.dataset.record;
       var recId=selectedItem.dataset.objectid;
        console.log("image name :"+JSON.stringify(recSrc));
        console.log("record id : "+selectedItem.dataset.objectid);
      
        //get the image record from It's Id
        console.log("before setting again calling " +
          helper.findImageFromMapHelper(component,recId).shivaBlockGame__isOpen__c
                   );
        var imageElement=helper.findImageFromMapHelper(component,recId);
         if(imageElement.shivaBlockGame__isOpen__c==true)
        {
            console.log("clicked already open image ,so returning ");
            return;
        }
        if(helper.canUserMakeHisMoveHelper(component)!=true)
        {
            console.log("Please wait till your opponent completes his move ");
            return;
        }
        //making sure that the next move is opponent
        helper.setUserMoveStatusHelper(component,false);
        //since here it is td-
        helper.setImageSrcHelper(component,recId,selectedItem.dataset.record);
		    
        if(imageElement){
        	//	imageElement.shivaBlockGame__isOpen__c=true;
        	helper.setOpenOrCloseForImageHelper(component,recId,true);
        }
        console.log("after setting again calling " +
          helper.findImageFromMapHelper(component,recId).shivaBlockGame__isOpen__c
                   );
            console.log("in boardGameCmp block status "+
                        helper.imageBlockStatusHelper(component));
        helper.imageChosenHelper(component,recId,false);
        

        }
        catch(e)
        {
            console.log('in selectedImage BlockGameBoardCmp error '+e);
        }

    },
    //do update to backend by calling apex method
    imageBlockUpdateEventHandler:function(component,event,helper)
    {
		 try{
        console.log("in imageBlockUpdateEventHandler BlockGameBoardCmp function ");
        var recId=event.getParam("individualBlockId");
        console.log("in imageBlockUpdateEventHandler- BlockGameBoardCmp");
        console.log(
            "  blockBoardId : "+event.getParam("blockBoardId")+
            "  individualBlockId : "+event.getParam("individualBlockId")+
            "  playerTurnOnEvent : "+event.getParam("playerTurnOnEvent")+
            "  PlayerType : "+event.getParam("PlayerType")+
            "  gamePlayType : "+event.getParam("gamePlayType")+
            "  isElementOpen : "+event.getParam("isElementOpen")+
            "  isBlockElementFound : "+event.getParam("isBlockElementFound")
        );
        var individualRecord=helper.findImageFromMapHelper(component,recId);
        
        //making sure that the next move is Your's
        helper.setUserMoveStatusHelper(component,true);

        console.log(" individualRecord "+individualRecord 
                    +" image name "+individualRecord.shivaBlockGame__image_Name__c
                   );
              console.log("before setting  calling " +
          individualRecord.shivaBlockGame__isOpen__c
                   );
        helper.setOpenOrCloseForImageHelper(component,recId,true);
              console.log("after setting again calling " +
          helper.findImageFromMapHelper(component,recId).shivaBlockGame__isOpen__c
                   );
 		helper.setImageSrcHelper(component,recId,
                                 individualRecord.shivaBlockGame__image_Name__c);
        //if this is NORMAL, call either the reset or found Helper
        var blockStatus=helper.imageBlockStatusHelper(component);
        console.log("blockStatus :: "+blockStatus);
        //open image on receive of event
          }
        catch(e)
        {
            console.log('in selectedImage BlockGameBoardCmp error '+e);
        }
    },
    imageBlockSpecialEventHandler:function(component,event,helper)
    {
      console.log("in imageBlockSpecialEventHandler BlockGameBoardCmp function ");
      console.log(
            "  blockBoardId : "+event.getParam("blockBoardId")+
            "  individualBlockId : "+event.getParam("individualBlockId")+
            "  playerTurnOnEvent : "+event.getParam("playerTurnOnEvent")+
            "  PlayerType : "+event.getParam("PlayerType")+
            "  gamePlayType : "+event.getParam("gamePlayType")+
            "  isElementOpen : "+event.getParam("isElementOpen")+
            "  isBlockElementFound : "+event.getParam("isBlockElementFound")
        );
        
        var specialEventList=component.get("v.specialEventList");
        specialEventList.push(helper.findImageFromMapHelper(
            							component,event.getParam("individualBlockId")));
        component.set("v.specialEventList",specialEventList);
        console.log(" total length  of specialEventList : "+specialEventList.length);
        if((specialEventList.length==2)){
            //turn change
                if(event.getParam("PlayerType")==component.get("v.playerType")){
	               	helper.setUserMoveStatusHelper(component,true);
                }
                else{
                	helper.setUserMoveStatusHelper(component,false);
                }
            if((event.getParam("gamePlayType")=="NOT FOUND"))
        	{
            	helper.closeImageHelper(component);
        	}
 	        else if((specialEventList.length==2) && (event.getParam("gamePlayType")=="FOUND"))
        	{
           		helper.makeImageFoundHelper(component);
            	console.log("is it by the same player "+event.getParam("PlayerType")
                       +'  '+component.get("v.playerType")
                       );
            if(event.getParam("PlayerType")==component.get("v.playerType")){
                helper.addAPointHelper(component,"yourPoints");
            }
            else
            {
            	helper.addAPointHelper(component,"opponentPoints");
            }
            var isGamerOver=helper.isGameOverCheckHelper(component);
            console.log("is game over helper return "+isGamerOver);
            
            //generate this only for player 1
			//this makes sure the event is only published once            
            if(isGamerOver==true && (component.get("v.playerType")=='Player 1'))
            {
                console.log("game is over ");
                if(component.get("v.yourPoints")==component.get("v.opponentPoints"))
                {
                    helper.generateGameOverEventHelper(component,'Player 1','DRAW');
                }
                else if(component.get("v.yourPoints")<component.get("v.opponentPoints"))
                {
                    helper.generateGameOverEventHelper(component,'Player 1','LOST');
                }
                else
                {
                    helper.generateGameOverEventHelper(component,'Player 1','WON');
 
                }
              }
            }
        }
     
        else
        {
            console.log("only one event is received , waiting for the next event ");
        }

    },
    
    // gamePlayType can be WON,LOST,DRAW
    // Game play is specific to Player 1
    gameCompletedEventHandler :function(component,event,helper)
    {
    	console.log("in gameCompletedEventHandler BlockGameBoardCmp function "+event.getParam("gamePlayType"));
        var eventGameplay= event.getParam("gamePlayType");
        component.set("v.isGameOver",true);
        helper.setGameEndTextHelper(component,eventGameplay);
       	alert(component.get("v.gameOverText"));
    },
    
})