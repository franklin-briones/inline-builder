import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import "./config/database.js"
import Settings from './models/Settings.js'
import https from 'https'
import fs from 'fs'
import axios from 'axios'
import 'dotenv/config'

const app = express()
app.use(express.json())

app.use(express.static('./public'))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.get('/pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pricing.html'))
})

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/checkout.html'))
})

app.use(express.urlencoded({ extended: true }))

app.post('/settings', async (req, res) => {
    const {
        productName,
        priceDescription,
        basePrice,
        basePriceName,
        interval,
        frequency,
        logo,
        primaryColour,
        secondaryColour,
        preCheckoutUrl
    } = req.body;

    const createProductRequest = {
        name: productName,
        tax_category: "standard"
    };

    try {
        // Create the product
        const productResponse = await axios.post('https://sandbox-api.paddle.com/products', createProductRequest, {
            headers: {
                'Authorization': `Bearer ${process.env.PADDLE_SANDBOX_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const productId = productResponse.data.data.id;
        console.log(productId);

        // Create the price
        const createPricesRequest = {
            description: priceDescription,
            product_id: productId,
            unit_price: {
                amount: basePrice,
                currency_code: "USD"
            },
            name: basePriceName,
            billing_cycle: {
                frequency: Number(frequency),
                interval: interval
            }
        };

        const priceResponse = await axios.post('https://sandbox-api.paddle.com/prices', createPricesRequest, {
            headers: {
                'Authorization': `Bearer ${process.env.PADDLE_SANDBOX_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const priceId = priceResponse.data.data.id;
        console.log(priceId);

        const newlyCreatedSettings = await Settings.create({
            productId: productId,
            priceId: priceId,
            priceDescription: priceDescription,
            basePrice: basePrice,
            basePriceName: basePriceName,
            interval: interval,
            frequency: frequency,
            logo: logo,
            primaryColour: primaryColour,
            secondaryColour: secondaryColour,
            preCheckoutUrl: preCheckoutUrl
        });

        console.log(`Newly Created Settings: ${newlyCreatedSettings}`);
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }

    https.get("https://api.apiflash.com/v1/urltoimage?" + new URLSearchParams({
        access_key: `${process.env.APIFLASH_API_KEY}`,
        url: `${preCheckoutUrl}`,
        quality: 100,
        width: 1512,
        full_page: true,
        scroll_page: true,
        no_cookie_banners: true,
        no_ads: true,
        no_tracking: true,
    }).toString(), (response) => {
        response.pipe(fs.createWriteStream('./public/images/screenshot.jpeg'));
    });
    setTimeout(() => {
        res.status(200).redirect('/pricing');
    }, 10000);
})

app.get('/get-settings', async (req, res) => {
    console.log("get-settings endpoint hit")
    const returnedResult = await Settings.find().sort({ _id: -1 }).limit(1)
    console.log(returnedResult[0])
    res.json(returnedResult[0])
})

app.post('/get-checkout-settings', async (req, res) => {
    console.log("get-checkout-settings hit")
    const id = req.body.id
    const returnedResult = await Settings.findById(id).exec();
    console.log('returned result for above', returnedResult)
    res.json(returnedResult)
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// app.listen('8000', (req, res) => {
//     console.log('Server is listening on port 8000')
// })

export default app