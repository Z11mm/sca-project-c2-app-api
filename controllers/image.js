// Route handler to make api call to Clarifai api for face detection

const Clarifai = require('clarifai');
const API_KEY = process.env.CLARIFAI_API;

const app = new Clarifai.App({
  apiKey: API_KEY
});

const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    // .predict("c0c0ac362b03416da06ab3fa36fb58e3", req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to handle api call"));
};

module.exports = {
  handleApiCall: handleApiCall
};
