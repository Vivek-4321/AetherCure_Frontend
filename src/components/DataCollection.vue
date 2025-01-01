<template>
    <div class="data-first-div">
        
        <h1>Data Collection</h1>
        <div class="data-sec-div">
            <div class="data-third-div">
                <div class="third-inner">
                    <div class="third-inner-first">
                        <p>Full name</p>
                       <input placeholder="Andy Dufresne"/>
                    </div>
                    <div class="third-inner-second">
                        <p>Age</p>
                        <input placeholder="18"/>
                    </div>
                </div>
                <div class="third-inner-right">
                    <div class="third-inner-right-first">
                        <p>Blood Pressure</p>
                        <input placeholder="120/80"/>
                        
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
import { ref } from 'vue'

const formData = ref({
  fullName: '',
  bloodPressure: '',
  age: '',
  bloodSugar: '',
  medicalCondition: '',
  medicalBackground: '',
  shareData: false
})

const saveInformation = () => {
  console.log('Form data:', formData.value)
}

</script>

<style>
.data-first-div{
    width: 100%;
    height: 90vh;
    background-color: var(--main-bg);
    color:var(--text-primary) ;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h1{
        font-size: 24px;
        font-family: 'Poppins', sans-serif;
        font-size: var(font-size-base);
        margin-bottom: 0.5rem;
        margin-left: 0.9rem;
    }
   
}
.data-sec-div{
    width: 97%;
    height: 92%;
    background-color: var(--secondary-bg);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-left: 0.9rem;
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
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
        background-color: var(--secondary-bg);
        color: var(--text-primary);
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        background-color: var(--secondary-bg);
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        color: var(--text-primary);
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        background-color: var(--secondary-bg);
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        color: var(--text-primary);
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    input{
        width: 90%;
        border: 0rem;
        background-color: var(--secondary-bg);
        border: none;
        border-bottom: 1px solid var(--border-color);
        height: 1.3rem;
        padding-left: 0.5rem;
        border-radius: 0.2rem;
        color: var(--text-primary);
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    textarea{
        padding-left: 0.5rem;
        height: 5rem;
        background-color: var(--secondary-bg);
        width: 99%;
        border: 0rem;
        border: none;
        border-bottom: 1px solid var(--border-color);
        border-radius: 0.5rem;
        color: var(--text-primary);
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
    }
    textarea{
        padding-left: 0.5rem;
        height: 5rem;
        width: 99%;
        background-color: var(--secondary-bg);
        border: 2rem solid black;
        border: none;
        border-bottom: 1px solid var(--border-color);
        border-radius: 0.5rem;
        color: var(--text-primary);
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
        font-size: var(font-size-base);
        font-family: 'Poppins', sans-serif;
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
        background-color: var(--main-bg);
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
        width: 97%;
        height: 2.5rem;
        margin: 1rem;
        border-radius: 0.5rem;
        background-color: var(--accent-color);
        color:white;
        border: 1px solid transparent;
    }
}
@media screen and (max-width: 1024px) {
    .data-first-div h1 {
        margin-left: 0;
        text-align: center;
    }
    
    .data-sec-div {
        width: 95%;
        height: auto;
    }
}
@media screen and (max-width: 768px) {
    .data-first-div {
        h1{
            margin-bottom: 0.5rem;
            margin-left: 1rem;
            font-size: 24px;
        }
        height: auto;
        padding-left: 0.2rem;
    }
    
    .data-sec-div{
        width: 99%;
        margin-left: 0;
        
    }

    .data-third-div {
        flex-direction: column;
        height: auto;
    }
    
    .third-inner,
    .third-inner-right {
        width: 100%;
    }
    
    .third-inner-first,
    .third-inner-second,
    .third-inner-right-first,
    .third-inner-right-second {
        p{
            margin-left: 0;
        }
        input {
            width: 100%;
        }
    }
    
    .four-first,
    .four-Second {
        p{
            margin-left: 0;
        }
        height: auto;
        textarea {
            width: 100%;
            min-height: 6rem;
        }
    }

    .four-four{
        margin-right: 1rem;
        margin-bottom: 2rem;
    }
}


</style>