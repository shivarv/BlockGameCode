/*


 * created by 		:		Shiva RV
 * Date				:		11-21-2018
 * Description		:		This contains logics for publish platform event during request and accepting duals

  
*/


public class GamePlayRequestController {

    
    /*
     * Create Player Record 
	*/
     @AuraEnabled
    public static Id createPlayerRecord(String userName,String userEmail,String userGender)
    {
        System.debug('In createPlayerRecord Apex Method : ');
        shivaBlockGame__Player__c newPlayer=new shivaBlockGame__Player__c(
        shivaBlockGame__userName__c=userName,
        name=userName,
        shivaBlockGame__user_Email__c=    userEmail,
         shivaBlockGame__gender__c  = userGender
        );
        insert newPlayer;
        return newPlayer.Id;
    }
    
    public static Id createBlockBoard(String player1Id,String player2Id)
    {
        //shivaBlockGame__gameSize__c is picklist
        System.debug('In createBlockBoard Apex Method : ');

        shivaBlockGame__Block_Board__c newBlock=new shivaBlockGame__Block_Board__c(
        shivaBlockGame__gameSize__c=48,shivaBlockGame__Player_1_Points__c=0,shivaBlockGame__Player1__c=player1Id,
        shivaBlockGame__Player2__c=player2Id,shivaBlockGame__isGameStarted__c=true,shivaBlockGame__isGameEnded__c=false
        );
        insert newBlock;
        return newBlock.Id; 
    }
    
    @AuraEnabled
    public static Id acceptToDual(String player1Id,String player2Id,
                                    String playerType,String creationTime)
    {
        System.debug('In acceptToDual Apex Method : ');

        String playerBoardId=createBlockBoard(player1Id,player2Id);
      	//it creates the 48 individual child records
        //createAllIndividualBlocks(playerBoardId,48);
        List<Id> playerIds=new List<Id>{Id.valueOf(player1Id),Id.valueOf(player2Id)};
        List<shivaBlockGame__Player__c> playersData=[select id,shivaBlockGame__userName__c from shivaBlockGame__Player__c
                           where Id in :playerIds
                          ];
        List<String> playersName=new List<String>();
        if(playersData.get(0).Id==player1Id){
        	playersName.add(playersData.get(0).shivaBlockGame__userName__c);
     		playersName.add(playersData.get(1).shivaBlockGame__userName__c);
        }
        else{
            playersName.add(playersData.get(1).shivaBlockGame__userName__c);
     		playersName.add(playersData.get(0).shivaBlockGame__userName__c);
        }
        createPlatformEvent(player1Id,player2Id,
                            playersName.get(0),playersName.get(1),
                            playerBoardId,playerType,creationTime);
        return playerBoardId;
    }
    
    /*
     *This method is called onInit to load the list of individual record fields on BlockGameBoardComp 
    */ 
    @AuraEnabled
    public static GameBoardElementWrapper fetchAllIndividualBlockWrapper(Id blockBoardId)
    {
        System.debug('In fetchAllIndividualBlockWrapper Apex Method : ');
        GameBoardElementWrapper wrapperObject=null;
        try{
		
        shivaBlockGame__Block_Board__c blockBoard=[select id,shivaBlockGame__Player1__c,shivaBlockGame__Player2__c,
                                                   shivaBlockGame__Player1__r.Name,shivaBlockGame__Player2__r.Name,
                                                   shivaBlockGame__Player_1_Points__c,shivaBlockGame__Player_2_Points__c,
                                                   shivaBlockGame__isGameStarted__c
            										from shivaBlockGame__Block_Board__c where id=:blockBoardId
        										  ];
        List<shivaBlockGame__Individual_Block__c> allIndiBlockRecords=[ select id,name,
            shivaBlockGame__Owner_Board__c,
            shivaBlockGame__image_Name__c,shivaBlockGame__isFound__c,
            shivaBlockGame__isOpen__c,shivaBlockGame__Player_Found_The_Block__c from shivaBlockGame__Individual_Block__c
            where shivaBlockGame__Owner_Board__c=:blockBoardId  order by name asc                                                          
        ];
        if(allIndiBlockRecords.size()!=0)
        {
            wrapperObject=new GameBoardElementWrapper(blockBoard,allIndiBlockRecords);
        }
          
        }
        catch(Exception e)
        {
            System.debug(e);
        }
          return wrapperObject;
    }
    //eventType FOUND or NOT FOUND or NORMAL 
    //This Method only gets FOUND or NOT FOUND event
    @AuraEnabled
    public static void closeOrOpenImageUpdate(List<Id> individualBlockIds,
                                              String playerTypeClicked,String eventType)
    {
        System.debug('in closeOrOpenImageUpdate function in GamePlayRequestController Apex Class');
         List<shivaBlockGame__Individual_Block__c> recordToUpdate =[SELECT id ,shivaBlockGame__image_Name__c,
                       shivaBlockGame__isFound__c,shivaBlockGame__isOpen__c,shivaBlockGame__Owner_Board__c,
                       shivaBlockGame__Player_Found_The_Block__c FROM shivaBlockGame__Individual_Block__c 
                                  WHERE  id= : individualBlockIds //shivaBlockGame__isOpen__c=true 
                                                                   ];
        //if FOUND make isFound as true for both the open blocks
        if(eventType=='FOUND'){
            recordToUpdate[0].shivaBlockGame__isFound__c=true;
            recordToUpdate[1].shivaBlockGame__isFound__c=true;
            recordToUpdate[0].shivaBlockGame__isOpen__c=true;
            recordToUpdate[1].shivaBlockGame__isOpen__c=true;
        }
         //else NOT FOUND make isOpen as false for both the open blocks
        else{
            recordToUpdate[0].shivaBlockGame__isOpen__c=false;
            recordToUpdate[1].shivaBlockGame__isOpen__c=false;
        }
        update recordToUpdate;    
        if(recordToUpdate.size()==2){
           publishIndiviBlockChangeEvent(recordToUpdate[0],playerTypeClicked,eventType);
           publishIndiviBlockChangeEvent(recordToUpdate[1],playerTypeClicked,eventType);

        }
        
    }
    
