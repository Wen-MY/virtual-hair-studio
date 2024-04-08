const promptGeneratorUtils = {
    generate: (complexity, options) => {
        const { color, highlight, haircut, texture, volume, styling, parting, accessory,attire } = options;
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
                prompt += attire ? `Make the hairstyle for ${attire} purpose`: '';
                break;

            case 'enhanced':
                prompt += `Generate a realistic image edit of a person `
                prompt += haircut ? `with a short haircut. ` : '';
                prompt += color ? `fully dyed in a only vibrant ${color} hair color. ` : '';
                prompt += highlight ? `Apply highlights in ${highlight} shade. `: '';
                prompt += texture ? `with defined ${texture} hair texture. ` : '';
                prompt += volume ? `Achieve a ${volume} volume of hair. ` : '';
                prompt += styling ? `Utilize ${styling} techniques to style the hair. ` : '';
                prompt += parting ? `Create a precise ${parting} part. ` : '';
                prompt += accessory ? `Enhance the look with stylish ${accessory}. ` : '';
                prompt += attire ? `The hairstyle should fit for ${attire} purpose`: '';
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
                prompt += attire ? `The hairstyle should fit for ${attire} purpose`: '';
                break;

            default:
                return Error('No Such Complexity Found');
        }
        //prompt to not generate any texts and watermarks
        prompt += " no text and no watermark. Ensure the edited hair aligns with the given options accurately. Pay attention to details and produce a seamless integration of the specified features into the image's hair region. Your output should reflect the chosen haircut, color, texture, styling, volume, parting, and highlight/lowlight colors. Aim for a realistic and visually appealing transformation";
        return prompt.trim();
    },
};

module.exports = { promptGeneratorUtils };
