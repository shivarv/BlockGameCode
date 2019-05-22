({
    //new component creation Helper
	newComponentCreationHelper : function(component,newComponentName,fullComponentName,attributes) {

        console.log("in newComponentCreationHelper ");
        try{
        var attributeInFormat;
        if(newComponentName=="GamePlayerRequestCmp")
        {
            attributeInFormat ={"playerId":attributes.playerId,
                              "playerName" : attributes.playerName
                              };
        }
        else if(newComponentName=="BlockGameBoardCmp")
        {
            attributeInFormat={player1Id : attributes.player1Id,
                      player2Id : attributes.player2Id,
                      player1Name : attributes.player1Name,
                      player2Name : attributes.player2Name,
                      blockBoardId : attributes.blockBoardId,
					  playerType : attributes.playerType,	
                      };
            console.log(" in board game change P1 :"+attributes.player1Id + " P2 : "+
                        attributes.player2Id + " Board Id : "+attributes.blockBoardId
                       );
            
        }
        console.log("attributeInFormat "+JSON.stringify(attributeInFormat));
        console.log("attributes "+JSON.stringify(attributes));

        var helper=this;
		$A.createComponent(fullComponentName,attributeInFormat,
                           function(newComp, status, errorMessage){
                             helper.afterComponentCreationHelper(newComp,status,errorMessage,attributes,component);

                           }
      				     

		);
            }
        catch(c)
        {
            console.log("error in code "+c);
        }
  },
       
    afterComponentCreationHelper:function(newComp, status, errorMessage,attributes,component)
    {
	    console.log("in afterComponentCreationHelper ");
        if (status === "SUCCESS") {
    		console.log("new component is created");
        	var body=component.get("v.body");
            attributes.oldComponent.destroy();
            body.push(newComp);
            component.set("v.body",body);
        	}
        	else if (status === "INCOMPLETE") {
        		console.log("No response from server or client is offline.")
        		// Show offline error
       		}
       		else if (status === "ERROR") {
       			console.log("Error: " + errorMessage);
       			// Show error message
            }
    },
})

/*
 $A.createComponent(newComponentName,{"playerId":playerId,
                                            "playerName" : playerName
                                            },
      				      function(newComp, status, errorMessage){
        				  	if (status === "SUCCESS") {
                                console.log("new component is created");
                                var body=component.get("v.body");
                                oldComponent.destroy();
                                body.push(newComp);
                                component.set("v.body",body);
        					}
        					else if (status === "INCOMPLETE") {
        						console.log("No response from server or client is offline.")
        						// Show offline error
       						}
       						else if (status === "ERROR") {
       							console.log("Error: " + errorMessage);
       							// Show error message
    						}

 						}

	);
    
 */