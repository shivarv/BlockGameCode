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
   				helper.onIndivBlockUpdateEventHelper(component,message);    
                
      		});
            component.set("v.subscriptionId",subscriptionId);
            console.log("subscription id "+subscriptionId);
    },
    
    
    /*
     * On Platform Event Publishing , this method will be called
     * It further fire playerConnectEvent component event
     * 
     Event Fields :
     	blockBoardId,individualBlockId,playerTurnOnEvent,PlayerType,gamePlayType,
		isElementOpen,isBlockElementFound
	
     
	Platform Event Fields :
		shivaBlockGame__Block_Board_Id__c,shivaBlockGame__individual_Block_Id__c,
		shivaBlockGame__player_Turn_On_Event__c,shivaBlockGame__playerType__c
		shivaBlockGame__streamGamePlayType__c ,shivaBlockGame__isElementOpen__c,
    	shivaBlockGame__isBlockElementFound__c
       
    */
    onIndivBlockUpdateEventHelper : function(component,message)
    {
        console.log(" in onIndivBlockUpdateEventHelper - advancedEventSubscriptionCmp : ");
        console.log(message);
        console.log("blockBoardId  "+component.get("v.blockBoardId"));
        console.log("blockBoardId  "+message.data.payload.shivaBlockGame__Block_Board_Id__c)

        //this must only handle platform events with the same block Ids
        console.log("in onIndivBlockUpdateEventHelper : shivaBlockGame__Block_Board_Id__c : "+message.data.payload.shivaBlockGame__Block_Board_Id__c
                    +" shivaBlockGame__individual_Block_Id__c : "+message.data.payload.shivaBlockGame__individual_Block_Id__c
                    +" shivaBlockGame__player_Turn_On_Event__c : "+message.data.payload.shivaBlockGame__player_Turn_On_Event__c
                    +" shivaBlockGame__playerType__c : "+message.data.payload.shivaBlockGame__playerType__c
                    +" shivaBlockGame__streamGamePlayType__c : "+message.data.payload.shivaBlockGame__streamGamePlayType__c
                    +" shivaBlockGame__isElementOpen__c : "+ message.data.payload.shivaBlockGame__isElementOpen__c
                    +" shivaBlockGame__isBlockElementFound__c : "+ message.data.payload.shivaBlockGame__isBlockElementFound__c
                   );
        var helper=this;
        if(message.data.payload.shivaBlockGame__Block_Board_Id__c!=
           component.get("v.blockBoardId")){
            console.log("blockBoardId and platform event boardid are different");
             return;
        }
        try{
        if(message.data.payload.shivaBlockGame__streamGamePlayType__c=="NORMAL")
        {
           if (component.get("v.currentPlayerType") == message.data.payload.shivaBlockGame__playerType__c)
           {
               console.log("CPT : " +component.get("v.currentPlayerType")
                        +" PT : "+message.data.payload.shivaBlockGame__playerType__c
                       	+" Message Type "+message.data.payload.shivaBlockGame__streamGamePlayType__c
                       );
            	console.log("same player event stream ,so ignoring it");
            	return ;
           }
           else{
               //update event fire
               helper.createAndfireEventHelper(component,"ImageBlockUpdateEvent",message);
            }
        }
        else if((message.data.payload.shivaBlockGame__streamGamePlayType__c=="FOUND")
               || (message.data.payload.shivaBlockGame__streamGamePlayType__c=="NOT FOUND")
               ){
            //special event fire
            helper.createAndfireEventHelper(component,"ImageBlockSpecialEvent",message);
        }
        else if ((message.data.payload.shivaBlockGame__streamGamePlayType__c=="WON")
                || (message.data.payload.shivaBlockGame__streamGamePlayType__c=="LOST")
                || (message.data.payload.shivaBlockGame__streamGamePlayType__c=="DRAW")
                )
        {
            console.log("before callling createAndfireEventHelper for  "+
                        " GameCompletedEvent "+message.data.payload.shivaBlockGame__streamGamePlayType__c);
        	helper.createAndfireEventHelper(component,"GameCompletedEvent",message);
     
        }
        
        }
        catch(e)
        {
            console.log("error in componentevent "+e);
        }
            
    },
    
    createAndfireEventHelper:function(component,eventName,message)
    {
        console.log("in createAndfireEventHelper - advancedEventSubscriptionCmp "+
                   "blockBoardId "+ message.data.payload.shivaBlockGame__Block_Board_Id__c+
            " individualBlockId "+ message.data.payload.shivaBlockGame__individual_Block_Id__c+
            " playerTurnOnEvent "+ message.data.payload.shivaBlockGame__player_Turn_On_Event__c+
            " PlayerType "+ message.data.payload.shivaBlockGame__playerType__c+
            " gamePlayType "+ message.data.payload.shivaBlockGame__streamGamePlayType__c+
            " isElementOpen "+ message.data.payload.shivaBlockGame__isElementOpen__c+
            " isBlockElementFound "+message.data.payload.shivaBlockGame__isBlockElementFound__c
                   );
        var compEvent=component.getEvent(eventName);
        	compEvent.setParams({
            "blockBoardId": message.data.payload.shivaBlockGame__Block_Board_Id__c,
            "individualBlockId": message.data.payload.shivaBlockGame__individual_Block_Id__c,
            "playerTurnOnEvent": message.data.payload.shivaBlockGame__player_Turn_On_Event__c,
            "PlayerType": message.data.payload.shivaBlockGame__playerType__c,
            "gamePlayType":message.data.payload.shivaBlockGame__streamGamePlayType__c,
            "isElementOpen": message.data.payload.shivaBlockGame__isElementOpen__c,
            "isBlockElementFound":message.data.payload.shivaBlockGame__isBlockElementFound__c
        	});
        	console.log(eventName+" event is fired ");
        	compEvent.fire(); 
    }
})