import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  try {
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    
    const url = `https://52.90.70.149:3000${req.url.replace(/^\/api\/proxy/, '')}`;
    
    const response = await instance({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
}