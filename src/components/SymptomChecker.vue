<template>
<<<<<<< HEAD
    <div class="frist-div">
        <div class="first-inner-first">
            <h1>Symptom Checker</h1>
            <div class="first-inner-upper">
                <p>Select your symptoms </p>
                <div class="first-inner-input">
                    <input type="text" class="input-bar" placeholder="Search...">
                </div>
            </div>
            <div class="first-inner-btn">
                <button>Check Symptoms</button>
            </div>
        </div>
        <div class="first-inner-second">
            <h3>Predicted Condition</h3>
            <h2>Common Cold</h2>
            <p>Confidence level</p>
            <div class="percent-first">
                <div class="percent-sec"></div>
            </div>
            <p>85%</p>
            <p>Recommendations</p>
            <ul>
                <li>Rest and stay hydrated</li>
                <li>Take over-the-counter cold medications</li>
                <li>Monitor symptoms for 3-4days</li>
            </ul>
            <div class="note-div">
                <p>Note: This is an AI-powered prediction and should not replace professional medical advice. Please consult a medical healthcare provider for accurate diagnosis and treatment.</p>
            </div>
        </div>
    </div>

</template>

<script setup>

</script>

<style>
.first-div{
    width: 100%;
    height: 100%;
    background-color: var(--main-bg);
    display: flex;
    flex-direction: column;
}
.first-inner-first{
    width: 98%;
    height: 13rem;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 1rem;
    margin-bottom: 1rem;
    align-items: flex-start; 
    padding-left: 1rem;
    h1{
       font-size: 24px;
       font-family: 'Poppins', sans-serif;
       color: var(--text-primary);
    }
}
.first-inner-upper{
    width: 100%;
    height: 40%;
    display: flex;
    align-items: flex-start; 

   p{
    font-size: var(--font-size-base);
    font-family: 'Poppins', sans-serif;
    margin-top:1rem;
    margin-bottom: 1rem;
    color: var(--text-secondary);
    }
    flex-direction: column;
}
.first-inner-input{

    width: 98%;
    height: 35%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    input{
        width: 100%;
        height: 2rem;
        border-radius: 0.3rem;
        margin-left: 0rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        padding-left: 1rem;
        border: 1px solid var(--border-color);
        background-color: var(--secondary-bg);
    }
}
.first-inner-btn{
    width: 98%;
    height: 25%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    button{
        width: 100%;
        height: 80%;
        background-color: var(--accent-color);
        border-radius: 0.5rem;
        color: var(--common-white);
        border: 1px solid transparent;
    }
}
.first-inner-second{
    width: 98%;
    height: 26rem;
    background-color: var(--secondary-bg);
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
    h2{
        font-family: 'Poppins', sans-serif;
        color: var(--accent-color);
        margin-top: 0.3rem;
        margin-bottom: 0.4rem;
    }
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        margin-top: 1.4rem;
        color: var(--text-secondary);
    }
    li{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        margin-top: 1rem;
        margin-left: 1rem;
        color: var(--text-secondary);
    }
}
.percent-first{
    width: 98%;
    height: 0.5rem;
    background-color: rgb(231, 229, 229);
    border-radius: 0.3rem;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
}
.percent-sec{
    width: 85%;
    height: 0.5rem;
    border-radius: 0.3rem;
    background-color: var(--accent-color);
}
.note-div{
    width: 98%;
    height: 3rem;
    background-color: antiquewhite;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 1rem;
    padding-bottom: 1.2rem;
    p{
        font-size: 13.2px;
        font-family: 'Poppins', sans-serif;
        color: rgb(189, 60, 60);
    }
    border-radius: 0.7rem;
}
@media screen and (max-width: 1024px) {
    .first-inner-first h1 {
        margin-left: -40rem;
    }
    
    .first-inner-upper p {
        margin-left: -45rem;
    }
}

