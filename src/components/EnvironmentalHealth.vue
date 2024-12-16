<template>
    <div class="Env-main-container">
        <h1>Environmental Health</h1>
        <div class="Env-container">
            <div class="env-first-bar">
                <div class="first-bar-box1">
                   <div class="first-bar-icon-content-align">
                    <div class="first-bar-icon-text">
                        <Icon icon="hugeicons:fast-wind" :style="{ fontSize: '40px',color:'blue'}"/>
                        <div class="align-good">
                          <h5>Good</h5> 
                        </div>
                    
                    </div>
                    <div class="air-quality-index-43">
                        <h5>Air Quality Index</h5>
                        <h1>43</h1>
                    </div>
                   </div>
                  
                   
                </div>
                <div class="first-bar-box2">
                    <div class="first-bar-icon-content-align">
                        <div class="first-bar-icon-text">
                            <Icon icon="hugeicons:temperature" :style="{ fontSize: '40px',color:'red'}"/>
                            
                        
                        </div>
                        <div class="air-quality-index-43">
                            <h5>Temperature</h5>
                            <h1>93.2F</h1>
                        </div>
                       </div>
                    
                    
                </div>
                <div class="first-bar-box3">
                    <div class="first-bar-icon-content-align">
                        <div class="first-bar-icon-text">
                            <Icon icon="hugeicons:rain-double-drop" :style="{ fontSize: '40px',color:'skyblue'}"/>
                            
                        
                        </div>
                        <div class="air-quality-index-43">
                            <h5>Humidity</h5>
                            <h1>65%</h1>
                        </div>
                       </div>
                </div>
                <div class="first-bar-box4">
                    <div class="first-bar-icon-content-align">
                        <div class="first-bar-icon-text">
                            <Icon icon="hugeicons:sun-03" :style="{ fontSize: '40px',color:'yellow'}"/>
                            
                        
                        </div>
                        <div class="air-quality-index-43">
                            <h5>UV </h5>
                            <h1>3</h1>
                        </div>
                       </div>
                </div>
            </div>
            <div class="env-second-bar">
                <h3>Health Recommendation</h3>
                <div class="second-bar-align">
                    
                    <div class="second-bar-Air">
                       
                            <a>Air Quality:Air Quality is good. It's a great time for outdoor activites </a>
                        
                        
                        
                    </div>
                    <div class="second-bar-Temperature">
                        <a>Temperature:Moderate Temperature.Stay hydrated and wear comfortable clothing </a>
                        
                    </div>
                    <div class="second-bar-Activity">
                        <a>Activity Suggestion:Perfect condition for light to moderate outdoor exercise </a>
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
.Env-main-container{
    width: 100%;
    height: 100%;
    
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
}
.Env-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
}
.env-first-bar{
    display: flex;
    
    width: 100%;
    height: 3rem;
    justify-content: space-between;
    margin-top: 2rem;
    
    
}
.first-bar-box1,.first-bar-box2,.first-bar-box3,.first-bar-box4{
    width: 17.5rem;
    height: 10rem;
    
    border-radius: 0.5rem;
    background-color: var(--secondary-bg);

    
}
.env-second-bar{
    width: 100%;
    height: 18rem;
    background-color:var(--secondary-bg);
    margin-top:6.5rem ;
    border-radius: 0.5rem;    
    padding: 2rem;
}
.first-bar-icon-text{
    display: flex;
   justify-content: space-between;
   align-items: center;
}
.first-bar-icon-content-align{
  display: flex;
  flex-direction: column;
    line-height: 2.5rem;
    padding-left: 20px;
    padding-top: 15px;
    padding-right: 15px;
}
.align-good{
    width: 4rem;
    height: 1.5rem;
    background-color: rgb(26, 221, 9);
    color:var(--text-primary);
    font-family: 'Poppins', sans-serif;
    border-radius: 1.5rem;
    font-size: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px; 
}
.air-quality-index-43{
    h5{
        color: rgb(153, 153, 153);
        font-family: 'Poppins', sans-serif;
        
        
    }
    h1{
        font-size: 22px;
        font-family: 'Poppins', sans-serif;
    }
}
.second-bar-align{
    display: flex;
    margin-top: 2rem;
    flex-direction: column;
    
    align-items: flex-start;
    line-height: 3rem;
    gap: 1rem;
    justify-content: center;
    
      font-family: 'Poppins', sans-serif;
   
}
.second-bar-Air{
    width: 100%;
    height: 3rem;
    background-color: aliceblue;
    color: rgb(0, 77, 128);
    border-radius: 0.5rem;
    padding-left: 1rem;
    font-family: 'Poppins', sans-serif;
}
.second-bar-Temperature{
    width: 100%;
    height: 3rem;
    background-color: rgb(255,219,172);
    color: rgb(192, 131, 50);
    border-radius: 0.5rem;
    padding-left: 1rem;
    font-family: 'Poppins', sans-serif;
    
}
.second-bar-Activity{
    width: 100%;
    height: 3rem;
    background-color: #ACE1AF;
    color: rgb(64, 122, 105);
    border-radius: 0.5rem;
    padding-left: 1rem;
    font-family: 'Poppins', sans-serif;
    
}
</style>