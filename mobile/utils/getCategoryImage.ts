export type BodyCategory =
  | "abs"
  | "chest"
  | "legs"
  | "fullbody"
  | "arms"
  | "back"
  | "shoulders"
  | "cardio"
  | "yoga"
  | "gym"
  | "freehand"
  | "calisthenics"
  | "martial_arts"
  | "rehab";

const CATEGORY_IMAGES: Record<BodyCategory, string> = {
  abs: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  chest: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  legs: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400&q=80",
  fullbody: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80",
  arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
  back: "https://images.unsplash.com/photo-1530822847156-5df684ec5105?w=400&q=80",
  shoulders: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
  cardio: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  freehand: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  calisthenics: "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&q=80",
  martial_arts: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&q=80",
  rehab: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
};

export function getCategoryImage(category: string): string {
  const key = category.toLowerCase().replace(/\s+/g, "") as BodyCategory;
  return CATEGORY_IMAGES[key] ?? CATEGORY_IMAGES.fullbody;
}

export const BODY_FOCUS_CATEGORIES = [
  { key: "fullbody", label: "Full Body", image: CATEGORY_IMAGES.fullbody },
  { key: "abs", label: "Abs", image: CATEGORY_IMAGES.abs },
  { key: "arms", label: "Arms", image: CATEGORY_IMAGES.arms },
  { key: "legs", label: "Legs", image: CATEGORY_IMAGES.legs },
  { key: "chest", label: "Chest", image: CATEGORY_IMAGES.chest },
  { key: "back", label: "Back", image: CATEGORY_IMAGES.back },
  { key: "shoulders", label: "Shoulders", image: CATEGORY_IMAGES.shoulders },
];
