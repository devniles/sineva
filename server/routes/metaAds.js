const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/ads/live', async (req, res) => {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    const pageId = process.env.META_PAGE_ID;

    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID in environment.'
      });
    }

    if (!pageId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing META_PAGE_ID in environment.'
      });
    }

    const payload = req.body || {};
    const persona = payload.persona || {};
    const creative = payload.creative || {
      headline: `For ${persona.productName || persona.name || 'customers'}`,
      body: persona.summary || 'Learn more'
    };

    const graphBase = `https://graph.facebook.com/v17.0`;
    const accountPath = `act_${adAccountId}`;

    const creativeParams = {
      name: `Creative for ${persona.productName || persona.name || 'persona'}`,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          message: creative.body,
          link: payload.link || process.env.META_DEFAULT_LINK || 'https://example.com',
          caption: creative.headline
        }
      },
      access_token: accessToken
    };

    const creativeResp = await axios
      .post(`${graphBase}/${accountPath}/adcreatives`, creativeParams)
      .catch(e => ({ error: e }));

    if (creativeResp.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create ad creative',
        details: creativeResp.error.toString(),
        response: creativeResp.error.response?.data || null
      });
    }

    const creativeId = creativeResp.data.id;

    const adsetId = payload.adsetId;
    if (!adsetId) {
      return res.json({
        status: 'ok',
        message: 'Creative created. Provide adsetId to create full ad.',
        creativeId,
        creativeResp: creativeResp.data
      });
    }

    const adParams = {
      name: `Ad for ${persona.productName || persona.name || 'persona'}`,
      adset_id: adsetId,
      creative: { creative_id: creativeId },
      status: 'PAUSED',
      access_token: accessToken
    };

    const adResp = await axios
      .post(`${graphBase}/${accountPath}/ads`, adParams)
      .catch(e => ({ error: e }));

    if (adResp.error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create ad',
        details: adResp.error.toString(),
        response: adResp.error.response?.data || null
      });
    }

    return res.json({
      status: 'ok',
      data: {
        creative: creativeResp.data,
        ad: adResp.data
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
