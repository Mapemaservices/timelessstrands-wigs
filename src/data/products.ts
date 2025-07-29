// Import all product images
import curlyHumanHairWig from '@/assets/curly-human-hair-wig.jpg';
import blondeBobWig from '@/assets/blonde-bob-wig.jpg';
import burgundyStraightWig from '@/assets/burgundy-straight-wig.jpg';
import deepBurgundyLongWig from '@/assets/deep-burgundy-long-wig.jpg';
import naturalStraightBobWig from '@/assets/natural-straight-bob-wig.jpg';
import naturalAfroWig from '@/assets/natural-afro-wig.jpg';
import fullLaceCurlyWig from '@/assets/full-lace-curly-wig.jpg';
import redAfroWig from '@/assets/red-afro-wig.jpg';
import kinkyCurlyRedHighlightWig from '@/assets/kinky-curly-red-highlight-wig.jpg';
import gluelessStraightLongWig from '@/assets/glueless-straight-long-wig.jpg';
import honeyBlondeAfroWig from '@/assets/honey-blonde-afro-wig.jpg';
import redBouncyCurlsWig from '@/assets/red-bouncy-curls-wig.jpg';
import pixieShortCutBlackWig from '@/assets/pixie-short-cut-black-wig.jpg';
import pixie4006Wig from '@/assets/4006-pixie-short-cut-wig.jpg';
import braidedPixieWig from '@/assets/braided-pixie-short-cut-wig.jpg';
import pixie2026Wig from '@/assets/2026-7018-pixie-wig.jpg';
import curlyT4350Wig from '@/assets/curly-t4-350-4-wig.jpg';
import fringeBobWig from '@/assets/fringe-bob-wig.jpg';
import grade12ABobWig from '@/assets/12a-grade-bob-wig.jpg';
import kinkyStraightWig from '@/assets/kinky-straight-human-hair-wig.jpg';
import rawBrazilian4CWig from '@/assets/raw-brazilian-4c-kinky-curly-wig.jpg';
import rawBrazilianAfroWig from '@/assets/raw-brazilian-afro-kinky-curly-wig.jpg';
import prePluckDeepWaveWig from '@/assets/pre-pluck-deep-wave-indian-wig.jpg';
import deepwaveWig from '@/assets/deepwave-human-hair-wig.jpg';
import prePluckedBoneStraightWig from '@/assets/pre-plucked-bone-straight-wig.jpg';
import boneStraightBlondeWig from '@/assets/bone-straight-blonde-27-wig.jpg';
import coloredBobWig from '@/assets/colored-human-hair-bob-wig.jpg';
import highlightBobWig from '@/assets/highlight-human-hair-bob-wig.jpg';
import gingerDoubleBobWig from '@/assets/ginger-350-double-drawn-bob-wig.jpg';
import color1BBobWig from '@/assets/color-1b-double-drawn-bob-wig.jpg';
import shortPixieCurlyWig from '@/assets/short-pixie-cut-curly-wig.jpg';
import highlightP427BodyWig from '@/assets/highlight-piano-p4-27-body-wave-wig.jpg';
import highlightP427BoneWig from '@/assets/highlight-piano-p4-27-bone-straight-wig.jpg';
import highlightDeepWaveWig from '@/assets/highlight-deep-wave-p4-27-honey-blonde-wig.jpg';
import colorB1CurlyWig from '@/assets/color-b1-curly-pixie-bob-wig.jpg';
import curly1BWig from '@/assets/curly-color-1b-human-hair-wig.jpg';
import bodywave99JWig from '@/assets/bodywave-color-99j-burgundy-wig.jpg';
import bodywaveP427Wig from '@/assets/bodywave-highlight-p4-27-wig.jpg';
import skunkStripeWig from '@/assets/skunk-stripe-body-wave-brown-blonde-wig.jpg';
import bodywaveMix350Wig from '@/assets/bodywave-color-mix-350-27-wig.jpg';
import bodywave350Wig from '@/assets/bodywave-color-350-ginger-wig.jpg';
import jerryBrownWig from '@/assets/brazilian-jerry-curly-brown-color-4-wig.jpg';
import brownBoneStraightWig from '@/assets/brown-indian-hair-bone-straight-wig.jpg';
import brownBodyWaveWig from '@/assets/brown-indian-hair-body-wave-wig.jpg';
import virginHDWig from '@/assets/virgin-hair-hd-bone-straight-wig.jpg';
import braided350CurlyWig from '@/assets/braided-350-curly-wig.jpg';
import burgundy99JBoneWig from '@/assets/burgundy-99j-bone-straight-wig.jpg';
import brazilian99JJerryWig from '@/assets/brazilian-99j-jerry-curly-wig.jpg';
import brazilian99JBodyWig from '@/assets/brazilian-99j-bodywave-wig.jpg';

