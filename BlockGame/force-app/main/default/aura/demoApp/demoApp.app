<aura:application extends="force:slds">
    
        <aura:attribute name="SearchResults" type="List"></aura:attribute>
	<aura:attribute type="Boolean" name="isPlayerTwo" default="false"></aura:attribute>
    <aura:attribute name="imageList" type="List"></aura:attribute>
        <aura:attribute name="doubleImageList" type="List"></aura:attribute>

       <aura:attribute name="record" type="List"></aura:attribute>

    <aura:handler name="init" value="{!this}" action="{!c.doInit}"></aura:handler>
   
      <aura:iteration items="{!v.imageList}" var="imageName">
         
       <!--   <img src="{!$Resource.shivaBlockGame__ImageResource +'/Images/'+ imageName+'.jpg'}" actualName="{!v.imageName}" width="125" height="125"/> 

         <img src="{!$Resource.shivaBlockGame__ImageResource +'/Images/notSelectedImage.jpg'}" data-record-id="{!v.imageName}" width="125" height="125" onclick="{!c.chosenImage}"/> --> 
      </aura:iteration> 
   <!-- <div onclick="{! c.someClickHandler }" class="myClass" data-columns="{# v.record.Id }" >hello</div>
 	-->
	<!-- working one -->
    <!--
    <tr >  
    <aura:iteration items="{!v.imageList}" var="imageName"  indexvar="index">
                <td onclick="{!c.selected}" data-record="{!imageName}">
 		<img src="{!$Resource.shivaBlockGame__ImageResource +'/Images/notSelectedImage.jpg'}" width="125" height="125" onclick="{!c.chosenImage}"/>
 				</td>
    </aura:iteration>
     </tr>
    -->
    
    is Player -{!v.isPlayerTwo}
    <aura:if isTrue="{!v.isPlayerTwo}">
    <c:BlockGameBoardCmp blockBoardId="a017F00000wTbcNQAS" playerType="Player 2"></c:BlockGameBoardCmp>
        </aura:if>
     <aura:if isTrue="{! !v.isPlayerTwo}">
             <c:BlockGameBoardCmp blockBoardId="a017F00000wTbcNQAS" ></c:BlockGameBoardCmp>

    </aura:if>
    <br/>
   

</aura:application>

 <!--
    <table>
        <aura:iteration items="{!v.doubleImageList}" var="imageList1"  indexvar="key">
            <tr>
                
            <aura:iteration items="{!imageList1.value}" var="imageName"  indexvar="index">
                 <td onclick="{!c.selected}" data-record="{!imageName}">
                 
               	<img src="{!$Resource.shivaBlockGame__ImageResource +'/Images/notSelectedImage.jpg'}" width="100" height="75" onclick="{!c.chosenImage}">
                </img>
                </td>
            </aura:iteration>
            </tr>
    </aura:iteration>
        </table>
   <c:EventSubscriptionCmp currentPlayerMode="Player2"></c:EventSubscriptionCmp> -->