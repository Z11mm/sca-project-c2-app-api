
const Clarifai = require('clarifai');
const API_KEY = process.env.CLARIFAI_API;

const app = new Clarifai.App({
  apiKey: API_KEY
});

const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    // .predict("c0c0ac362b03416da06ab3fa36fb58e3", req.body.input)
    // .predict(
    //   {
    //     model_id: "a403429f2ddf4b49b307e318f00e528b",
    //     version_id: "34ce21a40cc24b6b96ffee54aabff139",
    //   },
    //   req.body.input
    // )
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    // .catch((err) => res.status(400).json("unable to handle api call"));
    .catch((err) => console.log(err));
};

const setImageEntries = dB => (req, res) => {
  const { id } = req.body;

  dB('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
  setImageEntries: setImageEntries,
  handleApiCall: handleApiCall
};
