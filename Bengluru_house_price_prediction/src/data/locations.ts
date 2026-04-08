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
  "1st phase jp nagar": [77.5855, 12.9063],
  "jayanagar": [77.5855, 12.9279],
  "1st block jayanagar": [77.5855, 12.9279],
  "marathahalli": [77.7010, 12.9591],
  "btm layout": [77.6099, 12.9166],
  "hebbal": [77.5916, 13.0358],
  "banashankari": [77.5466, 12.9255],
  "malleshwaram": [77.5655, 13.0070],
  "rajaji nagar": [77.5555, 13.0108],
  "yelahanka": [77.5963, 13.1007],
  "default": [77.5946, 12.9716], // Bangalore center
};

// City-specific location coordinates for non-Bengaluru cities
export const CITY_LOCATION_COORDINATES: Record<string, Record<string, [number, number]>> = {
  delhi: {
    "connaught place": [77.2195, 28.6315],
    "dwarka": [77.0266, 28.5921],
    "sector 10 dwarka": [77.0266, 28.5921],
    "sector 11 dwarka": [77.0316, 28.5870],
    "sector 12 dwarka": [77.0340, 28.5830],
    "rohini": [77.1025, 28.7495],
    "pitampura": [77.1316, 28.6986],
    "janakpuri": [77.0861, 28.6219],
    "lajpat nagar": [77.2373, 28.5700],
    "saket": [77.2177, 28.5244],
    "vasant kunj": [77.1563, 28.5195],
    "greater kailash": [77.2434, 28.5462],
    "defence colony": [77.2332, 28.5724],
    "karol bagh": [77.1906, 28.6517],
    "chandni chowk": [77.2295, 28.6506],
    "south extension": [77.2231, 28.5733],
    "green park": [77.2078, 28.5607],
    "hauz khas": [77.2065, 28.5494],
    "malviya nagar": [77.2078, 28.5280],
    "nehru place": [77.2512, 28.5485],
    "mayur vihar": [77.2988, 28.5937],
    "noida": [77.3910, 28.5355],
    "gurgaon": [77.0266, 28.4595],
    "new friends colony": [77.2628, 28.5637],
    "east of kailash": [77.2513, 28.5560],
    "panchsheel park": [77.2167, 28.5374],
    "vasant vihar": [77.1616, 28.5578],
    "model town": [77.1929, 28.7168],
    "shalimar bagh": [77.1556, 28.7190],
    "preet vihar": [77.2900, 28.6353],
    "laxmi nagar": [77.2773, 28.6304],
    "indirapuram": [77.3582, 28.6304],
    "rajouri garden": [77.1285, 28.6462],
    "paschim vihar": [77.1050, 28.6711],
    "uttam nagar": [77.0617, 28.6215],
  },
  chennai: {
    "adyar": [80.2573, 13.0067],
    "anna nagar": [80.2090, 13.0850],
    "t. nagar": [80.2340, 13.0418],
    "velachery": [80.2208, 12.9815],
    "tambaram": [80.1270, 12.9249],
    "sholinganallur": [80.2279, 12.9010],
    "porur": [80.1558, 13.0382],
    "chromepet": [80.1443, 12.9516],
    "thiruvanmiyur": [80.2577, 12.9833],
    "nungambakkam": [80.2413, 13.0569],
    "mylapore": [80.2668, 13.0337],
    "guindy": [80.2121, 13.0067],
    "egmore": [80.2618, 13.0732],
    "perambur": [80.2327, 13.1117],
    "ambattur": [80.1481, 13.0982],
    "medavakkam": [80.1917, 12.9167],
    "pallavaram": [80.1502, 12.9667],
    "perungudi": [80.2432, 12.9630],
    "kodambakkam": [80.2235, 13.0485],
    "besant nagar": [80.2667, 12.9983],
  },
  hyderabad: {
    "banjara hills": [78.4383, 17.4156],
    "jubilee hills": [78.4073, 17.4326],
    "gachibowli": [78.3498, 17.4401],
    "madhapur": [78.3874, 17.4486],
    "hitech city": [78.3816, 17.4435],
    "kondapur": [78.3651, 17.4600],
    "kukatpally": [78.4098, 17.4849],
    "begumpet": [78.4694, 17.4434],
    "secunderabad": [78.4983, 17.4399],
    "ameerpet": [78.4482, 17.4375],
    "miyapur": [78.3548, 17.4965],
    "manikonda": [78.3800, 17.4046],
    "lb nagar": [78.5520, 17.3492],
    "dilsukhnagar": [78.5260, 17.3688],
    "uppal": [78.5593, 17.3990],
    "tarnaka": [78.5304, 17.4257],
    "habsiguda": [78.5296, 17.3973],
    "kompally": [78.4863, 17.5543],
    "shamshabad": [78.4298, 17.2472],
    "nallagandla": [78.3300, 17.4550],
  },
  kolkata: {
    "salt lake": [88.4063, 22.5796],
    "new town": [88.4613, 22.5948],
    "rajarhat": [88.4910, 22.6171],
    "ballygunge": [88.3636, 22.5308],
    "alipore": [88.3372, 22.5333],
    "howrah": [88.3119, 22.5958],
    "behala": [88.3187, 22.4893],
    "dum dum": [88.4332, 22.6273],
    "south kolkata": [88.3521, 22.5079],
    "park street": [88.3524, 22.5534],
    "gariahat": [88.3680, 22.5180],
    "jadavpur": [88.3695, 22.4968],
    "tollygunge": [88.3473, 22.4980],
    "lake town": [88.3868, 22.5905],
    "barasat": [88.4820, 22.7228],
    "garia": [88.3818, 22.4698],
    "em bypass": [88.3996, 22.5162],
    "sealdah": [88.3698, 22.5656],
    "esplanade": [88.3527, 22.5632],
    "bidhannagar": [88.4121, 22.5838],
  },
};