    /*
     *This is the gaming part , it updates the individual game block at backend and also makes a platform event
	 *This makes sure if the same image are found or not
	 *Whenever an image is clicked ,it updates the record
	 *Not all Event update needed an platform event to be generated , like auto close of blocks don't need
	 *Platform Events to be generated
	*/
    @AuraEnabled
    public static void updateIndividualBlockByPlayer(Id recordToUpdateId,String playerTypeClicked
                                                     ,Boolean requireEventPublish
                                                    )
    {
         if(requireEventPublish)
             return;
        shivaBlockGame__Individual_Block__c recordToUpdate =[SELECT id ,shivaBlockGame__image_Name__c,
                       shivaBlockGame__isFound__c,shivaBlockGame__isOpen__c,shivaBlockGame__Owner_Board__c,
                       shivaBlockGame__Player_Found_The_Block__c FROM shivaBlockGame__Individual_Block__c 
                                  WHERE id= :recordToUpdateId];
                                                
        System.debug('In updateIndividualBlockByPlayer Apex Method : ');
        update recordToUpdate;
       
        publishIndiviBlockChangeEvent(recordToUpdate,playerTypeClicked,'NORMAL');
        
    }
    
    /* playerType must be Player 1
     * GameEndEventType can be WON,LOST,DRAW
     * blockBoardId is used to identify the blockBoard
    */ 
    @AuraEnabled
   public static void generateGameOverEvent(String blockBoardId,String playerType,String gameEndEventType)
   {
       System.debug('In generateGameOverEvent GamePlayRequest Controller ');
       shivaBlockGame__Block_Board__c boardObj=[SELECT id,
		shivaBlockGame__isGameEnded__c,shivaBlockGame__gameWinner__c FROM     
                                                shivaBlockGame__Block_Board__c WHERE id =:blockBoardId
       ];
       boardObj.shivaBlockGame__isGameEnded__c=true;
       update boardObj;
       publishGameOverEvent(blockBoardId,playerType,gameEndEventType);
   }
    
