({
	makeRequestToDualHelper : function(component) {
        
        console.log("in makeRequestToDualHelper function ");

        // create action with the method instance
        var action = component.get("c.playerConnectRequest");
        action.setParams({ 
                          player1Id : component.get("v.playerId"),
                          creationTime :component.get("v.eventTimeToSubscribe"),
                          playerType : component.get("v.playerTypeAtt")
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               /* alert("value from attr "+component.get("v.codeDefaultValues")+" "+
                      component.get("v.codeDefaultValues").requestTime
                     +" "+component.get("v.codeDefaultValues")["requestTime"]
                     ); */

                //change component state after 60seconds
               window.setTimeout(
    			$A.getCallback(function() {
       					 component.set("v.currentPlayerMode", "Receive Mode");
                    console.log("in getCallBack");
                     console.log(" in getCallBack "+component.get("v.currentPlayerMode"));
    			}), component.get("v.codeDefaultValues").requestTime
				);
                console.log("From server: " + response.getReturnValue());
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
    
    /*
     * This Helper creates the Board Id and publish platform event for the player2
     * This notification is crucial for the player 1 to connect with the player2
     * 
    */ 
    acceptDualHelper : function(component) {
        // create action with the method instance
        // player1Id,String player2Id,String playerType,String creationTime
        console.log("In acceptDualHelper function ");
        var action = component.get("c.acceptToDual");
        this.setEventTimeHelper(component);
        action.setParams({ 
                          player1Id : component.get("v.player1Id"),
            			  player2Id : component.get("v.player2Id"),
                          creationTime :component.get("v.requestedEventTime"),
                          playerType : component.get("v.playerTypeAtt")
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               console.log("From server: " + response.getReturnValue());
                component.set("v.playerBoardId",response.getReturnValue());
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
    
    setEventTimeHelper:function(component)
    {
     	//var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
	  	
	  	var today=new Date();
	  	var timeString=( today.getHours() +":"+today.getMinutes()+":"+today.getSeconds()+":"+today.getMilliseconds());
	 	component.set("v.eventTimeToSubscribe",timeString );  
    },
    
    createChangeComponentEventHelper:function(component)
    {
        console.log(" in createChangeComponentEventHelper");
        var newComponentName="BlockGameBoardCmp";
    	//player1Id,player2Id,player1Name,player2Name,playerBoardId,playerType
        var compChangeEvent=component.getEvent("changeComponentEvent");
        console.log(" player1Id  : "+component.get("v.player1Id")+
        			"player2Id  : "+component.get("v.player2Id")+
                     "player1Name : "+component.get("v.player1Name")+
                     "player2Name : "+component.get("v.player2Name")+
                     "playerBoardId : "+component.get("v.playerBoardId")+
                     "playerType : "+component.get("v.playerTypeAtt")
        );
         //blockBoardId,oldComponentToDelete,newComponentName
     //player1Id,player2Id,player1Name,player2Name,playerType
        compChangeEvent.setParams({oldComponentToDelete : component,
                                   newComponentName : newComponentName,
                                   player1Id : component.get("v.player1Id"),
                                   player2Id : component.get("v.player2Id"),
                                   player1Name : component.get("v.player1Name"),
                                   player2Name : component.get("v.player2Name"),
                                   blockBoardId : component.get("v.playerBoardId"),
                                   playerType : component.get("v.playerTypeAtt")								                                      
        						}); 
       compChangeEvent.fire(); 
	},
})