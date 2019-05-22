({
	doInit: function (component, event, helper) {
	  var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
	  component.set('v.today', today);
	  today=new Date();
	  var milliSeconds=( today.getHours() +":"+today.getMinutes()+":"+today.getSeconds()+":"+today.getMilliseconds());
	 component.set("v.timeInSeconds",milliSeconds );
	},
    
    unsubscribe : function(component)
    {
		var streamingApiComp=component.find("streamingApiComp");
		        streamingApiComp.unsubcribeMethod();
    },
    handleComponentChange:function(component,event,helper)
    {
	  console.log("in handleComponentChange event handler in Block Game ");
      var namespaceName="shivaBlockGame";
      var oldComponent= event.getParam("oldComponentToDelete");
      var playerId=event.getParam("playerId");
      var playerName=event.getParam("playerName");
      var newComponentName=event.getParam("newComponentName");
      var fullComponentName= (namespaceName+":"+ newComponentName);
      console.log("new Comp Name "+newComponentName+"  "+playerId +event.getParam("playerId"));
     //blockBoardId,oldComponentToDelete,
     //player1Id,player2Id,player1Name,player2Name,playerType

      console.log(" new Comp Name "+newComponentName+"  "+
                  " player1Id : "+event.getParam("player1Id")+
                  " player2Id : "+event.getParam("player2Id")+
                  " player1Name : "+event.getParam("player1Name")+
                  " player2Name : "+event.getParam("player2Name")+
                  " blockBoardId : "+ event.getParam("blockBoardId")+
				  " playerType : "+event.getParam("playerType")
                 );
      var attributes={};
      if(newComponentName=="GamePlayerRequestCmp")
      {
          attributes={"playerId":playerId,"playerName":playerName,"oldComponent":oldComponent};          
      }
      else
      {
          attributes={"player1Id" : event.getParam("player1Id"),
                      "player2Id" : event.getParam("player2Id"),
                      "player1Name" : event.getParam("player1Name"),
                      "player2Name" : event.getParam("player2Name"),
                      "blockBoardId" : event.getParam("blockBoardId"),
					  "playerType" : event.getParam("playerType"),	
                      "oldComponent":oldComponent};          
      }
      console.log("before creation helper "+JSON.stringify(attributes));
        
      helper.newComponentCreationHelper(component,newComponentName,fullComponentName,attributes)
    },
   
})