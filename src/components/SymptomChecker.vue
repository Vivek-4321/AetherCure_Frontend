<template>
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
    h1{
       font-family: 'Poppins', sans-serif;
       color: var(--text-primary);
       margin-left: -58rem;
    }
}
.first-inner-upper{
    width: 100%;
    height: 40%;
    display: flex;
   align-items: center;
   p{
    font-size: var(--font-size-base);
    font-family: 'Poppins', sans-serif;
    margin-top:1rem;
    margin-left: -66rem;
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
    height: 4rem;
    background-color: antiquewhite;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    margin-top: 1rem;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        margin-bottom: 1rem;
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
    .first-inner-first {
        height: auto;
        padding: 1.5rem 1rem;
        
        h1 {
            margin-left: -9rem;
            text-align: center;
            font-size: 1.8rem;
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