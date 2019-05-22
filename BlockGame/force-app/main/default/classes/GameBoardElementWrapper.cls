/*
 * created by 		:		Shiva RV
 * Date				:		11-21-2018
 * Description		:		Wrapper Class to be used in lightning Board Component Init			
 */
public class GameBoardElementWrapper
    {
        @AuraEnabled
        public shivaBlockGame__Block_Board__c blockBoardDetail;
        @AuraEnabled
        public List<shivaBlockGame__Individual_Block__c> individualBlocks;
        
       // @AuraEnabled
      //  public List<List<shivaBlockGame__Individual_Block__c>> individualBlocks;
        
        public GameBoardElementWrapper(shivaBlockGame__Block_Board__c blockBoardDetail ,
                                      List<shivaBlockGame__Individual_Block__c> individualBlocks
                                      )
        {
            this.blockBoardDetail=blockBoardDetail;
            this.individualBlocks=individualBlocks;
            /*
            this.individualBlocks=new List<List<shivaBlockGame__Individual_Block__c>>();
            List<shivaBlockGame__Individual_Block__c> only8Records=new List<shivaBlockGame__Individual_Block__c>();
            Integer ii=0;
            for(shivaBlockGame__Individual_Block__c block : individualBlocks)
            {
                only8Records.add(block);
                ii++;
                if(ii==8)
                {
                    ii=0;
                    this.individualBlocks.add(only8Records);
                    only8Records=new List<shivaBlockGame__Individual_Block__c>();
                }
            }
			*/
            
        }
    }