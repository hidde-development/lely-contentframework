export interface CatalogUsp {
  title: string;
  description: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  usps: CatalogUsp[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  description: string;
  products: CatalogProduct[];
}

export const PRODUCT_CATALOG: CatalogCategory[] = [
  {
    id: "automatic-milking",
    name: "Automatic milking",
    description:
      "Our solutions for automatic milking can help you produce high-quality milk and achieve your goals. From optimising labour efficiency to helping to improve cow health and increase your yields.",
    products: [
      {
        id: "astronaut-a5-next",
        name: "Lely Astronaut A5 Next",
        description:
          "The next step in milking. An evolution incorporating 30+ years of automatic milking experience, designed around cow comfort and farmer usability. The hybrid arm, I-flow concept, teat detection system and spacious cow box contribute to a healthier cow and increased visiting behaviour.",
        usps: [
          {
            title: "Cow comfort",
            description:
              "Achieve optimal comfort by letting cows decide when to eat, drink, relax or be milked. The hybrid arm, I-flow concept, teat detection and spacious cow box contribute to a healthier cow.",
          },
          {
            title: "Ease of use",
            description:
              "User-friendly interface makes automatic milking easy to understand for everybody. Optional automatic milk filter and cutting-edge management system Horizon provide decision support at your fingertips.",
          },
          {
            title: "Reliability",
            description:
              "Three decades of farmer insights have been built into every edition. Robust milking robot with a new operating system incorporating the latest insights in resilience, adaptability and protection.",
          },
        ],
      },
      {
        id: "astronaut-max",
        name: "Lely Astronaut Max",
        description:
          "Perfects decentralised automatic milking on large dairy farms. Delivers filtered and cooled milk to milk tanks over large distances, and supplies centralised cleaning detergents and utilities to milking robots. Optimises workload for large-scale operations.",
        usps: [
          {
            title: "Efficient",
            description:
              "Shortens the payback period through increased milking capacity, labour savings and more efficient cooling, water and health management compared to regular setups.",
          },
          {
            title: "Central control",
            description:
              "Central control of decentralised milking with clear insights, plannable maintenance and integrated Horizon management software. Easy to expand your dairy operation.",
          },
          {
            title: "Safe and organised",
            description:
              "Central handling of chemicals, centralised equipment and optimised standard procedures create a safe, well-organised working environment.",
          },
          {
            title: "Cow comfort",
            description:
              "Free cow traffic remains the priority. Reduces noise and people movement, creating a quieter, more stress-free environment and higher robot availability for low-ranked cows.",
          },
        ],
      },
      {
        id: "dairy-xl",
        name: "Lely Dairy XL",
        description:
          "Tailored solutions for larger dairy farms. Reduces repetitive work and labour requirements while enhancing animal welfare. Lely Dairy XL specialists provide expert support in setting up and managing large dairy farms worldwide.",
        usps: [
          {
            title: "Animal welfare",
            description:
              "Creates an environment where cows can maximise their genetic potential and farmers can focus on cows that need special attention.",
          },
          {
            title: "Red Cow Community",
            description:
              "A Lely-initiated network connecting and inspiring Dairy XL customers by sharing experiences and insights. Consists of several hundred large dairy farms worldwide.",
          },
          {
            title: "Digital farming",
            description:
              "Lely Horizon uses powerful algorithms to transform farm data on cow health, milk yields and operations into actionable insight for daily management and strategic decision-making.",
          },
        ],
      },
      {
        id: "meteor",
        name: "Lely Meteor",
        description:
          "A comprehensive hoof health approach combining high-quality products with Farm Management Support and Technical Service Support. Focuses on prevention rather than cure to manage hoof disorders and reduce lameness.",
        usps: [
          {
            title: "Animal welfare",
            description:
              "Healthy hooves reduce lameness, allowing cows to move naturally and comfortably, improving their overall well-being.",
          },
          {
            title: "Work pleasure",
            description:
              "Fewer hoof problems mean less time treating lame cows, making daily work more enjoyable and efficient while freeing up time for other tasks.",
          },
          {
            title: "Free cow traffic",
            description:
              "Good hoof health supports smooth, voluntary cow movement so cows can decide when to eat, rest or be milked, enhancing cow flow and system efficiency.",
          },
          {
            title: "Milk production",
            description:
              "Healthy, mobile cows visit the milking robot more often, leading to more regular milking sessions and improved milk yield.",
          },
        ],
      },
    ],
  },
  {
    id: "feeding",
    name: "Feeding",
    description:
      "More frequent automatic feeding and feed pushing can have a positive effect on labour, animal health, fertility, production and finances. Our automatic feeding solutions tackle frequent feeding and feed pushing to improve feed intake, which can result in healthier cows and more efficient production.",
    products: [
      {
        id: "vector",
        name: "Lely Vector",
        description:
          "Automatic feeding system that provides every animal group access to fresh, precisely mixed rations based on their needs. Consists of a mixing and feeding robot and a feed kitchen where feed is stored, selected and loaded. The pushing technology on two sides keeps feed always within reach, enabling an enhanced feeding strategy that can lead to improved milk yields and healthier cows.",
        usps: [
          {
            title: "Saving time and cost",
            description:
              "Frees up time for other farm tasks and can reduce rest feed. Reduces fuel consumption and substitutes other feeding machinery, which can lead to energy and cost savings.",
          },
          {
            title: "Frequent feeding",
            description:
              "The battery-operated mixing and feeding robot provides frequent feeding, which can positively impact rumen health, fertility and milk production.",
          },
          {
            title: "Precision feeding",
            description:
              "The feed kitchen and feed grabber provide accurate, precise rations tailored to each group, helping every animal group receive the proper nutrients for better health and growth.",
          },
          {
            title: "Flexible",
            description:
              "Suitable for almost all feed types and barn layouts, giving more flexibility in when to spend time on feeding.",
          },
        ],
      },
      {
        id: "juno",
        name: "Lely Juno",
        description:
          "Automatic feed pusher that relieves the work of pushing feed multiple times a day. By pushing feed regularly, it keeps roughage within the cows' reach for optimal rumen health and overall production.",
        usps: [
          {
            title: "Frequent feeding",
            description:
              "Increasing feed pushing frequency stimulates frequent feed consumption, while higher feed intake may improve cow health.",
          },
          {
            title: "Automated feed pushing",
            description:
              "Helps maintain a clean feed alley, reduce fuel usage and free up time to focus on other farming activities.",
          },
          {
            title: "Dynamic feeding",
            description:
              "Adapts to the amount of feed along the feed fence for a more equal distribution, maintaining feed quality, reducing energy costs and preventing wear and tear.",
          },
          {
            title: "Flexible options",
            description:
              "Can be equipped with a smart skirt lifter, electric bumper protection, LED light and barn door control box. The Flex package includes all options except the barn door control box.",
          },
        ],
      },
      {
        id: "calm",
        name: "Lely Calm",
        description:
          "Automatic calf feeder that helps dairy farmers achieve optimal growth and development from calf to cow through precise feeding, optimal hygiene and reduced labour. Delivers more flexibility in daily routine and supports better milk yields when calves mature into dairy cows.",
        usps: [
          {
            title: "Strong start",
            description:
              "Calves receive unlimited milk for the first 35 days of life, followed by a gradual reduction to promote roughage and concentrate intake, contributing to rumen health, cow vitality, fertility and milk yield.",
          },
          {
            title: "Optimal hygiene",
            description:
              "The HygieneBox delivers an automated two-step cleaning process: the teat is cleaned with fresh water after every feed, then the system interior is cleaned with water and detergents.",
          },
          {
            title: "Easy use",
            description:
              "Automates the daily routine of calf feeding and provides valuable insight through CalfApp and CalfCloud.",
          },
        ],
      },
    ],
  },
  {
    id: "manure",
    name: "Manure",
    description:
      "Our manure solutions maintain barn hygiene and create a comfortable environment contributing to optimal cow health. They also help create a pleasant working environment and reduce time-consuming, repetitive labour, allowing you to devote your time to cow care.",
    products: [
      {
        id: "discovery-collector",
        name: "Lely Discovery Collector",
        description:
          "Revolutionary manure robot that collects manure instead of scraping it, making manure build-up a thing of the past. Ensures less manure in cubicles, resulting in cleaner hooves, tails and udders, which can help reduce infections and optimise cow health. Compact and cable-free, it navigates autonomously to reach almost all areas of the barn.",
        usps: [
          {
            title: "Low hindrance",
            description:
              "Compactly designed with no cables or gutters required, providing easy navigation and a safer living environment for cows.",
          },
          {
            title: "Clean and safe",
            description:
              "Sprays water from the front for improved manure collection and from the back to wet the floor for additional grip, contributing to a clean and safe environment.",
          },
          {
            title: "Easy navigation",
            description:
              "Built-in sensors allow the Collector to navigate in tight spaces, small corners, under sorting gates, through cross alleys and in front of the automatic milking system.",
          },
          {
            title: "Flexible cleaning",
            description:
              "Routes and cleaning frequency can be set to match your or the cows' daily rhythm. Programme settings are easily adjusted via mobile phone.",
          },
        ],
      },
      {
        id: "discovery-scraper",
        name: "Lely Discovery Scraper",
        description:
          "The original manure robot with nearly 20 years of experience and continued development. A reliable cleaning companion that autonomously scrapes manure day and night, maintaining optimal barn hygiene while cows are undisturbed.",
        usps: [
          {
            title: "Time saver",
            description:
              "Takes the daily task of manure-scraping out of your hands. Smart design enables it to reach every corner of the barn for optimal barn hygiene.",
          },
          {
            title: "Optimal hygiene",
            description:
              "Keeps the barn clean and hygienic to help prevent hoof problems, keep tails and udders clean and allow cows to behave more naturally.",
          },
          {
            title: "Flexible cleaning",
            description:
              "Removes manure day and night without disturbing the cows. Route and schedule are fully controllable to fit your and the cows' daily rhythm.",
          },
          {
            title: "Smart design",
            description:
              "Uses sensors to autonomously follow pre-programmed routes. Compact size allows easy navigation below sorting gates, between cows and from one alley to another.",
          },
        ],
      },
      {
        id: "sphere",
        name: "Lely Sphere",
        description:
          "Circular manure handling system that separates mineral streams and creates value from emissions. Separates faeces and urine and converts nitrogen emissions into a valuable liquid fertiliser for precision fertilisation, improving mineral cycles and barn climate.",
        usps: [
          {
            title: "Optimal fertilisation",
            description:
              "Separates three mineral streams for precision fertilisation, allowing each type of fertiliser to be used exactly where and when it is needed for optimal soil and crop nutrition.",
          },
          {
            title: "Capture and convert",
            description:
              "Independent measurements show Lely Sphere can reduce ammonia emissions in the barn by up to 77% on average and provide up to 15 kg of nitrogen annually as circular, liquid fertiliser.",
          },
          {
            title: "Safer barn climate",
            description:
              "Reduces ammonia in the barn for a healthier, safer climate. Combined with the Discovery Collector cleaning the floor every two hours on average, it helps reduce hygiene-related hoof and udder health problems.",
          },
        ],
      },
    ],
  },
];
