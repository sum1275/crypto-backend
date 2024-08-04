const axios = require("axios");
const Stock = require("../models/stock");
const fetch = require("node-fetch");
// Function to fetch data from the API and save it to MongoDB

exports.fetchDataAndSave = async (req, res) => {
  const ids = ["bitcoin", "ethereum", "tether", "binancecoin", "solana"];
  const apiUrl = "https://api.coingecko.com/api/v3/coins/";
  const apiParams =
    "market_chart?vs_currency=usd&days=20&interval=daily&precision=4";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": `${process.env.API_URL}`,
    },
  };

  try {
    for (const id of ids) {
      const response = await fetch(`${apiUrl}${id}/${apiParams}`, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedPrices = data.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return [date.toISOString(), price];
      });
      // Only store prices data
      const stockData = {
        id: id,
        prices: formattedPrices,
      };

      const existingStock = await Stock.findOne({ id: stockData.id });
      // console.log("existingStock", existingStock);
      if (existingStock) {
        existingStock.prices = stockData.prices;
        await existingStock.save();
      } else {
      
        const newStock = new Stock(stockData);
        await newStock.save();
      }
    }

    res.status(200).json({
      status: 0,
      message: "Data Saved successfully",
    });
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": `${process.env.API_URL}`,
      },
    };

    // Fetch data from the API
    const response = await fetch(url, options);
    console.log("response", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Define symbols to filter
    const symbols = ["btc", "eth", "usdt", "bnb", "sol"];

    // Filter the data based on the symbols
    const filteredData = data.filter((item) => symbols.includes(item.symbol));

    // Log the filtered data
    console.log("filteredData:", filteredData);

    // Send the filtered data as a response
    res.status(200).json({
      status: 0,
      message: "Data fetched successfully",
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      status: 1,
      message: "Error fetching data",
      error: error.message,
    });
  }
};
// Function to get the most recent 20 entries for a given symbol
exports.getStockData = async (req, res) => {
  // Extract the 'id' parameter from the URL path

  const { id } = req.params;

  // Validate the 'id'
  if (!id) {
    return res.status(400).json({
      status: 1,
      message: "Stock ID is required",
    });
  }

  try {
    // Fetch the stock data from the database
    const existingStock = await Stock.findOne({ id: id });

    // Check if stock data is found
    if (!existingStock) {
      return res.status(404).json({
        status: 1,
        message: "Stock not found",
      });
    }

    // Send successful response with stock prices
    res.status(200).json({
      status: 0,
      message: "Data fetched successfully",
      prices: existingStock.prices,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error); // Log the error for debugging
    res.status(500).json({
      status: 1,
      message: "Internal server error. Please try again later.",
    });
  }
};
