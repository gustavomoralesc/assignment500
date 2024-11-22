import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "Apple",
      selectedMonth: "November",
    };
  }

  componentDidMount() {
      this.renderChart(this.props.csv_data);
  }

  componentDidUpdate() {
    this.renderChart(this.props.csv_data);
  }

  renderChart = (csv_data) => {
    const { company, selectedMonth } = this.state;

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const filteredData = csv_data.filter((d) => {
      const date = new Date(d.Date);
      return d.Company === company && months[date.getMonth()] === selectedMonth;
    });

    const data = filteredData.map((d) => ({
      date: new Date(d.Date),
      open: parseFloat(d.Open),
      close: parseFloat(d.Close),
    }));

    const margin = { top: 20, right: 80, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#chart").selectAll("*").remove();

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.open, d.close)),
        d3.max(data, (d) => Math.max(d.open, d.close)),
      ])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b")))
      .selectAll("text")
      .attr("transform", "rotate(45)") 
      .style("text-anchor", "start")
      .style("font-size", "12px");

    svg.append("g").call(d3.axisLeft(yScale));

    const lineOpen = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.open))
      .curve(d3.curveCardinal);

    const lineClose = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.close))
      .curve(d3.curveCardinal);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2)
      .attr("d", lineOpen);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2)
      .attr("d", lineClose);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.open))
      .attr("r", 4)
      .attr("fill", "#b2df8a")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `Date: ${d.date.toLocaleDateString("en-US")}<br>
            Open: ${d.open.toFixed(2)}<br>
            Close: ${d.close.toFixed(2)}<br>
            Difference: ${(d.close - d.open).toFixed(2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 40}px`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 40}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    svg
      .selectAll(".dot-close")
      .data(data)
      .join("circle")
      .attr("class", "dot-close")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.close))
      .attr("r", 4)
      .attr("fill", "#e41a1c")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `Date: ${d.date.toLocaleDateString("en-US")}<br>
            Open: ${d.open.toFixed(2)}<br>
            Close: ${d.close.toFixed(2)}<br>
            Difference: ${(d.close - d.open).toFixed(2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 40}px`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 40}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20},${margin.top})`);

    legend
      .selectAll("rect")
      .data([
        { label: "Open", color: "#b2df8a" },
        { label: "Close", color: "#e41a1c" },
      ])
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => d.color);

    legend
      .selectAll("text")
      .data([
        { label: "Open", color: "#b2df8a" },
        { label: "Close", color: "#e41a1c" },
      ])
      .join("text")
      .attr("x", 15)
      .attr("y", (d, i) => i * 20 + 9)
      .text((d) => d.label)
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  };

  render() {
    return (
      <div className="child1">
        <div className="controls">
          <div className="company-selector">
            <p>Company:</p>
            {["Apple", "Microsoft", "Amazon", "Google", "Meta"].map((company) => (
              <label key={company}>
                <input
                  type="radio"
                  value={company}
                  checked={this.state.company === company}
                  onChange={(e) => this.setState({ company: e.target.value })}
                />
                {company}
              </label>
            ))}
          </div>
          <div className="month-selector">
            <label>Month:</label>
            <select
              value={this.state.selectedMonth}
              onChange={(e) =>
                this.setState({ selectedMonth: e.target.value })
              }
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="chart"></div>
      </div>
    );
  }
}

export default Child1;
