const paper = document.getElementById("paper");
const pen = paper.getContext("2d");

let startTime = new Date().getTime();

let soundEnable = false;
document.onvisibilitychange = () => soundEnable = false;

paper.onclick = () => soundEnable = !soundEnable;

const arcs = [
    "#E6F2FF",
    "#D9E6FF",
    "#CCE0FF",
    "#B3D1FF",
    "#A6CBFF",
    "#99C5FF",
    "#8CBFFF",
    "#7FB8FF",
    "#72B2FF",
    "#66ACFF",
    "#59A6FF",
    "#4C9FFF",
    "#4099FF",
    "#3393FF",
    "#268DFF",
    "#1987FF",
    "#0C81FF",
    "#007BFF",
    "#006FFF",
    "#0064FF",
    "#0058FF"
].map((color, index) => {
    const audio = new Audio("./assets/1.mp3");

    audio.volume = 0.02;

    const oneFullLoop = 2 * Math.PI;
    const numberOfLoops = 50 - index;

    const velocity = oneFullLoop * numberOfLoops / 450;

    return {
        color,
        audio,
        velocity,
        nextImpactTime: calculateNextImpactTime(startTime, velocity)
    }
})

function calculateNextImpactTime(time, velocity) {
    return time + Math.PI / velocity * 1000;
}

function draw() {

    let currentTime = new Date().getTime();
    let elapsedTime = (currentTime - startTime) / 1000;

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const start = {
        x: paper.width * 0.1,
        y: paper.width * 0.9
    }

    const center = {
        x: paper.width * 0.5,
        y: paper.width * 0.9
    }

    const end = {
        x: paper.width * 0.9,
        y: paper.width * 0.9
    }

    const length = end.x - start.x;

    const initialArcRadius = length * 0.05

    const spacing = (length / 2 - initialArcRadius) / arcs.length;

    pen.strokeStyle = "grey";
    pen.lineWidth = 2;

    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();

    function drawBackgroundArc(radius, color) {
        pen.strokeStyle = color;
        pen.beginPath();
        pen.arc(center.x, center.y, radius, Math.PI, 0);
        pen.stroke();
    }

    function drawDot(arcRadius, fillColor, distance) {
        const maxAngle = 2 * Math.PI;
        const modDistance = distance % maxAngle
        const adjustedDistance = modDistance >= Math.PI ? modDistance : 2 * Math.PI - distance;
        const x = center.x + arcRadius * Math.cos(adjustedDistance);
        const y = center.y + arcRadius * Math.sin(adjustedDistance);


        pen.fillStyle = fillColor;
        pen.beginPath();
        pen.arc(x, y, length * 0.0065, 0, 2 * Math.PI);
        pen.fill();

    }

    arcs.forEach((arc, index) => {

        const distance = Math.PI + elapsedTime * arc.velocity;

        let radius = initialArcRadius + index * spacing;

        if(currentTime >= arc.nextImpactTime){
            if(soundEnable){
                arc.audio.play()
            }
            arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime,arc.velocity)
        }

        drawBackgroundArc(radius, arc.color);
        drawDot(radius, "white", distance);
    })


    requestAnimationFrame(draw)
}


draw();