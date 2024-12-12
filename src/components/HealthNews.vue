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
            <div class="first-sec"></div>
            <div class="first-third"></div>
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
    h1{
        color: black;
    }
}
.first-inner-div{
    width: 95%;
    height: 70%;
    background-color: aqua;
    
}
.first-first{
    width: 27%;
    height: 90%;
    background-color: aliceblue;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 1rem;
    margin-top: 1rem;

}
.first-first-upper{
    width: 100%;
    
    img{
        width: 100%;
        height: 11rem;
    }
}
.first-lower-inner{
    width: 100%;
    height: 6rem;
    background-color: aquamarine;
    color: var(--text-primary);
    h4{
       
        margin: 0.5rem;
    }
    p{
        margin: 0.5rem;
    }
}
.first-lower-outer{
    width: 100%;
    height: 5rem;
    background-color: blue;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}
</style>