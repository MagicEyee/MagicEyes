import React, { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalReturned: 0,
    totalNetSales: 0,
    lastMonthOrders: 0,
    lastMonthReturned: 0,
    lastMonthNetSales: 0,
    comparison: 0,
    mostOrderedProduct: "",
    leastOrderedProduct: "",
    mostReturnedProduct: "",
    leastReturnedProduct: "",
    categories: [],
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await axios.get("http://localhost:3001/analytics");
        setAnalytics(response.data);
      } catch (error) {
        console.error("There was an error fetching the analytics data!", error);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div>
      <h2>Website Analytics</h2>
      <div>Total Orders: {analytics.totalOrders}</div>
      <div>Total Returned: {analytics.totalReturned}</div>
      <div>Total Net Sales: {analytics.totalNetSales}</div>
      <div>Orders Last Month: {analytics.lastMonthOrders}</div>
      <div>Returned Last Month: {analytics.lastMonthReturned}</div>
      <div>Net Sales Last Month: {analytics.lastMonthNetSales}</div>
      <div>Comparison with Previous Month: {analytics.comparison}%</div>
      <div>Most Ordered Product: {analytics.mostOrderedProduct}</div>
      <div>Least Ordered Product: {analytics.leastOrderedProduct}</div>
      <div>Most Returned Product: {analytics.mostReturnedProduct}</div>
      <div>Least Returned Product: {analytics.leastReturnedProduct}</div>
      <h3>Categories</h3>
      {analytics.categories.map((category, index) => (
        <div key={index}>
          <div>Category: {category.name}</div>
          <div>Ordered: {category.ordered}</div>
          <div>Returned: {category.returned}</div>
        </div>
      ))}
    </div>
  );
}

export default Analytics;
