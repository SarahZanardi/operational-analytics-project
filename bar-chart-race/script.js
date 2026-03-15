const svg = d3.select("svg")
const margin = {top:40,right:150,bottom:40,left:200}
const width = +svg.attr("width") - margin.left - margin.right
const height = +svg.attr("height") - margin.top - margin.bottom

svg.attr("viewBox", `0 0 ${+svg.attr("width")} ${+svg.attr("height")}`)

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

const x = d3.scaleLinear().range([0,width])
const y = d3.scaleBand().range([0,height]).padding(0.15)

const colorScale = d3.scaleOrdinal()
    .domain(["Login Issue", "Payment Problem", "Bug Report", "Feature Request"])
    .range(["#5b6fee", "#1cd5b2", "#ff8a00", "#8e33ff"])

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("padding", "8px 10px")
    .style("background", "rgba(18, 25, 41, 0.92)")
    .style("color", "#ffffff")
    .style("font-size", "12px")
    .style("border-radius", "8px")
    .style("box-shadow", "0 12px 28px rgba(1, 7, 17, 0.25)")
    .style("opacity", 0)

chart.append("text")
    .attr("class", "frame-title")
    .attr("x", 0)
    .attr("y", -15)
    .attr("fill", "#333")
    .style("font-size", "16px")
    .text("Loading...")

function showMessage(msg){
    const el = d3.select("body").selectAll(".debug-msg").data([msg])
    el.enter().append("p").attr("class","debug-msg").style("color","red").merge(el).text(d=>d)
}

function formatValue(v){ return d3.format(",")(v) }

function update(date){
    const filtered = data
        .filter(d=>d.date === date)
        .sort((a,b)=>b.value-a.value)

    if (!filtered.length){
        showMessage(`Nenhum dado para ${date}`)
        return
    }

    showMessage(`Data carregada: ${date}`)

    x.domain([0, d3.max(filtered, d=>d.value) * 1.05])
    y.domain(filtered.map(d=>d.category))

    chart.selectAll(".frame-title").text(`Tickets por categoria - ${date}`)

    const bars = chart.selectAll(".bar")
        .data(filtered, d=>d.category)

    bars.exit().transition().duration(500).attr("width",0).remove()

    bars.enter().append("rect")
        .attr("class","bar")
        .attr("y", d=>y(d.category))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", 0)
        .attr("fill", d=>colorScale(d.category))
        .attr("rx", 10)
        .on("mousemove", (event, d)=>{
            tooltip.style("opacity", 1)
                .html(`<strong>${d.category}</strong><br/>${formatValue(d.value)} tickets`)
                .style("left", `${event.pageX + 12}px`)
                .style("top", `${event.pageY - 30}px`)
        })
        .on("mouseout", ()=> tooltip.style("opacity", 0))
      .merge(bars)
        .transition().duration(800)
        .attr("y", d=>y(d.category))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d=>x(d.value))
        .attr("fill", d=>colorScale(d.category))
        .attr("rx", 8)

    const labels = chart.selectAll(".label")
        .data(filtered, d=>d.category)

    labels.exit().remove()

    labels.enter().append("text")
        .attr("class","label")
        .attr("y", d=>y(d.category)+y.bandwidth()/2)
        .attr("x", 0)
        .attr("dy", ".35em")
        .style("font-weight","bold")
      .merge(labels)
        .transition().duration(800)
        .attr("y", d=>y(d.category)+y.bandwidth()/2)
        .attr("x", d=>x(d.value)+5)
        .text(d=>`${d.category}: ${formatValue(d.value)}`)
}

d3.csv("data.csv").then(loaded => {
    data = loaded.map(d => ({
        date: d.date,
        category: d.category,
        value: +d.value
    }))

    if (!data.length){
        showMessage("Erro: data.csv está vazio ou formato inválido")
        return
    }

    const dates = [...new Set(data.map(d=>d.date))].sort()
    let index = 0

    update(dates[index])

    setInterval(()=>{
        index = (index + 1) % dates.length
        update(dates[index])
    }, 1500)
}).catch(err => {
    showMessage(`Falha ao carregar data.csv: ${err}`)
    console.error(err)
})
