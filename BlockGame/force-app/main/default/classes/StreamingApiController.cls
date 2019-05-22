/*


 * created by 		:		Shiva RV
 * Date				:		11-21-2018
 * Description		:		used to give the session for Platform Event Subscription

  
*/

public class StreamingApiController {

@AuraEnabled
public static Object getSession(){
   return UserInfo.getSessionId();
} 
}