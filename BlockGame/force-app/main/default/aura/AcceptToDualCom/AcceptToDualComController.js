({
    //when he accepts the request , he become player 2 , game must be started as well
	acceptDual : function(component, event, helper) {
        console.log("In Accept Dual Method ");
        helper.createAcceptEventHelper(component);
        //after the helper call , delete this component
        component.destroy();

	},
    
    rejectDual : function(component, event, helper) {
    	console.log("In Reject Dual Method ");
        component.destroy();
    },
    
    closeMe: function(component, event, helper) {
                component.destroy();

    },
})