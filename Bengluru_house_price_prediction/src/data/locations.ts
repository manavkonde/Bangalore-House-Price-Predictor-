export const BANGALORE_LOCATIONS = [
  "1st block jayanagar", "1st phase jp nagar", "2nd phase judicial layout", 
  "2nd stage nagarbhavi", "5th block hbr layout", "5th phase jp nagar", 
  "6th phase jp nagar", "7th phase jp nagar", "8th phase jp nagar", 
  "9th phase jp nagar", "aecs layout", "abbigere", "akshaya nagar", 
  "ambalipura", "ambedkar nagar", "amruthahalli", "anandapura", 
  "ananth nagar", "anekal", "anjanapura", "ardendale", "arekere", 
  "attibele", "beml layout", "btm 2nd stage", "btm layout", "babusapalaya", 
  "badavala nagar", "balagere", "banashankari", "banashankari stage ii", 
  "banashankari stage iii", "banashankari stage v", "banashankari stage vi", 
  "banaswadi", "banjara layout", "bannerghatta", "bannerghatta road", 
  "basavangudi", "basaveshwara nagar", "battarahalli", "begur", "begur road", 
  "bellandur", "benson town", "bharathi nagar", "bhoganhalli", "billekahalli", 
  "binny pete", "bisuvanahalli", "bommanahalli", "bommasandra", 
  "bommasandra industrial area", "bommenahalli", "brookefield", "budigere", 
  "cv raman nagar", "chamrajpet", "chandapura", "channasandra", 
  "chikka tirupathi", "chikkabanavar", "chikkalasandra", "choodasandra", 
  "cooke town", "cox town", "cunningham road", "dasanapura", "dasarahalli", 
  "devanahalli", "devarachikkanahalli", "dodda nekkundi", "doddaballapur", 
  "doddakallasandra", "doddathoguru", "domlur", "dommasandra", "epip zone", 
  "electronic city", "electronic city phase ii", "electronics city phase 1", 
  "frazer town", "gm palaya", "garudachar palya", "giri nagar", 
  "gollarapalya hosahalli", "gottigere", "green glen layout", "gubbalala", 
  "gunjur", "hal 2nd stage", "hbr layout", "hrbr layout", "hsr layout", 
  "haralur road", "harlur", "hebbal", "hebbal kempapura", "hegde nagar", 
  "hennur", "hennur road", "hoodi", "horamavu agara", "horamavu banaswadi", 
  "hormavu", "hosa road", "hosakerehalli", "hoskote", "hosur road", 
  "hulimavu", "isro layout", "itpl", "iblur village", "indira nagar", 
  "jp nagar", "jakkur", "jalahalli", "jalahalli east", "jigani", 
  "judicial layout", "kr puram", "kadubeesanahalli", "kadugodi", 
  "kaggadasapura", "kaggalipura", "kaikondrahalli", "kalena agrahara", 
  "kalyan nagar", "kambipura", "kammanahalli", "kammasandra", "kanakapura", 
  "kanakpura road", "kannamangala", "karuna nagar", "kasavanhalli", 
  "kasturi nagar", "kathriguppe", "kaval byrasandra", "kenchenahalli", 
  "kengeri", "kengeri satellite town", "kereguddadahalli", "kodichikkanahalli", 
  "kodigehaali", "kodigehalli", "kodihalli", "kogilu", "konanakunte", 
  "koramangala", "kothannur", "kothanur", "kudlu", "kudlu gate", 
  "kumaraswami layout", "kundalahalli", "lb shastri nagar", "laggere", 
  "lakshminarayana pura", "lingadheeranahalli", "magadi road", "mahadevpura", 
  "mahalakshmi layout", "mallasandra", "malleshpalya", "malleshwaram", 
  "marathahalli", "margondanahalli", "marsur", "mico layout", "munnekollal", 
  "murugeshpalya", "mysore road", "ngr layout", "nri layout", "nagarbhavi", 
  "nagasandra", "nagavara", "nagavarapalya", "narayanapura", "neeladri nagar", 
  "nehru nagar", "ombr layout", "old airport road", "old madras road", 
  "padmanabhanagar", "pai layout", "panathur", "parappana agrahara", 
  "pattandur agrahara", "poorna pragna layout", "prithvi layout", "r.t. nagar", 
  "rachenahalli", "raja rajeshwari nagar", "rajaji nagar", "rajiv nagar", 
  "ramagondanahalli", "ramamurthy nagar", "rayasandra", "sahakara nagar", 
  "sanjay nagar", "sarakki nagar", "sarjapur", "sarjapur  road", 
  "sarjapura - attibele road", "sector 2 hsr layout", "sector 7 hsr layout", 
  "seegehalli", "shampura", "shivaji nagar", "singasandra", "somasundara palya", 
  "sompura", "sonnenahalli", "subramanyapura", "sultan palaya", "tc palya", 
  "talaghattapura", "thanisandra", "thigalarapalya", "thubarahalli", 
  "thyagaraja nagar", "tindlu", "tumkur road", "ulsoor", "uttarahalli", 
  "varthur", "varthur road", "vasanthapura", "vidyaranyapura", "vijayanagar", 
  "vishveshwarya layout", "vishwapriya layout", "vittasandra", "whitefield", 
  "yelachenahalli", "yelahanka", "yelahanka new town", "yelenahalli", 
  "yeshwanthpur"
];

