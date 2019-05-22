({
    /*
     * Helper Method to Build Platform Event Url from it's name
     * 
    */
	buildUrlHelper : function(component) {
        console.log("in buildUrlHelper method : ");

		if (component.get("v.eventName"))
        {
			return '/event/'+component.get("v.eventName");
		} 
        else {
			console.error('Neither the topic nor the platform event is specified');
		}

	},
    
    /*
     * Fetching Session Id , it is needed for connecting to commetdId
     * 
    */
    
    fetchSessionAndSubscribeHelper : function(component,helper)
    {
        console.log("in fetchSessionAndSubscribeHelper method : ");
    	let sessionAction = component.get("c.getSession");
    	console.log(" in init of streaming component "+JSON.stringify(component.get("c.getSession")) + ' '+sessionAction.namespace);
    	let url = helper.buildUrlHelper(component);
    	console.log(url);
    	sessionAction.setCallback(this, function(response) {
    	let state = response.getState();
    	if(state  === "SUCCESS") {
      		let sessionId = response.getReturnValue();
      		helper.subscribeToEventHelper(component,sessionId,url);
      	}
    });
	$A.enqueueAction(sessionAction);
	},
    
    
    /*
     * This method is used to subscribe to the event after session id is obtained
     * 
    */
    subscribeToEventHelper : function(component,sessionId,url)
    {
        console.log("in subscribeToEventHelper method : ");
		var helper=this;
        console.log("in init of streaming component session id "+sessionId+"  after stringify "+JSON.stringify(sessionId));
      	let authstring = "OAuth " + sessionId;
      	//authenticate to the Streaming API
      	$.cometd.init({
    	  		url: window.location.protocol + '//' + window.location.hostname + '/cometd/40.0/',
          		requestHeaders: { Authorization: authstring },
          		appendMessageTypeToURL : false
          		});
      		var subscriptionId=$.cometd.subscribe(url, function (message){
      			console.log("new message "+JSON.stringify(message));
   				helper.onPlayerPlatformEventHelper(component,message);    
                
      		});
            component.set("v.subscriptionId",subscriptionId);
            console.log("subscription id "+subscriptionId);
    },
    
    
    /*
     * On Platform Event Publishing , this method will be called
     * It further fire playerConnectEvent component event
    */
    onPlayerPlatformEventHelper : function(component,message)
    {
        console.log("in onPlayerPlatformEventHelper : shivaBlockGame__player1_Id__c : "+message.data.payload.shivaBlockGame__player1_Id__c
                    +" shivaBlockGame__player2_Id__c : "+message.data.payload.shivaBlockGame__player2_Id__c
                    +" shivaBlockGame__playerGameBoard__c : "+message.data.payload.shivaBlockGame__playerGameBoard__c
                    +" shivaBlockGame__playerType__c : "+message.data.payload.shivaBlockGame__playerType__c
                    +" shivaBlockGame__unique_Creation_Time_Id__c : "+message.data.payload.shivaBlockGame__unique_Creation_Time_Id__c
                   );
        var compEvent=component.getEvent("playerConnectEvent");
        //Lightning Player Connect  Event Attributes Below
     //   player1Id,player2Id,playerGameBoardId,playerType,gameCreationTime
     //   platform Event field names Below
     //   shivaBlockGame__player1_Id__c	 ,shivaBlockGame__player2_Id__c, shivaBlockGame__playerGameBoard__c
     //   ,shivaBlockGame__playerType__c,shivaBlockGame__unique_Creation_Time_Id__c
        compEvent.setParams({
            "player1Id":message.data.payload.shivaBlockGame__player1_Id__c,
            "player2Id":message.data.payload.shivaBlockGame__player2_Id__c,
            "playerGameBoardId":message.data.payload.shivaBlockGame__playerGameBoard__c,
            "playerType": message.data.payload.shivaBlockGame__playerType__c,
            "gameCreationTime":message.data.payload.shivaBlockGame__unique_Creation_Time_Id__c
        });
        compEvent.fire();
    },
})