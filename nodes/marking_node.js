const items = $input.all();
const sentenceRegex = /[^.!?]*[.!?]/g;
const keywordRegex = /\b(waarom|hoe|wat|waar|wanneer|wie|probleem|kwestie|bezwaar|zorg|tegenwerpingen)\b/i;

const requests = [];
let match;

while ((match = sentenceRegex.exec($input.first().json.content)) !== null) {
    const sentence = match[0];
    if (keywordRegex.test(sentence)) {
      const startIndex = match.index;
      const endIndex = startIndex + sentence.length;

      requests.push({
        updateTextStyle: {
          range: { startIndex, endIndex },
          textStyle: {
            backgroundColor: {
              color: {
                rgbColor: {
                  red: 1,
                  green: 1,
                  blue: 0.6, 
                },
              },
            },
          },
          fields: 'backgroundColor',
        },
      });
    }
}

return [{ json: { requests } }];
