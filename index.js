const http = require('http')
const fs = require('fs')
const requests = require('requests')
const homeFile = fs.readFileSync('home.html', 'utf-8')
const port=process.env.PORT || 3000

const replaceVal = (tempVal, ogVal) => { 
    let temperature = tempVal.replace('{%tempval%}', ogVal.main.temp)
    temperature = temperature.replace('{%tempmin%}', ogVal.main.temp_min)
    temperature = temperature.replace('{%tempmax%}', ogVal.main.temp_max)
    temperature = temperature.replace('{%location%}', ogVal.name)
    temperature = temperature.replace('{%country%}', ogVal.sys.country)
    temperature = temperature.replace('{%tempstatus%}', ogVal.weather[0].main)
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url === '/weather') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=6f9a77818e4226cd3462a1f050a73ee5')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk)
                const arrData = [objData]
                
                const realTimeData = arrData.map(val => replaceVal(homeFile, val))
                res.write(realTimeData.join(" "))
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
            });   
    }

})

server.listen(port,() => {
    console.log('server working');
})
