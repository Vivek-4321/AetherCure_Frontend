<template>
    <div class="main-div">
        <h1>Storage Vault</h1>
        <div class="second-div">
            <div class="second-first">
                <div class="sec-first-first">
                    <Icon icon="hugeicons:upload-04" class="icon-first" :style="{ fontSize: '4rem', color: 'var(--text-secondary)' }"/>
                </div>
                <div class="sec-first-sec">
                    <p>Upload Medical Documents</p>
                </div>
                <div class="sec-first-third">
                    <p>PNG,JPG,PDF upto 10mb</p>
                </div>
            </div>
        
        </div>
        <div class="third-div">
            <h2>Stored Records</h2>
            <div class="third-first">
                <div class="third-first-left">
                    <p>Blood Test Results.pdf</p>
                    <div class="third-ptag-first">
                        <p>Uploaded on 21-02-2024</p>
                    </div>
                </div>
                <div class="third-first-right">
                    <div class="third-first-right-first">
                        <Icon icon="hugeicons:clock-01" class="icon-sec" :style="{ fontSize: '1rem', color: 'var(--text-secondary)' }"/>
                    </div>    
                    <div class="third-first-right-sec">
                        <p>Expires in 24h</p>
                    </div>
                    <div class="third-first-right-third">
                        <Icon icon="hugeicons:attachment-02" class="icon-sec" :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"/>
                    </div>
                </div>
            </div>
            <div class="third-sec">
                <div class="third-sec-left">
                    <p>X-ray Report.pdf</p>
                    <div class="third-ptag-sec">
                        <p>Uploaded on 21-02-2024</p>
                    </div>
                </div>
                <div class="third-sec-right">
                    <div class="third-sec-right-first">
                        <Icon icon="hugeicons:clock-01" class="icon-sec" :style="{ fontSize: '1rem', color: 'var(--text-secondary)' }"/>
                    </div>    
                    <div class="third-sec-right-sec">
                        <p>Expires in 24h</p>
                    </div>
                    <div class="third-sec-right-third">
                        <Icon icon="hugeicons:attachment-02" class="icon-sec" :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"/>
                    </div>
                </div>
            </div>
            <div class="third-third">
                <div class="third-third-left">
                    <p>X-ray Report.pdf</p>
                    <div class="third-ptag-third">
                        <p>Uploaded on 21-02-2024</p>
                    </div>
                </div>
                <div class="third-third-right">
                    <div class="third-third-right-first">
                        <Icon icon="hugeicons:clock-01" class="icon-sec" :style="{ fontSize: '1rem', color: 'var(--text-secondary)' }"/>
                    </div>    
                    <div class="third-third-right-sec">
                        <p>Expires in 24h</p>
                    </div>
                    <div class="third-third-right-third">
                        <Icon icon="hugeicons:attachment-02" class="icon-sec" :style="{ fontSize: '1.5rem', color: 'var(--accent-color)' }"/>
                    </div>
                </div>
            </div>
        </div>
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
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            margin-left: -65rem;
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
        border: 0.1rem dashed rgb(180, 171, 171);
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .sec-first-first{
        width: 100%;
        height: 50%;
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
        height: 15%;
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
        height: 25%;
        background-color: var(--secondary-bg);
        p{
            display: flex;
            align-items: flex-start;
            justify-content: center;
            color: var(--text-secondary);
            margin-top: 1rem;
        }
    }
    .third-div{
        width: 96%;
        height: 52%;
        background-color: var(--secondary-bg);
        border-radius: 0.5rem;
        h2{
            
            margin: 1rem;
            
        }
       
    
    }
    .third-first{
        width: 95%;
        height: 22%;
        margin-left: 1.7rem;
        background-color: var(--main-bg);
        border-radius: 0.5rem;
        p{
            color: var(--text-primary);
        }
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .third-first-left{
        width: 40%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        padding: 1rem;
    }
    .third-first-right{
        width: 40%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-direction: row;
        padding: 0.5rem;
    }
    .third-first-right-first{
        width: 5%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .third-first-right-sec{
        width: 25%;
        p{
            color: var(--text-secondary);
        }
    }
    .third-first-right-third{
        width: 8%;
        padding: rem;
    }
    .third-sec{
        width: 95%;
        height: 22%;
        margin-left: 1.7rem;
        background-color: var(--main-bg);
        border-radius: 0.5rem;
        p{
            color: var(--text-primary);
        }
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .third-sec-left{
        width: 40%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        padding: 1rem;
    }
    .third-sec-right{
        width: 40%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-direction: row;
        padding: 0.5rem;
    }
    .third-sec-right-first{
        width: 5%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        p{
            color: green;
        }
    }
    .third-sec-right-sec{
        width: 25%;
        p{
            color: var(--text-secondary);
        }
    }
    .third-sec-right-third{
        width: 8%;
        padding: rem;
    }
    .third-third{
        width: 95%;
        height: 22%;
        margin-left: 1.7rem;
        background-color: var(--main-bg);
        border-radius: 0.5rem;
        p{
            color: var(--text-primary);
        }
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .third-third-left{
        width: 40%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        padding: 1rem;
    }
    .third-third-right{
        width: 40%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-direction: row;
        padding: 0.5rem;
    }
    .third-third-right-first{
        width: 5%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .third-third-right-sec{
        width: 25%;
        p{
    
            color: var(--text-secondary);
        }
    }
    .third-third-right-third{
        width: 8%;
        padding: rem;
    }
    .third-ptag-first{
        p{
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-top: 0.2rem;
        }
    }
    .third-ptag-sec{
        p{
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-top: 0.2rem;
        }
    }
    .third-ptag-third{
        p{
            margin-top: 0.2rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
    }
    </style>