// Approximate coordinates for major Bangalore locations
export const LOCATION_COORDINATES: Record<string, [number, number]> = {
  "indira nagar": [77.6408, 12.9784],
  "koramangala": [77.6229, 12.9279],
  "whitefield": [77.7500, 12.9698],
  "hsr layout": [77.6400, 12.9116],
  "electronic city": [77.6700, 12.8456],
  "jp nagar": [77.5855, 12.9063],
  "jayanagar": [77.5855, 12.9279],
  "marathahalli": [77.7010, 12.9591],
  "btm layout": [77.6099, 12.9166],
  "hebbal": [77.5916, 13.0358],
  "banashankari": [77.5466, 12.9255],
  "malleshwaram": [77.5655, 13.0070],
  "rajaji nagar": [77.5555, 13.0108],
  "yelahanka": [77.5963, 13.1007],
  "default": [77.5946, 12.9716], // Bangalore center
};

export function getLocationCoordinates(location: string): [number, number] {
  const normalizedLocation = location.toLowerCase();
  
  // Check for exact match
  if (LOCATION_COORDINATES[normalizedLocation]) {
    return LOCATION_COORDINATES[normalizedLocation];
  }
  
  // Check for partial matches
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return coords;
    }
  }
  
  // Return default with some random offset for variety
  const baseCoords = LOCATION_COORDINATES["default"];
  return [
    baseCoords[0] + (Math.random() - 0.5) * 0.15,
    baseCoords[1] + (Math.random() - 0.5) * 0.1
  ];
}

export const AMENITY_TYPES = [
  { id: "school", label: "Schools", icon: "GraduationCap", color: "amenity-school" },
  { id: "hospital", label: "Hospitals", icon: "Hospital", color: "amenity-hospital" },
  { id: "park", label: "Parks", icon: "Trees", color: "amenity-park" },
  { id: "restaurant", label: "Restaurants", icon: "UtensilsCrossed", color: "amenity-restaurant" },
  { id: "transport", label: "Transport", icon: "Train", color: "amenity-transport" },
  { id: "shopping", label: "Shopping", icon: "ShoppingBag", color: "amenity-shopping" },
] as const;

// Simulated nearby amenities generator
export function generateNearbyAmenities(location: string) {
  const amenities = [
    { type: "school", name: "DPS School", distance: "0.5 km", rating: 4.5 },
    { type: "school", name: "Bishop Cotton School", distance: "1.2 km", rating: 4.8 },
    { type: "hospital", name: "Apollo Hospital", distance: "0.8 km", rating: 4.6 },
    { type: "hospital", name: "Manipal Hospital", distance: "1.5 km", rating: 4.7 },
    { type: "park", name: "Cubbon Park", distance: "2.0 km", rating: 4.4 },
    { type: "park", name: "Lalbagh Gardens", distance: "3.5 km", rating: 4.9 },
    { type: "restaurant", name: "MTR Restaurant", distance: "0.3 km", rating: 4.5 },
    { type: "restaurant", name: "Vidyarthi Bhavan", distance: "1.0 km", rating: 4.7 },
    { type: "transport", name: "Metro Station", distance: "0.4 km", rating: 4.3 },
    { type: "transport", name: "Bus Stand", distance: "0.2 km", rating: 4.0 },
    { type: "shopping", name: "Phoenix Mall", distance: "2.5 km", rating: 4.4 },
    { type: "shopping", name: "Forum Mall", distance: "3.0 km", rating: 4.3 },
  ];
  
  // Randomize slightly based on location
  return amenities.map(a => ({
    ...a,
    distance: `${(parseFloat(a.distance) * (0.8 + Math.random() * 0.4)).toFixed(1)} km`
  }));
}
