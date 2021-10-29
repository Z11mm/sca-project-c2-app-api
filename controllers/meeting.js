// Route handler to get all meetings

const getAllMeetings = (dB) => async (req, res) => {
  try {
    const meetings = await dB("meetings");
    return res.status(200).json(meetings);
  } catch (err) {
    return res.status(404).json({ message: "Error getting meetings" });
  }
};


module.exports = {
  getAllMeetings: getAllMeetings,
};
