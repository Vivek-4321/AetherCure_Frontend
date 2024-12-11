<template>
<div class="bot-main">
<h1>Health Assistant</h1>
<div class="bot-main-sub">
    <div class="top-first-text">
        <div class="top-first-text-sub">
            <p>Hello Iam your Health assistant... How can I help You ?</p>
        </div>
       
    </div>
    <div class="top-second-text">
        <div class="top-second-text-sub" >
            <p>Hi</p>
        </div>
        
    </div>
    <div class="top-third-text-sub">
        <div>

        
        <ul>
            <li>This is an AI-powered suggestion.</li>
            <li>Always consult healthcare professionals.</li>
            <li>Consider the following steps:
              <ol>
                <li>Monitor your symptoms.</li>
                <li>Keep track of duration.</li>
                <li>Document any changes.</li>
              </ol>
            </li>
            <li>For more information, please consult your doctor.</li>
          </ul>
        </div>
    </div>
    

<div class="input-bar-main">
    <div class="input-bar-main-sub" >
        <div class="input-first-icon">
            <Icon icon="hugeicons:mic-01" class="icon" :style="{ fontSize: '30px' }" />
        </div>
        <div class="input-bar-msge">
            <input/>

        </div>
        <div class="input-bar-sent">
            <Icon icon="lsicon:send-outline" class="icon" :style="{ fontSize: '40px', paddingTop:'10px' }" />
        </div>

    </div>

</div>
</div>
</div>
</template>

<script setup>
import {Icon} from "@iconify/vue"
</script>

<style>
.bot-main{
  width: 100%;
  height: 90vh;
  background-color: var(--main-bg);
  color: var(--text-primary);
  padding: 1rem;
}
.bot-main-sub{
    background-color: var(--secondary-bg);
    width: 100%;
    height: 90%;
    margin-top: 1rem;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;

}
.top-first-text{
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: flex-start;

    
}
.top-first-text-sub{
    background-color:var(--main-bg);
    font-family: 'Poppins', sans-serif;
    padding-left: 1rem;
    padding-top:0.5rem;
    border-radius: 0.5rem;
    padding-bottom: 0.3rem;
    width:28rem;

}
.top-second-text{

    width:100%;
    display: flex;
    height: 2rem;
    justify-content: end;
    

}
.top-second-text-sub{
    width: 5%;
    background-color: var(--accent-color);
    align-items: flex-end;
    border-radius: 0.5rem;
    padding-left: 0.8rem;
    font-family: 'Poppins', sans-serif;
    text-align: end;
   padding-right: 20px;
   padding-top:7px;
}
  
.top-third-text{
width: 100%;
height: 3rem;
display: flex;
align-items: flex-start;

}
.top-third-text-sub{
    background-color:var(--main-bg);
    font-family: 'Poppins', sans-serif;
    padding-left: 0.8rem;
    padding-top:0.5rem;
    border-radius: 0.5rem;
    padding-bottom: 0.3rem;
    width:28rem;
    padding-left: 20px;
    line-height: 30px;
    margin-top: 3rem;
}
.input-bar-main-sub{
    display: flex;
}

.input-bar-main{
    width:100%;
    height:5rem;
    display: flex;
    margin-top: 9rem;
    justify-content: space-between;
    
}
.input-bar-msge{
   input{
    width: 65rem;
    height: 3rem;

   }
  
}
.input-first-icon{
    background-color: var(--main-bg);
    width: 2.5rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;

}
.input-bar-sent{
    width:3rem;
    height: 3rem;
    background-color: var(--accent-color);
    margin-left: 3px;
    border-radius: 0.5rem;
}


</style>