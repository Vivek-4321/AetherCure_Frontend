<template>
    <div class="data-first-div">
        
        <h2>Data Collection</h2>
        <div class="data-sec-div">
            <div class="data-third-div">
                <div class="third-inner">
                    <div class="third-inner-first">
                        <p>Full name</p>
                       <input placeholder="Andy Dufresne"/>
                    </div>
                    <div class="third-inner-second">
                        <p>Blood Pressure</p>
                        <input placeholder="120/80"/>
                    </div>
                </div>
                <div class="third-inner-right">
                    <div class="third-inner-right-first">
                        <p>Age</p>
                        <input placeholder="18"/>
                    </div>
                    <div class="third-inner-right-second">
                        <p>Blood Sugar</p>
                        <input placeholder="mg/dL"/>
                    </div>
                </div>
            </div>

            <div class="data-four-div">
                <div class="four-first">
                    <p>Current Medical Condition</p>
                    <textarea name="medicalcondition" id="cmc"></textarea>
                </div>
                <div class="four-Second">
                    <p>Medical Background</p>
                    <textarea name="MedicalBackground" id="mb"></textarea>
                </div>
                <div class="four-third">
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                      </label>
                      <p>share data for research</p>
                </div>
                <div class="four-four">
                    <button>Save Information</button>
                </div>

            </div>
        </div>
    </div>

</template>

<script setup>

</script>

<style>
.data-first-div{
    width: 100%;
    height: 90vh;
    background-color: var(--main-bg);
    color:var(--text-primary) ;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2{
        font-family: 'Poppins', sans-serif;
        margin-top: 0.5rem;
        margin-left: -65rem;
        margin-bottom: 1rem;
    }
   
}
.data-sec-div{
    width: 97%;
    height: 88%;
    background-color: var(--secondary-bg);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.data-third-div{
    width: 100%;
    height: 35%;
    background-color: var(--secondary-bg);
    display: flex;
}
.data-four-div{
    width: 100%;
    height: 60%;
    background-color: var(--secondary-bg);
}
.third-inner{
    width: 50%;
    height: 100%;
    background-color: var(--secondary-bg);
}
.third-inner-right{
    width: 50%;
    height: 100%;
    background-color: var(--secondary-bg);
}
.third-inner-first{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
    }
    input{
        width: 90%;
        border: 0rem;
        border: none;
        height: 1.3rem;
        border-bottom: 1px solid var(--border-color);
        transform: translateY(5px);
        padding-left: 0.5rem;
        border-radius: 0.2rem;
    }
}
.third-inner-second{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    color:var(--text-primary) ;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
    }
    input{
        width: 90%;
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
    }
}
.third-inner-right-first{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    color:var(--text-primary) ;
    p{
        margin-bottom: 0.5rem;
    }
    input{
        width: 90%;
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
    }
}
.third-inner-right-second{
    width: 100%;
    height: 50%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    color:var(--text-primary) ;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
    }
    input{
        width: 90%;
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;

    }
}
.four-first{
    width: 100%;
    height: 7rem;
    background-color: var(--secondary-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color:var(--text-primary) ;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
    }
    textarea{
        height: 5rem;
        width: 99%;
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        border-radius: 0.5rem;
    }
}
.four-Second{
    width: 100%;
    height: 7rem;
    background-color: var(--secondary-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color:var(--text-primary) ;
    justify-content: center;
    padding: 1rem;
    p{
        margin-bottom: 0.5rem;
    }
    textarea{
        height: 5rem;
        width: 99%;
        border: 2rem solid black;
        border: none;
        border-bottom: 1px solid var(--border-color);
        border-radius: 0.5rem;
    }
}
.four-third{
   display: flex;
   align-items: flex-start;

   padding: 1rem;
   background-color: var(--secondary-bg);
   color:var(--text-primary) ;
   align-content: center;
   
    p{
        justify-content: center;
        margin: 1rem;
       
    
        align-items: center;
    }
    .switch {
        align-items: center;
        position: relative;
        display: inline-block;
        width: 4rem;
        height: 2rem;
        margin-top: 0.5rem;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #dad0d0;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: #FEFEFE;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: var(--accent-color);
      }
      
      input:focus + .slider {
        box-shadow: var(--accent-color);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
}
.four-four{
    background-color: var(--secondary-bg);
    color:var(--text-primary) ;
    button{
        width: 95%;
        height: 2.5rem;
        margin: 1rem;
        border-radius: 0.5rem;
        background-color: var(--accent-color);
        color: #EEF3FE;
    }
}

</style>