    public static void publishGameOverEvent(String blockBoardId,String playerType,String gameEndEventType)
    {
        System.debug('In publishGameOverEvent GamePlayRequest Controller ');
       
        List<shivaBlockGame__Individual_Block_Change_Event__e> imageChangeEvents=
             new List<shivaBlockGame__Individual_Block_Change_Event__e>();
        imageChangeEvents.add(new shivaBlockGame__Individual_Block_Change_Event__e
                             	(
                                	shivaBlockGame__Block_Board_Id__c = blockBoardId,
                                	shivaBlockGame__playerType__c = playerType, 
                                    shivaBlockGame__streamGamePlayType__c = gameEndEventType
                                )
                             );
        
        // This part can be moved to a new Function Block
        List<Database.SaveResult> results = EventBus.publish(imageChangeEvents);
        // Inspect publishing results
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                for (Database.Error error : result.getErrors()) {
                    System.debug('Error returned: ' + error.getStatusCode() +' - '+ error.getMessage());
                }
            }
            else
            {
                System.debug('success ');                
            }
        } 
        
    }
    
    
    // gamePlayType can be NORMAL , NOT FOUND , FOUND
    public static void publishIndiviBlockChangeEvent(shivaBlockGame__Individual_Block__c record,String playerType
                                                     ,String gamePlayType
                                                    )
    {
        System.debug('In publishIndiviBlockChangeEvent Game Play Request Controller ');
        System.debug('record details '+record);
        System.debug('playerType '+playerType+' gamePlayType  '+gamePlayType);

        String newPlayerTurn=(playerType=='Player 1'?'Player 2':'Player 1');
        List<shivaBlockGame__Individual_Block_Change_Event__e> imageChangeEvents=
             new List<shivaBlockGame__Individual_Block_Change_Event__e>();
        imageChangeEvents.add(new shivaBlockGame__Individual_Block_Change_Event__e
                             	(
                                	shivaBlockGame__Block_Board_Id__c = record.shivaBlockGame__Owner_Board__c,
                                	shivaBlockGame__individual_Block_Id__c = record.Id,
                                	shivaBlockGame__player_Turn_On_Event__c = newPlayerTurn,
                                	shivaBlockGame__playerType__c = playerType, 
                                    shivaBlockGame__isElementOpen__c = record.shivaBlockGame__isOpen__c,
                                    shivaBlockGame__isBlockElementFound__c = record.shivaBlockGame__isFound__c,
                                	shivaBlockGame__streamGamePlayType__c = gamePlayType
                                )
                             );
        
        // This part can be moved to a new Function Block
        List<Database.SaveResult> results = EventBus.publish(imageChangeEvents);
        // Inspect publishing results
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                for (Database.Error error : result.getErrors()) {
                    System.debug('Error returned: ' + error.getStatusCode() +' - '+ error.getMessage());
                }
            }
            else
            {
                System.debug('success ');                
            }
        } 
    }
    
    public static void twoImagesAreMatchedAndFound(List<shivaBlockGame__Individual_Block__c> individualBlocks,
                                                      String playerClicked)
    {
        System.debug('In twoImagesAreMatchedAndFound Apex Method : ');
        for(shivaBlockGame__Individual_Block__c indivBlock :individualBlocks)
        {
            indivBlock.shivaBlockGame__isOpen__c=true;
            indivBlock.shivaBlockGame__isFound__c=true;
            indivBlock.shivaBlockGame__Player_Found_The_Block__c=playerClicked;
        }
        update individualBlocks;
        
        
    }
    
    public static boolean isSameMatchImageClicked(List<shivaBlockGame__Individual_Block__c> individualBlocks)
    {
        System.debug('In isSameMatchImageClicked Apex Method : ');

        if(individualBlocks[0].shivaBlockGame__image_Name__c==individualBlocks[1].shivaBlockGame__image_Name__c){
           return true; 
        }
        return false;
   }
    
    //make sure count is even
   	public static void createAllIndividualBlocks(String playerBoardId,Integer count)
    {
    	System.debug('In createAllIndividualBlocks Apex Method : ');
        try{
        List<shivaBlockGame__Individual_Block__c> individualBlocks=new List<shivaBlockGame__Individual_Block__c>();
        //currently make the count as 48
        Integer blockI=0,blockJ=0;
        Integer maxBlockI=6,maxBlockJ=8;

       //generates list from 0 - count-1 (inclusive)
        List<Integer> allNumbers=generateNumberList(count);
        List<Integer> randomNumbers=new List<Integer>();  
        Map<Integer,String> imageNames=new  Map<Integer,String>();
        Integer randomIndex;
       
        String imageName;
        for(Integer i=0;i<(count/2);i++)
        {
            String data='';
            randomIndex = mathRandomNumberGenerator(allNumbers.size());
            //fetch the image of the value from allNumbers at index randomIndex
            imageName=StaticValueClass.allImageFileNames.get(allNumbers.get(randomIndex));
            
            randomNumbers.add(allNumbers.get(randomIndex));
            //must use allNumbers.get(randomIndex) ,else key overriding error happens
            imageNames.put(allNumbers.get(randomIndex),imageName);
            allNumbers.remove(randomIndex);
            data+=('rI1 : '+randomIndex + ' image : '+imageName+' : ');
            displayList(allNumbers);

            
            randomIndex= mathRandomNumberGenerator(allNumbers.size());
            
            randomNumbers.add(allNumbers.get(randomIndex));
            imageNames.put(allNumbers.get(randomIndex),imageName);
            allNumbers.remove(randomIndex);
            data+=('--rI2 : '+randomIndex + ' image : '+imageName+' : ');
            displayList(allNumbers);

            System.debug(data);


        }
        System.debug('All Numbers : '+allNumbers);
        String s='';
        for(Integer IndImageName: imageNames.keySet())
        {
            System.debug(IndImageName+'  : '+imageNames.get(IndImageName));
            individualBlocks.add(new shivaBlockGame__Individual_Block__c
                                (
                                    name=('Block'+(String.valueOf(blockI)+String.valueOf(blockJ))),
                                    shivaBlockGame__image_Name__c =imageNames.get(IndImageName),
                                    shivaBlockGame__isFound__c=false,
                                    shivaBlockGame__isOpen__c=false,
                                    shivaBlockGame__Owner_Board__c=Id.valueOf(playerBoardId),
                                    shivaBlockGame__Player_Found_The_Block__c=''
                                )
                                );
            
            blockJ++;
            if(blockJ==maxBlockJ)
            {
                blockI++;
				blockJ=0;                
            }
			
           
        }
        for(Integer i:randomNumbers)
        {
            s+=(i+' : ');
        }
            
        System.debug(s);
            System.debug('total block size '+48);
		if(individualBlocks.size()==48)
        {
            System.debug('before insert ');
            insert individualBlocks;
        }
        }
        catch(Exception e)
        {
            System.debug('in exception '+e);
        }
    }
    public static Integer mathRandomNumberGenerator(Integer size)
    {
       System.debug('In mathRandomNumberGenerator Apex Method : ');
       Integer randomIndex= (Integer)Math.floor(Math.Random()*size); 
       if(randomIndex==size){
            randomIndex--;
       }
		return randomIndex;
    }
    
     public static List<Integer> generateNumberList(Integer size)
    {
        System.debug('In generateNumberList Apex Method : ');
    	List<Integer> numbersList=new List<Integer>();
        for(integer i=0;i<size;i++)
        {
            numbersList.add(i);
        }
        displayList(numbersList);
        return numbersList;
    }
    
   
    
    public static void displayList(List<Integer> intdata)
    {
        System.debug('In displayList Apex Method : ');
        String data=' size : '+intdata.size()+' ';
        for(Integer i:intdata)
            data+=(i+' :');
        System.debug(data);
    }
    
    /*
     * This method is used to publish Platform Events in salesforce
     * 
     * 
     * 
    */ 
    public static void createPlatformEvent(String player1Id,String player2Id,
                                           String player1Name,String player2Name,
                                           String playerBoardId,String playerType,String creationTime
                                          )
    {
        System.debug('In createPlatformEvent Apex Method : ');

        List<shivaBlockGame__Board_Dual_Request__e> requestNotifications = new List<shivaBlockGame__Board_Dual_Request__e>();
        shivaBlockGame__Board_Dual_Request__e blockEvent=new shivaBlockGame__Board_Dual_Request__e(
            shivaBlockGame__player1_Id__c= player1Id,shivaBlockGame__player2_Id__c=player2Id,
            
            shivaBlockGame__playerType__c=playerType,shivaBlockGame__playerGameBoard__c=playerBoardId,
            shivaBlockGame__unique_Creation_Time_Id__c=creationTime
        	);
        requestNotifications.add(blockEvent);
        List<Database.SaveResult> results = EventBus.publish(requestNotifications);
        // Inspect publishing results
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                for (Database.Error error : result.getErrors()) {
                    System.debug('Error returned: ' + error.getStatusCode() +' - '+ error.getMessage());
                }
            }
            else
            {
                System.debug('success ');                
            }
        } 
        
    }
    
    @AuraEnabled
    public static void playerConnectRequest(String player1Id,String creationTime,String playerType)
    {
        System.debug('In playerConnectRequest Apex Method : ');

        String blockGameBoardId;
        //player1Id,player2Id,player1Name,player2Name,boardid,playerType,creationTime
        String player1Name=[select id,shivaBlockGame__userName__c from shivaBlockGame__Player__c
                           where Id= :Id.valueOf(player1Id) limit 1
                          ].shivaBlockGame__userName__c;
        createPlatformEvent(player1Id,'',player1Name,'','',playerType,creationTime);
        
    }
}