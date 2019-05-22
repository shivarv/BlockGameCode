/*


 * created by 		:		Shiva RV
 * Date				:		11-21-2018
 * Description		:		This class is used to remove the records from the dev org

  
*/
public class QuickSnippetClass {
public static void recordsDelete()
{
    System.debug('in Delete Class - recordsDelete Function ');
    List<shivaBlockGame__Block_Board__c> allBoardRecords=[select id,shivaBlockGame__isGameEnded__c from shivaBlockGame__Block_Board__c];
   
    List<shivaBlockGame__Player__c> allPlayerRecords;
    List<shivaBlockGame__Individual_Block__c> allIndividualBlockRecords;
    
    System.debug('The Block Board Record count is  '+allBoardRecords.size());
    if(!allBoardRecords.isEmpty())
    {
        delete allBoardRecords;
    }
    allPlayerRecords=[select id from shivaBlockGame__Player__c];
    
    System.debug('The Game Player Record count is  '+allPlayerRecords.size());
	if(!allPlayerRecords.isEmpty())
    {

        delete allPlayerRecords;
    }
    allIndividualBlockRecords=[select id from shivaBlockGame__Individual_Block__c];
	//this might be 0 since it's in master detail relationship
    System.debug('The Individual Record count is  '+allIndividualBlockRecords.size());
    if(!allIndividualBlockRecords.isEmpty())
    {
        delete allIndividualBlockRecords;
    }
    System.debug('all records are deleted');
}
    private static shivaBlockGame__Block_Board__c board{get;set;}
    
    private static List<Id> getListOfAssociatedPlayerIds()
    {
        List<Id> playersNotToDeleteIds=new List<Id>();

        if(board!=null)
        {
             playersNotToDeleteIds.add(board.shivaBlockGame__Player1__c);
        	 playersNotToDeleteIds.add(board.shivaBlockGame__Player2__c);
        }
        return playersNotToDeleteIds;
        
    }
    
    public static void deleteAllExceptTestBoard(Id BoardId)
    {
        //static variable
        board=[select id,shivaBlockGame__Player1__c,shivaBlockGame__Player2__c
                                              from shivaBlockGame__Block_Board__c where id=:BoardId];
        board.shivaBlockGame__isGameEnded__c=false;
		update board;
        List<shivaBlockGame__Block_Board__c> allOtherBoards=[select id,shivaBlockGame__Player1__c,shivaBlockGame__Player2__c
                                              from shivaBlockGame__Block_Board__c where id !=:BoardId];
       List<Id> playersNotToDeleteIds=getListOfAssociatedPlayerIds();
		List<shivaBlockGame__Player__c> allOtherplayersToDelete=[
            											select id from shivaBlockGame__Player__c where id not in :playersNotToDeleteIds
        												];
        System.debug(allOtherplayersToDelete.size());
        System.debug(allOtherBoards.size());

        delete allOtherBoards;
        delete allOtherplayersToDelete;
      
    }
    
    //cant use __ in variable name
    public static void makeAllREcordsNotFound(Id BoardId)
    {
        System.debug('in Delete Class - makeAllREcordsNotFound Function ');
 		shivaBlockGame__Block_Board__c myBoard=[select id,shivaBlockGame__Player1__c,shivaBlockGame__Player2__c
                                              from shivaBlockGame__Block_Board__c where id=:BoardId];
        myBoard.shivaBlockGame__isGameEnded__c=false;
        update myBoard;
        List<shivaBlockGame__Individual_Block__c> records=[select id,
                                                           shivaBlockGame__isFound__c,shivaBlockGame__isOpen__c
                                                          from shivaBlockGame__Individual_Block__c
                                                          where shivaBlockGame__Owner_Board__c= :BoardId];
        System.debug('record size is '+records.size());
        System.debug('record '+records);
        for(shivaBlockGame__Individual_Block__c rr : records)
        {
            rr.shivaBlockGame__isFound__c=false;
            rr.shivaBlockGame__isOpen__c=false;
        }
        update records;

    }
}