<!--


 * created by 		:		Shiva RV
 * Date				:		11-21-2018
 * Description		:		Blocks Game App

  
-->
<aura:application extends="force:slds">
<!-- attribute start -->
<aura:attribute name="timeInSeconds" type="String"></aura:attribute>

<aura:attribute name="today" type="Date"></aura:attribute>
    
    <!-- attribute end -->

 <!-- handler start -->
<aura:handler name="init" action="{!c.doInit}" value="{!this}"></aura:handler>
<aura:handler name="changeComponentEvent" event="c:LightningComponentChangeEvent"
    action="{!c.handleComponentChange}"  />
	<!-- handler end -->
    <!--
Hello World {!v.today} <br/>
{!v.timeInSeconds}
    <br/> -->
{!v.body}
    <c:PlayerCreationForm></c:PlayerCreationForm>
<!-- <c:EventSubscriptionCmp aura:id="streamingApiComp"></c:EventSubscriptionCmp>
   <c:GamePlayerRequestCmp></c:GamePlayerRequestCmp>
    <lightning:button onclick="{!c.unsubscribe}" label="unsubscribe"></lightning:button> -->
</aura:application>