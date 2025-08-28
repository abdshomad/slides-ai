// FIX: Correct import path for types
import { PresentationTemplate } from '../types/index';
import { modernDarkTemplate } from './modernDark';
import { lightProTemplate } from './lightPro';
import { creativeVibrantTemplate } from './creativeVibrant';
import { oceanicBlueTemplate } from './oceanicBlue';
import { sunsetWarmthTemplate } from './sunsetWarmth';
import { ecoGreenTemplate } from './ecoGreen';
import { minimalistLightTemplate } from './minimalistLight';
import { boldContrastTemplate } from './boldContrast';
import { corporateClassicTemplate } from './corporateClassic';

export const templates: PresentationTemplate[] = [
  modernDarkTemplate,
  lightProTemplate,
  corporateClassicTemplate,
  oceanicBlueTemplate,
  boldContrastTemplate,
  creativeVibrantTemplate,
  sunsetWarmthTemplate,
  ecoGreenTemplate,
  minimalistLightTemplate,
];