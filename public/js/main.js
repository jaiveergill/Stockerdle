const stock_list = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "BRK.A", "FB", "NVDA", "UNH", "JNJ", "V", "WMT", "PG", "JPM", "XOM", "MA", "CVX", "HD", "BAC", "KO", "ABBV", "PFE", "LLY", "COST", "BABA", "AVGO", "PEP", "VZ", "TMO", "DIS", "CSCO", "MRK", "ABT", "NKE", "CMCSA", "ORCL", "ACN", "DHR", "ADBE", "INTC", "MCD", "WFC", "CRM", "TMUS", "BMY", "LIN", "UPS", "TXN", "PM", "MS", "UNP", "QCOM", "MDT", "RTX", "NEE", "T", "AMD", "AXP", "SCHW", "CVS", "AMGN", "LOW", "SPGI", "BX", "HON", "INTU", "PLD", "DE", "COP", "ANTM", "IBM", "CAT", "AMT", "LMT", "TGT", "GS", "BA", "ISRG", "C", "PYPL", "BLK", "MO", "AMAT", "SYK", "ABNB", "GE", "CHTR", "NOW", "EL", "NFLX", "ADP", "BKNG", "MDLZ", "SBUX", "MMC", "C", "DU", "CCI", ]
let turn = 1
let hardMode = false
let gameOver = false
const settingsForm = document.querySelector("#settingsForm")
settingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (e.target[0].checked) {
        hardMode = true
    } else {
        hardMode = false
    }
})
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
async function fetchStockData(ticker) {
    return await fetch(`/data?ticker=${ticker}`)
        .then(response => response.json())
        .then(data => {
            return data
        });

}

function stats() {
    const wins = document.querySelector("#wins")
    const losses = document.querySelector("#losses")
    let c = document.cookie.split("=")[1].replace("%2F", "/").split("/")
    wins.textContent = `Wins: ${c[0]}`
    losses.textContent = `Losses: ${c[1]-c[0]}`
}

stats()

function createRandStock() {
    const r_stock = stock_list[Math.floor(Math.random() * stock_list.length)]
    const res = fetchStockData(r_stock)
    return res
}


// console.log(r_stock_data)
// const r_stock_data = createRandStock()
// console.log(createRandStock())

function tickFormatter(value) {

    var suffix = ['K', 'M', 'B', 'T']

    if (value > (1000 * 1000 * 1000 * 1000)) {
        return (value / (1000 * 1000 * 1000 * 1000)).toFixed(2) + suffix[3]
    } else if (value > (1000 * 1000 * 1000)) {
        return (value / (1000 * 1000 * 1000)).toFixed(2) + suffix[2]
    } else if (value > (1000 * 1000)) {
        return (value / (1000 * 1000)).toFixed(2) + suffix[1]
    } else {
        return value.toFixed(2) + suffix[0]
    }
}

