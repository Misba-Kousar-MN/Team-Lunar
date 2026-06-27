export const sampleProducts = [
  {
    id: "iphone-air",
    name: "Apple iPhone Air 256 GB: Thinnest iPhone Ever, 16.63 cm (6.5″) Display with Promotion up to 120Hz, Powerful A19 Pro Chip, Center Stage Front Camera, All-Day Battery Life; Cloud White",
    platform: "Amazon",
    url: "https://amzn.in/d/02h7nez0",
    trust_score: 84,
    genuine: 80,
    fake: 20,
    reviews: [
      {
        id: "iph-1",
        text: "The thinnest design is absolutely mind-blowing, feels so light in the hand. The A19 Pro chip is incredibly fast. Multi-tasking feels extremely fluid with the 120Hz ProMotion screen. Very happy with the Cloud White color.",
        label: "Genuine",
        confidence: 0.98,
        reason: "Specific references to hardware features (A19 Pro chip, Cloud White, thinnest chassis weight).",
        keywords: ["thinnest design", "A19 Pro chip", "120Hz ProMotion"]
      },
      {
        id: "iph-2",
        text: "I was worried about battery life due to the ultra-thin form factor, but it easily lasts a whole day of heavy web browsing and video calls. The Center Stage front camera makes FaceTime calls feel very natural.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Valid human concern about battery tradeoff due to form factor, referencing exact camera feature.",
        keywords: ["lasts a whole day", "Center Stage front camera"]
      },
      {
        id: "iph-3",
        text: "Beautiful 6.5 inch display, extremely bright in direct sunlight. However, the camera bump is still massive and makes the phone wobble when lying flat on a desk without a case. Otherwise, a solid upgrade.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Balanced critique mentioning physical usage limitations (camera bump wobble).",
        keywords: ["wobble", "bright in direct sunlight"]
      },
      {
        id: "iph-4",
        text: "No headphone adapter in the box and still no fast charger included. At this high price tag, Apple should really stop cutting corners. The phone itself runs a bit hot during heavy gaming.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Focuses on accessory packaging and thermal throttling notes during gaming.",
        keywords: ["no fast charger included", "runs a bit hot"]
      },
      {
        id: "iph-5",
        text: "AMAZING IPHONE AIR!!! BEST SMARTPHONE IN THE WORLD!!! Sound quality is perfect and screen is beautiful! Buy this today you will not regret at all!!! Fast delivery from seller!",
        label: "Fake",
        confidence: 0.95,
        reason: "Extreme hyper-sentiment keywords, exclamation spamming, and seller logistics feedback.",
        keywords: ["AMAZING IPHONE AIR!!!", "BEST SMARTPHONE", "regret at all"]
      },
      {
        id: "iph-6",
        text: "Very nice phone. Good quality. Fast shipping. Recommended.",
        label: "Fake",
        confidence: 0.84,
        reason: "Generic boilerplate filler phrase standard in bulk rating networks.",
        keywords: ["Very nice phone", "Fast shipping"]
      },
      {
        id: "iph-7",
        text: "Superb mobile phone. Highly recommended for students and professionals. Long battery life and top quality display screen.",
        label: "Fake",
        confidence: 0.88,
        reason: "Promotional review structure lacking any specific model experience descriptors.",
        keywords: ["Superb mobile phone", "Highly recommended"]
      },
      {
        id: "iph-8",
        text: "Superb mobile phone. Highly recommended for students and professionals. Long battery life and top quality display screen.",
        label: "Fake",
        confidence: 0.93,
        reason: "Identical duplicate review mapped to another account profile in the dataset.",
        keywords: ["Superb mobile phone", "Highly recommended"]
      },
      {
        id: "iph-9",
        text: "The titanium frame is robust but the glass back shattered after a minor drop from my nightstand. Strongly suggest buying a heavy duty protective case immediately.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Refers to real drop test experiences and case protection advice.",
        keywords: ["glass back shattered", "protective case"]
      },
      {
        id: "iph-10",
        text: "apple iphone air 256gb cloud white thinnest mobile smartphone a19 pro chip ios phone. Best device in market.",
        label: "Fake",
        confidence: 0.94,
        reason: "Spam keyword tag optimization line instead of human sentence structure.",
        keywords: ["apple iphone air 256gb", "a19 pro chip"]
      }
    ]
  },
  {
    id: "macbook-air",
    name: "Apple 2024 MacBook Air 15″ Laptop with M3 chip: 38.91 cm (15.3″) Liquid Retina Display, 24GB Unified Memory, 512GB SSD Storage, Backlit Keyboard, 1080p FaceTime HD Camera, Touch ID- Space Grey",
    platform: "Amazon",
    url: "https://amzn.in/d/0foxJxiU",
    trust_score: 80,
    genuine: 80,
    fake: 20,
    reviews: [
      {
        id: "mac-1",
        text: "The M3 processor is exceptionally fast for software development. The fanless design is amazing, completely silent even under sustained compilations. 24GB unified memory handles Docker containers easily.",
        label: "Genuine",
        confidence: 0.98,
        reason: "Specific developer workflows (Docker, compilations) and physical hardware features (fanless design, M3 chip).",
        keywords: ["M3 processor", "fanless design", "unified memory"]
      },
      {
        id: "mac-2",
        text: "Liquid Retina display is bright and colors are very accurate for photo editing. The backlit keyboard has good key travel, feels crisp to type on. Battery life easily lasts 15 hours of productivity.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Refers to display specifications (Liquid Retina) and keyboard feel with accurate battery duration.",
        keywords: ["Liquid Retina", "backlit keyboard", "lasts 15 hours"]
      },
      {
        id: "mac-3",
        text: "The 15-inch size is perfect, gives more screen real estate than the 13-inch but still fits easily in my backpack. MagSafe charging port is super convenient. The webcam resolution is decent.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Mentions dimensions relative to backpack fits, specific port architecture (MagSafe), and camera notes.",
        keywords: ["more screen real estate", "MagSafe charging"]
      },
      {
        id: "mac-4",
        text: "Space Grey metal body collects fingerprint smudges constantly, hard to keep clean. The sound speakers are located under the keyboard and sound a bit muffled compared to the Pro model.",
        label: "Genuine",
        confidence: 0.91,
        reason: "Provides physical criticisms (Space Grey smudges, keyboard speaker layout muffling).",
        keywords: ["fingerprint smudges", "speakers"]
      },
      {
        id: "mac-5",
        text: "BEST LAPTOP EVER BOUGHT IN MY LIFE!!! AMAZING M3 CHIP SPEED AND SOUND IS PERFECT!!! Buy it today you will not regret at all!!! Highly recommended!",
        label: "Fake",
        confidence: 0.96,
        reason: "Capitalized hype vocabulary, exaggerated absolute claims, and generic positive filler.",
        keywords: ["BEST LAPTOP EVER BOUGHT", "regret at all"]
      },
      {
        id: "mac-6",
        text: "Very nice product. Quality is good. Fast shipping. Good packaging.",
        label: "Fake",
        confidence: 0.81,
        reason: "Short vague boilerplate phrases matching e-commerce delivery networks.",
        keywords: ["Very nice product", "Fast shipping"]
      },
      {
        id: "mac-7",
        text: "Super laptop with long battery life. Extremely fast performance and beautiful display screen. Original product with warranty.",
        label: "Fake",
        confidence: 0.87,
        reason: "General positive descriptors without any technical or workflow-specific testing data.",
        keywords: ["Super laptop", "Original product"]
      },
      {
        id: "mac-8",
        text: "Super laptop with long battery life. Extremely fast performance and beautiful display screen. Original product with warranty.",
        label: "Fake",
        confidence: 0.92,
        reason: "Exact duplicate phrase signature mapped across multiple user review records.",
        keywords: ["Super laptop", "Original product"]
      },
      {
        id: "mac-9",
        text: "Only has 2 USB-C ports on the left side, which is very limiting. I have to carry a dongle everywhere for SD cards and USB-A drives. Price is steep for 512GB SSD.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Critiques specific port limitations (2 USB-C layout constraint) and price value metrics.",
        keywords: ["2 USB-C ports", "carry a dongle"]
      },
      {
        id: "mac-10",
        text: "apple macbook air 15 inch m3 laptop space grey 24gb ram 512gb ssd notebook mac book. Best computer.",
        label: "Fake",
        confidence: 0.95,
        reason: "SEO keyword string mapping catalog names instead of typing actual review sentences.",
        keywords: ["macbook air 15", "m3 laptop"]
      }
    ]
  },
  {
    id: "samsung-refrigerator",
    name: "Samsung 633 L, 3 Star, Frost Free, Double Door, Convertible 5-in-1 Digital Inverter, Side By Side Refrigerator with AI, WiFi & Water & Ice Dispenser (RS78CG8543S9HL, Silver, Refined Inox)",
    platform: "Amazon",
    url: "https://amzn.in/d/06npzt2c",
    trust_score: 72,
    genuine: 70,
    fake: 30,
    reviews: [
      {
        id: "ref-1",
        text: "The Convertible 5-in-1 modes are extremely practical. I converted the freezer section to fridge space during a family gathering and it worked flawlessly. Digital Inverter runs quiet. Large 633L capacity is huge.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Details specific home usage scenarios (freezer conversion during family event) and model capacity.",
        keywords: ["Convertible 5-in-1", "633L capacity"]
      },
      {
        id: "ref-2",
        text: "Water and Ice dispenser is the best part of this fridge, works smoothly with plumbed connection. The SmartThings WiFi integration sends notification if the door is left open, which is useful.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Specific hardware mentions (ice dispenser plumbed link) and software (SmartThings door notifications).",
        keywords: ["Water and Ice dispenser", "SmartThings WiFi"]
      },
      {
        id: "ref-3",
        text: "Excellent cooling throughout all shelves. The Silver Refined Inox look is beautiful and scratch-resistant. Internal LED lights are bright, making everything visible. Glass shelves are heavy duty.",
        label: "Genuine",
        confidence: 0.91,
        reason: "Discusses color variant aesthetics (Refined Inox) and shelf layouts.",
        keywords: ["Refined Inox", "cooling throughout"]
      },
      {
        id: "ref-4",
        text: "Very expensive to run and installation took four days to get scheduled. The dispenser nozzle drips slightly after taking water, leaving white spots on the drip tray. Build of door bins feels lightweight.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Identifies mechanical details (nozzle drip, water spot scaling) and scheduling delays.",
        keywords: ["nozzle drips", "installation took four days"]
      },
      {
        id: "ref-5",
        text: "AMAZING SAMSUNG REFRIGERATOR!!! BEST FRIDGE IN THE WORLD!!! Water dispenser is mind blowing and keeps ice cold!!! Buy now for fast delivery!!!",
        label: "Fake",
        confidence: 0.97,
        reason: "Extreme hyper-sentiment capitalization, exclamation marks, and generic promo phrases.",
        keywords: ["AMAZING SAMSUNG REFRIGERATOR!!!", "Buy now"]
      },
      {
        id: "ref-6",
        text: "Good product. Works well. Nice look.",
        label: "Fake",
        confidence: 0.81,
        reason: "Short generic boilerplate structure typical of bulk reviews.",
        keywords: ["Good product", "Nice look"]
      },
      {
        id: "ref-7",
        text: "Excellent refrigerator with fast cooling. Highly recommended product. Plumbed water line works perfectly. Value for money buy.",
        label: "Fake",
        confidence: 0.86,
        reason: "Repeated positive keywords lacking detailed usage descriptions.",
        keywords: ["Excellent refrigerator", "Value for money"]
      },
      {
        id: "ref-8",
        text: "Excellent refrigerator with fast cooling. Highly recommended product. Plumbed water line works perfectly. Value for money buy.",
        label: "Fake",
        confidence: 0.92,
        reason: "Identical duplicate review sequence matched to another buyer profile.",
        keywords: ["Excellent refrigerator", "Value for money"]
      },
      {
        id: "ref-9",
        text: "Depth is quite deep, so check your kitchen doorway dimensions before buying! We had to remove the fridge doors just to get it inside the house. Cooling performance is excellent.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Logistical details ( kitchen doorway size warning, door removal tasks during install).",
        keywords: ["doorway dimensions", "remove the fridge doors"]
      },
      {
        id: "ref-10",
        text: "samsung 633l side by side refrigerator convertible double door fridge plumbed water dispenser silver. Best device.",
        label: "Fake",
        confidence: 0.94,
        reason: "Tag list optimization string common to automated marketing botnets.",
        keywords: ["side by side refrigerator", "water dispenser"]
      }
    ]
  },
  {
    id: "samsung-washer",
    name: "Samsung 12 kg, 5star, AI Control, AI Ecobubble, Super Speed, Wi-Fi, Hygiene Steam with Inbuilt Heater, Digital Inverter, Fully-Automatic Front Load Washing Machine (WW12DG6B24ASTL, Navy)",
    platform: "Amazon",
    url: "https://amzn.in/d/0i5DJvEV",
    trust_score: 82,
    genuine: 80,
    fake: 20,
    reviews: [
      {
        id: "was-1",
        text: "The 12kg capacity is a lifesaver for our large family, can wash king size comforters easily. AI Ecobubble tech removes tough stains even in cold water. Inbuilt heater works perfectly for hygiene steam cycle.",
        label: "Genuine",
        confidence: 0.97,
        reason: "Discusses specific wash capacities (king size comforter fit) and technical cycles (Hygiene Steam cycle).",
        keywords: ["12kg capacity", "AI Ecobubble", "Hygiene steam"]
      },
      {
        id: "was-2",
        text: "AI Control auto recommends cycles based on our usage patterns. WiFi integration through SmartThings app allows starting and pausing cycles remotely. Operation is extremely silent even during 1400rpm spin.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Refers to software integrations (SmartThings) and specific hardware ratings (1400rpm spin silence).",
        keywords: ["AI Control", "SmartThings", "1400rpm spin"]
      },
      {
        id: "was-3",
        text: "Super Speed cycle washes a full load in just 39 minutes, which is super convenient. 5-star energy rating is visible on the machine. Navy color looks very premium in our utility room.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Highlights custom speed washing durations (39-minute cycle) and exact color variants.",
        keywords: ["Super Speed cycle", "Navy color"]
      },
      {
        id: "was-4",
        text: "Machine is very heavy and difficult to move once installed. The touch panel is sensitive to wet fingers and sometimes requires multiple taps to register. Drainage pipe supplied was too short.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Critiques panel sensitivity issues under wet conditions and packaging supply limits.",
        keywords: ["touch panel", "Drainage pipe"]
      },
      {
        id: "was-5",
        text: "AMAZING SAMSUNG WASHING MACHINE!!! AI CONTROL IS MIND BLOWING!!! Cleans clothes perfectly, buy this today you will not regret at all!!! 5 stars rating!",
        label: "Fake",
        confidence: 0.95,
        reason: "Hype language, capitalization spam, and absolute rating buzzwords.",
        keywords: ["AMAZING SAMSUNG WASHING", "regret at all"]
      },
      {
        id: "was-6",
        text: "Good product. Works well. Nice look.",
        label: "Fake",
        confidence: 0.81,
        reason: "Vague boilerplate phrase matching automated seller feedback blocks.",
        keywords: ["Good product", "Nice look"]
      },
      {
        id: "was-7",
        text: "Excellent washing machine. Super silent and washes clothes very neatly. Highly recommended buy. Value for money.",
        label: "Fake",
        confidence: 0.86,
        reason: "Promotional review structure lacking any specific model experience descriptors.",
        keywords: ["Excellent washing", "Value for money"]
      },
      {
        id: "was-8",
        text: "Excellent washing machine. Super silent and washes clothes very neatly. Highly recommended buy. Value for money.",
        label: "Fake",
        confidence: 0.92,
        reason: "Exact duplicate phrase signature mapped across multiple user review records.",
        keywords: ["Excellent washing", "Value for money"]
      },
      {
        id: "was-9",
        text: "Inbuilt heater takes a bit long to heat water to 60 degrees, extending the total cycle time. Detergent drawer compartment is slightly narrow, spills easily if pouring fast.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Notes specific temperature rates (60 degrees duration) and physical drawer spacing constraints.",
        keywords: ["Inbuilt heater", "Detergent drawer"]
      },
      {
        id: "was-10",
        text: "samsung 12kg front load washing machine fully automatic ai ecobubble navy washer. Best appliance in home.",
        label: "Fake",
        confidence: 0.93,
        reason: "Tag list optimization string common to automated marketing botnets.",
        keywords: ["front load washing", "ai ecobubble"]
      }
    ]
  },
  {
    id: "canon-camera",
    name: "Canon EOS R50 V Smartchoice Mirrorless Camera Kit with RF-S14-30mm F4-6.3 is STM PZ Lens – Black | 24.2 MP APS-C Sensor, 4K Video, Compact Design",
    platform: "Amazon",
    url: "https://amzn.in/d/07sjDcj9",
    trust_score: 78,
    genuine: 80,
    fake: 20,
    reviews: [
      {
        id: "cam-1",
        text: "Excellent entry-level mirrorless camera. The 24.2 MP APS-C sensor captures sharp details with beautiful background blur. The RF-S 14-30mm kit lens is compact and great for vloggers.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Mentions hardware specifications (24.2 MP APS-C sensor, RF-S 14-30mm lens) and specific use cases.",
        keywords: ["24.2 MP APS-C sensor", "RF-S 14-30mm"]
      },
      {
        id: "cam-2",
        text: "The auto-focus tracking is incredibly fast, detects eyes and faces instantly. 4K video quality is crisp with natural skin tones. Compact design makes it very easy to carry around on hikes.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Specific hardware performance (autofocus eye detection, 4K recording portability).",
        keywords: ["auto-focus tracking", "Compact design"]
      },
      {
        id: "cam-3",
        text: "The electronic viewfinder is clear, and the articulating touchscreen screen is useful for selfies. Wireless transfer to my phone via Canon app works fine, though setup was tricky.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Refers to viewfinders, screen hinges (articulating screen), and app transfer setup details.",
        keywords: ["viewfinder", "articulating touchscreen"]
      },
      {
        id: "cam-4",
        text: "Battery life is very short, only lasts for about 300 shots. You absolutely need to buy a spare battery if shooting outdoors. The plastic body frame feels a bit like a toy.",
        label: "Genuine",
        confidence: 0.91,
        reason: "Notes specific component limitations (300 shots battery cap) and structural material critiques.",
        keywords: ["Battery life is very short", "plastic body"]
      },
      {
        id: "cam-5",
        text: "AMAZING CANON CAMERA!!! BEST MIRRORLESS CAMERA EVER!!! Photo quality is perfect, buy this today you will not regret!!! Fast delivery!",
        label: "Fake",
        confidence: 0.95,
        reason: "Commercial promoter phrases, caps lock, and absolute quality claims.",
        keywords: ["AMAZING CANON CAMERA!!!", "Buy this today"]
      },
      {
        id: "cam-6",
        text: "Nice product. Quality is good. Fast shipping. Good packaging.",
        label: "Fake",
        confidence: 0.81,
        reason: "Short vague boilerplate phrases matching e-commerce delivery networks.",
        keywords: ["Nice product", "Fast shipping"]
      },
      {
        id: "cam-7",
        text: "Superb mirrorless camera kit. Excellent 4K video recording. Highly recommended product. Value for money buy.",
        label: "Fake",
        confidence: 0.86,
        reason: "Promotional review structure lacking any specific model experience descriptors.",
        keywords: ["Superb mirrorless", "Value for money"]
      },
      {
        id: "cam-8",
        text: "Superb mirrorless camera kit. Excellent 4K video recording. Highly recommended product. Value for money buy.",
        label: "Fake",
        confidence: 0.92,
        reason: "Exact duplicate phrase signature mapped across multiple user review records.",
        keywords: ["Superb mirrorless", "Value for money"]
      },
      {
        id: "cam-9",
        text: "The kit lens aperture of F4-6.3 is slow for low-light indoor shooting. Photos come out grainy without a flash inside. Autofocus struggles a bit in dim rooms.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Points out specific aperture limits (F4-6.3 low-light grains) and focus performance inside.",
        keywords: ["aperture of F4-6.3", "low-light indoor"]
      },
      {
        id: "cam-10",
        text: "canon eos r50 v mirrorless camera kit rf-s 14-30mm lens black 24.2mp aps-c sensor. Best camera.",
        label: "Fake",
        confidence: 0.93,
        reason: "Tag list optimization string common to automated marketing botnets.",
        keywords: ["eos r50 v", "mirrorless camera kit"]
      }
    ]
  },
  {
    id: "lg-oled-tv",
    name: "LG 139 cm (55 inches) OLED B4 AI Series 4K Ultra HD (3840 x 2160) Smart webOS OLED TV OLED55B46LA",
    platform: "Amazon",
    url: "https://amzn.in/d/01yzQRZc",
    trust_score: 84,
    genuine: 80,
    fake: 20,
    reviews: [
      {
        id: "tv-1",
        text: "The perfect pitch blacks of this OLED panel are stunning. Dolby Vision content looks spectacular with infinite contrast. The webOS software is smooth, apps load instantly.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Identifies OLED specific attributes (infinite contrast, pitch blacks) and OS names (webOS software).",
        keywords: ["blacks of this OLED", "Dolby Vision", "webOS"]
      },
      {
        id: "tv-2",
        text: "Excellent gaming TV. Supports 120Hz refresh rate, VRR, and G-Sync. My PS5 gaming feels incredibly responsive with minimal input lag. 4 HDMI 2.1 ports are great.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Refers to console workflows (PS5, G-Sync, VRR support) and exact HDMI standard specs.",
        keywords: ["120Hz refresh rate", "G-Sync", "HDMI 2.1 ports"]
      },
      {
        id: "tv-3",
        text: "Sound quality from built-in speakers is decent but lacks bass, so buying a soundbar is recommended. The magic remote with on-screen mouse cursor is very convenient to use.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Critiques audio performance alongside custom brand accessories (LG Magic Remote cursor).",
        keywords: ["lacks bass", "magic remote"]
      },
      {
        id: "tv-4",
        text: "The glossy screen is highly reflective in bright rooms with windows, makes daytime viewing difficult. Screen brightness is lower than standard LED TVs. Installation took 3 days.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Balanced critique pointing out environmental limitations (glossy reflection, OLED brightness limits).",
        keywords: ["glossy screen", "daytime viewing"]
      },
      {
        id: "tv-5",
        text: "AMAZING LG OLED TV!!! BEST TV IN THE WORLD!!! Contrast is mind blowing and screen is so bright!!! Buy this now you will not regret!!!",
        label: "Fake",
        confidence: 0.95,
        reason: "Polarized positive superlatives, brand hype, and typical call-to-action commands.",
        keywords: ["AMAZING LG OLED TV!!!", "regret!!!"]
      },
      {
        id: "tv-6",
        text: "Nice TV, working fine. Fast delivery. Good packaging.",
        label: "Fake",
        confidence: 0.81,
        reason: "Short boilerplate review structure lacking technical descriptors.",
        keywords: ["Nice TV", "Fast delivery"]
      },
      {
        id: "tv-7",
        text: "Superb 4K smart TV. Outstanding display quality and sound performance. Highly recommended buy. Value for money.",
        label: "Fake",
        confidence: 0.86,
        reason: "Promotional review structure lacking any specific model experience descriptors.",
        keywords: ["Superb 4K smart TV", "Value for money"]
      },
      {
        id: "tv-8",
        text: "Superb 4K smart TV. Outstanding display quality and sound performance. Highly recommended buy. Value for money.",
        label: "Fake",
        confidence: 0.92,
        reason: "Exact duplicate phrase signature mapped across multiple user review records.",
        keywords: ["Superb 4K smart TV", "Value for money"]
      },
      {
        id: "tv-9",
        text: "Bezel is extremely thin, almost edge-to-edge. However, the power cable is hardwired into the back of the TV, which makes wall mounting a bit tricky if routing through conduits.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Notes specific installation issues (hardwired power cord routing constraints for mounts).",
        keywords: ["bezel is extremely thin", "power cable"]
      },
      {
        id: "tv-10",
        text: "lg 55 inches oled b4 series 4k ultra hd tv webos smart oled55b46la television. Best premium device.",
        label: "Fake",
        confidence: 0.94,
        reason: "Tag list optimization string common to automated marketing botnets.",
        keywords: ["oled b4 series", "oled55b46la"]
      }
    ]
  },
  {
    id: "lg-dishwasher",
    name: "LG Free Standing 14 Place Settings Dishwasher (DFB424FP, Matte Silver)",
    platform: "Flipkart",
    url: "https://dl.flipkart.com/dl/lg-dfb424fp-free-standing-14-place-settings-intensive-kadhai-cleaning-no-pre-rinse-required-dishwasher/p/itmffag4ttb5fkm3?pid=DSWFFAG4YRKVBK83",
    trust_score: 88,
    genuine: 90,
    fake: 10,
    reviews: [
      {
        id: "dish-1",
        text: "Excellent dishwasher. It cleans even the toughest Indian oil and masala stains from kadhais perfectly. No pre-rinsing required as advertised. The Wi-Fi features are handy.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Details specific regional usage notes (Indian oil/masala cooking pans) and specific settings.",
        keywords: ["masala stains", "No pre-rinsing required"]
      },
      {
        id: "dish-2",
        text: "Very silent operation. The inverter direct drive motor makes virtually no noise. The adjustable racks and folding tines make it easy to load large pots.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Correctly identifies proprietary motor architectures (Inverter Direct Drive) and rack layouts.",
        keywords: ["silent operation", "inverter direct drive"]
      },
      {
        id: "dish-3",
        text: "The wash cycle takes quite long (around 3 hours in Auto mode). Energy and water consumption are reasonable, but installation took three days to schedule.",
        label: "Genuine",
        confidence: 0.91,
        reason: "Balanced notes on cycle duration vs utility costs, alongside delivery logistics.",
        keywords: ["Auto mode", "installation took three days"]
      },
      {
        id: "dish-4",
        text: "Good machine, but customer service during demo was poor. The technician was in a hurry and didn't explain the settings properly. Salt and rinse aid indicator is hard to read.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Critical feedback concerning on-site technician demo quality and hardware indicators.",
        keywords: ["customer service", "rinse aid indicator"]
      },
      {
        id: "dish-5",
        text: "AMAZING LG DISHWASHER!!! KADHAI CLEANING IS MIND BLOWING!!! Best purchase ever, completely silent, buy this without thinking. Five stars rating!!!",
        label: "Fake",
        confidence: 0.95,
        reason: "Repetitive hyper-positive sentiment keywords, excessive exclamation symbols.",
        keywords: ["AMAZING LG DISHWASHER!!!", "Five stars rating!!!"]
      },
      {
        id: "dish-6",
        text: "Nice product. Working fine. Delivery was fast.",
        label: "Fake",
        confidence: 0.82,
        reason: "Very short generic review containing zero appliance usage descriptions.",
        keywords: ["Nice product", "Delivery was fast"]
      },
      {
        id: "dish-7",
        text: "Very good dishwasher. Cleans vessels very neatly. Less water consumption and easy to operate. Value for money.",
        label: "Fake",
        confidence: 0.86,
        reason: "Standard buzzwords commonly copy-pasted across home appliance items.",
        keywords: ["Very good dishwasher", "Value for money"]
      },
      {
        id: "dish-8",
        text: "Very good dishwasher. Cleans vessels very neatly. Less water consumption and easy to operate. Value for money.",
        label: "Fake",
        confidence: 0.91,
        reason: "Exact duplicate phrase signature matching another user profile.",
        keywords: ["Very good dishwasher", "Value for money"]
      },
      {
        id: "dish-9",
        text: "Steam clean feature is really good for sanitizing baby bottles. Utensils come out completely dry and clean with no water spots.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Identifies specialized sanitization settings (steam cleaning baby products) and drying performance.",
        keywords: ["Steam clean feature", "no water spots"]
      },
      {
        id: "dish-10",
        text: "lg 14 place settings dishwasher intensive kadhai cleaning matte silver free standing dishwasher. Best brand.",
        label: "Fake",
        confidence: 0.93,
        reason: "Tag keyword list stuffing instead of natural review sentences.",
        keywords: ["lg 14 place settings", "kadhai cleaning"]
      }
    ]
  },
  {
    id: "apple-ipad-9th",
    name: "Apple iPad (9th Gen) 256 GB ROM 10.2 Inch with Wi-Fi+4G (Space Grey)",
    platform: "Flipkart",
    url: "https://dl.flipkart.com/dl/apple-ipad-9th-gen-256-gb-rom-10-2-inch-4g-a13-bionic-chip-space-grey/p/itmd7d2c4840fa04?pid=TABG6VNCJCNHYMPD",
    trust_score: 86,
    genuine: 90,
    fake: 10,
    reviews: [
      {
        id: "ipad-1",
        text: "Best entry level iPad. The A13 Bionic chip is super smooth, no lag whatsoever in daily multitasking, note-taking, and media streaming. The 256GB storage is perfect for downloading movies.",
        label: "Genuine",
        confidence: 0.97,
        reason: "References SoC model name (A13 Bionic) and storage metrics (256GB) for study/work use.",
        keywords: ["A13 Bionic chip", "256GB storage"]
      },
      {
        id: "ipad-2",
        text: "The display is sharp and vivid. Center Stage camera feature is very useful for Zoom meetings, it tracks your movement automatically. Battery life easily lasts 10 hours.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Discusses specific video call configurations (Center Stage auto tracking) and battery levels.",
        keywords: ["Center Stage camera", "lasts 10 hours"]
      },
      {
        id: "ipad-3",
        text: "The non-laminated screen has a slight air gap which makes a hollow sound when tapping with the Apple Pencil. Still uses the old design with big bezels and physical home button.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Points out specific panel specifications (non-laminated glass gap) and accessories (Apple Pencil tap sound).",
        keywords: ["non-laminated screen", "hollow sound"]
      },
      {
        id: "ipad-4",
        text: "Apple Pencil 1st gen charging mechanism is ridiculous, you have to plug it into the Lightning port of the iPad. Also, no headphone jack adaptor is included.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Strong negative review of the Pencil charging layout (plugged into Lightning port).",
        keywords: ["Pencil 1st gen charging", "Lightning port"]
      },
      {
        id: "ipad-5",
        text: "EXCELLENT IPAD!!! APPLE IS THE BEST BRAND EVER!!! Extremely fast shipping, original product, very happy. Buy now!!!",
        label: "Fake",
        confidence: 0.96,
        reason: "Hype statements, commercial capitalization pattern, and delivery focus.",
        keywords: ["EXCELLENT IPAD!!!", "Buy now!!!"]
      },
      {
        id: "ipad-6",
        text: "Nice tablet. Original Apple product. Fast delivery.",
        label: "Fake",
        confidence: 0.82,
        reason: "Short boilerplate review lacking product usage details.",
        keywords: ["Nice tablet", "Original Apple product"]
      },
      {
        id: "ipad-7",
        text: "Superb product. Highly recommended for students and work. Long battery life and top performance.",
        label: "Fake",
        confidence: 0.88,
        reason: "Repetitive promotional phrases standard in automated seller feedback systems.",
        keywords: ["Superb product", "Highly recommended"]
      },
      {
        id: "ipad-8",
        text: "Superb product. Highly recommended for students and work. Long battery life and top performance.",
        label: "Fake",
        confidence: 0.91,
        reason: "Verbatim duplicate review signature matching another reviewer profile.",
        keywords: ["Superb product", "Highly recommended"]
      },
      {
        id: "ipad-9",
        text: "LTE connectivity works great on Airtel. Handheld gaming is smooth, graphic intensive games like Genshin Impact run fine on medium settings.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Specifies network carrier (Airtel LTE) and gaming titles (Genshin Impact performance).",
        keywords: ["LTE connectivity", "Genshin Impact"]
      },
      {
        id: "ipad-10",
        text: "apple ipad 9th gen 256gb space grey tablet ios apple tablet student ipad. Best price and quality.",
        label: "Fake",
        confidence: 0.94,
        reason: "Tag indexing metadata pattern typical of marketing botnets.",
        keywords: ["apple ipad 9th gen", "student ipad"]
      }
    ]
  },
  {
    id: "sleepyhead-kiki-sofa",
    name: "Sleepyhead Kiki Designed Duroflex Foam Premium Fabric 2-Seater Sofa",
    platform: "Flipkart",
    url: "https://dl.flipkart.com/dl/sleepyhead-kiki-designed-duroflex-high-density-foam-premium-fabric-2-seater-sofa/p/itme155ea03743b3?pid=SOFGFGHYDVG5TC38",
    trust_score: 72,
    genuine: 70,
    fake: 30,
    reviews: [
      {
        id: "sofa-1",
        text: "Very comfortable 2-seater sofa. The Duroflex high-density foam cushioning is firm yet cozy. The fabric feels premium and matches my living room decor beautifully.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Specifies cushioning material supplier (Duroflex) and fabric textures.",
        keywords: ["Duroflex high-density foam", "Premium Fabric"]
      },
      {
        id: "sofa-2",
        text: "Assembly was simple, just had to screw in the legs. However, the size is a bit compact, ideal for small rooms but too small if you want to stretch out fully.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Notes specific assembly tasks (screwing legs) and dimension limitations (compact layout).",
        keywords: ["Assembly was simple", "bit compact"]
      },
      {
        id: "sofa-3",
        text: "The stitching at the back corner is coming loose after only 2 weeks. The wooden legs feel lightweight and slide easily on tiled floors, had to buy rubber pads.",
        label: "Genuine",
        confidence: 0.93,
        reason: "Notes detailed stitching quality issues and wood leg flooring slip constraints.",
        keywords: ["stitching", "slide easily on tiled floors"]
      },
      {
        id: "sofa-4",
        text: "WONDERFUL SOFA!!! SO COMFORTABLE AND PRETTY!!! Delivery was fast, packing was perfect. Buy this today, best furniture ever!!!",
        label: "Fake",
        confidence: 0.96,
        reason: "Polarized positive sentiment keywords, exclamation marks, and generic promo phrasing.",
        keywords: ["WONDERFUL SOFA!!!", "best furniture ever!!!"]
      },
      {
        id: "sofa-5",
        text: "Good sofa. Comfortable seat. Fast shipping.",
        label: "Fake",
        confidence: 0.81,
        reason: "Short boilerplate review pattern containing generic keywords.",
        keywords: ["Good sofa", "Comfortable seat"]
      },
      {
        id: "sofa-6",
        text: "Highly recommended 2-seater sofa. High quality foam and fabric materials used. Value for money purchase.",
        label: "Fake",
        confidence: 0.87,
        reason: "Generic positive phrases lacking detailed usage descriptions.",
        keywords: ["Highly recommended 2-seater sofa", "Value for money"]
      },
      {
        id: "sofa-7",
        text: "Highly recommended 2-seater sofa. High quality foam and fabric materials used. Value for money purchase.",
        label: "Fake",
        confidence: 0.92,
        reason: "Verbatim duplicate review signature matching another account.",
        keywords: ["Highly recommended 2-seater sofa", "Value for money"]
      },
      {
        id: "sofa-8",
        text: "The seat height is perfect for elderly people. The cushions don't sag even after sitting for long hours. Decent value for money.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Highlights target user group suitability (elderly comfort) and cushion resilience (no sagging).",
        keywords: ["cushions don't sag", "elderly people"]
      },
      {
        id: "sofa-9",
        text: "The color is slightly darker than shown in the photos. Fabric attracts lint easily, needs regular cleaning with a brush.",
        label: "Genuine",
        confidence: 0.91,
        reason: "Points out visual variance vs photos (darker color tone) and maintenance details (fabric lint).",
        keywords: ["color is slightly darker", "attracts lint"]
      },
      {
        id: "sofa-10",
        text: "sleepyhead kiki 2 seater sofa premium fabric duroflex foam living room furniture sofa. Best product.",
        label: "Fake",
        confidence: 0.93,
        reason: "Tag list optimization string common to seller automated marketing botnets.",
        keywords: ["duroflex foam", "living room furniture"]
      }
    ]
  }
];

