<template>
<div class="main-div">
    <h1>Storage Vault</h1>
    <div class="second-div">
        <div class="second-first">
            <div class="sec-first-first">
                <Icon icon="hugeicons:upload-04" class="icon-first" :style="{ fontSize: '3rem', color: 'gray' }"/>
            </div>
            <div class="sec-first-sec">
                <p>Upload Medical Documents</p>
            </div>
            <div class="sec-first-third">
                <p>PNG,JPG,PDF upto 10mb</p>
            </div>
        </div>
    
    </div>
    <div class="third-div"></div>
</div>
</template>

<script setup>
import {Icon} from '@iconify/vue'

</script>

<style>
.main-div{
    width: 100%;
    height: 90vh;
    background-color: var(--main-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    h1{
        margin-left: -65rem;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }
}
.second-div{
    width: 96%;
    height:35%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: c;
    justify-content: center;
    border-radius: 0.5rem;
    padding-top: 1.2rem;
    margin-bottom: 1rem;
}
.second-first{
    width: 95%;
    height: 90%;
    border: 0.1rem dashed var(--text-secondary);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.sec-first-first{
    width: 100%;
    height: 40%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .icon{
        width: 10rem;
        height: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}


.sec-first-sec{
    width: 100%;
    height: 20%;
    background-color: var(--secondary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    p{
        display: flex;
        align-items: flex-start;
        justify-content: center;
        color: var(--accent-color);
        margin-top: 1rem;
    }
}
.sec-first-third{
    width: 100%;
    height: 20%;
    background-color: var(--secondary-bg);
    p{
        display: flex;
        align-items: flex-start;
        justify-content: center;
        color: var(--text-primary);
        margin-top: 1rem;
    }
}
.third-div{
    width: 96%;
    height: 52%;
    background-color: blue;
    border-radius: 0.5rem;
}


</style>