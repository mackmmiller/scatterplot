import * as d3 from "d3";
import './index.css';

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
	.then((response) => response.json())
	.then((data)=>{
		graph(data);
	})
	.catch((error)=>{
		console.log(error);
	});

function graph(data) {
	const dataset=data,
	w=1000,
	h=500,
	padding=60,
	parseTime = d3.timeParse("%M:%S");
	dataset.forEach((d)=>d.Time = parseTime(d.Time));

	const div = d3.select("main").append("div")
		.attr("class","tooltip")
		.style("opacity",0);

	const xScale = d3.scaleTime()
						.domain([d3.min(dataset,(d)=>d.Time),d3.max(dataset,(d)=>d.Time)])
						.range([padding,w-padding]);

	const yScale = d3.scaleLinear()
						.domain([1,35])
						.range([h-padding,padding]);

	const svg = d3.select("main")
					.append("svg")
					.attr("width", w)
					.attr("height", h)
					.style("background", "#f4efc2")

	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", (d,i) => xScale(d.Time))
		.attr("cy", (d,i) => yScale(d.Place))
		.attr("r", 5)
		.on("mouseover", (d)=>{
			let parseTime = d3.timeFormat("%M:%S")
			let allegations = d.Doping? d.Doping:"None"
			let info = "Name: " + d.Name + "<br/>" + "Time: " + parseTime(d.Time) + "<br/>" + "Place: " + d.Place + "<br/>" + "Doping Allegations: " + allegations;
			div.transition()
				.duration(200)
				.style("opacity",.9);
			div.html(info)
				.style("left",(d3.event.pageX)+"px")
				.style("top", (d3.event.pageY-28)+"px");
		})
		.on("mouseout", (d)=> {
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});

	const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%M:%S"));
	svg.append("g")
		.attr("transform", "translate(0,"+(h-padding)+")")
		.call(xAxis);
	svg.append("text")
		.attr("y", h-15)
		.attr("x", w/2)
		.style("text-anchor", "middle")
		.text("Final time");

	const yAxis = d3.axisLeft(yScale);
	svg.append("g")
		.attr("transform", "translate("+(padding)+",0)")
		.call(yAxis);
	svg.append("text")
		.attr("transform","rotate(-90)")
		.attr("y", padding/5)
		.attr("x", 0-(h/2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Place finished");

	svg.append("text")
		.attr("x", (w/2))
		.attr("y", padding/2)
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("text-decoration", "underline")
		.text("Doping in Professional Bicycle Racing");

	svg.append("text")
		.attr("x", (w/2))
		.attr("y", padding/2+20)
		.attr("text-anchor", "middle")
		.style("font-size", "18px")
		.text("35 fastest times up Alpe d'Huez");
}