export const fallbackAnalysis = {
  trust_score: 75,
  genuine: 75,
  fake: 25,
  url: "https://amzn.in/d/02h7nez0",
  reviews: [
    {
      id: "fb-1",
      text: "This is a generic product analysis because the URL provided is not in our direct database. The build quality feels decent, and setup took under 10 minutes. However, the accompanying mobile app feels cluttered and slow to load.",
      label: "Genuine",
      confidence: 0.89,
      reason: "Balanced critique of app vs. build quality which matches standard human reviews.",
      keywords: ["decent", "cluttered and slow"]
    },
    {
      id: "fb-2",
      text: "BUY IT TODAY!!! Amazing product! Best quality! Super fast! The seller is the best on the site, I will purchase from them again and again!",
      label: "Fake",
      confidence: 0.92,
      reason: "Focuses entirely on seller praise, uses exclamation marks, and contains no details about the product itself.",
      keywords: ["BUY IT TODAY!!!", "Amazing product!", "seller is the best"]
    },
    {
      id: "fb-3",
      text: "I bought this as a gift for my sister. It arrived on time and was packaged nicely. She has been using it every day since and says it works perfectly.",
      label: "Genuine",
      confidence: 0.84,
      reason: "Common human gifting behavior pattern and realistic delivery references.",
      keywords: ["arrived on time", "works perfectly"]
    },
    {
      id: "fb-4",
      text: "Highly recommended! Absolutely perfect quality! I am so happy with this buy, 5 stars all the way!",
      label: "Fake",
      confidence: 0.78,
      reason: "Extremely generic feedback with no descriptive nouns or specific features mentioned.",
      keywords: ["Highly recommended!", "Absolutely perfect quality!", "5 stars"]
    }
  ]
};
