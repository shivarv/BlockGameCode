({
    /*
     * On init , fetch the session id and then subscribe to the platform event using cometd
     * 
    */
    doInit : function(component, event, helper) {
    console.log('doing init on streamer');
    // Retrieve the session id and initialize cometd
    helper.fetchSessionAndSubscribeHelper(component,helper);
    },

	/*
     * To unsubscribe Event
     * 
    */    
    unsubscribe:function(component ,event,helper)
    {
        console.log("in unsubscribe method ");
        $.cometd.unsubscribe(component.get("v.subscriptionId"));
    },
    
    /*
     * This Method can be used to change the event subscription url dynamically
     * Reusing the same component to subscribe to different event later
     * 
    */  
    setNewEventListener : function(component,event,helper,newEventName,doSubscribe)
    {
      	console.log("in set New Event Listener ")  ;
        component.set("v.eventName",newEventName);
        if(doSubscribe)
        {
            helper.fetchSessionAndSubscribeHelper(component,helper);
        }
    },
    
    //this method is used for better filtering of events,neccessary to handle further code
    setEventTime : function(component,event,helper,eventTime)
    {
    	console.log("in set New Event Listener ")  ;
		component.set("v.eventTimeToSubscribe",eventTime);
    },
    
    //verify handle player connect event
    handlePlayerConnectEvent : function(component,event,helper,eventTime)
    {
        //player2Id ,playerGameBoardId,playerType,gameCreationTime
        console.log("in handle player connect event Function ");
        console.log(" event data :: "+ " player 1 Id : "+event.getParam("player1Id")+
                    " player 2 Id : "+event.getParam("player2Id")+
                    " playerGameBoardId : "+event.getParam("playerGameBoardId")+
                    " playerType : "+event.getParam("playerType")+
					" gameCreationTime : "+event.getParam("gameCreationTime")                    
                    );
    },
})