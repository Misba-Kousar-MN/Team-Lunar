export const sampleProducts = [
  {
    id: "amazon-echo",
    name: "Amazon Echo Dot (5th Gen) - Smart Speaker with Alexa",
    platform: "Amazon",
    url: "https://www.amazon.com/dp/B09B8V1LZ3",
    trust_score: 84,
    genuine: 88,
    fake: 12,
    reviews: [
      {
        id: "ae-1",
        text: "I've been using this speaker for about 3 weeks now. The sound quality is a noticeable step up from the 4th gen. Bass is a bit punchier, and vocal clarity is excellent. Setup was simple via the Alexa app. Highly recommend for a bedroom speaker.",
        label: "Genuine",
        confidence: 0.96,
        reason: "Detailed review describing specific usage patterns and balanced pros/cons.",
        keywords: ["sound quality", "Setup was simple"]
      },
      {
        id: "ae-2",
        text: "AMAZING PRODUCT!!! BEST SPEAKER EVER MADE IN THE HISTORY OF speakers!!! Absolutely perfect, buy this now you will not regret it! Truly life changing! 100/100!",
        label: "Fake",
        confidence: 0.94,
        reason: "Excessive exclamation marks, generic praises, overuse of superlatives, and lack of specific details.",
        keywords: ["AMAZING PRODUCT!!!", "BEST SPEAKER EVER", "Absolutely perfect", "buy this now"]
      },
      {
        id: "ae-3",
        text: "Item works as advertised. Compact size and fits nicely on my nightstand. The motion detection is neat for tapping to snooze alarms. Happy with my purchase.",
        label: "Genuine",
        confidence: 0.89,
        reason: "Short but natural review highlighting specific feature usage (motion snooze).",
        keywords: ["works as advertised", "motion detection"]
      },
      {
        id: "ae-4",
        text: "I bought this product last week. It is very good. Excellent quality, fast shipping, amazing price. Highly recommend to everyone. Trust me, it is the best.",
        label: "Fake",
        confidence: 0.82,
        reason: "Repeated phrasing template often used by low-cost click farms. Highly generic seller feedback instead of product usage.",
        keywords: ["very good", "amazing price", "Highly recommend to everyone"]
      },
      {
        id: "ae-5",
        text: "The audio frequently disconnects from my Wi-Fi, which is very annoying. However, when it works, the sound is decent. Alexa sometimes struggles to hear me over music. Middle of the road.",
        label: "Genuine",
        confidence: 0.92,
        reason: "Contains both criticisms (Wi-Fi disconnects, mic recognition) and praise, which is typical of authentic human experiences.",
        keywords: ["frequently disconnects", "decent", "struggles to hear"]
      }
    ]
  },
  {
    id: "flipkart-tv",
    name: "Mi X Series 138 cm (55 inch) Ultra HD (4K) LED Smart Google TV",
    platform: "Flipkart",
    url: "https://www.flipkart.com/mi-x-series-138-cm-55-inch-ultra-hd-4k-led-smart-google-tv/p/itm252b86127e74d",
    trust_score: 52,
    genuine: 54,
    fake: 46,
    reviews: [
      {
        id: "ft-1",
        text: "Worst TV ever. Display panel stopped working within two days of installation. Customer service has been dodging my calls. Flipkart refusing to replace. Extremely disappointed.",
        label: "Genuine",
        confidence: 0.91,
        reason: "Details a negative experience with customer service and installation, typical of genuine product failure reviews.",
        keywords: ["stopped working", "dodging my calls", "refusing to replace"]
      },
      {
        id: "ft-2",
        text: "Excellent TV! The picture quality is mind blowing and sound is super clear. Best buy in this segment. I purchased it on big billion days. Delivery was fast. Five stars!",
        label: "Genuine",
        confidence: 0.85,
        reason: "Standard positive review with specific purchasing context (Big Billion Days reference).",
        keywords: ["picture quality", "delivery was fast"]
      },
      {
        id: "ft-3",
        text: "Very good TV. I love it so much. Very good TV. I love it so much. The screen is so beautiful and perfect. Outstanding quality. Pls buy this without thinking.",
        label: "Fake",
        confidence: 0.97,
        reason: "Repetitive sentence structure ('Very good TV. I love it so much' repeated verbatim) indicative of basic bot automation.",
        keywords: ["Very good TV. I love it so much.", "Pls buy this"]
      },
      {
        id: "ft-4",
        text: "Outstanding design, sleek bezel, absolute value for money, fast delivery, top quality materials used, strongly recommended, thank you seller!",
        label: "Fake",
        confidence: 0.88,
        reason: "Comma-separated list of positive attributes without standard sentence structures, common in translated bulk reviews.",
        keywords: ["value for money", "strongly recommended", "thank you seller!"]
      },
      {
        id: "ft-5",
        text: "The Google TV interface is quite smooth, but the boot-up time is a bit long. HDR content on Netflix looks brilliant, but ordinary cable TV looks slightly fuzzy. Audio is loud but lacks bass.",
        label: "Genuine",
        confidence: 0.95,
        reason: "Detailed, objective analysis evaluating specific operating system behaviors (Google TV boot-up) and hardware details.",
        keywords: ["boot-up time", "looks brilliant", "lacks bass"]
      },
      {
        id: "ft-6",
        text: "Best product ever bought. High quality. Recommend. Very cheap. I bought 10 of these for my family. Wonderful brand.",
        label: "Fake",
        confidence: 0.91,
        reason: "Suspicious claim (buying 10 55-inch TVs for family) and telegraphic language indicating simulated user profiles.",
        keywords: ["Best product ever", "bought 10 of these", "Wonderful brand"]
      }
    ]
  },
  {
    id: "iphone-15",
    name: "Apple iPhone 15 Pro Max (Natural Titanium, 256 GB)",
    platform: "Amazon",
    url: "https://www.amazon.com/dp/B0CHX2F5QT",
    trust_score: 91,
    genuine: 94,
    fake: 6,
    reviews: [
      {
        id: "ip-1",
        text: "The transition to titanium makes it feel significantly lighter in hand than the 14 Pro Max. Action button is customizable and useful for the camera. Battery easily lasts a full day of heavy use.",
        label: "Genuine",
        confidence: 0.98,
        reason: "Technical comparisons (weight change, action button usability) and realistic battery descriptions.",
        keywords: ["feel significantly lighter", "Action button", "lasts a full day"]
      },
      {
        id: "ip-2",
        text: "Great phone, but the price is too high. The camera zoom is incredible, but screen is prone to fingerprints. Overall it is good but Apple should charge less.",
        label: "Genuine",
        confidence: 0.94,
        reason: "Authentic customer balance of high praise for hardware features alongside price sensitivity.",
        keywords: ["zoom is incredible", "fingerprints", "charge less"]
      },
      {
        id: "ip-3",
        text: "AMAZING! SO FAST! CHEAP! EXCELLENT PHONE. GET IT NOW. TRUST ME IT IS THE CHEAPEST AND BEST PHONE.",
        label: "Fake",
        confidence: 0.96,
        reason: "Describing an iPhone Pro Max as 'cheap' and 'cheapest' is highly contradictory, highlighting automated sentiment blasting without product context.",
        keywords: ["AMAZING!", "CHEAP!", "CHEAPEST AND BEST"]
      }
    ]
  }
];

export const fallbackAnalysis = {
  trust_score: 75,
  genuine: 75,
  fake: 25,
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
