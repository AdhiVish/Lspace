/* All site copy and media in one place. Text is kept word-for-word from the original LSPACE site. */

export const media = (p: string) => `${import.meta.env.BASE_URL}media/${p}`;

export const CONTACT = {
  phone: "+91 75502 21993",
  tel: "tel:+917550221993",
  email: "lspace@gmail.com",
  whatsapp: "917550221993",
  instagram: "https://instagram.com/",
};

export const STATS = [
  { n: 40000, label: "Sqft delivered" },
  { n: 35, label: "Sites completed" },
  { n: 10, label: "Cities" },
];

export type Space = { slug: string; title: string; text: string; img: string };
export const SPACES: Space[] = [
  { slug: "commercial", title: "Commercial", text: "Dynamic spaces that inspire productivity and success.", img: media("space-commercial.jpg") },
  { slug: "residential", title: "Residential", text: "Warm, comfortable homes designed around the way you live.", img: media("space-residential.jpg") },
  { slug: "construction", title: "Construction", text: "Strong, well-built structures, from foundation to finishing.", img: media("space-construction.jpg") },
];

export const DENTAL = [
  { label: "Reception", title: "Reception & signage", text: "Welcoming desks and clear, confident signage.", img: media("dental-reception.jpg"), pos: "center 45%" },
  { label: "Procedure room", title: "Procedure rooms", text: "Layouts that keep the doctor's workflow smooth and the patient relaxed.", img: media("dental-room.jpg"), pos: "center 57%" },
  { label: "Waiting area", title: "Waiting areas", text: "Comfortable seating and soft, even lighting.", img: media("dental-waiting.jpg"), pos: "center 75%" },
];

export type Room = {
  id: string;
  name: string;
  desc: string;
  img?: string;
  /** room outline on the plan, in % of the plan box */
  poly: string;
  /** label position on the plan, in % */
  lx: number;
  ly: number;
  short: string[];
};

