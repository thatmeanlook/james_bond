function jamesbond() {
    var filePath = "jamesbond.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question1 = function (filePath) {
    d3.csv(filePath).then(function (data) {

        // PROCESS DATA
        // convert string to float
        for (i = 0; i < data.length; i++) {
            data[i]['Kills_Bond'] = parseFloat(data[i]['Kills_Bond'])
            data[i]['Martinis'] = parseFloat(data[i]['Martinis'])
        }
        console.log(data[0])

        // set the dimensions and margins of the graph
        var margin = { top: 60, right: 30, bottom: 40, left: 50 },
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom,
            pad = 20;
        // Create svg container
        var svg = d3.select("#q1_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

        // Create X axis
        var x = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);
        svg.append("g")
            .attr("class", "x_Axis")   // class to call when transition later
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .attr("opacity", "0")
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 2 * pad)
            .style("text-anchor", "middle")
            .attr('font-family', 'sans-serif')
            .attr('font-size', '14px')
            .text("Martinis");

        // Create Y axis
        var y = d3.scaleLinear()
            .domain([0, 0])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "y_Axis")
            .call(d3.axisLeft(y))
            .attr("opacity", "0");
        svg.append("text")
            .attr("class", "y-axis-label")
            .style("text-anchor", "middle")
            .attr('font-family', 'sans-serif')
            .attr('color', 'black')
            .attr('font-size', '14px')
            .text("Kills by Bond")
            .attr("transform", `translate(${-30}, ${height / 2}) rotate(-90) `);

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Martinis); })
            .attr("cy", function (d) { return y(d.Kills_Bond); })
            .attr("r", 4)
            .style("fill", "#ee1300")
            .attr("opacity", "0.5")

        // new X axis
        x.domain([0, d3.max(data, d => d.Martinis) + 1])
        svg.select(".x_Axis")
            .transition()
            .duration(5000)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        // new Y axis
        y.domain([0, d3.max(data, d => d.Kills_Bond) + 5])
        svg.select(".y_Axis")
            .transition()
            .duration(5000)
            .attr("opacity", "1")
            .call(d3.axisLeft(y));

        // Update dots
        svg.selectAll("circle")
            .transition()
            .delay(function (d, i) { return (i * 3) })
            .duration(5000)
            .attr("cx", function (d) { return x(d.Martinis); })
            .attr("cy", function (d) { return y(d.Kills_Bond); })
            .attr("opacity", "1");


        // ADD TITLE
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Number of Kills vs. Number of Martinis Drank")
            .attr('font-family', 'sans-serif');


    })

}



