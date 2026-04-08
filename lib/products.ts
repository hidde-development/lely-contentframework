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
];
