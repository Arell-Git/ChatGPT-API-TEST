import { Configuration, OpenAIApi  } from 'openai'
import {createRequire} from 'module'
const require = createRequire(import.meta.url) 
const express = require('express')
const app = express()
const PORT = 1337

app.use(express.json())
app.use(express.static('public'))
app.use(require('cors')())

require('dotenv').config()

const openAI_SECRET_KEY = process.env.OPEN_AI_SECRET_KEY

const configuration = new Configuration({
    apiKey: openAI_SECRET_KEY
})
const openai = new OpenAIApi(configuration)

async function sendPrompt(input) {
    const model = 'gpt-3.5-turbo'
    const messages = [
        {
            "role": 'system',
            "content": 'You are a very helpful assistant'
        },
        {
            "role": 'user',
            "content": 'You are a prompt generation robot. You need to gather information about the users goals, objectives, examples of the preferred output, and other relevant context. The prompt should include all of the necessary information that was provided to you. Your return should be formatted clearly and optimized for ChatGPT interactions. Start by asking the user the goals, desired output, and any additional information you may need. '
        },
        {
            "role": 'assistant',
            "content": 'Hello! To generate a suitable prompt, could you please share your goals and objectives for this prompt? Additionally, what kind of output are you looking for? It would be helpful to know any specific examples or criteria for the output you would prefer. Furthermore, please let me know any other relevant context or information that could aid in generating a prompt that meets your needs. Thank you!'
        },
        {
            "role": "user",
            "content": input
        }
    ]

    const completion = await openai.createChatCompletion({
        model,
        messages
    })
    console.log(completion.data.choices)
    return completion.data.choices
}

//routes
app.post('/api', async (req, res) => {
    const {prompt} = req.body 
    const answer = await sendPrompt(prompt)
    res.status(200).json({
        'message': answer
    })
})

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))