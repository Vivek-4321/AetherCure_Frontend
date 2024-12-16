<template>
    <div class="diseases-header">
        <h1>Diseases Outbreak Alert</h1>
        <div class="diseases-type">     
        <div class="diseases-header-1">

            <div class="first-bar">
                
                <div class="first-bar-first-line">
                    <div class="icon-flex-warning">
                        <Icon icon="hugeicons:alert-02" :style="{ fontSize: '50px',paddingLeft: '2px' ,paddingTop: '12px'}"  />
                        <div>
                        <div class="asd" >
                            <h2>Influenza A</h2>
                            <div class="map-icon">
                                <Icon icon="mynaui:location"/>
                                    <a>Metropolitan Area</a>
                                </div>
                        </div>

                        
                    </div>
                    </div>
                    
                    <div>
                     
                    <div class="moderate">
                        <h2>Moderate</h2>
                    </div>
                    
                    </div>
                
                     </div>
                <div class="first-bar-second-line">
                    <div class="first-bar-second-left">
                        <div>
                            <Icon icon="icon-park-outline:peoples" />
                        </div>
                        <div>
                            <span>Active Cases:245</span>
                        </div>
                      
                        

                    </div>
                    <div class="first-bar-second-right">
                        <div>
                            <Icon icon="fluent-emoji-high-contrast:chart-increasing" />
                        </div>
                        <div>
                            <span>Trend:Increasing</span>
                        </div>
                        

                    </div>
                    
                </div>
            <div class="first-bar-third-line">
                <div class="recommendation"> 
                    <h5>Recommendation:</h5>
                    <ul>
                        
                        <li>Maintain food hygiene</li>
                        <li>Boil drinking water</li>
                        <li>Avoid raw foods temporarily</li>
                        
                      </ul>
                </div>
               
            </div>
            </div>
        </div>
        </div>
    
            <div class="second-diseases-bar">
                <div class="first-bar">
                
                    <div class="first-bar-first-line">
                        <div class="icon-flex-warning">
                            <Icon icon="hugeicons:alert-02" :style="{ fontSize: '50px',paddingLeft: '2px' ,paddingTop: '12px'}"  />
                            <div>
                            <div class="asd" >
                                <h2>Gastroenteritis</h2>
                                <div class="map-icon">
                                    <Icon icon="mynaui:location"/>
                                        <a>Southeren District</a>
                                    </div>
                            </div>
    
                            
                        </div>
                        </div>
                        
                        <div>
                         
                        <div class="moderate1">
                            <h2>Mild</h2>
                        </div>
                        
                        </div>
                    
                         </div>
                    <div class="first-bar-second-line">
                        <div class="first-bar-second-left">
                            <div>
                                <Icon icon="icon-park-outline:peoples" />
                            </div>
                            <div>
                                <span>Activa Cases:89</span>
                            </div>
                          
                            
    
                        </div>
                        <div class="first-bar-second-right">
                            <div>
                                <Icon icon="fluent-emoji-high-contrast:chart-increasing" />
                            </div>
                            <div>
                                <span >Trend:Stable</span>
                            </div>
                            
    
                        </div>
                        
                    </div>
                <div class="first-bar-third-line">
                    <div class="recommendation"> 
                        <h5>Recommendation:</h5>
                        <ul>
                            
                            <li>Maintain food hygiene</li>
                            <li>Boil drinking water</li>
                            <li>Avoid raw foods temporarily</li>
                            
                          </ul>
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
.diseases-header{
    width: 100%;
    height: 100%;
    
    background-color: var(--main-bg);
    color: var(--text-primary);
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
    
   

}
.diseases-header-1{
    background-color: var(--secondary-bg);
    width: 100%;
    height: 19rem;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    border-radius: 1rem;
    display: flex;
    margin-top: 1.5rem;
   
}
.first-bar{
    padding-top: 1.5rem;
    width:100%;
    height: 3rem;
    line-height: 1.9rem;
   

}
.first-bar-first-line{
    display: flex;
    justify-content: space-between;
    
    
    

.moderate{
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background-color: rgb(255, 244, 150);
    font-size: 7px;
    color:rgb(243, 180, 7) ;
    padding-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-right: 20px;
}
}
.first-bar-second-line{
    display: flex;
    justify-content: space-between;
    
    padding-left: 5px;
    border-radius: 0.5rem;
    font-family: 'Poppins', sans-serif;
    margin-top: 1rem;
    width: 100%;
    

}
.first-bar-second-left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: var(--main-bg);
    width: 49%;
    border-radius:0.5rem ;
    padding-left: 12px;
    color: var(--text-secondary);
    font-size: 15px;
    span{
        padding-top: 6px;
        margin-left: 5px;
    }
   
}
.first-bar-second-right{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: var(--main-bg);
    width: 49%;
    padding-left: 12px;
    margin-right: 10px;
    border-radius:0.5rem ;
    color: var(--text-secondary);
    font-size: 15px;
    height: 3rem;
    span{
        margin-left: 8px;
        padding-top: 6px;
    }

}
.first-bar-third-line{
    margin-top: 0.5rem;
    
}
.recommendation{
    
    h5{
        color: var(--text-primary);
    font-size: 17px;
    padding-left: 10px;
    
    

    }
    ul{
        padding-left: 3rem;
    }
    li{
        color: var(--text-secondary);
        font-size: 16px;
        
    }
    

}


.icon-flex-warning{
    display: flex;
    flex-direction: row;
    padding-left: 2px;
    
    
    
}
.map-icon{
    font-size: 14px;
  
    a{
        color:var(--text-secondary);
    }
}
.diseases-types{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.second-diseases-bar{
    background-color: var(--secondary-bg);
    width: 100%;
    height: 19rem;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    border-radius: 1rem;
    display: flex;
    margin-top: 1.5rem;
   
}
.moderate1{
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background-color: rgb(92, 134, 73);
    font-size: 7px;
    color:rgb(20, 53, 10) ;
    padding-bottom: 15px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-right: 20px;
    

}


</style>