export const ROOMS: Room[] = [
  { id: "01", name: "Full home interiors", desc: "Complete design and build for your home.", img: media("room-01.jpg"), short: ["Full home", "interiors"], lx: 12.84, ly: 25.52,
    poly: "3.15% 7.76%,3.15% 43.27%,23.05% 43.16%,23.13% 43.04%,23.2% 37.47%,23.28% 37.59%,23.28% 43.04%,23.74% 43.27%,23.72% 7.76%" },
  { id: "02", name: "Modular kitchen", desc: "Smart layouts with clean, durable finishes.", img: media("room-02.jpg"), short: ["Modular", "kitchen"], lx: 30.12, ly: 16.76,
    poly: "43.44% 1.42%,36.18% 1.38%,36.01% 1.96%,33.24% 1.96%,33.1% 1.38%,24.43% 1.46%,24.43% 43.27%,25.02% 43.04%,25.08% 37.47%,25.17% 37.59%,25.19% 43.12%,28.63% 43.12%,29.11% 43.31%,33.2% 43.24%,33.26% 25.56%,43.44% 25.44%" },
  { id: "03", name: "Wardrobe", desc: "Made-to-measure storage for every room.", img: media("room-03.jpg"), short: ["Wardrobe"], lx: 55.16, ly: 13.45,
    poly: "44.17% 1.46%,44.17% 25.52%,47.67% 25.44%,47.76% 19.68%,47.84% 19.79%,47.84% 25.37%,47.92% 25.48%,67.07% 25.52%,67.05% 1.42%" },
  { id: "04", name: "Commercial interiors", desc: "Offices and shops that work as hard as you do.", img: media("dental-reception.jpg"), short: ["Commercial", "interiors"], lx: 75.99, ly: 15.49,
    poly: "67.81% 1.42%,67.79% 25.44%,70.57% 25.67%,70.57% 41.08%,71.18% 41.05%,71.18% 35.36%,71.27% 35.24%,71.31% 41.05%,71.39% 41.16%,83.66% 41.12%,83.66% 1.42%" },
  { id: "05", name: "False ceiling", desc: "Ceiling designs with built-in lighting.", img: media("room-05.jpg"), short: ["False", "ceiling"], lx: 91.8, ly: 25.44,
    poly: "84.4% 11.88%,84.42% 50.81%,85.34% 51.04%,84.44% 51.19%,84.4% 53.31%,99.18% 53.34%,99.18% 11.91%" },
  { id: "06", name: "Dental interiors", desc: "Clinics designed for patient comfort and a smooth workflow.", img: media("dental-room.jpg"), short: ["Dental", "interiors"], lx: 89.68, ly: 80.67,
    poly: "80.2% 54.57%,80.16% 55.84%,80.29% 56.03%,80.08% 56.26%,80.18% 98.54%,99.2% 98.54%,99.2% 54.61%" },
  { id: "07", name: "Wallpaper", desc: "Patterns and textures to set the mood.", img: media("room-07.jpg"), short: ["Wallpaper"], lx: 68.16, ly: 83.82,
    poly: "60.15% 69.14%,60.15% 98.54%,79.45% 98.5%,79.43% 69.14%,78.63% 69.22%,78.57% 75.1%,78.5% 69.91%,78.4% 69.1%" },
  { id: "08", name: "Lights", desc: "Decorative and functional lighting plans.", short: ["Lights"], lx: 47.36, ly: 82.17,
    poly: "40.25% 69.14%,40.25% 98.54%,52.79% 98.58%,52.89% 98.42%,52.96% 90.43%,59.42% 90.39%,59.42% 69.14%,58.77% 69.1%,58.66% 69.25%,58.6% 75.13%,58.54% 69.22%,58.45% 69.1%" },
  { id: "09", name: "Civil constructions", desc: "Structural and renovation work done right.", img: media("space-construction.jpg"), short: ["Civil", "constructions"], lx: 29.07, ly: 82.86,
    poly: "20.51% 58.72%,20.49% 98.5%,39.51% 98.54%,39.53% 69.18%,38.93% 69.1%,38.82% 69.25%,38.76% 75.13%,38.67% 69.14%,33.26% 69.1%,33.2% 58.8%,33.12% 58.69%,21.29% 58.72%,21.2% 58.84%,21.14% 64.64%,21.08% 58.84%" },
  { id: "10", name: "Furnitures", desc: "Custom and ready pieces to complete the space.", img: media("dental-waiting.jpg"), short: ["Furnitures"], lx: 10.91, ly: 82.21,
    poly: "5.58% 58.69%,5.54% 68.99%,0.84% 69.1%,0.73% 69.25%,0.78% 98.54%,19.78% 98.54%,19.78% 58.72%,19.19% 58.84%,19.13% 64.53%,19.06% 58.84%,18.98% 58.72%" },
];

/** Room 08 (Lights) has no photo, so it gets a warm glow instead. */
export const LIGHTS_GLOW = "radial-gradient(circle at 50% 38%,#ffd48a 0,#8a6a3a 36%,#2b2926 80%)";

/**
 * Real project photos per room go here, e.g.
 * "02": [{ t: "Project name", c: "City", img: media("projects/kitchen-1.jpg") }]
 */
export const PROJECTS: Record<string, { t: string; c?: string; img: string }[]> = {};

export const REELS = [1, 2, 3, 4].map((n) => ({ poster: media(`reel-${n}.jpg`), src: media(`reel-${n}.mp4`) }));

export const VIDEO_REVIEWS = [
  { poster: media("review-1.jpg"), src: media("review-1.mp4"), dur: "1:38" },
  { poster: media("review-2.jpg"), src: media("review-2.mp4"), dur: "0:26" },
  { poster: media("review-3.jpg"), src: media("review-3.mp4"), dur: "1:30" },
  { poster: media("review-4.jpg"), src: media("review-4.mp4"), dur: "1:29" },
];

/** Placeholder written reviews from the original site: swap in real ones. */
export const REVIEWS = Array.from({ length: 5 }, () => ({
  text: "Add your client's review here. Short and real works best.",
  who: "Client name, City",
}));

/** Clinic gallery on the works page. Entries without img show a placeholder tile. */
export const CLINICS: { img?: string; label?: string; size: string }[] = [
  { img: media("dental-room.jpg"), label: "Procedure room", size: "w2 h2" },
  { img: media("dental-reception.jpg"), label: "Reception", size: "h3" },
  { img: media("dental-waiting.jpg"), label: "Waiting area", size: "h2" },
  { size: "" },
  { size: "h2" },
  { size: "w2" },
  { size: "" },
  { size: "last" },
];