function assessGuess(stock) {
    const span_arr = []
    if (!hardMode) {
        let temp_stock_ticker = stock.ticker
        let temp_rstock_ticker = r_stock_data.ticker
        // console.log(temp_rstock_ticker, temp_stock_ticker)
        for (i = 0; i < stock.ticker.length; i++) {
            if (temp_stock_ticker[i] == temp_rstock_ticker[i]) {
                const span = document.createElement("span")
                span.classList.add("bg-success")
                span.classList.add("p-2")
                span.textContent = `${stock.ticker[i]}`
                span_arr.push(span)
                temp_stock_ticker = temp_stock_ticker.replaceAt(i, "1")
                temp_rstock_ticker = temp_rstock_ticker.replace(temp_rstock_ticker[i], "1")
            } else if (temp_rstock_ticker.includes(temp_stock_ticker[i])) {
                const span = document.createElement("span")
                span.classList.add("bg-warning")
                span.classList.add("p-2")
                span.textContent = `${stock.ticker[i]}`
                span_arr.push(span)
                temp_stock_ticker = temp_stock_ticker.replaceAt(i, "1")
                temp_rstock_ticker = temp_rstock_ticker.replace(temp_stock_ticker[i], "1")
            } else {
                const span = document.createElement("span")
                span.classList.add("bg-secondary")
                span.classList.add("p-2")
                span.textContent = `${stock.ticker[i]}`
                span_arr.push(span)
            }

            // console.log(temp_rstock_ticker, temp_stock_ticker)
        }
    }
    if (stock.exchange_short == r_stock_data.exchange_short) {
        const span = document.createElement("span")
        span.classList.add("bg-success")
        span.classList.add("p-2")
        span.classList.add("mx-1")
        span.textContent = `${stock.exchange_short}`
        span_arr.push(span)
    } else {
        const span = document.createElement("span")
        span.classList.add("bg-secondary")
        span.classList.add("p-2")
        span.classList.add("mx-1")
        span.textContent = `${stock.exchange_short}`
        span_arr.push(span)
    }

    let num = Math.max(stock.price, r_stock_data.price) / Math.min(stock.price, r_stock_data.price)
    if (num < 1.1) {
        const span = document.createElement("span")
        span.classList.add("bg-success")
        span.classList.add("p-2")
        span.classList.add("mx-1")
        span.textContent = `$${stock.price}`
        span_arr.push(span)
    } else if (num < 1.5) {
        const span = document.createElement("span")
        span.classList.add("bg-warning")
        span.classList.add("p-2")
        span.classList.add("mx-1")
        span.textContent = `$${stock.price}`
        span.textContent += (stock.price > r_stock_data.price) ? " ↓" : " ↑"
        span_arr.push(span)
    } else if (num < 2) {
        const span = document.createElement("span")
        span.classList.add("bg-info")
        span.classList.add("p-2")
        span.classList.add("mx-1")
        span.textContent = `$${stock.price}`
        span.textContent += (stock.price > r_stock_data.price) ? " ↓" : " ↑"
        span_arr.push(span)
    } else {
        const span = document.createElement("span")
        span.classList.add("bg-secondary")
        span.classList.add("p-2")
        span.classList.add("mx-1")
        span.textContent = `$${stock.price}`
        span.textContent += (stock.price > r_stock_data.price) ? " ↓" : " ↑"
        span_arr.push(span)
    }

    let num2 = Math.max(stock.market_cap, r_stock_data.market_cap) / Math.min(stock.market_cap, r_stock_data.market_cap)
    if (num2 < 1.1) {
        const span = document.createElement("span")
        span.classList.add("bg-success")
        span.classList.add("p-2")
        span.textContent = `$${tickFormatter(stock.market_cap)}`
        span_arr.push(span)
    } else if (num2 < 1.5) {
        const span = document.createElement("span")
        span.classList.add("bg-warning")
        span.classList.add("p-2")
        span.textContent = `$${tickFormatter(stock.market_cap)}`
        span.textContent += (stock.market_cap > r_stock_data.market_cap) ? " ↓" : " ↑"
        span_arr.push(span)
    } else if (num2 < 2) {
        const span = document.createElement("span")
        span.classList.add("bg-info")
        span.classList.add("p-2")
        span.textContent = `$${tickFormatter(stock.market_cap)}`
        span.textContent += (stock.market_cap > r_stock_data.market_cap) ? " ↓" : " ↑"
        span_arr.push(span)
    } else {
        const span = document.createElement("span")
        span.classList.add("bg-secondary")
        span.classList.add("p-2")
        span.textContent = `$${tickFormatter(stock.market_cap)}`
        span.textContent += (stock.market_cap > r_stock_data.market_cap) ? " ↓" : " ↑"
        span_arr.push(span)
    }

    return span_arr
}

const input = document.querySelector("#input")
const btn = document.querySelector("#btn")
const ul = document.querySelector("#ul")
let r_stock_data = null
btn.addEventListener("click", async () => {
    if (!gameOver) {
        const res = await fetchStockData(input.value)
        if (turn == 1) {
            r_stock_data = await createRandStock()
        }
        // console.log(r_stock_data)
        const new_li = document.createElement("li")
        const span_arr = assessGuess(res)
        for (span of span_arr) {
            new_li.appendChild(span)
        }

        new_li.classList.add("list-group-item")
        ul.append(new_li)
        if (input.value == r_stock_data.ticker.toLowerCase()) {
            let x = document.cookie
            x = x.split("=")
            let y = x[1].split("/")
            y[0]++
            y[1]++
            y = y.join().replace(",", "/")
            x[1] = y
            x = x.join().replace(",", "=")
            document.cookie = x
            gameOver = true
            win_li = document.createElement("li")
            win_li.classList.add("list-group-item")
            win_li.textContent = "You win"
            ul.append(win_li)
            stats()
        }
        turn++
        if (turn == 9) {
            let x = document.cookie
            x = x.split("=")
            let y = x[1].split("/")
            y[1]++
            y = y.join().replace(",", "/")
            x[1] = y
            x = x.join().replace(",", "=")
            document.cookie = x
            gameOver = true
            lose_li = document.createElement("li")
            lose_li.classList.add("list-group-item")
            lose_li.textContent = `You lose. The answer was ${r_stock_data.ticker}`
            ul.append(lose_li)
            stats()
        }
    }
})