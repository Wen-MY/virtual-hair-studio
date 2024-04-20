const fetch = require('node-fetch');
const FormData = require('form-data');
const { openai } = require('../../open-ai-config');
const database = require('../../db-config');

const promptGeneratorUtils = {
    generate: (complexity, options) => {
        const { color, highlight, haircut, texture, volume, styling, parting, accessory, attire } = options;
        let prompt = '';
        const convertStringsToLowerCase = obj => {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key].toLowerCase();
                }
            }
        };

        // Call the function to convert string properties to lowercase
        convertStringsToLowerCase(options);
        switch (complexity) {
            case 'simple':
                prompt += color ? `Change the hair color to ${color}. ` : '';
                prompt += highlight ? `Apply highlights in ${highlight} shade. ` : '';
                prompt += haircut ? `Opt for an ${haircut} haircut. ` : '';
                prompt += texture ? `Style the hair with ${texture} texture. ` : '';
                prompt += volume ? `Set the volume to ${volume}. ` : '';
                prompt += styling ? `Style the hair using ${styling} techniques. ` : '';
                prompt += parting ? `Part the hair with a ${parting} style. ` : '';
                prompt += accessory ? `Add ${accessory} as an accessory. ` : '';
                prompt += attire ? `Make the hairstyle for ${attire} purpose` : '';
                break;

            case 'enhanced':
                prompt += `Generate a realistic image edit of a person `
                prompt += haircut ? `with a short haircut. ` : '';
                prompt += color ? `fully dyed in a only vibrant ${color} hair color. ` : '';
                prompt += highlight ? `Apply highlights in ${highlight} shade. ` : '';
                prompt += texture ? `with defined ${texture} hair texture. ` : '';
                prompt += volume ? `Achieve a ${volume} volume of hair. ` : '';
                prompt += styling ? `Utilize ${styling} techniques to style the hair. ` : '';
                prompt += parting ? `Create a precise ${parting} part. ` : '';
                prompt += accessory ? `Enhance the look with stylish ${accessory}. ` : '';
                prompt += attire ? `The hairstyle should fit for ${attire} purpose` : '';
                break;

            case 'complex':
                prompt += color ? `Transform the whole hair color to a fully rich shade of ${color}. ` : '';
                prompt += highlight ? `Craft bright ${highlight} highlights. ` : '';
                prompt += haircut ? `Craft an intricate ${haircut} haircut. ` : '';
                prompt += texture ? `with voluminous ${texture} texture ` : '';
                prompt += volume ? `Employ advanced techniques to achieve ${volume} volume. ` : '';
                prompt += styling ? `Employ advanced twisting techniques to ${styling} style the hair. ` : '';
                prompt += parting ? `Achieve a precise ${parting} part. ` : '';
                prompt += accessory ? `Integrate a variety of stylish ${accessory} for a sophisticated finish. ` : '';
                prompt += attire ? `The hairstyle should fit for ${attire} purpose` : '';
                break;

            default:
                return Error('No Such Complexity Found');
        }
        //prompt to not generate any texts and watermarks
        prompt += " no text and no watermark. Ensure the edited hair aligns with the given options accurately. Pay attention to details and produce a seamless integration of the specified features into the image's hair region. Your output should reflect the chosen haircut, color, texture, styling, volume, parting, and highlight/lowlight colors. Aim for a realistic and visually appealing transformation";
        return prompt.trim();
    },
    generate_with_GPT: async (options) => {
        const { color, highlight, haircut, texture, volume, styling, parting, accessory, attire } = options;
        const sample_prompt = await promptGeneratorUtils.getSamplePrompt(0.1,0.9);
        const messages = [
            {
                "role": "system",
                "content": "You are a dall-e-2 image editing prompt generator that generate high accuracy and precise prompt that changing image's hair from hair options provided.The prompt should not longer than 1000 characters with space. Sample prompt : " + sample_prompt.prompt
            },
            {
                "role": "user",
                "content": 
                `Hair Color : ${color??'remain unchanged'}
                Haircut : ${haircut??'remain unchanged'}
                Hair texture : ${texture??'remain unchanged'}
                Context : ${attire??'remain unchanged'}`+
                (volume? `Hair Volume : ${volume}`:'')+
                (highlight? `Hair Highlight Color: ${highlight}`:'')+
                (parting? `Hair Parting : ${parting}`:'')+
                (styling? `Hair Styling Technique : ${styling}`:'')+
                (accessory? `Hair Accessory : ${accessory}`:'')+
                `From the hair options provided above, generate a specific prompt that will be used by dall-e-2 image model that editing the hair in a image with description for each option so dall-e-2 model can understand the hair options' professional terms.Make the prompt in one paragraph and add a short notice in prompt to take note in integration of hair should be realistic as it is editing real image. The prompt should not longer than 1000 characters with space`
            },
        ];
        const requestBody = {
            model: 'gpt-4',
            messages: messages,
            temperature: 1,
            max_tokens: 512,
        };
        console.log(messages);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openai.apiKey}`,
                    'OpenAI-Organization': `${openai.organization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            const responseData = await response.json();
            console.log(responseData);
            return {
                prompt : promptGeneratorUtils.trimPrompt(responseData.choices[0].message.content),
                completion_tokens : responseData.usage.completion_tokens,
                sample_id : sample_prompt.id,

            };
        } catch (error) {
            console.log('Error Generating Prompt using GPT 4 , using fixed prompt format : Error '+ error);
            return promptGeneratorUtils.generate('complex',options);
        }
    }
    ,
    getSamplePrompt: async (costWeight,performanceWeight)=> {
        const [assistantPrompts] = await database.poolTryOn.execute('SELECT id , prompt ,completion_token as token_used, score , `usage` FROM `try-on_attempts`',[]);
        const weightedPrompts = assistantPrompts.map(prompt => {
            const { token_used, score, usage } = prompt;
            const weightedScore = (token_used * costWeight) + ((score/usage)/performanceWeight)
            return { ...prompt, weightedScore };
        });
        weightedPrompts.sort((a, b) => b.weightedScore - a.weightedScore);
        const topPrompt = weightedPrompts[0];
            // Update the usage time for the selected prompt in the database
        await database.poolTryOn.execute('UPDATE `try-on_attempts` SET `usage` = `usage` + 1 WHERE id = ?', [topPrompt.id]);
        return topPrompt;
    }
    ,
    trimPrompt: (prompt) => {
        const maxLength = 999; // Maximum length including spaces
        if (prompt.length > maxLength) {
            console.warn(`Prompt length exceeds ${maxLength} characters. Prompt Length = ${prompt.length}`);
            const trimmedPrompt = prompt.substring(1, maxLength); // Trim prompt to maximum length
            console.log(`Prompt length after trimmed = ${trimmedPrompt.length}`);
            return trimmedPrompt;
        } else {
            return prompt; // Return original prompt if within limit
        }
    }
};

module.exports = { promptGeneratorUtils };
