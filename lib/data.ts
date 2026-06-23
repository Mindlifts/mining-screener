export type Commodity = "Silver" | "Uranium" | "Copper" | "Gold";

export type CommodityPrice = {
  commodity: Commodity;
  price: string;
  unit: string;
  change: string;
  tone: "positive" | "negative";
};

export type Company = {
  company: string;
  ticker: string;
  commodity: Commodity;
  marketCap: string;
  evToEbitda: number;
  fcfYield: string;
  jurisdiction: string;
};

export const commodities: Commodity[] = ["Silver", "Uranium", "Copper", "Gold"];

export const commodityPrices: CommodityPrice[] = [
  {
    commodity: "Silver",
    price: "$29.42",
    unit: "USD/oz",
    change: "+1.8%",
    tone: "positive"
  },
  {
    commodity: "Uranium",
    price: "$86.25",
    unit: "USD/lb U3O8",
    change: "+0.6%",
    tone: "positive"
  },
  {
    commodity: "Copper",
    price: "$4.52",
    unit: "USD/lb",
    change: "-0.4%",
    tone: "negative"
  },
  {
    commodity: "Gold",
    price: "$2,345",
    unit: "USD/oz",
    change: "+0.9%",
    tone: "positive"
  }
];

export const companies: Company[] = [
  {
    company: "Pan American Silver",
    ticker: "PAAS",
    commodity: "Silver",
    marketCap: "$7.4B",
    evToEbitda: 7.8,
    fcfYield: "4.6%",
    jurisdiction: "Americas"
  },
  {
    company: "First Majestic Silver",
    ticker: "AG",
    commodity: "Silver",
    marketCap: "$1.6B",
    evToEbitda: 9.4,
    fcfYield: "1.8%",
    jurisdiction: "Mexico"
  },
  {
    company: "Cameco",
    ticker: "CCJ",
    commodity: "Uranium",
    marketCap: "$22.8B",
    evToEbitda: 18.6,
    fcfYield: "2.2%",
    jurisdiction: "Canada"
  },
  {
    company: "NexGen Energy",
    ticker: "NXE",
    commodity: "Uranium",
    marketCap: "$4.1B",
    evToEbitda: 0,
    fcfYield: "Pre-revenue",
    jurisdiction: "Canada"
  },
  {
    company: "Freeport-McMoRan",
    ticker: "FCX",
    commodity: "Copper",
    marketCap: "$70.2B",
    evToEbitda: 8.9,
    fcfYield: "3.7%",
    jurisdiction: "US / Indonesia"
  },
  {
    company: "Ivanhoe Mines",
    ticker: "IVN.TO",
    commodity: "Copper",
    marketCap: "$17.9B",
    evToEbitda: 11.2,
    fcfYield: "2.9%",
    jurisdiction: "DRC"
  },
  {
    company: "Newmont",
    ticker: "NEM",
    commodity: "Gold",
    marketCap: "$48.5B",
    evToEbitda: 7.1,
    fcfYield: "5.4%",
    jurisdiction: "Global"
  },
  {
    company: "Agnico Eagle",
    ticker: "AEM",
    commodity: "Gold",
    marketCap: "$34.7B",
    evToEbitda: 10.3,
    fcfYield: "3.9%",
    jurisdiction: "Canada / Finland"
  }
];