// Default coordinates for city centers
export const CITY_DEFAULT_COORDINATES: Record<string, [number, number]> = {
  "delhi": [77.2090, 28.6139],
  "bengaluru": [77.5946, 12.9716],
  "chennai": [80.2707, 13.0827],
  "hyderabad": [78.4744, 17.3850],
  "kolkata": [88.3639, 22.5726],
  "combined": [78.9629, 20.5937], // Geographic center of India
};

export function getLocationCoordinates(location: string, city: string = "bengaluru"): [number, number] {
  const normalizedLocation = location.toLowerCase().trim();
  const normalizedCity = city.toLowerCase().trim();
  
  // 1. Check city-specific coordinates first (for non-Bengaluru cities)
  const cityCoords = CITY_LOCATION_COORDINATES[normalizedCity];
  if (cityCoords) {
    // Exact match in city-specific coordinates
    if (cityCoords[normalizedLocation]) {
      return cityCoords[normalizedLocation];
    }
    // Partial match in city-specific coordinates
    for (const [key, coords] of Object.entries(cityCoords)) {
      if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
        return coords;
      }
    }
  }
  
  // 2. Check Bengaluru location coordinates 
  if (LOCATION_COORDINATES[normalizedLocation]) {
    return LOCATION_COORDINATES[normalizedLocation];
  }
  
  // Partial match in Bengaluru coordinates
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (key !== "default" && (normalizedLocation.includes(key) || key.includes(normalizedLocation))) {
      return coords;
    }
  }
  
  // 3. For unknown locations, generate coordinates based on location hash
  // This ensures consistent but distributed placement within the correct city
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = ((hash << 5) - hash) + location.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use city-specific center from CITY_DEFAULT_COORDINATES
  const cityCenter = CITY_DEFAULT_COORDINATES[normalizedCity] || CITY_DEFAULT_COORDINATES["bengaluru"];
  
  // Generate offset within city bounds (~10km radius to keep markers within city)
  const offsetLng = ((hash % 60) - 30) * 0.003;
  const offsetLat = (((hash / 100) % 60) - 30) * 0.003;
  
  return [
    cityCenter[0] + offsetLng,
    cityCenter[1] + offsetLat
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
