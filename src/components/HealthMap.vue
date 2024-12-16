<template>
    <div class="health-map">
        <h1>Health Facilities Near You</h1>
        <div class="health-map-container">
            <div class="map-search-bar">
                <div>
                    <Icon icon="hugeicons:search-02" :style="{fontSize:'24px'}"/>
                </div>
                <div class="input-content">
                    <input type="text" placeholder="Search for clinics,Hospitals,Pharmacies..."/>
                </div>
            </div>
            <div class="map-view-bar">

            </div>
            <div class="map-hos-bar">
            <div class="central-edit">
                <div>
                    <h4>Central Hospital</h4>
                </div>
                
                <div>
                    <span>2.3km Away.</span>
                    <span>Open 24/7</span>
                </div>
               
            </div>          
            <div>
                <button>Get Direction</button>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import {Icon} from "@iconify/vue"

</script>

<style>
.health-map{
    width: 100%;
    height: 95vh;
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.health-map-container{
    background-color: var(--secondary-bg);
    width: 99%;
    height: 95%;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
}
.map-search-bar{
width: 100%;
height: 3rem;
border-radius: 0.5rem;
display: flex;
flex-direction: row;
align-items: center;
padding: 3px;

background-color:var(--main-bg);
padding-left: 5px;
input{
    width: 100%;
    height: 3rem;
      font-size: 15px;
    border: none;
    background-color:var(--main-bg);
    border-radius: 0.5rem;
    padding-left: 5px;
}
}
.map-view-bar{
    width: 100%;
height: 25rem;
background-color:var(--main-bg);
border-radius: 0.5rem;

}
.map-hos-bar{
    width: 100%;
height: 4rem;
background-color:var(--main-bg);
border-radius: 0.5rem;
display: flex;
justify-content: space-between;
padding-right: 10px;
padding-top: 8px;


button{
    background-color: var(--accent-color);
    height: 3rem;
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    width: 5.5rem;
    border: none;
    
    
}
}
.central-edit{
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
   
    span{
        color: var(--text-secondary);
    }
    
}
.input-content{
    width: 100%;
}
</style>