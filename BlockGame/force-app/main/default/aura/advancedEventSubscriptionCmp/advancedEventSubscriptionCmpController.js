({
    /*
     * On init , fetch the session id and then subscribe to the platform event using cometd
     * 
    */
    doInit : function(component, event, helper) {
    console.log('doing init on -advancedEventSubscriptionCmp');
    // Retrieve the session id and initialize cometd
    helper.fetchSessionAndSubscribeHelper(component,helper);
    },

    /*
     * blockBoardId,individualBlockId,playerTurnOnEvent,PlayerType,gamePlayType,
		isElementOpen,isBlockElementFound
    */
    
 
})