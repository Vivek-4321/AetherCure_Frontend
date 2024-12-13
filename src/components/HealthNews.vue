<template>
    <div class="first-div">
        <h1>Health News</h1>
        <div class="first-inner-div">
            <div class="first-first">
                <div class="first-first-upper">
                    <img src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop" alt="Cancer Treatment">
                </div>
                <div class="first-lower">
                    <div class="first-lower-inner">
                        <h4>New Breakthrough in Cancer Treatment</h4>
                        <p>Researchers discovers promising new approach to new cancer cells...</p>
                    </div>
                    <div class="first-lower-outer">
                        <p>Medical Journey</p>
                        <p>2024-02-02</p>
                    </div>
                </div>
            </div>
            <div class="first-sec">
                <div class="first-sec-upper">
                    <img src="https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&auto=format&fit=crop" alt="sleeplessness">
                </div>
                <div class="sec-lower">
                    <div class="sec-lower-inner">
                        <h4>Unerstanding the Impact of Sleep on Mental Health</h4>
                        <p>Recent studies shows the crucial connection between sleep patterns and mental wellbeing...</p>
                    </div>
                    <div class="sec-lower-outer">
                        <p>Health Today</p>
                        <p>2024-02-03</p>
                    </div>
                </div>
            </div>
            <div class="first-third">
                <div class="first-third-upper">
                    <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop" alt="Telemedicine">
                </div>
                <div class="third-lower">
                    <div class="third-lower-inner">
                        <h4>Advance in Telemedicine Technology</h4>
                        <p>How virtual healthcare is transforming patient care in the digital era...</p>
                    </div>
                    <div class="third-lower-outer">
                        <p>Tech Health</p>
                        <p>2024-02-04</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

</script>

<style>
.first-div{
    width: 100%;
    height: 90vh;
    color: var(--main-bg);
    display: flex;
    flex-direction: column;
    h1{
        color: var(--text-primary);
        margin-left: 1.5rem;
        font-family: 'Poppins', sans-serif;
        margin-top: 1rem;
    }
}
.first-inner-div{
    width: 99%;
    height: 68%;
    background-color: var(--main-bg);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: row;
    margin-top: 1rem;
    
}
.first-first{
    width: 31%;
    height: 85%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 1rem;
    margin: 1rem;
    overflow: hidden;
}
.first-first-upper{
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    
    
    img{
        width: 100%;
        height: aut0;
        object-fit: contain; 
        display: block;
    }
}
.first-lower-inner{
    width: 100%;
    height: 5rem;
    background-color:var(--secondary-bg);
    margin-top: 1.5rem;
    h4{
        font-family: 'Poppins', sans-serif;
        margin: 1.5rem;
        color: var(--text-primary);
        font-size: var(--font-size-base);
    }
    p{
        font-size: 0.9rem;
        font-family: 'Poppins', sans-serif;
        margin: 1.5rem;
        color: var(--text-secondary);
    }
}
.first-lower-outer{
    width: 100%;
    height: 10rem;
    background-color:var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    p{ 
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
        margin: 1.5rem;
    }
}
.first-sec{
    width: 31%;
    height: 85%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 1rem;
    margin: 1rem;
    overflow: hidden;
}
.first-sec-upper{
    width: 100%;
    height: auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    
    
    img{
        width: 100%;
        height: 18.6rem;
        object-fit: cover;
        justify-content: center;
        display: block;
    }
}
.sec-lower-inner{
    width: 100%;
    height: 5rem;
    background-color:var(--secondary-bg);
    margin-top: 1.5rem;
    h4{
        font-family: 'Poppins', sans-serif;
        margin: 1.5rem;
        color: var(--text-primary);
    }
    p{
        font-size: 0.9rem;
        font-family: 'Poppins', sans-serif;
        margin: 1.5rem;
        color: var(--text-secondary);
    }
}
.sec-lower-outer{
    width: 100%;
    height: 10rem;
    background-color:var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 1rem;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
        margin: 1.5rem;
    }
}
.first-third{
    width: 31%;
    height: 85%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 1rem;
    margin: 1rem;
    overflow: hidden;
}
.first-third-upper{
    width: 100%;
    height: auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    
    
    img{
        width: 100%;
        height: 18.6rem;
        object-fit: cover;
        justify-content: center;
        display: block;
    }
}
.third-lower-inner{
    width: 100%;
    height: 5rem;
    background-color:var(--secondary-bg);
    margin-top: 1.5rem;
    h4{
        font-family: 'Poppins', sans-serif;
        margin: 1.5rem;
        color: var(--text-primary);
    }
    p{
        font-size: 0.9rem;
        font-family: 'Poppins', sans-serif;
        margin: 1.5rem;
        color: var(--text-secondary);
    }
}
.third-lower-outer{
    width: 100%;
    height: 10rem;
    background-color:var(--secondary-bg);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 1rem;
    p{
        font-size: var(--font-size-base);
        font-family: 'Poppins', sans-serif;
        color: var(--text-secondary);
        margin: 1.5rem;
    }
}
@media only screen and (max-width: 600px) {
    .first-inner-div{
        flex-direction: column;
        width: 99%;
        height: 68%;
    }
}
@media screen and (max-width: 1024px) {
    .first-first,
    .first-sec,
    .first-third {
        width: 45%;
    }
}

@media screen and (max-width: 768px) {
    .first-div {
        height: auto;
        h1{
            margin-top: 0.5rem;
            margin-left: 2.5rem;
            margin-bottom: -1rem;
        }
    }
    
    .first-inner-div {
        flex-direction: column;
        align-items: center;
        padding: 1rem 0;
    }
    
    .first-first,
    .first-sec,
    .first-third {
        width: 90%;
        height: auto;
        margin: 1rem 0;
    }
    
    .first-first-upper img,
    .first-sec-upper img,
    .first-third-upper img {
        height: 15rem;
        object-fit: cover;
    }
    
    .first-lower-inner,
    .sec-lower-inner,
    .third-lower-inner {
        height: auto;
        min-height: 5rem;
    }
    
    .first-lower-outer,
    .sec-lower-outer,
    .third-lower-outer {
        height: auto;
        min-height: 4rem;
    }
    
    h4 {
        font-size: 1.1rem;
        margin: 1rem;
    }
    
    p {
        font-size: 0.9rem;
        margin: 1rem;
    }
}

@media screen and (max-width: 480px) {
    .first-first,
    .first-sec,
    .first-third {
        width: 95%;
    }
    
    .first-div h1 {
        font-size: 1.5rem;
        margin-left: 1rem;
    }
    
    .first-first-upper img,
    .first-sec-upper img,
    .first-third-upper img {
        height: 12rem;
    }
}
</style>