var question2 = function (filePath) {
    d3.csv(filePath).then(function (data) {

        // PROCESS DATA
        // convert string to float
        for (i = 0; i < data.length; i++) {
            data[i]['Kills_Bond'] = parseFloat(data[i]['Kills_Bond'])
            data[i]['Martinis'] = parseFloat(data[i]['Martinis'])
            data[i]['Avg_User_IMDB'] = parseFloat(data[i]['Avg_User_IMDB'])
            data[i]['Avg_User_Rtn_Tom'] = parseFloat(data[i]['Avg_User_Rtn_Tom'])
            data[i]['Budget_Adj'] = parseFloat(data[i]['Budget_Adj'])
            data[i]['World_Adj'] = parseFloat(data[i]['World_Adj'])
        }

        // group data by Bond and get avarage of 2 columns: Avg_User_IMDB, Avg_User_Rtn_Tom
        var grouped_data = d3.flatRollup(data, (v) => [parseFloat((d3.sum(v, d => d.Avg_User_IMDB) / v.length).toFixed(2)),
        parseFloat((d3.sum(v, d => d.Avg_User_Rtn_Tom) / v.length).toFixed(2))], d => d.Bond);
        // console.log(grouped_data)

        var rating_data = d3.map(grouped_data, function (d) {
            return {
                'bond': d[0],
                'imdb': d[1][0],
                'tomato': d[1][1]
            }
        });
        console.log('rating data', rating_data)

        var curr_rate = 'imdb'

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 50, left: 60 },
            width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom,
            pad = 20;
        // Create svg container
        var svg = d3.select("#q2_plot")
            .append("svg")
            .attr("width", width - margin.right - margin.left)
            .attr("height", height - margin.top - margin.bottom)
            .attr("viewBox", [0, 0, width, height]);

        // X and Y scale
        var xScale = d3.scaleBand()
            .domain(rating_data.map(d => d.bond))
            .range([margin.left, width - margin.right])
            .padding(0.1);
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(rating_data, function (d) {
                return d[curr_rate];
            })])
            .range([height - margin.bottom, margin.top]);

        // X and Y axis
        var x_axis = d3.axisBottom(xScale)
        var y_axis = d3.axisLeft(yScale);
        svg.append("g")
            .attr('transform', `translate(${margin.left},0)`)
            .attr("class", "y_axis_2")
            .call(y_axis)
            .append("text")
            .attr("dx", "-.1em")
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(x_axis)
            .selectAll("text")
            .style("text-anchor", 'middle')
            .attr('font-size', '12px')

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height)
            .style("text-anchor", "middle")
            .attr('font-family', 'sans-serif')
            .attr('font-size', '16px')
            .text("Actor");

        svg.append("text")
            // .attr("class", "y-axis-label")
            .style("text-anchor", "middle")
            .attr('font-family', 'sans-serif')
            .attr('color', 'black')
            .attr('font-size', '16px')
            .text("Average Rating")
            .attr("transform", `translate(${30}, ${height / 2}) rotate(-90) `);

        // CREATE TOOLTIP
        var Tooltip = d3.select("#q1_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // CREATE RECTANGLES
        svg.append('g')
            .selectAll('rect')
            .data(rating_data)
            .enter()
            .append('rect')
            .attr('fill', '#69b3a2')
            .attr('x', (d, i) => xScale(d.bond))
            .attr('y', (d, i) => yScale(d[curr_rate]))
            .attr('height', d => yScale(0) - yScale(d[curr_rate]))
            .attr('width', xScale.bandwidth())

            .on("mouseover", function (e, d) {
                Tooltip.transition().duration(50).style("opacity", 0.9);
            })
            .on("mousemove", function (e, d) {
                Tooltip.style('display', 'inline-block')
                    .html(d[curr_rate])
                    .style('left', (e.pageX + 10) + 'px')
                    .style('top', (e.pageY - 10) + 'px')
                    .style('position', 'absolute');
            })
            .on("mouseout", function (e, d) {
                Tooltip.style("opacity", 0)
            });



        // MAGIC BUTTONS
        var radio = d3.select('#radio')
            .attr('name', 'value').on("change", function (d) {
                curr_rate = d.target.value; //getting the value of selected radio button
                yScale = d3.scaleLinear()
                    .domain([0, d3.max(rating_data, function (d) {
                        return d[curr_rate]
                    })])
                    .range([height - margin.bottom, margin.top]);
                y_axis = d3.axisLeft(yScale);
                d3.selectAll("g.y_axis_2")
                    .transition().duration(1000)
                    .call(y_axis)
                d3.selectAll("rect")
                    .data(rating_data)
                    .transition().duration(1000)
                    .attr('height', d => yScale(0) - yScale(d[curr_rate]))
                    .attr('y', (d, i) => yScale(d[curr_rate]))
            });

    });

}


