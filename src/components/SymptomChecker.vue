<template>
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