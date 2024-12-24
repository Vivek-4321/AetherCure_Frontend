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
.data-first-div{
    width: 100%;
    height: 97vh;
    background-color: aqua;
    color: black !important;
}
.data-sec-div{
    width: 90%;
    height: 80%;
    background-color: antiquewhite;
}

<style>
.Env-main-container {
    width: 100%;
    height: 100%;
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
}

.Env-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.env-first-bar {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; /* Wrap the boxes in smaller screens */
    margin-top: 2rem;
    gap: 1rem;
}

.first-bar-box1,
.first-bar-box2,
.first-bar-box3,
.first-bar-box4 {
    width: 23%; /* Adjust width to fit 4 boxes in a row */
    min-width: 12rem; /* Prevents boxes from becoming too small */
    height: 10rem;
    display: flex;
    border-radius: 0.5rem;
    background-color: var(--secondary-bg);
    box-sizing: border-box;
    flex-direction: column;
}

.env-second-bar {
    width: 100%;
    background-color: var(--secondary-bg);
    margin-top: 3rem;
    border-radius: 0.5rem;
    padding: 2rem;
    box-sizing: border-box;
}

.first-bar-icon-content-align {
    display: flex;
    flex-direction: column;
    line-height: 2.5rem;
    padding: 1rem;
}
.first-bar-icon-text{
    display: flex;
    justify-content: space-between;
}

.align-good {
    width: fit-content;
    background-color: rgb(26, 221, 9);
    color: var(--text-primary);
    border-radius: 1.5rem;
    font-size: 0.9rem;
    
    padding: 0.2rem 1rem;
    margin-top: 0.5rem;
}

.air-quality-index-43 h5 {
    color: rgb(153, 153, 153);
}

.air-quality-index-43 h1 {
    font-size: 1.5rem;
}

.second-bar-align {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    font-family: 'Poppins', sans-serif;
}

.second-bar-Air,
.second-bar-Temperature,
.second-bar-Activity {
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    font-family: 'Poppins', sans-serif;
    line-height: 1.5rem;
    box-sizing: border-box;
}

.second-bar-Air {
    background-color: aliceblue;
    color: rgb(0, 77, 128);
}

.second-bar-Temperature {
    background-color: rgb(255, 219, 172);
    color: rgb(192, 131, 50);
}

.second-bar-Activity {
    background-color: #ACE1AF;
    color: rgb(64, 122, 105);
}

/* Responsive Design */
@media screen and (max-width: 1024px) {
    .env-first-bar {
        gap: 1rem; /* Add spacing between boxes */
    }

    .first-bar-box1,
    .first-bar-box2,
    .first-bar-box3,
    .first-bar-box4 {
        width: 48%; /* Two boxes per row */
    }

    .env-second-bar {
        margin-top: 2rem;
        padding: 1.5rem;
    }
}

@media screen and (max-width: 768px) {
    .first-bar-box1,
    .first-bar-box2,
    .first-bar-box3,
    .first-bar-box4 {
        width: 100%; /* One box per row */
        height: auto;
    }

    .env-second-bar {
        padding: 1rem;
    }

    .air-quality-index-43 h1 {
        font-size: 1.25rem;
    }
}

@media screen and (max-width: 480px) {
    .Env-main-container {
        padding: 0.5rem;
    }

    h1 {
        font-size: 1.2rem;
    }

    .env-first-bar {
        flex-direction: column;
        align-items: center;
    }

    .second-bar-Air,
    .second-bar-Temperature,
    .second-bar-Activity {
        padding: 0.8rem;
        font-size: 0.9rem;
    }
}

</style>