var question3 = function (filePath) {

    d3.csv(filePath).then(function (data) {

        // PROCESS DATA
        // convert string to float
        for (i = 0; i < data.length; i++) {

            data[i]['Budget_Adj'] = parseFloat(data[i]['Budget_Adj'])
            data[i]['World_Adj'] = parseFloat(data[i]['World_Adj'])
        };
        console.log(data[0])

        // sort data by year
        data.sort(function (a, b) {
            return a.Year - b.Year;
        });
        console.log('sorted by year', data)

        // Create svg container
        var margin = { top: 50, right: 50, bottom: 40, left: 100 };
        var width = 1000 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;
        var pad = 20;
        var svg = d3.select("#q3_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var keys = ['Budget_Adj', 'World_Adj'];

        // compute stacked data
        var stackedData = d3.stack()
            .keys(keys)
            (data);

        console.log(stackedData);

        // create x and y scales
        var xScale = d3.scaleBand()
            .domain(data.map(d => d.Year))
            .range([0, width - pad])
            .padding(0.1);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
            .range([height - pad, pad]);

        // create color scale
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(['#fd5800', '#02ca83']);

        // create bars
        var barGroups = svg.selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .style("fill", d => color(d.key));

        barGroups.selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.data.Year))
            .attr("y", d => yScale(d[1]))
            .attr("height", d => yScale(d[0]) - yScale(d[1]))
            .attr("width", xScale.bandwidth() - 0.2 * pad)

        // add x-axis
        var xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", "translate(0," + (height - pad) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "10px")
        // .attr("transform", 'translate(-10,12)rotate(-45)');
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + pad)
            .style("text-anchor", "middle")
            .style('font-size', '16px')
            .text("Year");

        // add y-axis
        var yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .call(yAxis);
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("x", width / 1.3)
            .attr("y", pad / 5)
            .style("text-anchor", "middle")
            .text("USD (in thousands)")
            .attr("transform", "rotate(-90," + (width / 2) + "," + (height - 10) + ")");

        // Add the title
        svg.append("text")
            .attr("x", (width / 2 - 40))
            .attr("y", 0 - (margin.top / 2 - 30))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Budget and Revenue over the Year");

        // Add the legend
        var legendWidth = 150;
        var legendHeight = 50;
        var legendMargin = { top: 20, right: 20, bottom: 20, left: 20 };
        var legend = svg.append('g')
            .attr('transform', `translate(${width - legendWidth - legendMargin.right},${legendMargin.top})`);

        // Define the legend data
        var legendData = [
            { category: 'Revenue', color: '#02ca83' },
            { category: 'Budget', color: '#fd5800' },

        ];

        // Add a rectangle and text element for each category
        var legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(-10,${i * pad})`);

        legendItems.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => d.color);

        legendItems.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .text(d => d.category);

    });
}



var question4 = function (filePath) {

    d3.csv(filePath).then(function (data) {

        // PROCESS DATA
        // convert string to float
        var locations = []
        var loc = ''
        for (i = 0; i < data.length; i++) {
            data[i]['Kills_Bond'] = parseFloat(data[i]['Kills_Bond'])
            data[i]['Martinis'] = parseFloat(data[i]['Martinis'])
            data[i]['Avg_User_IMDB'] = parseFloat(data[i]['Avg_User_IMDB'])
            data[i]['Avg_User_Rtn_Tom'] = parseFloat(data[i]['Avg_User_Rtn_Tom'])
            data[i]['Budget_Adj'] = parseFloat(data[i]['Budget_Adj'])
            data[i]['World_Adj'] = parseFloat(data[i]['World_Adj'])
            data[i]['BJB'] = parseFloat(data[i]['BJB'])
            data[i]['Depicted_Film_Loc'] = data[i]['Depicted_Film_Loc'].split(',')
            for (j = 0; j < data[i]['Depicted_Film_Loc'].length; j++) {
                loc = data[i]['Depicted_Film_Loc'][j].trim()
                if (loc == 'Great Britain' || loc == 'United Kingdom') {
                    loc = 'England'
                }
                if (loc == 'United States') {
                    loc = 'USA'
                }


                locations.push(loc)
            }

        }

        console.log('Locations', locations)


        // COUNTS MAP 
        var counts = new Map();
        for (var element of locations) {
            if (counts.has(element)) {
                counts.set(element, counts.get(element) + 1);
            } else {
                counts.set(element, 1);
            }
        }
        // COUNTS OBJECT
        console.log('counts', counts);
        const countsObject = Object.fromEntries(counts);
        console.log(countsObject);
        // COUNTS ARRAY
        var country_data = d3.map(counts, function (d) {
            return {
                'country': d[0],
                'count': d[1],
            }
        });
        // sort by count
        country_data.sort(function (a, b) {
            return d3.descending(a.count, b.count);
        });
        console.log('country_data sorted', country_data)

        var margin = { top: 40, right: 30, bottom: 40, left: 30 };
        var width = 1000 - margin.left - margin.right;
        var height = 620 - margin.top - margin.bottom;
        var pad = 20;

        // Create svg container
        var svg = d3.select("#q4_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (margin.left - 50) + "," + margin.top + ")");


        const colorScale = d3.scaleThreshold()
            .domain([1, 5, 10, 15, 20])
            .range(['#414141', '#31639c', '#55b079', '#ffbf40', '#d7231a']);

        //Create projection and pathgeo variables for the world map
        const projection = d3.geoMercator()
            .translate([width / 2, height / 1.5])
            .scale(width * 0.12, height * 0.12)
        // .attr('transform', 'translate(-10,0)');

        const path = d3.geoPath().projection(projection);


        // CREATE TOOLTIP
        var Tooltip = d3.select("#q1_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // set up mouse events for hover functionality
        let mouseOver = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .4);
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black");
            Tooltip.transition().duration(50).style("opacity", 0.9);

        }

        let mousemove = function (e, d) {
            Tooltip.style('display', 'inline-block')
                .html(d.properties.name + ': ' + (counts.get(d.properties.name) || 0))
                .style('left', (e.pageX + 10) + 'px')
                .style('top', (e.pageY - 10) + 'px')
                .style('position', 'absolute');
        }

        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .8)
                .style("stroke", "transparent");
            d3.selectAll(".tooltip").style("opacity", 0);
        }



        //Load JSON file and create the map
        const world_map = d3.json("world.json");
        world_map.then(function (map) {
            svg.selectAll("path")
                .data(map.features).enter()
                .append("path").attr("d", path)
                // set the color of each country
                .attr("fill", function (d) {
                    d.total = counts.get(d.properties.name) || 0;
                    // console.log('this is d', d)
                    return colorScale(d.total);
                })
                // this part is for the hover functionality
                .style("stroke", "transparent")
                .attr("class", function (d) { return "Country" })
                .style("opacity", .8)
                .on("mouseover", mouseOver)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseLeave)

            // ADD TITLE
            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .text("Location distribution of James Bond movies")
                .attr('font-family', 'sans-serif');

        });


        // Add the legend
        var legendWidth = 150;
        var legendHeight = 50;
        var legendMargin = { top: 20, right: 20, bottom: 20, left: 20 };
        var legend = svg.append('g')
            .attr('transform', `translate(${width - legendWidth - legendMargin.right},${legendMargin.top})`);

        // Define the legend data
        var legendData = [
            { category: '0', color: '#414141' },
            { category: '1-5', color: '#31639c' },
            { category: '6-9', color: '#55b079' },
            { category: '10-14', color: '#ffbf40' },
            { category: '15+', color: '#d7231a' }

        ];

        // Add a rectangle and text element for each category
        var legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(-${width / 1.5},${i * pad})`);

        legendItems.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => d.color)
            .attr("transform", `translate(${-30}, ${height / 1.5}) `);


        legendItems.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .text(d => d.category)
            .attr("transform", `translate(${-30}, ${height / 1.5}) `);

        // Add ledgend title
        svg.append("text")
            .attr("x", (155))
            .attr("y", height / 2 + 100)
            .attr("text-anchor", "middle")
            .attr('font-style', 'bold')
            .style("font-size", "15px")
            .text("Appearances")
            .attr('font-family', 'sans-serif');




    }
    )
}

