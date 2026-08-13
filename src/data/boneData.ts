/**
 * Node names the animation mixer filters clips down to.
 *
 * The avatar is the procedural Android bot in
 * `components/Character/utils/androidBot.ts`; these names mirror its rig.
 */

/** Everything the looping desk/typing animation is allowed to drive. */
export const typingBoneNames = [
  "upper_armL",
  "upper_armR",
  "forearmL",
  "forearmR",
  "handL",
  "handR",
  "fingersL",
  "fingersR",
  "thighL",
  "thighR",
  "shinL",
  "shinR",
  "ankleL",
  "ankleR",
  "chestLed",
];

/** Driven while the pointer rests on the bot's face. */
export const eyebrowBoneNames = [
  "eyebrow_L",
  "eyebrow_R",
  "antennaL",
  "antennaR",
];
