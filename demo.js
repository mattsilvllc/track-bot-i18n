'use strict';

// const translate = require('./index')('fr');
const i18n      = require('./index');
const translate = i18n('fr');

console.log('===========FR==========');

console.log(
  '[Translated paragraph]',
  translate(
    `To log foods to Track, please list the foods you have eaten.
    For example, you can say, log a glass of milk.
    For nutritional information on any food, please specify the nutrient followed by the item.
    For example, you can say, how much protein is in an egg.
    To get your daily caloric report, you can say, what is my calorie report.
    How can I help you?`
  )
);

console.log(
  '[Sentence missing translations but with substitutions]',
  translate(
    'I successfully logged %s, totalling %d calories. You have logged %d calories so far today',
    ['pizza', '500', '1000']
  )
);


translate.setLanguage('en');
console.log('===========EN==========');

console.log(
  '[Original paragraph as it is passed, but with normalised whitespace]',
  translate(
    `To log foods to Track, please list the foods you have eaten.
    For example, you can say, log a glass of milk.
    For nutritional information on any food, please specify the nutrient followed by the item.
    For example, you can say, how much protein is in an egg.
    To get your daily caloric report, you can say, what is my calorie report.
    How can I help you?`
  )
);

console.log(
  '[Original sentence, but using sprintf feature]',
  translate(
    'I successfully logged %s, totalling %d calories. You have logged %d calories so far today',
    ['pizza', '500', '1000']
  )
);


console.log('Source is intended to be the default value, ' +
  'but you may as well use this facility with aliases if you provide translations for all languages');

console.log(translate('aliased-source'));
translate.setLanguage('fr');
console.log('===========FR==========');
console.log(translate('aliased-source'));

console.log(
  '[All strings from all yml files are merged to the default category "$all", which is a default category argument]',
  translate('demo category from subdirectory category file')
);


console.log(
  '[You can specify a category]',
  translate('demo category from subdirectory category file', [], 'demo.category')
);

console.log(
  '[Then translation will be only searched in this category]',
  translate('demo category2', 'demo.category')
);


console.log(
  '[Category name is combined from all directories starting from translations and YML file name]',
  translate('demo category1', 'demo.category1')
);

console.log(
  '[If different files in tree end up to name the same category data is merged]',
  translate('demo category from root category file', 'demo.category'),
  translate('demo category from subdirectory category file', 'demo.category')
);

console.log('================STRINGS DATA STRUCTURE=================');

console.log(i18n.strings);