var question5 = function (filePath) {
    d3.csv(filePath).then(function (data) {

        for (i = 0; i < data.length; i++) {
            data[i]['Martinis'] = parseFloat(data[i]['Martinis'])
            data[i]['BJB'] = parseFloat(data[i]['BJB'])
            data[i]['Film_Length'] = parseFloat(data[i]['Film_Length'])
        }
        // use rollup to compute quartiles, median, inter quantile range min and max of Film_Length
        var grouped_data = d3.flatRollup(data,
            v => [d3.quantile(v, .25, d => d.Film_Length),
            d3.quantile(v, .5, d => d.Film_Length),
            d3.quantile(v, .75, d => d.Film_Length),
            d3.min(v, d => d.Film_Length),
            d3.max(v, d => d.Film_Length)], d => d.Bond);

        // console.log('this is grouped_data', grouped_data)

        // turn the grouped_data into an object and name the elements
        var film_data = d3.map(grouped_data, function (d) {
            return {
                'bond': d[0],
                'q1': d[1][0],
                'median': d[1][1],
                'q3': d[1][2],
                'min': d[1][3],
                'max': d[1][4]
            }
        });
        console.log('this is film_data', film_data)

        var margin = { top: 60, right: 30, bottom: 50, left: 60 };
        var width = 800 - margin.left - margin.right;
        var height = 520 - margin.top - margin.bottom;
        var pad = 20;

        // Create svg container
        var svg = d3.select("#q5_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


        // X scale and axis:
        var xScale = d3.scaleBand()
            .domain(grouped_data.map(function (d) { return d[0]; }))
            .range([0, width])
            .paddingInner(1)
            .paddingOuter(.5)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", 'middle')
            .attr('font-size', '11px')


        // Y scale and axis:
        var yScale = d3.scaleLinear()
            .domain([90, d3.max(film_data, d => d['max']) + 5])
            .range([height, 0])
        svg.append("g")
            .call(d3.axisLeft(yScale))

        // Show the main vertical line
        svg
            .selectAll("vertLines")
            .data(film_data)
            .enter()
            .append("line")
            .attr("x1", function (d) { return (xScale(d.bond)) })
            .attr("x2", function (d) { return (xScale(d.bond)) })
            .attr("y1", function (d) { return (yScale(d.min)) })
            .attr("y2", function (d) { return (yScale(d.max)) })
            .attr("stroke", "black")
            .style("width", 40)

        // rectangle for the main box
        var boxWidth = 100
        svg
            .selectAll("boxes")
            .data(film_data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return (xScale(d.bond) - boxWidth / 2) })
            .attr("y", function (d) { return (yScale(d.q3)) })
            .attr("height", function (d) { return (yScale(d.q1) - yScale(d.q3)) })
            .attr("width", boxWidth)
            .attr("stroke", "black")
            .style("fill", "#69b3a2")


        // Show the median
        svg
            .selectAll("medianLines")
            .data(film_data)
            .enter()
            .append("line")
            .attr("x1", function (d) { return (xScale(d.bond) - boxWidth / 2) })
            .attr("x2", function (d) { return (xScale(d.bond) + boxWidth / 2) })
            .attr("y1", function (d) { return (yScale(d.median)) })
            .attr("y2", function (d) { return (yScale(d.median)) })
            .attr("stroke", "black")
            .style("width", 80)


        // Color scale
        var dotColors = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([90, 150])


        // create a tooltip
        var tooltip = d3.select("#q5_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            // .style("border-color", "red")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Mouse fuctions
        var mouseover = function (e, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", .9)
            tooltip
                .html("<span>\"</span>" + d.Movie + "<span>\"</span>" + ' - ' + d.Film_Length + ' minutes')
                .style("left", (e.pageX + 10) + 'px')
                .style("top", (e.pageY - 10) + 'px')
        }
        var mousemove = function (e, d) {
            tooltip
                .style("left", (e.pageX + 10) + 'px')
                .style("top", (e.pageY - 10) + 'px')
                .style('position', 'absolute')
        }
        var mouseleave = function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        // Add individual points
        var dots_space = 50
        svg
            .selectAll("indPoints")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return (xScale(d.Bond) + (xScale.bandwidth() / 2) - dots_space / 2 + Math.random() * dots_space) })
            .attr("cy", function (d) { return yScale(d.Film_Length) })
            .attr("r", 4)
            .style("fill", function (d) { return (dotColors(+d.Film_Length)) })
            .attr("stroke", "black")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // axis titles
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 2 * pad)
            .style("text-anchor", "middle")
            .attr('font-family', 'sans-serif')
            .style('font-size', '16px')
            .text("Actor");

        svg.append("text")
            .attr("class", "y-axis-label")
            .style("text-anchor", "middle")
            .attr('font-family', 'sans-serif')
            .attr('color', 'black')
            .attr('font-size', '16px')
            .text("Movie length (minutes)")
            .attr("transform", `translate(${-40}, ${height / 2}) rotate(-90) `);

        // ADD TITLE
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Length of movies by each Bond actor")
            .attr('font-family', 'sans-serif');

    })
}