@media screen and (max-width: 768px) {

    .frist-div{
        padding-left: 0.7rem;
    }
    
    .first-inner-first {
        height: auto;
        padding: 1.5rem 1rem;
        margin-top: 0.5rem;
        
        h1 {
            margin-left: 0rem;
            text-align: center;
            font-size: 24px;
        }
    }
    
    .first-inner-upper {
        p {
            margin-left: 0.5rem;
            text-align: left;
            width: 100%;
        }
    }
    
    .first-inner-input {
        width: 100%;
        
        input {
            width: 100%;
            margin: 0;
            margin-bottom: 1rem;
        }
    }
    .first-inner-btn{
        height: 2.5rem;
    }
    
    .first-inner-second {
        height: auto;
        padding: 1.5rem;
        
        h2 {
            font-size: 1.6rem;
        }
        p{
            margin-left: 0;
        }
        li {
            margin-left: 2rem;
        }
    }
    
    .note-div {
        height: auto;
        
        p {
            margin: 0.5rem;
            font-size: 0.9rem;
            text-align: center;
        }
    }
}
</style>
=======
    <div class="bot-main">
    <h1>Health Assistant</h1>
    <div class="bot-main-container">
    <div class="bot-main-sub">
        <div class="top-first-text">
            <div class="top-first-text-sub">
                <p>Hello Iam your Health assistant... How can I help You ?</p>
            </div>
           
        </div>
        <div class="top-second-text">
            <div class="top-second-text-sub user-message">
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
                <input type="text" placeholder="Type Anything..."/>
            </div>
            <div class="input-bar-sent">  
                <button>
                    <Icon icon="lsicon:send-outline" class="icon" :style="{ fontSize: '30px' ,paddingLeft:'4px'}" />
                </button>
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>
    </template>
    
    <script setup>
    import {Icon} from "@iconify/vue"
    </script>
    
    <style scoped>
    /* Base Styles */
    .bot-main-container {
        display: flex;
        flex-direction: column;
    }
    
    .bot-main {
        width: 100%;
        height: 100vh;
        background-color: var(--main-bg);
        color: var(--text-primary);
        padding: 1rem;
        box-sizing: border-box;
    }
    
    .bot-main-sub {
        background-color: var(--secondary-bg);
        width: 100%;
        height: auto;
        margin-top: 1rem;
        border-radius: 1rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
    
    .top-first-text,
    .top-second-text,
    .top-third-text-sub {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    
    .top-first-text-sub,
    .top-third-text-sub {
        background-color: var(--main-bg);
        font-family: 'Poppins', sans-serif;
        padding: 1rem;
        border-radius: 0.5rem;
        width: 100%;
        margin-bottom: 1rem;
        box-sizing: border-box;
        word-break: break-word;
    }
    
    .top-second-text {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
        margin-bottom: 1rem; /* Added bottom margin to create space */
        width: 100%;
    }
    
    .top-second-text-sub {
        width: auto;
        padding: 0.5rem 1rem;
        background-color: var(--accent-color);
        border-radius: 0.5rem;
        font-family: 'Poppins', sans-serif;
        text-align: center;
        color: var(--text-primary);
        margin-left: auto; /* This ensures it's pushed to the right end */
    }
    
    /* Adjust mobile responsiveness for the spacing */
    @media screen and (max-width: 600px) {
        .top-second-text {
            margin-top: 0.75rem;
            margin-bottom: 0.75rem;
        }
    }
    
    .input-bar-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        flex-wrap: wrap;
    }
    
    .input-bar-main-sub {
        display: flex;
        width: 100%;
        align-items: center;
    }
    
    .input-first-icon,
    .input-bar-sent button {
        width: 3rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }
    
    .input-first-icon {
        background-color: var(--main-bg);
        margin-right: 0.5rem;
    }
    
    .input-bar-msge {
        flex-grow: 1;
        margin-right: 0.5rem;
    }
    
    .input-bar-msge input {
        width: 100%;
        height: 2.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        background-color: var(--main-bg);
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        padding-left: 0.5rem;
        color: var(--text-primary);
        box-sizing: border-box;
    }
    
    .input-bar-sent button {
        background-color: var(--accent-color);
        color: var(--text-primary);
        border: none;
        cursor: pointer;
    }
    
    .input-bar-sent button:hover {
        background-color: var(--hover-color);
    }
    
    /* Mobile Responsiveness */
    @media screen and (max-width: 600px) {
        .bot-main {
            padding: 0.5rem;
            height: 100vh;
        }
    
        .bot-main-sub {
            margin-top: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
        }
    
        .top-first-text-sub,
        .top-third-text-sub {
            padding: 0.5rem;
            margin-bottom: 0.5rem;
        }
    
        .input-bar-main-sub {
            flex-wrap: nowrap;
        }
    
        .input-first-icon,
        .input-bar-sent button {
            width: 2.5rem;
            height: 2.5rem;
        }
    
        .input-first-icon {
            margin-right: 0.25rem;
        }
    
        .input-bar-msge input {
            font-size: 0.875rem;
            padding-left: 0.25rem;
        }
    
        /* Adjust list styles for mobile */
        .top-third-text-sub ul,
        .top-third-text-sub ol {
            padding-left: 1.5rem;
            margin: 0.5rem 0;
        }
    
        .top-third-text-sub li {
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
        }
    }
    
    /* Extra small mobile devices */
    @media screen and (max-width: 375px) {
        .bot-main {
            padding: 0.25rem;
        }
    
        .input-first-icon,
        .input-bar-sent button {
            width: 2rem;
            height: 2rem;
        }
    
        .input-bar-msge input {
            font-size: 0.75rem;
        }
    
        .top-third-text-sub li {
            font-size: 0.75rem;
        }
    }
    </style>
>>>>>>> origin/f9dde7d9-1d82-4849-a00d-a3bb9cf11f57
