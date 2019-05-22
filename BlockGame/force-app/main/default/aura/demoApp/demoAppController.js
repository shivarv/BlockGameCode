({
	doInit : function(component, event, helper) {
        console.log("in doInit");
		var imageList=[
        'fish','frog','cat','dog','butterfly',//1
        'lion','wolf','buffalo','ox','tiger', //2
        'elephant','panda','bear','peacock','peahen', //3
        'hen','cock','zebra','horse','rhinoceros', //4
        'hippopotamus','monkey','giraffe','squirrel','pigeon',//5
        'donkey','camel','kangaroo','goat','chick', //6
        'crocodile','deer','alligator','eagle','snake',//7
        'shark','fox','jackal','toad' ,'hyena', //8
        'leopard','cheetah','rabbit','hornet','ostrich',//9
        'owl','parrot','porcupine','pig','rat' //10
        ];
        var doubleImageList=[
            {key:0,value:['fish','frog','cat','dog','butterfly','lion','wolf','buffalo']},//1
            {key:1,value:['ox','tiger','elephant','panda','bear','peacock','peahen','hen']},//2
            {key:2,value:['cock','zebra','horse','rhinoceros','hippopotamus','monkey','giraffe','squirrel']},//3
            {key:3,value:['pigeon','donkey','camel','kangaroo','goat','chick','crocodile','deer']},//4
            {key:4,value:['alligator','eagle','snake','shark','fox','jackal','toad' ,'hyena']},//5
            {key:5,value:['leopard','cheetah','rabbit','hornet','ostrich','owl','parrot','porcupine']},//6
        ];
        component.set("v.doubleImageList",doubleImageList);
        component.set("v.imageList",imageList);
        var record={"Id":"helloWorld"};
        component.set("v.record",record);
        var SearchResults=[{"Id":"leopard"},{"Id":"cheetah"},{"Id":"hornet"}];
        component.set("v.SearchResults",SearchResults);
	},
    chosenImage:function(component, event, helper) {
        console.log(event.target.src);
        console.log(event.currentTarget);
        var imageName=event.currentTarget.getAttribute("data-record-id");
        console.log(imageName);
    },
 
    selected :function(component, event, helper) {
        
         var selectedItem = event.currentTarget;
         var recId = selectedItem.dataset.record;
        console.log("recId :"+recId);
        var Imagename=selectedItem.getElementsByTagName("img")[0].src;
        console.log(Imagename);
        var newSrc=Imagename.slice(0,Imagename.lastIndexOf("/"));
        newSrc+="/"+recId+".jpg";
        console.log("new src is ");
        console.log(newSrc);
        selectedItem.getElementsByTagName("img")[0].src=newSrc;
        
    },
})