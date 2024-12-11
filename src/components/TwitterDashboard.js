import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import FileUpload from "./FileUpload";
import TweetDisplay from "./TweetDisplay";
import "./TwitterDashboard.css";

const TwitterDashboard = () => {
  const [data, setData] = useState(null);
  const [colorBy, setColorBy] = useState("sentiment");
  const [selectedTweets, setSelectedTweets] = useState([]);
  const svgRef = useRef();

  const sentimentColorScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    .range(["red", "#ECECEC", "green"]);

  const subjectivityColorScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range(["#ECECEC", "#4467C4"]);

  const handleFileUpload = (jsonData) => {
    setData(jsonData);
  };

  const handleColorByChange = (event) => {
    setColorBy(event.target.value);
    updateCircleColors();
  };

  const updateCircleColors = () => {
    if (!data) return;

    d3.select(svgRef.current)
      .selectAll("circle")
      .transition()
      .duration(500)
      .attr("fill", (d) => {
        const value = colorBy === "sentiment" ? d.Sentiment : d.Subjectivity;
        return colorBy === "sentiment"
          ? sentimentColorScale(value)
          : subjectivityColorScale(value);
      });
  };

  const createLegend = (svg, scale, title, x, y) => {
    const legendWidth = 200;
    const legendHeight = 20;
    const numStops = 10;

    const stops = d3.range(numStops).map((i) => i / (numStops - 1));
    const legendScale = d3.scaleLinear().domain([0, 1]).range([0, legendWidth]);

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${x},${y})`);

    legend
      .append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .text(title);

    const defs = legend.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", title.replace(/\s+/g, ""))
      .attr("x1", "0%")
      .attr("x2", "100%");

    stops.forEach((stop) => {
      const value = title === "Sentiment" ? stop * 2 - 1 : stop;
      gradient
        .append("stop")
        .attr("offset", `${stop * 100}%`)
        .attr(
          "stop-color",
          title === "Sentiment"
            ? sentimentColorScale(value)
            : subjectivityColorScale(value)
        );
    });

    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", `url(#${title.replace(/\s+/g, "")})`);

    const axis = d3
      .axisBottom(legendScale)
      .tickValues(title === "Sentiment" ? [-1, 0, 1] : [0, 0.5, 1])
      .tickFormat(d3.format(".1f"));

    legend
      .append("g")
      .attr("transform", `translate(0,${legendHeight})`)
      .call(axis);
  };

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const months = ["March", "April", "May"];
    const monthScale = d3
      .scaleBand()
      .domain(months)
      .range([50, height - 50])
      .padding(0.1);

    // Add month labels
    svg
      .selectAll(".month-label")
      .data(months)
      .join("text")
      .attr("class", "month-label")
      .attr("x", 50)
      .attr("y", (d) => monthScale(d))
      .attr("dy", "0.32em")
      .text((d) => d);

    // Create circles with fixed positions
    const circles = svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", 4)
      .attr("cx", (d) => 100 + Math.random() * (width - 200))
      .attr("cy", (d) => {
        const baseY = monthScale(d.Month);
        const bandHeight = monthScale.bandwidth();
        return baseY + bandHeight * 0.1 + Math.random() * (bandHeight * 0.8);
      })
      .attr("fill", (d) => {
        const value = colorBy === "sentiment" ? d.Sentiment : d.Subjectivity;
        return colorBy === "sentiment"
          ? sentimentColorScale(value)
          : subjectivityColorScale(value);
      })
      .attr("stroke", "none")
      .on("click", handleTweetClick);

    // Create legends
    createLegend(svg, sentimentColorScale, "Sentiment", width - 250, 20);
    createLegend(svg, subjectivityColorScale, "Subjectivity", width - 250, 80);
  }, [data, colorBy, sentimentColorScale, subjectivityColorScale]);

  const handleTweetClick = (event, d) => {
    const circle = d3.select(event.target);
    const isSelected = circle.attr("stroke") === "black";

    if (isSelected) {
      circle.attr("stroke", "none");
      setSelectedTweets((prev) => prev.filter((tweet) => tweet.Idx !== d.Idx));
    } else {
      circle.attr("stroke", "black");
      setSelectedTweets((prev) => [d, ...prev]);
    }
  };

  return (
    <div className="dashboard">
      <FileUpload onFileUpload={handleFileUpload} />
      <div className="controls">
        <select value={colorBy} onChange={handleColorByChange}>
          <option value="sentiment">Color by Sentiment</option>
          <option value="subjectivity">Color by Subjectivity</option>
        </select>
      </div>
      <svg ref={svgRef} width={800} height={600}></svg>
      <TweetDisplay selectedTweets={selectedTweets} />
    </div>
  );
};

export default TwitterDashboard;
