({
    /*This method helps in firing the accept event and destroys the component
     * */
    createAcceptEventHelper:function(component)
    {
      	var acceptEvent=component.getEvent("playerAcceptEvent");
        acceptEvent.setParams({"player1Id":component.get("v.player1Id"),
                               "player1Name": component.get("v.player1Name"),
                               "player1RequestTime" : component.get("v.player1RequestTime")
                              });
        acceptEvent.fire();
    },
})