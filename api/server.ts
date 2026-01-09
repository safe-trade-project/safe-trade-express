import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
const port = 8080;

app.use(cors());

app.get("/", (_: Request, res: Response) => {
	res.send("Hello World!");
});

app.get("/crypto-all", async (_: Request, res: Response) => {
	let resp = await fetchCoins();
	console.log(resp);
	res.send(resp);
});

app.get("/crypto/:id", (req: Request, res: Response) => {
	let resp = fetchCoin(req.params.id);
	res.send(resp);
});

app.get("/crypto/:id/market-chart", async (req: Request, res: Response) => {
	let resp = fetchMarketChart(req.params.id);
	res.send(resp);
});


const API_KEY = process.env.COINGECKO_API_KEY || "";
const top50CoinGeckoIds = [
	"bitcoin",
	"ethereum",
	"tether",
	"binancecoin",
	"solana",
	"usd-coin",
	"xrp",
	"dogecoin",
	"toncoin",
	"cardano",
	"tron",
	"wrapped-bitcoin",
	"avalanche-2",
	"shiba-inu",
	"polkadot",
	"chainlink",
	"bitcoin-cash",
	"near",
	"uniswap",
	"litecoin",
	"polygon",
	"internet-computer",
	"pepe",
	"leo-token",
	"dai",
	"ethereum-classic",
	"aptos",
	"render",
	"filecoin",
	"hedera-hashgraph",
	"stacks",
	"cronos",
	"stellar",
	"okb",
	"arbitrum",
	"arweave",
	"first-digital-usd",
	"floki",
	"mantle",
	"immutable-x",
	"optimism",
	"injective-protocol",
	"lido-dao",
	"vechain",
	"kaspa",
	"maker",
	"cosmos",
	"theta-token",
	"celestia",
	"thorchain",
];
const fetchCoins = async () => {
	const supported_cryptos = top50CoinGeckoIds.join(",");
	try {
		const response = await fetch(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${supported_cryptos}&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
				},
			},
		);

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		console.log("Error fetching coins");
		return [];
	}
};

const fetchCoin = async (id: string | undefined) => {
	try {
		if (!id) {
			throw new Error("Id is required");
		}
		const response = await fetch(
			`https://api.coingecko.com/api/v3/coins/${id}`,
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
				},
			},
		);

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		console.log("Error fetching coin with id:", id);
		throw error;
	}
};




const fetchMarketChart = async (id: string | undefined) => {
	try {
		if (!id) {
			throw new Error("Id is required");
		}
		const response = await fetch(
			`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365`,
			{
				headers: {
					"x-cg-demo-api-key": API_KEY ?? "",
				},
			},
		);

		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};


app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export default app;