export interface ProductVariant {
  laceSize: string;
  inchSize: string;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  video?: string;
  variants: ProductVariant[];
  rating: number;
  reviews: number;
  category: string;
  hasVideo: boolean;
  videoLength?: string;
  originalPrice?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Curly Human Hair Wig",
    description: "Beautiful bouncy curls with natural black color. Premium human hair that maintains its curl pattern and shine.",
    images: [curlyHumanHairWig, curlyHumanHairWig, curlyHumanHairWig],
    variants: [
      { laceSize: "4x4 Closure", inchSize: "16 inches", price: 4500, stock: 8 },
    ],
    rating: 4.8,
    reviews: 234,
    category: "closure",
    hasVideo: false
  },
  {
    id: 2,
    name: "4x4 Lace Closure BOB Wig - 180% Density",
    description: "#613 blonde color with body wave texture and hair curler style. Perfect short bob for a chic look.",
    images: [blondeBobWig, blondeBobWig, blondeBobWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "4x4 Closure", inchSize: "10 inches", price: 7200, stock: 5 },
      { laceSize: "4x4 Closure", inchSize: "12 inches", price: 7400, stock: 3 },
      { laceSize: "4x4 Closure", inchSize: "14 inches", price: 8100, stock: 4 },
    ],
    rating: 4.9,
    reviews: 189,
    category: "closure",
    hasVideo: true,
    videoLength: "10 inches"
  },
  {
    id: 13,
    name: "9302 Pixie Short Cut Human Hair Wig",
    description: "Short pixie cut with natural black (1B) color. Modern and stylish pixie cut for a bold look.",
    images: [pixieShortCutBlackWig, pixieShortCutBlackWig, pixieShortCutBlackWig],
    variants: [
      { laceSize: "4x4 Closure", inchSize: "6 inches", price: 4540, stock: 12 },
      { laceSize: "4x4 Closure", inchSize: "6 inches", price: 4747, stock: 8 }, // Other colors
    ],
    rating: 4.7,
    reviews: 156,
    category: "pixie",
    hasVideo: false
  },
  {
    id: 14,
    name: "4006 Pixie Short Cut Human Hair Wig",
    description: "Chic pixie cut with natural styling. Available in black (1B) and other vibrant colors.",
    images: [pixie4006Wig, pixie4006Wig, pixie4006Wig],
    variants: [
      { laceSize: "4x4 Closure", inchSize: "6 inches", price: 5032, stock: 10 },
      { laceSize: "4x4 Closure", inchSize: "6 inches", price: 5226, stock: 7 }, // Other colors
    ],
    rating: 4.8,
    reviews: 143,
    category: "pixie",
    hasVideo: false
  },
  {
    id: 15,
    name: "4006+ Braided Pixie Short Cut Human Hair Wig",
    description: "Braided pixie short cut with 13x4 lace front. Features intricate braided design in black (1B) and other colors.",
    images: [braidedPixieWig, braidedPixieWig, braidedPixieWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "6 inches", price: 5020, stock: 9 },
      { laceSize: "13x4 Frontal", inchSize: "6 inches", price: 5215, stock: 6 }, // Other colors
    ],
    rating: 4.9,
    reviews: 98,
    category: "pixie",
    hasVideo: false
  },
  {
    id: 16,
    name: "2026 & 7018 Pixie Short Cut Wig",
    description: "Trendy pixie cut design available in black (1B) and multiple color options for versatile styling.",
    images: [pixie2026Wig, pixie2026Wig, pixie2026Wig],
    variants: [
      { laceSize: "4x4 Closure", inchSize: "6 inches", price: 4345, stock: 14 },
      { laceSize: "4x4 Closure", inchSize: "6 inches", price: 4540, stock: 11 }, // Other colors
    ],
    rating: 4.6,
    reviews: 187,
    category: "pixie",
    hasVideo: false
  },
  {
    id: 17,
    name: "Curly Human Hair - Color T4-350-4",
    description: "Beautiful curly human hair with T4-350-4 color blend. 13x4 lace with 180% density for full volume.",
    images: [curlyT4350Wig, curlyT4350Wig, curlyT4350Wig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 7315, stock: 8 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 8009, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 8505, stock: 5 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 9297, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 11289, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "22 inches", price: 13373, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "24 inches", price: 15138, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "26 inches", price: 17222, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "28 inches", price: 19999, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "30 inches", price: 23999, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "32 inches", price: 26999, stock: 1 },
    ],
    rating: 4.9,
    reviews: 203,
    category: "curly",
    hasVideo: false
  },
  {
    id: 18,
    name: "Fringe Bob Human Hair Wig",
    description: "Stylish fringe bob with no lace construction. 180% density, 10 inch length in natural color (1B) and other options.",
    images: [fringeBobWig, fringeBobWig, fringeBobWig],
    variants: [
      { laceSize: "No Lace", inchSize: "10 inches", price: 4338, stock: 15 },
      { laceSize: "No Lace", inchSize: "10 inches", price: 4932, stock: 12 }, // Other colors
    ],
    rating: 4.7,
    reviews: 167,
    category: "bob",
    hasVideo: false
  },
  {
    id: 19,
    name: "Bob Human Hair Wig - 12A Grade",
    description: "Premium 12A grade bob wig with 13x4 lace front. Available in natural color and other stunning shades.",
    images: [grade12ABobWig, grade12ABobWig, grade12ABobWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "10 inches", price: 5726, stock: 10 },
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 6400, stock: 8 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 7391, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 9989, stock: 4 },
      { laceSize: "4x4 Closure", inchSize: "10 inches", price: 5426, stock: 12 }, // 4x4 lace (deduct 300)
      { laceSize: "4x4 Closure", inchSize: "12 inches", price: 6100, stock: 10 },
      { laceSize: "4x4 Closure", inchSize: "14 inches", price: 7091, stock: 8 },
      { laceSize: "4x4 Closure", inchSize: "16 inches", price: 9689, stock: 6 },
    ],
    rating: 4.8,
    reviews: 245,
    category: "bob",
    hasVideo: false
  },
  {
    id: 20,
    name: "Kinky Straight Human Hair Wig",
    description: "Premium kinky straight human hair with 13x4 lace, 180% density. Natural color (1B) for authentic look.",
    images: [kinkyStraightWig, kinkyStraightWig, kinkyStraightWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "10 inches", price: 5788, stock: 8 },
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 6183, stock: 7 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 6878, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 7374, stock: 5 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 8167, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 9158, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "22 inches", price: 11241, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "24 inches", price: 13005, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "26 inches", price: 15087, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "28 inches", price: 18360, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "30 inches", price: 22325, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "32 inches", price: 25498, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "34 inches", price: 29860, stock: 1 },
    ],
    rating: 4.9,
    reviews: 189,
    category: "straight",
    hasVideo: false
  },
  {
    id: 21,
    name: "Raw Brazilian Hair 13x4 Glueless 4C Edges Afro Kinky Curly",
    description: "Premium raw Brazilian hair with 4C edges and afro kinky curly texture. Glueless application for comfort.",
    images: [rawBrazilian4CWig, rawBrazilian4CWig, rawBrazilian4CWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "10 inches", price: 6680, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 6978, stock: 5 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 7771, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 8267, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 8960, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 9951, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "22 inches", price: 12134, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "24 inches", price: 13899, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "26 inches", price: 15981, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "28 inches", price: 19253, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "30 inches", price: 23219, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "32 inches", price: 26391, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "34 inches", price: 30753, stock: 1 },
    ],
    rating: 4.8,
    reviews: 167,
    category: "curly",
    hasVideo: false
  },
  {
    id: 22,
    name: "Raw Brazilian Hair 13x4 Glueless Afro Kinky Curly",
    description: "Authentic raw Brazilian hair with glueless afro kinky curly texture. Natural color (1B) for versatile styling.",
    images: [rawBrazilianAfroWig, rawBrazilianAfroWig, rawBrazilianAfroWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "10 inches", price: 6580, stock: 7 },
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 6978, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 7671, stock: 5 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 8167, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 8960, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 9951, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "22 inches", price: 12034, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "24 inches", price: 13799, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "26 inches", price: 15881, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "28 inches", price: 19153, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "30 inches", price: 23119, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "32 inches", price: 26291, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "34 inches", price: 30653, stock: 1 },
    ],
    rating: 4.9,
    reviews: 134,
    category: "curly",
    hasVideo: false
  },
  {
    id: 23,
    name: "Pre Pluck Deep Wave Raw Indian Human Hair Glueless Transparent 13x4",
    description: "Pre-plucked deep wave Indian hair with transparent 13x4 frontal. Glueless application with natural color (1B).",
    images: [prePluckDeepWaveWig, prePluckDeepWaveWig, prePluckDeepWaveWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "10 inches", price: 5528, stock: 9 },
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 5924, stock: 8 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 6618, stock: 7 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 7114, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 7907, stock: 5 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 8898, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "22 inches", price: 10981, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "24 inches", price: 12745, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "26 inches", price: 14827, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "28 inches", price: 18100, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "30 inches", price: 22065, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "32 inches", price: 25238, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "34 inches", price: 29600, stock: 1 },
    ],
    rating: 4.8,
    reviews: 178,
    category: "deepwave",
    hasVideo: false
  },
  {
    id: 24,
    name: "Deepwave Human Hair Wig",
    description: "Beautiful deepwave human hair wig with 13x4 lace construction. Natural color (1B) with stunning wave pattern.",
    images: [deepwaveWig, deepwaveWig, deepwaveWig],
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "10 inches", price: 6320, stock: 8 },
      { laceSize: "13x4 Frontal", inchSize: "12 inches", price: 6718, stock: 7 },
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 7411, stock: 6 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 7907, stock: 5 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 8700, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 9691, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "22 inches", price: 11774, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "24 inches", price: 13539, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "26 inches", price: 15621, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "28 inches", price: 18893, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "30 inches", price: 22859, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "32 inches", price: 26031, stock: 1 },
      { laceSize: "13x4 Frontal", inchSize: "34 inches", price: 30393, stock: 1 },
    ],
    rating: 4.7,
    reviews: 156,
    category: "deepwave",
    hasVideo: false
  },
  {
    id: 3,
    name: "5x5 Lace Closure Wig - 180% Density",
    description: "1B with dark burgundy 99J color highlights. Straight texture for a sleek, sophisticated look.",
    images: [burgundyStraightWig, burgundyStraightWig, burgundyStraightWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "5x5 Closure", inchSize: "18 inches", price: 8405, stock: 6 },
      { laceSize: "5x5 Closure", inchSize: "20 inches", price: 9397, stock: 4 },
      { laceSize: "5x5 Closure", inchSize: "22 inches", price: 11083, stock: 2 },
    ],
    rating: 4.7,
    reviews: 156,
    category: "closure",
    hasVideo: true,
    videoLength: "20 inches"
  },
  {
    id: 4,
    name: "4x4 Lace Closure Wig - 180% Density",
    description: "Deep burgundy 99J color with straight texture. Ultra-long lengths for maximum glamour.",
    images: [deepBurgundyLongWig, deepBurgundyLongWig, deepBurgundyLongWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "4x4 Closure", inchSize: "26 inches", price: 14999, stock: 3 },
      { laceSize: "4x4 Closure", inchSize: "28 inches", price: 17900, stock: 2 },
      { laceSize: "4x4 Closure", inchSize: "30 inches", price: 21999, stock: 1 },
    ],
    rating: 4.9,
    reviews: 98,
    category: "closure",
    hasVideo: true,
    videoLength: "28 inches"
  },
  {
    id: 5,
    name: "4x4 Lace Closure Straight BOB - 180% Density",
    description: "Natural black color with straight BOB style. Perfect for a classic, polished look.",
    images: [naturalStraightBobWig, naturalStraightBobWig, naturalStraightBobWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "4x4 Closure", inchSize: "10 inches", price: 5210, stock: 7 },
      { laceSize: "4x4 Closure", inchSize: "12 inches", price: 6122, stock: 5 },
      { laceSize: "4x4 Closure", inchSize: "14 inches", price: 7083, stock: 4 },
    ],
    rating: 4.8,
    reviews: 203,
    category: "closure",
    hasVideo: true,
    videoLength: "10 inches"
  },
  {
    id: 6,
    name: "5x5 Lace Glueless Closure Wig - 180% Density",
    description: "Natural black color with afro texture. Glueless application for comfort and convenience.",
    images: [naturalAfroWig, naturalAfroWig, naturalAfroWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "5x5 Glueless", inchSize: "16 inches", price: 8067, stock: 5 },
      { laceSize: "5x5 Glueless", inchSize: "18 inches", price: 8860, stock: 3 },
      { laceSize: "5x5 Glueless", inchSize: "20 inches", price: 10199, stock: 2 },
    ],
    rating: 4.9,
    reviews: 167,
    category: "glueless",
    hasVideo: true,
    videoLength: "18 inches"
  },
  {
    id: 7,
    name: "12A 13x4 Full Lace Frontal Wig - 210% Density",
    description: "Natural black color with customized curly pattern. Premium 12A grade hair with 210% density.",
    images: [fullLaceCurlyWig, fullLaceCurlyWig, fullLaceCurlyWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "14 inches", price: 10271, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 12035, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 13517, stock: 2 },
    ],
    rating: 4.9,
    reviews: 145,
    category: "frontal",
    hasVideo: true,
    videoLength: "16 inches"
  },
  {
    id: 8,
    name: "13x4 Full Lace Frontal Wig - 180% Density",
    description: "Vibrant red color with afro texture. Bold and beautiful for making a statement.",
    images: [redAfroWig, redAfroWig, redAfroWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 8764, stock: 4 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 9556, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 11399, stock: 2 },
    ],
    rating: 4.7,
    reviews: 134,
    category: "frontal",
    hasVideo: true,
    videoLength: "18 inches"
  },
  {
    id: 9,
    name: "4x4 Lace Closure Wig - 210% Density",
    description: "P1B/Red30 color blend with kinky curly texture. Natural black base with red highlights.",
    images: [kinkyCurlyRedHighlightWig, kinkyCurlyRedHighlightWig, kinkyCurlyRedHighlightWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "4x4 Closure", inchSize: "16 inches", price: 8505, stock: 5 },
      { laceSize: "4x4 Closure", inchSize: "18 inches", price: 9397, stock: 3 },
      { laceSize: "4x4 Closure", inchSize: "20 inches", price: 10999, stock: 2 },
    ],
    rating: 4.8,
    reviews: 178,
    category: "closure",
    hasVideo: true,
    videoLength: "18 inches"
  },
  {
    id: 10,
    name: "5x5 Lace Glueless Wig - 210% Density",
    description: "Natural black color with straight texture. Extra long lengths with glueless application.",
    images: [gluelessStraightLongWig, gluelessStraightLongWig, gluelessStraightLongWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "5x5 Glueless", inchSize: "22 inches", price: 12999, stock: 3 },
      { laceSize: "5x5 Glueless", inchSize: "24 inches", price: 14399, stock: 2 },
      { laceSize: "5x5 Glueless", inchSize: "26 inches", price: 16599, stock: 1 },
    ],
    rating: 4.9,
    reviews: 156,
    category: "glueless",
    hasVideo: true,
    videoLength: "24 inches"
  },
  {
    id: 11,
    name: "4x4 Lace Closure Wig - 250% Density",
    description: "Honey blonde #6 color with special afro texture. Permanent middle part with ultra-high density.",
    images: [honeyBlondeAfroWig, honeyBlondeAfroWig, honeyBlondeAfroWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "4x4 Closure", inchSize: "12 inches", price: 8229, stock: 4 },
      { laceSize: "4x4 Closure", inchSize: "14 inches", price: 8923, stock: 3 },
      { laceSize: "4x4 Closure", inchSize: "16 inches", price: 9617, stock: 2 },
    ],
    rating: 4.8,
    reviews: 142,
    category: "closure",
    hasVideo: true,
    videoLength: "14 inches"
  },
  {
    id: 12,
    name: "12A Grade 13x4 Full Lace Frontal Wig - 180% Density",
    description: "Vibrant red color with bouncy curl pattern. Premium 12A grade hair with perfect curl definition.",
    images: [redBouncyCurlsWig, redBouncyCurlsWig, redBouncyCurlsWig],
    video: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    variants: [
      { laceSize: "13x4 Frontal", inchSize: "16 inches", price: 11235, stock: 3 },
      { laceSize: "13x4 Frontal", inchSize: "18 inches", price: 12557, stock: 2 },
      { laceSize: "13x4 Frontal", inchSize: "20 inches", price: 15499, stock: 1 },
    ],
    rating: 4.9,
    reviews: 123,
    category: "frontal",
    hasVideo: true,
    videoLength: "18 inches"
  }
];
