({
	createPlayerHelper : function(component) {
        console.log("in createPlayerHelper");
        // create action with the method instance
        var action = component.get("c.createPlayerRecord");
        var helper=this;
        action.setParams({ userName : component.get("v.userNameAtt"),
                          userEmail : component.get("v.userEmailAtt"),
                          userGender : component.get("v.userGenderAtt")
                          
                         });

        // Create a callback that is executed after server side call returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.currentCmpState","Requested Mode");
                console.log("From server: " + response.getReturnValue());
                component.set("v.playerRecordId",response.getReturnValue());
                helper.changeComponentHelper(component);
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
     * This method is used to create event which can be used to change the component
     * The component will be changed to Ready To connect component
    */
    changeComponentHelper :function(component)
    {
        console.log("in changeComponentHelper");
		var newComponentNameToLoad="GamePlayerRequestCmp";
        var compEvent = component.getEvent("changeComponentEvent");
        compEvent.setParams({
            oldComponentToDelete : component,
            newComponentName :	newComponentNameToLoad,
            playerId :	component.get("v.playerRecordId"),
            playerName : component.get("v.userNameAtt")
        });
		compEvent.fire();

    }

})