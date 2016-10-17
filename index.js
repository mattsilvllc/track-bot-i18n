'use strict';

const yaml     = require('js-yaml');
const fs       = require('fs');
const _        = require('lodash');
const vsprintf = require("sprintf-js").vsprintf;

const translationsRoot = __dirname + '/translations';

/**
 * Translations storage
 * @type {{$all: {}}}
 */
let strings = {
  $all: {}
};

/**
 * Trims whitespace from the start and the end of the string.
 * For multi-line string does this for every line.
 * @param {string} str
 * @returns {string}
 */
function normaliseString(str) {
  return str.split('\n').map(line => line.trim()).join('\n').trim();
}

/**
 * Recursively reads ./translations directory to fill up strings object with translations
 * @param {string} directory
 */
function readTranslations(directory) {
  try {
    let directoryList = fs.readdirSync(directory).map(fileName => `${directory}/${fileName}`);

    directoryList.forEach(fileName => {
      let stats = fs.statSync(fileName);

      if (stats.isFile()) {
        let category = fileName.replace(/\.\w{3,4}$/, '').replace(translationsRoot + '/', '').replace(/\//g, '.');
        // Get document, or throw exception on error
        try {
          let doc                    = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
          let normalisedTransaltions = {};

          _.forEach(doc, (value, key) => {
            normalisedTransaltions[normaliseString(key)] = value;
          });

          _.merge(strings.$all, normalisedTransaltions);
          if (strings[category]) {
            _.merge(strings[category], normalisedTransaltions);
          } else {
            strings[category] = normalisedTransaltions;
          }
        } catch (e) {
          console.log('Could not read YML file ', fileName, e);
        }
      } else if (stats.isDirectory()) {
        readTranslations(fileName);
      }
    });
  } catch (e) {
    console.error(e);
  }
}

readTranslations(translationsRoot);

/**
 * Translates the message
 * @param {string} source Source string to be translated. Default value if the translation is missing.
 *                        May contain sprintf markers: https://www.npmjs.com/package/sprintf-js
 * @param {string} language Target language. for example 'en', 'fr'.
 * @param {*} replacements [Optional] Array of values or single value for sprintf substitutions.
 *                                    Will be treated as category if is string and source does not contain sprintf placeholders
 * @param {string} category Category to search translation at. Defaults to $all, which means searching over all available translations
 * @returns {string}
 */
function translate(source, language, replacements = [], category = '$all') {
  source = normaliseString(source);

  if (source.indexOf('%') === -1 && _.isString(replacements)) {
    // source has no substitutions
    category = replacements;
  }


  let translation;
  let categoryTranslations = strings[category];

  if (categoryTranslations) {
    translation = categoryTranslations[source];

    if (translation) {
      translation = translation[language];
    }
  }

  let result = translation && normaliseString(translation) || source;

  if (replacements) {
    if (!_.isArray(replacements)) {
      replacements = [replacements];
    }

    if (replacements.length > 0) {
      result = vsprintf(result, replacements);
    }
  }

  return result;
}

/**
 * Partially applies translate function to avoid passing target language all the time
 * @param {string} language
 * @returns {function} partial application of the translate function with pre-defined target language
 */
module.exports = function factory(language) {
  if (!language) {
    language = 'en';
  }

  let translateTo = function (source, replacements = [], category = '$all') {
    return translate(source, language, replacements, category);
  };

  /**
   * Changes the target language of the currently partially applied function
   * @param {string} value
   */
  translateTo.setLanguage = function (value) {
    language = value;
  };

  return translateTo;
};

module.exports.translate = translate;
module.exports.strings   = strings;
